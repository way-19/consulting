/*
  # Fix user_profiles RLS policies

  1. Security Changes
    - Drop existing problematic policies
    - Create new policies that properly allow users to read their own profile
    - Ensure authenticated users can access their own data using auth.uid()
  
  2. Policy Details
    - Allow users to read their own profile data
    - Allow users to update their own profile data
    - Allow users to insert their own profile data
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can read active profiles" ON user_profiles;

-- Create new policies with proper permissions
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);