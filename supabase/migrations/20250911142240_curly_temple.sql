/*
  # Fix Service Role Policy for Notifications Table

  1. Problem
    - Edge functions cannot create notifications due to RLS policy restrictions
    - service_role needs INSERT permission on notifications table

  2. Solution
    - Add proper INSERT policy for service_role
    - Use WITH CHECK instead of USING for INSERT operations
*/

-- Add service role INSERT policy for notifications
CREATE POLICY "Service role can insert notifications"
  ON notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);