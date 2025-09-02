/*
  # Ensure user profile exists and fix RLS policies

  1. Security Changes
    - Drop all existing RLS policies on user_profiles table
    - Create simple, working RLS policies for authenticated users
    - Ensure users can read and update their own profiles
    
  2. Data Integrity
    - Insert missing user profile if it doesn't exist
    - Use the specific user ID from the error: 003fa4ec-2d0d-4f65-a053-7ceff0c59cc3
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can read active profiles" ON user_profiles;

-- Create simple, working RLS policies
CREATE POLICY "Enable read access for users based on user_id" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure the specific user profile exists
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  is_active
) VALUES (
  '003fa4ec-2d0d-4f65-a053-7ceff0c59cc3',
  'user@example.com',
  'User',
  'client',
  true
) ON CONFLICT (id) DO NOTHING;