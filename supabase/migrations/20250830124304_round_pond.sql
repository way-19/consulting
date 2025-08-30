/*
  # Fix trigger already exists error

  1. Problem
    - Trigger "update_marketing_pages_updated_at" already exists
    - Multiple migration files trying to create the same trigger

  2. Solution
    - Use conditional trigger creation
    - Only create if it doesn't exist
*/

-- Drop the trigger if it exists and recreate it to ensure consistency
DROP TRIGGER IF EXISTS update_marketing_pages_updated_at ON public.marketing_pages;

-- Recreate the trigger
CREATE TRIGGER update_marketing_pages_updated_at 
  BEFORE UPDATE ON public.marketing_pages 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();