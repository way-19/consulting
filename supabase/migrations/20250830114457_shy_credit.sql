/*
  # Marketing CMS System

  1. New Tables
    - `marketing_pages`
      - `id` (uuid, primary key)
      - `page_key` (text, unique) - Unique identifier for each page/section
      - `content_en` (jsonb) - English content structure
      - `content_tr` (jsonb) - Turkish content structure  
      - `content_pt` (jsonb) - Portuguese content structure
      - `meta_title_en/tr/pt` (text) - SEO meta titles
      - `meta_description_en/tr/pt` (text) - SEO meta descriptions
      - `meta_keywords_en/tr/pt` (text) - SEO keywords (comma-separated)
      - `image_url` (text) - Featured image URL
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create `marketing-images` bucket for image uploads

  3. Security
    - Enable RLS on `marketing_pages` table
    - Add policies for admin-only write access
    - Add policies for public read access
    - Add storage policies for image management
*/

-- Create marketing_pages table
CREATE TABLE IF NOT EXISTS marketing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text UNIQUE NOT NULL,
  content_en jsonb NOT NULL DEFAULT '{}',
  content_tr jsonb DEFAULT '{}',
  content_pt jsonb DEFAULT '{}',
  meta_title_en text,
  meta_description_en text,
  meta_keywords_en text,
  meta_title_tr text,
  meta_description_tr text,
  meta_keywords_tr text,
  meta_title_pt text,
  meta_description_pt text,
  meta_keywords_pt text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE marketing_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for marketing_pages
CREATE POLICY "Enable read access for all users"
  ON marketing_pages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Enable write access for admin users"
  ON marketing_pages
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

-- Create storage bucket for marketing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketing-images', 'marketing-images', true);

-- Create storage policies
CREATE POLICY "Enable read access for all users"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'marketing-images');

CREATE POLICY "Enable upload for admin users"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'marketing-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Enable update for admin users"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'marketing-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Enable delete for admin users"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'marketing-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Insert sample marketing pages
INSERT INTO marketing_pages (page_key, content_en, meta_title_en, meta_description_en, meta_keywords_en)
VALUES 
  (
    'about_page',
    '{"title": "About Consulting19", "subtitle": "AI-Powered Global Business Consulting", "description": "Since 2016, we have been simplifying international expansion by combining AI-powered intelligence with a global network of expert advisors.", "mission": "To democratize international expansion by making expert guidance accessible, fast, and fairly priced.", "values": [{"title": "Global Expertise", "description": "On-the-ground knowledge across 19+ jurisdictions"}, {"title": "AI-Powered Efficiency", "description": "Faster analysis, fewer errors, better decisions"}, {"title": "Trust & Security", "description": "Enterprise-grade security and data privacy"}, {"title": "Results-Driven", "description": "Measurable outcomes and clear accountability"}]}',
    'About Consulting19 - AI-Powered Global Business Consulting',
    'Learn about Consulting19, the AI-powered platform connecting entrepreneurs with expert advisors in 19+ countries for international business expansion.',
    'about consulting19, international business, AI consulting, global expansion, business advisors'
  ),
  (
    'homepage_hero',
    '{"title": "AI-Powered Global Business Consulting", "subtitle": "Expand Internationally with Expert Guidance", "description": "Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance.", "primaryCTA": "Start Your Expansion", "secondaryCTA": "Explore Services"}',
    'Consulting19 - AI-Powered Global Business Consulting Platform',
    'Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance.',
    'international business, global expansion, AI consulting, tax optimization, company formation, business advisors'
  ),
  (
    'services_overview',
    '{"title": "Comprehensive Business Services", "subtitle": "End-to-end solutions for international business expansion", "description": "From company formation to ongoing compliance, we provide complete support delivered by expert consultants in 19+ countries.", "categories": [{"title": "Company Formation", "description": "Complete business setup and incorporation services"}, {"title": "Tax Optimization", "description": "Strategic tax planning and compliance solutions"}, {"title": "Banking Solutions", "description": "Global banking and payment processing services"}, {"title": "Legal Compliance", "description": "Ongoing legal and regulatory support"}]}',
    'International Business Services - Consulting19',
    'Comprehensive international business services including company formation, tax optimization, banking solutions, and legal compliance across 19+ countries.',
    'business services, company formation, tax optimization, banking solutions, legal compliance, international business'
  );

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_marketing_pages_updated_at
  BEFORE UPDATE ON marketing_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();