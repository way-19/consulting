/*
  # Create Services Table

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, references user_profiles)
      - `country_id` (uuid, nullable, references countries)
      - `title` (text)
      - `description` (text)
      - `price` (numeric, nullable)
      - `is_recurring` (boolean, default false)
      - `billing_period` (text, nullable)
      - `is_public` (boolean, default true)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `services` table
    - Add policies for public read access to active services
    - Add policies for consultants to manage their own services
    - Add policies for admins to manage all services
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric,
  is_recurring boolean NOT NULL DEFAULT false,
  billing_period text,
  is_public boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view public active services"
  ON services
  FOR SELECT
  TO authenticated
  USING (is_public = true AND is_active = true);

CREATE POLICY "Consultants can manage their own services"
  ON services
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid());

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

-- Create trigger for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();