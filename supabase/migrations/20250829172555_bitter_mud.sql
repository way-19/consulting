/*
  # Fix Services Table RLS Permissions

  1. Security Updates
    - Ensure RLS is enabled on services table
    - Add safe policy creation for public read access to active services
    - Maintain existing consultant policies

  2. Changes
    - Enable public read for active and public services
    - Use DROP IF EXISTS pattern to avoid conflicts
*/

-- Enable RLS on services table (safe operation)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Drop and recreate public read policies to ensure they work correctly
DROP POLICY IF EXISTS "Enable public read for active services" ON services;
DROP POLICY IF EXISTS "Enable read for public services" ON services;

-- Create policy for public read access to active and public services
CREATE POLICY "Enable public read for active services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true AND is_active = true);

-- Create additional policy for authenticated users
CREATE POLICY "Enable read for public services"
  ON services
  FOR SELECT
  TO authenticated
  USING (is_public = true AND is_active = true);