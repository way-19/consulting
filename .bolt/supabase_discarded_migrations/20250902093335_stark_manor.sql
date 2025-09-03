/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - RLS policies on user_profiles table are causing infinite recursion (error 42P17)
    - This happens when policies reference themselves or create circular dependencies

  2. Solution
    - Drop ALL existing policies on user_profiles table
    - Create simple, non-recursive policies that directly check auth.uid()
    - Avoid any policy logic that could create loops

  3. New Policies
    - Simple read policy: users can read their own profile
    - Simple update policy: users can update their own profile
    - Simple insert policy: users can insert their own profile
*/

-- Drop all existing policies on user_profiles to eliminate recursion
DROP POLICY IF EXISTS "Enable insert access for users to their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable update access for users to their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_read_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "user_profiles_select_own"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "user_profiles_insert_own"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "user_profiles_update_own"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);