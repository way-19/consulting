/*
  # Add Multi-Language Support for Services and FAQs

  1. New Columns for Services Table
    - `title_tr` (text) - Turkish title
    - `description_tr` (text) - Turkish description  
    - `meta_description_tr` (text) - Turkish meta description
    - `meta_keywords_tr` (text[]) - Turkish meta keywords
    - `title_pt` (text) - Portuguese title
    - `description_pt` (text) - Portuguese description
    - `meta_description_pt` (text) - Portuguese meta description
    - `meta_keywords_pt` (text[]) - Portuguese meta keywords

  2. New Columns for Service FAQs Table
    - `question_tr` (text) - Turkish question
    - `answer_tr` (text) - Turkish answer
    - `question_pt` (text) - Portuguese question
    - `answer_pt` (text) - Portuguese answer

  3. Security
    - Existing RLS policies will cover new columns
    - No additional security changes needed
*/

-- Add multi-language columns to services table
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS title_tr text,
ADD COLUMN IF NOT EXISTS description_tr text,
ADD COLUMN IF NOT EXISTS meta_description_tr text,
ADD COLUMN IF NOT EXISTS meta_keywords_tr text[],
ADD COLUMN IF NOT EXISTS title_pt text,
ADD COLUMN IF NOT EXISTS description_pt text,
ADD COLUMN IF NOT EXISTS meta_description_pt text,
ADD COLUMN IF NOT EXISTS meta_keywords_pt text[];

-- Add multi-language columns to service_faqs table
ALTER TABLE service_faqs 
ADD COLUMN IF NOT EXISTS question_tr text,
ADD COLUMN IF NOT EXISTS answer_tr text,
ADD COLUMN IF NOT EXISTS question_pt text,
ADD COLUMN IF NOT EXISTS answer_pt text;