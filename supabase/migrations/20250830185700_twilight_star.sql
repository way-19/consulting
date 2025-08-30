/*
  # Create complete client portal schema

  1. New Tables
    - `projects` - Client projects with i18n support
    - `service_orders` - Client service orders
    - `custom_services` - Consultant custom services
    - `client_onboarding_progress` - Onboarding tracking
    - Update existing tables with i18n fields

  2. Security
    - Enable RLS on all tables
    - Client-scoped and consultant-scoped policies
    - Proper access control for data sharing

  3. i18n Support
    - Add JSONB fields for multilingual content
    - Fallback patterns for missing translations
*/

-- Create projects table with i18n support
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  status text DEFAULT 'planning' NOT NULL CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget numeric,
  currency text DEFAULT 'USD',
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add i18n fields to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'title_i18n'
  ) THEN
    ALTER TABLE tasks ADD COLUMN title_i18n jsonb DEFAULT '{"en": ""}';
    ALTER TABLE tasks ADD COLUMN description_i18n jsonb DEFAULT '{"en": ""}';
    
    -- Migrate existing data
    UPDATE tasks SET 
      title_i18n = jsonb_build_object('en', COALESCE(title, '')),
      description_i18n = jsonb_build_object('en', COALESCE(description, ''))
    WHERE title_i18n IS NULL OR description_i18n IS NULL;
  END IF;
END $$;

-- Add project_id to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create service_orders table
CREATE TABLE IF NOT EXISTS service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  custom_service_id uuid REFERENCES custom_services(id) ON DELETE SET NULL,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'paid', 'in_progress', 'completed', 'cancelled')),
  total_amount numeric NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create custom_services table
CREATE TABLE IF NOT EXISTS custom_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  title_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  description_i18n jsonb DEFAULT '{"en": ""}' NOT NULL,
  features_i18n jsonb DEFAULT '{"en": []}' NOT NULL,
  price numeric NOT NULL,
  currency text DEFAULT 'USD' NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create client_onboarding_progress table
CREATE TABLE IF NOT EXISTS client_onboarding_progress (
  profile_id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  profile_done boolean DEFAULT false NOT NULL,
  documents_done boolean DEFAULT false NOT NULL,
  agreements_done boolean DEFAULT false NOT NULL,
  kickoff_done boolean DEFAULT false NOT NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS projects_client_idx ON projects(client_id);
CREATE INDEX IF NOT EXISTS projects_consultant_idx ON projects(consultant_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);

CREATE INDEX IF NOT EXISTS service_orders_client_idx ON service_orders(client_id);
CREATE INDEX IF NOT EXISTS service_orders_consultant_idx ON service_orders(consultant_id);
CREATE INDEX IF NOT EXISTS service_orders_status_idx ON service_orders(status);

CREATE INDEX IF NOT EXISTS custom_services_consultant_idx ON custom_services(consultant_id);
CREATE INDEX IF NOT EXISTS custom_services_country_idx ON custom_services(country_id);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Clients read own projects"
  ON projects FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Consultants read assigned projects"
  ON projects FOR SELECT TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Consultants manage assigned projects"
  ON projects FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for service_orders
CREATE POLICY "Clients read own orders"
  ON service_orders FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Clients create own orders"
  ON service_orders FOR INSERT TO authenticated
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Consultants read assigned orders"
  ON service_orders FOR SELECT TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Consultants update assigned orders"
  ON service_orders FOR UPDATE TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for custom_services
CREATE POLICY "Public read active custom services"
  ON custom_services FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Consultants manage own custom services"
  ON custom_services FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for client_onboarding_progress
CREATE POLICY "Clients read own onboarding"
  ON client_onboarding_progress FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Clients update own onboarding"
  ON client_onboarding_progress FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Clients insert own onboarding"
  ON client_onboarding_progress FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Consultants read client onboarding"
  ON client_onboarding_progress FOR SELECT TO authenticated
  USING (profile_id IN (SELECT profile_id FROM clients WHERE assigned_consultant_id = auth.uid()));

-- Create triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at
  BEFORE UPDATE ON service_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_services_updated_at
  BEFORE UPDATE ON custom_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_onboarding_progress_updated_at
  BEFORE UPDATE ON client_onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update documents table with proper client relationship
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'client_id'
  ) THEN
    ALTER TABLE documents ADD COLUMN client_id uuid REFERENCES clients(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'requested_by_consultant_id'
  ) THEN
    ALTER TABLE documents ADD COLUMN requested_by_consultant_id uuid REFERENCES user_profiles(id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'is_request'
  ) THEN
    ALTER TABLE documents ADD COLUMN is_request boolean DEFAULT false NOT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE documents ADD COLUMN due_date timestamptz;
  END IF;
