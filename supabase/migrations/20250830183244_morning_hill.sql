/*
  # Create Consultant Dashboard Tables

  1. New Tables
    - `clients` - Client management for consultants
    - `tasks` - Task management with time tracking
    - `time_entries` - Normalized time tracking
    - `documents` - Document management with requests
    - `consultant_availability` - Availability settings
    - `notifications` - Real-time notifications
    - `booking_requests` - Client booking requests

  2. Security
    - Enable RLS on all tables
    - Consultant-scoped and client-scoped policies
    - Secure document storage integration

  3. Indexes
    - Performance indexes for all foreign keys
    - Status and date-based indexes
*/

-- Create task_status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'completed', 'cancelled');
  END IF;
END $$;

-- Create priority enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_level') THEN
    CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
  END IF;
END $$;

-- Create document_status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_status') THEN
    CREATE TYPE document_status AS ENUM ('requested', 'pending', 'approved', 'rejected', 'needs_revision');
  END IF;
END $$;

-- Create client_status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_status') THEN
    CREATE TYPE client_status AS ENUM ('active', 'inactive', 'pending', 'completed');
  END IF;
END $$;

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assigned_consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE RESTRICT,
  company_name text,
  status client_status DEFAULT 'pending' NOT NULL,
  priority priority_level DEFAULT 'medium' NOT NULL,
  notes text,
  contact_email text,
  contact_phone text,
  country text,
  industry text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status task_status DEFAULT 'todo' NOT NULL,
  priority priority_level DEFAULT 'medium' NOT NULL,
  due_date timestamptz,
  estimated_hours decimal(5,2),
  actual_hours decimal(5,2) DEFAULT 0,
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

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text,
  category text DEFAULT 'other',
  status document_status DEFAULT 'pending' NOT NULL,
  file_url text,
  file_size bigint,
  is_request boolean DEFAULT false,
  requested_by_consultant_id uuid REFERENCES user_profiles(id),
  due_date timestamptz,
  notes text,
  uploaded_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
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
  status text DEFAULT 'pending' NOT NULL,
  confirmed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS clients_consultant_idx ON clients(assigned_consultant_id);
CREATE INDEX IF NOT EXISTS clients_status_idx ON clients(status);
CREATE INDEX IF NOT EXISTS clients_priority_idx ON clients(priority);

CREATE INDEX IF NOT EXISTS tasks_client_idx ON tasks(client_id);
CREATE INDEX IF NOT EXISTS tasks_consultant_idx ON tasks(consultant_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);

CREATE INDEX IF NOT EXISTS time_entries_task_idx ON time_entries(task_id);
CREATE INDEX IF NOT EXISTS time_entries_consultant_idx ON time_entries(consultant_id);
CREATE INDEX IF NOT EXISTS time_entries_date_idx ON time_entries(date);

CREATE INDEX IF NOT EXISTS documents_client_idx ON documents(client_id);
CREATE INDEX IF NOT EXISTS documents_status_idx ON documents(status);
CREATE INDEX IF NOT EXISTS documents_category_idx ON documents(category);

CREATE INDEX IF NOT EXISTS notifications_recipient_idx ON notifications(recipient_profile_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(read_at);
CREATE INDEX IF NOT EXISTS notifications_created_idx ON notifications(created_at);

CREATE INDEX IF NOT EXISTS booking_requests_client_idx ON booking_requests(client_id);
CREATE INDEX IF NOT EXISTS booking_requests_consultant_idx ON booking_requests(consultant_id);
CREATE INDEX IF NOT EXISTS booking_requests_status_idx ON booking_requests(status);

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clients
CREATE POLICY "Consultants manage assigned clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (assigned_consultant_id = auth.uid())
  WITH CHECK (assigned_consultant_id = auth.uid());

CREATE POLICY "Clients read own profile"
  ON clients
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

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

-- RLS Policies for documents
CREATE POLICY "Consultants manage client documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE assigned_consultant_id = auth.uid()
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE assigned_consultant_id = auth.uid()
    )
  );

CREATE POLICY "Clients manage own documents"
  ON documents
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
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultant_availability_updated_at
  BEFORE UPDATE ON consultant_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();