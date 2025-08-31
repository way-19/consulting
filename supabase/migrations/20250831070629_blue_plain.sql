```sql
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

-- 1) Reapply RLS policies for clients table
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies (if any from previous migrations)
DROP POLICY IF EXISTS "clients_select_own" ON public.clients;
DROP POLICY IF EXISTS "clients_insert_own" ON public.clients;
DROP POLICY IF EXISTS "clients_update_own" ON public.clients;
DROP POLICY IF EXISTS "consultants_read_assigned_clients" ON public.clients;
DROP POLICY IF EXISTS "consultants_update_assigned_clients" ON public.clients;
DROP POLICY IF EXISTS "admin_manage_all_clients" ON public.clients;

-- Clients table policies
CREATE POLICY "clients_select_own" ON public.clients
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "clients_insert_own" ON public.clients
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "clients_update_own" ON public.clients
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "consultants_read_assigned_clients" ON public.clients
  FOR SELECT TO authenticated
  USING (assigned_consultant_id = auth.uid());

CREATE POLICY "consultants_update_assigned_clients" ON public.clients
  FOR UPDATE TO authenticated
  USING (assigned_consultant_id = auth.uid())
  WITH CHECK (assigned_consultant_id = auth.uid());

CREATE POLICY "admin_manage_all_clients" ON public.clients
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- 2) Reapply RLS policies for document_requests table
ALTER TABLE public.document_requests ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies
DROP POLICY IF EXISTS "consultants_manage_requests" ON public.document_requests;
DROP POLICY IF EXISTS "clients_read_own_requests" ON public.document_requests;

-- Document requests policies
CREATE POLICY "consultants_manage_requests" ON public.document_requests
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "clients_read_own_requests" ON public.document_requests
  FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- 3) Reapply RLS policies for projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Clean up existing policies
DROP POLICY IF EXISTS "project_participants_read" ON public.projects;
DROP POLICY IF EXISTS "consultants_manage_projects" ON public.projects;

-- Projects policies
CREATE POLICY "project_participants_read" ON public.projects
  FOR SELECT TO authenticated
  USING (
    client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()) OR
    consultant_id = auth.uid()
  );

CREATE POLICY "consultants_manage_projects" ON public.projects
  FOR ALL TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());
```