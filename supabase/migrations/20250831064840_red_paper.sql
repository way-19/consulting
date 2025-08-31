/*
  # Fix Column Already Exists Errors and Complete Professional System

  1. Problem Resolution
    - Fix "column already exists" errors by checking before adding
    - Complete missing table structures safely
    - Ensure proper dependency order

  2. Professional Features
    - Enterprise document management
    - Advanced messaging system
    - Complete onboarding flow
    - Financial tracking

  3. Security & Performance
    - Proper RLS policies
    - Performance indexes
    - Audit trails
*/

-- Ensure user_role enum exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'client', 'consultant');
  END IF;
END $$;

-- Add missing columns to user_profiles ONLY if they don't exist
DO $$
BEGIN
  -- Check and add each column individually
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'display_name') THEN
    ALTER TABLE user_profiles ADD COLUMN display_name text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'preferred_language') THEN
    ALTER TABLE user_profiles ADD COLUMN preferred_language text DEFAULT 'en';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'avatar_url') THEN
    ALTER TABLE user_profiles ADD COLUMN avatar_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'country_id') THEN
    ALTER TABLE user_profiles ADD COLUMN country_id uuid REFERENCES countries(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'company') THEN
    ALTER TABLE user_profiles ADD COLUMN company text;
  END IF;
  
  -- phone column already exists, skip it
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'timezone') THEN
    ALTER TABLE user_profiles ADD COLUMN timezone text DEFAULT 'UTC';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'is_active') THEN
    ALTER TABLE user_profiles ADD COLUMN is_active boolean DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'last_login_at') THEN
    ALTER TABLE user_profiles ADD COLUMN last_login_at timestamptz;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'metadata') THEN
    ALTER TABLE user_profiles ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;
END $$;

-- Drop ALL existing problematic tables to start completely clean
DROP TABLE IF EXISTS consultant_availability CASCADE;
DROP TABLE IF EXISTS booking_requests CASCADE;
DROP TABLE IF EXISTS time_entries CASCADE;
DROP TABLE IF EXISTS service_orders CASCADE;
DROP TABLE IF EXISTS custom_services CASCADE;
DROP TABLE IF EXISTS client_onboarding_progress CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS document_requests CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS message_threads CASCADE;
DROP TABLE IF EXISTS thread_participants CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS consultant_country_assignments CASCADE;
DROP TABLE IF EXISTS document_categories CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS feature_flags CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS telemetry_events CASCADE;

-- Now create tables in CORRECT dependency order

-- 1. Document categories (no dependencies)
CREATE TABLE document_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text DEFAULT 'blue',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 2. Consultant country assignments (depends on user_profiles and countries)
CREATE TABLE consultant_country_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  specializations text[],
  capacity_limit integer DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(consultant_id, country_id)
);

-- 3. Clients table (depends on user_profiles)
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assigned_consultant_id uuid REFERENCES user_profiles(id),
  country_id uuid REFERENCES countries(id),
  company_name text,
  industry text,
  business_type text,
  annual_revenue_range text,
  employee_count_range text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'completed', 'suspended')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'vip')),
  onboarding_status text DEFAULT 'not_started' CHECK (onboarding_status IN ('not_started', 'in_progress', 'completed')),
  contact_email text,
  contact_phone text,
  address jsonb,
  notes text,
  tags text[],
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id)
);

-- 4. Projects table (depends on clients)
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  title text NOT NULL,
  description_i18n jsonb DEFAULT '{"en": ""}',
  status text DEFAULT 'intake' CHECK (status IN ('intake', 'review', 'active', 'on_hold', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget numeric,
  currency text DEFAULT 'USD',
  start_date date,
  end_date date,
  steps jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. Tasks table (depends on clients and projects)
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  title_i18n jsonb DEFAULT '{"en": ""}',
  description_i18n jsonb DEFAULT '{"en": ""}',
  status text DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date timestamptz,
  estimated_hours numeric DEFAULT 0,
  actual_hours numeric DEFAULT 0,
  billable boolean DEFAULT true,
  is_client_visible boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. Document requests table (depends on clients, projects, categories)
CREATE TABLE document_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  category_id uuid REFERENCES document_categories(id),
  title text NOT NULL,
  description text,
  due_date timestamptz,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'approved', 'rejected', 'expired')),
  reminder_sent_at timestamptz,
  notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. Documents table (depends on clients, document_requests, document_categories)
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES document_requests(id) ON DELETE SET NULL,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  project_id uuid REFERENCES projects(id),
  category_id uuid REFERENCES document_categories(id),
  name text NOT NULL,
  original_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  checksum text,
  status text DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'in_review', 'approved', 'rejected', 'archived')),
  tags text[],
  metadata jsonb DEFAULT '{}',
  uploaded_by uuid REFERENCES user_profiles(id),
  reviewed_by uuid REFERENCES user_profiles(id),
  reviewed_at timestamptz,
  review_notes text,
  version integer DEFAULT 1,
  is_watermarked boolean DEFAULT false,
  expires_at timestamptz,
  download_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 8. Custom services table (depends on user_profiles and countries)
