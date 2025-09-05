/*
  # Create Communication and Messaging System

  1. Communication Tables
    - `messages` - Real-time messaging between clients and consultants
    - `notifications` - System notifications and alerts
    - `meetings` - Calendar and meeting management

  2. Features
    - Multi-language message translation
    - Real-time notifications
    - Meeting scheduling and management
    - Message read status tracking

  3. Security
    - Private messaging (sender/receiver only)
    - Notification privacy
    - Meeting participant access only
*/

-- Messages table for real-time communication
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  translated_content text,
  original_language text DEFAULT 'en',
  target_language text DEFAULT 'en',
  is_translated boolean DEFAULT false,
  is_read boolean DEFAULT false,
  replied_to uuid REFERENCES messages(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Message policies
CREATE POLICY "messages_insert" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_read" ON messages
  FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages_update_is_read" ON messages
  FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES user_profiles(id),
  recipient_profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  payload jsonb DEFAULT '{}',
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Notification policies
CREATE POLICY "notifications_read_own" ON notifications
  FOR SELECT TO authenticated
  USING (recipient_profile_id = auth.uid());

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  meeting_type text NOT NULL DEFAULT 'video',
  status text NOT NULL DEFAULT 'scheduled',
  meeting_url text,
  location text,
  notes text,
  reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT meetings_type_check 
    CHECK (meeting_type IN ('video', 'phone', 'in_person')),
  CONSTRAINT meetings_status_check 
    CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  CONSTRAINT meetings_time_check 
    CHECK (end_time > start_time)
);

ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Meeting policies
CREATE POLICY "Admins can manage all meetings" ON meetings
  FOR ALL TO authenticated
  USING (is_admin() AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  ))
  WITH CHECK (is_admin() AND EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  ));

CREATE POLICY "Consultants can manage assigned client meetings" ON meetings
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Clients can read their own meetings" ON meetings
  FOR SELECT TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ));

CREATE POLICY "Clients can update their own meetings" ON meetings
  FOR UPDATE TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ))
  WITH CHECK (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ));

CREATE POLICY "Clients can create meetings with their consultant" ON meetings
  FOR INSERT TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    ) AND
    consultant_id IN (
      SELECT assigned_consultant_id FROM clients 
      WHERE profile_id = auth.uid() AND assigned_consultant_id IS NOT NULL
    )
  );

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meetings_updated_at_trigger
  BEFORE UPDATE ON meetings
  FOR EACH ROW EXECUTE FUNCTION update_meetings_updated_at();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_profile_id);
CREATE INDEX IF NOT EXISTS idx_meetings_client_id ON meetings(client_id);
CREATE INDEX IF NOT EXISTS idx_meetings_consultant_id ON meetings(consultant_id);
CREATE INDEX IF NOT EXISTS idx_meetings_start_time ON meetings(start_time);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_type ON meetings(meeting_type);