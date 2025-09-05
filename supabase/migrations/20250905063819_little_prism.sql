/*
  # Add missing tables and policies safely
  
  1. New Tables
    - `audit_logs` - User action tracking
    - `support_tickets` - Support request system  
    - `mail_forwarding_requests` - Physical mail forwarding
  
  2. Security
    - Enable RLS on new tables
    - Add policies only if they don't exist
    
  3. Notes
    - Uses safe creation methods to avoid conflicts
    - Only creates missing tables and policies
*/

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  resource_type text,
  resource_id uuid,
  description text NOT NULL,
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create support_tickets table if it doesn't exist  
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  subject text NOT NULL,
  description text NOT NULL,
  ticket_type text DEFAULT 'general' CHECK (ticket_type IN ('general', 'technical', 'complaint')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create mail_forwarding_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  forwarding_address text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payment_amount numeric(10,2) DEFAULT 15.00,
  stripe_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- Add triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_support_tickets_updated_at'
  ) THEN
    CREATE TRIGGER update_support_tickets_updated_at
      BEFORE UPDATE ON support_tickets
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_mail_forwarding_requests_updated_at'
  ) THEN
    CREATE TRIGGER update_mail_forwarding_requests_updated_at
      BEFORE UPDATE ON mail_forwarding_requests
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Add RLS policies safely (only if they don't exist)
DO $$
BEGIN
  -- Audit logs policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' AND policyname = 'Users can read own audit logs'
  ) THEN
    CREATE POLICY "Users can read own audit logs"
      ON audit_logs
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' AND policyname = 'Authenticated users can insert own audit logs'
  ) THEN
    CREATE POLICY "Authenticated users can insert own audit logs"
      ON audit_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;

  -- Support tickets policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'support_tickets' AND policyname = 'Clients can manage own support tickets'
  ) THEN
    CREATE POLICY "Clients can manage own support tickets"
      ON support_tickets
      FOR ALL
      TO authenticated
      USING (client_id IN (
        SELECT id FROM clients WHERE profile_id = auth.uid()
      ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'support_tickets' AND policyname = 'Consultants can read assigned tickets'
  ) THEN
    CREATE POLICY "Consultants can read assigned tickets"
      ON support_tickets
      FOR SELECT
      TO authenticated
      USING (consultant_id = auth.uid());
  END IF;

  -- Mail forwarding requests policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'mail_forwarding_requests' AND policyname = 'Clients can manage own mail requests'
  ) THEN
    CREATE POLICY "Clients can manage own mail requests"
      ON mail_forwarding_requests
      FOR ALL
      TO authenticated
      USING (client_id IN (
        SELECT id FROM clients WHERE profile_id = auth.uid()
      ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'mail_forwarding_requests' AND policyname = 'Consultants can read assigned mail requests'
  ) THEN
    CREATE POLICY "Consultants can read assigned mail requests"
      ON mail_forwarding_requests
      FOR SELECT
      TO authenticated
      USING (consultant_id = auth.uid());
  END IF;
END $$;