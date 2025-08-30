/*
  # Marketing CMS System

  1. New Tables
    - `marketing_pages`
      - `id` (uuid, primary key)
      - `page_key` (text, unique) - Unique identifier for each page/section
      - `content_en` (jsonb) - Structured English content
      - `content_tr` (jsonb) - Structured Turkish content
      - `content_pt` (jsonb) - Structured Portuguese content
      - `meta_title_en/tr/pt` (text) - SEO meta titles
      - `meta_description_en/tr/pt` (text) - SEO meta descriptions
      - `meta_keywords_en/tr/pt` (text) - SEO keywords (comma-separated)
      - `image_url` (text) - Main image URL for the content
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create `marketing-images` bucket for image uploads

  3. Security
    - Enable RLS on `marketing_pages` table
    - Add policies for public read and admin-only write access
    - Configure storage policies for image uploads
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

-- Public can read marketing content
CREATE POLICY "Public can read marketing content"
  ON marketing_pages
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only admins can manage marketing content
CREATE POLICY "Admins can manage marketing content"
  ON marketing_pages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create storage bucket for marketing images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('marketing-images', 'marketing-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for marketing images
CREATE POLICY "Public can view marketing images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'marketing-images');

CREATE POLICY "Admins can upload marketing images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'marketing-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update marketing images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'marketing-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete marketing images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'marketing-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_marketing_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_marketing_pages_updated_at
  BEFORE UPDATE ON marketing_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_marketing_pages_updated_at();

-- Insert initial marketing content
INSERT INTO marketing_pages (page_key, content_en, meta_title_en, meta_description_en, meta_keywords_en) VALUES
('about_page', '{
  "heroTitle": "About Consulting19",
  "heroDescription": "Since 2016, we have been simplifying international expansion by combining AI-powered intelligence with a global network of expert advisors.",
  "mission": "To democratize international expansion by making expert guidance accessible, fast, and fairly priced.",
  "values": [
    {"title": "Global Expertise", "description": "On-the-ground knowledge across 19+ jurisdictions."},
    {"title": "AI-Powered Efficiency", "description": "Faster analysis, fewer errors, better decisions."},
    {"title": "Trust & Security", "description": "Enterprise-grade security and data privacy."},
    {"title": "Results-Driven", "description": "Measurable outcomes and clear accountability."}
  ]
}', 'About Consulting19 - AI-Powered Global Business Consulting', 'Learn about Consulting19, the AI-powered platform connecting entrepreneurs with expert advisors in 19+ countries for international business expansion.', 'about consulting19, international business, AI consulting, global expansion, business advisors'),

('homepage_hero', '{
  "title": "AI-Powered Global Business Consulting",
  "subtitle": "Expand Internationally",
  "description": "Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance.",
  "primaryCTA": "Start Your Expansion",
  "secondaryCTA": "Explore Services"
}', 'Consulting19 - AI-Powered Global Business Consulting', 'Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance.', 'international business, global expansion, AI consulting, tax optimization, company formation, legal compliance'),

('services_overview', '{
  "title": "Comprehensive Business Services",
  "description": "End-to-end solutions for international business expansion",
  "services": [
    {"title": "Company Formation", "description": "Complete business setup and incorporation services"},
    {"title": "Tax Optimization", "description": "Strategic tax planning and compliance solutions"},
    {"title": "Banking Solutions", "description": "Global banking and payment processing services"},
    {"title": "Legal Compliance", "description": "Ongoing legal and regulatory support"},
    {"title": "Asset Protection", "description": "Wealth protection and risk mitigation strategies"},
    {"title": "Investment Advisory", "description": "Professional investment and wealth management"},
    {"title": "Visa & Residency", "description": "Immigration and residency solutions"},
    {"title": "Market Research", "description": "Market analysis and business intelligence"}
  ]
}', 'Our Services - Consulting19', 'Comprehensive international business services including company formation, tax optimization, banking solutions, and legal compliance across 19+ countries.', 'business services, company formation, tax optimization, banking solutions, legal compliance, international business')

ON CONFLICT (page_key) DO NOTHING;