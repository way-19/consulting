/*
  # Fix Notifications RLS Policies for Service Role

  1. Security
    - Drop conflicting policies
    - Add proper service_role policy for INSERT operations
    - Ensure Edge Functions can create notifications

  2. Changes
    - Remove duplicate/conflicting policies
    - Add service_role INSERT policy with correct syntax
    - Maintain existing user policies
*/

-- Drop any conflicting service role policies
DROP POLICY IF EXISTS "Service role can insert notifications" ON notifications;
DROP POLICY IF EXISTS "service_role_insert_notifications" ON notifications;

-- Add proper service role policy for INSERT
CREATE POLICY "service_role_notifications_insert"
  ON notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Ensure authenticated users can still insert their own notifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notifications' 
    AND policyname = 'Users can create notifications for themselves or their assigned'
  ) THEN
    CREATE POLICY "Users can create notifications for themselves or their assigned"
      ON notifications
      FOR INSERT
      TO authenticated
      WITH CHECK (
        (recipient_profile_id = auth.uid()) OR 
        (recipient_profile_id IN (
          SELECT clients.assigned_consultant_id
          FROM clients
          WHERE clients.profile_id = auth.uid()
        ))
      );
  END IF;
END $$;