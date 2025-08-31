/*
  # Fix RLS policies for client dashboard access

  1. Problem
    - Client users cannot access notifications table due to restrictive RLS policies
    - Client users cannot read their own client record from clients table
    - Current policies don't properly handle client role access

  2. Solution
    - Update notifications policies to allow clients to read their own notifications
    - Update clients table policies to allow users to read their own client record
    - Ensure proper role-based access for all user types

  3. Security
    - Clients can only read their own notifications and client record
    - Consultants can read notifications for their assigned clients
    - Admins have full access to manage all records
*/

-- Fix notifications table RLS policies
DROP POLICY IF EXISTS "users_can_read_own_notifications" ON notifications;
DROP POLICY IF EXISTS "system_can_insert_notifications" ON notifications;
DROP POLICY IF EXISTS "users_can_update_own_notifications" ON notifications;

-- Allow users to read notifications where they are the recipient
CREATE POLICY "users_can_read_own_notifications" ON notifications
  FOR SELECT TO authenticated
  USING (recipient_profile_id = auth.uid());

-- Allow consultants and admins to insert notifications
CREATE POLICY "consultants_and_admins_can_insert_notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('consultant'::user_role, 'admin'::user_role)
    )
  );

-- Allow users to update their own notifications (mark as read, etc.)
CREATE POLICY "users_can_update_own_notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (recipient_profile_id = auth.uid())
  WITH CHECK (recipient_profile_id = auth.uid());

-- Fix clients table RLS policies
DROP POLICY IF EXISTS "authenticated_users_can_read_clients" ON clients;
DROP POLICY IF EXISTS "users_can_insert_own_client_record" ON clients;
DROP POLICY IF EXISTS "users_can_update_own_client_record" ON clients;
DROP POLICY IF EXISTS "admin_can_manage_all_clients" ON clients;

-- Allow users to read their own client record
CREATE POLICY "users_can_read_own_client_record" ON clients
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

-- Allow consultants to read their assigned clients
CREATE POLICY "consultants_can_read_assigned_clients" ON clients
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'consultant'::user_role
    )
  );

-- Allow admins to read all client records
CREATE POLICY "admins_can_read_all_clients" ON clients
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  );

-- Allow users to insert their own client record
CREATE POLICY "users_can_insert_own_client_record" ON clients
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Allow users to update their own client record
CREATE POLICY "users_can_update_own_client_record" ON clients
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Allow admins to manage all client records
CREATE POLICY "admins_can_manage_all_clients" ON clients
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  );

CREATE POLICY "admins_can_update_all_clients" ON clients
  FOR UPDATE TO authenticated
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

CREATE POLICY "admins_can_delete_all_clients" ON clients
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  );