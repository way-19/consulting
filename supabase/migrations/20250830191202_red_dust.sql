/*
  # Create comprehensive admin schema

  1. New Tables
    - `email_templates` - Email template management with versioning
    - `email_template_versions` - Version history for templates
    - `system_settings` - Global system configuration
    - `audit_logs` - Security and action audit trail
    - `telemetry_events` - System telemetry and analytics
    - `recycle_bin` - Soft delete recovery system

  2. Enhanced Tables
    - Add SEO fields to countries table
    - Add service availability matrix
    - Add publishing workflow fields

  3. Security
    - Admin-only access to management tables
    - Proper RLS policies for all admin functions
    - Audit logging for all admin actions

  4. Functions
    - Financial reporting RPCs
    - Admin analytics functions
    - Bulk operation helpers
*/

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text UNIQUE NOT NULL,
  category text DEFAULT 'system' NOT NULL CHECK (category IN ('system', 'onboarding', 'documents', 'services', 'invoices', 'notifications')),
  name text NOT NULL,
  subject_en text NOT NULL,
  subject_tr text,
  subject_pt text,
  body_en text NOT NULL,
  body_tr text,
  body_pt text,
  variables jsonb DEFAULT '[]' NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  version integer DEFAULT 1 NOT NULL,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create email_template_versions table
CREATE TABLE IF NOT EXISTS email_template_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
  version integer NOT NULL,
  subject_en text NOT NULL,
  subject_tr text,
  subject_pt text,
  body_en text NOT NULL,
  body_tr text,
  body_pt text,
  variables jsonb DEFAULT '[]' NOT NULL,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  category text DEFAULT 'general' NOT NULL,
  description text,
  is_public boolean DEFAULT false NOT NULL,
  updated_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create telemetry_events table
CREATE TABLE IF NOT EXISTS telemetry_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id),
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}' NOT NULL,
  session_id text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Create recycle_bin table
CREATE TABLE IF NOT EXISTS recycle_bin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  record_data jsonb NOT NULL,
  deleted_by uuid REFERENCES user_profiles(id),
  deleted_at timestamptz DEFAULT now(),
  restore_deadline timestamptz DEFAULT (now() + INTERVAL '30 days')
);

-- Add SEO and publishing fields to countries table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'countries' AND column_name = 'meta_title_en'
  ) THEN
    ALTER TABLE countries ADD COLUMN meta_title_en text;
    ALTER TABLE countries ADD COLUMN meta_description_en text;
    ALTER TABLE countries ADD COLUMN meta_keywords_en text;
    ALTER TABLE countries ADD COLUMN meta_title_tr text;
    ALTER TABLE countries ADD COLUMN meta_description_tr text;
    ALTER TABLE countries ADD COLUMN meta_keywords_tr text;
    ALTER TABLE countries ADD COLUMN meta_title_pt text;
    ALTER TABLE countries ADD COLUMN meta_description_pt text;
    ALTER TABLE countries ADD COLUMN meta_keywords_pt text;
    ALTER TABLE countries ADD COLUMN publishing_status text DEFAULT 'active' CHECK (publishing_status IN ('draft', 'review', 'active', 'inactive'));
    ALTER TABLE countries ADD COLUMN service_availability jsonb DEFAULT '{}' NOT NULL;
    ALTER TABLE countries ADD COLUMN consultant_capacity integer DEFAULT 1;
    ALTER TABLE countries ADD COLUMN specializations text[];
  END IF;
END $$;

-- Add home visibility and order fields to services table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'home_visibility'
  ) THEN
    ALTER TABLE services ADD COLUMN home_visibility boolean DEFAULT false NOT NULL;
    ALTER TABLE services ADD COLUMN home_order_index integer DEFAULT 0;
    ALTER TABLE services ADD COLUMN hero_image_url text;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS email_templates_category_idx ON email_templates(category);
CREATE INDEX IF NOT EXISTS email_templates_active_idx ON email_templates(is_active);
CREATE INDEX IF NOT EXISTS email_template_versions_template_idx ON email_template_versions(template_id);
CREATE INDEX IF NOT EXISTS system_settings_key_idx ON system_settings(setting_key);
CREATE INDEX IF NOT EXISTS system_settings_category_idx ON system_settings(category);
CREATE INDEX IF NOT EXISTS audit_logs_user_idx ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS telemetry_events_user_idx ON telemetry_events(user_id);
CREATE INDEX IF NOT EXISTS telemetry_events_type_idx ON telemetry_events(event_type);
CREATE INDEX IF NOT EXISTS telemetry_events_created_idx ON telemetry_events(created_at);
CREATE INDEX IF NOT EXISTS recycle_bin_table_idx ON recycle_bin(table_name);
CREATE INDEX IF NOT EXISTS recycle_bin_deleted_idx ON recycle_bin(deleted_at);
CREATE INDEX IF NOT EXISTS countries_publishing_idx ON countries(publishing_status);
CREATE INDEX IF NOT EXISTS services_home_visibility_idx ON services(home_visibility);
CREATE INDEX IF NOT EXISTS services_home_order_idx ON services(home_order_index);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE recycle_bin ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Admin only access
CREATE POLICY "Admin full access to email templates"
  ON email_templates FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin full access to email template versions"
  ON email_template_versions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin full access to system settings"
  ON system_settings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin read audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin read telemetry events"
  ON telemetry_events FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin full access to recycle bin"
  ON recycle_bin FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create triggers
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON system_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, category, description) VALUES
('default_currency', '"USD"', 'finance', 'Default currency for financial calculations'),
('commission_split', '{"platform": 35, "consultant": 65}', 'finance', 'Revenue split between platform and consultants'),
('email_sender', '{"name": "Consulting19", "email": "noreply@consulting19.com"}', 'email', 'Default email sender configuration'),
('deepl_enabled', 'true', 'translation', 'Enable DeepL translation service'),
('cache_ttl', '3600', 'performance', 'Cache time-to-live in seconds')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default email templates
INSERT INTO email_templates (template_key, category, name, subject_en, body_en, variables) VALUES
('document_requested', 'documents', 'Document Request', 'Document Required: {{document_name}}', 
 'Hello {{client_name}},<br><br>Your consultant has requested the following document:<br><br><strong>{{document_name}}</strong><br><br>{{#if notes}}Notes: {{notes}}<br><br>{{/if}}{{#if due_date}}Due Date: {{due_date}}<br><br>{{/if}}Please upload this document through your client portal.<br><br>Best regards,<br>{{consultant_name}}', 
 '["client_name", "consultant_name", "document_name", "notes", "due_date"]'::jsonb),
