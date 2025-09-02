```sql
-- Disable RLS temporarily to drop existing policies
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be conflicting
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update access for users to their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert access for users to their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_read_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;

-- Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to read their own profile
CREATE POLICY "Enable read access for users to their own profile"
ON public.user_profiles FOR SELECT
TO authenticated
USING (uid() = id);

-- Policy to allow authenticated users to update their own profile
CREATE POLICY "Enable update access for users to their own profile"
ON public.user_profiles FOR UPDATE
TO authenticated
USING (uid() = id)
WITH CHECK (uid() = id);

-- Policy to allow authenticated users to insert their own profile (if needed, e.g., on new user signup)
-- This policy is often handled by a trigger or a separate function, but included for completeness if direct inserts are allowed.
CREATE POLICY "Enable insert access for users to their own profile"
ON public.user_profiles FOR INSERT
TO authenticated
WITH CHECK (uid() = id);
```