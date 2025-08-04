/*
  # Create Test Consultant and Client Data

  1. New Tables
    - Creates test consultant for Georgia
    - Creates test clients assigned to consultant
    - Creates applications linking clients to consultant
    - Creates country assignments

  2. Security
    - Uses existing RLS policies
    - Ensures proper data relationships

  3. Test Data
    - 1 Georgia consultant
    - 2 test clients
    - 2 applications
    - Country assignment
*/

-- First, let's check if we have the Georgia country
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM countries WHERE slug = 'georgia') THEN
    INSERT INTO countries (name, slug, flag_emoji, description, status) 
    VALUES ('Georgia', 'georgia', '🇬🇪', 'Strategic location between Europe and Asia', true);
  END IF;
END $$;

-- Create test consultant for Georgia
INSERT INTO users (
  id,
  email,
  role,
  first_name,
  last_name,
  country_id,
  primary_country_id,
  language,
  status,
  commission_rate,
  performance_rating,
  total_clients_served
) VALUES (
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'georgia_consultant@consulting19.com',
  'consultant',
  'Nino',
  'Kvaratskhelia',
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1),
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1),
  'tr',
  true,
  65.00,
  4.9,
  1247
) ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id;

-- Assign consultant to Georgia
INSERT INTO consultant_country_assignments (
  consultant_id,
  country_id,
  is_primary,
  status
) VALUES (
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1),
  true,
  true
) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
  is_primary = EXCLUDED.is_primary,
  status = EXCLUDED.status;

-- Create test client 1
INSERT INTO users (
  id,
  email,
  role,
  first_name,
  last_name,
  company_name,
  business_type,
  country_id,
  primary_country_id,
  language,
  status
) VALUES (
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'ahmet@test.com',
  'client',
  'Ahmet',
  'Yılmaz',
  'Tech Solutions LLC',
  'Technology',
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1),
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1),
  'tr',
  true
) ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  company_name = EXCLUDED.company_name,
  business_type = EXCLUDED.business_type,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id;

-- Create test client 2
INSERT INTO users (
  id,
  email,
  role,
  first_name,
  last_name,
  company_name,
  business_type,
  country_id,
  primary_country_id,
  language,
  status
) VALUES (
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'maria@test.com',
  'client',
  'Maria',
  'Garcia',
  'Global Trade Inc',
  'Import/Export',
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1),
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1),
  'tr',
  true
) ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  company_name = EXCLUDED.company_name,
  business_type = EXCLUDED.business_type,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id;

-- Create application for client 1
INSERT INTO applications (
  id,
  client_id,
  consultant_id,
  service_type,
  service_country_id,
  status,
  total_amount,
  currency,
  priority_level,
  source_type
) VALUES (
  gen_random_uuid(),
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'company_formation',
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1),
  'in_progress',
  2500.00,
  'USD',
  'normal',
  'platform'
) ON CONFLICT DO NOTHING;

-- Create application for client 2
INSERT INTO applications (
  id,
  client_id,
  consultant_id,
  service_type,
  service_country_id,
  status,
  total_amount,
  currency,
  priority_level,
  source_type
) VALUES (
  gen_random_uuid(),
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'accounting_services',
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1),
  'pending',
  1200.00,
  'USD',
  'high',
  'platform'
) ON CONFLICT DO NOTHING;