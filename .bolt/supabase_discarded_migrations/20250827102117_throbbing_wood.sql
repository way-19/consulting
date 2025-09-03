/*
  # Create Services Table

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `country_id` (uuid, foreign key to countries)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `is_recurring` (boolean)
      - `billing_period` (text)
      - `is_public` (boolean)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `services` table
    - Add policies for consultants to manage their services
    - Add policies for clients to view public services
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10,2),
  is_recurring boolean DEFAULT false,
  billing_period text CHECK (billing_period IN ('monthly', 'quarterly', 'yearly')),
  is_public boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Consultants can manage their own services"
  ON services
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Everyone can view public active services"
  ON services
  FOR SELECT
  TO authenticated
  USING (is_public = true AND is_active = true);

CREATE POLICY "Admins can manage all services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_services_consultant_id ON services(consultant_id);
CREATE INDEX idx_services_country_id ON services(country_id);
CREATE INDEX idx_services_public_active ON services(is_public, is_active);