/*
  # Add Service Role Policy for Notifications Table

  1. New Policy
    - Allow service_role to insert notifications
    - This enables Edge Functions to create notifications without user context

  2. Security
    - Only service_role can use this policy
    - Maintains security while enabling system notifications
*/

-- Add policy to allow service_role to insert notifications
CREATE POLICY "Service role can insert notifications"
  ON public.notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);