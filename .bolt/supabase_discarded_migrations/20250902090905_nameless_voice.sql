/*
  # Fix user_profiles RLS policies

  This migration fixes the Row Level Security policies for the user_profiles table
  to allow authenticated users to read their own profile data.

  1. Security Changes
    - Drop all existing policies on user_profiles table
    - Create a simple policy allowing users to read their own profile using auth.uid()
    - Create a policy allowing users to update their own profile
*/

-- Drop all existing policies on user_profiles table
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can read active profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Create simple, working policies
CREATE POLICY "Enable read access for users based on user_id" 
ON user_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" 
ON user_profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Enable insert for users based on user_id" 
ON user_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);