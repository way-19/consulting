/*
  # Fix RLS policies for countries table

  1. Security Updates
    - Ensure proper RLS policies for public read access to countries table
    - Allow anonymous users to read active countries
    - Allow authenticated users to read active countries

  2. Changes
    - Drop existing policies if they exist
    - Create new policies with correct permissions
    - Ensure anon role can read countries data
*/

-- Drop existing policies if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'countries' AND policyname = 'countries_public_access'
  ) THEN
    DROP POLICY "countries_public_access" ON countries;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'countries' AND policyname = 'countries_read_access'
  ) THEN
    DROP POLICY "countries_read_access" ON countries;
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users to read active countries
CREATE POLICY "Enable public read for active countries"
  ON countries
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policy for authenticated users to read active countries
CREATE POLICY "Enable authenticated read for active countries"
  ON countries
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Grant necessary permissions to anon role
GRANT SELECT ON countries TO anon;
GRANT SELECT ON countries TO authenticated;