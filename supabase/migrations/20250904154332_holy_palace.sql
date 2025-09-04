/*
# Fix infinite recursion in user_profiles RLS policies

1. Problem
   - The admin policy was causing infinite recursion by referencing user_profiles table within its own policy
   - This creates a loop where checking access requires querying the same table being protected

2. Solution  
   - Drop the problematic admin policy that references user_profiles within itself
   - Keep simple, non-recursive policies for user access
   - Admin access can be managed through Supabase dashboard or service role

3. Policies Kept
   - Users can read their own profile data
   - Users can update their own profile data  
   - Users can insert their own profile on signup
   - Public can read basic profile info (for public features)
*/

-- Drop all existing policies to clean slate
DROP POLICY IF EXISTS "admins_can_manage_all_profiles" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_can_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_can_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "authenticated_users_can_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "public_can_read_basic_profile_info" ON user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "users_can_read_own_profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow public read access for basic profile info (like display names for public features)
CREATE POLICY "public_can_read_basic_info"
  ON user_profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);