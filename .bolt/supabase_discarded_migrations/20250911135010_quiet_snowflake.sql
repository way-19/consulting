/*
  # Grant permissions for document intelligence

  1. Permissions
    - Grant INSERT and UPDATE permissions on document_intelligence table
  
  2. Purpose
    - Ensure ai-document-categorization function can work properly
*/

-- Grant permissions to supabase_admin for document_intelligence table
GRANT INSERT, UPDATE ON public.document_intelligence TO supabase_admin;