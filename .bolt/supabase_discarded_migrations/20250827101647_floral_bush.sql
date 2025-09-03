/*
  # Create Documents Table

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `project_id` (uuid, nullable, references projects)
      - `uploader_id` (uuid, references user_profiles)
      - `file_name` (text)
      - `file_path` (text)
      - `file_size` (bigint, nullable)
      - `mime_type` (text, nullable)
      - `document_type` (document_type enum)
      - `description` (text, nullable)
      - `is_confidential` (boolean, default true)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `documents` table
    - Add policies for project participants to access documents
    - Add policies for admins to access all documents
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  uploader_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  mime_type text,
  document_type document_type NOT NULL DEFAULT 'other',
  description text,
  is_confidential boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Project participants can view project documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    project_id IS NULL OR
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = documents.project_id
      AND (projects.client_id = auth.uid() OR projects.consultant_id = auth.uid())
    )
  );

CREATE POLICY "Users can view their own uploaded documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (uploader_id = auth.uid());

CREATE POLICY "Project participants can upload documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    project_id IS NULL OR
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = documents.project_id
      AND (projects.client_id = auth.uid() OR projects.consultant_id = auth.uid())
    )
  );

CREATE POLICY "Users can upload their own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (uploader_id = auth.uid());

CREATE POLICY "Admins can manage all documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );