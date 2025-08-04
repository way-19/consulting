/*
  # Test Data Creation with Proper Consultant-Client Assignments

  1. Test Users
    - Creates admin, consultants, and clients
    - Proper role assignments and country relationships
  
  2. Consultant Country Assignments
    - Assigns consultants to specific countries
    - Sets up proper consultant-country relationships
  
  3. Client Applications
    - Creates applications that link clients to consultants
    - Ensures proper consultant assignment based on country
  
  4. Test Messages and Documents
    - Creates sample communication data
    - Sets up document management test data
*/

-- First, clean up existing test data
DELETE FROM messages WHERE sender_id IN (
  SELECT id FROM users WHERE email LIKE '%@consulting19.com' OR email LIKE '%@test.com'
);
DELETE FROM client_documents WHERE client_id IN (
  SELECT id FROM users WHERE email LIKE '%@consulting19.com' OR email LIKE '%@test.com'
);
DELETE FROM applications WHERE client_id IN (
  SELECT id FROM users WHERE email LIKE '%@consulting19.com' OR email LIKE '%@test.com'
);
DELETE FROM consultant_country_assignments WHERE consultant_id IN (
  SELECT id FROM users WHERE email LIKE '%@consulting19.com'
);
DELETE FROM users WHERE email LIKE '%@consulting19.com' OR email LIKE '%@test.com';

-- Create test admin
INSERT INTO users (
  id, email, role, first_name, last_name, language, status
) VALUES (
  'a1b2c3d4-e5f6-4123-8901-567890abcdef',
  'admin@consulting19.com',
  'admin',
  'System',
  'Administrator',
  'en',
  true
);

-- Create Georgia consultant
INSERT INTO users (
  id, email, role, first_name, last_name, country_id, primary_country_id, 
  language, commission_rate, performance_rating, total_clients_served, status
) VALUES (
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'georgia_consultant@consulting19.com',
  'consultant',
  'Nino',
  'Kvaratskhelia',
  1, -- Georgia
  1, -- Georgia
  'tr',
  65.00,
  4.9,
  15,
  true
);

-- Create Estonia consultant
INSERT INTO users (
  id, email, role, first_name, last_name, country_id, primary_country_id,
  language, commission_rate, performance_rating, total_clients_served, status
) VALUES (
  'b2c3d4e5-f6a7-4901-8345-678901bcdefg',
  'estonia_consultant@consulting19.com',
  'consultant',
  'Sarah',
  'Johnson',
  4, -- Estonia
  4, -- Estonia
  'en',
  65.00,
  4.8,
  12,
  true
);

-- Assign consultants to their countries
INSERT INTO consultant_country_assignments (
  consultant_id, country_id, is_primary, status
) VALUES 
  ('c3d4e5f6-a7b8-4012-8456-789012cdefab', 1, true, true), -- Nino -> Georgia
  ('b2c3d4e5-f6a7-4901-8345-678901bcdefg', 4, true, true); -- Sarah -> Estonia

-- Create test clients for Georgia consultant
INSERT INTO users (
  id, email, role, first_name, last_name, country_id, primary_country_id,
  language, company_name, business_type, status
) VALUES 
  ('e5f6a7b8-c9d0-4234-8678-901234efabcd',
   'ahmet@test.com',
   'client',
   'Ahmet',
   'Yılmaz',
   1, -- Georgia
   1, -- Georgia
   'tr',
   'Yılmaz Tech Ltd',
   'Technology',
   true),
  ('f6a7b8c9-d0e1-4345-8789-012345fabcde',
   'maria@test.com',
   'client',
   'Maria',
   'Garcia',
   1, -- Georgia
   1, -- Georgia
   'tr',
   'Garcia Consulting',
   'Consulting',
   true),
  ('a7b8c9d0-e1f2-4456-8890-123456abcdef',
   'david@test.com',
   'client',
   'David',
   'Smith',
   1, -- Georgia
   1, -- Georgia
   'en',
   'Smith Enterprises',
   'Import/Export',
   true);

-- Create test clients for Estonia consultant
INSERT INTO users (
  id, email, role, first_name, last_name, country_id, primary_country_id,
  language, company_name, business_type, status
) VALUES 
  ('b8c9d0e1-f2a3-4567-8901-234567bcdefg',
   'erik@test.com',
   'client',
   'Erik',
   'Tamm',
   4, -- Estonia
   4, -- Estonia
   'en',
   'Tamm Digital OÜ',
   'Software Development',
   true),
  ('c9d0e1f2-a3b4-4678-8012-345678cdefgh',
   'anna@test.com',
   'client',
   'Anna',
   'Kask',
   4, -- Estonia
   4, -- Estonia
   'en',
   'Kask Investments',
   'Investment',
   true);