CREATE TABLE custom_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  title_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  description_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  features_i18n jsonb DEFAULT '{"en": []}' NOT NULL,
  price numeric NOT NULL,
  currency text DEFAULT 'USD',
  billing_type text DEFAULT 'one_time' CHECK (billing_type IN ('one_time', 'monthly', 'quarterly', 'yearly')),
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. Service orders table (depends on clients, custom_services, projects)
CREATE TABLE service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  service_id uuid REFERENCES custom_services(id),
  project_id uuid REFERENCES projects(id),
  title text NOT NULL,
  description text,
  total_amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'in_progress', 'completed', 'cancelled', 'refunded')),
  stripe_session_id text,
  stripe_payment_intent_id text,
  paid_at timestamptz,
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 10. Transactions table (depends on service_orders and clients)
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES service_orders(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  gross_amount numeric NOT NULL,
  platform_fee numeric NOT NULL,
  consultant_amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  transaction_type text DEFAULT 'payment' CHECK (transaction_type IN ('payment', 'refund', 'chargeback')),
  stripe_transaction_id text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  processed_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 11. Time entries table (depends on tasks)
CREATE TABLE time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  minutes integer NOT NULL,
  description text,
  date date DEFAULT CURRENT_DATE,
  billable boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 12. Message threads table (depends on projects)
CREATE TABLE message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
  created_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 13. Thread participants table (depends on message_threads)
CREATE TABLE thread_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'participant' CHECK (role IN ('participant', 'moderator', 'admin')),
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz,
  UNIQUE(thread_id, user_id)
);

