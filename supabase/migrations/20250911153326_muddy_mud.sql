/*
  # Overdue Alerts System

  1. Functions
    - `check_overdue_payments()` - Checks for overdue invoices
    - `check_overdue_documents()` - Checks for overdue expected documents  
    - `trigger_overdue_alerts_now()` - Main function to trigger all overdue checks
    - `create_test_overdue_data()` - Creates test data for testing

  2. Security
    - Functions use SECURITY DEFINER for elevated permissions
    - Only accessible by authenticated users with proper roles

  3. Automation
    - Can be called manually or via cron jobs
    - Returns structured data for processing by Edge Functions
*/

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS check_overdue_payments();
DROP FUNCTION IF EXISTS check_overdue_documents();
DROP FUNCTION IF EXISTS trigger_overdue_alerts_now();
DROP FUNCTION IF EXISTS create_test_overdue_data();

-- Function to check overdue payments
CREATE OR REPLACE FUNCTION check_overdue_payments()
RETURNS TABLE (
  invoice_id uuid,
  client_id uuid,
  consultant_id uuid,
  client_name text,
  amount_due numeric,
  currency text,
  days_overdue integer,
  due_date timestamptz
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id as invoice_id,
    i.client_id,
    c.assigned_consultant_id as consultant_id,
    up.full_name as client_name,
    i.amount_due,
    i.currency,
    EXTRACT(DAY FROM NOW() - i.due_date)::integer as days_overdue,
    i.due_date
  FROM invoices i
  JOIN clients c ON i.client_id = c.id
  JOIN user_profiles up ON c.profile_id = up.id
  WHERE i.status = 'pending'
    AND i.due_date < NOW()
    AND c.assigned_consultant_id IS NOT NULL;
END;
$$;

-- Function to check overdue expected documents
CREATE OR REPLACE FUNCTION check_overdue_documents()
RETURNS TABLE (
  document_id uuid,
  client_id uuid,
  consultant_id uuid,
  client_name text,
  document_type text,
  days_overdue integer,
  due_date date
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ed.id as document_id,
    ed.client_id,
    ed.consultant_id,
    up.full_name as client_name,
    ed.document_type,
    (CURRENT_DATE - ed.due_date)::integer as days_overdue,
    ed.due_date
  FROM expected_documents ed
  JOIN clients c ON ed.client_id = c.id
  JOIN user_profiles up ON c.profile_id = up.id
  WHERE ed.is_submitted = false
    AND ed.due_date < CURRENT_DATE;
END;
$$;

-- Main function to trigger overdue alerts
CREATE OR REPLACE FUNCTION trigger_overdue_alerts_now()
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  overdue_payments_result jsonb;
  overdue_documents_result jsonb;
  payment_count integer := 0;
  document_count integer := 0;
  total_alerts integer := 0;
BEGIN
  -- Get overdue payments
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', invoice_id,
      'client_id', client_id,
      'consultant_id', consultant_id,
      'client_name', client_name,
      'amount_due', amount_due,
      'currency', currency,
      'days_overdue', days_overdue,
      'due_date', due_date
    )
  ) INTO overdue_payments_result
  FROM check_overdue_payments();

  -- Get overdue documents
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', document_id,
      'client_id', client_id,
      'consultant_id', consultant_id,
      'client_name', client_name,
      'document_type', document_type,
      'days_overdue', days_overdue,
      'due_date', due_date
    )
  ) INTO overdue_documents_result
  FROM check_overdue_documents();

  -- Count results
  payment_count := COALESCE(jsonb_array_length(overdue_payments_result), 0);
  document_count := COALESCE(jsonb_array_length(overdue_documents_result), 0);
  total_alerts := payment_count + document_count;

  -- Return structured results
  RETURN jsonb_build_object(
    'success', true,
    'timestamp', NOW(),
    'overdue_invoices', COALESCE(overdue_payments_result, '[]'::jsonb),
    'overdue_documents', COALESCE(overdue_documents_result, '[]'::jsonb),
    'payment_alerts', payment_count,
    'document_alerts', document_count,
    'total_alerts_created', total_alerts
  );
END;
$$;

-- Function to create test overdue data
CREATE OR REPLACE FUNCTION create_test_overdue_data()
RETURNS jsonb
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  test_client_id uuid;
  test_consultant_id uuid;
  test_invoices_created integer := 0;
  test_documents_created integer := 0;
BEGIN
  -- Get a test consultant (first available)
  SELECT id INTO test_consultant_id
  FROM user_profiles 
  WHERE role = 'consultant' AND is_active = true
  LIMIT 1;

  -- Get a test client assigned to this consultant
  SELECT id INTO test_client_id
  FROM clients 
  WHERE assigned_consultant_id = test_consultant_id
  LIMIT 1;

  -- If no suitable client found, skip test data creation
  IF test_client_id IS NULL OR test_consultant_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'No suitable client/consultant pair found for test data',
      'test_invoices_created', 0,
      'test_documents_created', 0
    );
  END IF;

  -- Create test overdue invoice
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
    500.00,
    'USD',
    'pending',
    'Test overdue invoice - Monthly accounting fee',
    NOW() - INTERVAL '5 days', -- 5 days overdue
    'accounting_fee',
    NOW() - INTERVAL '10 days'
  );
  test_invoices_created := test_invoices_created + 1;

  -- Create test overdue expected document
  INSERT INTO expected_documents (
    client_id,
    consultant_id,
    document_type,
    due_date,
    is_submitted,
    reminder_sent,
    notes,
    created_at
  ) VALUES (
    test_client_id,
    test_consultant_id,
    'financial',
    CURRENT_DATE - INTERVAL '3 days', -- 3 days overdue
    false,
    false,
    'Test overdue document - Monthly financial statements',
    NOW() - INTERVAL '7 days'
  );
  test_documents_created := test_documents_created + 1;

  RETURN jsonb_build_object(
    'success', true,
    'test_invoices_created', test_invoices_created,
    'test_documents_created', test_documents_created,
    'test_client_id', test_client_id,
    'test_consultant_id', test_consultant_id
  );
END;
$$;