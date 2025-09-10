/*
  # Add expected documents and consultant alerts tables

  1. New Tables
    - `expected_documents`
      - `id` (uuid, primary key)  
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `document_type` (text, required)
      - `due_date` (date, required)
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
      - `alert_source_id` (uuid, required)
      - `alert_type` (text, required)
      - `priority` (text, default 'medium')
      - `title` (text, required)
      - `description` (text, required) 
      - `due_date` (timestamptz, nullable)
      - `is_resolved` (boolean, default false)
      - `resolved_at` (timestamptz, nullable)
      - `snooze_until` (timestamptz, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for consultants and clients to manage their own data
    - Add indexes for performance

  3. Triggers
    - Add updated_at triggers for both tables
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Clients can view their own expected documents" ON expected_documents;
DROP POLICY IF EXISTS "Consultants can manage expected documents for their clients" ON expected_documents;
DROP POLICY IF EXISTS "Consultants can manage their own alerts" ON consultant_alerts;

-- Create expected_documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS expected_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  due_date date NOT NULL,
  is_submitted boolean DEFAULT false,
  submitted_at timestamptz,
  document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  reminder_sent boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consultant_alerts table if it doesn't exist
CREATE TABLE IF NOT EXISTS consultant_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  alert_source_id uuid NOT NULL,
  alert_type text NOT NULL,
  priority text DEFAULT 'medium',
  title text NOT NULL,
  description text NOT NULL,
  due_date timestamptz,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  snooze_until timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Add constraints safely
DO $$ 
BEGIN
  -- Add expected_documents constraints if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'expected_documents' 
    AND constraint_name = 'expected_documents_document_type_check'
  ) THEN
    ALTER TABLE expected_documents 
    ADD CONSTRAINT expected_documents_document_type_check 
    CHECK (document_type IN ('identity', 'business', 'financial', 'legal', 'other'));
  END IF;

  -- Add consultant_alerts constraints if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'consultant_alerts' 
    AND constraint_name = 'consultant_alerts_priority_check'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_priority_check 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'consultant_alerts' 
    AND constraint_name = 'consultant_alerts_alert_type_check'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_alert_type_check 
    CHECK (alert_type IN ('document_due', 'payment_overdue', 'task_assigned', 'document_uploaded', 'other'));
  END IF;
END $$;

-- Enable RLS
ALTER TABLE expected_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for expected_documents
CREATE POLICY "Clients can view their own expected documents"
  ON expected_documents
  FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ));

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

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_expected_documents_client_id ON expected_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_consultant_id ON expected_documents(consultant_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_due_date ON expected_documents(due_date);
CREATE INDEX IF NOT EXISTS idx_expected_documents_overdue ON expected_documents(due_date, is_submitted) WHERE is_submitted = false;
CREATE INDEX IF NOT EXISTS idx_expected_documents_pending ON expected_documents(consultant_id, is_submitted) WHERE is_submitted = false;

CREATE INDEX IF NOT EXISTS idx_consultant_alerts_consultant_id_resolved ON consultant_alerts(consultant_id, is_resolved);
CREATE INDEX IF NOT EXISTS uq_consultant_alerts_source ON consultant_alerts(consultant_id, alert_source_id, alert_type);

-- Add updated_at trigger for expected_documents
CREATE OR REPLACE FUNCTION update_expected_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_expected_documents_updated_at_trigger ON expected_documents;
CREATE TRIGGER update_expected_documents_updated_at_trigger
  BEFORE UPDATE ON expected_documents
  FOR EACH ROW EXECUTE FUNCTION update_expected_documents_updated_at();

-- Add resolved_at trigger for consultant_alerts
CREATE OR REPLACE FUNCTION set_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_resolved = true AND OLD.is_resolved = false THEN
    NEW.resolved_at = now();
  ELSIF NEW.is_resolved = false THEN
    NEW.resolved_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_consultant_alert_resolved_at ON consultant_alerts;
CREATE TRIGGER set_consultant_alert_resolved_at
  BEFORE UPDATE ON consultant_alerts
  FOR EACH ROW EXECUTE FUNCTION set_resolved_at();