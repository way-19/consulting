/*
  # Create documents and notifications tables

  1. New Tables
    - `documents` (Document management)
    - `document_requests` (Document requests from consultants)
    - `notifications` (System notifications)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'other' CHECK (type IN ('identity', 'business', 'financial', 'legal', 'other')),
  category text,
  status text DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'pending', 'approved', 'rejected', 'needs_revision')),
  file_url text,
  file_size bigint,
  mime_type text,
  is_request boolean DEFAULT false,
  notes text,
  due_date date,
  uploaded_at timestamptz,
  reviewed_at timestamptz,
  requested_by_consultant_id uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create document_requests table
CREATE TABLE IF NOT EXISTS document_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  title text NOT NULL,
  description text,
  document_type text NOT NULL DEFAULT 'other',
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'approved', 'rejected')),
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES user_profiles(id),
  recipient_profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  payload jsonb DEFAULT '{}',
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Clients can manage own documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can manage client documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    consultant_id = auth.uid() OR
    requested_by_consultant_id = auth.uid()
  );

-- Document requests policies
CREATE POLICY "Clients can read own document requests"
  ON document_requests
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can manage own document requests"
  ON document_requests
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (recipient_profile_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (recipient_profile_id = auth.uid());

-- Updated at triggers
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_requests_updated_at
  BEFORE UPDATE ON document_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();