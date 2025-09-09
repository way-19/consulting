/*
  # Expected Documents Management Table

  1. New Tables
    - `expected_documents`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `document_type` (text, type of expected document)
      - `document_category` (text, category like 'monthly_accounting', 'annual_tax')
      - `frequency` (text, how often expected - monthly, quarterly, yearly)
      - `due_date` (date, when document is expected)
      - `next_due_date` (date, next scheduled due date for recurring)
      - `is_submitted` (boolean, whether document was submitted)
      - `submitted_document_id` (uuid, reference to actual document if submitted)
      - `is_overdue` (boolean, computed field)
      - `priority` (text, importance level)
      - `auto_reminder_sent` (boolean, if reminder was sent)
      - `notes` (text, additional notes)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `expected_documents` table
    - Add policies for consultants to manage their clients' expected documents
    - Add policies for clients to view their own expected documents

  3. Indexes
    - Index on consultant_id for fast consultant queries
    - Index on due_date for overdue checks
    - Index on is_overdue for quick filtering
    - Index on client_id for client-specific queries
*/

CREATE TABLE IF NOT EXISTS expected_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_category text NOT NULL DEFAULT 'general',
  frequency text CHECK (frequency IN ('monthly', 'quarterly', 'yearly', 'one_time')) DEFAULT 'monthly',
  due_date date NOT NULL,
  next_due_date date,
  is_submitted boolean DEFAULT false,
  submitted_document_id uuid REFERENCES documents(id) ON DELETE SET NULL,
  is_overdue boolean GENERATED ALWAYS AS (due_date < CURRENT_DATE AND NOT is_submitted) STORED,
  priority text CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  auto_reminder_sent boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_expected_documents_consultant_id ON expected_documents(consultant_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_client_id ON expected_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_due_date ON expected_documents(due_date);
CREATE INDEX IF NOT EXISTS idx_expected_documents_overdue ON expected_documents(is_overdue) WHERE is_overdue = true;
CREATE INDEX IF NOT EXISTS idx_expected_documents_not_submitted ON expected_documents(is_submitted) WHERE is_submitted = false;
CREATE INDEX IF NOT EXISTS idx_expected_documents_priority ON expected_documents(priority);

-- Enable RLS
ALTER TABLE expected_documents ENABLE ROW LEVEL SECURITY;

-- Consultants can manage expected documents for their assigned clients
CREATE POLICY "expected_documents_consultant_manage"
  ON expected_documents
  FOR ALL
  TO authenticated
  USING (
    consultant_id = auth.uid() OR
    client_id IN (
      SELECT id FROM clients WHERE assigned_consultant_id = auth.uid()
    )
  )
  WITH CHECK (
    consultant_id = auth.uid() OR
    client_id IN (
      SELECT id FROM clients WHERE assigned_consultant_id = auth.uid()
    )
  );

-- Clients can view their own expected documents
CREATE POLICY "expected_documents_client_view"
  ON expected_documents
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

-- Admins can manage all expected documents
CREATE POLICY "expected_documents_admin_all"
  ON expected_documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically update next_due_date based on frequency
CREATE OR REPLACE FUNCTION update_next_due_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate next due date based on frequency
  IF NEW.frequency = 'monthly' THEN
    NEW.next_due_date := NEW.due_date + INTERVAL '1 month';
  ELSIF NEW.frequency = 'quarterly' THEN
    NEW.next_due_date := NEW.due_date + INTERVAL '3 months';
  ELSIF NEW.frequency = 'yearly' THEN
    NEW.next_due_date := NEW.due_date + INTERVAL '1 year';
  ELSE
    NEW.next_due_date := NULL; -- one_time documents don't have next due date
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update next_due_date
CREATE TRIGGER trigger_update_next_due_date
  BEFORE INSERT OR UPDATE ON expected_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_next_due_date();

-- Function to create recurring expected documents
CREATE OR REPLACE FUNCTION create_next_expected_document(document_id uuid)
RETURNS void AS $$
DECLARE
  doc_record expected_documents%ROWTYPE;
BEGIN
  -- Get the original document record
  SELECT * INTO doc_record FROM expected_documents WHERE id = document_id;
  
  -- Only create next occurrence if it's recurring and has been submitted
  IF doc_record.frequency != 'one_time' AND doc_record.is_submitted AND doc_record.next_due_date IS NOT NULL THEN
    INSERT INTO expected_documents (
      client_id,
      consultant_id,
      document_type,
      document_category,
      frequency,
      due_date,
      priority,
      notes
    ) VALUES (
      doc_record.client_id,
      doc_record.consultant_id,
      doc_record.document_type,
      doc_record.document_category,
      doc_record.frequency,
      doc_record.next_due_date,
      doc_record.priority,
      doc_record.notes
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get overdue documents count for a consultant
CREATE OR REPLACE FUNCTION get_consultant_overdue_count(consultant_id_param uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM expected_documents ed
    WHERE ed.consultant_id = consultant_id_param
      AND ed.is_overdue = true
      AND ed.is_submitted = false
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get upcoming due documents (next 7 days)
CREATE OR REPLACE FUNCTION get_consultant_upcoming_documents(consultant_id_param uuid)
RETURNS TABLE (
  client_name text,
  company_name text,
  document_type text,
  due_date date,
  priority text,
  days_until_due integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.full_name::text,
    c.company_name::text,
    ed.document_type::text,
    ed.due_date,
    ed.priority::text,
    (ed.due_date - CURRENT_DATE)::integer
  FROM expected_documents ed
  JOIN clients c ON ed.client_id = c.id
  JOIN user_profiles up ON c.profile_id = up.id
  WHERE ed.consultant_id = consultant_id_param
    AND ed.is_submitted = false
    AND ed.due_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
  ORDER BY ed.due_date ASC, ed.priority DESC;
END;
$$ LANGUAGE plpgsql;