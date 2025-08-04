@@ .. @@
 INSERT INTO consultant_country_assignments (id, consultant_id, country_id, is_primary, status) VALUES
-(gen_random_uuid(), 'c3d4e5f6-a7b8-4012-8456-789012cdefab', 1, true, true);
+(gen_random_uuid(), (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'), 1, true, true);
 
 -- Create test clients for Georgia consultant
 INSERT INTO users (id, email, role, first_name, last_name, country_id, primary_country_id, language, status) VALUES
-('e5f6a7b8-c9d0-4234-8678-901234efabcd', 'ahmet@test.com', 'client', 'Ahmet', 'Yılmaz', 1, 1, 'tr', true),
-('f6a7b8c9-d0e1-4345-8789-012345fabcde', 'maria@test.com', 'client', 'Maria', 'Garcia', 1, 1, 'tr', true);
+(gen_random_uuid(), 'ahmet@test.com', 'client', 'Ahmet', 'Yılmaz', 1, 1, 'tr', true),
+(gen_random_uuid(), 'maria@test.com', 'client', 'Maria', 'Garcia', 1, 1, 'tr', true);
 
 -- Create applications to connect clients with consultant
 INSERT INTO applications (id, client_id, consultant_id, service_type, service_country_id, total_amount, currency, status, source_type) VALUES
-('cca1-' || gen_random_uuid()::text,
- (SELECT id FROM users WHERE email = 'ahmet@test.com'),
- (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
+(gen_random_uuid(),
+ (SELECT id FROM users WHERE email = 'ahmet@test.com' AND role = 'client'),
+ (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com' AND role = 'consultant'),
  'company_formation', 1, 2500.00, 'USD', 'in_progress', 'platform'),
-('cca2-' || gen_random_uuid()::text,
- (SELECT id FROM users WHERE email = 'maria@test.com'),
- (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
+(gen_random_uuid(),
+ (SELECT id FROM users WHERE email = 'maria@test.com' AND role = 'client'),
+ (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com' AND role = 'consultant'),
  'accounting_services', 1, 1500.00, 'USD', 'pending', 'platform');
 
 -- Create some test documents
 INSERT INTO client_documents (id, client_id, document_name, document_type, file_url, status, upload_source) VALUES
-('doc1-' || gen_random_uuid()::text,
+(gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'ahmet@test.com'),
  'Passport Copy', 'identification', '/documents/passport.pdf', 'approved', 'client'),
-('doc2-' || gen_random_uuid()::text,
+(gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'maria@test.com'),
  'Bank Statement', 'financial', '/documents/bank_statement.pdf', 'pending_review', 'client');
 
 -- Create test messages
 INSERT INTO messages (id, sender_id, recipient_id, message, message_type, original_language, needs_translation) VALUES
-('msg1-' || gen_random_uuid()::text,
+(gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
  (SELECT id FROM users WHERE email = 'ahmet@test.com'),
  'Merhaba Ahmet! Gürcistan şirket kuruluş süreciniz başladı.', 'general', 'tr', false),
-('msg2-' || gen_random_uuid()::text,
+(gen_random_uuid(),
  (SELECT id FROM users WHERE email = 'ahmet@test.com'),
  (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
  'Merhaba Nino! Teşekkürler, süreç ne kadar sürecek?', 'general', 'tr', false);