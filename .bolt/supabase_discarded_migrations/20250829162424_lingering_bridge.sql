/*
  # Add image_url column to services table

  1. Schema Changes
    - Add `image_url` column to `services` table for service images
    - Update existing services with sample images

  2. Security
    - Enable public read access for services and countries tables
    - Add RLS policies for marketing site access

  3. Sample Data
    - Update existing services with appropriate images
*/

-- Add image_url column to services table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE services ADD COLUMN image_url text;
  END IF;
END $$;

-- Add RLS policies for public read access
CREATE POLICY IF NOT EXISTS "Enable public read for active services"
  ON services
  FOR SELECT
  TO anon
  USING ((is_public = true) AND (is_active = true));

CREATE POLICY IF NOT EXISTS "Enable public read for countries"
  ON countries
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Update existing services with sample images (if any exist)
UPDATE services 
SET image_url = CASE 
  WHEN title ILIKE '%company%' OR title ILIKE '%formation%' THEN 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
  WHEN title ILIKE '%bank%' THEN 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800'
  WHEN title ILIKE '%tax%' THEN 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800'
  WHEN title ILIKE '%visa%' OR title ILIKE '%residence%' THEN 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800'
  WHEN title ILIKE '%legal%' OR title ILIKE '%compliance%' THEN 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800'
  WHEN title ILIKE '%accounting%' THEN 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800'
  ELSE 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
END
WHERE image_url IS NULL;