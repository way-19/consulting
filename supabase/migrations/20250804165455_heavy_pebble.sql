/*
  # Test müşteri atamaları ve atama süreci

  1. Test Verileri
    - Test müşterileri oluştur
    - Danışman-müşteri atamaları oluştur
    - Test başvuruları oluştur
  
  2. Atama Süreci
    - Yeni müşteri kaydı için trigger
    - Otomatik danışman atama fonksiyonu
    - Bildirim sistemi
*/

-- Test müşterileri oluştur
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
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'georgia_client@consulting19.com',
  'client',
  'Ahmet',
  'Yılmaz',
  1, -- Georgia
  1,
  'tr',
  true,
  now()
),
(
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'client2@consulting19.com',
  'client',
  'Maria',
  'Garcia',
  1, -- Georgia
  1,
  'en',
  true,
  now()
),
(
  'a7b8c9d0-e1f2-4456-8890-123456abcdef',
  'client3@consulting19.com',
  'client',
  'John',
  'Smith',
  2, -- USA (assuming USA has id 2)
  2,
  'en',
  true,
  now()
) ON CONFLICT (email) DO NOTHING;

-- Test başvuruları oluştur ve danışmanlara ata
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
  source_type,
  created_at
) VALUES 
(
  gen_random_uuid(),
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'company_formation',
  1, -- Georgia
  'in_progress',
  2500.00,
  'USD',
  'normal',
  '{"description": "Gürcistan LLC kurulumu", "submitted_via": "client_portal"}',
  'platform',
  now()
),
(
  gen_random_uuid(),
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'accounting_services',
  1, -- Georgia
  'pending',
  500.00,
  'USD',
  'high',
  '{"description": "Aylık muhasebe hizmeti", "submitted_via": "client_portal"}',
  'platform',
  now()
),
(
  gen_random_uuid(),
  'a7b8c9d0-e1f2-4456-8890-123456abcdef',
  'b2c3d4e5-f6a7-4901-8345-678901bcdefg', -- USA consultant
  'company_formation',
  2, -- USA
  'completed',
  3500.00,
  'USD',
  'normal',
  '{"description": "Delaware LLC formation", "submitted_via": "client_portal"}',
  'platform',
  now() - interval '10 days'
);

