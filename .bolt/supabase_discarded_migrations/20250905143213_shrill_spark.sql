/*
  # Create Document Management and Financial Tables

  1. Document Management
    - `documents` - Client document storage and tracking
    - `file_manager` - Advanced file organization system
    - `mail_forwarding_requests` - Physical mail forwarding service

  2. Financial System
    - `invoices` - Invoice management and payment tracking
    - `packages` - Service packages and pricing
    - `additional_services` - Add-on services
    - `country_additional_services` - Country-specific pricing

  3. Security
    - Document access control
    - Financial data protection
    - File sharing permissions
*/

-- Document types enum
DO $$ BEGIN
  CREATE TYPE document_type AS ENUM ('identity', 'business', 'financial', 'legal', 'other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Transaction status enum  
DO $$ BEGIN
  CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'other',
  category text,
  status text DEFAULT 'uploaded',
  file_url text,
  file_size bigint,
  mime_type text,
  is_request boolean DEFAULT false,
  notes text,
  due_date date,
  uploaded_at timestamptz,
  reviewed_at timestamptz,
  requested_by_consultant_id uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT documents_type_check 
    CHECK (type IN ('identity', 'business', 'financial', 'legal', 'other')),
  CONSTRAINT documents_status_check 
    CHECK (status IN ('uploaded', 'pending', 'approved', 'rejected', 'needs_revision'))
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Document policies
CREATE POLICY "documents_admin_all" ON documents
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "documents_read_client" ON documents
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = documents.client_id AND c.profile_id = auth.uid()
  ));

CREATE POLICY "documents_read_assigned" ON documents
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = documents.client_id AND c.assigned_consultant_id = auth.uid()
  ));

CREATE POLICY "documents_insert_assigned" ON documents
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = documents.client_id AND c.assigned_consultant_id = auth.uid()
  ));

CREATE POLICY "documents_update_assigned" ON documents
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = documents.client_id AND c.assigned_consultant_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = documents.client_id AND c.assigned_consultant_id = auth.uid()
  ));

-- File manager table
CREATE TABLE IF NOT EXISTS file_manager (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  file_type text,
  file_url text,
  file_size bigint,
  mime_type text,
  folder_path text NOT NULL DEFAULT '/',
  parent_folder_id uuid REFERENCES file_manager(id) ON DELETE CASCADE,
  is_starred boolean DEFAULT false,
  is_shared boolean DEFAULT false,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT file_manager_type_check 
    CHECK (type IN ('file', 'folder'))
);

ALTER TABLE file_manager ENABLE ROW LEVEL SECURITY;

-- File manager policies
CREATE POLICY "fm_admin_all" ON file_manager
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "fm_client_own" ON file_manager
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = file_manager.client_id AND c.profile_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = file_manager.client_id AND c.profile_id = auth.uid()
  ));

CREATE POLICY "fm_consultant_assigned" ON file_manager
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = file_manager.client_id AND c.assigned_consultant_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = file_manager.client_id AND c.assigned_consultant_id = auth.uid()
  ));

-- Mail forwarding requests table
CREATE TABLE IF NOT EXISTS mail_forwarding_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  forwarding_address text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_amount numeric(10,2) DEFAULT 15.00,
  payment_currency text DEFAULT 'USD',
  stripe_payment_intent_id text,
  stripe_session_id text,
  stripe_payment_intent text,
  notes text,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT mail_forwarding_requests_status_check 
    CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

ALTER TABLE mail_forwarding_requests ENABLE ROW LEVEL SECURITY;

-- Mail forwarding policies
CREATE POLICY "Admins can manage everything" ON mail_forwarding_requests
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "mfr_insert_client" ON mail_forwarding_requests
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = mail_forwarding_requests.client_id AND c.profile_id = auth.uid()
  ));

CREATE POLICY "mfr_select_client" ON mail_forwarding_requests
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = mail_forwarding_requests.client_id AND c.profile_id = auth.uid()
  ));

