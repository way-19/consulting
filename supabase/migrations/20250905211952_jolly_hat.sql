/*
  # Meeting Reminders System

  1. Features
    - Automatic email reminders based on user preferences
    - Configurable reminder times (5 minutes to 1 day before)
    - Missed meeting notifications
    - Scheduled job for checking reminders

  2. Tables Updated
    - Uses existing user_preferences table for reminder settings
    - Uses existing notifications table for tracking sent reminders
    - Uses existing meetings table for meeting data

  3. Functions Added
    - schedule_meeting_reminders() - PostgreSQL function to set up automatic reminders
    - check_meeting_reminders() - Edge function to process reminders
*/

-- Function to automatically schedule meeting reminders when a new meeting is created
CREATE OR REPLACE FUNCTION schedule_meeting_reminders()
RETURNS TRIGGER AS $$
BEGIN
  -- Only schedule reminders for scheduled meetings
  IF NEW.status = 'scheduled' AND NEW.start_time > NOW() THEN
    
    -- Get client's preferences
    DECLARE
      client_profile_id uuid;
      reminder_enabled boolean DEFAULT false;
      reminder_minutes integer DEFAULT 15;
    BEGIN
      -- Get the client's profile_id
      SELECT profile_id INTO client_profile_id
      FROM clients
      WHERE id = NEW.client_id;
      
      -- Get reminder preferences
      SELECT 
        COALESCE((setting_value->>'enable_email_reminders')::boolean, false),
        COALESCE((setting_value->>'default_reminder_time')::integer, 15)
      INTO reminder_enabled, reminder_minutes
      FROM user_preferences
      WHERE user_id = client_profile_id 
      AND setting_key IN ('enable_email_reminders', 'default_reminder_time');
      
      -- Log the reminder scheduling
      INSERT INTO audit_logs (
        user_id,
        action_type,
        description,
        payload
      ) VALUES (
        'system',
        'meeting_reminder_scheduled',
        'Scheduled automatic reminder for meeting: ' || NEW.title,
        jsonb_build_object(
          'meeting_id', NEW.id,
          'client_profile_id', client_profile_id,
          'reminder_enabled', reminder_enabled,
          'reminder_minutes', reminder_minutes,
          'meeting_start', NEW.start_time
        )
      );
      
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new meetings
DROP TRIGGER IF EXISTS trg_schedule_meeting_reminders ON meetings;
CREATE TRIGGER trg_schedule_meeting_reminders
  AFTER INSERT OR UPDATE OF status, start_time ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION schedule_meeting_reminders();

-- Function to clean up old notifications (run weekly)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  -- Delete notifications older than 30 days
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Log the cleanup
  INSERT INTO audit_logs (
    user_id,
    action_type,
    description,
    payload
  ) VALUES (
    'system',
    'notifications_cleanup',
    'Cleaned up old notifications',
    jsonb_build_object('cleanup_date', NOW())
  );
END;
$$ LANGUAGE plpgsql;

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule meeting reminder checks (every 15 minutes)
-- Note: This requires superuser privileges in production
-- In development/testing, you can manually call the Edge function
SELECT cron.schedule(
  'meeting-reminders-check',
  '*/15 * * * *', -- Every 15 minutes
  $$
  SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/check-meeting-reminders',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key') || '"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- Schedule weekly cleanup (every Sunday at 2 AM)
SELECT cron.schedule(
  'cleanup-notifications',
  '0 2 * * 0', -- Sunday 2 AM
  'SELECT cleanup_old_notifications();'
);

-- Insert default reminder preferences for existing users
INSERT INTO user_preferences (user_id, setting_key, setting_value)
SELECT 
  id as user_id,
  'enable_email_reminders' as setting_key,
  'false'::jsonb as setting_value
FROM user_profiles 
WHERE role = 'client'
ON CONFLICT (user_id, setting_key) DO NOTHING;

INSERT INTO user_preferences (user_id, setting_key, setting_value)
SELECT 
  id as user_id,
  'default_reminder_time' as setting_key,
  '15'::jsonb as setting_value
FROM user_profiles 
WHERE role = 'client'
ON CONFLICT (user_id, setting_key) DO NOTHING;

-- Create notification templates table for consistent messaging
CREATE TABLE IF NOT EXISTS notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  language_code text NOT NULL DEFAULT 'en',
  subject text NOT NULL,
  body_template text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(type, language_code)
);

ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage notification templates
CREATE POLICY "Admins can manage notification templates"
  ON notification_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Insert default email templates
INSERT INTO notification_templates (type, language_code, subject, body_template) VALUES
('meeting_reminder', 'en', 
 '🔔 Upcoming Meeting Reminder - {meeting_title}',
 'Hello {client_name},\n\nThis is a friendly reminder that you have a meeting scheduled:\n\n📅 **{meeting_title}**\n🕐 **Time:** {meeting_time}\n🔗 **Join Link:** {meeting_url}\n\nWe look forward to speaking with you!\n\nBest regards,\nConsulting19 Team'),

('meeting_reminder', 'tr', 
 '🔔 Yaklaşan Toplantı Hatırlatıcısı - {meeting_title}',
 'Merhaba {client_name},\n\nPlanlanmış toplantınız için hatırlatıcı:\n\n📅 **{meeting_title}**\n🕐 **Saat:** {meeting_time}\n🔗 **Katılım Linki:** {meeting_url}\n\nSizinle konuşmayı sabırsızlıkla bekliyoruz!\n\nSaygılarımızla,\nConsulting19 Ekibi'),

('meeting_missed', 'en',
 '❌ Missed Meeting - {meeting_title}',
 'Hello {client_name},\n\nWe noticed you may have missed your scheduled meeting:\n\n📅 **{meeting_title}**\n🕐 **Was scheduled for:** {scheduled_time}\n\nNo worries! Please contact your consultant to reschedule.\n\nBest regards,\nConsulting19 Team'),

('meeting_missed', 'tr',
 '❌ Kaçırılan Toplantı - {meeting_title}',
 'Merhaba {client_name},\n\nPlanlanmış toplantınızı kaçırmış olabileceğinizi fark ettik:\n\n📅 **{meeting_title}**\n🕐 **Planlanmış saat:** {scheduled_time}\n\nSorun değil! Yeniden planlamak için danışmanınızla iletişime geçin.\n\nSaygılarımızla,\nConsulting19 Ekibi')

ON CONFLICT (type, language_code) DO NOTHING;

-- Create trigger to update notification_templates updated_at
CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();