-- Test mesajları oluştur
INSERT INTO messages (
  id,
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
(
  gen_random_uuid(),
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Georgia client
  'Merhaba Ahmet Bey! Gürcistan şirket kuruluş süreciniz başladı. Gerekli belgelerinizi hazırlamanız gerekiyor.',
  'tr',
  'general',
  false,
  false,
  'not_needed',
  now() - interval '2 hours'
),
(
  gen_random_uuid(),
  'e5f6a7b8-c9d0-4234-8678-901234efabcd', -- Georgia client
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'Merhaba Nino! Hangi belgeleri hazırlamam gerekiyor?',
  'tr',
  'general',
  true,
  false,
  'not_needed',
  now() - interval '1 hour'
),
(
  gen_random_uuid(),
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  'f6a7b8c9-d0e1-4345-8789-012345fabcde', -- Client 2
  'Hello Maria! Your accounting service setup is ready. Please review the documents.',
  'en',
  'accounting',
  false,
  false,
  'not_needed',
  now() - interval '30 minutes'
);

-- Test belgeleri oluştur
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
(
  gen_random_uuid(),
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Pasaport Kopyası',
  'passport_copy',
  '/documents/passport_ahmet.pdf',
  1024000,
  'application/pdf',
  'client',
  'pending_review',
  null,
  true,
  now() - interval '1 day'
),
(
  gen_random_uuid(),
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'Adres Belgesi',
  'address_proof',
  '/documents/address_ahmet.pdf',
  512000,
  'application/pdf',
  'client',
  'approved',
  'Belge onaylandı, işleme devam edebiliriz.',
  true,
  now() - interval '2 days'
),
(
  gen_random_uuid(),
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'Şirket Kuruluş Belgesi',
  'company_certificate',
  '/documents/company_cert_maria.pdf',
  2048000,
  'application/pdf',
  'consultant',
  'approved',
  'Şirket kuruluş belgeniz hazır.',
  false,
  now() - interval '3 days'
);

-- Otomatik danışman atama fonksiyonu oluştur
CREATE OR REPLACE FUNCTION assign_consultant_to_application()
RETURNS TRIGGER AS $$
DECLARE
  assigned_consultant_id uuid;
BEGIN
  -- Eğer danışman zaten atanmışsa, hiçbir şey yapma
  IF NEW.consultant_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Hizmet ülkesine göre danışman bul
  SELECT cca.consultant_id INTO assigned_consultant_id
  FROM consultant_country_assignments cca
  JOIN users u ON u.id = cca.consultant_id
  WHERE cca.country_id = NEW.service_country_id
    AND cca.status = true
    AND u.status = true
    AND u.role = 'consultant'
  ORDER BY RANDOM() -- Rastgele seçim, gerçek sistemde workload'a göre seçilebilir
  LIMIT 1;

  -- Danışman bulunduysa ata
  IF assigned_consultant_id IS NOT NULL THEN
    NEW.consultant_id := assigned_consultant_id;
    
    -- Danışmana bildirim gönder
    INSERT INTO user_notifications (
      user_id,
      title,
      message,
      type,
      priority,
      metadata
    ) VALUES (
      assigned_consultant_id,
      'Yeni Müşteri Atandı',
      'Size yeni bir müşteri atandı. Başvuru detaylarını inceleyip müşteriyle iletişime geçin.',
      'info',
      'normal',
      jsonb_build_object('application_id', NEW.id, 'client_id', NEW.client_id)
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger oluştur
DROP TRIGGER IF EXISTS trigger_assign_consultant ON applications;
CREATE TRIGGER trigger_assign_consultant
  BEFORE INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION assign_consultant_to_application();

-- Müşteri hoş geldin bildirimi fonksiyonu
CREATE OR REPLACE FUNCTION send_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Sadece client rolü için hoş geldin bildirimi gönder
  IF NEW.role = 'client' THEN
    INSERT INTO user_notifications (
      user_id,
      title,
      message,
      type,
      priority
    ) VALUES (
      NEW.id,
      'CONSULTING19''a Hoş Geldiniz! 🎉',
      'Platformumuza hoş geldiniz! Başvuru sürecinizi takip edebilir, danışmanlarınızla iletişim kurabilir ve tüm hizmetlerimizden faydalanabilirsiniz.',
      'welcome',
      'normal'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Hoş geldin trigger'ı oluştur
DROP TRIGGER IF EXISTS trigger_welcome_notification ON users;
CREATE TRIGGER trigger_welcome_notification
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_notification();

-- Test için danışman-ülke atamaları oluştur (eğer yoksa)
INSERT INTO consultant_country_assignments (
  consultant_id,
  country_id,
  is_primary,
  status
) VALUES 
(
  'c3d4e5f6-a7b8-4012-8456-789012cdefab', -- Georgia consultant
  1, -- Georgia
  true,
  true
),
(
  'b2c3d4e5-f6a7-4901-8345-678901bcdefg', -- USA consultant  
  2, -- USA (assuming USA has id 2)
  true,
  true
) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
  status = EXCLUDED.status,
  is_primary = EXCLUDED.is_primary;

-- Test ödeme takvimleri oluştur
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
  recurring,
  recurring_interval,
  next_payment_date
) VALUES 
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'virtual_address',
  'Aylık sanal adres yenileme ücreti',
  50.00,
  'USD',
  CURRENT_DATE + INTERVAL '5 days',
  'pending',
  true,
  'monthly',
  CURRENT_DATE + INTERVAL '35 days'
),
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'accounting_fee',
  'Aylık muhasebe hizmet ücreti',
  299.00,
  'USD',
  CURRENT_DATE + INTERVAL '10 days',
  'pending',
  true,
  'monthly',
  CURRENT_DATE + INTERVAL '40 days'
),
(
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  'compliance_fee',
  'Yıllık uyumluluk kontrol ücreti',
  199.00,
  'USD',
  CURRENT_DATE + INTERVAL '15 days',
  'pending',
  false,
  null,
  null
);