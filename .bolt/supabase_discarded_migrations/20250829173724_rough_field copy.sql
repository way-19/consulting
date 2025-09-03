/*
  # Fix Services and User Profiles RLS and Grants

  1. Grant Permissions
    - Grant SELECT on services to anon and authenticated roles
    - Grant SELECT on user_profiles to anon and authenticated roles

  2. Fix RLS Policies
    - Drop existing policies that use uid() instead of auth.uid()
    - Create new policies with correct auth.uid() function
    - Enable public read for services (is_public = true AND is_active = true)
    - Enable public read for consultant profiles (role = 'consultant' AND is_active = true)

  3. Security
    - Maintain RLS on both tables
    - Ensure proper access controls for authenticated users
*/

-- Grant necessary permissions to anon and authenticated roles
GRANT SELECT ON public.services TO anon, authenticated;
GRANT SELECT ON public.user_profiles TO anon, authenticated;

-- Drop all existing policies for services table
DROP POLICY IF EXISTS "Enable all for consultant's own services" ON public.services;
DROP POLICY IF EXISTS "Enable public read for active services" ON public.services;
DROP POLICY IF EXISTS "Enable read for public services" ON public.services;
DROP POLICY IF EXISTS "consultants_can_manage_own_services" ON public.services;
DROP POLICY IF EXISTS "public_can_read_active_services" ON public.services;

-- Drop all existing policies for user_profiles table
DROP POLICY IF EXISTS "Allow authenticated read for consultant profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable public read for consultant profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "users_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "users_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "users_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "public_can_read_consultant_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_manage_own_profile" ON public.user_profiles;

-- Ensure RLS is enabled
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create new policies for services table
CREATE POLICY "public_can_read_active_services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true AND is_active = true);

CREATE POLICY "consultants_can_manage_own_services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

-- Create new policies for user_profiles table
CREATE POLICY "public_can_read_consultant_profiles"
  ON public.user_profiles
  FOR SELECT
  TO anon, authenticated
  USING (role = 'consultant'::user_role AND is_active = true);

CREATE POLICY "users_can_manage_own_profile"
  ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);