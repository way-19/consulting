/*
  # Fix RLS Policies for Consultant Dashboard

  1. Security
    - Enable RLS on all tables
    - Create policies for consultant access to their own data
    - Ensure proper authentication checks

  2. Tables
    - projects: consultants can see their assigned projects
    - transactions: consultants can see their earnings
    - user_profiles: users can see their own profile
*/

-- Enable RLS on all tables (if not already enabled)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "consultant can select own projects" ON public.projects;
DROP POLICY IF EXISTS "consultant sees own transactions" ON public.transactions;
DROP POLICY IF EXISTS "users can read own profile" ON public.user_profiles;

-- Projects table policies
-- Consultants can see projects assigned to them
CREATE POLICY "consultant can select own projects"
ON public.projects
FOR SELECT
TO authenticated
USING (consultant_id = auth.uid());

-- Clients can see their own projects
CREATE POLICY "client can select own projects"
ON public.projects
FOR SELECT
TO authenticated
USING (client_id = auth.uid());

-- Transactions table policies
-- Consultants can see their own transactions
CREATE POLICY "consultant sees own transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (consultant_id = auth.uid());

-- Clients can see their own transactions
CREATE POLICY "client sees own transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (client_id = auth.uid());

-- User profiles policies
-- Users can read their own profile
CREATE POLICY "users can read own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Users can insert their own profile
CREATE POLICY "users can insert own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.projects TO anon, authenticated;
GRANT SELECT ON public.transactions TO anon, authenticated;
GRANT SELECT ON public.user_profiles TO anon, authenticated;
GRANT INSERT ON public.user_profiles TO authenticated;
GRANT UPDATE ON public.user_profiles TO authenticated;