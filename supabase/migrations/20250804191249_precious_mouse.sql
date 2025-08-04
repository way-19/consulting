/*
  # Georgia Test System Setup

  1. Test Users
    - 1 Georgia consultant (Nino Kvaratskhelia)
    - 3 Georgia test clients
  2. Applications
    - Real applications assigned to Georgia consultant
  3. Messages
    - Test messages between consultant and clients
  4. Documents
    - Test documents for accounting workflow
  5. Payment Schedules
    - Test payment schedules for clients
  6. Country Assignments
    - Proper consultant-country assignments

  This creates a complete test environment for Georgia consultant dashboard.
*/

-- Clean up existing test data first
DELETE FROM service_payment_requests WHERE consultant_id IN (
  SELECT id FROM users WHERE email LIKE '%test%' OR email LIKE '%georgia%'
);
DELETE FROM client_payment_schedules WHERE consultant_id IN (
  SELECT id FROM users WHERE email LIKE '%test%' OR email LIKE '%georgia%'
);
DELETE FROM client_documents WHERE client_id IN (
  SELECT id FROM users WHERE email LIKE '%test%' OR role = 'client'
);
DELETE FROM messages WHERE sender_id IN (
  SELECT id FROM users WHERE email LIKE '%test%' OR email LIKE '%georgia%'
);
DELETE FROM application_status_history WHERE application_id IN (
  SELECT id FROM applications WHERE consultant_id IN (
    SELECT id FROM users WHERE email LIKE '%test%' OR email LIKE '%georgia%'
  )
);
DELETE FROM applications WHERE consultant_id IN (
  SELECT id FROM users WHERE email LIKE '%test%' OR email LIKE '%georgia%'
);
DELETE FROM consultant_country_assignments WHERE consultant_id IN (
  SELECT id FROM users WHERE email LIKE '%test%' OR email LIKE '%georgia%'
);
DELETE FROM users WHERE email LIKE '%test%' OR (email LIKE '%georgia%' AND role = 'consultant');

-- 1. Create Georgia consultant
INSERT INTO users (
  id,
  email,
  role,
  first_name,
  last_name,
  country_id,
  primary_country_id,
  language,
  commission_rate,
  performance_rating,
  total_clients_served,
  status,
  created_at
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
  1247,
  true,
  '2023-01-01 00:00:00'
);

-- 2. Create Georgia test clients
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
  address,
  preferred_currency,
  timezone,
  marketing_consent,
  status,
  created_at
) VALUES 
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'ahmet@test.com',
  'client',
  'Ahmet',
  'Yılmaz',
  1, -- Georgia
  1, -- Georgia
  'tr',
  'Yılmaz Tech Ltd',
  'Teknoloji',
  'İstanbul, Türkiye',
  'USD',
  'Europe/Istanbul',
  true,
  true,
  '2024-01-15 10:00:00'
),
(
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'maria@test.com',
  'client',
  'Maria',
  'Garcia',
  1, -- Georgia
  1, -- Georgia
  'tr',
  'Garcia Import Export',
  'İthalat-İhracat',
  'Madrid, İspanya',
  'EUR',
  'Europe/Madrid',
  true,
  true,
  '2024-01-20 14:30:00'
),
(
  'a7b8c9d0-e1f2-4456-8890-123456abcdef',
  'david@test.com',
  'client',
  'David',
  'Smith',
  1, -- Georgia
  1, -- Georgia
  'en',
  'Smith Consulting LLC',
  'Danışmanlık',
  'New York, USA',
  'USD',
  'America/New_York',
  false,
  true,
  '2024-01-25 09:15:00'
);

-- 3. Assign Georgia consultant to Georgia country
INSERT INTO consultant_country_assignments (
  id,
  consultant_id,
  country_id,
  is_primary,
  assignment_date,
  status,
  created_at
) VALUES (
  'aa1bb2cc-dd3e-4ef5-6789-012345abcdef',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1, -- Georgia
  true,
  '2023-01-01 00:00:00',
  true,
  '2023-01-01 00:00:00'
);

