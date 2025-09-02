```sql
-- RLS'nin etkin olduğundan emin olun
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Mevcut tüm RLS politikalarını bırakın (çakışmaları önlemek için)
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anonymous users can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can delete their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can insert their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can read their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can update their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Consultants can manage own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can read published blog posts" ON public.blog_posts;


-- Yeni RLS politikalarını oluşturun

-- 1. Tüm kullanıcıların (anonim ve kimliği doğrulanmış) yayınlanmış blog yazılarını okumasına izin verin
CREATE POLICY "Enable read access for all users on published blog posts"
ON public.blog_posts
FOR SELECT
USING (is_published = true);

-- 2. Yazarların kendi blog yazılarını yönetmesine izin verin (oluşturma, okuma, güncelleme, silme)
CREATE POLICY "Authors can manage their own blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- 3. Yöneticilerin tüm blog yazılarını yönetmesine izin verin (tüm işlemler)
CREATE POLICY "Admins can manage all blog posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'));

-- Anonim rolüne blog_posts tablosunda SELECT yetkisi verin (RLS'nin çalışması için ön koşul)
GRANT SELECT ON public.blog_posts TO anon;
```