```sql
-- Set the search path to include the auth schema for the current session
SET search_path = public, auth;

-- Drop existing policies to avoid conflicts and ensure clean re-creation
DROP POLICY IF EXISTS "Enable insert access for users to their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update access for users to their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_read_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;

-- Re-create RLS policies using auth.uid()
-- Policy to allow authenticated users to select their own profile
CREATE POLICY "Users can view their own profile."
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy to allow authenticated users to update their own profile
CREATE POLICY "Users can update their own profile."
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policy to allow authenticated users to insert their own profile (during signup)
CREATE POLICY "Users can insert their own profile."
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy to allow admins to update any profile
CREATE POLICY "Admins can update any profile"
  ON public.user_profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy to allow admins to insert any profile
CREATE POLICY "Admins can insert any profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy to allow admins to delete any profile
CREATE POLICY "Admins can delete any profile"
  ON public.user_profiles FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));
```