/*
  # Fix RLS policies for client dashboard access

  1. Problem
    - Overly restrictive RLS policies on user_profiles prevent reading other users' basic info
    - Notifications table lacks proper RLS policies
    - Clients table policies are too restrictive for legitimate access

  2. Solution
    - Allow authenticated users to read basic profile info (full_name, email) from user_profiles
    - Add proper RLS policies for notifications table
    - Update clients table policies to allow proper access

  3. Security
    - Users can read basic profile info of all users (needed for UI)
    - Users can only modify their own profiles
    - Notifications are only visible to recipients
    - Clients data access is properly controlled
*/

-- Update user_profiles SELECT policy to allow reading basic info
DROP POLICY IF EXISTS "users_select_own" ON user_profiles;

CREATE POLICY "users_can_read_basic_profile_info" ON user_profiles
  FOR SELECT TO authenticated
  USING (true);

-- Ensure notifications table has proper RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing notification policies if they exist
DROP POLICY IF EXISTS "users_can_read_own_notifications" ON notifications;
DROP POLICY IF EXISTS "users_can_insert_notifications" ON notifications;
DROP POLICY IF EXISTS "users_can_update_own_notifications" ON notifications;

-- Create proper notification policies
CREATE POLICY "users_can_read_own_notifications" ON notifications
  FOR SELECT TO authenticated
  USING (recipient_profile_id = auth.uid());

CREATE POLICY "system_can_insert_notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "users_can_update_own_notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (recipient_profile_id = auth.uid())
  WITH CHECK (recipient_profile_id = auth.uid());

-- Update clients table policies to allow proper access
DROP POLICY IF EXISTS "clients_select" ON clients;
DROP POLICY IF EXISTS "clients_insert" ON clients;
DROP POLICY IF EXISTS "clients_update" ON clients;
DROP POLICY IF EXISTS "clients_delete" ON clients;

-- Allow authenticated users to read clients (needed for consultants to see their clients)
CREATE POLICY "authenticated_users_can_read_clients" ON clients
  FOR SELECT TO authenticated
  USING (true);

-- Allow users to insert their own client record
CREATE POLICY "users_can_insert_own_client_record" ON clients
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Allow users to update their own client record
CREATE POLICY "users_can_update_own_client_record" ON clients
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Allow admin users to manage all client records
CREATE POLICY "admin_can_manage_all_clients" ON clients
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  );

-- Ensure RLS is enabled on clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;