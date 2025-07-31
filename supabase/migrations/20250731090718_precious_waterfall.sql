/*
  # Client Dashboard System Tables

  1. New Tables
    - `client_documents` - Document management for clients
    - `client_notifications` - Real-time notifications
    - `service_reviews` - Client feedback system
    - `application_status_history` - Status tracking

  2. Enhanced Tables
    - Extended `users` table with client profile fields
    - Enhanced `applications` table structure

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for client access
*/

-- 1. Enhanced Applications (already exists but add missing columns)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'priority_level'
  ) THEN
    ALTER TABLE applications ADD COLUMN priority_level VARCHAR(20) DEFAULT 'normal';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'estimated_completion'
  ) THEN
    ALTER TABLE applications ADD COLUMN estimated_completion DATE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'actual_completion'
  ) THEN
    ALTER TABLE applications ADD COLUMN actual_completion DATE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'client_satisfaction_rating'
  ) THEN
    ALTER TABLE applications ADD COLUMN client_satisfaction_rating INTEGER;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'consultant_notes'
  ) THEN
    ALTER TABLE applications ADD COLUMN consultant_notes TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'applications' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE applications ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
  END IF;
END $$;

-- 2. Client Documents
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id) NOT NULL,
  application_id UUID REFERENCES applications(id),
  legacy_payment_id INTEGER,
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(100) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  upload_source VARCHAR(50) DEFAULT 'client',
  status VARCHAR(50) DEFAULT 'pending_review',
  consultant_notes TEXT,
  expiration_date DATE,
  is_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can manage own documents"
  ON client_documents
  FOR ALL
  TO authenticated
  USING (client_id = auth.uid());

-- 3. Client Notifications
CREATE TABLE IF NOT EXISTS client_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id) NOT NULL,
  consultant_id UUID REFERENCES users(id),
  notification_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  priority VARCHAR(20) DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE client_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can read own notifications"
  ON client_notifications
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Consultants can create client notifications"
  ON client_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (consultant_id = auth.uid());

-- 4. Service Reviews & Ratings
CREATE TABLE IF NOT EXISTS service_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id) NOT NULL,
  consultant_id UUID REFERENCES users(id) NOT NULL,
  application_id UUID REFERENCES applications(id),
  service_payment_request_id UUID REFERENCES service_payment_requests(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  service_category VARCHAR(100),
  would_recommend BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  consultant_response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE service_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can manage own reviews"
  ON service_reviews
  FOR ALL
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Consultants can read own reviews"
  ON service_reviews
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

-- 5. Client Profile Extensions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE users ADD COLUMN company_name VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'business_type'
  ) THEN
    ALTER TABLE users ADD COLUMN business_type VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone VARCHAR(50);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'address'
  ) THEN
    ALTER TABLE users ADD COLUMN address TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'preferred_currency'
  ) THEN
    ALTER TABLE users ADD COLUMN preferred_currency VARCHAR(3) DEFAULT 'USD';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE users ADD COLUMN timezone VARCHAR(50) DEFAULT 'UTC';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'marketing_consent'
  ) THEN
    ALTER TABLE users ADD COLUMN marketing_consent BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 6. Application Status History
CREATE TABLE IF NOT EXISTS application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) NOT NULL,
  legacy_payment_id INTEGER,
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by UUID REFERENCES users(id),
  change_reason TEXT,
  estimated_completion DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read related status history"
  ON application_status_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE applications.id = application_status_history.application_id 
      AND (applications.client_id = auth.uid() OR applications.consultant_id = auth.uid())
    )
  );

-- Insert sample data for testing
INSERT INTO client_notifications (client_id, consultant_id, notification_type, title, message, priority)
SELECT 
  u1.id,
  u2.id,
  'welcome',
  'Welcome to CONSULTING19!',
  'Your account has been created successfully. Start by browsing our services.',
  'normal'
FROM users u1
CROSS JOIN users u2
WHERE u1.role = 'client' AND u2.role = 'consultant'
LIMIT 3
ON CONFLICT DO NOTHING;