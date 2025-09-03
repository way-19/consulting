/*
  # Fix user_profiles RLS policies

  This migration fixes the RLS policies on user_profiles table to allow authenticated users
  to read their own profile data, resolving the 403 permission denied error.

  1. Security Changes
    - Drop all existing conflicting policies
    - Create simple, working policies for authenticated users
    - Allow users to read and update their own profiles
*/

-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can read active profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable update access for own profile" ON user_profiles;

-- Create new working policies with unique names
CREATE POLICY "user_profiles_read_own" 
  ON user_profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "user_profiles_update_own" 
  ON user_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;