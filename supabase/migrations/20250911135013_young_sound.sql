/*
  # Add notification insert policy

  1. Security
    - Add RLS policy for notifications table INSERT operations
  
  2. Policy Details
    - Users can create notifications for themselves or their assigned consultant
*/

-- Create policy for notification inserts
CREATE POLICY "Users can create notifications for themselves or their assigned consultant"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  (recipient_profile_id = auth.uid()) OR
  (recipient_profile_id IN (SELECT assigned_consultant_id FROM public.clients WHERE profile_id = auth.uid()))
);