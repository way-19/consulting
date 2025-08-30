```sql
-- Create user_role ENUM if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'client', 'consultant');
    END IF;
END $$;

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create marketing_pages table
CREATE TABLE public.marketing_pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key text NOT NULL UNIQUE,
    content_en jsonb NOT NULL DEFAULT '{}'::jsonb,
    content_tr jsonb DEFAULT '{}'::jsonb,
    content_pt jsonb DEFAULT '{}'::jsonb,
    meta_title_en text,
    meta_description_en text,
    meta_keywords_en text,
    meta_title_tr text,
    meta_description_tr text,
    meta_keywords_tr text,
    meta_title_pt text,
    meta_description_pt text,
    meta_keywords_pt text,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_active boolean NOT NULL DEFAULT true
);

-- Create unique indexes
CREATE UNIQUE INDEX marketing_pages_page_key_key ON public.marketing_pages USING btree (page_key);
CREATE UNIQUE INDEX marketing_pages_pkey ON public.marketing_pages USING btree (id);

-- Enable Row Level Security
ALTER TABLE public.marketing_pages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.marketing_pages
FOR SELECT USING (true);

CREATE POLICY "Enable write access for admin users" ON public.marketing_pages
FOR ALL USING (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.role = 'admin'::public.user_role))))
WITH CHECK (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.id = auth.uid()) AND (user_profiles.role = 'admin'::public.user_role))));

-- Create trigger for updated_at column
CREATE TRIGGER update_marketing_pages_updated_at
BEFORE UPDATE ON public.marketing_pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```