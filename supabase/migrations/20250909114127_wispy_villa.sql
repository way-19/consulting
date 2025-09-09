/*
  # Create expected_documents table and consultant_alerts table

  1. New Tables
    - `expected_documents`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `document_type` (text)
      - `due_date` (date)
      - `is_submitted` (boolean, default false)
      - `submitted_at` (timestamp)
      - `document_id` (uuid, foreign key to documents)
      - `reminder_sent` (boolean, default false)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `consultant_alerts`
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `alert_source_id` (text, references the source record id)
      - `alert_type` (text, the type of alert)
      - `is_resolved` (boolean, default false)
      - `resolved_at` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for consultant access to their own data
    - Add policies for client access to their own expected documents

  3. Triggers
    - Update triggers for both tables
*/

-- Create expected_documents table
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

-- Create consultant_alerts table
CREATE TABLE IF NOT EXISTS consultant_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  alert_source_id text NOT NULL,
  alert_type text NOT NULL,
  is_resolved boolean DEFAULT false,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(consultant_id, alert_source_id, alert_type)
);

-- Enable RLS
ALTER TABLE expected_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_alerts ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_expected_documents_consultant_id ON expected_documents(consultant_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_client_id ON expected_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_due_date ON expected_documents(due_date);
CREATE INDEX IF NOT EXISTS idx_expected_documents_pending ON expected_documents(consultant_id, is_submitted) WHERE is_submitted = false;
CREATE INDEX IF NOT EXISTS idx_expected_documents_overdue ON expected_documents(due_date, is_submitted) WHERE is_submitted = false;

CREATE INDEX IF NOT EXISTS idx_consultant_alerts_consultant_id ON consultant_alerts(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultant_alerts_unresolved ON consultant_alerts(consultant_id, is_resolved) WHERE is_resolved = false;
CREATE INDEX IF NOT EXISTS idx_consultant_alerts_source ON consultant_alerts(alert_source_id, alert_type);

-- RLS Policies for expected_documents
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

-- RLS Policies for consultant_alerts  
CREATE POLICY "Consultants can manage their own alerts"
  ON consultant_alerts
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Update triggers
CREATE TRIGGER update_expected_documents_updated_at
  BEFORE UPDATE ON expected_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultant_alerts_updated_at
  BEFORE UPDATE ON consultant_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();