/*
  # Create Test Overdue Data

  1. Test Overdue Invoices
    - Creates sample overdue invoices for testing
    
  2. Test Overdue Expected Documents
    - Creates sample overdue expected documents for testing

  3. Test Data Setup
    - Ensures we have test data to verify the overdue alert system
*/

-- Create test overdue invoice (due yesterday)
DO $$
DECLARE
  test_client_id uuid;
  test_consultant_id uuid;
BEGIN
  -- Get a test client and consultant
  SELECT c.id, c.assigned_consultant_id 
  INTO test_client_id, test_consultant_id
  FROM clients c 
  WHERE c.assigned_consultant_id IS NOT NULL 
  LIMIT 1;

  -- Only create test data if we have a valid client-consultant pair
  IF test_client_id IS NOT NULL AND test_consultant_id IS NOT NULL THEN
    -- Create overdue invoice (due yesterday)
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
      'Monthly accounting service fee - December 2024',
      CURRENT_DATE - INTERVAL '1 day', -- Due yesterday
      'accounting_fee',
      NOW() - INTERVAL '5 days'
    ) ON CONFLICT DO NOTHING;

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
      'Monthly bank statements',
      CURRENT_DATE - INTERVAL '3 days', -- Due 3 days ago
      false,
      'December 2024 bank statements required for monthly accounting',
      NOW() - INTERVAL '7 days'
    ) ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Test overdue data created for client % and consultant %', test_client_id, test_consultant_id;
  ELSE
    RAISE NOTICE 'No valid client-consultant pair found for test data creation';
  END IF;
END $$;