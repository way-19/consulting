/*
  # Consultant Availability Management System

  1. New Tables
    - `consultant_availability`
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `day_of_week` (text, monday-sunday)
      - `start_time` (time)
      - `end_time` (time)
      - `is_available` (boolean)
      - `timezone` (text)
      - `slot_duration_minutes` (integer)
      - `price_per_hour` (numeric)
      - `currency` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `consultant_blocked_times`
      - `id` (uuid, primary key)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `start_datetime` (timestamptz)
      - `end_datetime` (timestamptz)
      - `reason` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for consultants to manage their own availability
    - Add policies for clients to read their consultant's availability

  3. Sample Data
    - Add sample availability for existing consultants
    - Add some blocked times for realistic scenario
*/

-- Create consultant_availability table
CREATE TABLE IF NOT EXISTS consultant_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  day_of_week text NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  timezone text DEFAULT 'UTC',
  slot_duration_minutes integer DEFAULT 60,
  price_per_hour numeric(10,2) DEFAULT 150.00,
  currency text DEFAULT 'USD',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consultant_blocked_times table
CREATE TABLE IF NOT EXISTS consultant_blocked_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  start_datetime timestamptz NOT NULL,
  end_datetime timestamptz NOT NULL,
  reason text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE consultant_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_blocked_times ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultant_availability
CREATE POLICY "Consultants can manage own availability"
  ON consultant_availability
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Clients can read assigned consultant availability"
  ON consultant_availability
  FOR SELECT
  TO authenticated
  USING (
    consultant_id IN (
      SELECT assigned_consultant_id
      FROM clients
      WHERE profile_id = auth.uid()
      AND assigned_consultant_id IS NOT NULL
    )
  );

CREATE POLICY "Admins can manage all availability"
  ON consultant_availability
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for consultant_blocked_times
CREATE POLICY "Consultants can manage own blocked times"
  ON consultant_blocked_times
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Clients can read assigned consultant blocked times"
  ON consultant_blocked_times
  FOR SELECT
  TO authenticated
  USING (
    consultant_id IN (
      SELECT assigned_consultant_id
      FROM clients
      WHERE profile_id = auth.uid()
      AND assigned_consultant_id IS NOT NULL
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_consultant_availability_consultant_id ON consultant_availability(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultant_availability_day_of_week ON consultant_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_consultant_blocked_times_consultant_id ON consultant_blocked_times(consultant_id);
CREATE INDEX IF NOT EXISTS idx_consultant_blocked_times_datetime ON consultant_blocked_times(start_datetime, end_datetime);

-- Updated at trigger function for consultant_availability
CREATE OR REPLACE FUNCTION update_consultant_availability_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consultant_availability_updated_at_trigger
  BEFORE UPDATE ON consultant_availability
  FOR EACH ROW EXECUTE FUNCTION update_consultant_availability_updated_at();

-- Insert sample availability data for existing consultant
DO $$
DECLARE
  consultant_uuid uuid;
BEGIN
  -- Get Giorgi Meskhi's ID (our test consultant)
  SELECT id INTO consultant_uuid 
  FROM user_profiles 
  WHERE email = 'giorgi.meskhi@consulting19.com' AND role = 'consultant'
  LIMIT 1;

  -- If consultant exists, add availability
  IF consultant_uuid IS NOT NULL THEN
    -- Monday to Friday: 9 AM to 6 PM (Georgian timezone)
    INSERT INTO consultant_availability (consultant_id, day_of_week, start_time, end_time, timezone, price_per_hour, currency) VALUES
    (consultant_uuid, 'monday', '09:00', '18:00', 'Asia/Tbilisi', 180.00, 'USD'),
    (consultant_uuid, 'tuesday', '09:00', '18:00', 'Asia/Tbilisi', 180.00, 'USD'),
    (consultant_uuid, 'wednesday', '09:00', '18:00', 'Asia/Tbilisi', 180.00, 'USD'),
    (consultant_uuid, 'thursday', '09:00', '18:00', 'Asia/Tbilisi', 180.00, 'USD'),
    (consultant_uuid, 'friday', '09:00', '18:00', 'Asia/Tbilisi', 180.00, 'USD'),
    -- Saturday: Half day
    (consultant_uuid, 'saturday', '10:00', '14:00', 'Asia/Tbilisi', 200.00, 'USD');
    
    -- Add some blocked times (holidays, meetings, etc.)
    INSERT INTO consultant_blocked_times (consultant_id, start_datetime, end_datetime, reason) VALUES
    (consultant_uuid, '2025-01-15 10:00:00+04', '2025-01-15 12:00:00+04', 'Client meeting with TechCorp'),
    (consultant_uuid, '2025-01-17 14:00:00+04', '2025-01-17 16:00:00+04', 'Government office visit'),
    (consultant_uuid, '2025-01-20 09:00:00+04', '2025-01-20 18:00:00+04', 'National holiday');

    RAISE NOTICE 'Sample consultant availability created for %', consultant_uuid;
  ELSE
    RAISE NOTICE 'No consultant found with email giorgi.meskhi@consulting19.com';
  END IF;
END $$;