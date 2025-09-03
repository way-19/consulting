/*
  # Örnek Veri Ekleme

  1. Örnek Veriler
    - Packages tablosuna örnek paket
    - Additional services tablosuna örnek ek hizmetler
    - Country additional services tablosuna ilişkiler
    - Banks tablosuna örnek bankalar
    - Mail ve KVKK ayarları
*/

-- Insert sample package
INSERT INTO packages (name, price, description) VALUES
('Standard Business Formation Package', 2500.00, 'Complete business formation with all essential services')
ON CONFLICT DO NOTHING;

-- Insert sample additional services
INSERT INTO additional_services (name, description, base_price) VALUES
('Express Processing', 'Expedited processing for faster completion', 500.00),
('Banking Setup', 'Corporate bank account opening assistance', 800.00),
('Tax Consultation', 'Initial tax planning consultation', 300.00),
('Legal Review', 'Legal document review and compliance check', 400.00),
('Virtual Office', 'Virtual office address and mail forwarding', 200.00)
ON CONFLICT DO NOTHING;

-- Insert sample banks
INSERT INTO banks (name, price, flag_url) VALUES
('TBC Bank', 800.00, 'https://example.com/tbc-logo.png'),
('Bank of Georgia', 750.00, 'https://example.com/bog-logo.png'),
('Liberty Bank', 700.00, 'https://example.com/liberty-logo.png')
ON CONFLICT DO NOTHING;

-- Insert sample mail settings
INSERT INTO mail_settings (host, username, password) VALUES
('smtp.gmail.com', 'noreply@consulting19.com', 'your-app-password')
ON CONFLICT DO NOTHING;

-- Insert sample KVKK settings
INSERT INTO kvkk_settings (policy_text, policy_link) VALUES
('Kişisel verileriniz KVKK kapsamında korunmaktadır.', 'https://consulting19.com/privacy')
ON CONFLICT DO NOTHING;

-- Link additional services to Georgia (assuming Georgia exists)
DO $$
DECLARE
  georgia_id uuid;
  service_record RECORD;
BEGIN
  -- Get Georgia country ID
  SELECT id INTO georgia_id FROM countries WHERE code = 'GE' OR name = 'Georgia' LIMIT 1;
  
  IF georgia_id IS NOT NULL THEN
    -- Link all additional services to Georgia with country-specific pricing
    FOR service_record IN SELECT id, base_price FROM additional_services LOOP
      INSERT INTO country_additional_services (country_id, additional_service_id, price, is_active)
      VALUES (georgia_id, service_record.id, service_record.base_price, true)
      ON CONFLICT (country_id, additional_service_id) DO NOTHING;
    END LOOP;
  END IF;
END $$;