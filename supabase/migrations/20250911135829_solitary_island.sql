/*
  # Fix Alert Type Enum

  1. Check Current Structure
    - Check if alert_type column exists and its type
    - Check if enum exists
  
  2. Create Enum and Update Column
    - Create alert_type enum if not exists
    - Update column to use enum type safely
  
  3. Add document_uploaded Value
    - Add the new alert type value
*/

-- First, check what we have
DO $$
BEGIN
  -- Check if enum exists
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
    -- Create the enum with all values including document_uploaded
    CREATE TYPE alert_type AS ENUM (
      'document_due',
      'payment_overdue', 
      'task_assigned',
      'client_inactive',
      'tax_notification',
      'document_uploaded',
      'other'
    );
    
    RAISE NOTICE 'Created alert_type enum';
  ELSE
    -- Enum exists, try to add the new value if it doesn't exist
    BEGIN
      ALTER TYPE alert_type ADD VALUE IF NOT EXISTS 'document_uploaded';
      RAISE NOTICE 'Added document_uploaded to existing enum';
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'document_uploaded value may already exist in enum';
    END;
  END IF;
  
  -- Now check if the column needs to be updated
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'consultant_alerts' 
    AND column_name = 'alert_type' 
    AND data_type = 'text'
  ) THEN
    -- Column is text, need to convert to enum
    -- First add a temporary column
    ALTER TABLE consultant_alerts ADD COLUMN alert_type_new alert_type;
    
    -- Copy data with proper casting
    UPDATE consultant_alerts SET alert_type_new = 
      CASE 
        WHEN alert_type = 'document_due' THEN 'document_due'::alert_type
        WHEN alert_type = 'payment_overdue' THEN 'payment_overdue'::alert_type
        WHEN alert_type = 'task_assigned' THEN 'task_assigned'::alert_type
        WHEN alert_type = 'client_inactive' THEN 'client_inactive'::alert_type
        WHEN alert_type = 'tax_notification' THEN 'tax_notification'::alert_type
        WHEN alert_type = 'document_uploaded' THEN 'document_uploaded'::alert_type
        ELSE 'other'::alert_type
      END;
    
    -- Drop old column and rename new one
    ALTER TABLE consultant_alerts DROP COLUMN alert_type;
    ALTER TABLE consultant_alerts RENAME COLUMN alert_type_new TO alert_type;
    
    RAISE NOTICE 'Converted alert_type column from text to enum';
  ELSE
    RAISE NOTICE 'alert_type column is already enum type or does not exist';
  END IF;
  
  -- Ensure the constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'consultant_alerts_alert_type_check'
  ) THEN
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_alert_type_check 
    CHECK (alert_type = ANY (ARRAY['document_due'::text, 'payment_overdue'::text, 'task_assigned'::text, 'client_inactive'::text, 'tax_notification'::text, 'document_uploaded'::text, 'other'::text]));
    
    RAISE NOTICE 'Added alert_type check constraint';
  END IF;
END $$;