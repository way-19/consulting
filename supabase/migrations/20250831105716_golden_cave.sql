/*
  # Add custom_service_id relation to service_orders table

  1. Changes
    - Add `custom_service_id` column to link orders with service offerings
    - Add foreign key constraint to custom_services table

  2. Purpose
    - Track which custom service offering led to each order
    - Enable better analytics and reporting
*/

-- Add custom_service_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_orders' AND column_name = 'custom_service_id'
  ) THEN
    ALTER TABLE service_orders 
    ADD COLUMN custom_service_id UUID REFERENCES custom_services(id);
  END IF;
END $$;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_service_orders_custom_service_id 
ON service_orders(custom_service_id);