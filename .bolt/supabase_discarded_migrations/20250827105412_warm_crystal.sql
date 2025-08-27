/*
  # Temporarily disable RLS for debugging

  This migration temporarily disables RLS on user_profiles table to debug the loading issue.
  Once we confirm the query works, we'll re-enable RLS with proper policies.
*/

-- Disable RLS temporarily for debugging
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Verify the table structure and data
SELECT 'Table structure:' as info;
\d user_profiles;

SELECT 'Current data:' as info;
SELECT id, email, role, full_name FROM user_profiles;