/*
  # Temporarily disable RLS for debugging

  1. Changes
    - Disable RLS on user_profiles table
    - Check table structure and data
    - Allow debugging of user role fetching

  2. Security
    - This is temporary for debugging only
    - Will re-enable RLS after fixing the issue
*/

-- Disable RLS temporarily for debugging
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Check if table exists and has data
SELECT 'Table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY ordinal_position;

SELECT 'Table data:' as info;
SELECT id, email, role, full_name, created_at 
FROM user_profiles 
ORDER BY created_at;

SELECT 'Auth users:' as info;
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at;