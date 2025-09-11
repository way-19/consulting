/*
  # Update existing service role policy for notifications

  1. Policy Updates
    - Drop existing "Service role can insert notifications" policy
    - Create new policy with correct WITH CHECK syntax
    - Allow service_role to insert notifications for Edge Functions

  2. Security
    - Maintains RLS protection
    - Only allows service_role access
    - Enables Edge Function notifications
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;

-- Create new policy with correct syntax
CREATE POLICY "Service role can insert notifications"
  ON public.notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);