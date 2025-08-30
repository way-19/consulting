/*
  # Create service_faqs table for service-specific FAQs

  1. New Tables
    - `service_faqs`
      - `id` (uuid, primary key)
      - `service_id` (uuid, foreign key to services)
      - `question` (text)
      - `answer` (text)
      - `question_tr` (text, nullable)
      - `answer_tr` (text, nullable)
      - `question_pt` (text, nullable)
      - `answer_pt` (text, nullable)
      - `order_index` (integer)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `service_faqs` table
    - Add policy for consultants to manage their service FAQs
    - Add policy for public read access to active FAQs

  3. Indexes
    - Add indexes for better performance
*/

-- Create service_faqs table
CREATE TABLE IF NOT EXISTS service_faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
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

-- Create indexes
CREATE INDEX IF NOT EXISTS service_faqs_service_id_idx ON service_faqs(service_id);
CREATE INDEX IF NOT EXISTS service_faqs_active_idx ON service_faqs(is_active);
CREATE INDEX IF NOT EXISTS service_faqs_order_idx ON service_faqs(order_index);

-- Enable RLS
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read for active FAQs"
  ON service_faqs
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Enable all for service owner"
  ON service_faqs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM services
      WHERE services.id = service_faqs.service_id
      AND services.consultant_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_service_faqs_updated_at
  BEFORE UPDATE ON service_faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();