@@ .. @@
 INSERT INTO applications (id, client_id, consultant_id, service_type, status, total_amount, currency, service_country_id, application_data, source_type, priority_level, created_at) VALUES
-  ('app1-1234-5678-9012-345678901234', 
+  (gen_random_uuid(), 
    (SELECT id FROM users WHERE email = 'ahmet@test.com'), 
    (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
    'company_formation', 'in_progress', 2500.00, 'USD', 1,
    '{"description": "Gürcistan LLC kurulumu", "submitted_via": "platform"}',
    'platform', 'normal', NOW() - INTERVAL '5 days'),
    
-  ('app2-1234-5678-9012-345678901234',
+  (gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'maria@test.com'),
    (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
    'accounting_services', 'pending', 299.00, 'USD', 1,
    '{"description": "Aylık muhasebe hizmeti", "submitted_via": "platform"}',
    'platform', 'normal', NOW() - INTERVAL '3 days'),
    
-  ('app3-1234-5678-9012-345678901234',
+  (gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'david@test.com'),
    (SELECT id FROM users WHERE email = 'georgia_consultant@consulting19.com'),
    'tax_optimization', 'completed', 1500.00, 'USD', 1,
    '{"description": "Vergi optimizasyonu danışmanlığı", "submitted_via": "platform"}',
    'platform', 'high', NOW() - INTERVAL '10 days');