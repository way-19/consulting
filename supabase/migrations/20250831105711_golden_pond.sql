/*
  # Update custom_services table to ensure price field is properly configured

  1. Changes
    - Ensure `price` column exists and is properly typed
    - Set default value to 0 for existing records
    - Add currency column if not exists

  2. Data Updates
    - Update any NULL price values to 0
*/

-- Ensure price column exists with proper type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_services' AND column_name = 'price'
  ) THEN
    ALTER TABLE custom_services ADD COLUMN price NUMERIC(10, 2) DEFAULT 0;
  END IF;
END $$;

-- Ensure currency column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_services' AND column_name = 'currency'
  ) THEN
    ALTER TABLE custom_services ADD COLUMN currency TEXT DEFAULT 'USD';
  END IF;
END $$;

-- Update any NULL price values to 0
UPDATE custom_services 
SET price = 0 
WHERE price IS NULL;

-- Update any NULL currency values to USD
UPDATE custom_services 
SET currency = 'USD' 
WHERE currency IS NULL OR currency = '';