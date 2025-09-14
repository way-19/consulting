/*
# Add INSERT policy for audit_logs table

1. Security Policies
   - Allow authenticated users to insert their own audit logs
   - Users can only insert records where user_id matches their authenticated user ID

2. RLS Policy Details
   - Table: audit_logs
   - Operation: INSERT
   - Target: authenticated users
   - Check condition: user_id = auth.uid()
*/

DO $$
BEGIN
  -- Add INSERT policy for authenticated users to create their own audit logs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'audit_logs' 
    AND policyname = 'audit_logs_insert_own'
  ) THEN
    CREATE POLICY "audit_logs_insert_own"
      ON audit_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;