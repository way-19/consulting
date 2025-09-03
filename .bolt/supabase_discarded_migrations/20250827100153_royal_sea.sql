/*
  # Countries and Jurisdictions

  1. New Tables
    - `countries`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `code` (text, unique, ISO country code)
      - `flag_emoji` (text)
      - `description` (text)
      - `tax_rate` (numeric, nullable)
      - `business_advantages` (text array)
      - `consultant_id` (uuid, references user_profiles)
      - `featured` (boolean, default false)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `countries` table
    - Public read access for active countries
    - Only admins can modify countries

  3. Initial Data
    - Insert Georgia as the test country
*/

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  flag_emoji text NOT NULL,
  description text NOT NULL,
  tax_rate numeric,
  business_advantages text[] DEFAULT '{}',
  consultant_id uuid REFERENCES user_profiles(id),
  featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can read active countries
CREATE POLICY "Anyone can read active countries"
  ON countries
  FOR SELECT
  USING (is_active = true);

-- Only admins can modify countries
CREATE POLICY "Only admins can modify countries"
  ON countries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Insert Georgia as test country (consultant_id will be updated after creating consultant user)
INSERT INTO countries (name, code, flag_emoji, description, tax_rate, business_advantages, featured)
VALUES (
  'Georgia',
  'GE',
  '🇬🇪',
  'Georgia offers one of the world''s most attractive business environments with the Small Business Status providing just 1% tax rate. The country features simple incorporation processes, strategic location between Europe and Asia, and a business-friendly regulatory environment.',
  1.0,
  ARRAY[
    'Small Business Status - 1% tax rate',
    'Simple incorporation process',
    'Strategic location between Europe and Asia',
    'Business-friendly regulations',
    'Low bureaucracy',
    'Fast company registration'
  ],
  true
);