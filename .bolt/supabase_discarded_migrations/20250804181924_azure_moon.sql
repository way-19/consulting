/*
  # Force Create Consultant Test Data

  1. New Tables
    - Creates test consultant and clients for Georgia
    - Creates applications linking them together
    - Creates country assignments

  2. Security
    - Temporarily disables RLS for data insertion
    - Re-enables RLS after data creation

  3. Debug
    - Returns all created data for verification
*/

-- Temporarily disable RLS for data insertion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_country_assignments DISABLE ROW LEVEL SECURITY;

-- First, ensure Georgia country exists
INSERT INTO countries (id, name, slug, flag_emoji, description, status) 
VALUES (1, 'Georgia', 'georgia', '🇬🇪', 'Strategic location between Europe and Asia', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  flag_emoji = EXCLUDED.flag_emoji,
  description = EXCLUDED.description,
  status = EXCLUDED.status;

-- Create Georgia consultant with specific ID
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
  1,
  1,
  'tr',
  true,
  65.00,
  4.9,
  1247
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id,
  language = EXCLUDED.language,
  status = EXCLUDED.status,
  commission_rate = EXCLUDED.commission_rate,
  performance_rating = EXCLUDED.performance_rating,
  total_clients_served = EXCLUDED.total_clients_served;

-- Create consultant country assignment
INSERT INTO consultant_country_assignments (
  id,
  consultant_id,
  country_id,
  is_primary,
  status
) VALUES (
  gen_random_uuid(),
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  1,
  true,
  true
) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
  is_primary = EXCLUDED.is_primary,
  status = EXCLUDED.status;

-- Create test clients
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
) VALUES 
(
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'ahmet@test.com',
  'client',
  'Ahmet',
  'Yılmaz',
  'Tech Solutions Ltd',
  'Technology',
  1,
  1,
  'tr',
  true
),
(
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'maria@test.com',
  'client',
  'Maria',
  'Garcia',
  'Global Trading Inc',
  'Import/Export',
  1,
  1,
  'tr',
  true
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  company_name = EXCLUDED.company_name,
  business_type = EXCLUDED.business_type,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id,
  language = EXCLUDED.language,
  status = EXCLUDED.status;

-- Create applications linking consultant to clients
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
  source_type,
  application_data
) VALUES 
(
  gen_random_uuid(),
  'e5f6a7b8-c9d0-4234-8678-901234efabcd',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'company_formation',
  1,
  'in_progress',
  2500.00,
  'USD',
  'normal',
  'platform',
  '{"description": "Georgia LLC formation for tech company", "submitted_via": "platform"}'::jsonb
),
(
  gen_random_uuid(),
  'f6a7b8c9-d0e1-4345-8789-012345fabcde',
  'c3d4e5f6-a7b8-4012-8456-789012cdefab',
  'accounting_services',
  1,
  'pending',
  1200.00,
  'USD',
  'high',
  'platform',
  '{"description": "Monthly accounting services for trading company", "submitted_via": "platform"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_country_assignments ENABLE ROW LEVEL SECURITY;

-- Return verification data
SELECT 
  'CONSULTANT' as type,
  id,
  email,
  first_name,
  last_name,
  role,
  country_id
FROM users 
WHERE id = 'c3d4e5f6-a7b8-4012-8456-789012cdefab'

UNION ALL

SELECT 
  'CLIENTS' as type,
  id,
  email,
  first_name,
  last_name,
  role,
  country_id
FROM users 
WHERE id IN ('e5f6a7b8-c9d0-4234-8678-901234efabcd', 'f6a7b8c9-d0e1-4345-8789-012345fabcde')

UNION ALL

SELECT 
  'APPLICATIONS' as type,
  id::text,
  client_id::text,
  consultant_id::text,
  service_type,
  status,
  total_amount::text
FROM applications 
WHERE consultant_id = 'c3d4e5f6-a7b8-4012-8456-789012cdefab';