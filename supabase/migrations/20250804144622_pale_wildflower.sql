/*
  # Create user notifications table

  1. New Tables
    - `user_notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text, notification title)
      - `message` (text, notification content)
      - `type` (text, notification type)
      - `priority` (text, notification priority)
      - `action_url` (text, optional action link)
      - `metadata` (jsonb, additional data)
      - `is_read` (boolean, read status)
      - `read_at` (timestamp, when read)
      - `expires_at` (timestamp, expiration date)
      - `created_at` (timestamp, creation date)

  2. Security
    - Enable RLS on `user_notifications` table
    - Add policy for users to read their own notifications
    - Add policy for users to update their own notifications
    - Add policy for system to insert notifications
*/

CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'reminder', 'welcome', 'payment', 'document', 'message', 'support')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  action_url text,
  metadata jsonb DEFAULT '{}',
  is_read boolean DEFAULT false NOT NULL,
  read_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications"
  ON user_notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read, etc.)
CREATE POLICY "Users can update own notifications"
  ON user_notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- System can insert notifications for any user
CREATE POLICY "System can insert notifications"
  ON user_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_user_notifications_expires_at ON user_notifications(expires_at);