@@ .. @@
     INSERT INTO invoices (client_id, amount_due, currency, status, memo, due_date, payment_type, created_at)
     VALUES (client_id, 150.00, 'USD', 'pending', 'Monthly accounting fee - overdue test', 
             CURRENT_DATE - INTERVAL '5 days', 'accounting_fee', NOW());
-    GET DIAGNOSTICS created_invoice = FOUND;
+    GET DIAGNOSTICS created_invoice = ROW_COUNT;
     
     -- Create overdue expected document
     INSERT INTO expected_documents (client_id, consultant_id, document_type, due_date, is_submitted, created_at)
     VALUES (client_id, consultant_id, 'Monthly Financial Report', 
             CURRENT_DATE - INTERVAL '3 days', false, NOW());
-    GET DIAGNOSTICS created_document = FOUND;
+    GET DIAGNOSTICS created_document = ROW_COUNT;
     
     RETURN json_build_object(
       'success', true,