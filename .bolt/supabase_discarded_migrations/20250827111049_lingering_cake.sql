/*
  # Fix RLS policies to use auth.uid()

  1. Security Updates
    - Drop existing policies that use uid() function
    - Create new policies using auth.uid() function
    - Enable proper access for authenticated users to their own profiles

  2. Policy Changes
    - SELECT: Users can read their own profile using auth.uid()
    - INSERT: Users can create their own profile using auth.uid()
    - UPDATE: Users can update their own profile using auth.uid()
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create correct policies using auth.uid()
CREATE POLICY "Enable read access for authenticated users to their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable insert access for authenticated users to their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update access for authenticated users to their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);