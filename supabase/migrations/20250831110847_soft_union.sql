/*
  # Create projects and tasks tables

  1. New Tables
    - `projects` (Project management)
    - `tasks` (Task management)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  service_order_id uuid REFERENCES service_orders(id),
  title text NOT NULL,
  description_i18n jsonb DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget numeric(10, 2),
  currency text DEFAULT 'USD',
  start_date date,
  end_date date,
  steps jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  title text NOT NULL,
  description text,
  title_i18n jsonb DEFAULT '{}',
  description_i18n jsonb DEFAULT '{}',
  status text DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date date,
  estimated_hours numeric(5, 2) DEFAULT 0,
  actual_hours numeric(5, 2) DEFAULT 0,
  billable boolean DEFAULT true,
  is_client_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Clients can read own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can manage assigned projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can read all projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tasks policies
CREATE POLICY "Clients can read visible tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    is_client_visible = true AND
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can manage own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can read all tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Updated at triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();