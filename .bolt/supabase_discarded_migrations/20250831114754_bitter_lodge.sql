/*
  # Blog Posts System for Country Pages

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `author_id` (uuid, foreign key to user_profiles)
      - `country_code` (text, for country-specific posts)
      - `title_i18n` (jsonb, multilingual titles)
      - `excerpt_i18n` (jsonb, multilingual excerpts)
      - `content_i18n` (jsonb, multilingual content)
      - `slug` (text, unique URL slug)
      - `category` (text, post category)
      - `tags` (text array, post tags)
      - `featured_image_url` (text, hero image)
      - `is_published` (boolean, publication status)
      - `is_featured` (boolean, featured status)
      - `published_at` (timestamptz, publication date)
      - `seo_title` (text, SEO title)
      - `seo_description` (text, SEO description)
      - `view_count` (integer, view counter)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `blog_posts` table
    - Add policies for public read access to published posts
    - Add policies for consultants to manage their own posts
    - Add policies for admins to manage all posts

  3. Indexes
    - Index on country_code for fast country filtering
    - Index on author_id for consultant post management
    - Index on published_at for chronological ordering
    - Index on is_published for filtering published posts
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_code text,
  title_i18n jsonb DEFAULT '{}',
  excerpt_i18n jsonb DEFAULT '{}',
  content_i18n jsonb DEFAULT '{}',
  slug text UNIQUE NOT NULL,
  category text DEFAULT 'general',
  tags text[] DEFAULT '{}',
  featured_image_url text,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_country_code ON blog_posts(country_code);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- RLS Policies

-- Public can read published posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Consultants can manage their own posts
CREATE POLICY "Consultants can manage own blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = author_id AND 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'consultant'
    )
  )
  WITH CHECK (
    auth.uid() = author_id AND 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'consultant'
    )
  );

-- Admins can manage all posts
CREATE POLICY "Admins can manage all blog posts"
  ON blog_posts
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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at_trigger ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at_trigger
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- Function to set published_at when post is published
CREATE OR REPLACE FUNCTION set_blog_post_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Set published_at when post is first published
  IF NEW.is_published = true AND OLD.is_published = false THEN
    NEW.published_at = now();
  END IF;
  
  -- Clear published_at when post is unpublished
  IF NEW.is_published = false AND OLD.is_published = true THEN
    NEW.published_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set published_at
DROP TRIGGER IF EXISTS set_blog_post_published_at_trigger ON blog_posts;
CREATE TRIGGER set_blog_post_published_at_trigger
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_blog_post_published_at();

-- Insert sample blog posts for Georgia
INSERT INTO blog_posts (
  author_id,
  country_code,
  title_i18n,
  excerpt_i18n,
  content_i18n,
  slug,
  category,
  tags,
  featured_image_url,
  is_published,
  is_featured,
  published_at,
  seo_title,
  seo_description
) VALUES 
(
  (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com' LIMIT 1),
  'georgia',
  '{"en": "Complete Guide to Georgia LLC Formation in 2025", "tr": "2025 Gürcistan LLC Kuruluş Rehberi", "pt": "Guia Completo para Formação de LLC na Geórgia 2025"}',
  '{"en": "Everything you need to know about setting up an LLC in Georgia with Small Business Status for optimal tax benefits.", "tr": "Optimal vergi avantajları için Küçük İşletme Statüsü ile Gürcistan''da LLC kurma hakkında bilmeniz gereken her şey.", "pt": "Tudo que você precisa saber sobre estabelecer uma LLC na Geórgia com Status de Pequena Empresa para benefícios fiscais ideais."}',
  '{"en": "Georgia has become one of the most attractive jurisdictions for international businesses...", "tr": "Gürcistan uluslararası işletmeler için en çekici yargı alanlarından biri haline geldi...", "pt": "A Geórgia se tornou uma das jurisdições mais atrativas para negócios internacionais..."}',
  'georgia-llc-formation-guide-2025',
  'Company Formation',
  '{"georgia", "llc", "company formation", "tax optimization", "small business status"}',
  'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  true,
  now() - interval '2 days',
  'Complete Guide to Georgia LLC Formation in 2025 - Consulting19',
  'Learn how to set up an LLC in Georgia with Small Business Status. Expert guide covering registration, tax benefits, and compliance requirements.'
),
(
  (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com' LIMIT 1),
  'georgia',
  '{"en": "Georgia Tax Residency: Benefits and Requirements", "tr": "Gürcistan Vergi Mukimliği: Faydalar ve Gereksinimler", "pt": "Residência Fiscal na Geórgia: Benefícios e Requisitos"}',
  '{"en": "Discover the advantages of Georgian tax residency and how to qualify for this beneficial status.", "tr": "Gürcistan vergi mukimliğinin avantajlarını keşfedin ve bu faydalı statü için nasıl nitelik kazanacağınızı öğrenin.", "pt": "Descubra as vantagens da residência fiscal georgiana e como se qualificar para este status benéfico."}',
  '{"en": "Georgian tax residency offers significant advantages for international entrepreneurs...", "tr": "Gürcistan vergi mukimliği uluslararası girişimciler için önemli avantajlar sunuyor...", "pt": "A residência fiscal georgiana oferece vantagens significativas para empreendedores internacionais..."}',
  'georgia-tax-residency-benefits-requirements',
  'Tax Planning',
  '{"georgia", "tax residency", "tax planning", "international tax"}',
  'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  now() - interval '5 days',
  'Georgia Tax Residency: Benefits and Requirements - Consulting19',
  'Complete guide to Georgian tax residency including benefits, requirements, and application process for international entrepreneurs.'
),
(
  (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com' LIMIT 1),
  'georgia',
  '{"en": "Banking in Georgia: A Complete Guide for Foreign Companies", "tr": "Gürcistan''da Bankacılık: Yabancı Şirketler için Tam Rehber", "pt": "Bancos na Geórgia: Guia Completo para Empresas Estrangeiras"}',
  '{"en": "Navigate the Georgian banking system and learn how to open corporate accounts for your international business.", "tr": "Gürcistan bankacılık sisteminde gezinin ve uluslararası işletmeniz için kurumsal hesapları nasıl açacağınızı öğrenin.", "pt": "Navegue pelo sistema bancário georgiano e aprenda como abrir contas corporativas para seu negócio internacional."}',
  '{"en": "The Georgian banking sector has undergone significant modernization...", "tr": "Gürcistan bankacılık sektörü önemli bir modernizasyon geçirdi...", "pt": "O setor bancário georgiano passou por uma modernização significativa..."}',
  'banking-georgia-guide-foreign-companies',
  'Banking',
  '{"georgia", "banking", "corporate accounts", "international business"}',
  'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  now() - interval '1 week',
  'Banking in Georgia: Complete Guide for Foreign Companies - Consulting19',
  'Learn how to navigate Georgian banking system and open corporate accounts for your international business with expert guidance.'
),
(
  (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com' LIMIT 1),
  'georgia',
  '{"en": "Individual Entrepreneur Status in Georgia: 1% Tax Rate Explained", "tr": "Gürcistan''da Bireysel Girişimci Statüsü: %1 Vergi Oranı Açıklandı", "pt": "Status de Empreendedor Individual na Geórgia: Taxa de 1% Explicada"}',
  '{"en": "Learn about Georgia''s Individual Entrepreneur status offering just 1% tax rate on income up to $200,000 annually.", "tr": "Yıllık 200.000 dolara kadar gelir üzerinden sadece %1 vergi oranı sunan Gürcistan Bireysel Girişimci statüsü hakkında bilgi edinin.", "pt": "Saiba sobre o status de Empreendedor Individual da Geórgia oferecendo apenas 1% de taxa de imposto sobre renda até $200.000 anuais."}',
  '{"en": "Georgia''s Individual Entrepreneur status is one of the most attractive tax regimes...", "tr": "Gürcistan''ın Bireysel Girişimci statüsü en çekici vergi rejimlerinden biri...", "pt": "O status de Empreendedor Individual da Geórgia é um dos regimes fiscais mais atraentes..."}',
  'georgia-individual-entrepreneur-status-1-percent-tax',
  'Tax Planning',
  '{"georgia", "individual entrepreneur", "tax optimization", "1% tax"}',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  now() - interval '10 days',
  'Individual Entrepreneur Status in Georgia: 1% Tax Rate - Consulting19',
  'Complete guide to Georgia''s Individual Entrepreneur status with 1% tax rate on income up to $200,000. Expert insights and application process.'
),
(
  (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com' LIMIT 1),
  'georgia',
  '{"en": "Visa and Residence Permit Options for Georgia", "tr": "Gürcistan için Vize ve İkamet İzni Seçenekleri", "pt": "Opções de Visto e Permissão de Residência para a Geórgia"}',
  '{"en": "Comprehensive overview of visa options and residence permits available for foreign nationals in Georgia.", "tr": "Gürcistan''da yabancı vatandaşlar için mevcut vize seçenekleri ve ikamet izinlerine kapsamlı genel bakış.", "pt": "Visão abrangente das opções de visto e permissões de residência disponíveis para estrangeiros na Geórgia."}',
  '{"en": "Georgia offers various visa and residence permit options for foreign nationals...", "tr": "Gürcistan yabancı vatandaşlar için çeşitli vize ve ikamet izni seçenekleri sunuyor...", "pt": "A Geórgia oferece várias opções de visto e permissão de residência para estrangeiros..."}',
  'georgia-visa-residence-permit-options',
  'Immigration',
  '{"georgia", "visa", "residence permit", "immigration"}',
  'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  now() - interval '2 weeks',
  'Visa and Residence Permit Options for Georgia - Consulting19',
  'Complete guide to Georgian visa and residence permit options for foreign nationals. Expert immigration advice and application assistance.'
),
(
  (SELECT id FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com' LIMIT 1),
  'georgia',
  '{"en": "Why Georgia is Perfect for Digital Nomads and Remote Workers", "tr": "Gürcistan Neden Dijital Göçebeler ve Uzaktan Çalışanlar için Mükemmel", "pt": "Por que a Geórgia é Perfeita para Nômades Digitais e Trabalhadores Remotos"}',
  '{"en": "Explore why Georgia has become a top destination for digital nomads with its favorable policies and modern infrastructure.", "tr": "Gürcistan''ın uygun politikaları ve modern altyapısı ile dijital göçebeler için neden en iyi destinasyon haline geldiğini keşfedin.", "pt": "Explore por que a Geórgia se tornou um destino top para nômades digitais com suas políticas favoráveis e infraestrutura moderna."}',
  '{"en": "Georgia has emerged as a leading destination for digital nomads...", "tr": "Gürcistan dijital göçebeler için önde gelen bir destinasyon olarak ortaya çıktı...", "pt": "A Geórgia emergiu como um destino líder para nômades digitais..."}',
  'georgia-perfect-digital-nomads-remote-workers',
  'Digital Nomad',
  '{"georgia", "digital nomad", "remote work", "lifestyle"}',
  'https://images.pexels.com/photos/4386440/pexels-photo-4386440.jpeg?auto=compress&cs=tinysrgb&w=800',
  true,
  false,
  now() - interval '3 weeks',
  'Why Georgia is Perfect for Digital Nomads - Consulting19',
  'Discover why Georgia is the ideal destination for digital nomads and remote workers. Complete guide to living and working in Georgia.'
);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_blog_post_views(post_slug text)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts 
  SET view_count = view_count + 1 
  WHERE slug = post_slug AND is_published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;