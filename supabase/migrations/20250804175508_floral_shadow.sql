/*
  # Create test data for Georgia consultant and clients

  1. Test Data Creation
    - Ensures Georgia country exists
    - Creates Georgia consultant with proper assignments
    - Creates test clients assigned to Georgia consultant
    - Creates applications linking clients to consultant
    - Creates test documents and payment schedules

  2. Data Structure
    - 1 Georgia consultant (Nino Kvaratskhelia)
    - 2 test clients (Ahmet Yılmaz, Maria Garcia)
    - Multiple applications for realistic testing
    - Sample documents and payment schedules

  3. Purpose
    - Enable proper testing of consultant-client relationships
    - Provide realistic data for all consultant modules
    - Ensure custom services can be recommended to clients
*/

-- Ensure Georgia country exists
INSERT INTO countries (id, name, slug, flag_emoji, description, status) 
VALUES (1, 'Georgia', 'georgia', '🇬🇪', 'Strategic location between Europe and Asia with favorable tax system', true)
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
  'cca1-georgia-assignment',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  true,
  true
) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
  is_primary = EXCLUDED.is_primary,
  status = EXCLUDED.status;

-- Create test client 1: Ahmet Yılmaz
INSERT INTO users (
  id,
  email,
  role,
  first_name,
  last_name,
  company_name,
  business_type,
  country_id,
  primary_country_id,
  language,
  status
) VALUES (
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'ahmet@test.com',
  'client',
  'Ahmet',
  'Yılmaz',
  'Yılmaz Teknoloji Ltd.',
  'Teknoloji',
  1,
  1,
  'tr',
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
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
  id,
  email,
  role,
  first_name,
  last_name,
  company_name,
  business_type,
  country_id,
  primary_country_id,
  language,
  status
) VALUES (
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'maria@test.com',
  'client',
  'Maria',
  'Garcia',
  'Garcia Import Export',
  'İthalat-İhracat',
  1,
  1,
  'tr',
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  company_name = EXCLUDED.company_name,
  business_type = EXCLUDED.business_type,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id,
  language = EXCLUDED.language,
  status = EXCLUDED.status;

-- Create application 1: Ahmet's company formation
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
) VALUES (
  'app1-ahmet-company-formation',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'company_formation',
  1,
  'in_progress',
  2500.00,
  'USD',
  'normal',
  'platform',
  '{"description": "Gürcistan LLC kurulumu", "submitted_via": "platform"}'
) ON CONFLICT (id) DO UPDATE SET
  client_id = EXCLUDED.client_id,
  consultant_id = EXCLUDED.consultant_id,
  service_type = EXCLUDED.service_type,
  service_country_id = EXCLUDED.service_country_id,
  status = EXCLUDED.status,
  total_amount = EXCLUDED.total_amount,
  currency = EXCLUDED.currency,
  priority_level = EXCLUDED.priority_level,
  source_type = EXCLUDED.source_type,
  application_data = EXCLUDED.application_data;

-- Create application 2: Maria's accounting services
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
) VALUES (
  'app2-maria-accounting',
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'accounting_services',
  1,
  'pending',
  1200.00,
  'USD',
  'high',
  'platform',
  '{"description": "Aylık muhasebe hizmetleri", "submitted_via": "platform"}'
) ON CONFLICT (id) DO UPDATE SET
  client_id = EXCLUDED.client_id,
  consultant_id = EXCLUDED.consultant_id,
  service_type = EXCLUDED.service_type,
  service_country_id = EXCLUDED.service_country_id,
  status = EXCLUDED.status,
  total_amount = EXCLUDED.total_amount,
  currency = EXCLUDED.currency,
  priority_level = EXCLUDED.priority_level,
  source_type = EXCLUDED.source_type,
  application_data = EXCLUDED.application_data;

-- Create application 3: Ahmet's tax residency
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
) VALUES (
  'app3-ahmet-tax-residency',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'tax_optimization',
  1,
  'completed',
  1800.00,
  'USD',
  'normal',
  'platform',
  '{"description": "Gürcistan vergi mukimliği", "submitted_via": "platform"}'
) ON CONFLICT (id) DO UPDATE SET
  client_id = EXCLUDED.client_id,
  consultant_id = EXCLUDED.consultant_id,
  service_type = EXCLUDED.service_type,
  service_country_id = EXCLUDED.service_country_id,
  status = EXCLUDED.status,
  total_amount = EXCLUDED.total_amount,
  currency = EXCLUDED.currency,
  priority_level = EXCLUDED.priority_level,
  source_type = EXCLUDED.source_type,
  application_data = EXCLUDED.application_data;

-- Create test documents for Ahmet
INSERT INTO client_documents (
  id,
  client_id,
  document_name,
  document_type,
  file_url,
  upload_source,
  status,
  consultant_notes
) VALUES 
(
  'doc1-ahmet-passport',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Ahmet_Passport_Copy.pdf',
  'passport',
  '/documents/ahmet_passport.pdf',
  'client',
  'approved',
  'Pasaport kopyası onaylandı'
),
(
  'doc2-ahmet-bank-statement',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Bank_Statement_January.pdf',
  'bank_statement',
  '/documents/ahmet_bank_statement.pdf',
  'client',
  'pending_review',
  NULL
) ON CONFLICT (id) DO UPDATE SET
  client_id = EXCLUDED.client_id,
  document_name = EXCLUDED.document_name,
  document_type = EXCLUDED.document_type,
  file_url = EXCLUDED.file_url,
  upload_source = EXCLUDED.upload_source,
  status = EXCLUDED.status,
  consultant_notes = EXCLUDED.consultant_notes;

