/*
  # Fix Services Table RLS Permissions

  1. Security Updates
    - Ensure proper RLS policies for services table
    - Add policy for anonymous users to read public active services
    - Add policy for authenticated users to read public active services
    - Maintain consultant access to their own services

  2. Changes
    - Fixes service data access for marketing site
    - Ensures service pages display correctly
    - Maintains security while allowing necessary public access
*/

-- Ensure RLS is enabled on services table
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Enable public read for active services" ON services;
DROP POLICY IF EXISTS "Enable read for public services" ON services;
DROP POLICY IF EXISTS "Allow anonymous read for public active services" ON services;

-- Create policy for anonymous users to read public active services
CREATE POLICY "Allow anonymous read for public active services"
  ON services
  FOR SELECT
  TO anon
  USING (is_public = true AND is_active = true);

-- Create policy for authenticated users to read public active services
CREATE POLICY "Allow authenticated read for public active services"
  ON services
  FOR SELECT
  TO authenticated
  USING (is_public = true AND is_active = true);

-- Maintain existing consultant access policy (if it exists)
-- This allows consultants to manage their own services
CREATE POLICY "Enable all for consultant's own services"
  ON services
  FOR ALL
  TO authenticated
  USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

-- Grant necessary permissions
GRANT SELECT ON services TO anon;
GRANT SELECT ON services TO authenticated;