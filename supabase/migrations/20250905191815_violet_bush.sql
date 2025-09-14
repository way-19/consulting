/*
  # User Preferences System

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `setting_key` (text, setting identifier)
      - `setting_value` (jsonb, flexible setting storage)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_preferences` table
    - Add policies for users to manage their own preferences

  3. Sample Data
    - Default calendar preferences for users
    - Notification settings
    - Display preferences
*/

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  setting_key text NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique index for user_id + setting_key combination
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_preferences_user_setting 
  ON user_preferences(user_id, setting_key);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id 
  ON user_preferences(user_id);

CREATE INDEX IF NOT EXISTS idx_user_preferences_setting_key 
  ON user_preferences(setting_key);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can view all preferences (for support)
CREATE POLICY "Admins can view all preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_preferences_updated_at_trigger
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences_updated_at();

-- Insert default user preferences for existing users
INSERT INTO user_preferences (user_id, setting_key, setting_value)
SELECT 
  id,
  'calendar_preferences',
  jsonb_build_object(
    'default_department_id', null,
    'preferred_meeting_duration', 60,
    'preferred_meeting_type', 'video',
    'timezone_display', 'local',
    'notifications_enabled', true,
    'reminder_minutes', 30,
    'auto_confirm_free_slots', false,
    'show_consultant_availability', true,
    'preferred_time_format', '12h'
  )
FROM user_profiles
WHERE role = 'client'
ON CONFLICT (user_id, setting_key) DO NOTHING;

-- Insert notification preferences
INSERT INTO user_preferences (user_id, setting_key, setting_value)
SELECT 
  id,
  'notification_preferences',
  jsonb_build_object(
    'email_notifications', true,
    'browser_notifications', true,
    'sms_notifications', false,
    'meeting_reminders', true,
    'payment_reminders', true,
    'document_notifications', true,
    'marketing_emails', false,
    'weekly_summary', true
  )
FROM user_profiles
WHERE role = 'client'
ON CONFLICT (user_id, setting_key) DO NOTHING;

-- Insert display preferences
INSERT INTO user_preferences (user_id, setting_key, setting_value)
SELECT 
  id,
  'display_preferences',
  jsonb_build_object(
    'theme', 'light',
    'language', 'en',
    'currency_display', 'USD',
    'date_format', 'MM/DD/YYYY',
    'calendar_view', 'week',
    'show_weekends', false,
    'compact_mode', false,
    'sidebar_collapsed', false
  )
FROM user_profiles
WHERE role = 'client'
ON CONFLICT (user_id, setting_key) DO NOTHING;