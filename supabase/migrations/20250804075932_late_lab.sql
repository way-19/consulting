/*
  # Add Missing Countries to CONSULTING19 Platform

  1. New Countries
    - `Switzerland` (🇨🇭)
      - Premium banking hub with world-class financial services
      - Privacy, stability and favorable tax structures
    - `UAE` (🇦🇪) 
      - Tax-free business hub in strategic Middle East location
      - 0% corporate tax and world-class infrastructure
    - `Spain` (🇪🇸)
      - EU market gateway with growing startup ecosystem
      - Attractive residency programs and EU membership benefits

  2. Updates
    - Ensure all countries have proper flag emojis
    - Set appropriate advantages and descriptions
    - Enable all countries for platform use

  3. Security
    - Countries table already has RLS enabled
    - Public read access policy already exists
*/

-- Add Switzerland
INSERT INTO countries (
  name, 
  slug, 
  flag_emoji, 
  description, 
  advantages, 
  primary_language, 
  supported_languages, 
  auto_language_detection, 
  legacy_form_integration, 
  consultant_auto_assignment, 
  status
) VALUES (
  'Switzerland',
  'switzerland',
  '🇨🇭',
  'World-class financial center with privacy, stability and favorable tax structures',
  '["Premium banking hub", "Financial privacy", "Political stability", "Favorable tax structures", "High quality of life"]'::jsonb,
  'de',
  '["de", "fr", "it", "en"]'::jsonb,
  true,
  true,
  true,
  true
) ON CONFLICT (slug) DO UPDATE SET
  flag_emoji = EXCLUDED.flag_emoji,
  description = EXCLUDED.description,
  advantages = EXCLUDED.advantages,
  primary_language = EXCLUDED.primary_language,
  supported_languages = EXCLUDED.supported_languages,
  status = EXCLUDED.status;

-- Add UAE
INSERT INTO countries (
  name, 
  slug, 
  flag_emoji, 
  description, 
  advantages, 
  primary_language, 
  supported_languages, 
  auto_language_detection, 
  legacy_form_integration, 
  consultant_auto_assignment, 
  status
) VALUES (
  'UAE',
  'uae',
  '🇦🇪',
  'Strategic Middle East location with 0% corporate tax and world-class infrastructure',
  '["0% corporate tax", "Strategic location", "World-class infrastructure", "Business-friendly environment", "No personal income tax"]'::jsonb,
  'ar',
  '["ar", "en"]'::jsonb,
  true,
  true,
  true,
  true
) ON CONFLICT (slug) DO UPDATE SET
  flag_emoji = EXCLUDED.flag_emoji,
  description = EXCLUDED.description,
  advantages = EXCLUDED.advantages,
  primary_language = EXCLUDED.primary_language,
  supported_languages = EXCLUDED.supported_languages,
  status = EXCLUDED.status;

-- Add Spain
INSERT INTO countries (
  name, 
  slug, 
  flag_emoji, 
  description, 
  advantages, 
  primary_language, 
  supported_languages, 
  auto_language_detection, 
  legacy_form_integration, 
  consultant_auto_assignment, 
  status
) VALUES (
  'Spain',
  'spain',
  '🇪🇸',
  'EU membership with growing startup ecosystem and attractive residency programs',
  '["EU market access", "Growing startup ecosystem", "Attractive residency programs", "Quality of life", "Strategic location"]'::jsonb,
  'es',
  '["es", "en"]'::jsonb,
  true,
  true,
  true,
  true
) ON CONFLICT (slug) DO UPDATE SET
  flag_emoji = EXCLUDED.flag_emoji,
  description = EXCLUDED.description,
  advantages = EXCLUDED.advantages,
  primary_language = EXCLUDED.primary_language,
  supported_languages = EXCLUDED.supported_languages,
  status = EXCLUDED.status;

-- Update existing countries to ensure they have proper flag emojis and descriptions
UPDATE countries SET 
  flag_emoji = '🇬🇪',
  description = COALESCE(description, 'Strategic location between Europe and Asia with favorable tax system'),
  advantages = COALESCE(advantages, '["0% tax on foreign income", "Strategic location", "Simple company formation", "Territorial taxation"]'::jsonb)
WHERE slug = 'georgia';

UPDATE countries SET 
  flag_emoji = '🇺🇸',
  description = COALESCE(description, 'Access to the world''s largest economy and advanced financial systems'),
  advantages = COALESCE(advantages, '["Global market access", "Delaware business laws", "Advanced financial systems", "Strong legal framework"]'::jsonb)
WHERE slug = 'usa';

UPDATE countries SET 
  flag_emoji = '🇲🇪',
  description = COALESCE(description, 'EU candidate country with attractive investment opportunities'),
  advantages = COALESCE(advantages, '["EU candidate status", "Investment programs", "Adriatic location", "Growing economy"]'::jsonb)
WHERE slug = 'montenegro';

UPDATE countries SET 
  flag_emoji = '🇪🇪',
  description = COALESCE(description, 'Digital-first approach with e-Residency program and EU membership'),
  advantages = COALESCE(advantages, '["e-Residency program", "Digital government", "EU membership", "Advanced digital infrastructure"]'::jsonb)
WHERE slug = 'estonia';

UPDATE countries SET 
  flag_emoji = '🇵🇹',
  description = COALESCE(description, 'EU membership with Golden Visa program and excellent quality of life'),
  advantages = COALESCE(advantages, '["Golden Visa program", "EU membership", "Quality of life", "Strategic Atlantic location"]'::jsonb)
WHERE slug = 'portugal';

UPDATE countries SET 
  flag_emoji = '🇲🇹',
  description = COALESCE(description, 'EU membership with sophisticated tax planning and English-speaking environment'),
  advantages = COALESCE(advantages, '["EU tax optimization", "Financial services hub", "English-speaking", "Strategic Mediterranean location"]'::jsonb)
WHERE slug = 'malta';

UPDATE countries SET 
  flag_emoji = '🇵🇦',
  description = COALESCE(description, 'Premier offshore jurisdiction with banking privacy and USD currency'),
  advantages = COALESCE(advantages, '["Offshore advantages", "Banking privacy", "USD currency", "Strategic location"]'::jsonb)
WHERE slug = 'panama';