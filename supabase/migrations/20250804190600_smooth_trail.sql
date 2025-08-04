/*
  # Add service recommendation columns to service_payment_requests table

  1. New Columns
    - `is_recommendation` (boolean, default false) - Indicates if this is a service recommendation
    - `recommended_service_id` (uuid, nullable) - Foreign key to consultant_custom_services
    - `recommendation_message` (text, nullable) - Personal message from consultant
    - `recommendation_status` (varchar, nullable) - Status: pending, accepted, rejected
    - `recommended_at` (timestamp, nullable) - When the recommendation was made

  2. Security
    - Update existing RLS policies to handle recommendations
*/

-- Add new columns for service recommendations
DO $$
BEGIN
  -- Add is_recommendation column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_payment_requests' AND column_name = 'is_recommendation'
  ) THEN
    ALTER TABLE service_payment_requests ADD COLUMN is_recommendation boolean DEFAULT false;
  END IF;

  -- Add recommended_service_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_payment_requests' AND column_name = 'recommended_service_id'
  ) THEN
    ALTER TABLE service_payment_requests ADD COLUMN recommended_service_id uuid;
  END IF;

  -- Add recommendation_message column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_payment_requests' AND column_name = 'recommendation_message'
  ) THEN
    ALTER TABLE service_payment_requests ADD COLUMN recommendation_message text;
  END IF;

  -- Add recommendation_status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_payment_requests' AND column_name = 'recommendation_status'
  ) THEN
    ALTER TABLE service_payment_requests ADD COLUMN recommendation_status varchar(20);
  END IF;

  -- Add recommended_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_payment_requests' AND column_name = 'recommended_at'
  ) THEN
    ALTER TABLE service_payment_requests ADD COLUMN recommended_at timestamp with time zone;
  END IF;
END $$;

-- Add foreign key constraint for recommended_service_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'service_payment_requests_recommended_service_id_fkey'
  ) THEN
    ALTER TABLE service_payment_requests 
    ADD CONSTRAINT service_payment_requests_recommended_service_id_fkey 
    FOREIGN KEY (recommended_service_id) REFERENCES consultant_custom_services(id);
  END IF;
END $$;

-- Add check constraint for recommendation_status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'service_payment_requests_recommendation_status_check'
  ) THEN
    ALTER TABLE service_payment_requests 
    ADD CONSTRAINT service_payment_requests_recommendation_status_check 
    CHECK (recommendation_status IN ('pending', 'accepted', 'rejected'));
  END IF;
END $$;