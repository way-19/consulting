```sql
-- supabase/migrations/reconfigure_blog_posts_rls.sql

-- RLS'nin etkin olduğundan emin olun
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Mevcut tüm SELECT RLS politikalarını bırakın
DROP POLICY IF EXISTS "Anonymous users can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can read published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authors can read their own blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Consultants can manage own blog posts" ON public.blog_posts;

-- Anonim ve kimliği doğrulanmış kullanıcıların yayınlanmış blog yazılarını okumasına izin veren yeni bir politika oluşturun
CREATE POLICY "Allow public and authenticated read access to published blog posts"
ON public.blog_posts FOR SELECT
USING (is_published = TRUE);

-- Yazarların kendi blog yazılarını yönetmesine izin veren politikaları yeniden oluşturun
CREATE POLICY "Authors can manage their own blog posts"
ON public.blog_posts FOR ALL
USING (auth.uid() = author_id)
WITH CHECK (auth.uid() = author_id);

-- Yöneticilerin tüm blog yazılarını yönetmesine izin veren politikayı yeniden oluşturun
CREATE POLICY "Admins can manage all blog posts"
ON public.blog_posts FOR ALL
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Danışmanların kendi blog yazılarını yönetmesine izin veren politikayı yeniden oluşturun
CREATE POLICY "Consultants can manage their own blog posts"
ON public.blog_posts FOR ALL
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'consultant') AND auth.uid() = author_id)
WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'consultant') AND auth.uid() = author_id);

-- Anonim rolüne blog_posts tablosunda SELECT yetkisi verin (RLS'nin çalışması için temel izin)
-- Bu komut, RLS politikaları tarafından filtrelenmeden önce temel SELECT yetkisini sağlar.
GRANT SELECT ON public.blog_posts TO anon;
```