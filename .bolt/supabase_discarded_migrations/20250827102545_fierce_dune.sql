/*
  # Create Test Users

  This script creates test users for different roles.
  Run this after the user system is complete.
*/

-- Insert test users directly into auth.users (for development only)
-- Note: In production, users should register through the normal signup process

-- Test Admin User
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@consulting19.com',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Admin User", "role": "admin", "country": "United States"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Test Consultant User (Georgia)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'giorgi.meskhi@consulting19.com',
  crypt('Consultant123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Giorgi Meskhi", "role": "consultant", "country": "Georgia"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Test Client User
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'client@consulting19.com',
  crypt('Client123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"full_name": "Test Client", "role": "client", "country": "Turkey"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;