/*
  # Test kullanıcıları ve danışmanları ekleme

  1. Test Kullanıcıları
    - Admin kullanıcısı (sistem yöneticisi)
    - Gürcistan danışmanı (Nino Kvaratskhelia)
    - Genel danışman (Sarah Johnson)
    - Gürcistan müşterisi
    - Genel müşteri

  2. İlişkiler
    - Gürcistan müşterisi → Gürcistan danışmanına atanmış
    - Danışman ülke atamaları
    - Test başvuruları ve mesajları

  3. Güvenlik
    - RLS politikaları test edilecek
    - Kullanıcı rolleri doğru atanacak
*/

-- Test kullanıcıları ekle
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
  created_at
) VALUES 
-- Admin kullanıcısı
(
  'a1b2c3d4-e5f6-4123-8901-567890abcdef',
  'admin@consulting19.com',
  'admin',
  'System',
  'Administrator',
  NULL,
  NULL,
  'en',
  true,
  now()
),
-- Gürcistan danışmanı
(
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'georgia_consultant@consulting19.com',
  'consultant',
  'Nino',
  'Kvaratskhelia',
  1, -- Georgia country ID
  1,
  'tr',
  true,
  now()
),
-- Genel danışman (Estonia)
(
  'b2c3d4e5-f6a7-4901-8345-678901bcdefg',
  'consultant@consulting19.com',
  'consultant',
  'Sarah',
  'Johnson',
  4, -- Estonia country ID
  4,
  'en',
  true,
  now()
),
-- Gürcistan müşterisi
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'georgia_client@consulting19.com',
  'client',
  'Ahmet',
  'Yılmaz',
  1, -- Georgia country ID
  1,
  'tr',
  true,
  now()
),
-- Genel müşteri
(
  'd4e5f6a7-b8c9-4123-8567-890123defabc',
  'client@consulting19.com',
  'client',
  'John',
  'Smith',
  NULL,
  NULL,
  'en',
  true,
  now()
)
ON CONFLICT (email) DO NOTHING;

-- Danışman ülke atamalarını ekle
INSERT INTO consultant_country_assignments (
  consultant_id,
  country_id,
  is_primary,
  status,
  created_at
) VALUES 
-- Nino Kvaratskhelia - Gürcistan
(
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1, -- Georgia
  true,
  true,
  now()
),
-- Sarah Johnson - Estonia
(
  'b2c3d4e5-f6a7-4901-8345-678901bcdefg',
  4, -- Estonia
  true,
  true,
  now()
)
ON CONFLICT (consultant_id, country_id) DO NOTHING;