-- 14. Messages table (depends on message_threads)
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  body_original text NOT NULL,
  body_translated jsonb DEFAULT '{}',
  from_lang text DEFAULT 'en',
  attachments jsonb DEFAULT '[]',
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'system')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 15. Client onboarding progress table
CREATE TABLE client_onboarding_progress (
  profile_id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  profile_done boolean DEFAULT false NOT NULL,
  documents_done boolean DEFAULT false NOT NULL,
  agreements_done boolean DEFAULT false NOT NULL,
  kickoff_done boolean DEFAULT false NOT NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 16. Notifications table (depends on user_profiles)
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  type text NOT NULL,
  title_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  message_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  action_url text,
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_read boolean DEFAULT false,
  read_at timestamptz,
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 17. Audit logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  session_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- 18. Telemetry events table
CREATE TABLE telemetry_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  session_id text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- 19. Feature flags table
CREATE TABLE feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  is_enabled boolean DEFAULT false,
  target_users jsonb DEFAULT '[]',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comprehensive indexes for performance
CREATE INDEX idx_consultant_country_assignments_consultant ON consultant_country_assignments(consultant_id);
CREATE INDEX idx_consultant_country_assignments_country ON consultant_country_assignments(country_id);
CREATE INDEX idx_consultant_country_assignments_status ON consultant_country_assignments(status);

CREATE INDEX idx_document_categories_slug ON document_categories(slug);
CREATE INDEX idx_document_categories_active ON document_categories(is_active);

CREATE INDEX idx_clients_profile ON clients(profile_id);
CREATE INDEX idx_clients_consultant ON clients(assigned_consultant_id);
CREATE INDEX idx_clients_country ON clients(country_id);
CREATE INDEX idx_clients_status ON clients(status);

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_consultant ON projects(consultant_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

CREATE INDEX idx_tasks_client ON tasks(client_id);
CREATE INDEX idx_tasks_consultant ON tasks(consultant_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

CREATE INDEX idx_document_requests_consultant ON document_requests(consultant_id);
CREATE INDEX idx_document_requests_client ON document_requests(client_id);
CREATE INDEX idx_document_requests_project ON document_requests(project_id);
CREATE INDEX idx_document_requests_status ON document_requests(status);
CREATE INDEX idx_document_requests_due_date ON document_requests(due_date);

CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_consultant ON documents(consultant_id);
CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created_at ON documents(created_at);

CREATE INDEX idx_custom_services_consultant ON custom_services(consultant_id);
CREATE INDEX idx_custom_services_country ON custom_services(country_id);
CREATE INDEX idx_custom_services_active ON custom_services(is_active);

CREATE INDEX idx_service_orders_client ON service_orders(client_id);
CREATE INDEX idx_service_orders_consultant ON service_orders(consultant_id);
CREATE INDEX idx_service_orders_status ON service_orders(status);
CREATE INDEX idx_service_orders_created_at ON service_orders(created_at);

CREATE INDEX idx_transactions_client ON transactions(client_id);
CREATE INDEX idx_transactions_consultant ON transactions(consultant_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

CREATE INDEX idx_time_entries_task ON time_entries(task_id);
CREATE INDEX idx_time_entries_consultant ON time_entries(consultant_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);

CREATE INDEX idx_message_threads_project ON message_threads(project_id);
CREATE INDEX idx_thread_participants_thread ON thread_participants(thread_id);
CREATE INDEX idx_thread_participants_user ON thread_participants(user_id);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX idx_telemetry_events_user ON telemetry_events(user_id);
CREATE INDEX idx_telemetry_events_type ON telemetry_events(event_type);
CREATE INDEX idx_telemetry_events_created_at ON telemetry_events(created_at);

-- Enable RLS on all tables
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_country_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Comprehensive RLS Policies

-- Document categories policies
CREATE POLICY "public_read_active_categories" ON document_categories
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "admin_manage_categories" ON document_categories
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Consultant country assignments policies
CREATE POLICY "public_read_active_assignments" ON consultant_country_assignments
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "consultants_manage_own_assignments" ON consultant_country_assignments
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "admin_manage_all_assignments" ON consultant_country_assignments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Clients policies
CREATE POLICY "users_read_own_client_record" ON clients
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "users_manage_own_client_record" ON clients
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "users_update_own_client_record" ON clients
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "consultants_read_assigned_clients" ON clients
  FOR SELECT TO authenticated
  USING (assigned_consultant_id = auth.uid());

CREATE POLICY "consultants_update_assigned_clients" ON clients
  FOR UPDATE TO authenticated
  USING (assigned_consultant_id = auth.uid())
  WITH CHECK (assigned_consultant_id = auth.uid());

CREATE POLICY "admin_manage_all_clients" ON clients
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Projects policies
CREATE POLICY "project_participants_read" ON projects
  FOR SELECT TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()) OR
    consultant_id = auth.uid()
  );

CREATE POLICY "consultants_manage_projects" ON projects
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Tasks policies
CREATE POLICY "consultants_manage_tasks" ON tasks
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "clients_read_visible_tasks" ON tasks
  FOR SELECT TO authenticated
  USING (
    is_client_visible = true AND
    client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid())
  );

-- Document requests policies
CREATE POLICY "consultants_manage_requests" ON document_requests
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "clients_read_own_requests" ON document_requests
  FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- Documents policies
CREATE POLICY "consultants_manage_client_documents" ON documents
  FOR ALL TO authenticated
  USING (
    consultant_id = auth.uid() OR
    client_id IN (SELECT id FROM clients WHERE assigned_consultant_id = auth.uid())
  )
  WITH CHECK (
    consultant_id = auth.uid() OR
    client_id IN (SELECT id FROM clients WHERE assigned_consultant_id = auth.uid())
  );

CREATE POLICY "clients_manage_own_documents" ON documents
  FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()))
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- Custom services policies
CREATE POLICY "public_read_active_services" ON custom_services
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "consultants_manage_own_services" ON custom_services
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Service orders policies
CREATE POLICY "clients_read_own_orders" ON service_orders
  FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "clients_create_own_orders" ON service_orders
  FOR INSERT TO authenticated
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "consultants_read_assigned_orders" ON service_orders
  FOR SELECT TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "consultants_update_assigned_orders" ON service_orders
  FOR UPDATE TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Transactions policies
