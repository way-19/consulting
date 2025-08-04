/*
  # User Settings and Notifications System

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `email_notifications` (boolean)
      - `sms_notifications` (boolean)
      - `push_notifications` (boolean)
      - `language_preference` (varchar)
      - `timezone` (varchar)
      - `currency_preference` (varchar)
      - `two_factor_enabled` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (varchar)
      - `message` (text)
      - `type` (varchar)
      - `priority` (varchar)
      - `is_read` (boolean)
      - `action_url` (text)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)
    
    - `password_reset_tokens`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `token` (varchar)
      - `expires_at` (timestamp)
      - `used` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add policies for users to manage their own data
    - Add policies for admins to manage notifications

  3. Functions
    - Function to generate password reset tokens
    - Function to clean expired tokens
    - Function to send notifications
*/

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  sms_notifications boolean DEFAULT false,
  push_notifications boolean DEFAULT true,
  language_preference varchar(5) DEFAULT 'en',
  timezone varchar(50) DEFAULT 'UTC',
  currency_preference varchar(3) DEFAULT 'USD',
  two_factor_enabled boolean DEFAULT false,
  marketing_emails boolean DEFAULT false,
  security_alerts boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  message text NOT NULL,
  type varchar(50) DEFAULT 'general',
  priority varchar(20) DEFAULT 'normal',
  is_read boolean DEFAULT false,
  action_url text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  read_at timestamptz
);

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token varchar(255) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_type ON user_notifications(type);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can read own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_notifications
CREATE POLICY "Users can read own notifications"
  ON user_notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON user_notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can insert notifications"
  ON user_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Consultants can insert client notifications"
  ON user_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE consultant_id = auth.uid() 
      AND client_id = user_id
    )
  );

-- RLS Policies for password_reset_tokens
CREATE POLICY "Users can read own reset tokens"
  ON password_reset_tokens
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert reset tokens"
  ON password_reset_tokens
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own reset tokens"
  ON password_reset_tokens
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_settings
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to clean expired tokens
CREATE OR REPLACE FUNCTION clean_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_tokens 
  WHERE expires_at < now() OR used = true;
END;
$$ language 'plpgsql';

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE user_notifications 
  SET is_read = true, read_at = now()
  WHERE id = notification_id AND user_id = auth.uid();
END;
$$ language 'plpgsql';

-- Insert default settings for existing users
INSERT INTO user_settings (user_id, language_preference, timezone, currency_preference)
SELECT 
  id,
  COALESCE(language, 'en'),
  COALESCE(timezone, 'UTC'),
  COALESCE(preferred_currency, 'USD')
FROM users 
WHERE id NOT IN (SELECT user_id FROM user_settings)
ON CONFLICT (user_id) DO NOTHING;

-- Add some sample notifications for testing
INSERT INTO user_notifications (user_id, title, message, type, priority) VALUES
(
  (SELECT id FROM users WHERE role = 'client' LIMIT 1),
  'Hoş Geldiniz!',
  'CONSULTING19 platformuna hoş geldiniz. Başvuru sürecinizi takip edebilir ve danışmanlarınızla iletişim kurabilirsiniz.',
  'welcome',
  'normal'
),
(
  (SELECT id FROM users WHERE role = 'client' LIMIT 1),
  'Belge Yükleme Hatırlatması',
  'Gürcistan şirket kurulumu için gerekli belgeleri yüklemeyi unutmayın.',
  'reminder',
  'high'
);