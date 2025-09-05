/*
  # Create mail forwarding system

  1. New Tables
    - `mail_forwarding_requests`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `document_id` (uuid, foreign key to documents)
      - `document_name` (text)
      - `forwarding_address` (text)
      - `payment_amount` (numeric, default 15.00)
      - `status` (text, with check constraint)
      - `stripe_session_id` (text)
      - `stripe_payment_intent_id` (text)
      - `tracking_number` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `mail_forwarding_requests` table
    - Add policies for clients and consultants to manage their requests
    - Add update trigger for updated_at column

  3. Indexes
    - Index on client_id for performance
    - Index on document_id for lookups
*/

-- Create mail forwarding requests table
CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  consultant_id uuid,
  document_id uuid NOT NULL,
  document_name text NOT NULL,
  forwarding_address text NOT NULL,
  payment_amount numeric(10,2) DEFAULT 15.00,
  status text DEFAULT 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  tracking_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add check constraint for status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'mail_forwarding_requests_status_check'
  ) THEN
    ALTER TABLE mail_forwarding_requests 
    ADD CONSTRAINT mail_forwarding_requests_status_check 
    CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'));
  END IF;
END $$;

-- Add foreign key constraints safely
DO $$
BEGIN
  -- Add foreign key to clients table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mail_forwarding_requests_client_id'
  ) THEN
    ALTER TABLE mail_forwarding_requests
    ADD CONSTRAINT fk_mail_forwarding_requests_client_id
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key to user_profiles table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mail_forwarding_requests_consultant_id'
  ) THEN
    ALTER TABLE mail_forwarding_requests
    ADD CONSTRAINT fk_mail_forwarding_requests_consultant_id
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE SET NULL;
  END IF;

  -- Add foreign key to documents table (only if documents table exists)
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_name = 'documents' AND table_schema = 'public'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mail_forwarding_requests_document_id'
  ) THEN
    ALTER TABLE mail_forwarding_requests
    ADD CONSTRAINT fk_mail_forwarding_requests_document_id
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_client_id 
  ON mail_forwarding_requests(client_id);

CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_document_id 
  ON mail_forwarding_requests(document_id);

CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_consultant_id 
  ON mail_forwarding_requests(consultant_id);

-- Enable RLS
ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Clients can manage own forwarding requests"
  ON mail_forwarding_requests
  FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can manage client forwarding requests"
  ON mail_forwarding_requests
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Admins can manage all forwarding requests"
  ON mail_forwarding_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_mail_forwarding_requests_updated_at ON mail_forwarding_requests;

CREATE TRIGGER update_mail_forwarding_requests_updated_at
  BEFORE UPDATE ON mail_forwarding_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();