-- Create applications that assign clients to consultants
INSERT INTO applications (
  id, client_id, consultant_id, service_type, service_country_id, 
  total_amount, currency, status, priority_level, source_type,
  application_data, created_at
) VALUES 
  -- Georgia consultant applications
  (gen_random_uuid(),
   'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
   'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
   'company_formation',
   1, -- Georgia
   2500.00,
   'USD',
   'in_progress',
   'normal',
   'platform',
   '{"description": "LLC formation for tech company", "submitted_via": "platform"}',
   NOW() - INTERVAL '5 days'),
   
  (gen_random_uuid(),
   'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
   'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
   'accounting_services',
   1, -- Georgia
   1200.00,
   'USD',
   'pending',
   'high',
   'platform',
   '{"description": "Monthly accounting services", "submitted_via": "platform"}',
   NOW() - INTERVAL '3 days'),
   
  (gen_random_uuid(),
   'a7b8c9d0-e1f2-4456-8890-123456abcdef', -- David
   'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
   'tax_optimization',
   1, -- Georgia
   3500.00,
   'USD',
   'completed',
   'normal',
   'platform',
   '{"description": "Tax residency and optimization", "submitted_via": "platform"}',
   NOW() - INTERVAL '10 days'),
   
  -- Estonia consultant applications
  (gen_random_uuid(),
   'b8c9d0e1-f2a3-4567-8901-234567bcdefg', -- Erik
   'b2c3d4e5-f6a7-4901-8345-678901bcdefg', -- Sarah
   'company_formation',
   4, -- Estonia
   1800.00,
   'EUR',
   'in_progress',
   'normal',
   'platform',
   '{"description": "OÜ formation for software company", "submitted_via": "platform"}',
   NOW() - INTERVAL '7 days'),
   
  (gen_random_uuid(),
   'c9d0e1f2-a3b4-4678-8012-345678cdefgh', -- Anna
   'b2c3d4e5-f6a7-4901-8345-678901bcdefg', -- Sarah
   'investment_advisory',
   4, -- Estonia
   5000.00,
   'EUR',
   'pending',
   'high',
   'platform',
   '{"description": "Investment fund setup", "submitted_via": "platform"}',
   NOW() - INTERVAL '2 days');

-- Create test messages between consultants and clients
INSERT INTO messages (
  id, sender_id, recipient_id, message, message_type, original_language,
  needs_translation, translation_status, is_read, created_at
) VALUES 
  -- Georgia consultant messages
  (gen_random_uuid(),
   'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
   'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
   'Merhaba Ahmet! Gürcistan LLC kurulumunuz için gerekli belgeler hazırlandı. İncelemeniz için gönderiyorum.',
   'general',
   'tr',
   false,
   'not_needed',
   false,
   NOW() - INTERVAL '2 hours'),
   
  (gen_random_uuid(),
   'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
   'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
   'Merhaba Nino! Teşekkürler. Belgeleri inceledim, her şey mükemmel görünüyor.',
   'general',
   'tr',
   false,
   'not_needed',
   true,
   NOW() - INTERVAL '1 hour'),
   
  (gen_random_uuid(),
   'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
   'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
   'Merhaba Maria! Muhasebe hizmetiniz için aylık belge toplama sürecini başlattık.',
   'accounting',
   'tr',
   false,
   'not_needed',
   false,
   NOW() - INTERVAL '6 hours'),
   
  -- Estonia consultant messages
  (gen_random_uuid(),
   'b2c3d4e5-f6a7-4901-8345-678901bcdefg', -- Sarah
   'b8c9d0e1-f2a3-4567-8901-234567bcdefg', -- Erik
   'Hello Erik! Your Estonian OÜ formation is progressing well. We should have everything ready by next week.',
   'general',
   'en',
   false,
   'not_needed',
   false,
   NOW() - INTERVAL '4 hours');

-- Create test client documents
INSERT INTO client_documents (
  id, client_id, document_name, document_type, file_url, 
  upload_source, status, created_at
) VALUES 
  (gen_random_uuid(),
   'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
   'Passport Copy',
   'identity_document',
   '/documents/ahmet_passport.pdf',
   'client',
   'approved',
   NOW() - INTERVAL '3 days'),
   
  (gen_random_uuid(),
   'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
   'Bank Statement',
   'bank_statement',
   '/documents/ahmet_bank_statement.pdf',
   'client',
   'pending_review',
   NOW() - INTERVAL '1 day'),
   
  (gen_random_uuid(),
   'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
   'Business Plan',
   'business_document',
   '/documents/maria_business_plan.pdf',
   'client',
   'approved',
   NOW() - INTERVAL '5 days');

-- Create payment schedules
INSERT INTO client_payment_schedules (
  id, client_id, consultant_id, country_id, payment_type, description,
  amount, currency, due_date, status, recurring, created_at
) VALUES 
  (gen_random_uuid(),
   'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
   'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
   1, -- Georgia
   'company_formation',
   'LLC formation service fee',
   2500.00,
   'USD',
   CURRENT_DATE + INTERVAL '7 days',
   'pending',
   false,
   NOW()),
   
  (gen_random_uuid(),
   'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
   'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
   1, -- Georgia
   'accounting_fee',
   'Monthly accounting services',
   299.00,
   'USD',
   CURRENT_DATE + INTERVAL '3 days',
   'pending',
   true,
   NOW());

-- Update consultant statistics
UPDATE users SET 
  total_clients_served = (
    SELECT COUNT(DISTINCT client_id) 
    FROM applications 
    WHERE consultant_id = users.id
  ),
  performance_rating = CASE 
    WHEN id = 'c3d4e5f6-a7b8-4012-8456-789012cdefab' THEN 4.9
    WHEN id = 'b2c3d4e5-f6a7-4901-8345-678901bcdefg' THEN 4.8
    ELSE performance_rating
  END
WHERE role = 'consultant';