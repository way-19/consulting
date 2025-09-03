/*
  # Banka Servisleri Tablosu

  1. Yeni Tablolar
    - `banks`
      - `id` (uuid, primary key)
      - `name` (text, banka adı)
      - `price` (numeric, banka bedeli)
      - `flag_url` (text, bayrak/logo URL'si)
      - `is_active` (boolean, aktif durumu)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Güvenlik
    - Enable RLS on `banks` table
    - Add policy for public read access
    - Add policy for admin management
*/

CREATE TABLE IF NOT EXISTS banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  flag_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

-- Public can read active banks
CREATE POLICY "Anyone can read active banks"
  ON banks
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage all banks
CREATE POLICY "Admins can manage banks"
  ON banks
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
CREATE TRIGGER update_banks_updated_at
  BEFORE UPDATE ON banks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();