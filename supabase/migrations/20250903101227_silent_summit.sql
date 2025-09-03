/*
  # Paket Yönetimi Tablosu

  1. Yeni Tablolar
    - `packages`
      - `id` (uuid, primary key)
      - `name` (text, paket adı)
      - `price` (numeric, paket fiyatı)
      - `description` (text, paket açıklaması)
      - `is_active` (boolean, aktif durumu)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Güvenlik
    - Enable RLS on `packages` table
    - Add policy for public read access
    - Add policy for admin management
*/

CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Public can read active packages
CREATE POLICY "Anyone can read active packages"
  ON packages
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage all packages
CREATE POLICY "Admins can manage packages"
  ON packages
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
CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();