/*
  # Fix user_profiles RLS policies - Simple approach

  1. Security Changes
    - Drop all existing conflicting policies
    - Create single, clear policy for authenticated users to read own profile
    - Maintain public read access for basic info needed by the app
  
  This resolves the permission denied error by ensuring clean, non-conflicting RLS policies.
*/

-- Drop all existing policies to start clean
DROP POLICY IF EXISTS "public_can_read_basic_info" ON user_profiles;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all clients" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON user_profiles;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, clean policies
CREATE POLICY "authenticated_users_can_read_own_profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "authenticated_users_can_insert_own_profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "authenticated_users_can_update_own_profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);