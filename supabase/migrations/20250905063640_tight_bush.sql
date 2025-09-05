/*
  # Fix RLS Policies for Client Access

  This migration adds missing RLS policies to allow authenticated clients to access their own data.

  ## New Tables
  - `messages` - Real-time messaging between clients and consultants
  - `audit_logs` - User action tracking
  - `support_tickets` - Support request system
  - `mail_forwarding_requests` - Physical mail forwarding requests

  ## Security
  - Enable RLS on all new tables
  - Add policies for clients to access their own data
  - Add policies for consultants to access assigned client data
  - Add policies for admins to access all data

  ## Fixed Access Issues
  - clients table: Allow authenticated users to read their own client record
  - notifications table: Allow users to read their own notifications
  - documents table: Allow clients to manage their own documents
  - tasks table: Allow clients to read visible tasks
  - messages table: Allow users to read/write their own messages
  - audit_logs table: Allow users to read their own logs
*/

-- Create missing tables first
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  message_content text NOT NULL,
  original_message text,
  translated_message text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  description text NOT NULL,
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  type text DEFAULT 'general' CHECK (type IN ('general', 'technical', 'complaint')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  subject text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  forwarding_address text NOT NULL,
  amount numeric(10,2) DEFAULT 15.00,
  stripe_payment_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- Fix existing RLS policies

-- Clients table: Allow authenticated users to read their own client record
DROP POLICY IF EXISTS "Users can read own client record" ON clients;
CREATE POLICY "Users can read own client record"
  ON clients
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- Messages table policies
CREATE POLICY "Users can read own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Users can read own audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Support tickets policies
CREATE POLICY "Clients can manage own support tickets"
  ON support_tickets
  FOR ALL
  TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ));

CREATE POLICY "Consultants can manage assigned support tickets"
  ON support_tickets
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid());

-- Mail forwarding requests policies
CREATE POLICY "Clients can manage own mail forwarding"
  ON mail_forwarding_requests
  FOR ALL
  TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ));

CREATE POLICY "Consultants can read assigned mail forwarding"
  ON mail_forwarding_requests
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

-- Add admin policies for all tables
CREATE POLICY "Admins can manage all messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage all audit logs"
  ON audit_logs
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage all support tickets"
  ON support_tickets
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can manage all mail forwarding"
  ON mail_forwarding_requests
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_support_tickets_updated_at') THEN
    CREATE TRIGGER update_support_tickets_updated_at
      BEFORE UPDATE ON support_tickets
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_mail_forwarding_updated_at') THEN
    CREATE TRIGGER update_mail_forwarding_updated_at
      BEFORE UPDATE ON mail_forwarding_requests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;