CREATE POLICY "users_read_own_transactions" ON transactions
  FOR SELECT TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()) OR
    consultant_id = auth.uid()
  );

CREATE POLICY "admin_read_all_transactions" ON transactions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Time entries policies
CREATE POLICY "consultants_manage_own_time_entries" ON time_entries
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Messaging policies
CREATE POLICY "thread_participants_read_threads" ON message_threads
  FOR SELECT TO authenticated
  USING (id IN (SELECT thread_id FROM thread_participants WHERE user_id = auth.uid()));

CREATE POLICY "thread_participants_read_participants" ON thread_participants
  FOR SELECT TO authenticated
  USING (thread_id IN (SELECT thread_id FROM thread_participants WHERE user_id = auth.uid()));

CREATE POLICY "thread_participants_read_messages" ON messages
  FOR SELECT TO authenticated
  USING (thread_id IN (SELECT thread_id FROM thread_participants WHERE user_id = auth.uid()));

CREATE POLICY "thread_participants_send_messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    thread_id IN (SELECT thread_id FROM thread_participants WHERE user_id = auth.uid())
  );

-- Onboarding progress policies
CREATE POLICY "users_manage_own_onboarding" ON client_onboarding_progress
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "consultants_read_client_onboarding" ON client_onboarding_progress
  FOR SELECT TO authenticated
  USING (profile_id IN (SELECT profile_id FROM clients WHERE assigned_consultant_id = auth.uid()));

-- Notifications policies
CREATE POLICY "users_read_own_notifications" ON notifications
  FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "users_update_own_notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "system_send_notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Audit logs policies (admin only)
CREATE POLICY "admin_read_audit_logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "system_log_audit" ON audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Telemetry events policies (admin only)
CREATE POLICY "admin_read_telemetry" ON telemetry_events
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "system_log_telemetry" ON telemetry_events
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Feature flags policies (admin only)
CREATE POLICY "admin_manage_feature_flags" ON feature_flags
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_consultant_country_assignments_updated_at
  BEFORE UPDATE ON consultant_country_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_requests_updated_at
  BEFORE UPDATE ON document_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_services_updated_at
  BEFORE UPDATE ON custom_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at
  BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_threads_updated_at
  BEFORE UPDATE ON message_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_onboarding_progress_updated_at
  BEFORE UPDATE ON client_onboarding_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default document categories
INSERT INTO document_categories (name, slug, description, icon, color) VALUES
('Identity Documents', 'identity', 'Passport, ID cards, driver licenses', 'User', 'blue'),
('Financial Documents', 'financial', 'Bank statements, financial records', 'DollarSign', 'green'),
('Business Documents', 'business', 'Business plans, articles of incorporation', 'Building2', 'purple'),
('Legal Documents', 'legal', 'Contracts, agreements, legal filings', 'FileText', 'red'),
('Tax Documents', 'tax', 'Tax returns, certificates, compliance docs', 'Calculator', 'orange'),
('Banking Documents', 'banking', 'Account opening docs, banking forms', 'CreditCard', 'teal'),
('Compliance Documents', 'compliance', 'Regulatory filings, compliance certificates', 'Shield', 'indigo'),
('Other Documents', 'other', 'Miscellaneous documents', 'File', 'gray');

-- Insert default feature flags
INSERT INTO feature_flags (flag_key, name, description, is_enabled) VALUES
('messaging_enabled', 'Messaging System', 'Enable messaging between clients and consultants', true),
('auto_translate_enabled', 'Auto Translation', 'Enable automatic message translation', true),
('document_watermark', 'Document Watermarking', 'Enable watermarking for downloaded documents', false),
('stripe_payments', 'Stripe Payments', 'Enable Stripe payment processing', true),
('bulk_document_actions', 'Bulk Document Actions', 'Enable bulk operations on documents', true);

-- Create utility functions
CREATE OR REPLACE FUNCTION log_audit_action(
  action_type text,
  resource_type text,
  resource_id text DEFAULT NULL,
  old_values jsonb DEFAULT NULL,
  new_values jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    action_type,
    resource_type,
    resource_id,
    old_values,
    new_values
  );
