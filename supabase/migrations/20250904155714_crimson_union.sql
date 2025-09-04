/*
  # Fix user_profiles RLS policies

  1. Security Changes
    - Drop all existing policies on user_profiles table
    - Create new policies using correct auth.uid() function
    - Enable authenticated users to read, insert, and update their own profile data
    
  2. Policy Details
    - SELECT: Users can read their own profile using auth.uid() = id
    - INSERT: Users can create their own profile using auth.uid() = id
    - UPDATE: Users can update their own profile using auth.uid() = id
*/

-- Drop all existing policies on user_profiles table
DROP POLICY IF EXISTS "user_profiles_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;

-- Create new policies with correct auth.uid() function
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;