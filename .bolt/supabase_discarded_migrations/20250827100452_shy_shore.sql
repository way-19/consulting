/*
  # Projects and Services Tables

  1. New Tables
    - `projects`
      - Project management between clients and consultants
    - `services`
      - Services offered by consultants
    - `transactions`
      - Payment and commission tracking
    - `documents`
      - Secure document sharing

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each user role
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  title text NOT NULL,
  description text,
  status project_status DEFAULT 'pending',
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_amount numeric,
  platform_commission numeric,
  consultant_earnings numeric,
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  title text NOT NULL,
  description text NOT NULL,
  price numeric,
  is_recurring boolean DEFAULT false,
  billing_period text,
  is_public boolean DEFAULT true,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  service_id uuid REFERENCES services(id),
  client_id uuid NOT NULL REFERENCES user_profiles(id),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  amount numeric NOT NULL,
  platform_commission numeric NOT NULL,
  consultant_earnings numeric NOT NULL,
  status transaction_status DEFAULT 'pending',
  stripe_payment_intent_id text,
  stripe_session_id text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  uploader_id uuid NOT NULL REFERENCES user_profiles(id),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  mime_type text,
  document_type document_type DEFAULT 'other',
  description text,
  is_confidential boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Projects policies
DROP POLICY IF EXISTS "Clients can read own projects" ON projects;
DROP POLICY IF EXISTS "Consultants can read assigned projects" ON projects;
DROP POLICY IF EXISTS "Admins can read all projects" ON projects;
DROP POLICY IF EXISTS "Project participants can update" ON projects;

CREATE POLICY "Clients can read own projects"
  ON projects FOR SELECT TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Consultants can read assigned projects"
  ON projects FOR SELECT TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can read all projects"
  ON projects FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Project participants can update"
  ON projects FOR UPDATE TO authenticated
  USING (client_id = auth.uid() OR consultant_id = auth.uid() OR 
         EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Services policies
DROP POLICY IF EXISTS "Public services are readable" ON services;
DROP POLICY IF EXISTS "Consultants can manage own services" ON services;
DROP POLICY IF EXISTS "Admins can manage all services" ON services;

CREATE POLICY "Public services are readable"
  ON services FOR SELECT TO authenticated, anon
  USING (is_public = true AND is_active = true);

CREATE POLICY "Consultants can manage own services"
  ON services FOR ALL TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can manage all services"
  ON services FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Transactions policies
DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can read all transactions" ON transactions;

CREATE POLICY "Users can read own transactions"
  ON transactions FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR consultant_id = auth.uid());

CREATE POLICY "Admins can read all transactions"
  ON transactions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Documents policies
DROP POLICY IF EXISTS "Project participants can access documents" ON documents;
DROP POLICY IF EXISTS "Admins can access all documents" ON documents;

CREATE POLICY "Project participants can access documents"
  ON documents FOR ALL TO authenticated
  USING (
    uploader_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = documents.project_id 
      AND (client_id = auth.uid() OR consultant_id = auth.uid())
    )
  );

CREATE POLICY "Admins can access all documents"
  ON documents FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Add updated_at triggers
DROP TRIGGER IF EXISTS set_projects_updated_at ON projects;
CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_services_updated_at ON services;
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();