/*
  # Fix infinite recursion in user_profiles RLS policies

  1. Problem
    - RLS policies on user_profiles table are causing infinite recursion
    - This happens when policies contain subqueries that reference the same table

  2. Solution
    - Drop all existing problematic policies
    - Create simple policies that only use auth.uid() = id comparison
    - No subqueries, no self-references, no EXISTS clauses on same table

  3. Security
    - Users can only see and update their own profile
    - Simple and secure without recursion
*/

-- Drop all existing policies that might cause recursion
DROP POLICY IF EXISTS "user_profiles self select" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles read" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles select" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users to their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert access for authenticated users to their own profi" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update access for authenticated users to their own profi" ON public.user_profiles;
DROP POLICY IF EXISTS "users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "admin can read all profiles" ON public.user_profiles;

-- Ensure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "users can select own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING ( id = auth.uid() );

CREATE POLICY "users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING ( id = auth.uid() )
WITH CHECK ( id = auth.uid() );

CREATE POLICY "users can insert own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK ( id = auth.uid() );