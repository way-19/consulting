/*
  # KVKK Ayarları Tablosu

  1. Yeni Tablolar
    - `kvkk_settings`
      - `id` (uuid, primary key)
      - `policy_text` (text, politika metni)
      - `policy_link` (text, politika linki)
      - `is_active` (boolean, aktif durumu)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Güvenlik
    - Enable RLS on `kvkk_settings` table
    - Add policy for public read access
    - Add policy for admin management
*/

CREATE TABLE IF NOT EXISTS kvkk_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_text text NOT NULL,
  policy_link text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE kvkk_settings ENABLE ROW LEVEL SECURITY;

-- Public can read active KVKK settings
CREATE POLICY "Anyone can read active kvkk settings"
  ON kvkk_settings
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins can manage all KVKK settings
CREATE POLICY "Admins can manage kvkk settings"
  ON kvkk_settings
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
CREATE TRIGGER update_kvkk_settings_updated_at
  BEFORE UPDATE ON kvkk_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();