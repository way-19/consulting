@@ .. @@
 /*
   # Expected Documents and Consultant Alerts Tables

   1. New Tables
     - `expected_documents`
       - Tracks documents that consultants expect clients to submit
       - Includes due dates and submission status
       - Links to actual documents when submitted
     - `consultant_alerts` 
       - Stores consultant-specific alerts from various sources
       - Tracks resolution status and timing
       - Enables alert management workflow

   2. Security
     - Enable RLS on both tables
     - Add policies for consultants and clients access
     - Proper foreign key constraints

   3. Indexes
     - Performance indexes for common queries
     - Due date and status filtering optimization
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Consultants can manage expected documents for their clients" ON expected_documents;
DROP POLICY IF EXISTS "Clients can view their own expected documents" ON expected_documents;
DROP POLICY IF EXISTS "Consultants can manage their own alerts" ON consultant_alerts;

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

-- Create consultant_alerts table with all required columns
CREATE TABLE IF NOT EXISTS consultant_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid,
  alert_source_id uuid NOT NULL,
  alert_type text NOT NULL,
  priority text DEFAULT 'medium',
  title text DEFAULT '',
  description text DEFAULT '',
  due_date timestamptz,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  snooze_until timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Add foreign key constraints safely
DO $$
BEGIN
  -- expected_documents foreign keys
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expected_documents_client_id_fkey'
  ) THEN
    ALTER TABLE expected_documents 
    ADD CONSTRAINT expected_documents_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expected_documents_consultant_id_fkey'
  ) THEN
    ALTER TABLE expected_documents 
    ADD CONSTRAINT expected_documents_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'expected_documents_document_id_fkey'
  ) THEN
    ALTER TABLE expected_documents 
    ADD CONSTRAINT expected_documents_document_id_fkey 
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL;
  END IF;

  -- consultant_alerts foreign keys
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultant_alerts_consultant_id_fkey'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_consultant_id_fkey 
    FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add check constraints safely
DO $$
BEGIN
  -- Add priority check constraint for consultant_alerts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultant_alerts_priority_check'
  ) THEN
    -- First ensure the priority column exists and has proper values
    UPDATE consultant_alerts SET priority = 'medium' WHERE priority IS NULL OR priority = '';
    
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_priority_check 
    CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
  END IF;

  -- Add alert_type check constraint
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultant_alerts_alert_type_check'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_alert_type_check 
    CHECK (alert_type IN ('document_due', 'payment_overdue', 'task_assigned', 'client_inactive', 'general'));
  END IF;
END $$;

-- Enable RLS
ALTER TABLE expected_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Consultants can manage expected documents for their clients"
  ON expected_documents
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Clients can view their own expected documents"
  ON expected_documents
  FOR SELECT
  TO authenticated
  USING (client_id IN (
    SELECT id FROM clients WHERE profile_id = auth.uid()
  ));

CREATE POLICY "Consultants can manage their own alerts"
  ON consultant_alerts
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_expected_documents_consultant_id ON expected_documents(consultant_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_client_id ON expected_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_due_date ON expected_documents(due_date);
CREATE INDEX IF NOT EXISTS idx_expected_documents_overdue ON expected_documents(due_date, is_submitted) WHERE is_submitted = false;
CREATE INDEX IF NOT EXISTS idx_expected_documents_pending ON expected_documents(consultant_id, is_submitted) WHERE is_submitted = false;

CREATE INDEX IF NOT EXISTS idx_consultant_alerts_consultant_id_resolved ON consultant_alerts(consultant_id, is_resolved);
CREATE INDEX IF NOT EXISTS uq_consultant_alerts_source ON consultant_alerts(consultant_id, alert_source_id, alert_type);

-- Create trigger functions for updating timestamps
CREATE OR REPLACE FUNCTION update_expected_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_resolved = true AND OLD.is_resolved = false THEN
    NEW.resolved_at = now();
  ELSIF NEW.is_resolved = false THEN
    NEW.resolved_at = null;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_expected_documents_updated_at ON expected_documents;
CREATE TRIGGER update_expected_documents_updated_at
  BEFORE UPDATE ON expected_documents
  FOR EACH ROW EXECUTE FUNCTION update_expected_documents_updated_at();

DROP TRIGGER IF EXISTS set_consultant_alert_resolved_at ON consultant_alerts;
CREATE TRIGGER set_consultant_alert_resolved_at
  BEFORE UPDATE ON consultant_alerts
  FOR EACH ROW EXECUTE FUNCTION set_resolved_at();