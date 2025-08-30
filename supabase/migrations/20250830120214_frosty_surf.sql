/*
  # Create marketing_pages table for CMS content

  1. New Tables
    - `marketing_pages`
      - `id` (uuid, primary key)
      - `page_key` (text, unique) - identifier for the page (e.g., 'about_page', 'home_page')
      - `content_en` (jsonb) - English content as JSON
      - `content_tr` (jsonb) - Turkish content as JSON  
      - `content_pt` (jsonb) - Portuguese content as JSON
      - `meta_title_en` (text) - English SEO title
      - `meta_description_en` (text) - English SEO description
      - `meta_keywords_en` (text) - English SEO keywords
      - `meta_title_tr` (text) - Turkish SEO title
      - `meta_description_tr` (text) - Turkish SEO description
      - `meta_keywords_tr` (text) - Turkish SEO keywords
      - `meta_title_pt` (text) - Portuguese SEO title
      - `meta_description_pt` (text) - Portuguese SEO description
      - `meta_keywords_pt` (text) - Portuguese SEO keywords
      - `image_url` (text) - Featured image URL
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `marketing_pages` table
    - Add policy for public read access
    - Add policy for admin write access

  3. Sample Data
    - Insert sample about_page content for testing
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

-- Create policies
CREATE POLICY "Enable public read access for marketing pages"
  ON marketing_pages
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Enable admin write access for marketing pages"
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

-- Create updated_at trigger
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

-- Insert sample about_page content
INSERT INTO marketing_pages (page_key, content_en, meta_title_en, meta_description_en) 
VALUES (
  'about_page',
  '{
    "page_title": "About Consulting19",
    "hero_description": "Since 2016, we have been simplifying international expansion by combining AI-powered intelligence with a global network of expert advisors. We help founders and investors launch, bank, optimize taxes, and stay compliant across 19+ countries.",
    "mission_title": "Our Mission",
    "mission_description": "To democratize international expansion by making expert guidance accessible, fast, and fairly priced. We deliver enterprise-grade outcomes for companies of all sizes through the practical blend of automation and local expertise.",
    "values_description": "The principles that guide our approach to international business consulting",
    "timeline_description": "Our journey of innovation and growth",
    "platforms_description": "Specialized platforms for sophisticated wealth management and investment opportunities",
    "story_description": "Consulting19 began in 2016 with a simple observation: cross-border expansion was harder than it needed to be. By pairing cutting-edge AI with a curated network of local experts, we deliver enterprise-level results—company formation, banking, tax optimization, and compliance—faster and more predictably than traditional models.",
    "cta_title": "Ready to Join Our Mission?",
    "cta_description": "Whether you are expanding globally or advising clients, we would love to collaborate."
  }',
  'About Consulting19 - AI-Powered Global Business Consulting',
  'Learn about Consulting19, the AI-powered platform connecting entrepreneurs with expert advisors in 19+ countries for international business expansion.'
) ON CONFLICT (page_key) DO NOTHING;