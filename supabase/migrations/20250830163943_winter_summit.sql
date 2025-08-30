/*
  # Fix services system - remove admin services management

  1. Problem
    - Admin panel should only manage marketing content, not services
    - Consultant panel should manage their own services
    - Marketing site should show mock services, not database services

  2. Solution
    - Remove services management from admin panel
    - Keep services management in consultant panel only
    - Use mock data for marketing site services

  3. Security
    - Only consultants can manage their own services
    - Marketing site uses static mock data
*/

-- Remove any global marketing services that shouldn't exist
DELETE FROM services WHERE consultant_id IS NULL AND is_marketing_service = true;

-- Ensure proper RLS policies for services
DROP POLICY IF EXISTS "Admin manages marketing services" ON services;
DROP POLICY IF EXISTS "Public can read marketing services" ON services;

-- Only consultants can manage their own services
CREATE POLICY "Consultants manage own services only"
  ON services
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Public can read active consultant services
CREATE POLICY "Public can read consultant services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true AND is_active = true AND consultant_id IS NOT NULL);