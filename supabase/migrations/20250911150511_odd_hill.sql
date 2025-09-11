/*
  # Overdue Alerts System

  1. Database Functions
    - `check_overdue_payments()` - Checks for overdue invoices and creates alerts
    - `check_overdue_documents()` - Checks for overdue expected documents and creates alerts
    - `process_overdue_alerts()` - Main function that runs both checks

  2. Scheduled Jobs
    - Daily cron job to check for overdue items
    - Automatic alert creation and notification

  3. Alert Management
    - Prevents duplicate alerts for same overdue items
    - Updates existing alerts instead of creating new ones
*/

-- Function to check overdue payments and create alerts
CREATE OR REPLACE FUNCTION check_overdue_payments()
RETURNS INTEGER AS $$
DECLARE
  overdue_count INTEGER := 0;
  overdue_invoice RECORD;
  client_info RECORD;
BEGIN
  -- Find overdue invoices (due_date passed and status still pending)
  FOR overdue_invoice IN
    SELECT 
      i.id,
      i.client_id,
      i.amount_due,
      i.currency,
      i.due_date,
      i.memo,
      c.assigned_consultant_id,
      cp.full_name as client_name,
      cp.email as client_email
    FROM invoices i
    JOIN clients c ON i.client_id = c.id
    JOIN user_profiles cp ON c.profile_id = cp.id
    WHERE i.status = 'pending'
      AND i.due_date < CURRENT_DATE
      AND c.assigned_consultant_id IS NOT NULL
  LOOP
    -- Check if alert already exists for this invoice
    IF NOT EXISTS (
      SELECT 1 FROM consultant_alerts 
      WHERE consultant_id = overdue_invoice.assigned_consultant_id
        AND alert_source_id = overdue_invoice.id::text
        AND alert_type = 'payment_overdue'
        AND is_resolved = false
    ) THEN
      -- Create new alert
      INSERT INTO consultant_alerts (
        consultant_id,
        alert_source_id,
        alert_type,
        is_resolved
      ) VALUES (
        overdue_invoice.assigned_consultant_id,
        overdue_invoice.id::text,
        'payment_overdue',
        false
      );

      -- Send notification via edge function
      PERFORM net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/notify',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
        ),
        body := jsonb_build_object(
          'recipient_id', overdue_invoice.assigned_consultant_id,
          'type', 'payment_overdue',
          'payload', jsonb_build_object(
            'client_name', overdue_invoice.client_name,
            'client_email', overdue_invoice.client_email,
            'amount', overdue_invoice.amount_due,
            'currency', overdue_invoice.currency,
            'due_date', overdue_invoice.due_date,
            'days_overdue', CURRENT_DATE - overdue_invoice.due_date,
            'invoice_id', overdue_invoice.id,
            'memo', overdue_invoice.memo,
            'source_id', overdue_invoice.id
          ),
          'email_notification', true,
          'create_consultant_alert', false,
          'alert_priority', 'high'
        )
      );

      overdue_count := overdue_count + 1;
    END IF;
  END LOOP;

  RETURN overdue_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check overdue expected documents and create alerts
CREATE OR REPLACE FUNCTION check_overdue_documents()
RETURNS INTEGER AS $$
DECLARE
  overdue_count INTEGER := 0;
  overdue_doc RECORD;
BEGIN
  -- Find overdue expected documents
  FOR overdue_doc IN
    SELECT 
      ed.id,
      ed.client_id,
      ed.consultant_id,
      ed.document_type,
      ed.due_date,
      ed.notes,
      cp.full_name as client_name,
      cp.email as client_email
    FROM expected_documents ed
    JOIN clients c ON ed.client_id = c.id
    JOIN user_profiles cp ON c.profile_id = cp.id
    WHERE ed.is_submitted = false
      AND ed.due_date < CURRENT_DATE
      AND ed.consultant_id IS NOT NULL
  LOOP
    -- Check if alert already exists for this expected document
    IF NOT EXISTS (
      SELECT 1 FROM consultant_alerts 
      WHERE consultant_id = overdue_doc.consultant_id
        AND alert_source_id = overdue_doc.id::text
        AND alert_type = 'document_due'
        AND is_resolved = false
    ) THEN
      -- Create new alert
      INSERT INTO consultant_alerts (
        consultant_id,
        alert_source_id,
        alert_type,
        is_resolved
      ) VALUES (
        overdue_doc.consultant_id,
        overdue_doc.id::text,
        'document_due',
        false
      );

      -- Send notification via edge function
      PERFORM net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/notify',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
        ),
        body := jsonb_build_object(
          'recipient_id', overdue_doc.consultant_id,
          'type', 'expected_document_overdue',
          'payload', jsonb_build_object(
            'client_name', overdue_doc.client_name,
            'client_email', overdue_doc.client_email,
            'document_type', overdue_doc.document_type,
            'due_date', overdue_doc.due_date,
            'days_overdue', CURRENT_DATE - overdue_doc.due_date,
            'expected_document_id', overdue_doc.id,
            'notes', overdue_doc.notes,
            'source_id', overdue_doc.id
          ),
          'email_notification', true,
          'create_consultant_alert', false,
          'alert_priority', 'high'
        )
      );

      overdue_count := overdue_count + 1;
    END IF;
  END LOOP;

  RETURN overdue_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Main function to process all overdue alerts
CREATE OR REPLACE FUNCTION process_overdue_alerts()
RETURNS jsonb AS $$
DECLARE
  payment_alerts INTEGER;
  document_alerts INTEGER;
  total_alerts INTEGER;
BEGIN
  -- Check overdue payments
  SELECT check_overdue_payments() INTO payment_alerts;
  
  -- Check overdue documents
  SELECT check_overdue_documents() INTO document_alerts;
  
  total_alerts := payment_alerts + document_alerts;

  -- Log the execution
  INSERT INTO audit_logs (
    user_id,
    action_type,
    description,
    payload
  ) VALUES (
    'system',
    'overdue_alerts_processed',
    'Automated overdue alerts check completed',
    jsonb_build_object(
      'payment_alerts_created', payment_alerts,
      'document_alerts_created', document_alerts,
      'total_alerts', total_alerts,
      'execution_time', NOW()
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'payment_alerts_created', payment_alerts,
    'document_alerts_created', document_alerts,
    'total_alerts_created', total_alerts,
    'execution_time', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create cron job to run overdue checks daily at 9 AM
SELECT cron.schedule(
  'overdue-alerts-daily',
  '0 9 * * *', -- Every day at 9 AM
  'SELECT process_overdue_alerts();'
);

-- Function to manually trigger overdue alerts (for testing)
CREATE OR REPLACE FUNCTION trigger_overdue_alerts_now()
RETURNS jsonb AS $$
BEGIN
  RETURN process_overdue_alerts();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users for manual trigger
GRANT EXECUTE ON FUNCTION trigger_overdue_alerts_now() TO authenticated;
GRANT EXECUTE ON FUNCTION process_overdue_alerts() TO postgres;
GRANT EXECUTE ON FUNCTION check_overdue_payments() TO postgres;
GRANT EXECUTE ON FUNCTION check_overdue_documents() TO postgres;