/*
  # Insert Georgia Test Data

  1. Test Data
    - Georgia country with business advantages
    - Test consultant for Georgia
    - Sample services for Georgia

  Note: Test users should be created through the registration form
*/

-- Insert Georgia as test country
INSERT INTO countries (
  name,
  code,
  flag_emoji,
  description,
  tax_rate,
  business_advantages,
  featured,
  is_active
) VALUES (
  'Georgia',
  'GE',
  '🇬🇪',
  'Georgia offers one of the world''s most attractive business environments with the Small Business Status providing just 1% tax rate. The country features minimal bureaucracy, strategic location between Europe and Asia, and a very business-friendly government.',
  1.0,
  ARRAY[
    'Small Business Status - 1% tax rate',
    'Simple incorporation process',
    'Minimal bureaucracy',
    'Strategic location between Europe and Asia',
    'English-speaking business environment',
    'Fast company registration (1-2 days)',
    'No currency restrictions',
    'Strong banking sector'
  ],
  true,
  true
) ON CONFLICT (code) DO NOTHING;