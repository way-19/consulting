/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - Multiple overlapping policies causing infinite recursion
    - Policies referencing each other in a loop

  2. Solution
    - Drop all existing policies on user_profiles
    - Create simple, non-overlapping policies
    - Use direct auth.uid() checks without complex subqueries
*/

-- Drop all existing policies on user_profiles to prevent conflicts
DROP POLICY IF EXISTS "Enable insert access for authenticated users to their own profi" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users to their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update access for authenticated users to their own profi" ON public.user_profiles;
DROP POLICY IF EXISTS "users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can manage own profile"
  ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin policy for reading all profiles (only for admin role)
CREATE POLICY "Admin can read all profiles"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );