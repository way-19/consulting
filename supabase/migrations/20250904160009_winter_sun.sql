/*
  # Comprehensive user_profiles RLS Policy Fix

  1. Security Changes
    - Revoke all permissions from public role
    - Drop all existing conflicting policies
    - Create clean RLS policies for authenticated users only

  2. Policies Created
    - `user_profiles_select_own` - Users can read their own profile
    - `user_profiles_insert_own` - Users can create their own profile  
    - `user_profiles_update_own` - Users can update their own profile

  3. Important Notes
    - Only authenticated users can access user_profiles
    - Users can only access their own data (auth.uid() = id)
    - No public access allowed for security
*/

-- Step 1: Revoke all permissions from public role
REVOKE ALL ON user_profiles FROM public;
REVOKE ALL ON user_profiles FROM anon;

-- Step 2: Drop all existing policies (handling potential naming conflicts)
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own data" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_select_own" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_select_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "read_own_profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;

-- Step 3: Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create clean new policies for authenticated users only
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