/*
  # Fix consultant dashboard database errors

  1. Foreign Key Relationships
    - Add missing foreign key constraint between documents and clients tables
    - This enables Supabase to recognize the relationship for JOIN operations

  2. RLS Policy Fixes
    - Fix overly restrictive RLS policies on clients table
    - Replace FOR ALL policy with granular SELECT, INSERT, UPDATE, DELETE policies
    - Ensure consultants can access their assigned clients

  3. Security
    - Maintain proper access control
    - Consultants can only access their assigned clients
    - Clients can only access their own data
*/

-- Add missing foreign key constraint between documents and clients
DO $$
BEGIN
  -- Check if foreign key constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'documents_client_id_fkey' 
    AND table_name = 'documents'
  ) THEN
    -- Add the foreign key constraint
    ALTER TABLE documents 
    ADD CONSTRAINT documents_client_id_fkey 
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Fix RLS policies for clients table
-- Drop the problematic FOR ALL policy
DROP POLICY IF EXISTS "Consultants manage assigned clients" ON clients;

-- Create granular policies for clients table
CREATE POLICY "Consultants can select assigned clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (assigned_consultant_id = auth.uid());

CREATE POLICY "Consultants can insert clients"
  ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (assigned_consultant_id = auth.uid());

CREATE POLICY "Consultants can update assigned clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (assigned_consultant_id = auth.uid())
  WITH CHECK (assigned_consultant_id = auth.uid());

CREATE POLICY "Consultants can delete assigned clients"
  ON clients
  FOR DELETE
  TO authenticated
  USING (assigned_consultant_id = auth.uid());

-- Ensure clients can read their own profile
CREATE POLICY "Clients can read own profile"
  ON clients
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- Fix RLS policies for documents table to work with the new foreign key
DROP POLICY IF EXISTS "Clients read own documents" ON documents;
DROP POLICY IF EXISTS "Clients upload own documents" ON documents;
DROP POLICY IF EXISTS "Consultants read client documents" ON documents;
DROP POLICY IF EXISTS "Consultants create document requests" ON documents;
DROP POLICY IF EXISTS "Consultants update document status" ON documents;

-- Create new document policies that work with the foreign key relationship
CREATE POLICY "Clients can read own documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Clients can upload own documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can read client documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE assigned_consultant_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can create document requests"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_request = true AND 
    requested_by_consultant_id = auth.uid() AND
    client_id IN (
      SELECT id FROM clients WHERE assigned_consultant_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can update document status"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE assigned_consultant_id = auth.uid()
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE assigned_consultant_id = auth.uid()
    )
  );

-- Create index for better performance on the foreign key
CREATE INDEX IF NOT EXISTS documents_client_id_idx ON documents(client_id);