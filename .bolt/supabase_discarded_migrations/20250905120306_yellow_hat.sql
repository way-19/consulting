/*
  # File Manager System

  1. New Tables
    - `file_manager`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `created_by` (uuid, foreign key to user_profiles)
      - `name` (text, file/folder name)
      - `type` (text, 'file' or 'folder')
      - `file_type` (text, category like 'image', 'document')
      - `file_url` (text, Supabase Storage URL)
      - `file_size` (bigint, file size in bytes)
      - `mime_type` (text, MIME type)
      - `folder_path` (text, path like '/documents/2024')
      - `parent_folder_id` (uuid, for nested folders)
      - `is_starred` (boolean, favorite system)
      - `is_shared` (boolean, sharing indicator)
      - `version` (integer, version control)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `file_manager` table
    - Add policies for clients, consultants, and admins
    
  3. Indexes
    - Performance indexes for queries
    
  4. Triggers
    - Auto-update updated_at timestamp
*/

CREATE TABLE IF NOT EXISTS file_manager (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('file', 'folder')),
  file_type text, -- 'image', 'document', 'video', 'audio', 'archive', 'other'
  file_url text,
  file_size bigint,
  mime_type text,
  folder_path text NOT NULL DEFAULT '/',
  parent_folder_id uuid REFERENCES file_manager(id) ON DELETE CASCADE,
  is_starred boolean DEFAULT false,
  is_shared boolean DEFAULT false,
  version integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE file_manager ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_file_manager_client_id ON file_manager(client_id);
CREATE INDEX IF NOT EXISTS idx_file_manager_created_by ON file_manager(created_by);
CREATE INDEX IF NOT EXISTS idx_file_manager_folder_path ON file_manager(folder_path);
CREATE INDEX IF NOT EXISTS idx_file_manager_parent_folder_id ON file_manager(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_file_manager_type ON file_manager(type);
CREATE INDEX IF NOT EXISTS idx_file_manager_is_starred ON file_manager(is_starred) WHERE is_starred = true;

-- RLS Policies

-- Clients can manage their own files
CREATE POLICY "fm_client_own"
  ON file_manager
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients c
      WHERE c.id = file_manager.client_id
        AND c.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients c
      WHERE c.id = file_manager.client_id
        AND c.profile_id = auth.uid()
    )
  );

-- Consultants can manage files of their assigned clients
CREATE POLICY "fm_consultant_assigned"
  ON file_manager
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients c
      WHERE c.id = file_manager.client_id
        AND c.assigned_consultant_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients c
      WHERE c.id = file_manager.client_id
        AND c.assigned_consultant_id = auth.uid()
    )
  );

-- Admins can manage all files
CREATE POLICY "fm_admin_all"
  ON file_manager
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_file_manager_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_file_manager_updated_at
  BEFORE UPDATE ON file_manager
  FOR EACH ROW
  EXECUTE FUNCTION update_file_manager_updated_at();