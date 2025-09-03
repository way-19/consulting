/*
  # Fix blog posts RLS policies for anonymous access

  1. Security Changes
    - Drop all existing policies on blog_posts table
    - Create new policy allowing anonymous users to read published blog posts
    - Recreate policies for authors and admins to manage their content

  2. Changes
    - Enable public read access to published blog posts
    - Maintain security for unpublished content
    - Allow authors to manage their own posts
    - Allow admins to manage all posts
*/

-- Drop all existing policies on blog_posts table
DROP POLICY IF EXISTS "Anonymous users can read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can read their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can insert their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can update their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authors can delete their own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Consultants can manage own blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON blog_posts;

-- Ensure RLS is enabled
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous and authenticated users to read published blog posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Create policy for authors to manage their own blog posts
CREATE POLICY "Authors can manage own blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

-- Create policy for admins to manage all blog posts
CREATE POLICY "Admins can manage all blog posts"
  ON blog_posts
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