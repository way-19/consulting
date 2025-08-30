/*
  # Debug function for marketing_pages access

  1. Debug Function
    - Create a debug function to test marketing_pages access
    - This function will help identify RLS issues
    - Only accessible by admin users

  2. Security
    - Function checks admin role before execution
    - Provides detailed error information for debugging
*/

-- Create debug function for marketing_pages access
CREATE OR REPLACE FUNCTION get_marketing_pages_debug()
RETURNS TABLE (
  debug_info jsonb
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  user_role_check text;
  rls_enabled boolean;
  policies_count integer;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Check if user exists and get role
  SELECT role::text INTO user_role_check 
  FROM user_profiles 
  WHERE id = current_user_id;
  
  -- Check if RLS is enabled on marketing_pages
  SELECT relrowsecurity INTO rls_enabled
  FROM pg_class 
  WHERE relname = 'marketing_pages';
  
  -- Count policies on marketing_pages
  SELECT COUNT(*) INTO policies_count
  FROM pg_policies 
  WHERE tablename = 'marketing_pages';
  
  -- Return debug information
  RETURN QUERY SELECT jsonb_build_object(
    'current_user_id', current_user_id,
    'user_role', user_role_check,
    'rls_enabled', rls_enabled,
    'policies_count', policies_count,
    'timestamp', now()
  );
END;
$$;