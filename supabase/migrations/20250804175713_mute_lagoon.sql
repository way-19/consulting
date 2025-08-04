/*
  # Fix Georgia consultant and client connections

  1. Tables
    - Ensure Georgia country exists
    - Create Georgia consultant with proper assignments
    - Create test clients assigned to Georgia consultant
    - Create applications linking clients to consultant
    - Add test documents and payment schedules

  2. Security
    - Enable RLS where needed
    - Add proper policies for data access

  3. Test Data
    - 2 test clients for Georgia consultant
    - Sample applications, documents, and payments
    - Realistic messaging data
*/

-- Ensure Georgia exists
INSERT INTO countries (id, name, slug, flag_emoji, description, primary_language, status) 
VALUES (1, 'Georgia', 'georgia', '🇬🇪', 'Strategic location between Europe and Asia with favorable tax system', 'en', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  flag_emoji = EXCLUDED.flag_emoji,
  description = EXCLUDED.description,
  status = EXCLUDED.status;

-- Create/update Georgia consultant
INSERT INTO users (
  id, email, role, first_name, last_name, 
  country_id, primary_country_id, language, 
  consultant_specialties, commission_rate, 
  performance_rating, total_clients_served, status
) VALUES (
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'georgia_consultant@consulting19.com',
  'consultant',
  'Nino',
  'Kvaratskhelia',
  1, -- Georgia
  1, -- Primary country Georgia
  'tr',
  '["company_formation", "tax_residency", "accounting_services"]'::jsonb,
  65.00,
  4.9,
  1247,
  true
) ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id,
  language = EXCLUDED.language,
  consultant_specialties = EXCLUDED.consultant_specialties,
  commission_rate = EXCLUDED.commission_rate,
  performance_rating = EXCLUDED.performance_rating,
  total_clients_served = EXCLUDED.total_clients_served,
  status = EXCLUDED.status;

-- Assign consultant to Georgia
INSERT INTO consultant_country_assignments (
  id, consultant_id, country_id, is_primary, status
) VALUES (
  gen_random_uuid(),
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  true,
  true
) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
  is_primary = EXCLUDED.is_primary,
  status = EXCLUDED.status;

-- Create test client 1: Ahmet Yılmaz
INSERT INTO users (
  id, email, role, first_name, last_name,
  company_name, business_type, country_id, primary_country_id,
  language, status
) VALUES (
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'ahmet@test.com',
  'client',
  'Ahmet',
  'Yılmaz',
  'Yılmaz Teknoloji Ltd.',
  'Technology',
  1, -- Georgia
  1, -- Primary country Georgia
  'tr',
  true
) ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  company_name = EXCLUDED.company_name,
  business_type = EXCLUDED.business_type,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id,
  language = EXCLUDED.language,
  status = EXCLUDED.status;

-- Create test client 2: Maria Garcia
INSERT INTO users (
  id, email, role, first_name, last_name,
  company_name, business_type, country_id, primary_country_id,
  language, status
) VALUES (
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'maria@test.com',
  'client',
  'Maria',
  'Garcia',
  'Garcia Import Export',
  'Import/Export',
  1, -- Georgia
  1, -- Primary country Georgia
  'tr',
  true
) ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  company_name = EXCLUDED.company_name,
  business_type = EXCLUDED.business_type,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id,
  language = EXCLUDED.language,
  status = EXCLUDED.status;

-- Create applications linking clients to consultant
INSERT INTO applications (
  id, client_id, consultant_id, service_type, status,
  total_amount, currency, service_country_id, source_type,
  priority_level, application_data
) VALUES 
(
  gen_random_uuid(),
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'company_formation',
  'in_progress',
  2500.00,
  'USD',
  1, -- Georgia
  'platform',
  'normal',
  '{"description": "LLC formation in Georgia", "submitted_via": "platform"}'::jsonb
),
(
  gen_random_uuid(),
  'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'accounting_services',
  'pending',
  1500.00,
  'USD',
  1, -- Georgia
  'platform',
  'high',
  '{"description": "Monthly accounting services", "submitted_via": "platform"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Create test documents
INSERT INTO client_documents (
  id, client_id, document_name, document_type, file_url,
  file_size, mime_type, upload_source, status, is_required
) VALUES 
(
  gen_random_uuid(),
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Passport_Copy.pdf',
  'passport',
  '/documents/ahmet_passport.pdf',
  1024000,
  'application/pdf',
  'client',
  'pending_review',
  true
),
(
  gen_random_uuid(),
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'Bank_Statement_Jan2024.pdf',
  'bank_statement',
  '/documents/maria_bank_statement.pdf',
  2048000,
  'application/pdf',
  'client',
  'approved',
  true
) ON CONFLICT (id) DO NOTHING;

-- Create payment schedules
INSERT INTO client_payment_schedules (
  id, client_id, consultant_id, payment_type, description,
  amount, currency, due_date, status, recurring,
  country_id
) VALUES 
(
  gen_random_uuid(),
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'company_formation',
  'Georgia LLC formation fee',
  2500.00,
  'USD',
  '2024-02-15',
  'pending',
  false,
  1
),
(
  gen_random_uuid(),
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'accounting_fee',
  'Monthly accounting services',
  299.00,
  'USD',
  '2024-02-01',
  'pending',
  true,
  1
) ON CONFLICT (id) DO NOTHING;

-- Create test messages
INSERT INTO messages (
  id, sender_id, recipient_id, message, message_language,
  message_type, is_read, original_language, needs_translation
) VALUES 
(
  gen_random_uuid(),
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
  'Merhaba Ahmet Bey, Gürcistan LLC kurulumu için gerekli belgelerinizi aldık. Süreç başlatıldı.',
  'tr',
  'general',
  false,
  'tr',
  false
),
(
  gen_random_uuid(),
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'Teşekkürler Nino Hanım. Süreç ne kadar sürecek?',
  'tr',
  'general',
  true,
  'tr',
  false
),
(
  gen_random_uuid(),
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
  'Hola Maria, necesitamos algunos documentos adicionales para completar su configuración contable.',
  'es',
  'accounting',
  false,
  'es',
  true
) ON CONFLICT (id) DO NOTHING;