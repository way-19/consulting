/*
  # Fix countries table permissions

  1. Security
    - Enable RLS on countries table
    - Add policy for authenticated users to read countries data
    - Allow public read access to countries for all users
*/

-- Enable RLS on countries table if not already enabled
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "countries_public_read" ON countries;
DROP POLICY IF EXISTS "Allow read access to all users" ON countries;
DROP POLICY IF EXISTS "Enable read for all authenticated users" ON countries;

-- Create a simple policy for reading countries
CREATE POLICY "countries_read_access"
  ON countries
  FOR SELECT
  TO authenticated
  USING (true);

-- Also allow anonymous users to read countries (for public pages)
CREATE POLICY "countries_public_access"
  ON countries
  FOR SELECT
  TO anon
  USING (true);