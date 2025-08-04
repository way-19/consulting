/*
  # Link Georgia Test Client to Georgia Consultant

  1. Updates
    - Link existing Georgia client to Georgia consultant
    - Create application for Georgia client with Georgia consultant
    - Ensure proper country assignments

  2. Test Data Setup
    - Georgia consultant: c3d4e5f6-a7b8-4012-8456-789012cdefab
    - Georgia client: e5f6a7b8-c9d0-4234-8678-901234efabcd
    - Georgia country: ID 1
*/

-- First, ensure Georgia consultant exists and is properly assigned to Georgia
INSERT INTO users (
  id, email, role, first_name, last_name, 
  country_id, primary_country_id, language, status
) VALUES (
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'georgia_consultant@consulting19.com',
  'consultant',
  'Nino',
  'Kvaratskhelia',
  1, -- Georgia
  1, -- Georgia
  'tr',
  true
) ON CONFLICT (id) DO UPDATE SET
  country_id = 1,
  primary_country_id = 1,
  role = 'consultant',
  status = true;

-- Ensure Georgia consultant is assigned to Georgia country
INSERT INTO consultant_country_assignments (
  consultant_id, country_id, is_primary, status
) VALUES (
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1, -- Georgia
  true,
  true
) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
  is_primary = true,
  status = true;

-- Ensure Georgia client exists
INSERT INTO users (
  id, email, role, first_name, last_name,
  country_id, primary_country_id, language, status,
  company_name, business_type
) VALUES (
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'georgia_client@consulting19.com',
  'client',
  'Ahmet',
  'Yılmaz',
  1, -- Georgia
  1, -- Georgia
  'tr',
  true,
  'Test Teknoloji Ltd',
  'Teknoloji'
) ON CONFLICT (id) DO UPDATE SET
  country_id = 1,
  primary_country_id = 1,
  role = 'client',
  status = true;

-- Create application linking Georgia client to Georgia consultant
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
  application_data,
  source_type
) VALUES (
  'app-georgia-test-001',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Georgia client
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'company_formation',
  1, -- Georgia
  'in_progress',
  2500.00,
  'USD',
  'normal',
  '{"description": "Georgia LLC kurulumu test başvurusu", "submitted_via": "test_data"}',
  'platform'
) ON CONFLICT (id) DO UPDATE SET
  consultant_id = 'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  status = 'in_progress';

-- Create a second test client for more realistic testing
INSERT INTO users (
  id, email, role, first_name, last_name,
  country_id, primary_country_id, language, status,
  company_name, business_type
) VALUES (
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'maria@test.com',
  'client',
  'Maria',
  'Garcia',
  1, -- Georgia
  1, -- Georgia
  'en',
  true,
  'Global Trade LLC',
  'Import/Export'
) ON CONFLICT (id) DO UPDATE SET
  country_id = 1,
  primary_country_id = 1,
  role = 'client',
  status = true;

-- Create second application
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
  application_data,
  source_type
) VALUES (
  'app-georgia-test-002',
  'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'accounting_services',
  1, -- Georgia
  'completed',
  1200.00,
  'USD',
  'normal',
  '{"description": "Muhasebe hizmetleri test başvurusu", "submitted_via": "test_data"}',
  'platform'
) ON CONFLICT (id) DO UPDATE SET
  consultant_id = 'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  status = 'completed';

-- Create some test documents for the clients
INSERT INTO client_documents (
  client_id,
  document_name,
  document_type,
  file_url,
  upload_source,
  status,
  is_required
) VALUES 
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Pasaport Kopyası',
  'identity_document',
  '/documents/test/passport_copy.pdf',
  'client',
  'approved',
  true
),
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Banka Ekstresi',
  'bank_statement',
  '/documents/test/bank_statement.pdf',
  'client',
  'pending_review',
  true
),
(
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'Şirket Kuruluş Belgesi',
  'company_certificate',
  '/documents/test/company_cert.pdf',
  'consultant',
  'approved',
  false
) ON CONFLICT DO NOTHING;

-- Create some test payment schedules
INSERT INTO client_payment_schedules (
  client_id,
  consultant_id,
  country_id,
  payment_type,
  description,
  amount,
  currency,
  due_date,
  status,
  recurring
) VALUES 
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'accounting_fee',
  'Aylık muhasebe hizmet ücreti',
  299.00,
  'USD',
  '2025-02-15',
  'pending',
  true
),
(
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'compliance_fee',
  'Yıllık uyumluluk kontrol ücreti',
  500.00,
  'USD',
  '2025-03-01',
  'pending',
  false
) ON CONFLICT DO NOTHING;