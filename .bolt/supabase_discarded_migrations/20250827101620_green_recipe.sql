/*
  # Create Countries Table

  1. New Tables
    - `countries`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `code` (text, unique, 2-letter country code)
      - `flag_emoji` (text)
      - `description` (text)
      - `tax_rate` (numeric, nullable)
      - `business_advantages` (text array)
      - `consultant_id` (uuid, nullable, references user_profiles)
      - `featured` (boolean, default false)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `countries` table
    - Add policies for public read access
    - Add policies for admins to manage countries
*/

CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  flag_emoji text NOT NULL,
  description text NOT NULL,
  tax_rate numeric,
  business_advantages text[] DEFAULT '{}',
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active countries"
  ON countries
  FOR SELECT
  TO authenticated
  USING (is_active = true);

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

CREATE POLICY "Consultants can view their assigned countries"
  ON countries
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());