/*
  # Expected Documents Table for Consultant Alerts

  1. New Tables
    - `expected_documents`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `document_type` (text, type of expected document)
      - `due_date` (date, when document is expected)
      - `is_submitted` (boolean, whether document was submitted)
      - `submitted_at` (timestamp, when document was submitted)
      - `document_id` (uuid, foreign key to documents table when submitted)
      - `reminder_sent` (boolean, whether reminder was sent)
      - `notes` (text, additional notes)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `expected_documents` table
    - Add policies for consultants to manage their clients' expected documents
    - Add policies for clients to view their own expected documents

  3. Indexes
    - Add indexes for performance on consultant_id, client_id, due_date, is_submitted
*/

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

-- Enable RLS
ALTER TABLE expected_documents ENABLE ROW LEVEL SECURITY;

-- Policies for consultants
CREATE POLICY "Consultants can manage expected documents for their clients"
  ON expected_documents
  FOR ALL
  TO authenticated
  USING (
    consultant_id = auth.uid()
  )
  WITH CHECK (
    consultant_id = auth.uid()
  );

-- Policies for clients to view their own expected documents
CREATE POLICY "Clients can view their own expected documents"
  ON expected_documents
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_expected_documents_consultant_id ON expected_documents(consultant_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_client_id ON expected_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_due_date ON expected_documents(due_date);
CREATE INDEX IF NOT EXISTS idx_expected_documents_overdue ON expected_documents(due_date, is_submitted) WHERE is_submitted = false;
CREATE INDEX IF NOT EXISTS idx_expected_documents_pending ON expected_documents(consultant_id, is_submitted) WHERE is_submitted = false;

-- Trigger for updated_at
CREATE TRIGGER update_expected_documents_updated_at
  BEFORE UPDATE ON expected_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();