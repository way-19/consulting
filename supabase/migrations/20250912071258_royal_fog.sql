/*
  # Document Upload Trigger for Consultant Notifications

  1. New Function
    - `handle_document_upload()` - Processes new document uploads
    - Creates tasks for consultants when financial documents are uploaded
    - Sends notifications and creates consultant alerts

  2. New Trigger
    - `trg_handle_document_upload` - Fires after INSERT on documents table
    - Only processes financial documents uploaded by clients

  3. Security
    - Uses SECURITY DEFINER for proper permissions
    - Includes error handling and audit logging
*/

-- Function to handle document uploads and create consultant tasks/alerts
CREATE OR REPLACE FUNCTION public.handle_document_upload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  client_record RECORD;
  consultant_id uuid;
  task_id uuid;
  notification_payload jsonb;
BEGIN
  -- Only process financial documents uploaded by clients
  IF NEW.type != 'financial' OR NEW.consultant_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Get client and consultant information
  SELECT 
    c.id as client_id,
    c.assigned_consultant_id,
    up.full_name as client_name,
    up.email as client_email,
    c.company_name
  INTO client_record
  FROM clients c
  JOIN user_profiles up ON c.profile_id = up.id
  WHERE c.id = NEW.client_id;

  -- Skip if no consultant assigned
  IF client_record.assigned_consultant_id IS NULL THEN
    RETURN NEW;
  END IF;

  consultant_id := client_record.assigned_consultant_id;

  -- Create task for consultant
  INSERT INTO tasks (
    client_id,
    consultant_id,
    title,
    description,
    status,
    priority,
    estimated_hours,
    actual_hours,
    billable,
    is_client_visible,
    created_at,
    updated_at
  ) VALUES (
    NEW.client_id,
    consultant_id,
    'Review Accounting Document: ' || NEW.name,
    'New financial document uploaded by ' || client_record.client_name || '. Please review and process the document: ' || NEW.name,
    'todo',
    'high',
    0.5,
    0,
    true,
    false,
    NOW(),
    NOW()
  ) RETURNING id INTO task_id;

  -- Prepare notification payload
  notification_payload := jsonb_build_object(
    'document_id', NEW.id,
    'document_name', NEW.name,
    'document_type', NEW.type,
    'client_id', NEW.client_id,
    'client_name', client_record.client_name,
    'company_name', client_record.company_name,
    'task_id', task_id,
    'uploaded_at', NEW.uploaded_at
  );

  -- Insert notification for consultant
  INSERT INTO notifications (
    recipient_profile_id,
    type,
    payload,
    created_at
  ) VALUES (
    consultant_id,
    'document_uploaded',
    notification_payload,
    NOW()
  );

  -- Create consultant alert (this will appear in dashboard alerts)
  INSERT INTO consultant_alerts (
    consultant_id,
    alert_source_id,
    alert_type,
    is_resolved,
    created_at
  ) VALUES (
    consultant_id,
    NEW.client_id, -- Use client_id as source for grouping
    'document_uploaded',
    false,
    NOW()
  ) ON CONFLICT (consultant_id, alert_source_id, alert_type) 
  DO UPDATE SET 
    is_resolved = false,
    resolved_at = NULL,
    created_at = NOW();

  -- Create audit log
  INSERT INTO audit_logs (
    user_id,
    action_type,
    description,
    payload
  ) VALUES (
    client_record.client_id,
    'document_uploaded',
    'Financial document uploaded: ' || NEW.name,
    jsonb_build_object(
      'document_id', NEW.id,
      'document_name', NEW.name,
      'document_type', NEW.type,
      'consultant_id', consultant_id,
      'task_created', task_id
    )
  );

  RETURN NEW;

EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the document upload
    INSERT INTO audit_logs (
      user_id,
      action_type,
      description,
      payload
    ) VALUES (
      COALESCE(NEW.client_id::text, 'system'),
      'document_upload_trigger_error',
      'Error in document upload trigger: ' || SQLERRM,
      jsonb_build_object(
        'document_id', NEW.id,
        'error_message', SQLERRM,
        'error_state', SQLSTATE
      )
    );
    
    RETURN NEW;
END;
$$;

-- Create the trigger on documents table
CREATE TRIGGER trg_handle_document_upload
  AFTER INSERT ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION handle_document_upload();