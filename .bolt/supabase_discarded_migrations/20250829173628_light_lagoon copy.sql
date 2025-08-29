```sql
-- Grant SELECT permission to the anon role on the services table
GRANT SELECT ON public.services TO anon;

-- Ensure RLS is enabled for services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for services to ensure a clean slate
DROP POLICY IF EXISTS "Enable all for consultant's own services" ON public.services;
DROP POLICY IF EXISTS "Enable public read for active services" ON public.services;
DROP POLICY IF EXISTS "Enable read for public services" ON public.services;

-- Recreate policies for services
CREATE POLICY "Enable public read for active services"
ON public.services
FOR SELECT
TO anon, authenticated
USING (is_public = TRUE AND is_active = TRUE);

CREATE POLICY "Enable all for consultant's own services"
ON public.services
FOR ALL
TO authenticated
USING (consultant_id = auth.uid())
WITH CHECK (consultant_id = auth.uid());

-- Grant SELECT permission to the anon role on the user_profiles table
GRANT SELECT ON public.user_profiles TO anon;

-- Ensure RLS is enabled for user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for user_profiles to ensure a clean slate
DROP POLICY IF EXISTS "Allow authenticated read for consultant profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable public read for consultant profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "users_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "users_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "users_update_own" ON public.user_profiles;

-- Recreate policies for user_profiles
CREATE POLICY "Enable public read for consultant profiles"
ON public.user_profiles
FOR SELECT
TO anon, authenticated
USING (role = 'consultant'::user_role AND is_active = TRUE);

CREATE POLICY "users_insert_own"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "users_select_own"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "users_update_own"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());
```