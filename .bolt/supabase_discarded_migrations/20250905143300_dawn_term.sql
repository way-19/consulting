/*
  # Create System Management and Audit Tables

  1. System Management
    - `audit_logs` - Comprehensive activity logging
    - `support_tickets` - Customer support system
    - `blog_posts` - Content management system
    - `global_services` - Platform-wide services

  2. Configuration
    - `mail_settings` - Email configuration
    - `kvkk_settings` - GDPR/Privacy settings
    - `consultant_country_assignments` - Geographic assignments

  3. Audit & Compliance
    - Full activity tracking
    - Support ticket management
    - Content publishing system
    - System configuration management
*/

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  resource_type text,
  resource_id uuid,
  description text NOT NULL,
  ip_address text,
  user_agent text,
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit log policies
CREATE POLICY "audit_logs_admin_read" ON audit_logs
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "audit_logs_read_self" ON audit_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  ticket_type text NOT NULL DEFAULT 'general',
  subject text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  priority text DEFAULT 'medium',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT support_tickets_ticket_type_check 
    CHECK (ticket_type IN ('general', 'complaint', 'technical')),
  CONSTRAINT support_tickets_status_check 
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  CONSTRAINT support_tickets_priority_check 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Support ticket policies
CREATE POLICY "Admins can manage everything" ON support_tickets
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Clients can manage own tickets" ON support_tickets
  FOR ALL TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ));

CREATE POLICY "Consultants can read assigned tickets" ON support_tickets
  FOR SELECT TO authenticated
  USING (consultant_id = auth.uid());

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_code text,
  title_i18n jsonb DEFAULT '{}',
  excerpt_i18n jsonb DEFAULT '{}',
  content_i18n jsonb DEFAULT '{}',
  slug text UNIQUE NOT NULL,
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  featured_image_url text,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog post policies
CREATE POLICY "Anonymous users can read published blog posts" ON blog_posts
  FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "Allow public read access to published blog posts" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Authors can manage their own blog posts" ON blog_posts
  FOR ALL TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Admins can manage all blog posts" ON blog_posts
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Global services table
CREATE TABLE IF NOT EXISTS global_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_i18n jsonb NOT NULL DEFAULT '{}',
  description_i18n jsonb NOT NULL DEFAULT '{}',
  icon_name text DEFAULT 'Building2',
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE global_services ENABLE ROW LEVEL SECURITY;

-- Global services policies
CREATE POLICY "Anyone can read active global services" ON global_services
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage global services" ON global_services
  FOR ALL TO authenticated
  USING (is_admin());

-- Mail settings table
CREATE TABLE IF NOT EXISTS mail_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host text NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  port integer DEFAULT 587,
  encryption text DEFAULT 'tls',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE mail_settings ENABLE ROW LEVEL SECURITY;

-- Mail settings policies
CREATE POLICY "Admins can manage mail settings" ON mail_settings
  FOR ALL TO authenticated
  USING (is_admin());

-- KVKK settings table
CREATE TABLE IF NOT EXISTS kvkk_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_text text NOT NULL,
  policy_link text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE kvkk_settings ENABLE ROW LEVEL SECURITY;

-- KVKK settings policies
CREATE POLICY "Anyone can read active kvkk settings" ON kvkk_settings
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage kvkk settings" ON kvkk_settings
  FOR ALL TO authenticated
  USING (is_admin());

-- Consultant country assignments table
CREATE TABLE IF NOT EXISTS consultant_country_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  
  UNIQUE(consultant_id, country_id)
);

ALTER TABLE consultant_country_assignments ENABLE ROW LEVEL SECURITY;

-- Consultant country assignment policies
CREATE POLICY "Admins can manage assignments" ON consultant_country_assignments
  FOR ALL TO authenticated
  USING (is_admin());

CREATE POLICY "Consultants can read own assignments" ON consultant_country_assignments
  FOR SELECT TO authenticated
  USING (consultant_id = auth.uid());

-- Document requests table
CREATE TABLE IF NOT EXISTS document_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  title text NOT NULL,
  description text,
  document_type text NOT NULL DEFAULT 'other',
  priority text DEFAULT 'medium',
  status text DEFAULT 'pending',
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT document_requests_priority_check 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT document_requests_status_check 
    CHECK (status IN ('pending', 'uploaded', 'approved', 'rejected'))
);

ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;

-- Document request policies
CREATE POLICY "Clients can read own document requests" ON document_requests
  FOR SELECT TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ));

CREATE POLICY "Consultants can manage own document requests" ON document_requests
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid());

-- Banks table (for banking solutions)
CREATE TABLE IF NOT EXISTS banks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  flag_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE banks ENABLE ROW LEVEL SECURITY;

-- Bank policies
CREATE POLICY "Anyone can read active banks" ON banks
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage banks" ON banks
  FOR ALL TO authenticated
  USING (is_admin());

-- Blog post helper functions
CREATE OR REPLACE FUNCTION set_blog_post_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set published_at when is_published becomes true
  IF NEW.is_published = true AND OLD.is_published = false THEN
    NEW.published_at = now();
  END IF;
  
  -- Clear published_at when is_published becomes false
  IF NEW.is_published = false AND OLD.is_published = true THEN
    NEW.published_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Blog post triggers
CREATE TRIGGER set_blog_post_published_at_trigger
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_blog_post_published_at();

CREATE TRIGGER update_blog_posts_updated_at_trigger
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_blog_posts_updated_at();

-- Create all remaining triggers
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_global_services_updated_at
  BEFORE UPDATE ON global_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mail_settings_updated_at
  BEFORE UPDATE ON mail_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kvkk_settings_updated_at
  BEFORE UPDATE ON kvkk_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banks_updated_at
  BEFORE UPDATE ON banks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add remaining indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_country_code ON blog_posts(country_code);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;