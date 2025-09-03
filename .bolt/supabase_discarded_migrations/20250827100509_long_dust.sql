/*
  # Insert Test Data

  1. Test Country (Georgia)
  2. Test Users will be created through registration
  3. Sample services and projects
*/

-- Insert Georgia as test country
INSERT INTO countries (name, code, flag_emoji, description, tax_rate, business_advantages, featured, is_active)
VALUES (
  'Georgia',
  'GE',
  '🇬🇪',
  'Georgia offers one of the world''s most attractive business environments with the Small Business Status providing just 1% tax rate. The country features simple incorporation procedures, strategic location between Europe and Asia, and a business-friendly regulatory environment.',
  1.0,
  ARRAY[
    'Small Business Status - 1% tax rate',
    'Simple incorporation process (2-3 days)',
    'Strategic location between Europe and Asia',
    'No currency restrictions',
    'Strong banking sector',
    'English-speaking business environment'
  ],
  true,
  true
) ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  tax_rate = EXCLUDED.tax_rate,
  business_advantages = EXCLUDED.business_advantages,
  featured = EXCLUDED.featured;