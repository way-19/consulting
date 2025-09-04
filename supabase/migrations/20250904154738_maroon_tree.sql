/*
  # Fix user_profiles SELECT policy

  This migration fixes the permission denied error when accessing user_profiles.
  
  1. Security
    - Drops all existing policies that might be conflicting
    - Creates a simple SELECT policy for authenticated users to access their own data
    - Uses the standard auth.uid() = id pattern
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create a simple SELECT policy for authenticated users
CREATE POLICY "authenticated_users_select_own_profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create INSERT policy for profile creation
CREATE POLICY "authenticated_users_insert_own_profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create UPDATE policy for profile updates
CREATE POLICY "authenticated_users_update_own_profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);