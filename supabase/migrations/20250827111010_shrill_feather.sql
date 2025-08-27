/*
  # Fix RLS policies for user_profiles table

  1. Security Updates
    - Drop existing problematic policies
    - Create proper RLS policies for user_profiles
    - Allow users to read and insert their own profiles
    - Allow users to update their own profiles

  2. Policy Details
    - SELECT: Users can read their own profile data
    - INSERT: Users can create their own profile during registration
    - UPDATE: Users can update their own profile information
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON user_profiles;

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create proper policies
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