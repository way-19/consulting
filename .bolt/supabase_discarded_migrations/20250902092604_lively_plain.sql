/*
  # Comprehensive RLS Reset for user_profiles

  This migration completely resets the RLS configuration for the user_profiles table
  to resolve persistent 403 permission errors.

  1. Security Changes
    - Disable RLS temporarily
    - Drop all existing policies
    - Re-enable RLS with fresh policies
    - Create simple, working policies for authenticated users

  2. Policy Details
    - Allow authenticated users to read their own profile
    - Allow authenticated users to update their own profile
    - Allow users to insert their own profile during registration
*/

-- Disable RLS temporarily
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON user_profiles';
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, working policies
CREATE POLICY "users_select_own_profile" ON user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "users_insert_own_profile" ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);