-- Test başvuruları ekle (müşteri-danışman bağlantısı için)
INSERT INTO applications (
  id,
  client_id,
  consultant_id,
  service_type,
  status,
  total_amount,
  currency,
  client_preferred_language,
  service_country_id,
  source_type,
  created_at
) VALUES 
-- Gürcistan müşterisinin Gürcistan danışmanına başvurusu
(
  'app1-2345-6789-abcd-ef1234567890',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Georgia client
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'Company Formation',
  'in_progress',
  2500.00,
  'USD',
  'tr',
  1, -- Georgia
  'platform',
  now()
),
-- Genel müşterinin Estonia danışmanına başvurusu
(
  'app2-3456-789a-bcde-f12345678901',
  'd4e5f6a7-b8c9-4123-8567-890123defabc', -- General client
  'b2c3d4e5-f6a7-4901-8345-678901bcdefg', -- Estonia consultant
  'Company Formation',
  'pending',
  3000.00,
  'USD',
  'en',
  4, -- Estonia
  'platform',
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Test mesajları ekle
INSERT INTO messages (
  id,
  sender_id,
  recipient_id,
  message,
  original_language,
  translated_message,
  translated_language,
  message_type,
  is_read,
  needs_translation,
  translation_status,
  created_at
) VALUES 
-- Gürcistan danışmanından müşteriye mesaj
(
  'msg1-2345-6789-abcd-ef1234567890',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Georgia client
  'Merhaba Ahmet Bey! Gürcistan şirket kuruluş süreciniz hakkında bilgi vermek istiyorum. Belgeleriniz hazır ve işlemler başladı.',
  'tr',
  'Hello Mr. Ahmet! I want to give you information about your Georgia company formation process. Your documents are ready and the procedures have started.',
  'en',
  'general',
  false,
  false,
  'completed',
  now() - interval '2 hours'
),
-- Müşteriden danışmana cevap
(
  'msg2-3456-789a-bcde-f12345678901',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Georgia client
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'Merhaba Nino Hanım! Çok teşekkür ederim. Süreç ne kadar sürecek? Banka hesabı açma işlemi de dahil mi?',
  'tr',
  'Hello Ms. Nino! Thank you very much. How long will the process take? Is the bank account opening process included?',
  'en',
  'general',
  true,
  false,
  'completed',
  now() - interval '1 hour'
),
-- Estonia danışmanından genel müşteriye mesaj
(
  'msg3-4567-89ab-cdef-123456789012',
  'b2c3d4e5-f6a7-4901-8345-678901bcdefg', -- Estonia consultant
  'd4e5f6a7-b8c9-4123-8567-890123defabc', -- General client
  'Hello John! Your Estonia e-Residency application is progressing well. We should have your digital ID ready within 3-5 business days.',
  'en',
  NULL,
  NULL,
  'general',
  false,
  false,
  'not_needed',
  now() - interval '30 minutes'
)
ON CONFLICT (id) DO NOTHING;

-- Test özel hizmetleri ekle
INSERT INTO consultant_custom_services (
  id,
  consultant_id,
  service_name,
  service_description,
  service_category,
  price,
  currency,
  active,
  created_at
) VALUES 
-- Nino'nun özel hizmetleri
(
  'srv1-2345-6789-abcd-ef1234567890',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Gürcistan Vergi Danışmanlığı',
  'Gürcistan vergi sistemi hakkında detaylı danışmanlık ve optimizasyon hizmetleri',
  'Tax Advisory',
  500.00,
  'USD',
  true,
  now()
),
(
  'srv2-3456-789a-bcde-f12345678901',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'Banka Hesabı Açma Desteği',
  'Gürcistan bankalarında hesap açma sürecinde tam destek',
  'Banking Solutions',
  300.00,
  'USD',
  true,
  now()
),
-- Sarah'ın özel hizmetleri
(
  'srv3-4567-89ab-cdef-123456789012',
  'b2c3d4e5-f6a7-4901-8345-678901bcdefg',
  'Estonia e-Residency Consulting',
  'Complete e-Residency application and digital business setup',
  'Digital Services',
  800.00,
  'USD',
  true,
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Test komisyon kayıtları ekle
INSERT INTO consultant_commission_ledger (
  id,
  consultant_id,
  revenue_source,
  source_reference_id,
  total_amount,
  platform_commission,
  consultant_commission,
  commission_rate,
  payout_status,
  created_at
) VALUES 
-- Nino'nun komisyonları
(
  'comm1-2345-6789-abcd-ef1234567890',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'platform_application',
  'app1-2345-6789-abcd-ef1234567890',
  2500.00,
  875.00, -- 35% platform
  1625.00, -- 65% consultant
  65.00,
  'pending',
  now()
),
-- Sarah'ın komisyonları
(
  'comm2-3456-789a-bcde-f12345678901',
  'b2c3d4e5-f6a7-4901-8345-678901bcdefg',
  'platform_application',
  'app2-3456-789a-bcde-f12345678901',
  3000.00,
  1050.00, -- 35% platform
  1950.00, -- 65% consultant
  65.00,
  'pending',
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Test müşteri belgeleri ekle
INSERT INTO client_documents (
  id,
  client_id,
  application_id,
  document_name,
  document_type,
  file_url,
  upload_source,
  status,
  created_at
) VALUES 
(
  'doc1-2345-6789-abcd-ef1234567890',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'app1-2345-6789-abcd-ef1234567890',
  'Pasaport_Ahmet_Yilmaz.pdf',
  'passport',
  '/documents/passport_ahmet.pdf',
  'client',
  'approved',
  now()
),
(
  'doc2-3456-789a-bcde-f12345678901',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'app1-2345-6789-abcd-ef1234567890',
  'Adres_Belgesi.pdf',
  'address_proof',
  '/documents/address_proof.pdf',
  'client',
  'pending_review',
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Test ödeme programları ekle
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
  created_at
) VALUES 
(
  'pay1-2345-6789-abcd-ef1234567890',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'virtual_address',
  'Aylık sanal adres yenileme ücreti',
  50.00,
  'USD',
  '2025-01-28',
  'pending',
  true,
  'monthly',
  now()
),
(
  'pay2-3456-789a-bcde-f12345678901',
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'accounting_fee',
  'Aylık muhasebe hizmet ücreti',
  299.00,
  'USD',
  '2025-02-01',
  'pending',
  true,
  'monthly',
  now()
)
ON CONFLICT (id) DO NOTHING;