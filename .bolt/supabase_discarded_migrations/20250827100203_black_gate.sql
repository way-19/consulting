/*
  # Projects and Services System

  1. New Tables
    - `projects`
      - Project management for client-consultant relationships
    - `services`
      - Services offered by consultants
    - `transactions`
      - Payment and commission tracking

  2. Security
    - Enable RLS on all tables
    - Proper access controls for each user type

  3. Enums
    - project_status, transaction_status, document_type
*/

-- Create enums
CREATE TYPE project_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE document_type AS ENUM ('identity', 'business', 'financial', 'legal', 'other');

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid NOT NULL REFERENCES countries(id),
  title text NOT NULL,
  description text,
  status project_status NOT NULL DEFAULT 'pending',
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  total_amount numeric(10,2),
  platform_commission numeric(10,2),
  consultant_earnings numeric(10,2),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  title text NOT NULL,
  description text NOT NULL,
  price numeric(10,2),
  is_recurring boolean NOT NULL DEFAULT false,
  billing_period text, -- 'monthly', 'yearly', etc.
  is_public boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id),
  service_id uuid REFERENCES services(id),
  client_id uuid NOT NULL REFERENCES user_profiles(id),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  amount numeric(10,2) NOT NULL,
  platform_commission numeric(10,2) NOT NULL,
  consultant_earnings numeric(10,2) NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id text,
  stripe_session_id text,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
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
  document_type document_type NOT NULL DEFAULT 'other',
  description text,
  is_confidential boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Add updated_at triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for projects
CREATE POLICY "Clients can read their own projects"
  ON projects FOR SELECT TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Consultants can read their assigned projects"
  ON projects FOR SELECT TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can read all projects"
  ON projects FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Consultants can update their projects"
  ON projects FOR UPDATE TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for services
CREATE POLICY "Anyone can read public active services"
  ON services FOR SELECT
  USING (is_public = true AND is_active = true);

CREATE POLICY "Consultants can manage their own services"
  ON services FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Admins can manage all services"
  ON services FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for transactions
CREATE POLICY "Users can read their own transactions"
  ON transactions FOR SELECT TO authenticated
  USING (client_id = auth.uid() OR consultant_id = auth.uid());

CREATE POLICY "Admins can read all transactions"
  ON transactions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for documents
CREATE POLICY "Project participants can read project documents"
  ON documents FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = documents.project_id
      AND (projects.client_id = auth.uid() OR projects.consultant_id = auth.uid())
    )
    OR uploader_id = auth.uid()
  );

CREATE POLICY "Project participants can upload documents"
  ON documents FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = documents.project_id
      AND (projects.client_id = auth.uid() OR projects.consultant_id = auth.uid())
    )
    OR uploader_id = auth.uid()
  );

CREATE POLICY "Admins can manage all documents"
  ON documents FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );