/*
  # Create Test Users and Profiles

  1. New Auth Users
    - Creates admin, consultant, and client users in auth.users
    - Sets up proper authentication credentials
    - Assigns roles and metadata

  2. User Profiles
    - Creates corresponding profiles in user_profiles table
    - Assigns all users to Georgia country
    - Sets up proper roles and permissions

  3. Client Assignment
    - Creates client record for client user
    - Assigns client to consultant for proper relationship
*/

-- Create test users in auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES 
-- Admin User
(
  '00000000-0000-0000-0000-000000000000',
  'a1111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'admin@consulting19.com',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User", "role": "admin"}',
  FALSE,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  FALSE,
  NULL
),
-- Consultant User
(
  '00000000-0000-0000-0000-000000000000',
  'c2222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'giorgi.meskhi@consulting19.com',
  crypt('Consultant123!', gen_salt('bf')),
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Giorgi Meskhi", "role": "consultant", "company": "Meskhi & Associates"}',
  FALSE,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  FALSE,
  NULL
),
-- Client User
(
  '00000000-0000-0000-0000-000000000000',
  'u3333333-3333-3333-3333-333333333333',
  'authenticated',
  'authenticated',
  'client@consulting19.com',
  crypt('Client123!', gen_salt('bf')),
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test Client", "role": "client", "company": "Test Company"}',
  FALSE,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL,
  FALSE,
  NULL
)
ON CONFLICT (email) DO NOTHING;

-- Create corresponding user profiles
INSERT INTO public.user_profiles (
  id,
  email,
  full_name,
  role,
  country_id,
  company,
  is_active,
  preferred_language,
  timezone
) VALUES 
-- Admin Profile
(
  'a1111111-1111-1111-1111-111111111111',
  'admin@consulting19.com',
  'Admin User',
  'admin',
  'b078d0fb-86a4-48dc-ba83-5d600479e074',
  'Consulting19',
  TRUE,
  'en',
  'UTC'
),
-- Consultant Profile
(
  'c2222222-2222-2222-2222-222222222222',
  'giorgi.meskhi@consulting19.com',
  'Giorgi Meskhi',
  'consultant',
  'b078d0fb-86a4-48dc-ba83-5d600479e074',
  'Meskhi & Associates',
  TRUE,
  'en',
  'Asia/Tbilisi'
),
-- Client Profile
(
  'u3333333-3333-3333-3333-333333333333',
  'client@consulting19.com',
  'Test Client',
  'client',
  'b078d0fb-86a4-48dc-ba83-5d600479e074',
  'Test Company',
  TRUE,
  'en',
  'UTC'
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  country_id = EXCLUDED.country_id,
  company = EXCLUDED.company,
  is_active = EXCLUDED.is_active,
  preferred_language = EXCLUDED.preferred_language,
  timezone = EXCLUDED.timezone;

-- Create client record and assign to consultant
INSERT INTO public.clients (
  profile_id,
  assigned_consultant_id,
  company_name,
  status,
  priority
) VALUES (
  'u3333333-3333-3333-3333-333333333333',
  'c2222222-2222-2222-2222-222222222222',
  'Test Company',
  'active',
  'medium'
)
ON CONFLICT (profile_id) DO UPDATE SET
  assigned_consultant_id = EXCLUDED.assigned_consultant_id,
  company_name = EXCLUDED.company_name,
  status = EXCLUDED.status,
  priority = EXCLUDED.priority;

-- Create consultant country assignment
INSERT INTO public.consultant_country_assignments (
  consultant_id,
  country_id,
  is_active
) VALUES (
  'c2222222-2222-2222-2222-222222222222',
  'b078d0fb-86a4-48dc-ba83-5d600479e074',
  TRUE
)
ON CONFLICT (consultant_id, country_id) DO UPDATE SET
  is_active = EXCLUDED.is_active;