/*
  # Create countries table

  1. New Tables
    - `countries`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `code` (text, unique)
      - `flag_emoji` (text)
      - `description_i18n` (jsonb)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `countries` table
    - Add policy for public read access to active countries
*/

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  flag_emoji text NOT NULL,
  description_i18n jsonb DEFAULT '{}',
  capital text,
  language text,
  currency text,
  timezone text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can read active countries"
  ON countries
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Insert Georgia
INSERT INTO countries (name, code, flag_emoji, description_i18n, capital, language, currency, timezone) VALUES
('Georgia', 'georgia', '🇬🇪', 
 '{"en": "Strategic business hub between Europe and Asia with favorable tax policies", "tr": "Avrupa ve Asya arasında stratejik iş merkezi", "pt": "Centro de negócios estratégico entre Europa e Ásia"}',
 'Tbilisi', 'Georgian, English', 'Georgian Lari (GEL)', 'GMT+4')
ON CONFLICT (code) DO NOTHING;