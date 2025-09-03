```sql
-- Grant SELECT permission to the 'anon' role on the 'blog_posts' table
-- This is a prerequisite for RLS policies to be evaluated for anonymous users.
GRANT SELECT ON public.blog_posts TO anon;

-- Optional: If you want to ensure RLS is enabled on the table
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Optional: If you want to ensure RLS is enforced for the 'anon' role
-- This policy should already exist based on your schema, but including it for completeness.
-- Ensure this policy allows reading only published posts.
-- If a similar policy exists, you might need to drop and recreate it.
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anonymous users can read published blog posts' AND tablename = 'blog_posts') THEN
        CREATE POLICY "Anonymous users can read published blog posts"
        ON public.blog_posts FOR SELECT
        TO anon
        USING (is_published = true);
    END IF;
END $$;
```