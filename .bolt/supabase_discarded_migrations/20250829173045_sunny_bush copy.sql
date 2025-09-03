-- Remove markdown code block delimiters
DROP POLICY IF EXISTS "Allow authenticated read for consultant profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable public read for consultant profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "users_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "users_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "users_update_own" ON public.user_profiles;

CREATE POLICY "Allow authenticated read for consultant profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (((role = 'consultant'::user_role) AND (is_active = true)));

CREATE POLICY "Enable public read for consultant profiles"
ON public.user_profiles
FOR SELECT
USING (((role = 'consultant'::user_role) AND (is_active = true)));

CREATE POLICY "users_insert_own"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (uid() = id);

CREATE POLICY "users_select_own"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (uid() = id);

CREATE POLICY "users_update_own"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (uid() = id)
WITH CHECK (uid() = id);