/*
  # Fix Consultant Dashboard Schema Issues

  1. Problem
    - Column "client_id" does not exist in some tables
    - Need to ensure all required columns exist for consultant dashboard

  2. Solution
    - Add missing columns to existing tables
    - Ensure proper foreign key relationships
    - Fix any schema inconsistencies

  3. Tables to Fix
    - Ensure clients table has all required columns
    - Ensure tasks table has client_id foreign key
    - Ensure documents table has client_id foreign key
    - Add any missing columns for consultant dashboard functionality
*/

-- Ensure clients table exists with all required columns
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assigned_consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE RESTRICT,
  company_name text,
  status text DEFAULT 'pending' NOT NULL,
  priority text DEFAULT 'medium' NOT NULL,
  notes text,
  contact_email text,
  contact_phone text,
  country text,
  industry text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add client_id to tasks table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'client_id'
  ) THEN
    ALTER TABLE tasks ADD COLUMN client_id uuid REFERENCES clients(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add client_id to documents table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'client_id'
  ) THEN
    ALTER TABLE documents ADD COLUMN client_id uuid REFERENCES clients(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ensure time_entries table exists
CREATE TABLE IF NOT EXISTS time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  minutes integer NOT NULL,
  description text,
  date date DEFAULT CURRENT_DATE,
  billable boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Ensure consultant_availability table exists
CREATE TABLE IF NOT EXISTS consultant_availability (
  consultant_profile_id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  timezone text DEFAULT 'UTC' NOT NULL,
  calendar_url text,
  weekly jsonb DEFAULT '{}' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure notifications table exists
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  recipient_profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  payload jsonb DEFAULT '{}' NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Ensure booking_requests table exists
CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  requested_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  message text,
  status text DEFAULT 'pending' NOT NULL,
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS clients_consultant_idx ON clients(assigned_consultant_id);
CREATE INDEX IF NOT EXISTS clients_profile_idx ON clients(profile_id);
CREATE INDEX IF NOT EXISTS tasks_client_idx ON tasks(client_id);
CREATE INDEX IF NOT EXISTS tasks_consultant_idx ON tasks(consultant_id);
CREATE INDEX IF NOT EXISTS documents_client_idx ON documents(client_id);
CREATE INDEX IF NOT EXISTS time_entries_task_idx ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS time_entries_consultant_idx ON time_entries(consultant_id);
CREATE INDEX IF NOT EXISTS notifications_recipient_idx ON notifications(recipient_profile_id);
CREATE INDEX IF NOT EXISTS booking_requests_client_idx ON booking_requests(client_id);
CREATE INDEX IF NOT EXISTS booking_requests_consultant_idx ON booking_requests(consultant_id);

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
DROP POLICY IF EXISTS "Consultants manage assigned clients" ON clients;
CREATE POLICY "Consultants manage assigned clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (assigned_consultant_id = auth.uid())
  WITH CHECK (assigned_consultant_id = auth.uid());

DROP POLICY IF EXISTS "Clients read own profile" ON clients;
CREATE POLICY "Clients read own profile"
  ON clients
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- RLS Policies for time_entries
DROP POLICY IF EXISTS "Consultants manage own time entries" ON time_entries;
CREATE POLICY "Consultants manage own time entries"
  ON time_entries
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for consultant_availability
DROP POLICY IF EXISTS "Consultants manage own availability" ON consultant_availability;
CREATE POLICY "Consultants manage own availability"
  ON consultant_availability
  FOR ALL
  TO authenticated
  USING (consultant_profile_id = auth.uid())
  WITH CHECK (consultant_profile_id = auth.uid());

DROP POLICY IF EXISTS "Public read consultant availability" ON consultant_availability;
CREATE POLICY "Public read consultant availability"
  ON consultant_availability
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for notifications
DROP POLICY IF EXISTS "Users read own notifications" ON notifications;
CREATE POLICY "Users read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (recipient_profile_id = auth.uid());

DROP POLICY IF EXISTS "Users update own notifications" ON notifications;
CREATE POLICY "Users update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (recipient_profile_id = auth.uid())
  WITH CHECK (recipient_profile_id = auth.uid());

-- RLS Policies for booking_requests
DROP POLICY IF EXISTS "Consultants manage booking requests" ON booking_requests;
CREATE POLICY "Consultants manage booking requests"
  ON booking_requests
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

DROP POLICY IF EXISTS "Clients manage own booking requests" ON booking_requests;
CREATE POLICY "Clients manage own booking requests"
  ON booking_requests
  FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultant_availability_updated_at
  BEFORE UPDATE ON consultant_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (Giorgi Meskhi consultant)
DO $$
DECLARE
  giorgi_id uuid;
  client_test_id uuid;
  client_record_id uuid;
BEGIN
  -- Get Giorgi's user ID
  SELECT id INTO giorgi_id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com';
  
  -- Get test client user ID
  SELECT id INTO client_test_id FROM user_profiles WHERE email = 'client@consulting19.com';
  
  IF giorgi_id IS NOT NULL AND client_test_id IS NOT NULL THEN
    -- Insert test client record
    INSERT INTO clients (
      profile_id,
      assigned_consultant_id,
      company_name,
      status,
      priority,
      contact_email,
      country,
      industry
    ) VALUES (
      client_test_id,
      giorgi_id,
      'Test Company LLC',
      'active',
      'high',
      'client@consulting19.com',
      'Georgia',
      'Technology'
    ) RETURNING id INTO client_record_id;
    
    -- Insert sample tasks
    INSERT INTO tasks (
      client_id,
      consultant_id,
      title,
      description,
      status,
      priority,
      estimated_hours,
      billable,
      is_client_visible
    ) VALUES 
    (
      client_record_id,
      giorgi_id,
      'Company Formation Documents',
      'Prepare and review company formation documents for Georgia LLC',
      'in_progress',
      'high',
      8.0,
      true,
      true
    ),
    (
      client_record_id,
      giorgi_id,
      'Banking Setup',
      'Assist with corporate banking account opening',
      'todo',
      'medium',
      4.0,
      true,
      true
    );
    
    -- Insert sample availability
    INSERT INTO consultant_availability (
      consultant_profile_id,
      timezone,
      weekly
    ) VALUES (
      giorgi_id,
      'Asia/Tbilisi',
      '{
        "monday": {"enabled": true, "morning": true, "afternoon": true, "evening": false},
        "tuesday": {"enabled": true, "morning": true, "afternoon": true, "evening": false},
        "wednesday": {"enabled": true, "morning": true, "afternoon": true, "evening": false},
        "thursday": {"enabled": true, "morning": true, "afternoon": true, "evening": false},
        "friday": {"enabled": true, "morning": true, "afternoon": false, "evening": false},
        "saturday": {"enabled": false, "morning": false, "afternoon": false, "evening": false},
        "sunday": {"enabled": false, "morning": false, "afternoon": false, "evening": false}
      }'::jsonb
    ) ON CONFLICT (consultant_profile_id) DO NOTHING;
    
  END IF;
END $$;