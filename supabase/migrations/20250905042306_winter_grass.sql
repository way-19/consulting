/*
  # Fix clients table RLS policies

  1. Security
    - Ensure RLS is enabled on `clients` table
    - Add policy for authenticated users to read their own client record
    - Add policy for consultants to read assigned clients
    - Add policy for admins to read all clients

  This migration ensures that clients can access their own data when the AuthContext
  tries to fetch client information during login.
*/

-- Ensure RLS is enabled on clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can read own client record" ON clients;
DROP POLICY IF EXISTS "Consultants can read assigned clients" ON clients;
DROP POLICY IF EXISTS "Admins can read all clients" ON clients;

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
  USING (assigned_consultant_id = auth.uid());

-- Policy for admins to read all clients
CREATE POLICY "Admins can read all clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM user_profiles
      WHERE user_profiles.id = auth.uid()
        AND user_profiles.role = 'admin'
    )
  );