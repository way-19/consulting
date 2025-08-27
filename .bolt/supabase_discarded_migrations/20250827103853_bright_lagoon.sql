/*
  # Fix Infinite Recursion in User Profiles Policies

  1. Problem
    - RLS policies are causing infinite recursion
    - Policies are referencing the user_profiles table within themselves
    
  2. Solution
    - Remove all existing policies
    - Create simple policies that only use auth.uid()
    - Avoid any policy that queries user_profiles table
    
  3. Security
    - Users can only access their own profile
    - No role-based policies to avoid recursion
*/

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;

-- Disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
-- Users can read their own profile (no recursion - only uses auth.uid())
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile (no recursion - only uses auth.uid())
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (no recursion - only uses auth.uid())
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);