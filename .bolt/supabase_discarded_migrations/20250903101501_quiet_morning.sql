/*
  # Ek Hizmetler Tablosu

  1. Yeni Tablolar
    - `additional_services`
      - `id` (uuid, primary key)
      - `name` (text, hizmet adı)
      - `description` (text, hizmet açıklaması)
      - `base_price` (numeric, temel fiyat)
      - `is_active` (boolean, aktif durumu)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Güvenlik
    - Enable RLS on `additional_services` table
    - Add policy for public read access
    - Add policy for admin management
*/

CREATE TABLE IF NOT EXISTS additional_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE additional_services ENABLE ROW LEVEL SECURITY;

-- Public can read active additional services
CREATE POLICY "Anyone can read active additional services"
  ON additional_services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage all additional services
CREATE POLICY "Admins can manage additional services"
  ON additional_services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_additional_services_updated_at
  BEFORE UPDATE ON additional_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();