-- 4. Create applications for each client assigned to Georgia consultant
INSERT INTO applications (
  id,
  client_id,
  consultant_id,
  service_type,
  service_country_id,
  status,
  total_amount,
  currency,
  client_preferred_language,
  application_data,
  source_type,
  priority_level,
  estimated_completion,
  created_at,
  updated_at
) VALUES 
(
  'app1-1234-5678-9012-345678901234',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
  'company_formation',
  1, -- Georgia
  'in_progress',
  2500.00,
  'USD',
  'tr',
  '{"description": "Gürcistan LLC kurulumu", "company_type": "LLC", "business_activity": "Teknoloji danışmanlığı"}',
  'platform',
  'normal',
  '2024-02-15',
  '2024-01-15 10:00:00',
  '2024-01-15 10:00:00'
),
(
  'app2-1234-5678-9012-345678901234',
  'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
  'accounting_services',
  1, -- Georgia
  'completed',
  1200.00,
  'EUR',
  'tr',
  '{"description": "Aylık muhasebe hizmetleri", "service_period": "12 months"}',
  'platform',
  'high',
  '2024-02-01',
  '2024-01-20 14:30:00',
  '2024-01-20 14:30:00'
),
(
  'app3-1234-5678-9012-345678901234',
  'a7b8c9d0-e1f2-4456-8890-123456abcdef', -- David
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
  'tax_optimization',
  1, -- Georgia
  'pending',
  3500.00,
  'USD',
  'en',
  '{"description": "Vergi optimizasyonu ve planlama", "business_size": "medium"}',
  'platform',
  'urgent',
  '2024-02-20',
  '2024-01-25 09:15:00',
  '2024-01-25 09:15:00'
);

-- 5. Create test messages between consultant and clients
INSERT INTO messages (
  id,
  sender_id,
  recipient_id,
  message,
  message_language,
  original_language,
  message_type,
  is_read,
  needs_translation,
  translation_status,
  created_at
) VALUES 
-- Ahmet ile mesajlar
(
  'msg1-1234-5678-9012-345678901234',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
  'Merhaba Ahmet Bey! Gürcistan LLC kurulumu için gerekli belgelerinizi aldım. Süreç başladı.',
  'tr',
  'tr',
  'general',
  false,
  false,
  'not_needed',
  '2024-01-16 09:00:00'
),
(
  'msg2-1234-5678-9012-345678901234',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
  'Merhaba Nino! Teşekkürler. Süreç ne kadar sürecek?',
  'tr',
  'tr',
  'general',
  true,
  false,
  'not_needed',
  '2024-01-16 10:30:00'
),
-- Maria ile mesajlar
(
  'msg3-1234-5678-9012-345678901234',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
  'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria
  'Hola Maria! Muhasebe hizmetleriniz tamamlandı. Raporları inceleyebilirsiniz.',
  'tr',
  'tr',
  'accounting',
  false,
  false,
  'not_needed',
  '2024-01-21 11:00:00'
),
-- David ile mesajlar
(
  'msg4-1234-5678-9012-345678901234',
  'a7b8c9d0-e1f2-4456-8890-123456abcdef', -- David
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
  'Hi Nino! I need urgent tax optimization for my consulting business.',
  'en',
  'en',
  'urgent',
  true,
  false,
  'not_needed',
  '2024-01-25 15:45:00'
);

-- 6. Create test documents for clients
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
  consultant_notes,
  is_required,
  created_at
) VALUES 
-- Ahmet'in belgeleri
(
  'doc1-1234-5678-9012-345678901234',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Ahmet_Passport_Copy.pdf',
  'passport',
  '/documents/ahmet_passport.pdf',
  1024000,
  'application/pdf',
  'client',
  'approved',
  'Pasaport kopyası onaylandı.',
  true,
  '2024-01-16 08:00:00'
),
(
  'doc2-1234-5678-9012-345678901234',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Ahmet_Bank_Statement.pdf',
  'bank_statement',
  '/documents/ahmet_bank.pdf',
  2048000,
  'application/pdf',
  'client',
  'pending_review',
  null,
  true,
  '2024-01-17 14:20:00'
),
-- Maria'nın belgeleri
(
  'doc3-1234-5678-9012-345678901234',
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'Maria_Company_Certificate.pdf',
  'company_certificate',
  '/documents/maria_certificate.pdf',
  1536000,
  'application/pdf',
  'consultant',
  'approved',
  'Şirket sertifikası hazırlandı ve onaylandı.',
  false,
  '2024-01-22 10:15:00'
),
-- David'in belgeleri
(
  'doc4-1234-5678-9012-345678901234',
  'a7b8c9d0-e1f2-4456-8890-123456abcdef',
  'David_Tax_Documents.pdf',
  'tax_document',
  '/documents/david_tax.pdf',
  3072000,
  'application/pdf',
  'client',
  'requires_update',
  'Vergi belgeleri eksik. Lütfen 2023 yılı beyannamesi ekleyin.',
  true,
  '2024-01-26 16:30:00'
);

