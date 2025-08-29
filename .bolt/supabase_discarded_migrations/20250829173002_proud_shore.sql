```sql
-- Drop existing policies for 'services' table if they exist
DROP POLICY IF EXISTS "Enable all for consultant's own services" ON public.services;
DROP POLICY IF EXISTS "Enable public read for active services" ON public.services;
DROP POLICY IF EXISTS "Enable read for public services" ON public.services;

-- Recreate policies for 'services' table
CREATE POLICY "Enable public read for active services"
ON public.services FOR SELECT
TO anon, authenticated
USING ((is_public = TRUE) AND (is_active = TRUE));

CREATE POLICY "Enable all for consultant's own services"
ON public.services FOR ALL
TO authenticated
USING (uid() = consultant_id)
WITH CHECK (uid() = consultant_id);

-- Drop existing policies for 'user_profiles' table if they exist
DROP POLICY IF EXISTS "Allow authenticated read for consultant profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable public read for consultant profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "users_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "users_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "users_update_own" ON public.user_profiles;

-- Recreate policies for 'user_profiles' table
CREATE POLICY "Enable public read for consultant profiles"
ON public.user_profiles FOR SELECT
TO anon, authenticated
USING ((role = 'consultant'::user_role) AND (is_active = TRUE));

CREATE POLICY "users_insert_own"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (uid() = id);

CREATE POLICY "users_select_own"
ON public.user_profiles FOR SELECT
TO authenticated
USING (uid() = id);

CREATE POLICY "users_update_own"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (uid() = id)
WITH CHECK (uid() = id);
```