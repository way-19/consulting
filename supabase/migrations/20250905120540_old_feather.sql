/*
  # Fix infinite recursion in clients table RLS policies

  1. Problem
    - Multiple overlapping policies causing infinite recursion
    - Complex subqueries referencing the same table
    - Circular dependencies in policy evaluation

  2. Solution
    - Drop all existing policies on clients table
    - Create simplified, non-overlapping policies
    - Use direct uid() comparisons instead of complex subqueries
    - Add is_admin() function if missing

  3. New Policy Structure
    - Simple admin access
    - Direct client access (profile_id = auth.uid())
    - Direct consultant access (assigned_consultant_id = auth.uid())
*/

-- Drop all existing policies on clients table
DROP POLICY IF EXISTS "Admins can manage all clients" ON clients;
DROP POLICY IF EXISTS "Consultants can read assigned clients" ON clients;
DROP POLICY IF EXISTS "Consultants can update assigned clients" ON clients;
DROP POLICY IF EXISTS "Users can read own client record" ON clients;
DROP POLICY IF EXISTS "clients_admin_all" ON clients;
DROP POLICY IF EXISTS "clients_insert_own" ON clients;
DROP POLICY IF EXISTS "clients_read_assigned" ON clients;
DROP POLICY IF EXISTS "clients_read_own" ON clients;
DROP POLICY IF EXISTS "clients_update_assigned" ON clients;
DROP POLICY IF EXISTS "clients_update_own" ON clients;

-- Create is_admin() function if it doesn't exist
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create simplified, non-recursive policies
CREATE POLICY "clients_admin_access" 
  ON clients 
  FOR ALL 
  TO authenticated 
  USING (is_admin()) 
  WITH CHECK (is_admin());

CREATE POLICY "clients_read_own" 
  ON clients 
  FOR SELECT 
  TO authenticated 
  USING (profile_id = auth.uid());

CREATE POLICY "clients_update_own" 
  ON clients 
  FOR UPDATE 
  TO authenticated 
  USING (profile_id = auth.uid()) 
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "clients_insert_own" 
  ON clients 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "clients_consultant_read" 
  ON clients 
  FOR SELECT 
  TO authenticated 
  USING (assigned_consultant_id = auth.uid());

CREATE POLICY "clients_consultant_update" 
  ON clients 
  FOR UPDATE 
  TO authenticated 
  USING (assigned_consultant_id = auth.uid()) 
  WITH CHECK (assigned_consultant_id = auth.uid());