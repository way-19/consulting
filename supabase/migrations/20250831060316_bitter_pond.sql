/*
  # Rebuild Professional Dashboard System

  1. Complete Data Model
    - Enhanced user profiles with proper metadata
    - Consultant-country assignments
    - Professional document management system
    - Messaging with auto-translate
    - Transactions and commission tracking
    - Blog and FAQ management
    - Audit trails and telemetry

  2. Enterprise Document Management
    - Document categories and requests
    - Advanced metadata and status tracking
    - Bulk operations support
    - Audit trails for all document actions

  3. Professional Messaging System
    - Thread-based messaging with auto-translate
    - File attachments linked to documents
    - Real-time notifications

  4. Complete Admin Panel
    - Content management for marketing
    - User and consultant management
    - Financial reporting and analytics
    - System settings and configuration

  5. Security & Performance
    - Comprehensive RLS policies
    - Proper indexes for scale
    - Audit logging for all critical actions
*/

-- Drop existing tables that need rebuilding (preserve user_profiles and marketing_pages)
DROP TABLE IF EXISTS consultant_availability CASCADE;
DROP TABLE IF EXISTS booking_requests CASCADE;
DROP TABLE IF EXISTS time_entries CASCADE;
DROP TABLE IF EXISTS service_orders CASCADE;
DROP TABLE IF EXISTS custom_services CASCADE;
DROP TABLE IF EXISTS client_onboarding_progress CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- Enhanced user profiles with proper metadata
DO $$
BEGIN
  -- Add missing columns to user_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN display_name text;
    ALTER TABLE user_profiles ADD COLUMN preferred_language text DEFAULT 'en';
    ALTER TABLE user_profiles ADD COLUMN avatar_url text;
    ALTER TABLE user_profiles ADD COLUMN country_id uuid REFERENCES countries(id);
    ALTER TABLE user_profiles ADD COLUMN company text;
    ALTER TABLE user_profiles ADD COLUMN phone text;
    ALTER TABLE user_profiles ADD COLUMN timezone text DEFAULT 'UTC';
    ALTER TABLE user_profiles ADD COLUMN is_active boolean DEFAULT true;
    ALTER TABLE user_profiles ADD COLUMN last_login_at timestamptz;
    ALTER TABLE user_profiles ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;
END $$;

-- Consultant-country assignments
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

-- Document categories for enterprise management
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

-- Document requests system
CREATE TABLE document_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  project_id uuid,
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

-- Enhanced documents table for enterprise management
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES document_requests(id) ON DELETE SET NULL,
  client_id uuid NOT NULL,
  consultant_id uuid REFERENCES user_profiles(id),
  project_id uuid,
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

-- Clients table with enhanced metadata
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

-- Projects with enhanced tracking
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

-- Message threads for communication
CREATE TABLE message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
  created_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Thread participants
CREATE TABLE thread_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'participant' CHECK (role IN ('participant', 'moderator', 'admin')),
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz,
  UNIQUE(thread_id, user_id)
);

-- Messages with auto-translate support
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

-- Custom services for consultants
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

-- Service orders and transactions
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

-- Transactions ledger for commission tracking
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

-- Blog posts management
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  title_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  excerpt_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  content_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  tags text[],
  featured_image_url text,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  published_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- FAQ management
CREATE TABLE faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  category text NOT NULL,
  question_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  answer_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  is_global boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced notifications system
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

-- Audit logs for enterprise compliance
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

-- Telemetry events
CREATE TABLE telemetry_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  session_id text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Feature flags
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

-- System settings
CREATE TABLE system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  category text DEFAULT 'general',
  description text,
  is_public boolean DEFAULT false,
  updated_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comprehensive indexes for performance
CREATE INDEX idx_consultant_country_assignments_consultant ON consultant_country_assignments(consultant_id);
CREATE INDEX idx_consultant_country_assignments_country ON consultant_country_assignments(country_id);
CREATE INDEX idx_consultant_country_assignments_status ON consultant_country_assignments(status);

CREATE INDEX idx_document_requests_consultant ON document_requests(consultant_id);
CREATE INDEX idx_document_requests_client ON document_requests(client_id);
CREATE INDEX idx_document_requests_status ON document_requests(status);
CREATE INDEX idx_document_requests_due_date ON document_requests(due_date);

CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_consultant ON documents(consultant_id);
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_documents_tags ON documents USING gin(tags);

CREATE INDEX idx_clients_profile ON clients(profile_id);
CREATE INDEX idx_clients_consultant ON clients(assigned_consultant_id);
CREATE INDEX idx_clients_country ON clients(country_id);
CREATE INDEX idx_clients_status ON clients(status);

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_consultant ON projects(consultant_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);

CREATE INDEX idx_message_threads_project ON message_threads(project_id);
CREATE INDEX idx_thread_participants_thread ON thread_participants(thread_id);
CREATE INDEX idx_thread_participants_user ON thread_participants(user_id);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

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

CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_country ON blog_posts(country_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured);

