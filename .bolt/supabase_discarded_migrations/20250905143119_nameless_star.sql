/*
  # Create Business Logic Tables

  1. Core Business Tables
    - `projects` - Client business expansion projects
    - `tasks` - Task management with time tracking
    - `custom_services` - Consultant-specific services
    - `service_orders` - Client service purchases

  2. Features
    - Project progress tracking
    - Task assignment and completion
    - Service catalog management
    - Order and payment processing

  3. Security
    - RLS enabled on all tables
    - Role-based access policies
    - Client-consultant relationship security
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  service_order_id uuid REFERENCES service_orders(id),
  title text NOT NULL,
  description_i18n jsonb DEFAULT '{}',
  status text DEFAULT 'active',
  priority text DEFAULT 'medium',
  progress integer DEFAULT 0,
  budget numeric(10,2),
  currency text DEFAULT 'USD',
  start_date date,
  end_date date,
  steps jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT projects_status_check 
    CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled')),
  CONSTRAINT projects_priority_check 
    CHECK (priority IN ('low', 'medium', 'high')),
  CONSTRAINT projects_progress_check 
    CHECK (progress >= 0 AND progress <= 100)
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Project policies
CREATE POLICY "Admins can manage everything" ON projects
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Consultants can manage assigned projects" ON projects
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Clients can read own projects" ON projects
  FOR SELECT TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ));

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  title text NOT NULL,
  description text,
  title_i18n jsonb DEFAULT '{}',
  description_i18n jsonb DEFAULT '{}',
  status text DEFAULT 'todo',
  priority text DEFAULT 'medium',
  due_date date,
  estimated_hours numeric(5,2) DEFAULT 0,
  actual_hours numeric(5,2) DEFAULT 0,
  billable boolean DEFAULT true,
  is_client_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT tasks_status_check 
    CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
  CONSTRAINT tasks_priority_check 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Task policies
CREATE POLICY "tasks_admin_all" ON tasks
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "tasks_read_assigned" ON tasks
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = tasks.client_id AND c.assigned_consultant_id = auth.uid()
  ));

CREATE POLICY "tasks_read_client" ON tasks
  FOR SELECT TO authenticated
  USING (is_client_visible = true AND EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = tasks.client_id AND c.profile_id = auth.uid()
  ));

CREATE POLICY "tasks_insert_assigned" ON tasks
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = tasks.client_id AND c.assigned_consultant_id = auth.uid()
  ));

CREATE POLICY "tasks_update_assigned" ON tasks
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = tasks.client_id AND c.assigned_consultant_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = tasks.client_id AND c.assigned_consultant_id = auth.uid()
  ));

-- Custom services table
CREATE TABLE IF NOT EXISTS custom_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  title_i18n jsonb NOT NULL DEFAULT '{}',
  description_i18n jsonb NOT NULL DEFAULT '{}',
  features_i18n jsonb DEFAULT '{}',
  category text NOT NULL DEFAULT 'general',
  price numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  billing_type text DEFAULT 'one_time',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT custom_services_billing_type_check 
    CHECK (billing_type IN ('one_time', 'monthly', 'quarterly', 'yearly'))
);

ALTER TABLE custom_services ENABLE ROW LEVEL SECURITY;

-- Custom services policies
CREATE POLICY "Admins can manage everything" ON custom_services
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Consultants can manage own services" ON custom_services
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Clients can read consultant services" ON custom_services
  FOR SELECT TO authenticated
  USING (is_active = true AND consultant_id IN (
    SELECT assigned_consultant_id FROM clients 
    WHERE profile_id = auth.uid() AND assigned_consultant_id IS NOT NULL
  ));

-- Service orders table
CREATE TABLE IF NOT EXISTS service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  custom_service_id uuid REFERENCES custom_services(id),
  title text NOT NULL,
  description text,
  total_amount numeric(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending',
  stripe_session_id text,
  stripe_payment_intent_id text,
  company_name text,
  company_type text,
  selected_package_id uuid,
  additional_service_ids uuid[],
  customer_details jsonb DEFAULT '{}',
  file_url text,
  country_id uuid REFERENCES countries(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT service_orders_status_check 
    CHECK (status IN ('pending', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled'))
);

ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

-- Service orders policies
CREATE POLICY "service_orders_insert_client" ON service_orders
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = service_orders.client_id AND c.profile_id = auth.uid()
  ));

CREATE POLICY "service_orders_select_client" ON service_orders
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = service_orders.client_id AND c.profile_id = auth.uid()
  ));

CREATE POLICY "service_orders_update_client" ON service_orders
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = service_orders.client_id AND c.profile_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = service_orders.client_id AND c.profile_id = auth.uid()
  ));

CREATE POLICY "service_orders_select_consultant" ON service_orders
  FOR SELECT TO authenticated
  USING (auth.uid() = consultant_id);

CREATE POLICY "service_orders_update_consultant" ON service_orders
  FOR UPDATE TO authenticated
  USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

CREATE POLICY "service_orders_service_all" ON service_orders
  FOR ALL TO authenticated
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can manage everything" ON service_orders
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_consultant_id ON projects(consultant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON tasks(client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_client_id ON service_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_consultant_id ON service_orders(consultant_id);

-- Create triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_services_updated_at
  BEFORE UPDATE ON custom_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at
  BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();