/*
  # Create Transactions Table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `project_id` (uuid, nullable, references projects)
      - `service_id` (uuid, nullable, references services)
      - `client_id` (uuid, references user_profiles)
      - `consultant_id` (uuid, references user_profiles)
      - `amount` (numeric)
      - `platform_commission` (numeric)
      - `consultant_earnings` (numeric)
      - `status` (transaction_status enum)
      - `stripe_payment_intent_id` (text, nullable)
      - `stripe_session_id` (text, nullable)
      - `processed_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for clients to view their own transactions
    - Add policies for consultants to view their earnings
    - Add policies for admins to view all transactions
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  client_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  platform_commission numeric NOT NULL CHECK (platform_commission >= 0),
  consultant_earnings numeric NOT NULL CHECK (consultant_earnings >= 0),
  status transaction_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id text,
  stripe_session_id text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clients can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Consultants can view their earnings"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can view all transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger to set processed_at when status changes to completed
CREATE OR REPLACE FUNCTION set_processed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.processed_at = now();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_transaction_processed_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION set_processed_at();

-- Create function to calculate commission (35% platform, 65% consultant)
CREATE OR REPLACE FUNCTION calculate_commission(total_amount numeric)
RETURNS TABLE(platform_commission numeric, consultant_earnings numeric) AS $$
BEGIN
  RETURN QUERY SELECT 
    ROUND(total_amount * 0.35, 2) as platform_commission,
    ROUND(total_amount * 0.65, 2) as consultant_earnings;
END;
$$ language 'plpgsql';