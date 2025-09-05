/*
  # Create mail forwarding requests table with proper FK relationships

  1. New Tables
    - `mail_forwarding_requests`
      - `id` (uuid, primary key)
      - `client_id` (uuid, FK to clients)
      - `consultant_id` (uuid, FK to user_profiles)
      - `document_id` (uuid, FK to documents)
      - `forwarding_address` (text)
      - `amount` (decimal)
      - `currency` (text, default USD)
      - `status` (text, default pending)
      - `stripe_session_id` (text)
      - `stripe_payment_intent_id` (text)
      - `tracking_number` (text)
      - `processed_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `mail_forwarding_requests` table
    - Add policy for clients to read/manage their own requests
    - Add policy for consultants to read assigned client requests

  3. Indexes and Constraints
    - Add performance indexes
    - Add foreign key constraints to documents and other tables
    - Add status and currency constraints
*/

-- Create mail_forwarding_requests table if not exists
CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  consultant_id uuid,
  document_id uuid,
  forwarding_address text NOT NULL,
  amount decimal(10,2) DEFAULT 15.00,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  tracking_number text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_mfr_client_id 
  ON public.mail_forwarding_requests(client_id);

CREATE INDEX IF NOT EXISTS idx_mfr_document_id 
  ON public.mail_forwarding_requests(document_id);

CREATE INDEX IF NOT EXISTS idx_mfr_consultant_id 
  ON public.mail_forwarding_requests(consultant_id);

CREATE INDEX IF NOT EXISTS idx_mfr_status 
  ON public.mail_forwarding_requests(status);

-- Add foreign key constraints
DO $$
BEGIN
  -- FK to clients table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mfr_client_id'
  ) THEN
    ALTER TABLE public.mail_forwarding_requests
    ADD CONSTRAINT fk_mfr_client_id
    FOREIGN KEY (client_id) 
    REFERENCES public.clients(id) 
    ON DELETE CASCADE;
  END IF;

  -- FK to documents table (critical for embed functionality)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mfr_document_id'
  ) THEN
    ALTER TABLE public.mail_forwarding_requests
    ADD CONSTRAINT fk_mfr_document_id
    FOREIGN KEY (document_id) 
    REFERENCES public.documents(id) 
    ON DELETE SET NULL;
  END IF;

  -- FK to consultant (user_profiles)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mfr_consultant_id'
  ) THEN
    ALTER TABLE public.mail_forwarding_requests
    ADD CONSTRAINT fk_mfr_consultant_id
    FOREIGN KEY (consultant_id) 
    REFERENCES public.user_profiles(id) 
    ON DELETE SET NULL;
  END IF;
END $$;

-- Add check constraints
DO $$
BEGIN
  -- Status constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'mfr_status_check'
  ) THEN
    ALTER TABLE public.mail_forwarding_requests
    ADD CONSTRAINT mfr_status_check
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));
  END IF;

  -- Currency constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'mfr_currency_check'
  ) THEN
    ALTER TABLE public.mail_forwarding_requests
    ADD CONSTRAINT mfr_currency_check
    CHECK (currency IN ('USD', 'EUR', 'GBP', 'GEL'));
  END IF;
END $$;

-- Enable RLS
ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "mfr_select_client" ON mail_forwarding_requests;
CREATE POLICY "mfr_select_client"
  ON mail_forwarding_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM clients c
      WHERE c.id = mail_forwarding_requests.client_id
        AND c.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "mfr_insert_client" ON mail_forwarding_requests;
CREATE POLICY "mfr_insert_client"
  ON mail_forwarding_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM clients c
      WHERE c.id = mail_forwarding_requests.client_id
        AND c.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "mfr_select_consultant" ON mail_forwarding_requests;
CREATE POLICY "mfr_select_consultant"
  ON mail_forwarding_requests
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

DROP POLICY IF EXISTS "mfr_update_consultant" ON mail_forwarding_requests;
CREATE POLICY "mfr_update_consultant"
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
      BEFORE UPDATE ON public.mail_forwarding_requests
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;