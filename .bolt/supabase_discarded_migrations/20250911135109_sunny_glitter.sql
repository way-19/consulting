/*
  # Create alert_type enum and update consultant_alerts table

  1. New Enum Type
    - `alert_type` enum with all necessary values including 'document_uploaded'
  
  2. Table Updates
    - Update `consultant_alerts` table to use the new enum
    - Add constraint to ensure valid alert types
  
  3. Security
    - Maintain existing RLS policies
*/

-- First, check if the enum already exists and drop it if needed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
    DROP TYPE alert_type CASCADE;
  END IF;
END $$;

-- Create the alert_type enum with all necessary values
CREATE TYPE alert_type AS ENUM (
  'document_due',
  'payment_overdue', 
  'task_assigned',
  'client_inactive',
  'tax_notification',
  'document_uploaded',
  'other'
);

-- Update consultant_alerts table to use the enum if the column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consultant_alerts' AND column_name = 'alert_type'
  ) THEN
    -- If column exists but is text, convert it to enum
    ALTER TABLE consultant_alerts 
    ALTER COLUMN alert_type TYPE alert_type 
    USING alert_type::alert_type;
  ELSE
    -- If column doesn't exist, add it
    ALTER TABLE consultant_alerts 
    ADD COLUMN alert_type alert_type DEFAULT 'other';
  END IF;
END $$;

-- Add check constraint to ensure valid alert types
ALTER TABLE consultant_alerts 
DROP CONSTRAINT IF EXISTS consultant_alerts_alert_type_check;

ALTER TABLE consultant_alerts 
ADD CONSTRAINT consultant_alerts_alert_type_check 
CHECK (alert_type IN ('document_due', 'payment_overdue', 'task_assigned', 'client_inactive', 'tax_notification', 'document_uploaded', 'other'));