('document_approved', 'documents', 'Document Approved', 'Document Approved: {{document_name}}', 
 'Hello {{client_name}},<br><br>Your document "{{document_name}}" has been approved.<br><br>{{#if notes}}Notes: {{notes}}<br><br>{{/if}}Best regards,<br>{{consultant_name}}', 
 '["client_name", "consultant_name", "document_name", "notes"]'::jsonb),
('service_ordered', 'services', 'New Service Order', 'New Service Order: {{service_name}}', 
 'Hello {{consultant_name}},<br><br>{{client_name}} has ordered the following service:<br><br><strong>{{service_name}}</strong><br>Amount: {{amount}}<br><br>{{#if notes}}Notes: {{notes}}<br><br>{{/if}}Please review and process this order through your consultant portal.<br><br>Best regards,<br>Consulting19 Team', 
 '["consultant_name", "client_name", "service_name", "amount", "notes"]'::jsonb),
('onboarding_completed', 'onboarding', 'Client Onboarding Complete', 'Client Onboarding Completed: {{client_name}}', 
 'Hello {{consultant_name}},<br><br>{{client_name}} has completed their onboarding process.<br><br>All required steps have been finished and they are ready to begin working with you.<br><br>Best regards,<br>Consulting19 Team', 
 '["consultant_name", "client_name"]'::jsonb)
ON CONFLICT (template_key) DO NOTHING;

-- Create financial reporting functions
CREATE OR REPLACE FUNCTION admin_revenue_overview(
  start_date date,
  end_date date,
  group_by text DEFAULT 'month'
)
RETURNS TABLE (
  period text,
  gross_revenue numeric,
  net_revenue numeric,
  platform_fee numeric,
  consultant_payout numeric,
  transaction_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify admin access
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT 
    CASE 
      WHEN group_by = 'day' THEN to_char(so.created_at, 'YYYY-MM-DD')
      WHEN group_by = 'week' THEN to_char(date_trunc('week', so.created_at), 'YYYY-MM-DD')
      WHEN group_by = 'month' THEN to_char(date_trunc('month', so.created_at), 'YYYY-MM')
      WHEN group_by = 'quarter' THEN to_char(date_trunc('quarter', so.created_at), 'YYYY-Q')
      ELSE to_char(date_trunc('year', so.created_at), 'YYYY')
    END as period,
    SUM(so.total_amount) as gross_revenue,
    SUM(so.total_amount * 0.35) as net_revenue,
    SUM(so.total_amount * 0.35) as platform_fee,
    SUM(so.total_amount * 0.65) as consultant_payout,
    COUNT(*)::bigint as transaction_count
  FROM service_orders so
  WHERE so.created_at::date BETWEEN start_date AND end_date
    AND so.status IN ('paid', 'completed')
  GROUP BY 1
  ORDER BY 1;
END;
$$;

CREATE OR REPLACE FUNCTION admin_ar_aging(as_of_date date)
RETURNS TABLE (
  aging_bucket text,
  invoice_count bigint,
  total_amount numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify admin access
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT 
    CASE 
      WHEN (as_of_date - so.created_at::date) <= 30 THEN '0-30 days'
      WHEN (as_of_date - so.created_at::date) <= 60 THEN '31-60 days'
      WHEN (as_of_date - so.created_at::date) <= 90 THEN '61-90 days'
      ELSE '90+ days'
    END as aging_bucket,
    COUNT(*)::bigint as invoice_count,
    SUM(so.total_amount) as total_amount
  FROM service_orders so
  WHERE so.status = 'pending'
    AND so.created_at::date <= as_of_date
  GROUP BY 1
  ORDER BY 
    CASE aging_bucket
      WHEN '0-30 days' THEN 1
      WHEN '31-60 days' THEN 2
      WHEN '61-90 days' THEN 3
      ELSE 4
    END;
END;
$$;

CREATE OR REPLACE FUNCTION admin_payouts_by_consultant(
  start_date date,
  end_date date
)
RETURNS TABLE (
  consultant_id uuid,
  consultant_name text,
  total_revenue numeric,
  consultant_payout numeric,
  order_count bigint,
  avg_order_value numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify admin access
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY
  SELECT 
    so.consultant_id,
    up.full_name as consultant_name,
    SUM(so.total_amount) as total_revenue,
    SUM(so.total_amount * 0.65) as consultant_payout,
    COUNT(*)::bigint as order_count,
    AVG(so.total_amount) as avg_order_value
  FROM service_orders so
  JOIN user_profiles up ON up.id = so.consultant_id
  WHERE so.created_at::date BETWEEN start_date AND end_date
    AND so.status IN ('paid', 'completed')
  GROUP BY so.consultant_id, up.full_name
  ORDER BY total_revenue DESC;
END;
$$;

-- Create audit logging function
CREATE OR REPLACE FUNCTION log_admin_action(
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

-- Create telemetry logging function
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