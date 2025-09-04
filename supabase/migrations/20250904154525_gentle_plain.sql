/*
  # Fix user_profiles RLS policies

  This migration completely resets the RLS policies for the user_profiles table
  to fix the permission denied error when authenticated users try to access their profiles.

  1. Security
    - Drop all existing policies that may be causing conflicts
    - Create simple, clear policies for authenticated users
    - Ensure users can only access their own profile data

  2. Changes
    - Remove all existing RLS policies on user_profiles
    - Create new SELECT policy for authenticated users
    - Create new INSERT policy for profile creation
    - Create new UPDATE policy for profile updates
*/

-- Drop all existing policies on user_profiles table
DROP POLICY IF EXISTS "authenticated_users_can_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_can_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_can_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "Enable read access for users based on user_id"
ON user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
ON user_profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id"
ON user_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);