/*
  # Fix column already exists error

  1. Problem
    - Migration tries to add columns that already exist in user_profiles
    - Need to check for column existence before adding

  2. Solution
    - Use proper IF NOT EXISTS checks for all columns
    - Only add columns that don't already exist
    - Maintain existing data integrity

  3. Safety
    - Check each column individually
    - No data loss or conflicts
*/

-- Fix user_profiles columns with proper existence checks
DO $$
BEGIN
  -- Add display_name if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'display_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN display_name text;
  END IF;

  -- Add preferred_language if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'preferred_language'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN preferred_language text DEFAULT 'en';
  END IF;

  -- Add avatar_url if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN avatar_url text;
  END IF;

  -- Add country_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'country_id'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN country_id uuid REFERENCES countries(id);
  END IF;

  -- Add phone if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN phone text;
  END IF;

  -- Add timezone if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN timezone text DEFAULT 'UTC';
  END IF;

  -- Add is_active if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  -- Add last_login_at if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_login_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_login_at timestamptz;
  END IF;

  -- Add metadata if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN metadata jsonb DEFAULT '{}';
  END IF;
END $$;

-- Create consultant_country_assignments table if not exists
CREATE TABLE IF NOT EXISTS consultant_country_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  specializations text[],
  capacity_limit integer DEFAULT 50,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add unique constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'consultant_country_assignments' 
    AND constraint_name = 'consultant_country_assignments_consultant_id_country_id_key'
  ) THEN
    ALTER TABLE consultant_country_assignments 
    ADD CONSTRAINT consultant_country_assignments_consultant_id_country_id_key 
    UNIQUE(consultant_id, country_id);
  END IF;
END $$;

-- Create document_categories table if not exists
CREATE TABLE IF NOT EXISTS document_categories (
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

-- Create document_requests table if not exists
CREATE TABLE IF NOT EXISTS document_requests (
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

-- Update existing documents table structure
DO $$
BEGIN
  -- Add missing columns to documents table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'request_id'
  ) THEN
    ALTER TABLE documents ADD COLUMN request_id uuid REFERENCES document_requests(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE documents ADD COLUMN category_id uuid REFERENCES document_categories(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'original_name'
  ) THEN
    ALTER TABLE documents ADD COLUMN original_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'file_path'
  ) THEN
    ALTER TABLE documents ADD COLUMN file_path text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'checksum'
  ) THEN
    ALTER TABLE documents ADD COLUMN checksum text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'tags'
  ) THEN
    ALTER TABLE documents ADD COLUMN tags text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'reviewed_by'
  ) THEN
    ALTER TABLE documents ADD COLUMN reviewed_by uuid REFERENCES user_profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE documents ADD COLUMN reviewed_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'review_notes'
  ) THEN
    ALTER TABLE documents ADD COLUMN review_notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'version'
  ) THEN
    ALTER TABLE documents ADD COLUMN version integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'download_count'
  ) THEN
    ALTER TABLE documents ADD COLUMN download_count integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'project_id'
  ) THEN
    ALTER TABLE documents ADD COLUMN project_id uuid;
  END IF;
END $$;

-- Create message_threads table if not exists
CREATE TABLE IF NOT EXISTS message_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid,
  title text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'archived', 'closed')),
  created_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create thread_participants table if not exists
CREATE TABLE IF NOT EXISTS thread_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'participant' CHECK (role IN ('participant', 'moderator', 'admin')),
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz
);

-- Add unique constraint for thread_participants if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'thread_participants' 
    AND constraint_name = 'thread_participants_thread_id_user_id_key'
  ) THEN
    ALTER TABLE thread_participants 
    ADD CONSTRAINT thread_participants_thread_id_user_id_key 
    UNIQUE(thread_id, user_id);
  END IF;
END $$;

-- Create messages table if not exists
CREATE TABLE IF NOT EXISTS messages (
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

-- Create comprehensive indexes
CREATE INDEX IF NOT EXISTS idx_consultant_country_assignments_consultant ON consultant_country_assignments(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultant_country_assignments_country ON consultant_country_assignments(country_id);
CREATE INDEX IF NOT EXISTS idx_consultant_country_assignments_status ON consultant_country_assignments(status);

CREATE INDEX IF NOT EXISTS idx_document_requests_consultant ON document_requests(consultant_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_client ON document_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_document_requests_status ON document_requests(status);
CREATE INDEX IF NOT EXISTS idx_document_requests_due_date ON document_requests(due_date);

CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING gin(tags);

CREATE INDEX IF NOT EXISTS idx_message_threads_project ON message_threads(project_id);
CREATE INDEX IF NOT EXISTS idx_thread_participants_thread ON thread_participants(thread_id);
CREATE INDEX IF NOT EXISTS idx_thread_participants_user ON thread_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enable RLS on new tables
ALTER TABLE consultant_country_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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

-- Create triggers for updated_at
CREATE TRIGGER update_consultant_country_assignments_updated_at
  BEFORE UPDATE ON consultant_country_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_requests_updated_at
  BEFORE UPDATE ON document_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_threads_updated_at
  BEFORE UPDATE ON message_threads
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
('Other Documents', 'other', 'Miscellaneous documents', 'File', 'gray')
ON CONFLICT (slug) DO NOTHING;

-- Sample data for testing
DO $$
DECLARE
  consultant_id uuid;
  client_id uuid;
  client_record_id uuid;
  georgia_id uuid;
  project_id uuid;
  thread_id uuid;
BEGIN
  -- Get user IDs
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
    -- Get or create client record
    SELECT id INTO client_record_id FROM clients WHERE profile_id = client_id;
    
    IF client_record_id IS NULL THEN
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
      ) RETURNING id INTO client_record_id;
    END IF;

    -- Create sample project if not exists
    SELECT id INTO project_id FROM projects WHERE client_id = client_record_id LIMIT 1;
    
    IF project_id IS NULL THEN
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
    END IF;

    -- Create message thread if not exists
    SELECT id INTO thread_id FROM message_threads WHERE project_id = project_id LIMIT 1;
    
    IF thread_id IS NULL THEN
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
    END IF;

    -- Create sample document request if not exists
    IF NOT EXISTS (
      SELECT 1 FROM document_requests 
      WHERE consultant_id = consultant_id AND client_id = client_record_id
    ) THEN
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
    END IF;

    -- Create sample notification if not exists
    IF NOT EXISTS (
      SELECT 1 FROM notifications 
      WHERE recipient_id = client_id AND sender_id = consultant_id
    ) THEN
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
  END IF;
END $$;