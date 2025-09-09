/*
  # Expected Documents Table and Consultant Alerts

  1. New Tables
    - `expected_documents`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `document_type` (text)
      - `due_date` (date)
      - `is_submitted` (boolean, default false)
      - `submitted_at` (timestamptz)
      - `document_id` (uuid, foreign key to documents)
      - `reminder_sent` (boolean, default false)
      - `notes` (text)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

    - `consultant_alerts`
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `alert_source_id` (text, source record ID)
      - `alert_type` (text, type of alert)
      - `priority` (text, alert priority)
      - `title` (text, alert title)
      - `description` (text, alert description)
      - `is_read` (boolean, default false)
      - `is_resolved` (boolean, default false)
      - `resolved_at` (timestamptz)
      - `snooze_until` (timestamptz)
      - `notes` (text)
      - `metadata` (jsonb)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on both tables
    - Add policies for consultant and client access
    - Add indexes for performance

  3. Functions
    - Add trigger function for updated_at timestamp
*/

-- Create expected_documents table if not exists
CREATE TABLE IF NOT EXISTS expected_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  consultant_id uuid NOT NULL,
  document_type text NOT NULL,
  due_date date NOT NULL,
  is_submitted boolean DEFAULT false,
  submitted_at timestamptz,
  document_id uuid,
  reminder_sent boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consultant_alerts table if not exists  
CREATE TABLE IF NOT EXISTS consultant_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL,
  alert_source_id text NOT NULL,
  alert_type text NOT NULL,
  priority text DEFAULT 'medium',
  title text,
  description text,
  is_read boolean DEFAULT false,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  snooze_until timestamptz,
  notes text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'expected_documents' AND constraint_name = 'expected_documents_client_id_fkey'
  ) THEN
    ALTER TABLE expected_documents 
    ADD CONSTRAINT expected_documents_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'expected_documents' AND constraint_name = 'expected_documents_consultant_id_fkey'
  ) THEN
    ALTER TABLE expected_documents 
    ADD CONSTRAINT expected_documents_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'expected_documents' AND constraint_name = 'expected_documents_document_id_fkey'
  ) THEN
    ALTER TABLE expected_documents 
    ADD CONSTRAINT expected_documents_document_id_fkey 
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'consultant_alerts' AND constraint_name = 'consultant_alerts_consultant_id_fkey'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add check constraints if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'consultant_alerts_priority_check'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_priority_check 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'consultant_alerts_alert_type_check'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_alert_type_check 
    CHECK (alert_type IN ('document_due', 'payment_overdue', 'task_assigned', 'client_inactive', 'other'));
  END IF;
END $$;

-- Add unique constraint for consultant alerts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'consultant_alerts' AND constraint_name = 'consultant_alerts_unique_alert'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_unique_alert 
    UNIQUE (consultant_id, alert_source_id, alert_type);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE expected_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Clients can view their own expected documents" ON expected_documents;
DROP POLICY IF EXISTS "Consultants can manage expected documents for their clients" ON expected_documents;
DROP POLICY IF EXISTS "Consultants can manage their own alerts" ON consultant_alerts;

-- Create RLS policies for expected_documents
CREATE POLICY "Clients can view their own expected documents"
  ON expected_documents
  FOR SELECT
  TO authenticated
  USING (client_id IN ( 
    SELECT clients.id 
    FROM clients 
    WHERE (clients.profile_id = auth.uid()) 
  ));

CREATE POLICY "Consultants can manage expected documents for their clients"
  ON expected_documents
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Create RLS policies for consultant_alerts  
CREATE POLICY "Consultants can manage their own alerts"
  ON consultant_alerts
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_expected_documents_client_id ON expected_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_consultant_id ON expected_documents(consultant_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_due_date ON expected_documents(due_date);
CREATE INDEX IF NOT EXISTS idx_expected_documents_overdue ON expected_documents(due_date, is_submitted) WHERE is_submitted = false;
CREATE INDEX IF NOT EXISTS idx_expected_documents_pending ON expected_documents(consultant_id, is_submitted) WHERE is_submitted = false;

CREATE INDEX IF NOT EXISTS idx_consultant_alerts_consultant_id ON consultant_alerts(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultant_alerts_type_priority ON consultant_alerts(alert_type, priority);
CREATE INDEX IF NOT EXISTS idx_consultant_alerts_unresolved ON consultant_alerts(consultant_id, is_resolved) WHERE is_resolved = false;
CREATE INDEX IF NOT EXISTS idx_consultant_alerts_snoozed ON consultant_alerts(snooze_until) WHERE snooze_until IS NOT NULL;

-- Add updated_at trigger for expected_documents if function exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    DROP TRIGGER IF EXISTS update_expected_documents_updated_at ON expected_documents;
    CREATE TRIGGER update_expected_documents_updated_at 
      BEFORE UPDATE ON expected_documents 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;