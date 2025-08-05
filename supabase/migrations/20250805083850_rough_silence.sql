/*
  # Create Test Accounting Data

  1. Test Data Creation
    - Create comprehensive test data for accounting system
    - Include documents, payments, messages, and notifications
    - Set up realistic scenarios for testing

  2. Test Scenarios
    - Ahmet Yılmaz: Overdue payment, pending documents, active messages
    - Maria Garcia: All documents approved, no pending payments
    - David Smith: Documents approved, overdue payment
    - Business Client: Mixed status for comprehensive testing

  3. Real-time Testing
    - All data connected to real Supabase tables
    - RLS policies ensure proper access control
    - Live updates between consultant and client dashboards
*/

-- Create test documents for Ahmet Yılmaz (overdue payment, pending documents)
INSERT INTO client_documents (
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
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Ahmet's ID
  'Ocak Ayı Gelir Belgesi.pdf',
  'income_statement',
  'https://example.com/documents/income_jan.pdf',
  245760,
  'application/pdf',
  'client',
  'pending_review',
  NULL,
  true,
  NOW() - INTERVAL '2 hours'
),
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Banka Ekstresi - Aralık.pdf',
  'bank_statement',
  'https://example.com/documents/bank_dec.pdf',
  512000,
  'application/pdf',
  'client',
  'approved',
  'Belge onaylandı ve muhasebe kaydı yapıldı.',
  true,
  NOW() - INTERVAL '1 day'
);

-- Create test documents for Maria Garcia (all approved)
INSERT INTO client_documents (
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
(
  'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Maria's ID
  'Şubat Ayı Tüm Belgeler.zip',
  'financial_report',
  'https://example.com/documents/maria_feb.zip',
  1024000,
  'application/zip',
  'client',
  'approved',
  'Tüm belgeler eksiksiz ve onaylandı.',
  true,
  NOW() - INTERVAL '3 days'
);

-- Create test payment schedules
INSERT INTO client_payment_schedules (
  client_id,
  consultant_id,
  payment_type,
  description,
  amount,
  currency,
  due_date,
  status,
  recurring,
  recurring_interval,
  country_id,
  created_at
) VALUES 
-- Ahmet - Overdue payment
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Nino's ID
  'virtual_address',
  'Aylık sanal adres yenileme ücreti',
  50.00,
  'USD',
  CURRENT_DATE - INTERVAL '5 days', -- 5 days overdue
  'pending',
  true,
  'monthly',
  1, -- Georgia
  NOW() - INTERVAL '1 month'
),
-- Ahmet - Upcoming payment
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'accounting_fee',
  'Aylık muhasebe hizmet ücreti',
  299.00,
  'USD',
  CURRENT_DATE + INTERVAL '10 days',
  'pending',
  true,
  'monthly',
  1,
  NOW() - INTERVAL '1 month'
),
-- Maria - All paid
(
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'accounting_fee',
  'Aylık muhasebe hizmet ücreti',
  299.00,
  'USD',
  CURRENT_DATE - INTERVAL '5 days',
  'paid',
  true,
  'monthly',
  1,
  NOW() - INTERVAL '1 month'
),
-- David - Overdue payment
(
  'a7b8c9d0-e1f2-4456-8890-123456abcdef',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'tax_payment',
  'Vergi beyannamesi hazırlık ücreti',
  150.00,
  'USD',
  CURRENT_DATE - INTERVAL '10 days', -- 10 days overdue
  'pending',
  false,
  NULL,
  1,
  NOW() - INTERVAL '2 weeks'
);

-- Create test messages
INSERT INTO messages (
  sender_id,
  recipient_id,
  message,
  original_language,
  message_type,
  is_read,
  needs_translation,
  translation_status,
  created_at
) VALUES 
-- Nino to Ahmet
(
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Merhaba Ahmet! Ocak ayı belgelerinizi kontrol ettim. Gelir belgesi onaylandı ancak sanal adres ödemeniz gecikmiş.',
  'tr',
  'accounting',
  false,
  false,
  'not_needed',
  NOW() - INTERVAL '2 hours'
),
-- Ahmet to Nino
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Merhaba Nino! Ödemeyi bugün yapacağım. Şubat belgelerini de hazırlıyorum.',
  'tr',
  'accounting',
  false,
  false,
  'not_needed',
  NOW() - INTERVAL '1 hour'
),
-- Nino to Maria
(
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'Hola Maria! Todos tus documentos están aprobados. Excelente trabajo.',
  'es',
  'accounting',
  false,
  true,
  'pending',
  NOW() - INTERVAL '1 day'
);

-- Create test document requests (notifications)
INSERT INTO client_notifications (
  client_id,
  consultant_id,
  notification_type,
  title,
  message,
  priority,
  is_read,
  created_at
) VALUES 
-- Ahmet - Document request
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'document_request',
  'Şubat Ayı Gider Belgeleri',
  'Şubat ayına ait tüm gider belgelerinizi (faturalar, makbuzlar, sözleşmeler) yüklemeniz gerekiyor. Son tarih: 15 Mart.',
  'high',
  false,
  NOW() - INTERVAL '6 hours'
),
-- David - Document request
(
  'a7b8c9d0-e1f2-4456-8890-123456abcdef',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'document_request',
  'Vergi Beyannamesi Belgeleri',
  'Vergi beyannamesi için gerekli tüm belgeleri yüklemeniz gerekiyor.',
  'urgent',
  false,
  NOW() - INTERVAL '12 hours'
);

-- Create user notifications for real-time testing
INSERT INTO user_notifications (
  user_id,
  title,
  message,
  type,
  priority,
  action_url,
  is_read,
  created_at
) VALUES 
-- Notification for Nino about Ahmet's document
(
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Yeni Belge Yüklendi',
  'Ahmet Yılmaz yeni belge yükledi: Ocak Ayı Gelir Belgesi.pdf',
  'document',
  'normal',
  '/georgia/consultant-dashboard/accounting',
  false,
  NOW() - INTERVAL '2 hours'
),
-- Notification for Ahmet about overdue payment
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Ödeme Hatırlatması',
  'Sanal adres ödemenizin son tarihi geçmiştir. Lütfen en kısa sürede ödeme yapın.',
  'payment',
  'urgent',
  '/client#payments',
  false,
  NOW() - INTERVAL '1 day'
),
-- Notification for Maria about approval
(
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'Belgeler Onaylandı',
  'Tüm belgeleriniz onaylandı. Muhasebe işlemleriniz tamamlandı.',
  'success',
  'normal',
  '/client#documents',
  false,
  NOW() - INTERVAL '3 days'
);

-- Update user language preferences for testing
UPDATE users SET language = 'tr' WHERE email = 'ahmet@test.com';
UPDATE users SET language = 'es' WHERE email = 'maria@test.com';
UPDATE users SET language = 'en' WHERE email = 'david@test.com';
UPDATE users SET language = 'tr' WHERE email = 'client@consulting19.com';
UPDATE users SET language = 'tr' WHERE email = 'georgia_consultant@consulting19.com';