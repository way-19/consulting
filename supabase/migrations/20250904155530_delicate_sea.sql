/*
  # Fix user_profiles RLS policies using correct auth.uid() function
  
  1. Security
    - Drop all existing policies to avoid conflicts
    - Create new policies using auth.uid() function
    - Allow authenticated users to access their own profile data
    
  2. Policies Created
    - authenticated_users_can_select_own: Users can read their own profile
    - authenticated_users_can_insert_own: Users can create their own profile
    - authenticated_users_can_update_own: Users can update their own profile
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "user_profiles_select_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_select_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own data" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own data" ON user_profiles;

-- Create new policies using correct auth.uid() function
CREATE POLICY "authenticated_users_can_select_own"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "authenticated_users_can_insert_own"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "authenticated_users_can_update_own"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);