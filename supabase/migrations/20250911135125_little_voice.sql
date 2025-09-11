/*
  # Fix notification RLS policies

  1. Policies
    - Drop existing conflicting policies
    - Create proper INSERT policy for notifications
  
  2. Security
    - Allow users to create notifications for themselves or their consultant
    - Maintain data security with proper RLS
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can create notifications for themselves or their assigned consultant" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert_own" ON public.notifications;

-- Create the correct INSERT policy for notifications
CREATE POLICY "notifications_insert_policy"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (
  (recipient_profile_id = auth.uid()) OR
  (recipient_profile_id IN (
    SELECT assigned_consultant_id 
    FROM public.clients 
    WHERE profile_id = auth.uid() 
    AND assigned_consultant_id IS NOT NULL
  ))
);