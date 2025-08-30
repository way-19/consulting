/*
  # Fix services table foreign key relationships and complete SaaS system

  1. Problem
    - services table missing consultant_id and country_id foreign keys
    - Supabase cannot find relationships for JOIN operations
    - SaaS system needs proper consultant-service relationships

  2. Solution
    - Add consultant_id and country_id columns to services table
    - Create proper foreign key constraints
    - Update RLS policies for SaaS access control
    - Add missing columns for complete SaaS functionality

  3. SaaS System Requirements
    - Consultants manage their own services and FAQs
    - Clients can purchase services and get invoices
    - Admin manages global marketing content and services
*/

-- Drop existing trigger to avoid conflicts
DROP TRIGGER IF EXISTS update_service_faqs_updated_at ON service_faqs;

-- Add missing columns to services table for SaaS system
DO $$
BEGIN
  -- Add consultant_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'consultant_id'
  ) THEN
    ALTER TABLE services ADD COLUMN consultant_id uuid REFERENCES user_profiles(id);
  END IF;

  -- Add country_id if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'country_id'
  ) THEN
    ALTER TABLE services ADD COLUMN country_id uuid REFERENCES countries(id);
  END IF;

  -- Add is_marketing_service if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'is_marketing_service'
  ) THEN
    ALTER TABLE services ADD COLUMN is_marketing_service boolean DEFAULT false NOT NULL;
  END IF;

  -- Add is_featured if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'is_featured'
  ) THEN
    ALTER TABLE services ADD COLUMN is_featured boolean DEFAULT false NOT NULL;
  END IF;

  -- Add category if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'category'
  ) THEN
    ALTER TABLE services ADD COLUMN category text DEFAULT 'General' NOT NULL;
  END IF;

  -- Add localization columns if not exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'title_tr'
  ) THEN
    ALTER TABLE services ADD COLUMN title_tr text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'title_pt'
  ) THEN
    ALTER TABLE services ADD COLUMN title_pt text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'description_tr'
  ) THEN
    ALTER TABLE services ADD COLUMN description_tr text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'description_pt'
  ) THEN
    ALTER TABLE services ADD COLUMN description_pt text;
  END IF;
END $$;

-- Ensure service_faqs table exists with proper structure
CREATE TABLE IF NOT EXISTS service_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id),
  country_id uuid REFERENCES countries(id),
  question text NOT NULL,
  answer text NOT NULL,
  question_tr text,
  answer_tr text,
  question_pt text,
  answer_pt text,
  order_index integer DEFAULT 1 NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS services_consultant_idx ON services(consultant_id);
CREATE INDEX IF NOT EXISTS services_country_idx ON services(country_id);
CREATE INDEX IF NOT EXISTS services_marketing_idx ON services(is_marketing_service);
CREATE INDEX IF NOT EXISTS services_featured_idx ON services(is_featured);
CREATE INDEX IF NOT EXISTS services_category_idx ON services(category);

CREATE INDEX IF NOT EXISTS service_faqs_service_id_idx ON service_faqs(service_id);
CREATE INDEX IF NOT EXISTS service_faqs_consultant_idx ON service_faqs(consultant_id);
CREATE INDEX IF NOT EXISTS service_faqs_country_idx ON service_faqs(country_id);
CREATE INDEX IF NOT EXISTS service_faqs_active_idx ON service_faqs(is_active);
CREATE INDEX IF NOT EXISTS service_faqs_order_idx ON service_faqs(order_index);

-- Enable RLS on service_faqs
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;

-- Update RLS policies for services table (SaaS access control)
DROP POLICY IF EXISTS "Enable read for public services" ON services;
DROP POLICY IF EXISTS "Enable all for consultant's own services" ON services;

-- Public can read active marketing services
CREATE POLICY "Public can read marketing services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true AND is_active = true AND is_marketing_service = true);

-- Consultants can manage their own services
CREATE POLICY "Consultants manage own services"
  ON services
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Admin can manage marketing services
CREATE POLICY "Admin manages marketing services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    is_marketing_service = true AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    is_marketing_service = true AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  );

-- Create RLS policies for service_faqs
CREATE POLICY "Public can read active FAQs"
  ON service_faqs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Consultants manage own service FAQs"
  ON service_faqs
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Recreate the trigger for service_faqs
CREATE TRIGGER update_service_faqs_updated_at
  BEFORE UPDATE ON service_faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample marketing services for admin (global services)
INSERT INTO services (
  title,
  description,
  category,
  price,
  image_url,
  is_marketing_service,
  is_featured,
  is_public,
  is_active,
  consultant_id,
  country_id
) VALUES 
(
  'Company Formation',
  'Complete business setup and incorporation services across multiple jurisdictions with expert legal guidance.',
  'Company Formation',
  2500,
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  true,
  true,
  true,
  null,
  null
),
(
  'Tax Optimization',
  'Strategic international tax planning to minimize legal tax liability across jurisdictions.',
  'Tax Planning',
  1800,
  'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  true,
  true,
  true,
  null,
  null
),
(
  'Banking Solutions',
  'Global banking support for opening and managing corporate accounts worldwide.',
  'Banking',
  1200,
  'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  true,
  true,
  true,
  null,
  null
),
(
  'Legal Compliance',
  'Ongoing legal and regulatory support to keep your business compliant across jurisdictions.',
  'Legal',
  800,
  'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  true,
  true,
  null,
  null
),
(
  'Asset Protection',
  'Sophisticated trust and foundation structures to protect assets and reduce risk.',
  'Asset Protection',
  3500,
  'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  true,
  true,
  null,
  null
),
(
  'Investment Advisory',
  'Professional investment and wealth management services with global diversification.',
  'Investment',
  2000,
  'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  true,
  true,
  null,
  null
),
(
  'Visa & Residency',
  'End-to-end visa and residency solutions for founders, investors, and their families.',
  'Immigration',
  5000,
  'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  true,
  true,
  null,
  null
),
(
  'Market Research',
  'In-depth market and competitive analysis for successful international expansion.',
  'Research',
  1500,
  'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  true,
  true,
  null,
  null
)
ON CONFLICT (title) DO NOTHING;