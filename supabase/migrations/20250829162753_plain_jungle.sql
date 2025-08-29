/*
  # Add image_url column to services table and update RLS policies

  1. Schema Changes
    - Add `image_url` column to `services` table for service images
    - Column allows NULL values for backward compatibility

  2. Security Updates
    - Add RLS policy for public read access to active services
    - Add RLS policy for public read access to active countries
    - Ensure marketing site can display services and countries publicly

  3. Data Integrity
    - Use IF NOT EXISTS pattern for safe execution
    - Maintain existing data and constraints
*/

-- Add image_url column to services table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE services ADD COLUMN image_url text;
  END IF;
END $$;

-- Create RLS policy for public read access to active services
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' 
    AND policyname = 'Enable public read for active services'
  ) THEN
    CREATE POLICY "Enable public read for active services"
      ON services
      FOR SELECT
      TO anon, authenticated
      USING (is_public = true AND is_active = true);
  END IF;
END $$;

-- Create RLS policy for public read access to active countries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'countries' 
    AND policyname = 'Enable public read for active countries'
  ) THEN
    CREATE POLICY "Enable public read for active countries"
      ON countries
      FOR SELECT
      TO anon, authenticated
      USING (is_active = true);
  END IF;
END $$;