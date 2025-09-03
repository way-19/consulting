/*
  # Complete RLS Reset for user_profiles

  This migration completely resets the RLS policies on the user_profiles table
  to fix the infinite recursion error (42P17).

  1. Security Changes
    - Disable RLS temporarily
    - Drop ALL existing policies
    - Re-enable RLS with clean, simple policies
    - Ensure no circular dependencies

  2. New Policies
    - Simple read policy: users can read their own profile
    - Simple update policy: users can update their own profile
    - Simple insert policy: users can insert their own profile
*/

-- Disable RLS temporarily to clean up
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to ensure clean slate
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_profiles', policy_record.policyname);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "users_select_own" ON user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "users_insert_own" ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);