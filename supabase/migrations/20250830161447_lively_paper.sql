/*
  # Fix service_faqs trigger error and complete SaaS system

  1. Problem
    - Trigger "update_service_faqs_updated_at" already exists
    - Need to fix the existing table structure

  2. Solution
    - Drop existing trigger if it exists
    - Ensure proper table structure for SaaS system
    - Add missing columns for consultant-specific services

  3. SaaS System Requirements
    - Consultants manage their own services and FAQs
    - Clients can purchase services and get invoices
    - Admin manages global marketing content only
*/

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS update_service_faqs_updated_at ON service_faqs;

-- Ensure the table has all required columns for SaaS system
DO $$
BEGIN
  -- Add consultant_id to service_faqs if not exists (for consultant ownership)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_faqs' AND column_name = 'consultant_id'
  ) THEN
    ALTER TABLE service_faqs ADD COLUMN consultant_id uuid REFERENCES user_profiles(id);
  END IF;

  -- Add country_id to service_faqs if not exists (for country-specific FAQs)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_faqs' AND column_name = 'country_id'
  ) THEN
    ALTER TABLE service_faqs ADD COLUMN country_id uuid REFERENCES countries(id);
  END IF;
END $$;

-- Update existing service_faqs to have consultant_id from their services
UPDATE service_faqs 
SET consultant_id = services.consultant_id,
    country_id = services.country_id
FROM services 
WHERE service_faqs.service_id = services.id 
AND service_faqs.consultant_id IS NULL;

-- Recreate the trigger properly
CREATE TRIGGER update_service_faqs_updated_at
  BEFORE UPDATE ON service_faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policies for proper SaaS access control
DROP POLICY IF EXISTS "Enable read for active FAQs" ON service_faqs;
DROP POLICY IF EXISTS "Enable all for service owner" ON service_faqs;

-- Public can read active FAQs
CREATE POLICY "Public can read active FAQs"
  ON service_faqs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Consultants can manage their own service FAQs
CREATE POLICY "Consultants manage own service FAQs"
  ON service_faqs
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Ensure services table has proper SaaS structure
DO $$
BEGIN
  -- Add is_featured column for highlighting services
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE services ADD COLUMN is_featured boolean DEFAULT false NOT NULL;
  END IF;

  -- Add category column for service categorization
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'category'
  ) THEN
    ALTER TABLE services ADD COLUMN category text DEFAULT 'General' NOT NULL;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS service_faqs_consultant_idx ON service_faqs(consultant_id);
CREATE INDEX IF NOT EXISTS service_faqs_country_idx ON service_faqs(country_id);
CREATE INDEX IF NOT EXISTS services_featured_idx ON services(is_featured);
CREATE INDEX IF NOT EXISTS services_category_idx ON services(category);