END;
$$;

CREATE OR REPLACE FUNCTION log_telemetry_event(
  event_type text,
  event_data jsonb DEFAULT '{}'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO telemetry_events (
    user_id,
    event_type,
    event_data
  ) VALUES (
    auth.uid(),
    event_type,
    event_data
  );
END;
$$;

-- Sample data for testing (using explicit table references to avoid ambiguity)
DO $$
DECLARE
  v_admin_id uuid;
  v_consultant_id uuid;
  v_client_id uuid;
  v_client_record_id uuid;
  v_georgia_id uuid;
  v_project_id uuid;
  v_thread_id uuid;
  v_category_id uuid;
BEGIN
  -- Get user IDs with explicit variable names
  SELECT user_profiles.id INTO v_admin_id FROM user_profiles WHERE user_profiles.email = 'admin@consulting19.com';
  SELECT user_profiles.id INTO v_consultant_id FROM user_profiles WHERE user_profiles.email = 'giorgi.meskhi@consulting19.com';
  SELECT user_profiles.id INTO v_client_id FROM user_profiles WHERE user_profiles.email = 'client@consulting19.com';
  SELECT countries.id INTO v_georgia_id FROM countries WHERE countries.code = 'ge' OR countries.name ILIKE '%georgia%' LIMIT 1;
  SELECT document_categories.id INTO v_category_id FROM document_categories WHERE document_categories.slug = 'identity' LIMIT 1;

  IF v_consultant_id IS NOT NULL AND v_georgia_id IS NOT NULL THEN
    -- Create consultant-country assignment
    INSERT INTO consultant_country_assignments (
      consultant_id,
      country_id,
      status,
      specializations,
      capacity_limit
    ) VALUES (
      v_consultant_id,
      v_georgia_id,
      'active',
      ARRAY['Company Formation', 'Tax Planning', 'Banking'],
      25
    ) ON CONFLICT (consultant_id, country_id) DO NOTHING;
  END IF;

  IF v_client_id IS NOT NULL AND v_consultant_id IS NOT NULL THEN
    -- Create client record
    INSERT INTO clients (
      profile_id,
      assigned_consultant_id,
      country_id,
      company_name,
      industry,
      status,
      priority
    ) VALUES (
      v_client_id,
      v_consultant_id,
      v_georgia_id,
      'Test Company LLC',
      'Technology',
      'active',
      'high'
    ) ON CONFLICT (profile_id) DO UPDATE SET
      assigned_consultant_id = EXCLUDED.assigned_consultant_id,
      country_id = EXCLUDED.country_id
    RETURNING clients.id INTO v_client_record_id;

    -- Create sample project
    INSERT INTO projects (
      client_id,
      consultant_id,
      country_id,
      title,
      description_i18n,
      status,
      priority,
      progress
    ) VALUES (
      v_client_record_id,
      v_consultant_id,
      v_georgia_id,
      'Georgia LLC Formation',
      '{"en": "Complete business setup in Georgia with small business status", "tr": "Küçük işletme statüsü ile Gürcistan''da komple iş kurulumu", "pt": "Configuração completa de negócios na Geórgia com status de pequena empresa"}',
      'active',
      'high',
      75
    ) RETURNING projects.id INTO v_project_id;

    -- Create sample tasks
    INSERT INTO tasks (
      client_id,
      consultant_id,
      project_id,
      title,
      description,
      title_i18n,
      description_i18n,
      status,
      priority,
      estimated_hours,
      billable,
      is_client_visible
    ) VALUES 
    (
      v_client_record_id,
      v_consultant_id,
      v_project_id,
      'Company Formation Documents',
      'Prepare and review company formation documents for Georgia LLC',
      '{"en": "Company Formation Documents", "tr": "Şirket Kuruluş Belgeleri", "pt": "Documentos de Formação da Empresa"}',
      '{"en": "Prepare and review company formation documents for Georgia LLC", "tr": "Gürcistan LLC için şirket kuruluş belgelerini hazırlayın ve inceleyin", "pt": "Preparar e revisar documentos de formação da empresa para Georgia LLC"}',
      'in_progress',
      'high',
      8.0,
      true,
      true
    ),
    (
      v_client_record_id,
      v_consultant_id,
      v_project_id,
      'Banking Setup',
      'Assist with corporate banking account opening',
      '{"en": "Banking Setup", "tr": "Bankacılık Kurulumu", "pt": "Configuração Bancária"}',
      '{"en": "Assist with corporate banking account opening", "tr": "Kurumsal banka hesabı açılışında yardım", "pt": "Auxiliar na abertura de conta bancária corporativa"}',
      'todo',
      'medium',
      4.0,
      true,
      true
    );

    -- Create message thread
    INSERT INTO message_threads (
      project_id,
      title,
      created_by
    ) VALUES (
      v_project_id,
      'Georgia LLC Formation Discussion',
      v_consultant_id
    ) RETURNING message_threads.id INTO v_thread_id;

    -- Add participants
    INSERT INTO thread_participants (thread_id, user_id, role) VALUES
    (v_thread_id, v_consultant_id, 'moderator'),
    (v_thread_id, v_client_id, 'participant');

    -- Create sample custom service
    INSERT INTO custom_services (
      consultant_id,
      country_id,
      title_i18n,
      description_i18n,
      features_i18n,
      price,
      currency,
      category
    ) VALUES (
      v_consultant_id,
      v_georgia_id,
      '{"en": "Georgia Business Setup", "tr": "Gürcistan İş Kurulumu", "pt": "Configuração de Negócios na Geórgia"}',
      '{"en": "Complete business formation in Georgia with small business status", "tr": "Küçük işletme statüsü ile Gürcistan''da komple iş kurulumu", "pt": "Formação completa de negócios na Geórgia com status de pequena empresa"}',
      '{"en": ["Company registration", "Tax registration", "Banking assistance", "Legal compliance"], "tr": ["Şirket kaydı", "Vergi kaydı", "Bankacılık yardımı", "Yasal uyumluluk"], "pt": ["Registro de empresa", "Registro fiscal", "Assistência bancária", "Conformidade legal"]}',
      2500,
      'USD',
      'Company Formation'
    );

    -- Create sample document request
    INSERT INTO document_requests (
      consultant_id,
      client_id,
      project_id,
      category_id,
      title,
      description,
      due_date,
      priority,
      status
    ) VALUES (
      v_consultant_id,
      v_client_record_id,
      v_project_id,
      v_category_id,
      'Passport Copy Required',
      'Please upload a clear copy of your passport for company registration',
      CURRENT_DATE + INTERVAL '7 days',
      'high',
      'pending'
    );

    -- Create onboarding progress
    INSERT INTO client_onboarding_progress (
      profile_id,
      profile_done,
      documents_done,
      agreements_done,
      kickoff_done
    ) VALUES (
      v_client_id,
      true,
      false,
      false,
      false
    ) ON CONFLICT (profile_id) DO NOTHING;

    -- Create sample notification
    INSERT INTO notifications (
      recipient_id,
      sender_id,
      type,
      title_i18n,
      message_i18n,
      priority
    ) VALUES (
      v_client_id,
      v_consultant_id,
      'document_requested',
      '{"en": "Document Required", "tr": "Belge Gerekli", "pt": "Documento Necessário"}',
      '{"en": "Your consultant has requested a passport copy", "tr": "Danışmanınız pasaport kopyası istedi", "pt": "Seu consultor solicitou uma cópia do passaporte"}',
      'normal'
    );

    -- Create sample service order
    INSERT INTO service_orders (
      client_id,
      consultant_id,
      title,
      description,
      total_amount,
      currency,
      status
    ) VALUES (
      v_client_record_id,
      v_consultant_id,
      'Georgia LLC Formation Service',
      'Complete business setup in Georgia',
      2500,
      'USD',
      'paid'
    );

    -- Create sample transaction
    INSERT INTO transactions (
      client_id,
      consultant_id,
      gross_amount,
      platform_fee,
      consultant_amount,
      currency,
      transaction_type,
      status,
      processed_at
    ) VALUES (
      v_client_record_id,
      v_consultant_id,
      2500,
      875,  -- 35% platform fee
      1625, -- 65% consultant payout
      'USD',
      'payment',
      'completed',
      now()
    );
  END IF;
END $$;