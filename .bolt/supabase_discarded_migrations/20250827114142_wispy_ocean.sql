/*
  # Clean User Profiles Setup

  1. Clean Setup
    - Drop and recreate user_profiles policies cleanly
    - Create user profiles for existing auth users
    - Set up proper RLS without recursion

  2. Sample Data
    - Add Georgia country
    - Create basic consultant-client relationships

  3. Security
    - Simple RLS policies without self-references
    - Direct auth.uid() checks only
*/

-- Clean up any existing policies on user_profiles
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert access for authenticated users to their own profi" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update access for authenticated users to their own profi" ON public.user_profiles;
DROP POLICY IF EXISTS "users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "users can select own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "admin can read all profiles" ON public.user_profiles;

-- Ensure RLS is enabled
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "users_select_own_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "users_insert_own_profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY "users_update_own_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Insert user profiles for existing auth users (if they don't exist)
INSERT INTO public.user_profiles (id, email, full_name, role, country, language)
VALUES 
  ('003fa4ec-2d0d-4f65-a053-7ceff0c59cc3', 'admin@consulting19.com', 'Admin User', 'admin', 'United States', 'en'),
  ('226c80f3-e1c3-416b-8289-e2929942b2e1', 'giorgi.meskhi@consulting19.com', 'Giorgi Meskhi', 'consultant', 'Georgia', 'en'),
  ('acb59967-6310-4460-af72-5693f921bc5f', 'client@consulting19.com', 'Test Client', 'client', 'United States', 'en')
ON CONFLICT (id) DO NOTHING;

-- Add Georgia country if it doesn't exist
INSERT INTO public.countries (name, code, flag_emoji, description, tax_rate, business_advantages, consultant_id, featured, is_active)
VALUES (
  'Georgia',
  'GE', 
  '🇬🇪',
  'Georgia offers one of the world''s most attractive small business tax regimes with just 1% tax rate for qualifying businesses.',
  1.0,
  ARRAY['1% small business tax', 'Simple incorporation process', 'Strategic location', 'Low bureaucracy'],
  '226c80f3-e1c3-416b-8289-e2929942b2e1',
  true,
  true
)
ON CONFLICT (code) DO UPDATE SET
  consultant_id = EXCLUDED.consultant_id,
  featured = EXCLUDED.featured;