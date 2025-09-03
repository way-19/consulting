/*
  # Fix RLS Policies for user_profiles table

  This migration completely removes all existing policies and creates simple, 
  non-recursive policies to prevent infinite recursion errors.

  1. Drop all existing policies
  2. Create simple policies using only auth.uid()
  3. Ensure no policy references the user_profiles table itself
*/

-- Drop all existing policies on user_profiles table
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Allow users to read their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verify the policies are created correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_profiles';