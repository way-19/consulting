/*
  # Mail Forwarding System for Virtual Mailbox

  1. New Tables
    - `mail_forwarding_requests`
      - Links documents to forwarding requests
      - Tracks payment and delivery status
      - Individual document forwarding (not bulk)

  2. Security  
    - Enable RLS on mail_forwarding_requests
    - Clients can manage own forwarding requests
    - Consultants can view assigned client requests
*/

-- Create mail_forwarding_requests table
CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  consultant_id uuid,
  document_id uuid NOT NULL,
  document_name text NOT NULL,
  forwarding_address text NOT NULL,
  payment_amount numeric(10,2) NOT NULL DEFAULT 15.00,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  tracking_number text,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT mail_forwarding_requests_status_check 
    CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'failed'))
);

-- Add foreign key constraints
ALTER TABLE mail_forwarding_requests 
ADD CONSTRAINT fk_mail_forwarding_requests_client_id 
FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE mail_forwarding_requests 
ADD CONSTRAINT fk_mail_forwarding_requests_consultant_id 
FOREIGN KEY (consultant_id) REFERENCES user_profiles(id);

ALTER TABLE mail_forwarding_requests 
ADD CONSTRAINT fk_mail_forwarding_requests_document_id 
FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_client_id ON mail_forwarding_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_document_id ON mail_forwarding_requests(document_id);
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_status ON mail_forwarding_requests(status);

-- Enable RLS
ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mail_forwarding_requests
CREATE POLICY "Clients can manage own forwarding requests"
  ON mail_forwarding_requests
  FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT clients.id FROM clients WHERE clients.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT clients.id FROM clients WHERE clients.profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can view assigned client forwarding requests"
  ON mail_forwarding_requests
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can manage all forwarding requests"
  ON mail_forwarding_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_mail_forwarding_requests_updated_at
  BEFORE UPDATE ON mail_forwarding_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();