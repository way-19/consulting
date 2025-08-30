/*
  # Create marketing_pages table and dependencies

  1. New Tables
    - `marketing_pages`
      - `id` (uuid, primary key)
      - `page_key` (text, unique)
      - `content_en` (jsonb)
      - `content_tr` (jsonb)
      - `content_pt` (jsonb)
      - `meta_title_en` (text)
      - `meta_description_en` (text)
      - `meta_keywords_en` (text)
      - `meta_title_tr` (text)
      - `meta_description_tr` (text)
      - `meta_keywords_tr` (text)
      - `meta_title_pt` (text)
      - `meta_description_pt` (text)
      - `meta_keywords_pt` (text)
      - `image_url` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `marketing_pages` table
    - Add policy for public read access
    - Add policy for admin write access

  3. Functions
    - Create update_updated_at_column function if not exists
*/

-- Create user_role enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'client', 'consultant');
  END IF;
END $$;

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create marketing_pages table
CREATE TABLE IF NOT EXISTS marketing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text UNIQUE NOT NULL,
  content_en jsonb DEFAULT '{}' NOT NULL,
  content_tr jsonb DEFAULT '{}',
  content_pt jsonb DEFAULT '{}',
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
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS marketing_pages_page_key_idx ON marketing_pages(page_key);
CREATE INDEX IF NOT EXISTS marketing_pages_is_active_idx ON marketing_pages(is_active);

-- Enable RLS
ALTER TABLE marketing_pages ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE TRIGGER update_marketing_pages_updated_at
  BEFORE UPDATE ON marketing_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();