/*
  # Fix user_profiles RLS policies

  1. Security Changes
    - Drop all existing policies on user_profiles table
    - Create new policies that properly match authenticated users with their profile data
    - Ensure auth.uid() correctly matches the profile id

  2. Policy Details
    - Allow authenticated users to read their own profile (auth.uid() = id)
    - Allow authenticated users to update their own profile (auth.uid() = id)
    - Allow authenticated users to insert their own profile (auth.uid() = id)
*/

-- Drop all existing policies on user_profiles
DROP POLICY IF EXISTS "Authenticated users can read active profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "Enable read access for users to their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update access for users to their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable insert access for users to their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);