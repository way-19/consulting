/*
  # Insert Sample Services Data

  1. Sample Services
    - UAE Company Formation service
    - Estonia e-Residency service  
    - Georgia Small Business service
    - Malta EU Company service
    - Panama Territorial Tax service
    - Portugal Golden Visa service

  2. Data Structure
    - All services linked to existing countries
    - Proper UUID format for all IDs
    - Mix of one-time and recurring services
    - Public and active services for testing
*/

-- Insert sample services for UAE
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
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  NULL,
  (SELECT id FROM countries WHERE code = 'ae' LIMIT 1),
  'UAE Company Formation',
  'Complete business setup in Dubai International Financial Centre (DIFC) free zone with full banking support and compliance assistance.',
  2500.00,
  false,
  NULL,
  true,
  true,
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  NULL,
  (SELECT id FROM countries WHERE code = 'ae' LIMIT 1),
  'UAE Banking Solutions',
  'Professional corporate banking assistance for UAE companies including account opening and payment solutions.',
  800.00,
  false,
  NULL,
  true,
  true,
  'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  NULL,
  (SELECT id FROM countries WHERE code = 'ee' LIMIT 1),
  'Estonia e-Residency',
  'Complete e-Residency application and EU company formation with digital banking setup.',
  1200.00,
  false,
  NULL,
  true,
  true,
  'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  NULL,
  (SELECT id FROM countries WHERE code = 'ge' LIMIT 1),
  'Georgia Small Business Setup',
  'Fast company registration with 1% small business tax status in Georgia.',
  600.00,
  false,
  NULL,
  true,
  true,
  'https://images.pexels.com/photos/5137987/pexels-photo-5137987.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  NULL,
  (SELECT id FROM countries WHERE code = 'mt' LIMIT 1),
  'Malta EU Company Formation',
  'EU company formation in Malta with 5% effective tax rate and blockchain-friendly regulations.',
  1800.00,
  false,
  NULL,
  true,
  true,
  'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=800'
),
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  NULL,
  (SELECT id FROM countries WHERE code = 'pa' LIMIT 1),
  'Panama Territorial Tax Setup',
  'Company formation in Panama with territorial tax benefits and banking privacy.',
  1500.00,
  false,
  NULL,
  true,
  true,
  'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800'
);