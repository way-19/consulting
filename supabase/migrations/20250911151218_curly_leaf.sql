/*
  # Overdue Alerts System

  1. Functions
    - `check_overdue_payments()` - Checks for overdue invoices and creates alerts
    - `check_overdue_documents()` - Checks for overdue expected documents and creates alerts
    - `trigger_overdue_alerts_now()` - Manual trigger for testing
    
  2. Scheduled Jobs
    - Daily check at 09:00 UTC for overdue items
    
  3. Security
    - Functions can be called by authenticated users and service role
    - Alerts are created with proper consultant assignment
*/

-- Function to check overdue payments
CREATE OR REPLACE FUNCTION check_overdue_payments()
RETURNS TABLE(
  alerts_created INTEGER,
  invoices_checked INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  overdue_invoice RECORD;
  alert_count INTEGER := 0;
  invoice_count INTEGER := 0;
  created_invoice BOOLEAN;
BEGIN
  -- Check for overdue invoices (due_date passed and status still pending)
  FOR overdue_invoice IN 
    SELECT 
      i.id as invoice_id,
      i.client_id,
      i.amount_due,
      i.currency,
      i.due_date,
      i.memo,
      c.assigned_consultant_id,
      cp.full_name as client_name
    FROM invoices i
    JOIN clients c ON i.client_id = c.id
    JOIN user_profiles cp ON c.profile_id = cp.id
    WHERE i.status = 'pending'
      AND i.due_date < CURRENT_DATE
      AND c.assigned_consultant_id IS NOT NULL
  LOOP
    invoice_count := invoice_count + 1;
    
    -- Create or update consultant alert
    INSERT INTO consultant_alerts (
      consultant_id,
      alert_source_id,
      alert_type,
      is_resolved
    ) VALUES (
      overdue_invoice.assigned_consultant_id,
      overdue_invoice.invoice_id,
      'payment_overdue',
      false
    )
    ON CONFLICT (consultant_id, alert_source_id, alert_type) 
    DO UPDATE SET 
      is_resolved = false,
      created_at = CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS created_invoice = ROW_COUNT;
    
    IF created_invoice > 0 THEN
      alert_count := alert_count + 1;
      
      -- Call notify function for email notification
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
            'amount', overdue_invoice.amount_due,
            'currency', overdue_invoice.currency,
            'due_date', overdue_invoice.due_date,
            'invoice_id', overdue_invoice.invoice_id,
            'memo', overdue_invoice.memo,
            'source_id', overdue_invoice.invoice_id
          ),
          'email_notification', true,
          'create_consultant_alert', false,
          'alert_type', 'payment_overdue'
        )
      );
    END IF;
  END LOOP;

  RETURN QUERY SELECT alert_count, invoice_count;
END;
$$;

-- Function to check overdue documents
CREATE OR REPLACE FUNCTION check_overdue_documents()
RETURNS TABLE(
  alerts_created INTEGER,
  documents_checked INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  overdue_doc RECORD;
  alert_count INTEGER := 0;
  doc_count INTEGER := 0;
  created_doc BOOLEAN;
BEGIN
  -- Check for overdue expected documents
  FOR overdue_doc IN 
    SELECT 
      ed.id as expected_doc_id,
      ed.client_id,
      ed.consultant_id,
      ed.document_type,
      ed.due_date,
      cp.full_name as client_name
    FROM expected_documents ed
    JOIN clients c ON ed.client_id = c.id
    JOIN user_profiles cp ON c.profile_id = cp.id
    WHERE ed.is_submitted = false
      AND ed.due_date < CURRENT_DATE
      AND ed.consultant_id IS NOT NULL
  LOOP
    doc_count := doc_count + 1;
    
    -- Create or update consultant alert
    INSERT INTO consultant_alerts (
      consultant_id,
      alert_source_id,
      alert_type,
      is_resolved
    ) VALUES (
      overdue_doc.consultant_id,
      overdue_doc.expected_doc_id,
      'document_due',
      false
    )
    ON CONFLICT (consultant_id, alert_source_id, alert_type) 
    DO UPDATE SET 
      is_resolved = false,
      created_at = CURRENT_TIMESTAMP;
    
    GET DIAGNOSTICS created_doc = ROW_COUNT;
    
    IF created_doc > 0 THEN
      alert_count := alert_count + 1;
      
      -- Call notify function for email notification
      PERFORM net.http_post(
        url := current_setting('app.supabase_url') || '/functions/v1/notify',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key')
        ),
        body := jsonb_build_object(
          'recipient_id', overdue_doc.consultant_id,
          'type', 'document_due',
          'payload', jsonb_build_object(
            'client_name', overdue_doc.client_name,
            'document_type', overdue_doc.document_type,
            'due_date', overdue_doc.due_date,
            'expected_doc_id', overdue_doc.expected_doc_id,
            'source_id', overdue_doc.expected_doc_id
          ),
          'email_notification', true,
          'create_consultant_alert', false,
          'alert_type', 'document_due'
        )
      );
    END IF;
  END LOOP;

  RETURN QUERY SELECT alert_count, doc_count;
END;
$$;

-- Combined function to trigger all overdue checks
CREATE OR REPLACE FUNCTION trigger_overdue_alerts_now()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payment_result RECORD;
  document_result RECORD;
  total_alerts INTEGER := 0;
BEGIN
  -- Check overdue payments
  SELECT * INTO payment_result FROM check_overdue_payments();
  
  -- Check overdue documents  
  SELECT * INTO document_result FROM check_overdue_documents();
  
  total_alerts := COALESCE(payment_result.alerts_created, 0) + COALESCE(document_result.alerts_created, 0);
  
  RETURN jsonb_build_object(
    'success', true,
    'total_alerts_created', total_alerts,
    'payment_alerts', COALESCE(payment_result.alerts_created, 0),
    'document_alerts', COALESCE(document_result.alerts_created, 0),
    'invoices_checked', COALESCE(payment_result.invoices_checked, 0),
    'documents_checked', COALESCE(document_result.documents_checked, 0),
    'executed_at', CURRENT_TIMESTAMP
  );
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION check_overdue_payments() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION check_overdue_documents() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION trigger_overdue_alerts_now() TO authenticated, service_role;

-- Schedule daily overdue checks at 09:00 UTC
-- Note: pg_cron extension must be enabled by Supabase admin
SELECT cron.schedule(
  'daily-overdue-check',
  '0 9 * * *',
  'SELECT trigger_overdue_alerts_now();'
);