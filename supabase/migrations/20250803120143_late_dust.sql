/*
  # Test Payment Data for Georgia Client

  1. Test Data Creation
    - Creates test payment schedules for Georgia client
    - Includes different payment types and statuses
    - Sets up upcoming, overdue, and due soon payments

  2. Payment Types
    - Accounting fees (monthly recurring)
    - Compliance fees (annual)
    - Virtual address fees
    - Tax payments
    - Legal consulting fees

  3. Test Scenarios
    - Upcoming payments (next 30 days)
    - Overdue payments (past due)
    - Due soon payments (next 3 days)
*/

-- First, let's ensure we have a Georgia country record
INSERT INTO countries (id, name, slug, flag_emoji, description, status) 
VALUES (1, 'Georgia', 'georgia', '🇬🇪', 'Strategic location between Europe and Asia with favorable tax system', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  flag_emoji = EXCLUDED.flag_emoji,
  description = EXCLUDED.description,
  status = EXCLUDED.status;

-- Create test Georgia client user
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
  created_at
) VALUES (
  'georgia-client-test-uuid-001',
  'georgia_client@consulting19.com',
  'client',
  'Giorgi',
  'Kvaratskhelia',
  1,
  1,
  'en',
  true,
  now()
) ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id;

-- Create test Georgia consultant user
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
  created_at
) VALUES (
  'georgia-consultant-test-uuid-001',
  'georgia_danisman@consulting19.com',
  'consultant',
  'Nino',
  'Kvaratskhelia',
  1,
  1,
  'en',
  true,
  now()
) ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  country_id = EXCLUDED.country_id,
  primary_country_id = EXCLUDED.primary_country_id;

-- Assign consultant to Georgia
INSERT INTO consultant_country_assignments (
  consultant_id,
  country_id,
  is_primary,
  status,
  created_at
) VALUES (
  'georgia-consultant-test-uuid-001',
  1,
  true,
  true,
  now()
) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
  is_primary = EXCLUDED.is_primary,
  status = EXCLUDED.status;

-- Create test payment schedules for Georgia client
INSERT INTO client_payment_schedules (
  client_id,
  consultant_id,
  country_id,
  payment_type,
  description,
  amount,
  currency,
  due_date,
  status,
  recurring,
  recurring_interval,
  next_payment_date,
  created_at,
  updated_at
) VALUES 
-- Upcoming payment (7 days from now)
(
  'georgia-client-test-uuid-001',
  'georgia-consultant-test-uuid-001',
  1,
  'accounting_fee',
  'Mart ayı muhasebe ücreti',
  299.00,
  'USD',
  CURRENT_DATE + INTERVAL '7 days',
  'pending',
  true,
  'monthly',
  CURRENT_DATE + INTERVAL '37 days',
  now(),
  now()
),
-- Due soon payment (2 days from now)
(
  'georgia-client-test-uuid-001',
  'georgia-consultant-test-uuid-001',
  1,
  'compliance_fee',
  'Yıllık uyumluluk ücreti',
  199.00,
  'USD',
  CURRENT_DATE + INTERVAL '2 days',
  'pending',
  false,
  null,
  null,
  now(),
  now()
),
-- Overdue payment (5 days ago)
(
  'georgia-client-test-uuid-001',
  'georgia-consultant-test-uuid-001',
  1,
  'virtual_address',
  'Sanal adres yenileme ücreti',
  50.00,
  'USD',
  CURRENT_DATE - INTERVAL '5 days',
  'pending',
  true,
  'annual',
  CURRENT_DATE + INTERVAL '360 days',
  now(),
  now()
),
-- Upcoming tax payment (15 days from now)
(
  'georgia-client-test-uuid-001',
  'georgia-consultant-test-uuid-001',
  1,
  'tax_payment',
  'Çeyreklik vergi ödemesi',
  450.00,
  'USD',
  CURRENT_DATE + INTERVAL '15 days',
  'pending',
  true,
  'quarterly',
  CURRENT_DATE + INTERVAL '105 days',
  now(),
  now()
),
-- Legal consulting fee (10 days from now)
(
  'georgia-client-test-uuid-001',
  'georgia-consultant-test-uuid-001',
  1,
  'legal_fee',
  'Hukuki danışmanlık ücreti',
  350.00,
  'USD',
  CURRENT_DATE + INTERVAL '10 days',
  'pending',
  false,
  null,
  null,
  now(),
  now()
),
-- Company maintenance (25 days from now)
(
  'georgia-client-test-uuid-001',
  'georgia-consultant-test-uuid-001',
  1,
  'company_maintenance',
  'Şirket bakım ücreti',
  150.00,
  'USD',
  CURRENT_DATE + INTERVAL '25 days',
  'pending',
  true,
  'annual',
  CURRENT_DATE + INTERVAL '365 days',
  now(),
  now()
);

-- Create a test application for the Georgia client
INSERT INTO applications (
  id,
  client_id,
  consultant_id,
  service_type,
  status,
  total_amount,
  currency,
  service_country_id,
  application_data,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'georgia-client-test-uuid-001',
  'georgia-consultant-test-uuid-001',
  'Company Formation',
  'in_progress',
  2500.00,
  'USD',
  1,
  '{"company_type": "LLC", "business_activity": "Technology Services", "share_capital": "1000 GEL"}',
  now(),
  now()
) ON CONFLICT DO NOTHING;

-- Create test notifications for Georgia client
INSERT INTO client_notifications (
  client_id,
  consultant_id,
  notification_type,
  title,
  message,
  priority,
  is_read,
  created_at
) VALUES 
(
  'georgia-client-test-uuid-001',
  'georgia-consultant-test-uuid-001',
  'payment_reminder',
  'Ödeme Hatırlatması',
  'Mart ayı muhasebe ücretinizin vadesi yaklaşıyor. Lütfen ödemenizi zamanında yapınız.',
  'normal',
  false,
  now()
),
(
  'georgia-client-test-uuid-001',
  'georgia-consultant-test-uuid-001',
  'document_ready',
  'Belgeler Hazır',
  'Şirket kuruluş belgeleriniz hazır. İndirebilirsiniz.',
  'high',
  false,
  now() - INTERVAL '1 day'
);