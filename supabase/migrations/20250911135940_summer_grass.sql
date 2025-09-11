/*
  # Fix consultant_alerts alert_type column

  1. Updates
    - Add 'document_uploaded' to existing alert_type check constraint
    - Keep existing text type, just expand allowed values

  2. Security
    - Maintains existing RLS policies
    - No data loss or type conversion issues
*/

-- First, check current constraint and drop it if exists
DO $$
BEGIN
  -- Drop existing check constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'consultant_alerts_alert_type_check' 
    AND table_name = 'consultant_alerts'
  ) THEN
    ALTER TABLE consultant_alerts DROP CONSTRAINT consultant_alerts_alert_type_check;
  END IF;
END $$;

-- Add new check constraint with 'document_uploaded' included
ALTER TABLE consultant_alerts 
ADD CONSTRAINT consultant_alerts_alert_type_check 
CHECK (alert_type IN ('document_due', 'payment_overdue', 'task_assigned', 'client_inactive', 'tax_notification', 'document_uploaded', 'other'));