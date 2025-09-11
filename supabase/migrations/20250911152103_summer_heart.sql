/*
  # Fix Overdue Alerts System

  1. Drop broken functions
  2. Create simplified working functions
  3. Fix task creation issues
  4. Remove pg_cron dependencies
*/

-- Drop existing broken functions
DROP FUNCTION IF EXISTS check_overdue_payments() CASCADE;
DROP FUNCTION IF EXISTS check_overdue_documents() CASCADE;
DROP FUNCTION IF EXISTS trigger_overdue_alerts_now() CASCADE;
DROP FUNCTION IF EXISTS create_test_overdue_data() CASCADE;

-- Create simplified overdue payment check function
CREATE OR REPLACE FUNCTION check_overdue_payments()
RETURNS TABLE(
  alerts_created INTEGER,
  invoices_checked INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
  alert_count INTEGER := 0;
  invoice_count INTEGER := 0;
  overdue_invoice RECORD;
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
    
    alert_count := alert_count + 1;
  END LOOP;

  RETURN QUERY SELECT alert_count, invoice_count;
END;
$$;

-- Create simplified overdue document check function
CREATE OR REPLACE FUNCTION check_overdue_documents()
RETURNS TABLE(
  alerts_created INTEGER,
  documents_checked INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
  alert_count INTEGER := 0;
  doc_count INTEGER := 0;
  overdue_doc RECORD;
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
    
    alert_count := alert_count + 1;
  END LOOP;

  RETURN QUERY SELECT alert_count, doc_count;
END;
$$;

-- Create main trigger function that calls both checks
CREATE OR REPLACE FUNCTION trigger_overdue_alerts_now()
RETURNS TABLE(
  total_alerts_created INTEGER,
  payment_alerts INTEGER,
  document_alerts INTEGER,
  invoices_checked INTEGER,
  documents_checked INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
  payment_result RECORD;
  document_result RECORD;
BEGIN
  -- Check overdue payments
  SELECT * INTO payment_result FROM check_overdue_payments();
  
  -- Check overdue documents  
  SELECT * INTO document_result FROM check_overdue_documents();
  
  -- Return combined results
  RETURN QUERY SELECT 
    (payment_result.alerts_created + document_result.alerts_created)::INTEGER,
    payment_result.alerts_created::INTEGER,
    document_result.alerts_created::INTEGER,
    payment_result.invoices_checked::INTEGER,
    document_result.documents_checked::INTEGER;
END;
$$;

-- Create test data function (simplified)
CREATE OR REPLACE FUNCTION create_test_overdue_data()
RETURNS TABLE(
  test_invoices_created INTEGER,
  test_documents_created INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
  test_client_id UUID;
  test_consultant_id UUID := 'a4d1a7b0-1234-5678-90ab-cdef12345678';
  invoice_count INTEGER := 0;
  doc_count INTEGER := 0;
BEGIN
  -- Get first available client
  SELECT c.id INTO test_client_id 
  FROM clients c 
  WHERE c.assigned_consultant_id = test_consultant_id 
  LIMIT 1;
  
  IF test_client_id IS NULL THEN
    RAISE NOTICE 'No test client found for consultant %', test_consultant_id;
    RETURN QUERY SELECT 0, 0;
    RETURN;
  END IF;

  -- Create test overdue invoice
  INSERT INTO invoices (
    client_id,
    amount_due,
    currency,
    status,
    memo,
    due_date,
    payment_type
  ) VALUES (
    test_client_id,
    1500.00,
    'USD',
    'pending',
    'Test overdue invoice - Monthly accounting fee',
    CURRENT_DATE - INTERVAL '5 days',
    'accounting_fee'
  );
  invoice_count := 1;

  -- Create test overdue expected document
  INSERT INTO expected_documents (
    client_id,
    consultant_id,
    document_type,
    due_date,
    is_submitted
  ) VALUES (
    test_client_id,
    test_consultant_id,
    'financial',
    CURRENT_DATE - INTERVAL '3 days',
    false
  );
  doc_count := 1;

  RETURN QUERY SELECT invoice_count, doc_count;
END;
$$;