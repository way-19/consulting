/*
  # Add FAQ and Meta Keywords to Services

  1. New Tables
    - `service_faqs`
      - `id` (uuid, primary key)
      - `service_id` (uuid, foreign key to services)
      - `question` (text)
      - `answer` (text)
      - `order_index` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Table Updates
    - Add `meta_keywords` column to `services` table
    - Add `meta_description` column to `services` table

  3. Security
    - Enable RLS on `service_faqs` table
    - Add policies for consultants to manage their own service FAQs
    - Add policies for public read access to active FAQs
*/

-- Add meta columns to services table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'meta_keywords'
  ) THEN
    ALTER TABLE services ADD COLUMN meta_keywords text[];
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'services' AND column_name = 'meta_description'
  ) THEN
    ALTER TABLE services ADD COLUMN meta_description text;
  END IF;
END $$;

-- Create service_faqs table
CREATE TABLE IF NOT EXISTS service_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  order_index integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for service_faqs
CREATE POLICY "consultants_can_manage_own_service_faqs"
  ON service_faqs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM services s
      WHERE s.id = service_faqs.service_id
      AND s.consultant_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM services s
      WHERE s.id = service_faqs.service_id
      AND s.consultant_id = auth.uid()
    )
  );

CREATE POLICY "public_can_read_active_service_faqs"
  ON service_faqs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_faqs_service_id ON service_faqs(service_id);
CREATE INDEX IF NOT EXISTS idx_service_faqs_active_order ON service_faqs(service_id, is_active, order_index);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_service_faqs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_faqs_updated_at
  BEFORE UPDATE ON service_faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_service_faqs_updated_at();