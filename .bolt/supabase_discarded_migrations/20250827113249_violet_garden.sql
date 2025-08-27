/*
  # Create user profiles and consultant-admin relationships

  1. User Profiles
    - Create profiles for existing auth users
    - Set correct roles based on email addresses
    
  2. Sample Data
    - Create consultant-client relationships
    - Add sample projects and transactions
    
  3. Admin Oversight
    - Link consultant to admin for management
*/

-- First, create user profiles for existing auth users
INSERT INTO public.user_profiles (id, email, full_name, role, country, language, phone, company, bio, is_active, created_at, updated_at)
VALUES 
  -- Admin user
  ('003fa4ec-2d0d-4f65-a053-7ceff0c59cc3', 'admin@consulting19.com', 'Alexandra Chen', 'admin', 'United States', 'en', '+1-555-0101', 'Consulting19 Inc.', 'Founder & CEO with 15+ years in international business consulting', true, now(), now()),
  
  -- Consultant user (Georgia specialist)
  ('226c80f3-e1c3-416b-8289-e2929942b2e1', 'giorgi.meskhi@consulting19.com', 'Giorgi Meskhi', 'consultant', 'Georgia', 'en', '+995-555-0102', 'Georgia Business Solutions', 'Georgia business formation specialist with expertise in small business tax status and company registration', true, now(), now()),
  
  -- Client user
  ('acb59967-6310-4460-af72-5693f921bc5f', 'client@consulting19.com', 'Sarah Chen', 'client', 'Singapore', 'en', '+65-555-0103', 'TechStart Inc.', 'Tech entrepreneur looking to expand internationally', true, now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  country = EXCLUDED.country,
  updated_at = now();

-- Create Georgia country entry if it doesn't exist
INSERT INTO public.countries (id, name, code, flag_emoji, description, tax_rate, business_advantages, consultant_id, featured, is_active, created_at)
VALUES 
  (gen_random_uuid(), 'Georgia', 'GE', '🇬🇪', 'Georgia offers one of the world''s most attractive small business tax regimes with just 1% tax rate for qualifying businesses.', 1.0, 
   ARRAY['1% small business tax rate', 'Simple incorporation process', 'Strategic location between Europe and Asia', 'Low bureaucracy', 'Fast business registration'], 
   '226c80f3-e1c3-416b-8289-e2929942b2e1', true, true, now())
ON CONFLICT (code) DO UPDATE SET
  consultant_id = '226c80f3-e1c3-416b-8289-e2929942b2e1',
  updated_at = now();

-- Get Georgia country ID for projects
DO $$
DECLARE
    georgia_id uuid;
BEGIN
    SELECT id INTO georgia_id FROM public.countries WHERE code = 'GE' LIMIT 1;
    
    -- Create sample project
    INSERT INTO public.projects (id, client_id, consultant_id, country_id, title, description, status, progress, total_amount, platform_commission, consultant_earnings, due_date, created_at, updated_at)
    VALUES 
      (gen_random_uuid(), 'acb59967-6310-4460-af72-5693f921bc5f', '226c80f3-e1c3-416b-8289-e2929942b2e1', georgia_id, 
       'TechStart Inc. - Georgia LLC Formation', 
       'Complete business registration in Georgia including small business status application, bank account setup, and tax optimization consultation.',
       'in_progress', 65, 2500.00, 875.00, 1625.00, '2025-02-15', now(), now())
    ON CONFLICT DO NOTHING;
    
    -- Create sample service
    INSERT INTO public.services (id, consultant_id, country_id, title, description, price, is_recurring, billing_period, is_public, is_active, created_at, updated_at)
    VALUES 
      (gen_random_uuid(), '226c80f3-e1c3-416b-8289-e2929942b2e1', georgia_id,
       'Georgia Small Business Registration',
       'Complete Georgia LLC formation with small business status (1% tax rate) including all required documentation and government filings.',
       1500.00, false, null, true, true, now(), now())
    ON CONFLICT DO NOTHING;
    
    -- Create sample transaction
    INSERT INTO public.transactions (id, project_id, service_id, client_id, consultant_id, amount, platform_commission, consultant_earnings, status, processed_at, created_at)
    SELECT gen_random_uuid(), p.id, s.id, 'acb59967-6310-4460-af72-5693f921bc5f', '226c80f3-e1c3-416b-8289-e2929942b2e1', 
           1500.00, 525.00, 975.00, 'completed', now(), now()
    FROM public.projects p, public.services s 
    WHERE p.consultant_id = '226c80f3-e1c3-416b-8289-e2929942b2e1' 
      AND s.consultant_id = '226c80f3-e1c3-416b-8289-e2929942b2e1'
    LIMIT 1
    ON CONFLICT DO NOTHING;
END $$;

-- Create sample document
INSERT INTO public.documents (id, project_id, uploader_id, file_name, file_path, file_size, mime_type, document_type, description, is_confidential, created_at)
SELECT gen_random_uuid(), p.id, 'acb59967-6310-4460-af72-5693f921bc5f', 
       'passport_copy.pdf', '/documents/client/passport_copy.pdf', 2048576, 'application/pdf', 
       'identity', 'Passport copy for business registration', true, now()
FROM public.projects p 
WHERE p.client_id = 'acb59967-6310-4460-af72-5693f921bc5f'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Update RLS policies to ensure proper access
DROP POLICY IF EXISTS "Enable read for authenticated users to their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert access for authenticated users to their own profi" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update access for authenticated users to their own profi" ON public.user_profiles;

-- Create comprehensive user_profiles policies
CREATE POLICY "users can manage own profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin can see all profiles
CREATE POLICY "admin can see all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- Consultants can see their clients' profiles through projects
CREATE POLICY "consultant can see client profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.projects p 
    WHERE p.consultant_id = auth.uid() AND p.client_id = user_profiles.id
  )
);