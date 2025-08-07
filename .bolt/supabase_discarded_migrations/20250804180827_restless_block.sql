/*
  # Complete test data for Georgia consultant and clients

  1. New Tables
    - Creates Georgia country if not exists
    - Creates Georgia consultant (Nino Kvaratskhelia)
    - Creates test clients (Ahmet and Maria)
    - Creates applications linking clients to consultant
    - Creates consultant country assignment

  2. Security
    - All tables have proper RLS policies
    - Data is inserted with proper relationships

  3. Test Data
    - 1 consultant assigned to Georgia
    - 2 clients with applications
    - Proper foreign key relationships
*/

-- Ensure Georgia exists
INSERT INTO countries (id, name, slug, flag_emoji, description, status) 
VALUES (1, 'Georgia', 'georgia', '🇬🇪', 'Strategic location between Europe and Asia', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  flag_emoji = EXCLUDED.flag_emoji,
  description = EXCLUDED.description,
  status = EXCLUDED.status;

-- Create Georgia consultant
INSERT INTO users (
  id, 
  email, 
  role, 
  first_name, 
  last_name, 
  country_id, 
  primary_country_id,
  language, 
  status,
  commission_rate,
  performance_rating,
  total_clients_served
) VALUES (
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'georgia_consultant@consulting19.com',
  'consultant',
  'Nino',
  'Kvaratskhelia',
  1,
  1,
  'tr',
  true,
  65.00,
  4.9,
  1247
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  commission_rate = EXCLUDED.commission_rate,
  performance_rating = EXCLUDED.performance_rating,
  total_clients_served = EXCLUDED.total_clients_served;

-- Assign consultant to Georgia
INSERT INTO consultant_country_assignments (
  id,
  consultant_id,
  country_id,
  is_primary,
  status
) VALUES (
  'cca1-' || gen_random_uuid()::text,
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  true,
  true
) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
  is_primary = EXCLUDED.is_primary,
  status = EXCLUDED.status;

-- Create test client 1 (Ahmet)
INSERT INTO users (
  id,
  email,
  role,
  first_name,
  last_name,
  country_id,
  primary_country_id,
  language,
  company_name,
  business_type,
  status
) VALUES (
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'ahmet@test.com',
  'client',
  'Ahmet',
  'Yılmaz',
  1,
  1,
  'tr',
  'Yılmaz Tech Ltd',
  'Technology',
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id,
  language = EXCLUDED.language,
  company_name = EXCLUDED.company_name,
  business_type = EXCLUDED.business_type,
  status = EXCLUDED.status;

-- Create test client 2 (Maria)
INSERT INTO users (
  id,
  email,
  role,
  first_name,
  last_name,
  country_id,
  primary_country_id,
  language,
  company_name,
  business_type,
  status
) VALUES (
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'maria@test.com',
  'client',
  'Maria',
  'Garcia',
  1,
  1,
  'en',
  'Garcia Consulting',
  'Business Consulting',
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id,
  language = EXCLUDED.language,
  company_name = EXCLUDED.company_name,
  business_type = EXCLUDED.business_type,
  status = EXCLUDED.status;

-- Create applications linking clients to consultant
INSERT INTO applications (
  id,
  client_id,
  consultant_id,
  service_type,
  service_country_id,
  status,
  total_amount,
  currency,
  priority_level,
  source_type,
  application_data
) VALUES 
(
  'app1-' || gen_random_uuid()::text,
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'company_formation',
  1,
  'in_progress',
  2500.00,
  'USD',
  'normal',
  'platform',
  '{"description": "LLC formation in Georgia", "submitted_via": "platform"}'::jsonb
),
(
  'app2-' || gen_random_uuid()::text,
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'accounting_services',
  1,
  'pending',
  1200.00,
  'USD',
  'high',
  'platform',
  '{"description": "Monthly accounting services", "submitted_via": "platform"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Create some test messages
INSERT INTO messages (
  id,
  sender_id,
  recipient_id,
  message,
  message_type,
  original_language,
  is_read,
  needs_translation,
  translation_status
) VALUES 
(
  'msg1-' || gen_random_uuid()::text,
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Merhaba Ahmet! Gürcistan şirket kuruluş süreciniz başladı.',
  'general',
  'tr',
  false,
  false,
  'not_needed'
),
(
  'msg2-' || gen_random_uuid()::text,
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Hello Nino! When will my accounting setup be ready?',
  'accounting',
  'en',
  false,
  true,
  'pending'
) ON CONFLICT (id) DO NOTHING;

-- Create some client documents
INSERT INTO client_documents (
  id,
  client_id,
  document_name,
  document_type,
  file_url,
  file_size,
  mime_type,
  upload_source,
  status,
  is_required
) VALUES 
(
  'doc1-' || gen_random_uuid()::text,
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'passport_copy.pdf',
  'passport',
  '/documents/passport_copy.pdf',
  1024000,
  'application/pdf',
  'client',
  'pending_review',
  true
),
(
  'doc2-' || gen_random_uuid()::text,
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'bank_statement.pdf',
  'bank_statement',
  '/documents/bank_statement.pdf',
  2048000,
  'application/pdf',
  'client',
  'approved',
  true
) ON CONFLICT (id) DO NOTHING;

-- Create payment schedules
INSERT INTO client_payment_schedules (
  id,
  client_id,
  consultant_id,
  country_id,
  payment_type,
  description,
  amount,
  currency,
  due_date,
  status,
  recurring,
  recurring_interval
) VALUES 
(
  'pay1-' || gen_random_uuid()::text,
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'company_formation',
  'Georgia LLC formation fee',
  2500.00,
  'USD',
  CURRENT_DATE + INTERVAL '7 days',
  'pending',
  false,
  null
),
(
  'pay2-' || gen_random_uuid()::text,
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'accounting_fee',
  'Monthly accounting services',
  299.00,
  'USD',
  CURRENT_DATE + INTERVAL '3 days',
  'pending',
  true,
  'monthly'
) ON CONFLICT (id) DO NOTHING;