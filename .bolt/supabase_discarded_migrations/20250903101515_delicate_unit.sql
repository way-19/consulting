/*
  # Mail Ayarları Tablosu

  1. Yeni Tablolar
    - `mail_settings`
      - `id` (uuid, primary key)
      - `host` (text, mail sunucu adresi)
      - `username` (text, mail kullanıcı adı)
      - `password` (text, mail şifresi)
      - `port` (integer, mail portu)
      - `encryption` (text, şifreleme türü)
      - `is_active` (boolean, aktif durumu)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Güvenlik
    - Enable RLS on `mail_settings` table
    - Add policy for admin-only access
*/

CREATE TABLE IF NOT EXISTS mail_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host text NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  port integer DEFAULT 587,
  encryption text DEFAULT 'tls',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE mail_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can access mail settings
CREATE POLICY "Admins can manage mail settings"
  ON mail_settings
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
CREATE TRIGGER update_mail_settings_updated_at
  BEFORE UPDATE ON mail_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();