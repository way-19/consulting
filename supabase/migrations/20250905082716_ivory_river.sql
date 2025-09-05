/*
  # Create mail forwarding requests table

  1. New Tables
    - `mail_forwarding_requests`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `document_id` (uuid, foreign key to documents)
      - `document_name` (text)
      - `forwarding_address` (text)
      - `payment_amount` (numeric)
      - `status` (text)
      - `stripe_session_id` (text)
      - `stripe_payment_intent_id` (text)
      - `tracking_number` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `mail_forwarding_requests` table
    - Add policies for clients and consultants to manage their own requests
*/

CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  forwarding_address text NOT NULL,
  payment_amount numeric(10,2) DEFAULT 15.00,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'failed')),
  stripe_session_id text,
  stripe_payment_intent_id text,
  tracking_number text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- Clients can read and insert their own forwarding requests
CREATE POLICY "Clients can read own mail forwarding requests"
  ON mail_forwarding_requests
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Clients can insert own mail forwarding requests"
  ON mail_forwarding_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

-- Consultants can read and update their clients' forwarding requests
CREATE POLICY "Consultants can read assigned clients mail forwarding requests"
  ON mail_forwarding_requests
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Consultants can update assigned clients mail forwarding requests"
  ON mail_forwarding_requests
  FOR UPDATE
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Admins can manage all mail forwarding requests
CREATE POLICY "Admins can manage all mail forwarding requests"
  ON mail_forwarding_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_mail_forwarding_requests_updated_at
  BEFORE UPDATE ON mail_forwarding_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();