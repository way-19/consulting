/*
  # Create blog_posts table with proper permissions

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title_i18n` (jsonb, multilingual titles)
      - `excerpt_i18n` (jsonb, multilingual excerpts)
      - `content_i18n` (jsonb, multilingual content)
      - `slug` (text, unique URL slug)
      - `category` (text, post category)
      - `tags` (text array, post tags)
      - `featured_image_url` (text, featured image)
      - `author_id` (uuid, foreign key to user_profiles)
      - `country_code` (text, country association)
      - `is_published` (boolean, publication status)
      - `is_featured` (boolean, featured status)
      - `view_count` (integer, view tracking)
      - `published_at` (timestamptz, publication date)
      - `created_at` (timestamptz, creation date)
      - `updated_at` (timestamptz, last update)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for anonymous users to read published posts
    - Add policy for authenticated users to read their own posts
    - Add policy for authors to manage their own posts

  3. Indexes
    - Index on country_code for filtering
    - Index on is_published for published posts
    - Index on published_at for ordering
    - Index on slug for URL lookups
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_i18n jsonb NOT NULL DEFAULT '{}',
  excerpt_i18n jsonb NOT NULL DEFAULT '{}',
  content_i18n jsonb NOT NULL DEFAULT '{}',
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'General',
  tags text[] DEFAULT '{}',
  featured_image_url text,
  author_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_code text NOT NULL,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy for anonymous users to read published blog posts
CREATE POLICY "Anonymous users can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon
  USING (is_published = true);

-- Policy for authenticated users to read published blog posts
CREATE POLICY "Authenticated users can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Policy for authors to read their own posts (published or unpublished)
CREATE POLICY "Authors can read their own blog posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = author_id);

-- Policy for authors to insert their own posts
CREATE POLICY "Authors can insert their own blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Policy for authors to update their own posts
CREATE POLICY "Authors can update their own blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Policy for authors to delete their own posts
CREATE POLICY "Authors can delete their own blog posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_country_code ON blog_posts(country_code);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- Insert sample blog posts for Georgia
INSERT INTO blog_posts (
  title_i18n,
  excerpt_i18n,
  content_i18n,
  slug,
  category,
  tags,
  featured_image_url,
  country_code,
  is_published,
  is_featured,
  published_at
) VALUES 
(
  '{"en": "Complete Guide to Georgian LLC Formation", "tr": "Gürcistan LLC Kurma Rehberi", "pt": "Guia Completo para Formação de LLC na Geórgia"}',
  '{"en": "Everything you need to know about setting up an LLC in Georgia with Small Business Status for optimal tax benefits.", "tr": "Gürcistan''da Küçük İşletme Statüsü ile LLC kurma hakkında bilmeniz gereken her şey.", "pt": "Tudo que você precisa saber sobre estabelecer uma LLC na Geórgia com Status de Pequena Empresa."}',
  '{"en": "Setting up an LLC in Georgia offers significant advantages for international entrepreneurs...", "tr": "Gürcistan''da LLC kurmak uluslararası girişimciler için önemli avantajlar sunar...", "pt": "Estabelecer uma LLC na Geórgia oferece vantagens significativas para empreendedores internacionais..."}',
  'georgian-llc-formation-guide',
  'Company Formation',
  '{"Georgia", "LLC", "Tax Benefits", "Small Business Status"}',
  'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
  'georgia',
  true,
  true,
  '2025-01-15T10:00:00Z'
),
(
  '{"en": "Georgian Tax Residency Benefits for Digital Nomads", "tr": "Dijital Göçebeler için Gürcistan Vergi Mukimliği Avantajları", "pt": "Benefícios da Residência Fiscal Georgiana para Nômades Digitais"}',
  '{"en": "Discover how Georgian tax residency can benefit digital nomads and remote workers with favorable tax policies.", "tr": "Gürcistan vergi mukimliğinin dijital göçebeler ve uzaktan çalışanlar için nasıl avantajlı olduğunu keşfedin.", "pt": "Descubra como a residência fiscal georgiana pode beneficiar nômades digitais e trabalhadores remotos."}',
  '{"en": "Georgian tax residency offers unique opportunities for digital nomads...", "tr": "Gürcistan vergi mukimliği dijital göçebeler için benzersiz fırsatlar sunar...", "pt": "A residência fiscal georgiana oferece oportunidades únicas para nômades digitais..."}',
  'georgian-tax-residency-digital-nomads',
  'Tax Planning',
  '{"Georgia", "Tax Residency", "Digital Nomads", "Remote Work"}',
  'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
  'georgia',
  true,
  false,
  '2025-01-12T10:00:00Z'
),
(
  '{"en": "Banking Solutions for International Businesses in Georgia", "tr": "Gürcistan''da Uluslararası İşletmeler için Bankacılık Çözümleri", "pt": "Soluções Bancárias para Empresas Internacionais na Geórgia"}',
  '{"en": "Navigate the Georgian banking system and open corporate accounts for your international business operations.", "tr": "Gürcistan bankacılık sisteminde gezinin ve uluslararası iş operasyonlarınız için kurumsal hesaplar açın.", "pt": "Navegue pelo sistema bancário georgiano e abra contas corporativas para suas operações comerciais internacionais."}',
  '{"en": "The Georgian banking sector has evolved significantly in recent years...", "tr": "Gürcistan bankacılık sektörü son yıllarda önemli ölçüde gelişti...", "pt": "O setor bancário georgiano evoluiu significativamente nos últimos anos..."}',
  'georgian-banking-solutions-international-business',
  'Banking',
  '{"Georgia", "Banking", "Corporate Accounts", "International Business"}',
  'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
  'georgia',
  true,
  false,
  '2025-01-10T10:00:00Z'
);