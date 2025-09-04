/*
  # Fix user_profiles RLS policies with correct authentication

  1. Issues Fixed
    - Replace `uid()` with `auth.uid()` in policy conditions
    - Change role from `public` to `authenticated` for proper authentication
    - Ensure policies allow authenticated users to access their own data

  2. New Policies
    - SELECT: Allow authenticated users to read their own profile
    - INSERT: Allow authenticated users to create their own profile  
    - UPDATE: Allow authenticated users to update their own profile

  3. Security
    - All policies use `auth.uid() = id` to ensure users can only access their own data
    - Policies target `authenticated` role specifically
*/

-- Drop all existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile" ON user_profiles;

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies with correct auth.uid() syntax
CREATE POLICY "authenticated_users_select_own_profile" 
  ON user_profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "authenticated_users_insert_own_profile" 
  ON user_profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "authenticated_users_update_own_profile" 
  ON user_profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);