/*
  # Fix Countries Table RLS Permissions

  1. Security Updates
    - Ensure RLS is enabled on countries table
    - Add safe policy creation for public read access to active countries
    - Add safe policy creation for authenticated user access

  2. Changes
    - Enable public read for active countries (is_active = true)
    - Enable authenticated read for all countries
    - Use IF NOT EXISTS pattern to avoid conflicts
*/

-- Enable RLS on countries table (safe operation)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to recreate them properly
DROP POLICY IF EXISTS "Enable public read for active countries" ON countries;
DROP POLICY IF EXISTS "Enable authenticated read for countries" ON countries;
DROP POLICY IF EXISTS "Enable public read for countries" ON countries;

-- Create policy for public read access to active countries
CREATE POLICY "Enable public read for active countries"
  ON countries
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create policy for authenticated users to read all countries
CREATE POLICY "Enable authenticated read for countries"
  ON countries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for public role (fallback)
CREATE POLICY "Enable public read for countries"
  ON countries
  FOR SELECT
  TO public
  USING (is_active = true);