/*
  # Ülke-Ek Hizmet İlişki Tablosu

  1. Yeni Tablolar
    - `country_additional_services`
      - `country_id` (uuid, foreign key to countries)
      - `additional_service_id` (uuid, foreign key to additional_services)
      - `price` (numeric, ülkeye özel fiyat)
      - `is_active` (boolean, ülkede aktif durumu)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - Composite primary key (country_id, additional_service_id)
  
  2. Güvenlik
    - Enable RLS on `country_additional_services` table
    - Add policy for public read access to active services
    - Add policy for admin management
*/

CREATE TABLE IF NOT EXISTS country_additional_services (
  country_id uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  additional_service_id uuid NOT NULL REFERENCES additional_services(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (country_id, additional_service_id)
);

ALTER TABLE country_additional_services ENABLE ROW LEVEL SECURITY;

-- Public can read active country additional services
CREATE POLICY "Anyone can read active country additional services"
  ON country_additional_services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage all country additional services
CREATE POLICY "Admins can manage country additional services"
  ON country_additional_services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_country_additional_services_updated_at
  BEFORE UPDATE ON country_additional_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();