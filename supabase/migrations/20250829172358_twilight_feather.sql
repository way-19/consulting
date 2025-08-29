/*
  # Fix Countries Table RLS Permissions

  1. Security Updates
    - Enable RLS on countries table (if not already enabled)
    - Add policy for anonymous users to read active countries
    - Add policy for authenticated users to read all countries
    - Add policy for public access to active countries

  2. Changes
    - Ensures public access to countries data for marketing site
    - Maintains security while allowing necessary data access
    - Fixes 403 Forbidden errors on country pages
*/

-- Ensure RLS is enabled on countries table
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Enable public read for active countries" ON countries;
DROP POLICY IF EXISTS "Enable authenticated read for countries" ON countries;
DROP POLICY IF EXISTS "Enable public read for countries" ON countries;
DROP POLICY IF EXISTS "Allow anonymous read for active countries" ON countries;

-- Create policy for anonymous users to read active countries
CREATE POLICY "Allow anonymous read for active countries"
  ON countries
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policy for authenticated users to read all countries
CREATE POLICY "Allow authenticated read for all countries"
  ON countries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for public role to read active countries
CREATE POLICY "Allow public read for active countries"
  ON countries
  FOR SELECT
  TO public
  USING (is_active = true);

-- Grant necessary permissions to anon and authenticated roles
GRANT SELECT ON countries TO anon;
GRANT SELECT ON countries TO authenticated;
GRANT SELECT ON countries TO public;