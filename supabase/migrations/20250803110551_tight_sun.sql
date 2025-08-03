/*
  # Add Payment Tracking and Country-Based Consultant System

  1. New Tables
    - `client_payment_schedules` - Tracks upcoming payments for clients
    - `consultant_country_assignments` - Maps consultants to specific countries
    - `cross_country_service_requests` - Handles requests for services in different countries

  2. Table Updates
    - Add `primary_country_id` to users table for initial country assignment
    - Add `service_country_id` to applications for country-specific services

  3. Security
    - Enable RLS on all new tables
    - Add policies for country-based access control
    - Ensure consultants only see their country clients
*/

-- Add primary country to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'primary_country_id'
  ) THEN
    ALTER TABLE users ADD COLUMN primary_country_id integer REFERENCES countries(id);
  END IF;
END $$;

-- Add service country to applications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'service_country_id'
  ) THEN
    ALTER TABLE applications ADD COLUMN service_country_id integer REFERENCES countries(id);
  END IF;
END $$;

-- Client payment schedules table
CREATE TABLE IF NOT EXISTS client_payment_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES users(id),
  application_id uuid REFERENCES applications(id),
  payment_type varchar(50) NOT NULL,
  description text NOT NULL,
  amount numeric(10,2) NOT NULL,
  currency varchar(3) DEFAULT 'USD',
  due_date date NOT NULL,
  status varchar(20) DEFAULT 'pending',
  recurring boolean DEFAULT false,
  recurring_interval varchar(20),
  next_payment_date date,
  consultant_id uuid REFERENCES users(id),
  country_id integer REFERENCES countries(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Consultant country assignments table
CREATE TABLE IF NOT EXISTS consultant_country_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES users(id),
  country_id integer NOT NULL REFERENCES countries(id),
  is_primary boolean DEFAULT false,
  assignment_date timestamptz DEFAULT now(),
  status boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(consultant_id, country_id)
);

-- Cross country service requests table
CREATE TABLE IF NOT EXISTS cross_country_service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES users(id),
  requesting_consultant_id uuid REFERENCES users(id),
  target_country_id integer NOT NULL REFERENCES countries(id),
  assigned_consultant_id uuid REFERENCES users(id),
  service_type varchar(100) NOT NULL,
  service_description text,
  estimated_amount numeric(10,2),
  currency varchar(3) DEFAULT 'USD',
  priority varchar(20) DEFAULT 'normal',
  status varchar(20) DEFAULT 'pending',
  client_notes text,
  consultant_notes text,
  assignment_date timestamptz,
  completion_date timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE client_payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_country_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cross_country_service_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_payment_schedules
CREATE POLICY "Clients can read own payment schedules"
  ON client_payment_schedules
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Consultants can read assigned client payments"
  ON client_payment_schedules
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Consultants can update assigned client payments"
  ON client_payment_schedules
  FOR UPDATE
  TO authenticated
  USING (consultant_id = auth.uid());

-- RLS Policies for consultant_country_assignments
CREATE POLICY "Consultants can read own country assignments"
  ON consultant_country_assignments
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can manage country assignments"
  ON consultant_country_assignments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- RLS Policies for cross_country_service_requests
CREATE POLICY "Clients can read own cross country requests"
  ON cross_country_service_requests
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Consultants can read assigned requests"
  ON cross_country_service_requests
  FOR SELECT
  TO authenticated
  USING (
    requesting_consultant_id = auth.uid() OR 
    assigned_consultant_id = auth.uid()
  );

CREATE POLICY "Consultants can update assigned requests"
  ON cross_country_service_requests
  FOR UPDATE
  TO authenticated
  USING (assigned_consultant_id = auth.uid());

-- Update applications RLS to include country-based access
DROP POLICY IF EXISTS "Users can read own applications" ON applications;

CREATE POLICY "Users can read own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid() OR 
    consultant_id = auth.uid() OR
    (
      EXISTS (
        SELECT 1 FROM consultant_country_assignments cca
        WHERE cca.consultant_id = auth.uid() 
        AND cca.country_id = applications.service_country_id
        AND cca.status = true
      )
    )
  );

-- Insert sample consultant country assignments
INSERT INTO consultant_country_assignments (consultant_id, country_id, is_primary, status)
SELECT 
  u.id,
  c.id,
  true,
  true
FROM users u
CROSS JOIN countries c
WHERE u.role = 'consultant'
AND NOT EXISTS (
  SELECT 1 FROM consultant_country_assignments cca 
  WHERE cca.consultant_id = u.id AND cca.country_id = c.id
)
ON CONFLICT (consultant_id, country_id) DO NOTHING;

-- Insert sample payment schedules for existing clients
INSERT INTO client_payment_schedules (
  client_id, 
  payment_type, 
  description, 
  amount, 
  due_date, 
  status,
  country_id
)
SELECT 
  u.id,
  'accounting_fee',
  'Monthly accounting services fee',
  299.00,
  CURRENT_DATE + INTERVAL '15 days',
  'pending',
  u.country_id
FROM users u
WHERE u.role = 'client'
AND NOT EXISTS (
  SELECT 1 FROM client_payment_schedules cps 
  WHERE cps.client_id = u.id AND cps.payment_type = 'accounting_fee'
)
ON CONFLICT DO NOTHING;

INSERT INTO client_payment_schedules (
  client_id, 
  payment_type, 
  description, 
  amount, 
  due_date, 
  status,
  recurring,
  recurring_interval,
  country_id
)
SELECT 
  u.id,
  'virtual_address',
  'Virtual address service fee',
  99.00,
  CURRENT_DATE + INTERVAL '30 days',
  'pending',
  true,
  'monthly',
  u.country_id
FROM users u
WHERE u.role = 'client'
AND NOT EXISTS (
  SELECT 1 FROM client_payment_schedules cps 
  WHERE cps.client_id = u.id AND cps.payment_type = 'virtual_address'
)
ON CONFLICT DO NOTHING;