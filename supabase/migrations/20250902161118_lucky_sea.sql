/*
  # Fix blog posts public access permissions

  1. Security Updates
    - Add policy for anonymous users to read published blog posts
    - Ensure existing policies remain intact
    - Use IF NOT EXISTS checks to avoid conflicts

  2. Changes
    - Create public read policy for published blog posts only if it doesn't exist
    - Skip creation of existing policies to avoid conflicts
*/

-- Create policy for anonymous users to read published blog posts (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' 
    AND policyname = 'Public can read published blog posts'
  ) THEN
    CREATE POLICY "Public can read published blog posts"
      ON blog_posts
      FOR SELECT
      TO anon, authenticated
      USING (is_published = true);
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;