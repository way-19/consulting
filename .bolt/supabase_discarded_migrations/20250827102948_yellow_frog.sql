/*
  # Create Test Users

  1. Test Users
    - Admin: admin@consulting19.com / Admin123!
    - Consultant: giorgi.meskhi@consulting19.com / Consultant123!
    - Client: client@consulting19.com / Client123!

  2. Security
    - Creates users in auth.users table
    - Creates corresponding profiles in user_profiles table
    - Sets appropriate roles for each user
*/

-- Insert test users into auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES 
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@consulting19.com',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'giorgi.meskhi@consulting19.com',
  crypt('Consultant123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
),
(
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'client@consulting19.com',
  crypt('Client123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING;

-- Insert corresponding profiles
INSERT INTO public.user_profiles (
  id,
  email,
  full_name,
  role,
  country,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  CASE 
    WHEN u.email = 'admin@consulting19.com' THEN 'System Administrator'
    WHEN u.email = 'giorgi.meskhi@consulting19.com' THEN 'Giorgi Meskhi'
    WHEN u.email = 'client@consulting19.com' THEN 'Test Client'
  END as full_name,
  CASE 
    WHEN u.email = 'admin@consulting19.com' THEN 'admin'::user_role
    WHEN u.email = 'giorgi.meskhi@consulting19.com' THEN 'consultant'::user_role
    WHEN u.email = 'client@consulting19.com' THEN 'client'::user_role
  END as role,
  CASE 
    WHEN u.email = 'giorgi.meskhi@consulting19.com' THEN 'Georgia'
    ELSE 'Turkey'
  END as country,
  now(),
  now()
FROM auth.users u
WHERE u.email IN ('admin@consulting19.com', 'giorgi.meskhi@consulting19.com', 'client@consulting19.com')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  country = EXCLUDED.country,
  updated_at = now();