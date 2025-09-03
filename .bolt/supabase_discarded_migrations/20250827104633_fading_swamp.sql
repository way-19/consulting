/*
  # Create Missing User Profiles

  1. Manual Profile Creation
    - Creates profiles for existing users from auth.users table
    - Sets appropriate roles based on email addresses
    - Ensures all existing users have profiles

  2. Data Population
    - Admin: admin@consulting19.com -> admin role
    - Consultant: giorgi.meskhi@consulting19.com -> consultant role  
    - Client: client@consulting19.com -> client role
*/

-- Create profiles for existing users who don't have profiles yet
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  language,
  is_active,
  created_at,
  updated_at
)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as full_name,
  CASE 
    WHEN u.email = 'admin@consulting19.com' THEN 'admin'::user_role
    WHEN u.email = 'giorgi.meskhi@consulting19.com' THEN 'consultant'::user_role
    ELSE 'client'::user_role
  END as role,
  'en' as language,
  true as is_active,
  u.created_at,
  u.updated_at
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE p.id IS NULL
  AND u.deleted_at IS NULL;

-- Verify the profiles were created
SELECT 
  p.email,
  p.full_name,
  p.role,
  p.is_active
FROM user_profiles p
ORDER BY p.created_at;