/*
  # Create user profiles and sample data

  1. User Profiles
    - Create profiles for existing auth users
    - Set correct roles (admin, consultant, client)
  
  2. Sample Data
    - Georgia country entry
    - Sample projects and services
    - Sample transactions
  
  3. Security
    - Update RLS policies for proper access control
*/

-- Create user profiles for existing auth users
INSERT INTO user_profiles (id, email, full_name, role, country, language, is_active, created_at, updated_at)
VALUES 
  ('003fa4ec-2d0d-4f65-a053-7ceff0c59cc3', 'admin@consulting19.com', 'Admin User', 'admin', 'United States', 'en', true, now(), now()),
  ('226c80f3-e1c3-416b-8289-e2929942b2e1', 'giorgi.meskhi@consulting19.com', 'Giorgi Meskhi', 'consultant', 'Georgia', 'en', true, now(), now()),
  ('acb59967-6310-4460-af72-5693f921bc5f', 'client@consulting19.com', 'Test Client', 'client', 'United States', 'en', true, now(), now())
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  country = EXCLUDED.country,
  updated_at = now();

-- Insert Georgia country if not exists
INSERT INTO countries (id, name, code, flag_emoji, description, tax_rate, business_advantages, consultant_id, featured, is_active, created_at)
VALUES (
  gen_random_uuid(),
  'Georgia',
  'GE',
  '🇬🇪',
  'Georgia offers one of the world''s most attractive small business tax regimes with just 1% tax rate for qualifying businesses.',
  1.0,
  ARRAY['1% small business tax', 'Simple incorporation process', 'Strategic location between Europe and Asia', 'Low bureaucracy', 'Fast business registration'],
  '226c80f3-e1c3-416b-8289-e2929942b2e1',
  true,
  true,
  now()
)
ON CONFLICT (code) DO UPDATE SET
  consultant_id = '226c80f3-e1c3-416b-8289-e2929942b2e1';

-- Get Georgia country ID for sample data
DO $$
DECLARE
  georgia_id uuid;
BEGIN
  SELECT id INTO georgia_id FROM countries WHERE code = 'GE' LIMIT 1;
  
  -- Insert sample project
  INSERT INTO projects (id, client_id, consultant_id, country_id, title, description, status, progress, total_amount, platform_commission, consultant_earnings, due_date, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'acb59967-6310-4460-af72-5693f921bc5f',
    '226c80f3-e1c3-416b-8289-e2929942b2e1',
    georgia_id,
    'Georgia LLC Formation',
    'Complete business registration and tax optimization setup in Georgia',
    'in_progress',
    65,
    1500.00,
    525.00,
    975.00,
    '2025-02-15',
    now(),
    now()
  )
  ON CONFLICT DO NOTHING;
  
  -- Insert sample service
  INSERT INTO services (id, consultant_id, country_id, title, description, price, is_recurring, billing_period, is_public, is_active, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    '226c80f3-e1c3-416b-8289-e2929942b2e1',
    georgia_id,
    'Georgia Small Business Registration',
    'Complete company formation with small business status registration in Georgia',
    1200.00,
    false,
    null,
    true,
    true,
    now(),
    now()
  )
  ON CONFLICT DO NOTHING;
  
  -- Insert sample transaction
  INSERT INTO transactions (id, project_id, service_id, client_id, consultant_id, amount, platform_commission, consultant_earnings, status, processed_at, created_at)
  SELECT 
    gen_random_uuid(),
    p.id,
    s.id,
    'acb59967-6310-4460-af72-5693f921bc5f',
    '226c80f3-e1c3-416b-8289-e2929942b2e1',
    1200.00,
    420.00,
    780.00,
    'completed',
    now(),
    now()
  FROM projects p, services s 
  WHERE p.consultant_id = '226c80f3-e1c3-416b-8289-e2929942b2e1' 
    AND s.consultant_id = '226c80f3-e1c3-416b-8289-e2929942b2e1'
  LIMIT 1
  ON CONFLICT DO NOTHING;
END $$;

-- Update RLS policies for better access control

-- Allow admins to see all user profiles
DROP POLICY IF EXISTS "admins can see all profiles" ON user_profiles;
CREATE POLICY "admins can see all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'admin'
    )
  );

-- Allow consultants to see their clients' profiles
DROP POLICY IF EXISTS "consultants can see client profiles" ON user_profiles;
CREATE POLICY "consultants can see client profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    role = 'client' AND EXISTS (
      SELECT 1 FROM projects p 
      WHERE p.client_id = user_profiles.id 
        AND p.consultant_id = auth.uid()
    )
  );

-- Allow users to see consultant profiles (for public consultant info)
DROP POLICY IF EXISTS "users can see consultant profiles" ON user_profiles;
CREATE POLICY "users can see consultant profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (role = 'consultant');