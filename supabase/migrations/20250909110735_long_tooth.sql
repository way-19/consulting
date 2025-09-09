/*
  # Expected Documents and Alert System

  1. New Tables
    - `expected_documents`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `document_type` (text)
      - `due_date` (date)
      - `is_submitted` (boolean)
      - `submitted_at` (timestamp)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `consultant_alerts`
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `client_id` (uuid, foreign key to clients)
      - `alert_type` (text)
      - `priority` (text)
      - `title` (text)
      - `description` (text)
      - `is_read` (boolean)
      - `is_resolved` (boolean)
      - `due_date` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for consultants to manage their clients' data
*/

-- Expected Documents Table
CREATE TABLE IF NOT EXISTS expected_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('bank_statement', 'invoice', 'receipt', 'tax_document', 'financial_report', 'other')),
  due_date date NOT NULL,
  is_submitted boolean DEFAULT false,
  submitted_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Consultant Alerts Table
CREATE TABLE IF NOT EXISTS consultant_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  alert_type text NOT NULL CHECK (alert_type IN ('overdue_payment', 'missing_document', 'upcoming_deadline', 'client_inactive', 'document_review_needed', 'meeting_reminder')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  title text NOT NULL,
  description text NOT NULL,
  is_read boolean DEFAULT false,
  is_resolved boolean DEFAULT false,
  due_date timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE expected_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expected_documents
CREATE POLICY "Consultants can manage expected documents for their clients"
  ON expected_documents
  FOR ALL
  TO authenticated
  USING (
    consultant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM clients c 
      WHERE c.id = expected_documents.client_id 
      AND c.assigned_consultant_id = auth.uid()
    )
  )
  WITH CHECK (
    consultant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM clients c 
      WHERE c.id = expected_documents.client_id 
      AND c.assigned_consultant_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all expected documents"
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

-- RLS Policies for consultant_alerts
CREATE POLICY "Consultants can manage their own alerts"
  ON consultant_alerts
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Admins can view all consultant alerts"
  ON consultant_alerts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_expected_documents_consultant_id ON expected_documents(consultant_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_client_id ON expected_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_expected_documents_due_date ON expected_documents(due_date);
CREATE INDEX IF NOT EXISTS idx_expected_documents_overdue ON expected_documents(due_date) WHERE is_submitted = false AND due_date < CURRENT_DATE;

CREATE INDEX IF NOT EXISTS idx_consultant_alerts_consultant_id ON consultant_alerts(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultant_alerts_unread ON consultant_alerts(consultant_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_consultant_alerts_priority ON consultant_alerts(consultant_id, priority) WHERE is_resolved = false;
CREATE INDEX IF NOT EXISTS idx_consultant_alerts_due_date ON consultant_alerts(due_date) WHERE is_resolved = false;

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_expected_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_expected_documents_updated_at_trigger
  BEFORE UPDATE ON expected_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_expected_documents_updated_at();

-- Function to automatically create alerts for overdue documents
CREATE OR REPLACE FUNCTION check_overdue_documents()
RETURNS void AS $$
BEGIN
  -- Create alerts for overdue expected documents
  INSERT INTO consultant_alerts (consultant_id, client_id, alert_type, priority, title, description, due_date)
  SELECT 
    ed.consultant_id,
    ed.client_id,
    'missing_document',
    CASE 
      WHEN ed.due_date < CURRENT_DATE - INTERVAL '7 days' THEN 'urgent'
      WHEN ed.due_date < CURRENT_DATE - INTERVAL '3 days' THEN 'high'
      ELSE 'medium'
    END,
    'Overdue Document: ' || ed.document_type,
    'Client ' || up.full_name || ' has not submitted ' || ed.document_type || ' due on ' || ed.due_date::text,
    ed.due_date::timestamptz
  FROM expected_documents ed
  JOIN clients c ON ed.client_id = c.id
  JOIN user_profiles up ON c.profile_id = up.id
  WHERE ed.is_submitted = false 
    AND ed.due_date < CURRENT_DATE
    AND NOT EXISTS (
      SELECT 1 FROM consultant_alerts ca 
      WHERE ca.consultant_id = ed.consultant_id 
        AND ca.client_id = ed.client_id 
        AND ca.alert_type = 'missing_document'
        AND ca.metadata->>'expected_document_id' = ed.id::text
        AND ca.is_resolved = false
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check for upcoming payment deadlines
CREATE OR REPLACE FUNCTION check_payment_deadlines()
RETURNS void AS $$
BEGIN
  -- Create alerts for upcoming payment deadlines
  INSERT INTO consultant_alerts (consultant_id, client_id, alert_type, priority, title, description, due_date, metadata)
  SELECT 
    c.assigned_consultant_id,
    i.client_id,
    'overdue_payment',
    CASE 
      WHEN i.due_date < CURRENT_DATE THEN 'urgent'
      WHEN i.due_date < CURRENT_DATE + INTERVAL '3 days' THEN 'high'
      ELSE 'medium'
    END,
    'Payment Due: $' || i.amount_due::text,
    'Invoice #' || SUBSTRING(i.id::text, 1, 8) || ' for $' || i.amount_due || ' is ' || 
    CASE 
      WHEN i.due_date < CURRENT_DATE THEN 'overdue'
      ELSE 'due soon'
    END,
    i.due_date::timestamptz,
    jsonb_build_object('invoice_id', i.id, 'amount', i.amount_due, 'currency', i.currency)
  FROM invoices i
  JOIN clients c ON i.client_id = c.id
  WHERE i.status = 'pending'
    AND c.assigned_consultant_id IS NOT NULL
    AND (i.due_date <= CURRENT_DATE + INTERVAL '7 days')
    AND NOT EXISTS (
      SELECT 1 FROM consultant_alerts ca 
      WHERE ca.consultant_id = c.assigned_consultant_id 
        AND ca.client_id = i.client_id 
        AND ca.alert_type = 'overdue_payment'
        AND ca.metadata->>'invoice_id' = i.id::text
        AND ca.is_resolved = false
    );
END;
$$ LANGUAGE plpgsql;