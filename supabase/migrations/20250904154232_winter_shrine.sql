/*
  # Fix user_profiles RLS policies

  This migration fixes the Row Level Security policies for the user_profiles table
  to resolve permission denied errors when authenticated users try to fetch their profiles.

  ## Changes
  1. Drop conflicting RLS policies
  2. Create clear, non-conflicting policies for user_profiles access
  3. Ensure authenticated users can read their own profiles
  4. Maintain admin access to all profiles

  ## Security
  - Enable RLS on user_profiles table
  - Allow authenticated users to read their own profile data
  - Allow admins to read all profiles
  - Allow public read access for basic profile information
*/

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Allow public read access to user profiles" ON user_profiles;
DROP POLICY IF EXISTS "users_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "users_select_own" ON user_profiles;
DROP POLICY IF EXISTS "users_update_own" ON user_profiles;

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create clear, non-conflicting policies
CREATE POLICY "authenticated_users_can_read_own_profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "authenticated_users_can_update_own_profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "authenticated_users_can_insert_own_profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_can_manage_all_profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow public read access to basic profile information (for displaying consultant info, etc.)
CREATE POLICY "public_can_read_basic_profile_info"
  ON user_profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);