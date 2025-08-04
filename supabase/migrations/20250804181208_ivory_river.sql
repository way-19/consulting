@@ .. @@
 INSERT INTO consultant_country_assignments (id, consultant_id, country_id, is_primary, status) VALUES
-(    'cca1-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'c3d4e5f6-a7b8-4012-8456-789012cdefab',
     1, -- Georgia
     true,
@@ .. @@
 INSERT INTO applications (id, client_id, consultant_id, service_type, status, total_amount, currency, service_country_id, application_data, source_type, priority_level) VALUES
-(    'app1-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
     'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
     'company_formation',
@@ .. @@
     'normal'
 ),
-(    'app2-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
     'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
     'accounting_services',
@@ .. @@
 INSERT INTO client_documents (id, client_id, document_name, document_type, file_url, file_size, mime_type, upload_source, status) VALUES
-(    'doc1-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'e5f6a7b8-c9d0-4234-8678-901234efabcd',
     'Passport Copy',
@@ .. @@
     'pending_review'
 ),
-(    'doc2-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'f6a7b8c9-d0e1-4345-8789-012345fabcde',
     'Bank Statement',
@@ .. @@
 INSERT INTO client_payment_schedules (id, client_id, consultant_id, payment_type, description, amount, currency, due_date, status, country_id) VALUES
-(    'pay1-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'e5f6a7b8-c9d0-4234-8678-901234efabcd',
     'c3d4e5f6-a7b8-4012-8456-789012cdefab',
@@ .. @@
     1 -- Georgia
 ),
-(    'pay2-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'f6a7b8c9-d0e1-4345-8789-012345fabcde',
     'c3d4e5f6-a7b8-4012-8456-789012cdefab',
@@ .. @@
 INSERT INTO messages (id, sender_id, recipient_id, message, original_language, message_type, is_read, needs_translation, translation_status) VALUES
-(    'msg1-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
     'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
@@ .. @@
     'not_needed'
 ),
-(    'msg2-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
     'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
@@ .. @@
 INSERT INTO consultant_custom_services (id, consultant_id, service_name, service_description, service_category, price, currency, active) VALUES
-(    'svc1-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'c3d4e5f6-a7b8-4012-8456-789012cdefab',
     'Gürcistan Vergi Danışmanlığı',
@@ .. @@
     true
 ),
-(    'svc2-' || gen_random_uuid()::text,
+(    gen_random_uuid(),
     'c3d4e5f6-a7b8-4012-8456-789012cdefab',
     'Aylık Muhasebe Hizmeti',