-- 7. Create payment schedules for clients
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
  recurring_interval,
  next_payment_date,
  created_at
) VALUES 
-- Ahmet'in ödemeleri
(
  'pay1-1234-5678-9012-345678901234',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'company_formation',
  'Gürcistan LLC kurulum ücreti',
  2500.00,
  'USD',
  '2024-02-01',
  'pending',
  false,
  null,
  null,
  '2024-01-15 10:00:00'
),
(
  'pay2-1234-5678-9012-345678901234',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'virtual_address',
  'Aylık sanal adres ücreti',
  50.00,
  'USD',
  '2024-02-15',
  'pending',
  true,
  'monthly',
  '2024-03-15',
  '2024-01-15 10:00:00'
),
-- Maria'nın ödemeleri
(
  'pay3-1234-5678-9012-345678901234',
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'accounting_fee',
  'Aylık muhasebe hizmet ücreti',
  299.00,
  'EUR',
  '2024-02-01',
  'paid',
  true,
  'monthly',
  '2024-03-01',
  '2024-01-20 14:30:00'
),
-- David'in ödemeleri
(
  'pay4-1234-5678-9012-345678901234',
  'a7b8c9d0-e1f2-4456-8890-123456abcdef',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'tax_consultation',
  'Vergi optimizasyon danışmanlığı',
  3500.00,
  'USD',
  '2024-01-30',
  'overdue',
  false,
  null,
  null,
  '2024-01-25 09:15:00'
);

-- 8. Create consultant custom services
INSERT INTO consultant_custom_services (
  id,
  consultant_id,
  service_name,
  service_description,
  service_category,
  price,
  currency,
  requires_approval,
  active,
  recurring_service,
  recurring_interval,
  created_at
) VALUES 
(
  'srv1-1234-5678-9012-345678901234',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Gürcistan Vergi İkamet Danışmanlığı',
  'Gürcistan vergi ikametgahı başvurusu ve süreç yönetimi. Territorial vergi sisteminden faydalanın.',
  'Tax Advisory',
  1500.00,
  'USD',
  false,
  true,
  false,
  null,
  '2024-01-10 00:00:00'
),
(
  'srv2-1234-5678-9012-345678901234',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Aylık Muhasebe Paketi',
  'Gürcistan şirketleri için kapsamlı aylık muhasebe hizmetleri. Vergi beyannamesi dahil.',
  'Accounting Services',
  299.00,
  'USD',
  false,
  true,
  true,
  'monthly',
  '2024-01-10 00:00:00'
);

-- 9. Create service recommendations
INSERT INTO service_payment_requests (
  id,
  consultant_id,
  client_id,
  recommended_service_id,
  amount,
  currency,
  description,
  recommendation_message,
  is_recommendation,
  recommendation_status,
  recommended_at,
  status,
  created_at
) VALUES 
(
  'rec1-1234-5678-9012-345678901234',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet
  'srv1-1234-5678-9012-345678901234',
  1500.00,
  'USD',
  'Önerilen Hizmet: Gürcistan Vergi İkamet Danışmanlığı',
  'Ahmet Bey, şirketiniz kurulduktan sonra vergi ikametgahı almanızı öneriyorum. Bu sayede yabancı gelirlerinizden vergi ödemeyeceksiniz.',
  true,
  'pending',
  '2024-01-18 12:00:00',
  'pending',
  '2024-01-18 12:00:00'
);

-- 10. Create commission ledger entries
INSERT INTO consultant_commission_ledger (
  id,
  consultant_id,
  revenue_source,
  source_reference_id,
  client_reference,
  total_amount,
  platform_commission,
  consultant_commission,
  commission_rate,
  payout_status,
  tax_period,
  created_at
) VALUES 
(
  'com1-1234-5678-9012-345678901234',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'platform_application',
  'app2-1234-5678-9012-345678901234',
  'Maria Garcia - Accounting Services',
  1200.00,
  420.00, -- 35% platform
  780.00, -- 65% consultant
  65.00,
  'pending',
  '2024-01',
  '2024-01-22 00:00:00'
);

-- 11. Create client notifications for document requests
INSERT INTO client_notifications (
  id,
  client_id,
  consultant_id,
  notification_type,
  title,
  message,
  is_read,
  priority,
  created_at
) VALUES 
(
  'not1-1234-5678-9012-345678901234',
  'a7b8c9d0-e1f2-4456-8890-123456abcdef', -- David
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino
  'document_request',
  'Eksik Vergi Belgeleri',
  'David, vergi optimizasyon sürecini tamamlamak için 2023 yılı vergi beyannamesi ve gelir belgelerinizi yüklemeniz gerekiyor.',
  false,
  'high',
  '2024-01-26 17:00:00'
);

-- 12. Update application status history
INSERT INTO application_status_history (
  id,
  application_id,
  previous_status,
  new_status,
  changed_by,
  change_reason,
  estimated_completion,
  created_at
) VALUES 
(
  'hist1-1234-5678-9012-345678901234',
  'app1-1234-5678-9012-345678901234',
  'pending',
  'in_progress',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Belgeler onaylandı, kurulum süreci başlatıldı',
  '2024-02-15',
  '2024-01-17 10:00:00'
),
(
  'hist2-1234-5678-9012-345678901234',
  'app2-1234-5678-9012-345678901234',
  'in_progress',
  'completed',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Muhasebe hizmetleri başarıyla tamamlandı',
  null,
  '2024-01-22 16:00:00'
);