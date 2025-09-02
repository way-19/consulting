/*
  # Fix user_profiles RLS policies

  1. Security Changes
    - Drop existing problematic policies on user_profiles table
    - Create new simplified policy for users to read their own profile
    - Create policy for users to update their own profile
    - Ensure proper access control using auth.uid()

  2. Notes
    - This fixes the permission denied error when users try to access their own profile
    - Uses auth.uid() function to match authenticated user with their profile
*/

-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can read active profiles" ON user_profiles;

-- Create new simplified policies
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

-- Allow users to insert their own profile (for signup process)
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);