END $$;

-- Update documents RLS policies
DROP POLICY IF EXISTS "Enable read for document owner" ON documents;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON documents;

CREATE POLICY "Clients read own documents"
  ON documents FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Clients upload own documents"
  ON documents FOR INSERT TO authenticated
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Consultants read client documents"
  ON documents FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE assigned_consultant_id = auth.uid()));

CREATE POLICY "Consultants create document requests"
  ON documents FOR INSERT TO authenticated
  WITH CHECK (
    is_request = true AND 
    requested_by_consultant_id = auth.uid() AND
    client_id IN (SELECT id FROM clients WHERE assigned_consultant_id = auth.uid())
  );

CREATE POLICY "Consultants update document status"
  ON documents FOR UPDATE TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE assigned_consultant_id = auth.uid()));

-- Insert sample data for testing
DO $$
DECLARE
  giorgi_id uuid;
  client_test_id uuid;
  client_record_id uuid;
  project_id uuid;
BEGIN
  -- Get user IDs
  SELECT id INTO giorgi_id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com';
  SELECT id INTO client_test_id FROM user_profiles WHERE email = 'client@consulting19.com';
  
  IF giorgi_id IS NOT NULL AND client_test_id IS NOT NULL THEN
    -- Get client record
    SELECT id INTO client_record_id FROM clients WHERE profile_id = client_test_id;
    
    IF client_record_id IS NOT NULL THEN
      -- Insert sample project
      INSERT INTO projects (
        client_id,
        consultant_id,
        name,
        description_i18n,
        status,
        priority,
        progress,
        budget,
        currency,
        start_date,
        end_date
      ) VALUES (
        client_record_id,
        giorgi_id,
        'Georgia LLC Formation',
        '{"en": "Complete business setup in Georgia with small business status", "tr": "Küçük işletme statüsü ile Gürcistan''da komple iş kurulumu", "pt": "Configuração completa de negócios na Geórgia com status de pequena empresa"}',
        'active',
        'high',
        75,
        2500,
        'USD',
        CURRENT_DATE - INTERVAL '30 days',
        CURRENT_DATE + INTERVAL '30 days'
      ) RETURNING id INTO project_id;
      
      -- Update existing tasks with project_id and i18n
      UPDATE tasks SET 
        project_id = project_id,
        title_i18n = jsonb_build_object('en', title),
        description_i18n = jsonb_build_object('en', COALESCE(description, ''))
      WHERE consultant_id = giorgi_id;
      
      -- Insert onboarding progress
      INSERT INTO client_onboarding_progress (
        profile_id,
        profile_done,
        documents_done,
        agreements_done,
        kickoff_done
      ) VALUES (
        client_test_id,
        true,
        false,
        false,
        false
      ) ON CONFLICT (profile_id) DO NOTHING;
      
      -- Insert sample custom service
      INSERT INTO custom_services (
        consultant_id,
        title_i18n,
        description_i18n,
        features_i18n,
        price,
        currency
      ) VALUES (
        giorgi_id,
        '{"en": "Georgia Business Setup", "tr": "Gürcistan İş Kurulumu", "pt": "Configuração de Negócios na Geórgia"}',
        '{"en": "Complete business formation in Georgia with small business status", "tr": "Küçük işletme statüsü ile Gürcistan''da komple iş kuruluşu", "pt": "Formação completa de negócios na Geórgia com status de pequena empresa"}',
        '{"en": ["Company registration", "Tax registration", "Banking assistance", "Legal compliance"], "tr": ["Şirket kaydı", "Vergi kaydı", "Bankacılık yardımı", "Yasal uyumluluk"], "pt": ["Registro de empresa", "Registro fiscal", "Assistência bancária", "Conformidade legal"]}',
        2500,
        'USD'
      ) ON CONFLICT DO NOTHING;
      
      -- Insert sample document request
      INSERT INTO documents (
        client_id,
        name,
        type,
        category,
        status,
        is_request,
        requested_by_consultant_id,
        due_date,
        notes
      ) VALUES (
        client_record_id,
        'Passport Copy',
        'pdf',
        'passport',
        'requested',
        true,
        giorgi_id,
        CURRENT_DATE + INTERVAL '7 days',
        'Please upload a clear copy of your passport for company registration'
      ) ON CONFLICT DO NOTHING;
      
    END IF;
  END IF;
END $$;