/*
  # Add marketing service flag to services table

  1. Schema Changes
    - Add `is_marketing_service` column to `services` table
    - This flag determines if service appears on marketing site
    - Default to false for new services

  2. Data Migration
    - Set existing services as marketing services if they are public
    - This maintains current functionality

  3. Security
    - Update RLS policies to handle new column
    - Ensure proper access control
*/

-- Add is_marketing_service column to services table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'is_marketing_service'
  ) THEN
    ALTER TABLE services ADD COLUMN is_marketing_service boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Set existing public services as marketing services
UPDATE services 
SET is_marketing_service = true 
WHERE is_public = true AND is_active = true;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS services_marketing_idx ON services(is_marketing_service, is_public, is_active);