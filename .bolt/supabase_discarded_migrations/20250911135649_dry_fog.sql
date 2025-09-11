/*
  # Fix Consultant Alerts Enum Type

  1. Enum Type Creation
    - Create alert_type enum with all required values including 'document_uploaded'
    
  2. Table Update
    - Update consultant_alerts table to use the new enum type
    - Handle existing data safely
    
  3. Constraints
    - Ensure proper constraints are in place
*/

-- First, check if the enum already exists and drop it if needed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
    DROP TYPE alert_type CASCADE;
  END IF;
END $$;

-- Create the alert_type enum with all required values
CREATE TYPE alert_type AS ENUM (
  'document_due',
  'payment_overdue', 
  'task_assigned',
  'client_inactive',
  'tax_notification',
  'document_uploaded',
  'other'
);

-- Check current column type in consultant_alerts
DO $$
BEGIN
  -- If the column exists as text, convert it to the enum
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consultant_alerts' 
    AND column_name = 'alert_type' 
    AND data_type = 'text'
  ) THEN
    -- Update the column to use the enum type
    ALTER TABLE consultant_alerts 
    ALTER COLUMN alert_type TYPE alert_type 
    USING CASE 
      WHEN alert_type = 'document_due' THEN 'document_due'::alert_type
      WHEN alert_type = 'payment_overdue' THEN 'payment_overdue'::alert_type
      WHEN alert_type = 'task_assigned' THEN 'task_assigned'::alert_type
      WHEN alert_type = 'client_inactive' THEN 'client_inactive'::alert_type
      WHEN alert_type = 'tax_notification' THEN 'tax_notification'::alert_type
      WHEN alert_type = 'document_uploaded' THEN 'document_uploaded'::alert_type
      ELSE 'other'::alert_type
    END;
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consultant_alerts' 
    AND column_name = 'alert_type'
  ) THEN
    -- If column doesn't exist, add it
    ALTER TABLE consultant_alerts 
    ADD COLUMN alert_type alert_type DEFAULT 'other'::alert_type;
  END IF;
END $$;

-- Ensure the constraint exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'consultant_alerts_alert_type_check'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_alert_type_check 
    CHECK (alert_type = ANY (ARRAY['document_due'::text, 'payment_overdue'::text, 'task_assigned'::text, 'client_inactive'::text, 'tax_notification'::text, 'document_uploaded'::text, 'other'::text]));
  END IF;
END $$;