-- Create test documents for Maria
INSERT INTO client_documents (
  id,
  client_id,
  document_name,
  document_type,
  file_url,
  upload_source,
  status,
  consultant_notes
) VALUES 
(
  'doc3-maria-company-docs',
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'Company_Registration_Documents.pdf',
  'company_document',
  '/documents/maria_company_docs.pdf',
  'client',
  'approved',
  'Şirket belgeleri onaylandı'
),
(
  'doc4-maria-financial',
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'Financial_Statements_2023.pdf',
  'financial_report',
  '/documents/maria_financial.pdf',
  'client',
  'requires_update',
  'Mali tablolar güncellenmeli - 2024 verileri eksik'
) ON CONFLICT (id) DO UPDATE SET
  client_id = EXCLUDED.client_id,
  document_name = EXCLUDED.document_name,
  document_type = EXCLUDED.document_type,
  file_url = EXCLUDED.file_url,
  upload_source = EXCLUDED.upload_source,
  status = EXCLUDED.status,
  consultant_notes = EXCLUDED.consultant_notes;

-- Create payment schedules for clients
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
  'pay1-ahmet-monthly-accounting',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'accounting_fee',
  'Aylık muhasebe hizmet ücreti',
  299.00,
  'USD',
  '2025-02-15',
  'pending',
  true,
  'monthly'
),
(
  'pay2-maria-company-setup',
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'company_maintenance',
  'Şirket bakım ve uyumluluk ücreti',
  450.00,
  'USD',
  '2025-02-10',
  'pending',
  false,
  NULL
),
(
  'pay3-ahmet-tax-consultation',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'consultation_fee',
  'Vergi danışmanlığı ücreti',
  180.00,
  'USD',
  '2025-01-30',
  'overdue',
  false,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  client_id = EXCLUDED.client_id,
  consultant_id = EXCLUDED.consultant_id,
  country_id = EXCLUDED.country_id,
  payment_type = EXCLUDED.payment_type,
  description = EXCLUDED.description,
  amount = EXCLUDED.amount,
  currency = EXCLUDED.currency,
  due_date = EXCLUDED.due_date,
  status = EXCLUDED.status,
  recurring = EXCLUDED.recurring,
  recurring_interval = EXCLUDED.recurring_interval;

-- Create test messages between consultant and clients
INSERT INTO messages (
  id,
  sender_id,
  recipient_id,
  message,
  message_type,
  original_language,
  is_read,
  needs_translation
) VALUES 
(
  'msg1-nino-to-ahmet',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Merhaba Ahmet Bey, Gürcistan şirket kuruluş süreciniz başarıyla tamamlandı. Tebrikler!',
  'general',
  'tr',
  true,
  false
),
(
  'msg2-ahmet-to-nino',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Teşekkürler Nino Hanım! Şimdi banka hesabı açma sürecine geçebilir miyiz?',
  'general',
  'tr',
  false,
  false
),
(
  'msg3-nino-to-maria',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'Merhaba Maria Hanım, muhasebe belgelerinizi inceledim. Birkaç eksik belge var, size liste göndereceğim.',
  'accounting',
  'tr',
  true,
  false
) ON CONFLICT (id) DO UPDATE SET
  sender_id = EXCLUDED.sender_id,
  recipient_id = EXCLUDED.recipient_id,
  message = EXCLUDED.message,
  message_type = EXCLUDED.message_type,
  original_language = EXCLUDED.original_language,
  is_read = EXCLUDED.is_read,
  needs_translation = EXCLUDED.needs_translation;

-- Create sample custom services for the consultant
INSERT INTO consultant_custom_services (
  id,
  consultant_id,
  service_name,
  service_description,
  service_category,
  price,
  currency,
  active,
  recurring_service,
  recurring_interval
) VALUES 
(
  'service1-georgia-tax-consulting',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Gürcistan Vergi Danışmanlığı',
  'Gürcistan vergi sistemi hakkında kapsamlı danışmanlık ve optimizasyon hizmetleri',
  'Tax Advisory',
  350.00,
  'USD',
  true,
  false,
  NULL
),
(
  'service2-monthly-bookkeeping',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Aylık Muhasebe Hizmetleri',
  'Gürcistan şirketleri için aylık defter tutma ve mali raporlama hizmetleri',
  'Accounting Services',
  299.00,
  'USD',
  true,
  true,
  'monthly'
),
(
  'service3-bank-account-assistance',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Banka Hesabı Açma Yardımı',
  'Gürcistan bankalarında hesap açma sürecinde tam destek ve rehberlik',
  'Banking Solutions',
  450.00,
  'USD',
  true,
  false,
  NULL
) ON CONFLICT (id) DO UPDATE SET
  consultant_id = EXCLUDED.consultant_id,
  service_name = EXCLUDED.service_name,
  service_description = EXCLUDED.service_description,
  service_category = EXCLUDED.service_category,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  active = EXCLUDED.active,
  recurring_service = EXCLUDED.recurring_service,
  recurring_interval = EXCLUDED.recurring_interval;