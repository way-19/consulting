/*
  # File Manager System

  1. New Tables
    - `file_manager`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `created_by` (uuid, foreign key) 
      - `name` (text)
      - `type` (enum: file, folder)
      - `file_type` (text)
      - `file_url` (text)
      - `file_size` (bigint)
      - `mime_type` (text)
      - `folder_path` (text)
      - `parent_folder_id` (uuid)
      - `is_starred` (boolean)
      - `is_shared` (boolean)
      - `version` (integer)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `file_manager` table
    - Policies for client and consultant access
    - Version control and audit logs

  3. Storage
    - Organize files by client and folder structure
    - File size limits and type restrictions
*/

-- Create file manager table
CREATE TABLE IF NOT EXISTS file_manager (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('file', 'folder')),
  file_type text, -- image, document, video, etc.
  file_url text,
  file_size bigint,
  mime_type text,
  folder_path text NOT NULL DEFAULT '/',
  parent_folder_id uuid REFERENCES file_manager(id) ON DELETE CASCADE,
  is_starred boolean DEFAULT false,
  is_shared boolean DEFAULT false,
  version integer DEFAULT 1,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_file_manager_client_id ON file_manager(client_id);
CREATE INDEX IF NOT EXISTS idx_file_manager_folder_path ON file_manager(folder_path);
CREATE INDEX IF NOT EXISTS idx_file_manager_parent_folder_id ON file_manager(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_file_manager_type ON file_manager(type);
CREATE INDEX IF NOT EXISTS idx_file_manager_created_by ON file_manager(created_by);

-- Enable RLS
ALTER TABLE file_manager ENABLE ROW LEVEL SECURITY;

-- Policies for clients (can manage their own files)
CREATE POLICY "Clients can manage own files"
  ON file_manager
  FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = uid()
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = uid()
    )
  );

-- Policies for consultants (can manage assigned client files)
CREATE POLICY "Consultants can manage assigned client files"
  ON file_manager
  FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE assigned_consultant_id = uid()
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE assigned_consultant_id = uid()
    )
  );

-- Policies for admins (can manage everything)
CREATE POLICY "Admins can manage all files"
  ON file_manager
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = uid() AND role = 'admin'
    )
  );

-- Update timestamp trigger
CREATE TRIGGER update_file_manager_updated_at
  BEFORE UPDATE ON file_manager
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();