/*
  # Fix Service Role Policy for Notifications Table

  1. Security
    - Add policy for service_role to insert notifications
    - This allows Edge Functions to create notifications
    - Maintains security by restricting to service_role only

  2. Changes
    - Add INSERT policy for service_role on notifications table
    - This fixes the "permission denied for table notifications" error
*/

-- Add policy for service_role to insert notifications
CREATE POLICY "Service role can insert notifications"
  ON public.notifications
  FOR INSERT
  TO service_role
  USING (true)
  WITH CHECK (true);