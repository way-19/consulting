/*
  # Create clients and consultant tables

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references user_profiles)
      - `assigned_consultant_id` (uuid, references user_profiles)
      - `company_name` (text)
      - `status` (text)
      - `priority` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `consultant_country_assignments`
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, references user_profiles)
      - `country_id` (uuid, references countries)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add appropriate policies
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assigned_consultant_id uuid REFERENCES user_profiles(id),
  company_name text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'completed')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consultant country assignments table
CREATE TABLE IF NOT EXISTS consultant_country_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(consultant_id, country_id)
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_country_assignments ENABLE ROW LEVEL SECURITY;

-- Clients policies
CREATE POLICY "Users can read own client record"
  ON clients
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Consultants can read assigned clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (assigned_consultant_id = auth.uid());

CREATE POLICY "Admins can read all clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Consultant country assignments policies
CREATE POLICY "Consultants can read own assignments"
  ON consultant_country_assignments
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can manage assignments"
  ON consultant_country_assignments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Updated at triggers
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();