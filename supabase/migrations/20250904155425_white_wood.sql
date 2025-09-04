/*
  # Fix user_profiles RLS policies

  1. Security
    - Drop all existing policies on user_profiles table
    - Create new policy for authenticated users to read their own profile using uid() = id
    - Allow INSERT and UPDATE operations for users on their own records
*/

-- Drop all existing policies on user_profiles table
DROP POLICY IF EXISTS "user_profiles_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_select_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profiles" ON user_profiles;

-- Create new policy for SELECT operations
CREATE POLICY "Enable read access for users on their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (uid() = id);

-- Create policy for INSERT operations
CREATE POLICY "Enable insert access for users on their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (uid() = id);

-- Create policy for UPDATE operations
CREATE POLICY "Enable update access for users on their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (uid() = id)
  WITH CHECK (uid() = id);