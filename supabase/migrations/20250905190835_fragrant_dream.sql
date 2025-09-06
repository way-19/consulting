/*
  # Department Integration for Calendar System

  1. New Tables
    - `departments`
      - `id` (uuid, primary key)  
      - `name` (text, unique)
      - `description` (text)
      - `color` (text) - For UI theming
      - `is_active` (boolean, default true)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamptz)

  2. Table Enhancements
    - Add `department_id` to `meetings` table
    - Add `price_paid` and `currency` for future payment integration
    - Add Stripe payment fields

  3. Security
    - Enable RLS on departments table
    - Add policies for reading departments
    - Update meetings policies to include department access

  4. Sample Data
    - Insert common business departments with colors
*/

-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  color text DEFAULT '#3B82F6',
  icon text DEFAULT 'Building',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on departments
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active departments
CREATE POLICY "Anyone can read active departments"
  ON departments
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Allow admins to manage departments
CREATE POLICY "Admins can manage departments"
  ON departments
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Add columns to meetings table if they don't exist
DO $$
BEGIN
  -- Add department_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meetings' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE meetings ADD COLUMN department_id uuid REFERENCES departments(id);
  END IF;

  -- Add price fields for future payment integration
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meetings' AND column_name = 'price_paid'
  ) THEN
    ALTER TABLE meetings ADD COLUMN price_paid numeric(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meetings' AND column_name = 'currency'
  ) THEN
    ALTER TABLE meetings ADD COLUMN currency text DEFAULT 'USD';
  END IF;

  -- Add Stripe payment fields
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meetings' AND column_name = 'stripe_session_id'
  ) THEN
    ALTER TABLE meetings ADD COLUMN stripe_session_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'meetings' AND column_name = 'stripe_payment_intent_id'
  ) THEN
    ALTER TABLE meetings ADD COLUMN stripe_payment_intent_id text;
  END IF;
END $$;

-- Create updated_at trigger for departments
CREATE OR REPLACE FUNCTION update_departments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_departments_updated_at_trigger
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_departments_updated_at();

-- Insert sample departments with business-appropriate colors and icons
INSERT INTO departments (name, description, color, icon, sort_order) VALUES
  ('Legal Services', 'Legal compliance, contracts, and regulatory matters', '#EF4444', 'Scale', 1),
  ('Tax Advisory', 'Tax planning, optimization, and compliance', '#F59E0B', 'Calculator', 2),
  ('Company Formation', 'Business registration and incorporation services', '#3B82F6', 'Building', 3),
  ('Banking Solutions', 'Corporate banking and financial services', '#10B981', 'CreditCard', 4),
  ('Accounting & Bookkeeping', 'Financial management and accounting services', '#8B5CF6', 'BarChart', 5),
  ('Immigration Support', 'Visa, residency, and immigration assistance', '#EC4899', 'Globe', 6),
  ('Real Estate Services', 'Property investment and management', '#F97316', 'Home', 7),
  ('General Consultation', 'Business strategy and general advisory', '#6B7280', 'MessageSquare', 8)
ON CONFLICT (name) DO NOTHING;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_meetings_department_id ON meetings(department_id);
CREATE INDEX IF NOT EXISTS idx_departments_is_active ON departments(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_departments_sort_order ON departments(sort_order);