/*
  # Fix user_profiles RLS policies - Drop and Recreate

  1. Drop Existing Policies
    - Remove all existing policies that may be causing conflicts
  
  2. Create Clean Policies
    - Simple authenticated user access to own profile data
    - Using correct auth.uid() function
    
  3. Security
    - Only authenticated users can access their own data
    - Proper JWT token validation through auth.uid()
*/

-- Drop all existing policies for user_profiles table
DROP POLICY IF EXISTS "authenticated_users_select_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON user_profiles;

-- Create clean, simple policies
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