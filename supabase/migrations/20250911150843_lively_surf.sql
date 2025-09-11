/*
  # Create Test Overdue Data Function

  1. Function Definition
    - Creates test overdue invoices and expected documents
    - Only creates data if valid client-consultant pairs exist
    - Safe to run multiple times (uses conflict handling)

  2. Test Data Types
    - Overdue invoice (due yesterday)
    - Overdue expected document (due 3 days ago)
*/

CREATE OR REPLACE FUNCTION create_test_overdue_data()
RETURNS jsonb AS $$
DECLARE
  test_client_id uuid;
  test_consultant_id uuid;
  created_invoice boolean := false;
  created_document boolean := false;
BEGIN
  -- Get a test client and consultant
  SELECT c.id, c.assigned_consultant_id 
  INTO test_client_id, test_consultant_id
  FROM clients c 
  WHERE c.assigned_consultant_id IS NOT NULL 
    AND c.status = 'active'
  LIMIT 1;

  -- Only create test data if we have a valid client-consultant pair
  IF test_client_id IS NOT NULL AND test_consultant_id IS NOT NULL THEN
    -- Create overdue invoice (due yesterday) if it doesn't exist
    INSERT INTO invoices (
      client_id,
      amount_due,
      currency,
      status,
      memo,
      due_date,
      payment_type,
      created_at
    ) 
    SELECT 
      test_client_id,
      1500.00,
      'USD',
      'pending',
      'Monthly accounting service fee - December 2024',
      CURRENT_DATE - INTERVAL '1 day', -- Due yesterday
      'accounting_fee',
      NOW() - INTERVAL '5 days'
    WHERE NOT EXISTS (
      SELECT 1 FROM invoices 
      WHERE client_id = test_client_id 
        AND status = 'pending' 
        AND due_date < CURRENT_DATE
    );
    
    GET DIAGNOSTICS created_invoice = FOUND;

    -- Create overdue expected document (due 3 days ago) if it doesn't exist
    INSERT INTO expected_documents (
      client_id,
      consultant_id,
      document_type,
      due_date,
      is_submitted,
      notes,
      created_at
    ) 
    SELECT 
      test_client_id,
      test_consultant_id,
      'Monthly bank statements',
      CURRENT_DATE - INTERVAL '3 days', -- Due 3 days ago
      false,
      'December 2024 bank statements required for monthly accounting',
      NOW() - INTERVAL '7 days'
    WHERE NOT EXISTS (
      SELECT 1 FROM expected_documents 
      WHERE client_id = test_client_id 
        AND consultant_id = test_consultant_id
        AND is_submitted = false 
        AND due_date < CURRENT_DATE
    );
    
    GET DIAGNOSTICS created_document = FOUND;

    RETURN jsonb_build_object(
      'success', true,
      'client_id', test_client_id,
      'consultant_id', test_consultant_id,
      'created_invoice', created_invoice,
      'created_document', created_document,
      'message', 'Test overdue data created successfully'
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'message', 'No valid client-consultant pair found for test data creation'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_test_overdue_data() TO authenticated;