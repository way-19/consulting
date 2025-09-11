/*
  # Grant service_role permissions on consultant_alerts table

  1. Permissions
    - Grant ALL privileges to service_role on consultant_alerts table
    - This allows edge functions to create consultant alerts

  2. Security
    - service_role bypasses RLS so this is safe for system operations
    - Only edge functions use service_role, not end users
*/

-- Grant all permissions to service_role on consultant_alerts table
GRANT ALL ON consultant_alerts TO service_role;

-- Also grant permissions on notifications table if not already done
GRANT ALL ON notifications TO service_role;

-- Grant sequence permissions for auto-generated IDs
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;