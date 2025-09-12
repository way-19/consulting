/*
  # Restore Document Upload Features

  1. Enhanced Document Upload Trigger
    - Fix user_id type casting issue
    - Add automatic task creation when document is uploaded
    - Add consultant alert creation for document notifications

  2. Task Creation
    - Create task for consultant to review uploaded document
    - Set appropriate priority and visibility

  3. Consultant Alerts
    - Create alert for consultant when document is uploaded
    - Enable proper notification system
*/

-- First, let's fix the handle_document_upload function
CREATE OR REPLACE FUNCTION handle_document_upload()
RETURNS TRIGGER AS $$
DECLARE
    client_profile_id uuid;
    consultant_name text;
    client_name text;
BEGIN
    -- Get client profile ID and consultant info
    SELECT 
        c.profile_id,
        up_consultant.full_name,
        up_client.full_name
    INTO 
        client_profile_id,
        consultant_name,
        client_name
    FROM clients c
    LEFT JOIN user_profiles up_consultant ON up_consultant.id = c.assigned_consultant_id
    LEFT JOIN user_profiles up_client ON up_client.id = c.profile_id
    WHERE c.id = NEW.client_id;

    -- Create audit log with proper UUID casting
    INSERT INTO audit_logs (
        user_id,
        action_type,
        description,
        payload
    ) VALUES (
        client_profile_id::uuid,  -- Explicit UUID cast
        'document_uploaded',
        'Document uploaded: ' || NEW.name,
        jsonb_build_object(
            'document_id', NEW.id,
            'document_name', NEW.name,
            'document_type', NEW.type,
            'client_id', NEW.client_id,
            'consultant_id', NEW.consultant_id
        )
    );

    -- Create task for consultant to review document (only if consultant is assigned)
    IF NEW.consultant_id IS NOT NULL THEN
        INSERT INTO tasks (
            client_id,
            consultant_id,
            title,
            description,
            status,
            priority,
            is_client_visible,
            estimated_hours,
            billable
        ) VALUES (
            NEW.client_id,
            NEW.consultant_id,
            'Review uploaded document: ' || NEW.name,
            'Client ' || COALESCE(client_name, 'Unknown') || ' uploaded a new document that requires review.',
            'todo',
            'high',
            TRUE,
            0.5,
            FALSE
        );

        -- Create consultant alert for document upload
        INSERT INTO consultant_alerts (
            consultant_id,
            alert_source_id,
            alert_type,
            is_resolved
        ) VALUES (
            NEW.consultant_id,
            NEW.client_id,  -- Use client_id as source for easier resolution
            'document_uploaded',
            FALSE
        );

        -- Create notification for consultant
        INSERT INTO notifications (
            recipient_profile_id,
            type,
            payload
        ) VALUES (
            NEW.consultant_id,
            'document_uploaded',
            jsonb_build_object(
                'document_name', NEW.name,
                'client_name', client_name,
                'document_id', NEW.id,
                'client_id', NEW.client_id
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;