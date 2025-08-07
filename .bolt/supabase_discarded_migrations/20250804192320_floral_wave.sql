@@ .. @@
 -- Insert test consultant (Nino Kvaratskhelia - Georgia Expert)
 INSERT INTO users (
-  id, email, role, first_name, last_name, country_id, primary_country_id, 
+  id, email, role, first_name, last_name, country_id, primary_country_id,
   language, commission_rate, status, created_at
 ) VALUES (
-  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
+  gen_random_uuid(),
   'georgia_consultant@consulting19.com',
   'consultant',
   'Nino',
@@ .. @@
 -- Insert test clients for Georgia
 INSERT INTO users (
-  id, email, role, first_name, last_name, country_id, primary_country_id,
+  id, email, role, first_name, last_name, country_id, primary_country_id,
   language, company_name, business_type, status, created_at
 ) VALUES 
 (
-  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
+  gen_random_uuid(),
   'ahmet@test.com',
   'client',
   'Ahmet',
@@ .. @@
   NOW()
 ),
 (
-  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
+  gen_random_uuid(),
   'maria@test.com',
   'client',
   'Maria',
@@ .. @@
   NOW()
 ),
 (
-  'a7b8c9d0-e1f2-4456-8890-123456abcdef',
+  gen_random_uuid(),
   'david@test.com',
   'client',
   'David',
@@ .. @@
 -- Assign consultant to Georgia
 INSERT INTO consultant_country_assignments (
-  consultant_id, country_id, is_primary, status, created_at
+  consultant_id, country_id, is_primary, status, created_at
 ) VALUES (
-  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
+  (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
   1, -- Georgia
   true,
@@ .. @@
 -- Create applications for test clients
 INSERT INTO applications (
-  client_id, consultant_id, service_type, service_country_id, total_amount, 
+  client_id, consultant_id, service_type, service_country_id, total_amount,
   currency, status, priority_level, created_at
 ) VALUES 
 (
-  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
-  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
+  (SELECT id FROM users WHERE email = 'ahmet@test.com'),
+  (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
   'company_formation',
   1, -- Georgia
@@ .. @@
   NOW()
 ),
 (
-  'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
-  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
+  (SELECT id FROM users WHERE email = 'maria@test.com'),
+  (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
   'accounting_services',
   1, -- Georgia
@@ .. @@
   NOW()
 ),
 (
-  'a7b8c9d0-e1f2-4456-8890-123456abcdef', -- David
-  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
+  (SELECT id FROM users WHERE email = 'david@test.com'),
+  (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
   'tax_optimization',
   1, -- Georgia
@@ .. @@
 -- Create test messages
 INSERT INTO messages (
-  sender_id, recipient_id, message, message_type, original_language, 
+  sender_id, recipient_id, message, message_type, original_language,
   is_read, created_at
 ) VALUES 
 (
-  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
-  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
+  (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
+  (SELECT id FROM users WHERE email = 'ahmet@test.com'),
   'Merhaba Ahmet! Gürcistan LLC kurulumunuz için gerekli belgeler hazırlandı.',
   'general',
@@ .. @@
   NOW() - INTERVAL '2 hours'
 ),
 (
-  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
-  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
+  (SELECT id FROM users WHERE email = 'ahmet@test.com'),
+  (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
   'Merhaba Nino! Süreç ne durumda? Belgeler ne zaman hazır olacak?',
   'general',
@@ .. @@
 -- Create test documents
 INSERT INTO client_documents (
-  client_id, document_name, document_type, file_url, upload_source, 
+  client_id, document_name, document_type, file_url, upload_source,
   status, created_at
 ) VALUES 
 (
-  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
+  (SELECT id FROM users WHERE email = 'ahmet@test.com'),
   'Pasaport Kopyası',
   'passport',
@@ .. @@
   NOW() - INTERVAL '1 day'
 ),
 (
-  'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
+  (SELECT id FROM users WHERE email = 'maria@test.com'),
   'Banka Ekstresi - Ocak 2024',
   'bank_statement',
@@ .. @@
 -- Create test payment schedules
 INSERT INTO client_payment_schedules (
-  client_id, consultant_id, payment_type, description, amount, currency,
+  client_id, consultant_id, payment_type, description, amount, currency,
   due_date, status, recurring, country_id, created_at
 ) VALUES 
 (
-  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
-  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
+  (SELECT id FROM users WHERE email = 'ahmet@test.com'),
+  (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
   'company_maintenance',
   'Gürcistan LLC yıllık bakım ücreti',
@@ .. @@
   NOW()
 ),
 (
-  'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
-  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
+  (SELECT id FROM users WHERE email = 'maria@test.com'),
+  (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
   'accounting_fee',
   'Aylık muhasebe hizmet ücreti',