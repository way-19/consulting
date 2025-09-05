/*
  # Create mail forwarding requests table

  1. New Tables
    - `mail_forwarding_requests`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `consultant_id` (uuid, references user_profiles)
      - `document_id` (uuid, references documents)
      - `forwarding_address` (text)
      - `status` (text)
      - `amount` (numeric)
      - `currency` (text)
      - `stripe_session_id` (text)
      - `stripe_payment_intent_id` (text)
      - `tracking_number` (text)
      - `processed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `mail_forwarding_requests` table
    - Add policy for clients to read their own requests
    - Add policy for consultants to read client requests
*/

-- Create the mail_forwarding_requests table
CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  consultant_id uuid,
  document_id uuid,
  forwarding_address text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  amount numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  stripe_session_id text,
  stripe_payment_intent_id text,
  tracking_number text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_client_id 
ON mail_forwarding_requests(client_id);

CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_consultant_id 
ON mail_forwarding_requests(consultant_id);

CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_document_id 
ON mail_forwarding_requests(document_id);

-- Add foreign key constraints
DO $$
BEGIN
  -- Add client_id foreign key if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mfr_client'
  ) THEN
    ALTER TABLE mail_forwarding_requests
    ADD CONSTRAINT fk_mfr_client
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
  END IF;

  -- Add consultant_id foreign key if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mfr_consultant'
  ) THEN
    ALTER TABLE mail_forwarding_requests
    ADD CONSTRAINT fk_mfr_consultant
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE SET NULL;
  END IF;

  -- Add document_id foreign key if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mfr_document'
  ) THEN
    ALTER TABLE mail_forwarding_requests
    ADD CONSTRAINT fk_mfr_document
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
DROP POLICY IF EXISTS "Clients can read own mail forwarding requests" ON mail_forwarding_requests;
CREATE POLICY "Clients can read own mail forwarding requests"
ON mail_forwarding_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = mail_forwarding_requests.client_id
    AND clients.profile_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Consultants can read client mail forwarding requests" ON mail_forwarding_requests;
CREATE POLICY "Consultants can read client mail forwarding requests"
ON mail_forwarding_requests
FOR SELECT
TO authenticated
USING (consultant_id = auth.uid());

DROP POLICY IF EXISTS "Clients can create own mail forwarding requests" ON mail_forwarding_requests;
CREATE POLICY "Clients can create own mail forwarding requests"
ON mail_forwarding_requests
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM clients
    WHERE clients.id = mail_forwarding_requests.client_id
    AND clients.profile_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Consultants can update client mail forwarding requests" ON mail_forwarding_requests;
CREATE POLICY "Consultants can update client mail forwarding requests"
ON mail_forwarding_requests
FOR UPDATE
TO authenticated
USING (consultant_id = auth.uid());

-- Add updated_at trigger if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_mail_forwarding_requests_updated_at'
  ) THEN
    CREATE TRIGGER update_mail_forwarding_requests_updated_at
      BEFORE UPDATE ON mail_forwarding_requests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;