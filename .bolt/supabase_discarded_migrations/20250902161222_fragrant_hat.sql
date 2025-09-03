/*
  # Enable public access to published blog posts

  1. Security Changes
    - Drop existing conflicting policies for blog_posts table
    - Create new policy allowing anonymous users to read published blog posts
    - Ensure RLS is properly enabled

  2. Access Control
    - Anonymous users can read published blog posts only
    - Maintains existing author and admin permissions
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