CREATE INDEX idx_faqs_consultant ON faqs(consultant_id);
CREATE INDEX idx_faqs_country ON faqs(country_id);
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_active ON faqs(is_active);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

CREATE INDEX idx_telemetry_events_user ON telemetry_events(user_id);
CREATE INDEX idx_telemetry_events_type ON telemetry_events(event_type);
CREATE INDEX idx_telemetry_events_created_at ON telemetry_events(created_at);

-- Enable RLS on all tables
ALTER TABLE consultant_country_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultant_country_assignments
CREATE POLICY "Public read active assignments" ON consultant_country_assignments
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

CREATE POLICY "Consultants manage own assignments" ON consultant_country_assignments
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Admin manage all assignments" ON consultant_country_assignments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for document_categories
CREATE POLICY "Public read active categories" ON document_categories
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin manage categories" ON document_categories
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for document_requests
CREATE POLICY "Consultants manage own requests" ON document_requests
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Clients read own requests" ON document_requests
  FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- RLS Policies for documents
CREATE POLICY "Consultants manage assigned client documents" ON documents
  FOR ALL TO authenticated
  USING (
    consultant_id = auth.uid() OR
    client_id IN (SELECT id FROM clients WHERE assigned_consultant_id = auth.uid())
  )
  WITH CHECK (
    consultant_id = auth.uid() OR
    client_id IN (SELECT id FROM clients WHERE assigned_consultant_id = auth.uid())
  );

CREATE POLICY "Clients manage own documents" ON documents
  FOR ALL TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()))
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- RLS Policies for clients
CREATE POLICY "Users read own client record" ON clients
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users manage own client record" ON clients
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users update own client record" ON clients
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Consultants read assigned clients" ON clients
  FOR SELECT TO authenticated
  USING (assigned_consultant_id = auth.uid());

CREATE POLICY "Consultants update assigned clients" ON clients
  FOR UPDATE TO authenticated
  USING (assigned_consultant_id = auth.uid())
  WITH CHECK (assigned_consultant_id = auth.uid());

CREATE POLICY "Admin manage all clients" ON clients
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for projects
CREATE POLICY "Project participants read projects" ON projects
  FOR SELECT TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()) OR
    consultant_id = auth.uid()
  );

CREATE POLICY "Consultants manage assigned projects" ON projects
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for messaging
CREATE POLICY "Thread participants read threads" ON message_threads
  FOR SELECT TO authenticated
  USING (id IN (SELECT thread_id FROM thread_participants WHERE user_id = auth.uid()));

CREATE POLICY "Thread participants read participants" ON thread_participants
  FOR SELECT TO authenticated
  USING (thread_id IN (SELECT thread_id FROM thread_participants WHERE user_id = auth.uid()));

CREATE POLICY "Thread participants read messages" ON messages
  FOR SELECT TO authenticated
  USING (thread_id IN (SELECT thread_id FROM thread_participants WHERE user_id = auth.uid()));

CREATE POLICY "Thread participants send messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    thread_id IN (SELECT thread_id FROM thread_participants WHERE user_id = auth.uid())
  );

-- RLS Policies for custom_services
CREATE POLICY "Public read active services" ON custom_services
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Consultants manage own services" ON custom_services
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for service_orders
CREATE POLICY "Clients read own orders" ON service_orders
  FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Clients create own orders" ON service_orders
  FOR INSERT TO authenticated
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Consultants read assigned orders" ON service_orders
  FOR SELECT TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Consultants update assigned orders" ON service_orders
  FOR UPDATE TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Users read own transactions" ON transactions
  FOR SELECT TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()) OR
    consultant_id = auth.uid()
  );

CREATE POLICY "Admin read all transactions" ON transactions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for blog_posts
CREATE POLICY "Public read published posts" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Authors manage own posts" ON blog_posts
  FOR ALL TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Admin manage all posts" ON blog_posts
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for faqs
CREATE POLICY "Public read active faqs" ON faqs
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Consultants manage own faqs" ON faqs
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Admin manage all faqs" ON faqs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for notifications
CREATE POLICY "Users read own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (recipient_id = auth.uid());

CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

CREATE POLICY "System send notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- RLS Policies for audit_logs (admin only)
CREATE POLICY "Admin read audit logs" ON audit_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for telemetry_events (admin only)
CREATE POLICY "Admin read telemetry" ON telemetry_events
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "System log telemetry" ON telemetry_events
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- RLS Policies for feature_flags (admin only)
CREATE POLICY "Admin manage feature flags" ON feature_flags
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- RLS Policies for system_settings
CREATE POLICY "Public read public settings" ON system_settings
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Admin manage all settings" ON system_settings
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_consultant_country_assignments_updated_at
  BEFORE UPDATE ON consultant_country_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_requests_updated_at
  BEFORE UPDATE ON document_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_threads_updated_at
  BEFORE UPDATE ON message_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_services_updated_at
  BEFORE UPDATE ON custom_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at
  BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
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

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, category, description, is_public) VALUES
('commission_rate', '{"platform": 35, "consultant": 65}', 'finance', 'Platform commission split', false),
('supported_languages', '["en", "tr", "pt"]', 'i18n', 'Supported languages', true),
('default_currency', '"USD"', 'finance', 'Default currency', true),
('max_file_size', '10485760', 'documents', 'Maximum file size in bytes (10MB)', false),
('allowed_file_types', '["pdf", "doc", "docx", "jpg", "jpeg", "png"]', 'documents', 'Allowed file types', false),
('auto_translate_enabled', 'true', 'i18n', 'Enable automatic translation', false),
('document_watermark_enabled', 'true', 'documents', 'Enable document watermarking', false);

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

