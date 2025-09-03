/*
  # Fix user_profiles RLS policy for authentication

  1. Security Updates
    - Drop existing restrictive policies on user_profiles table
    - Add new policy allowing users to read their own profile data
    - Ensure authenticated users can access their profile after login

  2. Changes
    - Remove overly restrictive policies that prevent profile access
    - Add proper policy for users to read their own data using auth.uid()
    - Maintain security while enabling proper authentication flow
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Authenticated users can read active profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create new policy allowing users to read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create policy allowing users to update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policy allowing users to insert their own profile (for registration)
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);