/*
  # Fix RLS Policies and Notifications System

  1. Helper Function
    - Create admin check function for reusable admin verification
    - Security definer with proper permissions

  2. Clients Table RLS Fix
    - Fix 403 permission denied errors
    - Proper role-based access control
    - Performance indexes

  3. Notifications System Fix
    - Add missing foreign key constraints
    - Fix embed relationships for PostgREST
    - Comprehensive RLS policies
    - User profile access for notification actors
*/

-- 0) Helper function for admin checks (idempotent)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 1) Fix clients table RLS policies (resolves 403 errors)

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies
DROP POLICY IF EXISTS "admin read clients" ON public.clients;
DROP POLICY IF EXISTS "consultant read assigned clients" ON public.clients;
DROP POLICY IF EXISTS "client read own client row" ON public.clients;
DROP POLICY IF EXISTS "clients_select_own" ON public.clients;
DROP POLICY IF EXISTS "clients_insert_own" ON public.clients;
DROP POLICY IF EXISTS "clients_update_own" ON public.clients;
DROP POLICY IF EXISTS "consultants_read_assigned_clients" ON public.clients;
DROP POLICY IF EXISTS "consultants_update_assigned_clients" ON public.clients;
DROP POLICY IF EXISTS "admin_manage_all_clients" ON public.clients;

-- 1) Admin can read everything
CREATE POLICY "admin read clients"
ON public.clients
FOR SELECT TO authenticated
USING (public.is_admin());

-- 2) Consultant can read only assigned clients
CREATE POLICY "consultant read assigned clients"
ON public.clients
FOR SELECT TO authenticated
USING (assigned_consultant_id = auth.uid());

-- 3) Client can read own client record
CREATE POLICY "client read own client row"
ON public.clients
FOR SELECT TO authenticated
USING (profile_id = auth.uid());

-- Basic grants (RLS still applies)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.clients TO authenticated;

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_clients_assigned_consultant ON public.clients(assigned_consultant_id);
CREATE INDEX IF NOT EXISTS idx_clients_profile ON public.clients(profile_id);

-- 2) Fix notifications system (resolves PGRST200 and embed issues)

-- Add required columns if they don't exist
ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS actor_profile_id uuid,
  ADD COLUMN IF NOT EXISTS recipient_profile_id uuid,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Update existing data if needed
UPDATE public.notifications 
SET recipient_profile_id = recipient_id 
WHERE recipient_profile_id IS NULL AND recipient_id IS NOT NULL;

UPDATE public.notifications 
SET actor_profile_id = sender_id 
WHERE actor_profile_id IS NULL AND sender_id IS NOT NULL;

-- Add foreign key constraints with exact names PostgREST expects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'notifications_actor_profile_id_fkey'
      AND conrelid = 'public.notifications'::regclass
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_actor_profile_id_fkey
      FOREIGN KEY (actor_profile_id)
      REFERENCES public.user_profiles(id)
      ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'notifications_recipient_profile_id_fkey'
      AND conrelid = 'public.notifications'::regclass
  ) THEN
    ALTER TABLE public.notifications
      ADD CONSTRAINT notifications_recipient_profile_id_fkey
      FOREIGN KEY (recipient_profile_id)
      REFERENCES public.user_profiles(id)
      ON DELETE CASCADE;
  END IF;
END$$;

-- Performance indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_actor ON public.notifications(actor_profile_id);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Clean up existing notification policies
DROP POLICY IF EXISTS "recipient can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "admin read all notifications" ON public.notifications;
DROP POLICY IF EXISTS "actor/admin can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "users_read_own_notifications" ON public.notifications;
DROP POLICY IF EXISTS "users_update_own_notifications" ON public.notifications;
DROP POLICY IF EXISTS "system_send_notifications" ON public.notifications;

-- 1) Recipient can read own notifications
CREATE POLICY "recipient can read own notifications"
ON public.notifications
FOR SELECT TO authenticated
USING (recipient_profile_id = auth.uid());

-- 2) Admin can read all notifications
CREATE POLICY "admin read all notifications"
ON public.notifications
FOR SELECT TO authenticated
USING (public.is_admin());

-- 3) Actor or admin can insert notifications
CREATE POLICY "actor/admin can insert notifications"
ON public.notifications
FOR INSERT TO authenticated
WITH CHECK (actor_profile_id = auth.uid() OR public.is_admin());

-- 4) Users can update their own notifications (mark as read)
CREATE POLICY "users can update own notifications"
ON public.notifications
FOR UPDATE TO authenticated
USING (recipient_profile_id = auth.uid())
WITH CHECK (recipient_profile_id = auth.uid());

GRANT SELECT, INSERT ON public.notifications TO authenticated;
GRANT UPDATE ON public.notifications TO authenticated;

-- Fix user_profiles for notification embeds

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Clean up existing user profile policies
DROP POLICY IF EXISTS "admin read all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "user read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "recipient can read actor profile for notifications" ON public.user_profiles;
DROP POLICY IF EXISTS "users_can_read_basic_profile_info" ON public.user_profiles;
DROP POLICY IF EXISTS "users_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "users_update_own" ON public.user_profiles;

-- 1) Admin can read all profiles
CREATE POLICY "admin read all profiles"
ON public.user_profiles
FOR SELECT TO authenticated
USING (public.is_admin());

-- 2) User can read own profile
CREATE POLICY "user read own profile"
ON public.user_profiles
FOR SELECT TO authenticated
USING (id = auth.uid());

-- 3) Notification recipient can read actor profile (for embeds)
CREATE POLICY "recipient can read actor profile for notifications"
ON public.user_profiles
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.notifications n
    WHERE n.actor_profile_id = user_profiles.id
      AND n.recipient_profile_id = auth.uid()
  )
);

-- 4) Users can insert their own profile
CREATE POLICY "users can insert own profile"
ON public.user_profiles
FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

-- 5) Users can update their own profile
CREATE POLICY "users can update own profile"
ON public.user_profiles
FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

GRANT SELECT ON public.user_profiles TO authenticated;
GRANT INSERT, UPDATE ON public.user_profiles TO authenticated;