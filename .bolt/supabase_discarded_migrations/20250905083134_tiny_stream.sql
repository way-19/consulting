/*
  # Create mail forwarding requests table

  1. New Tables
    - `mail_forwarding_requests`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `document_id` (uuid, foreign key to documents)
      - `forwarding_address` (text)
      - `status` (enum: pending, processing, delivered)
      - `stripe_payment_intent_id` (text)
      - `tracking_number` (text)
      - `amount` (numeric)
      - `currency` (text, default USD)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `mail_forwarding_requests` table
    - Add policies for clients and consultants
*/

-- Create mail forwarding requests table
CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  forwarding_address text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'delivered')),
  stripe_payment_intent_id text,
  tracking_number text,
  amount numeric(10,2) NOT NULL DEFAULT 15.00,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Clients can manage own forwarding requests"
  ON mail_forwarding_requests
  FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT clients.id 
      FROM clients 
      WHERE clients.profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can view client forwarding requests"
  ON mail_forwarding_requests
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT clients.id 
      FROM clients 
      WHERE clients.assigned_consultant_id = auth.uid()
    )
  );

-- Create trigger if it doesn't exist
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