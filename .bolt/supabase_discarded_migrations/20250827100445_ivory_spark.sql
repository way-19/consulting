/*
  # Countries Table

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
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `countries` table
    - Add policies for public read access
    - Add policies for consultants to update their countries
    - Add policies for admins to manage all countries
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
  featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Countries are publicly readable" ON countries;
DROP POLICY IF EXISTS "Consultants can update their countries" ON countries;
DROP POLICY IF EXISTS "Admins can manage all countries" ON countries;

-- Public read access for active countries
CREATE POLICY "Countries are publicly readable"
  ON countries
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Consultants can update their assigned countries
CREATE POLICY "Consultants can update their countries"
  ON countries
  FOR UPDATE
  TO authenticated
  USING (
    consultant_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'consultant'
    )
  );

-- Admins can manage all countries
CREATE POLICY "Admins can manage all countries"
  ON countries
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );