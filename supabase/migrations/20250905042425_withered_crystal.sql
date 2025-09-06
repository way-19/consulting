/*
  # Fix clients table RLS policies

  1. Security
    - Drop existing problematic policies for clients table
    - Create new comprehensive RLS policies
    - Ensure authenticated users can access their own client data
    - Ensure consultants can access assigned client data
    - Ensure admins can access all client data

  2. Changes
    - Fix permission denied error for clients table access
    - Recreate all RLS policies with proper conditions
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own client record" ON clients;
DROP POLICY IF EXISTS "Consultants can read assigned clients" ON clients;
DROP POLICY IF EXISTS "Admins can read all clients" ON clients;
DROP POLICY IF EXISTS "Admins can manage clients" ON clients;

-- Ensure RLS is enabled
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own client record
CREATE POLICY "Users can read own client record"
  ON clients
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- Policy for consultants to read assigned clients
CREATE POLICY "Consultants can read assigned clients"
  ON clients
  FOR SELECT
  TO authenticated
  USING (
    assigned_consultant_id = auth.uid()
    OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'consultant'
      AND clients.assigned_consultant_id = user_profiles.id
    )
  );

-- Policy for admins to manage all clients
CREATE POLICY "Admins can manage all clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Policy for consultants to update assigned clients
CREATE POLICY "Consultants can update assigned clients"
  ON clients
  FOR UPDATE
  TO authenticated
  USING (
    assigned_consultant_id = auth.uid()
    OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'consultant'
      AND clients.assigned_consultant_id = user_profiles.id
    )
  )
  WITH CHECK (
    assigned_consultant_id = auth.uid()
    OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'consultant'
      AND clients.assigned_consultant_id = user_profiles.id
    )
  );