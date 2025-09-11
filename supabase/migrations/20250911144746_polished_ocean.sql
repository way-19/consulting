/*
  # Fix notifications table permissions for service_role

  1. Problem
    - service_role has rolbypassrls = true (can bypass RLS)
    - But service_role has NO table permissions on notifications
    - Edge functions use service_role and fail with permission denied

  2. Solution
    - Grant ALL privileges to service_role on notifications table
    - This allows edge functions to insert notifications properly

  3. Security
    - service_role is only used by edge functions (server-side)
    - RLS policies still protect client access
    - This is standard Supabase pattern
*/

-- Grant all privileges to service_role on notifications table
GRANT ALL PRIVILEGES ON TABLE public.notifications TO service_role;

-- Also grant usage on the sequence if it exists
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Verify the grants
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.role_table_grants 
WHERE table_name = 'notifications' 
  AND grantee = 'service_role'
ORDER BY privilege_type;