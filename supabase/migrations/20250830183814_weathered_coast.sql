/*
  # Create missing consultant dashboard tables

  1. New Tables
    - `tasks` - Task management for consultants
    - `time_entries` - Time tracking for tasks
    - `consultant_availability` - Consultant schedule management
    - `notifications` - System notifications
    - `booking_requests` - Client booking requests

  2. Security
    - Enable RLS on all tables
    - Add consultant-scoped and client-scoped policies
    - Ensure proper access control

  3. Sample Data
    - Add test data for Giorgi Meskhi consultant
    - Create sample client and tasks for testing
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo' NOT NULL CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
  priority text DEFAULT 'medium' NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  due_date timestamptz,
  estimated_hours numeric DEFAULT 0,
  actual_hours numeric DEFAULT 0,
  billable boolean DEFAULT true,
  is_client_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create time_entries table
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

-- Create consultant_availability table
CREATE TABLE IF NOT EXISTS consultant_availability (
  consultant_profile_id uuid PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  timezone text DEFAULT 'UTC' NOT NULL,
  calendar_url text,
  weekly jsonb DEFAULT '{}' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  recipient_profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  payload jsonb DEFAULT '{}' NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create booking_requests table
CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  requested_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 60,
  message text,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled')),
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS tasks_client_idx ON tasks(client_id);
CREATE INDEX IF NOT EXISTS tasks_consultant_idx ON tasks(consultant_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);

CREATE INDEX IF NOT EXISTS time_entries_task_idx ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS time_entries_consultant_idx ON time_entries(consultant_id);
CREATE INDEX IF NOT EXISTS time_entries_date_idx ON time_entries(date);

CREATE INDEX IF NOT EXISTS notifications_recipient_idx ON notifications(recipient_profile_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(read_at);

CREATE INDEX IF NOT EXISTS booking_requests_client_idx ON booking_requests(client_id);
CREATE INDEX IF NOT EXISTS booking_requests_consultant_idx ON booking_requests(consultant_id);
CREATE INDEX IF NOT EXISTS booking_requests_status_idx ON booking_requests(status);

-- Enable RLS on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Consultants manage own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Clients read visible tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    is_client_visible = true AND
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

-- RLS Policies for time_entries
CREATE POLICY "Consultants manage own time entries"
  ON time_entries
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for consultant_availability
CREATE POLICY "Consultants manage own availability"
  ON consultant_availability
  FOR ALL
  TO authenticated
  USING (consultant_profile_id = auth.uid())
  WITH CHECK (consultant_profile_id = auth.uid());

CREATE POLICY "Public read consultant availability"
  ON consultant_availability
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for notifications
CREATE POLICY "Users read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (recipient_profile_id = auth.uid());

CREATE POLICY "Users update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (recipient_profile_id = auth.uid())
  WITH CHECK (recipient_profile_id = auth.uid());

-- RLS Policies for booking_requests
CREATE POLICY "Consultants manage booking requests"
  ON booking_requests
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

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
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
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