/*
  # Fix blog posts permissions for anonymous access

  1. Security Changes
    - Enable RLS on blog_posts table
    - Create policy to allow public read access to published blog posts
    - Grant SELECT permission to anon role

  This migration resolves the "permission denied for table blog_posts" error
  by allowing anonymous users to read published blog posts.
*/

-- Enable RLS on blog_posts table
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Grant SELECT permission to anon role
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT ON public.user_profiles TO anon;
GRANT SELECT ON public.countries TO anon;

-- Create policy to allow public read access to published blog posts
CREATE POLICY "Allow public read access to published blog posts"
ON public.blog_posts 
FOR SELECT 
TO anon, authenticated
USING (is_published = true);

-- Create policy to allow public read access to user profiles (for author info)
CREATE POLICY "Allow public read access to user profiles"
ON public.user_profiles 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Create policy to allow public read access to countries (for country info)
CREATE POLICY "Allow public read access to countries"
ON public.countries 
FOR SELECT 
TO anon, authenticated
USING (is_active = true);