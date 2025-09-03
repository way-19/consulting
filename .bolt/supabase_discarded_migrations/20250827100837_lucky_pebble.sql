/*
  # Insert Initial Data

  This migration inserts the initial data for the Consulting19 platform:
  - Georgia as the test country
  - Sample services and test data

  ## Data Inserted:
  1. Georgia country information
  2. Sample services for testing
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
    'Georgia offers one of the world''s most attractive business environments with the Small Business Status providing just 1% tax rate. The country features simple incorporation procedures, strategic location between Europe and Asia, and a very business-friendly regulatory environment.',
    1.00,
    ARRAY[
        'Small Business Status - 1% tax rate',
        'Simple incorporation process',
        'Strategic location between Europe and Asia',
        'Very low bureaucracy',
        'English-speaking business environment',
        'Strong banking sector',
        'Political and economic stability',
        'Free trade agreements with EU and others'
    ],
    true,
    true
) ON CONFLICT (code) DO NOTHING;

-- Note: Test users will be created through the registration process
-- The following users should be registered manually:
-- 1. admin@consulting19.com (role: admin)
-- 2. giorgi.meskhi@consulting19.com (role: consultant) 
-- 3. client@consulting19.com (role: client)