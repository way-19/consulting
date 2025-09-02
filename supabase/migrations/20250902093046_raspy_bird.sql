```diff
--- a/supabase/migrations/comprehensive_rls_reset.sql
+++ b/supabase/migrations/comprehensive_rls_reset.sql
@@ -1,16 +1,14 @@
-```sql
 -- Disable RLS temporarily to drop all policies
 ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
 
 -- Drop all existing RLS policies on user_profiles table
-DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON public.user_profiles;
-DROP POLICY IF EXISTS "Enable update access for users to their own profile" ON public.user_profiles;
-DROP POLICY IF EXISTS "user_profiles_read_own" ON public.user_profiles;
-DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
-DROP POLICY IF EXISTS "Enable insert access for users to their own profile" ON public.user_profiles;
-DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.user_profiles;
-DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles;
+DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON public.user_profiles; -- Existing policy
+DROP POLICY IF EXISTS "Enable update access for users to their own profile" ON public.user_profiles; -- Existing policy
+DROP POLICY IF EXISTS "user_profiles_read_own" ON public.user_profiles; -- Existing policy
+DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles; -- Existing policy
+DROP POLICY IF EXISTS "Enable insert access for users to their own profile" ON public.user_profiles; -- Existing policy
+DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.user_profiles; -- Existing policy
+DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.user_profiles; -- Existing policy
 
 -- Enable RLS
 ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
@@ -27,4 +25,3 @@
   USING (auth.uid() = id);
 
 -- Grant SELECT, INSERT, UPDATE permissions to authenticated users
-```
\ No newline at end of file
+```