/*
  # Add Service Recommendations Feature

  1. Schema Updates
    - Add `is_recommendation` column to `service_payment_requests` table
    - Add `recommended_service_id` column to link to custom services
    - Add `recommendation_message` column for personalized messages
    - Add `recommendation_status` column to track recommendation lifecycle

  2. Security
    - Update existing RLS policies to handle recommendations
    - Add policy for consultants to create recommendations
    - Add policy for clients to view their recommendations

  3. Indexes
    - Add index for recommendation queries
    - Add index for client recommendation lookups
*/

-- Add recommendation columns to service_payment_requests
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
    ALTER TABLE service_payment_requests ADD COLUMN recommended_service_id uuid REFERENCES consultant_custom_services(id);
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
    ALTER TABLE service_payment_requests ADD COLUMN recommendation_status varchar(20) DEFAULT 'pending';
  END IF;

  -- Add recommended_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_payment_requests' AND column_name = 'recommended_at'
  ) THEN
    ALTER TABLE service_payment_requests ADD COLUMN recommended_at timestamp without time zone;
  END IF;
END $$;

-- Add check constraint for recommendation_status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'service_payment_requests_recommendation_status_check'
  ) THEN
    ALTER TABLE service_payment_requests ADD CONSTRAINT service_payment_requests_recommendation_status_check 
    CHECK (recommendation_status IN ('pending', 'accepted', 'rejected', 'expired'));
  END IF;
END $$;

-- Create index for recommendation queries
CREATE INDEX IF NOT EXISTS idx_service_payment_requests_recommendations 
ON service_payment_requests(client_id, is_recommendation, recommendation_status) 
WHERE is_recommendation = true;

-- Create index for consultant recommendations
CREATE INDEX IF NOT EXISTS idx_service_payment_requests_consultant_recommendations 
ON service_payment_requests(consultant_id, is_recommendation, recommended_at) 
WHERE is_recommendation = true;

-- Update RLS policies for recommendations
CREATE POLICY IF NOT EXISTS "Consultants can create recommendations"
  ON service_payment_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (consultant_id = uid() AND is_recommendation = true);

CREATE POLICY IF NOT EXISTS "Clients can view their recommendations"
  ON service_payment_requests
  FOR SELECT
  TO authenticated
  USING (client_id = uid() AND is_recommendation = true);

CREATE POLICY IF NOT EXISTS "Clients can update recommendation status"
  ON service_payment_requests
  FOR UPDATE
  TO authenticated
  USING (client_id = uid() AND is_recommendation = true)
  WITH CHECK (client_id = uid() AND is_recommendation = true);