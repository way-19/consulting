/*
  # Fix User Profiles Table RLS Permissions

  1. Security Updates
    - Ensure proper RLS policies for user_profiles table
    - Maintain user privacy while allowing necessary access
    - Fix consultant profile access for service pages

  2. Changes
    - Allows authenticated users to read consultant profiles (for service pages)
    - Maintains user privacy for personal data
    - Ensures proper authentication flow
*/

-- Ensure RLS is enabled on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "users_select_own" ON user_profiles;
DROP POLICY IF EXISTS "users_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "users_update_own" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated read for consultant profiles" ON user_profiles;

-- Allow users to read their own profile
CREATE POLICY "users_select_own"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "users_insert_own"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "users_update_own"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to read consultant profiles (for service pages)
CREATE POLICY "Allow authenticated read for consultant profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (role = 'consultant' AND is_active = true);

-- Grant necessary permissions
GRANT SELECT ON user_profiles TO authenticated;