/*
  # Create missing custom_services table

  1. New Tables
    - `custom_services` - Consultant custom services with i18n support
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `country_id` (uuid, foreign key to countries)
      - `title_i18n` (jsonb for multilingual titles)
      - `description_i18n` (jsonb for multilingual descriptions)
      - `features_i18n` (jsonb for multilingual feature lists)
      - `price` (numeric)
      - `currency` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on custom_services table
    - Public can read active custom services
    - Consultants can manage their own custom services

  3. Indexes
    - Add indexes for better performance
*/

-- Create custom_services table
CREATE TABLE IF NOT EXISTS custom_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  title_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  description_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  features_i18n jsonb DEFAULT '{"en": []}' NOT NULL,
  price numeric NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS custom_services_consultant_idx ON custom_services(consultant_id);
CREATE INDEX IF NOT EXISTS custom_services_country_idx ON custom_services(country_id);
CREATE INDEX IF NOT EXISTS custom_services_active_idx ON custom_services(is_active);

-- Enable RLS
ALTER TABLE custom_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_services
CREATE POLICY "Public read active custom services"
  ON custom_services FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Consultants manage own custom services"
  ON custom_services FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_custom_services_updated_at
  BEFORE UPDATE ON custom_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample custom service for Giorgi Meskhi
DO $$
DECLARE
  giorgi_id uuid;
  georgia_id uuid;
BEGIN
  -- Get user IDs
  SELECT id INTO giorgi_id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com';
  SELECT id INTO georgia_id FROM countries WHERE code = 'ge' OR name ILIKE '%georgia%' LIMIT 1;
  
  IF giorgi_id IS NOT NULL THEN
    -- Insert sample custom service
    INSERT INTO custom_services (
      consultant_id,
      country_id,
      title_i18n,
      description_i18n,
      features_i18n,
      price,
      currency
    ) VALUES (
      giorgi_id,
      georgia_id,
      '{"en": "Georgia Business Setup", "tr": "Gürcistan İş Kurulumu", "pt": "Configuração de Negócios na Geórgia"}',
      '{"en": "Complete business formation in Georgia with small business status", "tr": "Küçük işletme statüsü ile Gürcistan''da komple iş kuruluşu", "pt": "Formação completa de negócios na Geórgia com status de pequena empresa"}',
      '{"en": ["Company registration", "Tax registration", "Banking assistance", "Legal compliance"], "tr": ["Şirket kaydı", "Vergi kaydı", "Bankacılık yardımı", "Yasal uyumluluk"], "pt": ["Registro de empresa", "Registro fiscal", "Assistência bancária", "Conformidade legal"]}',
      2500,
      'USD'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;