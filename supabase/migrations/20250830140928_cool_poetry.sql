/*
  # Fix user_profiles RLS policies and validate marketing_pages access

  1. Problem
    - users_can_manage_own_profile policy with FOR ALL command is causing conflicts
    - This policy may be interfering with marketing_pages admin access
    - FOR ALL policies can cause unexpected behavior and conflicts

  2. Solution
    - Drop the problematic users_can_manage_own_profile policy
    - Ensure proper individual policies exist for user_profiles
    - Validate marketing_pages policies are working correctly

  3. Security
    - Users can only access their own profile data
    - Admin users can access marketing_pages for CMS functionality
    - Clear separation between read and write permissions
*/

-- Drop the problematic FOR ALL policy on user_profiles
DROP POLICY IF EXISTS "users_can_manage_own_profile" ON user_profiles;

-- Ensure we have proper individual policies for user_profiles
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "users_select_own" ON user_profiles;
DROP POLICY IF EXISTS "users_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "users_update_own" ON user_profiles;

-- Create clean, simple policies for user_profiles
CREATE POLICY "users_select_own" ON user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_insert_own" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_own" ON user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Ensure RLS is enabled on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Validate that marketing_pages policies exist and are correct
-- These should already exist from previous migrations, but let's ensure they're there

-- Ensure read access policy exists for marketing_pages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'marketing_pages' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users"
      ON marketing_pages
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- Ensure admin insert policy exists for marketing_pages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'marketing_pages' 
    AND policyname = 'Enable insert for admin users'
  ) THEN
    CREATE POLICY "Enable insert for admin users"
      ON marketing_pages
      FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid() 
          AND user_profiles.role = 'admin'::user_role
        )
      );
  END IF;
END $$;

-- Ensure admin update policy exists for marketing_pages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'marketing_pages' 
    AND policyname = 'Enable update for admin users'
  ) THEN
    CREATE POLICY "Enable update for admin users"
      ON marketing_pages
      FOR UPDATE
      TO authenticated
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
  END IF;
END $$;

-- Ensure admin delete policy exists for marketing_pages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'marketing_pages' 
    AND policyname = 'Enable delete for admin users'
  ) THEN
    CREATE POLICY "Enable delete for admin users"
      ON marketing_pages
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid() 
          AND user_profiles.role = 'admin'::user_role
        )
      );
  END IF;
END $$;

-- Ensure RLS is enabled on marketing_pages
ALTER TABLE marketing_pages ENABLE ROW LEVEL SECURITY;

-- Fix the client user role data issue
UPDATE user_profiles 
SET role = 'client'::user_role
WHERE email = 'client@consulting19.com';