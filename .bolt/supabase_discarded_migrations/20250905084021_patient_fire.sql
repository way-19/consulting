/*
  # Create mail forwarding requests table

  1. New Tables
    - `mail_forwarding_requests`
      - `id` (uuid, primary key)
      - `client_id` (uuid, required, FK to clients)
      - `consultant_id` (uuid, required, FK to user_profiles)
      - `document_id` (uuid, required, FK to documents)
      - `forwarding_address` (text, required)
      - `status` (text, default 'pending')
      - `tracking_number` (text, optional)
      - `amount` (numeric, default 0)
      - `currency` (text, default 'USD')
      - `stripe_session_id` (text, optional)
      - `stripe_payment_intent_id` (text, optional)
      - `processed_at` (timestamp, optional)
      - `created_at` (timestamp, default now())
      - `updated_at` (timestamp, default now())
  
  2. Security
    - Enable RLS on `mail_forwarding_requests` table
    - Add policy for clients to read their own forwarding requests
    - Add policy for consultants to read their assigned requests
*/

-- Create mail_forwarding_requests table
CREATE TABLE IF NOT EXISTS public.mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  consultant_id uuid NOT NULL,
  document_id uuid NOT NULL,
  forwarding_address text NOT NULL,
  status text DEFAULT 'pending',
  tracking_number text,
  amount numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  stripe_session_id text,
  stripe_payment_intent_id text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mfr_client_id ON public.mail_forwarding_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_mfr_consultant_id ON public.mail_forwarding_requests(consultant_id);
CREATE INDEX IF NOT EXISTS idx_mfr_document_id ON public.mail_forwarding_requests(document_id);
CREATE INDEX IF NOT EXISTS idx_mfr_status ON public.mail_forwarding_requests(status);

-- Add foreign key constraints
ALTER TABLE public.mail_forwarding_requests
  ADD CONSTRAINT IF NOT EXISTS fk_mfr_client
  FOREIGN KEY (client_id)
  REFERENCES public.clients(id)
  ON DELETE CASCADE;

ALTER TABLE public.mail_forwarding_requests
  ADD CONSTRAINT IF NOT EXISTS fk_mfr_consultant
  FOREIGN KEY (consultant_id)
  REFERENCES public.user_profiles(id)
  ON DELETE CASCADE;

ALTER TABLE public.mail_forwarding_requests
  ADD CONSTRAINT IF NOT EXISTS fk_mfr_document
  FOREIGN KEY (document_id)
  REFERENCES public.documents(id)
  ON DELETE CASCADE;

-- Add check constraint for status
ALTER TABLE public.mail_forwarding_requests
  ADD CONSTRAINT IF NOT EXISTS check_mfr_status
  CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled'));

-- Enable Row Level Security
ALTER TABLE public.mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "mfr_select_client" ON public.mail_forwarding_requests;
CREATE POLICY "mfr_select_client"
ON public.mail_forwarding_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.clients c
    WHERE c.id = mail_forwarding_requests.client_id
      AND c.profile_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "mfr_insert_client" ON public.mail_forwarding_requests;
CREATE POLICY "mfr_insert_client"
ON public.mail_forwarding_requests
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.clients c
    WHERE c.id = client_id
      AND c.profile_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "mfr_select_consultant" ON public.mail_forwarding_requests;
CREATE POLICY "mfr_select_consultant"
ON public.mail_forwarding_requests
FOR SELECT
TO authenticated
USING (consultant_id = auth.uid());

DROP POLICY IF EXISTS "mfr_update_consultant" ON public.mail_forwarding_requests;
CREATE POLICY "mfr_update_consultant"
ON public.mail_forwarding_requests
FOR UPDATE
TO authenticated
USING (consultant_id = auth.uid());

-- Create updated_at trigger
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