/*
  # Add sample payment data for testing

  1. Sample Data
    - Client payment schedules for testing
    - Various payment types and statuses
    - Upcoming and overdue payments
  
  2. Test Scenarios
    - Accounting fees (monthly)
    - Tax payments (quarterly)
    - Virtual address (annual)
    - Legal consulting (one-time)
*/

-- Sample client payment schedules
INSERT INTO client_payment_schedules (
  client_id,
  payment_type,
  description,
  amount,
  currency,
  due_date,
  status,
  recurring,
  recurring_interval,
  country_id
) VALUES
-- Upcoming payments
(
  (SELECT id FROM users WHERE role = 'client' LIMIT 1),
  'accounting_fee',
  'Aylık muhasebe hizmet ücreti',
  299.00,
  'USD',
  CURRENT_DATE + INTERVAL '5 days',
  'pending',
  true,
  'monthly',
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1)
),
(
  (SELECT id FROM users WHERE role = 'client' LIMIT 1),
  'tax_payment',
  'Üçüncü çeyrek vergi ödemesi',
  1250.00,
  'USD',
  CURRENT_DATE + INTERVAL '10 days',
  'pending',
  false,
  null,
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1)
),
(
  (SELECT id FROM users WHERE role = 'client' LIMIT 1),
  'virtual_address',
  'Yıllık sanal adres ücreti',
  99.00,
  'USD',
  CURRENT_DATE + INTERVAL '15 days',
  'pending',
  true,
  'annual',
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1)
),
-- Overdue payment
(
  (SELECT id FROM users WHERE role = 'client' LIMIT 1),
  'legal_fee',
  'Sözleşme inceleme ücreti',
  450.00,
  'USD',
  CURRENT_DATE - INTERVAL '3 days',
  'pending',
  false,
  null,
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1)
),
-- Paid payment
(
  (SELECT id FROM users WHERE role = 'client' LIMIT 1),
  'company_maintenance',
  'Şirket yıllık bakım ücreti',
  200.00,
  'USD',
  CURRENT_DATE - INTERVAL '10 days',
  'paid',
  true,
  'annual',
  (SELECT id FROM countries WHERE slug = 'georgia' LIMIT 1)
);

-- Sample consultant custom services
INSERT INTO consultant_custom_services (
  consultant_id,
  service_name,
  service_description,
  service_category,
  price,
  currency,
  requires_approval,
  active,
  recurring_service,
  recurring_interval
) VALUES
(
  (SELECT id FROM users WHERE role = 'consultant' LIMIT 1),
  'Vergi Planlaması Danışmanlığı',
  'Kişisel ve kurumsal vergi optimizasyonu için kapsamlı danışmanlık hizmeti',
  'Tax Advisory',
  500.00,
  'USD',
  false,
  true,
  false,
  null
),
(
  (SELECT id FROM users WHERE role = 'consultant' LIMIT 1),
  'Aylık Muhasebe Hizmeti',
  'Tam kapsamlı aylık muhasebe ve finansal raporlama hizmeti',
  'Accounting Services',
  299.00,
  'USD',
  false,
  true,
  true,
  'monthly'
),
(
  (SELECT id FROM users WHERE role = 'consultant' LIMIT 1),
  'İş Planı Geliştirme',
  'Profesyonel iş planı hazırlama ve strateji geliştirme hizmeti',
  'Business Consulting',
  1200.00,
  'USD',
  true,
  true,
  false,
  null
),
(
  (SELECT id FROM users WHERE role = 'consultant' LIMIT 1),
  'Uyumluluk İzleme',
  'Sürekli mevzuat takibi ve uyumluluk yönetimi hizmeti',
  'Compliance Services',
  199.00,
  'USD',
  false,
  true,
  true,
  'monthly'
);