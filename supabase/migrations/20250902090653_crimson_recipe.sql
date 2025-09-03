/*
  # Fix user_profiles RLS policies

  1. Security Updates
    - Drop existing conflicting policies
    - Create new policies with proper permissions
    - Ensure users can read and update their own profiles
    - Allow profile creation during signup

  2. Policy Changes
    - Users can read their own profile data
    - Users can update their own profile
    - Users can insert their own profile during signup
    - Remove conflicting policies first
*/

-- Drop existing policies that might be causing conflicts
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

-- Allow reading active profiles for general platform functionality
CREATE POLICY "Authenticated users can read active profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (is_active = true);