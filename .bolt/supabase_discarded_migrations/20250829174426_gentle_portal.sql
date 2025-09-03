/*
  # Add Consultants and Services Data

  1. New Data
    - Add consultant profiles for UAE and Estonia
    - Update countries table with consultant assignments
    - Add sample services with proper consultant_id references

  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity with proper foreign key relationships
*/

-- First, add consultant profiles
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  country,
  phone,
  company,
  bio,
  profile_image_url,
  is_active
) VALUES 
(
  'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'ahmed.alrashid@consulting19.com',
  'Ahmed Al-Rashid',
  'consultant',
  'United Arab Emirates',
  '+971 50 123 4567',
  'UAE Business Solutions',
  'Ahmed has over 10 years of experience helping international businesses establish operations in the UAE. He specializes in free zone company formation and banking solutions.',
  'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300',
  true
),
(
  'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'maria.kask@consulting19.com',
  'Maria Kask',
  'consultant',
  'Estonia',
  '+372 5123 4567',
  'Estonia Digital Business',
  'Maria has helped over 500 entrepreneurs become Estonian e-Residents and establish successful EU businesses. She specializes in digital business formation and compliance.',
  'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Update countries with consultant assignments
UPDATE countries 
SET consultant_id = 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
WHERE code = 'ae' OR name = 'United Arab Emirates';

UPDATE countries 
SET consultant_id = 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
WHERE code = 'ee' OR name = 'Estonia';

-- Now add services with proper consultant_id references
INSERT INTO services (
  id,
  consultant_id,
  country_id,
  title,
  description,
  price,
  is_recurring,
  billing_period,
  is_public,
  is_active,
  image_url
) VALUES 
-- UAE Services
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  (SELECT id FROM countries WHERE code = 'ae' OR name = 'United Arab Emirates' LIMIT 1),
  'UAE Company Formation',
  'Complete business setup in Dubai International Financial Centre (DIFC) free zone with full banking support and compliance assistance.',
  2500.00,
  false,
  null,
  true,
  true,
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  (SELECT id FROM countries WHERE code = 'ae' OR name = 'United Arab Emirates' LIMIT 1),
  'UAE Banking Solutions',
  'Open corporate bank accounts in UAE with full documentation support and banking relationship management.',
  800.00,
  false,
  null,
  true,
  true,
  'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  (SELECT id FROM countries WHERE code = 'ae' OR name = 'United Arab Emirates' LIMIT 1),
  'UAE Tax Residency',
  'Establish UAE tax residency with comprehensive guidance on requirements and benefits.',
  1200.00,
  false,
  null,
  true,
  true,
  'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800'
),
-- Estonia Services
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  (SELECT id FROM countries WHERE code = 'ee' OR name = 'Estonia' LIMIT 1),
  'Estonia e-Residency',
  'Complete e-Residency application and digital business setup with EU market access.',
  1500.00,
  false,
  null,
  true,
  true,
  'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  (SELECT id FROM countries WHERE code = 'ee' OR name = 'Estonia' LIMIT 1),
  'Estonia Digital Banking',
  'Open Estonian business bank accounts with full digital banking setup and EU payment solutions.',
  600.00,
  false,
  null,
  true,
  true,
  'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800'
)
ON CONFLICT (id) DO NOTHING;