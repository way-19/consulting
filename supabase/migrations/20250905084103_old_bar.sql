/*
  # Mail Forwarding Requests Table

  1. New Tables
    - `mail_forwarding_requests`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `document_id` (uuid, foreign key to documents)
      - `forwarding_address` (text)
      - `amount` (numeric)
      - `currency` (text)
      - `status` (text)
      - `stripe_session_id` (text)
      - `stripe_payment_intent_id` (text)
      - `tracking_number` (text)
      - `processed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `mail_forwarding_requests` table
    - Add policy for clients to read their own forwarding requests
    - Add policy for consultants to read assigned clients' forwarding requests

  3. Triggers
    - Add automatic updated_at trigger
*/

CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  consultant_id uuid,
  document_id uuid,
  forwarding_address text NOT NULL,
  amount numeric(10,2) DEFAULT 15.00,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  stripe_session_id text,
  stripe_payment_intent_id text,
  tracking_number text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_client_id ON mail_forwarding_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_consultant_id ON mail_forwarding_requests(consultant_id);
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_document_id ON mail_forwarding_requests(document_id);
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_status ON mail_forwarding_requests(status);

-- Add foreign key constraints using DO blocks
DO $$
BEGIN
  -- Check if client_id constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mfr_client' 
    AND table_name = 'mail_forwarding_requests'
  ) THEN
    ALTER TABLE mail_forwarding_requests 
    ADD CONSTRAINT fk_mfr_client 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
  END IF;
  
  -- Check if consultant_id constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mfr_consultant' 
    AND table_name = 'mail_forwarding_requests'
  ) THEN
    ALTER TABLE mail_forwarding_requests 
    ADD CONSTRAINT fk_mfr_consultant 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE SET NULL;
  END IF;
  
  -- Check if document_id constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mfr_document' 
    AND table_name = 'mail_forwarding_requests'
  ) THEN
    ALTER TABLE mail_forwarding_requests 
    ADD CONSTRAINT fk_mfr_document 
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "mfr_select_client" ON mail_forwarding_requests;
DROP POLICY IF EXISTS "mfr_select_consultant" ON mail_forwarding_requests;
DROP POLICY IF EXISTS "mfr_insert_client" ON mail_forwarding_requests;
DROP POLICY IF EXISTS "mfr_update_client" ON mail_forwarding_requests;

-- RLS policies for clients
CREATE POLICY "mfr_select_client"
ON mail_forwarding_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = mail_forwarding_requests.client_id
    AND c.profile_id = auth.uid()
  )
);

CREATE POLICY "mfr_insert_client"
ON mail_forwarding_requests
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = mail_forwarding_requests.client_id
    AND c.profile_id = auth.uid()
  )
);

CREATE POLICY "mfr_update_client"
ON mail_forwarding_requests
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients c
    WHERE c.id = mail_forwarding_requests.client_id
    AND c.profile_id = auth.uid()
  )
);

-- RLS policies for consultants
CREATE POLICY "mfr_select_consultant"
ON mail_forwarding_requests
FOR ALL
TO authenticated
USING (consultant_id = auth.uid());

-- Add automatic updated_at trigger
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_mail_forwarding_requests_updated_at'
    AND event_object_table = 'mail_forwarding_requests'
  ) THEN
    CREATE TRIGGER update_mail_forwarding_requests_updated_at
    BEFORE UPDATE ON mail_forwarding_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;