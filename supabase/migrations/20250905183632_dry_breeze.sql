/*
  # Add INSERT policy for audit_logs table

  1. Security Policy Changes
    - Add INSERT policy for authenticated users on audit_logs table
    - Users can only insert audit logs for themselves (user_id = uid())
    - This fixes the 403 error when clients try to create audit log entries

  2. Problem Solved
    - Previously only SELECT policies existed for audit_logs
    - INSERT operations were blocked by RLS, causing 403 errors
    - Now authenticated users can log their own actions

  3. Security Considerations
    - Users can only insert logs with their own user_id
    - Cannot insert logs for other users
    - Maintains audit trail integrity
*/

-- Add INSERT policy for audit_logs table
DO $$
BEGIN
  -- Check if policy already exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' 
    AND policyname = 'audit_logs_insert_own'
  ) THEN
    CREATE POLICY "audit_logs_insert_own"
      ON audit_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = uid());
  END IF;
END $$;