/*
  # Grant permissions for document intelligence

  1. Permissions
    - Grant INSERT and UPDATE permissions to supabase_admin
    - Grant SELECT permissions for edge functions
  
  2. Security
    - Ensure proper access for AI document categorization
*/

-- Grant necessary permissions for document intelligence operations
GRANT INSERT, UPDATE, SELECT ON public.document_intelligence TO supabase_admin;
GRANT USAGE ON SCHEMA public TO supabase_admin;

-- Grant permissions for edge functions to access the table
GRANT INSERT, UPDATE, SELECT ON public.document_intelligence TO service_role;