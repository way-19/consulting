/*
  # Fix blog posts public access permissions

  1. Security Updates
    - Drop existing conflicting policies on blog_posts table
    - Create new policy to allow anonymous users to read published blog posts
    - Ensure RLS is properly enabled

  2. Changes Made
    - Remove any conflicting policies that might prevent anonymous access
    - Add clear policy for public read access to published posts
    - Maintain existing authenticated user policies
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Anonymous users can read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Authenticated users can read published blog posts" ON blog_posts;

-- Ensure RLS is enabled
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous users to read published blog posts
CREATE POLICY "Public can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Recreate policies for authenticated users (authors and consultants)
CREATE POLICY "Authors can read their own blog posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Authors can insert their own blog posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own blog posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can delete their own blog posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Admin policy for full access
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