/*
  # Create Projects Table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references user_profiles)
      - `consultant_id` (uuid, references user_profiles)
      - `country_id` (uuid, references countries)
      - `title` (text)
      - `description` (text, nullable)
      - `status` (project_status enum)
      - `progress` (integer, default 0)
      - `total_amount` (numeric, nullable)
      - `platform_commission` (numeric, nullable)
      - `consultant_earnings` (numeric, nullable)
      - `due_date` (date, nullable)
      - `completed_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `projects` table
    - Add policies for clients to view their own projects
    - Add policies for consultants to view their assigned projects
    - Add policies for admins to view all projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
  title text NOT NULL,
  description text,
  status project_status NOT NULL DEFAULT 'pending',
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_amount numeric,
  platform_commission numeric,
  consultant_earnings numeric,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Clients can view their own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Consultants can view their assigned projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Consultants can update their assigned projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can manage all projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to update completed_at when status changes to completed
CREATE OR REPLACE FUNCTION set_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = now();
    NEW.progress = 100;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_project_completed_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_completed_at();