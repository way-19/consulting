/*
  # Add is_active column to marketing_pages table

  1. Schema Changes
    - Add `is_active` column to `marketing_pages` table with default value true
    - This column will be used to enable/disable pages

  2. Data Migration
    - Set all existing pages to active by default
*/

-- Add is_active column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'marketing_pages' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE marketing_pages ADD COLUMN is_active boolean DEFAULT true NOT NULL;
  END IF;
END $$;

-- Update any existing records to be active
UPDATE marketing_pages SET is_active = true WHERE is_active IS NULL;