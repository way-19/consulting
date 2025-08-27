/*
  # Fix RLS Policies for user_profiles and countries

  1. User Profiles
    - Drop all existing policies to eliminate infinite recursion
    - Create simple policies using only auth.uid() = id
    - No subqueries or self-references

  2. Countries Table
    - Add public read access policy
    - Countries are public information

  3. Security
    - Users can only access their own profile data
    - All users can read country information
*/

-- First, disable RLS temporarily to avoid conflicts
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on user_profiles to eliminate recursion
DROP POLICY IF EXISTS "Enable read access for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON user_profiles;
DROP POLICY IF EXISTS "users can select own profile" ON user_profiles;
DROP POLICY IF EXISTS "users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "admins can see all profiles" ON user_profiles;
DROP POLICY IF EXISTS "consultants can see client profiles" ON user_profiles;
DROP POLICY IF EXISTS "users can see consultant profiles" ON user_profiles;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies for user_profiles
CREATE POLICY "users_select_own" ON user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users_insert_own" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_own" ON user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Fix countries table permissions
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Enable read for all users" ON countries;
DROP POLICY IF EXISTS "Enable read access for all users" ON countries;

-- Create simple public read policy for countries
CREATE POLICY "countries_public_read" ON countries
  FOR SELECT TO authenticated
  USING (true);

-- Ensure RLS is enabled on countries
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;