CREATE POLICY "mfr_update_client" ON mail_forwarding_requests
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = mail_forwarding_requests.client_id AND c.profile_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients c 
    WHERE c.id = mail_forwarding_requests.client_id AND c.profile_id = auth.uid()
  ));

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  service_order_id uuid REFERENCES service_orders(id) ON DELETE SET NULL,
  amount_due numeric(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending',
  stripe_invoice_id text,
  stripe_payment_intent text,
  stripe_session_id text,
  memo text,
  due_date timestamptz,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT invoices_status_check 
    CHECK (status IN ('pending', 'paid', 'failed', 'cancelled'))
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Invoice policies
CREATE POLICY "Admins can manage all invoices" ON invoices
  FOR ALL TO authenticated
  USING (is_admin());

CREATE POLICY "Clients can read own invoices" ON invoices
  FOR SELECT TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ));

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Package policies
CREATE POLICY "Anyone can read active packages" ON packages
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage packages" ON packages
  FOR ALL TO authenticated
  USING (is_admin());

-- Additional services table
CREATE TABLE IF NOT EXISTS additional_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price numeric(10,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE additional_services ENABLE ROW LEVEL SECURITY;

-- Additional services policies
CREATE POLICY "Anyone can read active additional services" ON additional_services
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage additional services" ON additional_services
  FOR ALL TO authenticated
  USING (is_admin());

-- Country additional services junction table
CREATE TABLE IF NOT EXISTS country_additional_services (
  country_id uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  additional_service_id uuid NOT NULL REFERENCES additional_services(id) ON DELETE CASCADE,
  price numeric(10,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  PRIMARY KEY (country_id, additional_service_id)
);

ALTER TABLE country_additional_services ENABLE ROW LEVEL SECURITY;

-- Country additional services policies
CREATE POLICY "Anyone can read active country additional services" ON country_additional_services
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage country additional services" ON country_additional_services
  FOR ALL TO authenticated
  USING (is_admin());

-- Create helpful functions
CREATE OR REPLACE FUNCTION update_file_manager_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_file_manager_updated_at
  BEFORE UPDATE ON file_manager
  FOR EACH ROW EXECUTE FUNCTION update_file_manager_updated_at();

CREATE TRIGGER trg_mfr_touch_updated
  BEFORE UPDATE ON mail_forwarding_requests
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER update_mail_forwarding_requests_updated_at
  BEFORE UPDATE ON mail_forwarding_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_additional_services_updated_at
  BEFORE UPDATE ON additional_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_country_additional_services_updated_at
  BEFORE UPDATE ON country_additional_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Invoice payment trigger
CREATE OR REPLACE FUNCTION on_invoice_paid_update_order()
RETURNS TRIGGER AS $$
BEGIN
  -- When invoice is marked as paid, update the service order status
  IF NEW.status = 'paid' AND OLD.status != 'paid' AND NEW.service_order_id IS NOT NULL THEN
    UPDATE service_orders 
    SET status = 'accepted'
    WHERE id = NEW.service_order_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_paid_update_order
  AFTER INSERT OR UPDATE OF status ON invoices
  FOR EACH ROW EXECUTE FUNCTION on_invoice_paid_update_order();

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_service_order_id ON invoices(service_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_file_manager_client_id ON file_manager(client_id);
CREATE INDEX IF NOT EXISTS idx_file_manager_created_by ON file_manager(created_by);
CREATE INDEX IF NOT EXISTS idx_file_manager_folder_path ON file_manager(folder_path);
CREATE INDEX IF NOT EXISTS idx_file_manager_type ON file_manager(type);
CREATE INDEX IF NOT EXISTS idx_file_manager_parent_folder_id ON file_manager(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_file_manager_is_starred ON file_manager(is_starred) WHERE is_starred = true;
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_client_id ON mail_forwarding_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_consultant_id ON mail_forwarding_requests(consultant_id);
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_document_id ON mail_forwarding_requests(document_id);