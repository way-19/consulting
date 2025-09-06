/*
  # Create meetings table for calendar integration

  1. New Tables
    - `meetings`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `consultant_id` (uuid, foreign key to user_profiles)
      - `title` (text, meeting title)
      - `description` (text, meeting description)
      - `start_time` (timestamptz, meeting start time)
      - `end_time` (timestamptz, meeting end time)
      - `meeting_type` (text, video/phone/in_person)
      - `status` (text, scheduled/confirmed/completed/cancelled/rescheduled)
      - `meeting_url` (text, video call link)
      - `location` (text, for in-person meetings)
      - `notes` (text, meeting notes)
      - `reminder_sent` (boolean, reminder email sent)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `meetings` table
    - Add policies for clients to read their own meetings
    - Add policies for consultants to manage assigned client meetings
    - Add policies for admins to manage all meetings

  3. Indexes
    - Index on client_id for fast client meeting lookup
    - Index on consultant_id for consultant meeting lookup
    - Index on start_time for time-based queries
    - Index on status for status filtering

  4. Constraints
    - Check constraint on meeting_type enum
    - Check constraint on status enum
    - Check constraint that end_time > start_time
*/

-- Create meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  consultant_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  meeting_type text NOT NULL DEFAULT 'video',
  status text NOT NULL DEFAULT 'scheduled',
  meeting_url text,
  location text,
  notes text,
  reminder_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT meetings_type_check 
    CHECK (meeting_type IN ('video', 'phone', 'in_person')),
  CONSTRAINT meetings_status_check 
    CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  CONSTRAINT meetings_time_check 
    CHECK (end_time > start_time)
);

-- Add foreign key constraints
ALTER TABLE meetings
ADD CONSTRAINT meetings_client_id_fkey 
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;

ALTER TABLE meetings
ADD CONSTRAINT meetings_consultant_id_fkey 
  FOREIGN KEY (consultant_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_meetings_client_id 
  ON meetings(client_id);

CREATE INDEX IF NOT EXISTS idx_meetings_consultant_id 
  ON meetings(consultant_id);

CREATE INDEX IF NOT EXISTS idx_meetings_start_time 
  ON meetings(start_time);

CREATE INDEX IF NOT EXISTS idx_meetings_status 
  ON meetings(status);

CREATE INDEX IF NOT EXISTS idx_meetings_type 
  ON meetings(meeting_type);

-- Enable Row Level Security
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage all meetings"
  ON meetings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
      AND user_profiles.is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
      AND user_profiles.is_active = true
    )
  );

CREATE POLICY "Clients can read their own meetings"
  ON meetings
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT clients.id 
      FROM clients 
      WHERE clients.profile_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create meetings with their consultant"
  ON meetings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT clients.id 
      FROM clients 
      WHERE clients.profile_id = auth.uid()
    )
    AND consultant_id IN (
      SELECT clients.assigned_consultant_id 
      FROM clients 
      WHERE clients.profile_id = auth.uid()
      AND clients.assigned_consultant_id IS NOT NULL
    )
  );

CREATE POLICY "Clients can update their own meetings"
  ON meetings
  FOR UPDATE
  TO authenticated
  USING (
    client_id IN (
      SELECT clients.id 
      FROM clients 
      WHERE clients.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT clients.id 
      FROM clients 
      WHERE clients.profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can manage assigned client meetings"
  ON meetings
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_meetings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meetings_updated_at_trigger
  BEFORE UPDATE ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION update_meetings_updated_at();