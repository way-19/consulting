/*
  # Add Missing Tables for Client Panel

  1. New Tables
    - `messages` - Real-time chat between clients and consultants
    - `support_tickets` - Support requests to consultants/admin
    - `mail_forwarding_requests` - Physical mail forwarding requests
    - `audit_logs` - User activity tracking
  
  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies for client/consultant access
  
  3. Functions
    - Add trigger to automatically clean up old accounting documents
*/

-- Messages table for real-time chat
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

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  ticket_type text NOT NULL DEFAULT 'general' CHECK (ticket_type IN ('general', 'complaint', 'technical')),
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mail forwarding requests table
CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  forwarding_address text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_amount numeric(10,2) DEFAULT 15.00,
  payment_currency text DEFAULT 'USD',
  stripe_payment_intent_id text,
  stripe_session_id text,
  notes text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit logs table for tracking user actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  resource_type text,
  resource_id uuid,
  description text NOT NULL,
  ip_address text,
  user_agent text,
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can read own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- Support tickets policies
CREATE POLICY "Clients can manage own tickets"
  ON support_tickets FOR ALL
  TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Consultants can read assigned tickets"
  ON support_tickets FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can read all tickets"
  ON support_tickets FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Mail forwarding policies
CREATE POLICY "Clients can manage own mail forwarding"
  ON mail_forwarding_requests FOR ALL
  TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Consultants can read assigned mail forwarding"
  ON mail_forwarding_requests FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Users can read own audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Add update triggers
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mail_forwarding_requests_updated_at
  BEFORE UPDATE ON mail_forwarding_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean old accounting documents (older than 3 months)
CREATE OR REPLACE FUNCTION cleanup_old_accounting_documents()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete documents older than 3 months where type is 'financial'
  DELETE FROM documents 
  WHERE type = 'financial' 
    AND created_at < NOW() - INTERVAL '3 months';
END;
$$;