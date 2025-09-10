/*
  # Expected Documents and Consultant Alerts

  This migration creates tables for document expectations and consultant alerts system.

  1. New Tables
    - `expected_documents`: Track documents expected from clients
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

    - `consultant_alerts`: Store consultant-specific alerts and their resolution status
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `alert_source_id` (uuid, references source record)
      - `alert_type` (text)
      - `priority` (text)
      - `title` (text)
      - `description` (text)
      - `due_date` (date, nullable)
      - `is_resolved` (boolean, default false)
      - `resolved_at` (timestamptz, nullable)
      - `snooze_until` (timestamptz, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on both tables
    - Add policies for consultants to manage their own alerts
    - Add policies for clients to view their expected documents
    - Add policies for consultants to manage expected documents for their clients

  3. Indexes
    - Add performance indexes for common queries
    - Add unique constraints where appropriate

  4. Triggers
    - Add triggers for automatic updated_at timestamps
    - Add trigger for resolved_at timestamp
*/

-- First, safely drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop existing policies for expected_documents if they exist
  DROP POLICY IF EXISTS "Clients can view their own expected documents" ON expected_documents;
  DROP POLICY IF EXISTS "Consultants can manage expected documents for their clients" ON expected_documents;
  
  -- Drop existing policies for consultant_alerts if they exist  
  DROP POLICY IF EXISTS "Consultants can manage their own alerts" ON consultant_alerts;
EXCEPTION
  WHEN undefined_table THEN NULL; -- Table doesn't exist yet, ignore
END $$;

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

-- Create consultant_alerts table with ALL required columns
CREATE TABLE IF NOT EXISTS consultant_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid,
  alert_source_id uuid NOT NULL,
  alert_type text NOT NULL,
  priority text DEFAULT 'medium',
  title text DEFAULT '',
  description text DEFAULT '',
  due_date date,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  snooze_until timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints for expected_documents
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
END $$;

-- Add foreign key constraints for consultant_alerts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'consultant_alerts' AND constraint_name = 'consultant_alerts_consultant_id_fkey'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add check constraints (only if columns exist)
DO $$
BEGIN
  -- Check if priority column exists before adding constraint
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consultant_alerts' AND column_name = 'priority'
  ) THEN
    -- Only add constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.check_constraints 
      WHERE constraint_name = 'consultant_alerts_priority_check'
    ) THEN
      ALTER TABLE consultant_alerts 
      ADD CONSTRAINT consultant_alerts_priority_check 
      CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
    END IF;
  END IF;

  -- Check if alert_type column exists before adding constraint
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consultant_alerts' AND column_name = 'alert_type'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.check_constraints 
      WHERE constraint_name = 'consultant_alerts_alert_type_check'
    ) THEN
      ALTER TABLE consultant_alerts 
      ADD CONSTRAINT consultant_alerts_alert_type_check 
      CHECK (alert_type IN ('document_due', 'payment_overdue', 'task_assigned', 'client_inactive', 'other'));
    END IF;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_expected_documents_client_id ON expected_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_consultant_id ON expected_documents(consultant_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_due_date ON expected_documents(due_date);
CREATE INDEX IF NOT EXISTS idx_expected_documents_overdue ON expected_documents(due_date, is_submitted) WHERE is_submitted = false;
CREATE INDEX IF NOT EXISTS idx_expected_documents_pending ON expected_documents(consultant_id, is_submitted) WHERE is_submitted = false;

CREATE INDEX IF NOT EXISTS idx_consultant_alerts_consultant_id_resolved ON consultant_alerts(consultant_id, is_resolved);
CREATE UNIQUE INDEX IF NOT EXISTS uq_consultant_alerts_source ON consultant_alerts(consultant_id, alert_source_id, alert_type);

-- Enable RLS
ALTER TABLE expected_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for expected_documents
CREATE POLICY "Clients can view their own expected documents"
  ON expected_documents
  FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT clients.id FROM clients WHERE clients.profile_id = auth.uid()
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

-- Create trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION set_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_resolved = true AND OLD.is_resolved = false THEN
        NEW.resolved_at = CURRENT_TIMESTAMP;
    ELSIF NEW.is_resolved = false THEN
        NEW.resolved_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DO $$
BEGIN
  DROP TRIGGER IF EXISTS update_expected_documents_updated_at ON expected_documents;
  CREATE TRIGGER update_expected_documents_updated_at
    BEFORE UPDATE ON expected_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

  DROP TRIGGER IF EXISTS set_consultant_alert_resolved_at ON consultant_alerts;
  CREATE TRIGGER set_consultant_alert_resolved_at
    BEFORE UPDATE ON consultant_alerts
    FOR EACH ROW
    EXECUTE FUNCTION set_resolved_at();
END $$;