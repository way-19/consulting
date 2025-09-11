/*
  # Overdue Alerts System

  1. Functions
    - `check_overdue_payments()` - Checks for overdue invoices and creates alerts
    - `check_overdue_documents()` - Checks for overdue expected documents and creates alerts
    - `trigger_overdue_alerts_now()` - Manual trigger for testing
    - `create_test_overdue_data()` - Creates test data for testing

  2. Scheduled Jobs
    - Daily check at 09:00 for overdue payments and documents

  3. Security
    - Functions use service role permissions
    - Alerts are created for assigned consultants only
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS check_overdue_payments();
DROP FUNCTION IF EXISTS check_overdue_documents();
DROP FUNCTION IF EXISTS trigger_overdue_alerts_now();
DROP FUNCTION IF EXISTS create_test_overdue_data();

-- Function to check overdue payments and create alerts
CREATE OR REPLACE FUNCTION check_overdue_payments()
RETURNS TABLE(
  alerts_created INTEGER,
  overdue_count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  overdue_invoice RECORD;
  alert_count INTEGER := 0;
  total_overdue INTEGER := 0;
BEGIN
  -- Find overdue invoices
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
    total_overdue := total_overdue + 1;
    
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
      created_at = NOW();
    
    -- Check if this was a new insert
    IF FOUND THEN
      alert_count := alert_count + 1;
      
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
            'amount', overdue_invoice.amount_due,
            'currency', overdue_invoice.currency,
            'due_date', overdue_invoice.due_date,
            'invoice_id', overdue_invoice.invoice_id,
            'memo', overdue_invoice.memo,
            'source_id', overdue_invoice.invoice_id
          ),
          'email_notification', true,
          'create_consultant_alert', true,
          'alert_type', 'payment_overdue',
          'alert_priority', 'high'
        )
      );
    END IF;
  END LOOP;

  RETURN QUERY SELECT alert_count, total_overdue;
END;
$$;

-- Function to check overdue expected documents and create alerts
CREATE OR REPLACE FUNCTION check_overdue_documents()
RETURNS TABLE(
  alerts_created INTEGER,
  overdue_count INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  overdue_doc RECORD;
  alert_count INTEGER := 0;
  total_overdue INTEGER := 0;
BEGIN
  -- Find overdue expected documents
  FOR overdue_doc IN
    SELECT 
      ed.id as expected_doc_id,
      ed.client_id,
      ed.consultant_id,
      ed.document_type,
      ed.due_date,
      ed.notes,
      cp.full_name as client_name
    FROM expected_documents ed
    JOIN clients c ON ed.client_id = c.id
    JOIN user_profiles cp ON c.profile_id = cp.id
    WHERE ed.is_submitted = false
      AND ed.due_date < CURRENT_DATE
      AND ed.consultant_id IS NOT NULL
  LOOP
    total_overdue := total_overdue + 1;
    
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
      created_at = NOW();
    
    -- Check if this was a new insert
    IF FOUND THEN
      alert_count := alert_count + 1;
      
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
            'document_type', overdue_doc.document_type,
            'due_date', overdue_doc.due_date,
            'expected_doc_id', overdue_doc.expected_doc_id,
            'notes', overdue_doc.notes,
            'source_id', overdue_doc.expected_doc_id
          ),
          'email_notification', true,
          'create_consultant_alert', true,
          'alert_type', 'document_due',
          'alert_priority', 'medium'
        )
      );
    END IF;
  END LOOP;

  RETURN QUERY SELECT alert_count, total_overdue;
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
    'overdue_payments', COALESCE(payment_result.overdue_count, 0),
    'overdue_documents', COALESCE(document_result.overdue_count, 0),
    'checked_at', NOW()
  );
END;
$$;

-- Function to create test overdue data for testing
CREATE OR REPLACE FUNCTION create_test_overdue_data()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  test_client_id UUID;
  test_consultant_id UUID;
  created_invoices INTEGER := 0;
  created_documents INTEGER := 0;
BEGIN
  -- Get a test consultant (first consultant in system)
  SELECT id INTO test_consultant_id 
  FROM user_profiles 
  WHERE role = 'consultant' AND is_active = true 
  LIMIT 1;
  
  IF test_consultant_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No active consultant found for testing');
  END IF;
  
  -- Get a test client assigned to this consultant
  SELECT id INTO test_client_id 
  FROM clients 
  WHERE assigned_consultant_id = test_consultant_id 
  LIMIT 1;
  
  IF test_client_id IS NULL THEN
    RETURN jsonb_build_object('error', 'No client assigned to consultant for testing');
  END IF;
  
  -- Create overdue invoice (due 5 days ago)
  INSERT INTO invoices (
    client_id,
    amount_due,
    currency,
    status,
    memo,
    due_date,
    payment_type,
    created_at
  ) VALUES (
    test_client_id,
    1500.00,
    'USD',
    'pending',
    'Test Overdue Invoice - Accounting Fee',
    CURRENT_DATE - INTERVAL '5 days',
    'accounting_fee',
    NOW() - INTERVAL '10 days'
  );
  created_invoices := created_invoices + 1;
  
  -- Create another overdue invoice (due 2 days ago)
  INSERT INTO invoices (
    client_id,
    amount_due,
    currency,
    status,
    memo,
    due_date,
    payment_type,
    created_at
  ) VALUES (
    test_client_id,
    750.00,
    'USD',
    'pending',
    'Test Overdue Invoice - Virtual Office Fee',
    CURRENT_DATE - INTERVAL '2 days',
    'virtual_office_fee',
    NOW() - INTERVAL '7 days'
  );
  created_invoices := created_invoices + 1;
  
  -- Create overdue expected document (due 3 days ago)
  INSERT INTO expected_documents (
    client_id,
    consultant_id,
    document_type,
    due_date,
    is_submitted,
    notes,
    created_at
  ) VALUES (
    test_client_id,
    test_consultant_id,
    'Tax Document',
    CURRENT_DATE - INTERVAL '3 days',
    false,
    'Test overdue tax document submission',
    NOW() - INTERVAL '8 days'
  );
  created_documents := created_documents + 1;
  
  -- Create another overdue expected document (due 1 day ago)
  INSERT INTO expected_documents (
    client_id,
    consultant_id,
    document_type,
    due_date,
    is_submitted,
    notes,
    created_at
  ) VALUES (
    test_client_id,
    test_consultant_id,
    'Bank Statement',
    CURRENT_DATE - INTERVAL '1 day',
    false,
    'Test overdue bank statement submission',
    NOW() - INTERVAL '5 days'
  );
  created_documents := created_documents + 1;
  
  RETURN jsonb_build_object(
    'success', true,
    'test_client_id', test_client_id,
    'test_consultant_id', test_consultant_id,
    'created_invoices', created_invoices,
    'created_documents', created_documents,
    'message', 'Test overdue data created successfully'
  );
END;
$$;

-- Schedule daily overdue checks at 09:00 UTC
SELECT cron.schedule(
  'daily-overdue-check',
  '0 9 * * *',
  'SELECT trigger_overdue_alerts_now();'
);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_overdue_payments() TO service_role;
GRANT EXECUTE ON FUNCTION check_overdue_documents() TO service_role;
GRANT EXECUTE ON FUNCTION trigger_overdue_alerts_now() TO service_role;
GRANT EXECUTE ON FUNCTION create_test_overdue_data() TO service_role;