-- Sample data for testing
DO $$
DECLARE
  admin_id uuid;
  consultant_id uuid;
  client_id uuid;
  client_record_id uuid;
  georgia_id uuid;
  project_id uuid;
  thread_id uuid;
BEGIN
  -- Get user IDs
  SELECT id INTO admin_id FROM user_profiles WHERE email = 'admin@consulting19.com';
  SELECT id INTO consultant_id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com';
  SELECT id INTO client_id FROM user_profiles WHERE email = 'client@consulting19.com';
  SELECT id INTO georgia_id FROM countries WHERE code = 'ge' OR name ILIKE '%georgia%' LIMIT 1;

  IF consultant_id IS NOT NULL AND georgia_id IS NOT NULL THEN
    -- Create consultant-country assignment
    INSERT INTO consultant_country_assignments (
      consultant_id,
      country_id,
      status,
      specializations,
      capacity_limit
    ) VALUES (
      consultant_id,
      georgia_id,
      'active',
      ARRAY['Company Formation', 'Tax Planning', 'Banking'],
      25
    ) ON CONFLICT (consultant_id, country_id) DO NOTHING;
  END IF;

  IF client_id IS NOT NULL AND consultant_id IS NOT NULL THEN
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
      client_id,
      consultant_id,
      georgia_id,
      'Test Company LLC',
      'Technology',
      'active',
      'high'
    ) ON CONFLICT (profile_id) DO UPDATE SET
      assigned_consultant_id = EXCLUDED.assigned_consultant_id,
      country_id = EXCLUDED.country_id
    RETURNING id INTO client_record_id;

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
      client_record_id,
      consultant_id,
      georgia_id,
      'Georgia LLC Formation',
      '{"en": "Complete business setup in Georgia with small business status", "tr": "Küçük işletme statüsü ile Gürcistan''da komple iş kurulumu", "pt": "Configuração completa de negócios na Geórgia com status de pequena empresa"}',
      'active',
      'high',
      45
    ) RETURNING id INTO project_id;

    -- Create message thread
    INSERT INTO message_threads (
      project_id,
      title,
      created_by
    ) VALUES (
      project_id,
      'Georgia LLC Formation Discussion',
      consultant_id
    ) RETURNING id INTO thread_id;

    -- Add participants
    INSERT INTO thread_participants (thread_id, user_id, role) VALUES
    (thread_id, consultant_id, 'moderator'),
    (thread_id, client_id, 'participant');

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
      consultant_id,
      georgia_id,
      '{"en": "Georgia Business Setup", "tr": "Gürcistan İş Kurulumu", "pt": "Configuração de Negócios na Geórgia"}',
      '{"en": "Complete business formation in Georgia with small business status", "tr": "Küçük işletme statüsü ile Gürcistan''da komple iş kuruluşu", "pt": "Formação completa de negócios na Geórgia com status de pequena empresa"}',
      '{"en": ["Company registration", "Tax registration", "Banking assistance", "Legal compliance"], "tr": ["Şirket kaydı", "Vergi kaydı", "Bankacılık yardımı", "Yasal uyumluluk"], "pt": ["Registro de empresa", "Registro fiscal", "Assistência bancária", "Conformidade legal"]}',
      2500,
      'USD',
      'Company Formation'
    ) ON CONFLICT DO NOTHING;

    -- Create sample document request
    INSERT INTO document_requests (
      consultant_id,
      client_id,
      project_id,
      title,
      description,
      due_date,
      priority,
      status
    ) VALUES (
      consultant_id,
      client_record_id,
      project_id,
      'Passport Copy Required',
      'Please upload a clear copy of your passport for company registration',
      CURRENT_DATE + INTERVAL '7 days',
      'high',
      'pending'
    );

    -- Create sample notification
    INSERT INTO notifications (
      recipient_id,
      sender_id,
      type,
      title_i18n,
      message_i18n,
      priority
    ) VALUES (
      client_id,
      consultant_id,
      'document_requested',
      '{"en": "Document Required", "tr": "Belge Gerekli", "pt": "Documento Necessário"}',
      '{"en": "Your consultant has requested a passport copy", "tr": "Danışmanınız pasaport kopyası istedi", "pt": "Seu consultor solicitou uma cópia do passaporte"}',
      'normal'
    );
  END IF;
END $$;