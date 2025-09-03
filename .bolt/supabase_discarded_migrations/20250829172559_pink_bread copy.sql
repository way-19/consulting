/*
  # Fix User Profiles Table RLS Permissions

  1. Security Updates
    - Ensure RLS is enabled on user_profiles table
    - Add safe policy creation for consultant profile visibility
    - Maintain existing user policies

  2. Changes
    - Enable public read for consultant profiles (for service pages)
    - Use DROP IF EXISTS pattern to avoid conflicts
*/

-- Enable RLS on user_profiles table (safe operation)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing public read policy if it exists
DROP POLICY IF EXISTS "Enable public read for consultant profiles" ON user_profiles;

-- Create policy for public read access to consultant profiles
CREATE POLICY "Enable public read for consultant profiles"
  ON user_profiles
  FOR SELECT
  TO anon, authenticated
  USING (role = 'consultant' AND is_active = true);