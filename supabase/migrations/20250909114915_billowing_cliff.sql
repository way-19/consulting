/*
  # Add expected documents table and consultant alerts

  1. New Tables
    - `expected_documents`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `document_type` (text)
      - `due_date` (date)
      - `is_submitted` (boolean, default false)
      - `submitted_at` (timestamptz, nullable)
      - `document_id` (uuid, foreign key to documents, nullable)
      - `reminder_sent` (boolean, default false)
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
    
    - `consultant_alerts`
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `alert_source_id` (text)
      - `alert_type` (text)
      - `priority` (text, default 'medium')
      - `title` (text)
      - `description` (text)
      - `is_resolved` (boolean, default false)
      - `resolved_at` (timestamptz, nullable)
      - `snooze_until` (timestamptz, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for consultants and clients to access their own data

  3. Indexes
    - Add performance indexes for common queries

  4. Triggers
    - Add updated_at triggers for expected_documents
</heading>

-- Create expected_documents table
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

-- Create consultant_alerts table
CREATE TABLE IF NOT EXISTS consultant_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL,
  alert_source_id text NOT NULL,
  alert_type text NOT NULL,
  priority text DEFAULT 'medium',
  title text,
  description text,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  snooze_until timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints for expected_documents
DO $$
BEGIN
  -- Add client_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expected_documents_client_id_fkey'
  ) THEN
    ALTER TABLE expected_documents
    ADD CONSTRAINT expected_documents_client_id_fkey
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
  END IF;

  -- Add consultant_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expected_documents_consultant_id_fkey'
  ) THEN
    ALTER TABLE expected_documents
    ADD CONSTRAINT expected_documents_consultant_id_fkey
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;

  -- Add document_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expected_documents_document_id_fkey'
  ) THEN
    ALTER TABLE expected_documents
    ADD CONSTRAINT expected_documents_document_id_fkey
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add foreign key constraints for consultant_alerts
DO $$
BEGIN
  -- Add consultant_id foreign key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultant_alerts_consultant_id_fkey'
  ) THEN
    ALTER TABLE consultant_alerts
    ADD CONSTRAINT consultant_alerts_consultant_id_fkey
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add check constraints
DO $$
BEGIN
  -- Add priority check for consultant_alerts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultant_alerts_priority_check'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_priority_check 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
  END IF;

  -- Add alert_type check for consultant_alerts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultant_alerts_alert_type_check'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_alert_type_check 
    CHECK (alert_type IN ('document_due', 'payment_overdue', 'task_assigned', 'client_inactive', 'system_alert'));
  END IF;
END $$;

-- Add unique constraint for consultant_alerts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultant_alerts_unique_alert'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_unique_alert 
    UNIQUE (consultant_id, alert_source_id, alert_type);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE expected_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Clients can view their own expected documents" ON expected_documents;
DROP POLICY IF EXISTS "Consultants can manage expected documents for their clients" ON expected_documents;
DROP POLICY IF EXISTS "Consultants can manage their own alerts" ON consultant_alerts;

-- Create policies for expected_documents
CREATE POLICY "Clients can view their own expected documents"
  ON expected_documents
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT clients.id 
      FROM clients 
      WHERE clients.profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can manage expected documents for their clients"
  ON expected_documents
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Create policies for consultant_alerts
CREATE POLICY "Consultants can manage their own alerts"
  ON consultant_alerts
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Add indexes for expected_documents
CREATE INDEX IF NOT EXISTS idx_expected_documents_client_id 
  ON expected_documents(client_id);

CREATE INDEX IF NOT EXISTS idx_expected_documents_consultant_id 
  ON expected_documents(consultant_id);

CREATE INDEX IF NOT EXISTS idx_expected_documents_due_date 
  ON expected_documents(due_date);

CREATE INDEX IF NOT EXISTS idx_expected_documents_pending 
  ON expected_documents(consultant_id, is_submitted) 
  WHERE is_submitted = false;

CREATE INDEX IF NOT EXISTS idx_expected_documents_overdue 
  ON expected_documents(due_date, is_submitted) 
  WHERE is_submitted = false;

-- Add indexes for consultant_alerts
CREATE INDEX IF NOT EXISTS idx_consultant_alerts_consultant_id 
  ON consultant_alerts(consultant_id);

CREATE INDEX IF NOT EXISTS idx_consultant_alerts_type 
  ON consultant_alerts(alert_type);

CREATE INDEX IF NOT EXISTS idx_consultant_alerts_priority 
  ON consultant_alerts(priority);

CREATE INDEX IF NOT EXISTS idx_consultant_alerts_resolved 
  ON consultant_alerts(consultant_id, is_resolved) 
  WHERE is_resolved = false;

CREATE INDEX IF NOT EXISTS idx_consultant_alerts_snoozed 
  ON consultant_alerts(consultant_id, snooze_until) 
  WHERE snooze_until IS NOT NULL;

-- Add trigger for updated_at on expected_documents
CREATE OR REPLACE FUNCTION update_expected_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS update_expected_documents_updated_at
  BEFORE UPDATE ON expected_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_expected_documents_updated_at();