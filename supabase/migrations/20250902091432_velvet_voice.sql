/*
  # Fix RLS Policy Conflict for user_profiles

  1. Security Changes
    - Drop existing conflicting policy
    - Create new working policy for user profile access
  
  2. User Profile Creation
    - Ensure the specific user profile exists for the failing user ID
*/

-- Drop the existing conflicting policy
DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON user_profiles;

-- Drop any other existing policies that might conflict
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Authenticated users can read active profiles" ON user_profiles;

-- Create a simple, working policy
CREATE POLICY "users_can_read_own_profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Ensure the specific user profile exists
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  is_active
) VALUES (
  '003fa4ec-2d0d-4f65-a053-7ceff0c59cc3',
  'client@consulting19.com',
  'Test Client',
  'client',
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;