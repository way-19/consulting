/*
  # Create global_services table for admin-managed service categories

  1. New Tables
    - `global_services`
      - `id` (uuid, primary key)
      - `name_i18n` (jsonb) - Multi-language service names
      - `description_i18n` (jsonb) - Multi-language descriptions
      - `icon_name` (text) - Lucide icon name
      - `image_url` (text) - Service image URL
      - `sort_order` (integer) - Display order
      - `is_active` (boolean) - Active status
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `global_services` table
    - Add policy for public read access
    - Add policy for admin write access

  3. Triggers
    - Add updated_at trigger
*/

-- Create global_services table
CREATE TABLE IF NOT EXISTS global_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_i18n JSONB NOT NULL DEFAULT '{}',
  description_i18n JSONB NOT NULL DEFAULT '{}',
  icon_name TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE global_services ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Global services are viewable by everyone"
  ON global_services
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can manage global services"
  ON global_services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_global_services_updated_at
  BEFORE UPDATE ON global_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO global_services (name_i18n, description_i18n, icon_name, sort_order) VALUES
(
  '{"en": "Company Formation", "tr": "Şirket Kuruluşu", "pt": "Formação de Empresa"}',
  '{"en": "Professional business setup and incorporation services worldwide", "tr": "Dünya çapında profesyonel iş kurulumu ve kuruluş hizmetleri", "pt": "Serviços profissionais de configuração e incorporação de negócios em todo o mundo"}',
  'Building2',
  1
),
(
  '{"en": "Tax Optimization", "tr": "Vergi Optimizasyonu", "pt": "Otimização Fiscal"}',
  '{"en": "Strategic tax planning and international tax optimization", "tr": "Stratejik vergi planlaması ve uluslararası vergi optimizasyonu", "pt": "Planejamento tributário estratégico e otimização fiscal internacional"}',
  'Calculator',
  2
),
(
  '{"en": "Banking Solutions", "tr": "Bankacılık Çözümleri", "pt": "Soluções Bancárias"}',
  '{"en": "Global banking and financial services access", "tr": "Küresel bankacılık ve finansal hizmetlere erişim", "pt": "Acesso a serviços bancários e financeiros globais"}',
  'CreditCard',
  3
),
(
  '{"en": "Legal Compliance", "tr": "Yasal Uyumluluk", "pt": "Conformidade Legal"}',
  '{"en": "Comprehensive legal and regulatory compliance", "tr": "Kapsamlı yasal ve düzenleyici uyumluluk", "pt": "Conformidade legal e regulatória abrangente"}',
  'FileText',
  4
);