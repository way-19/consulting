/*
  # Update audit_logs action_type_check constraint

  1. Constraint Update
    - Remove existing audit_logs_action_type_check constraint
    - Add new constraint with 'document_deleted' action type included
  
  2. Security
    - Maintains data integrity while allowing document deletion audit logs
    - Ensures all valid action types are properly constrained
*/

-- Remove existing constraint
ALTER TABLE public.audit_logs 
DROP CONSTRAINT IF EXISTS audit_logs_action_type_check;

-- Add updated constraint with document_deleted included
ALTER TABLE public.audit_logs 
ADD CONSTRAINT audit_logs_action_type_check CHECK (action_type = ANY (ARRAY[
  'invoice_payment_initiated'::text,
  'login'::text,
  'document_uploaded'::text,
  'user_registered'::text,
  'user_signed_out'::text,
  'profile_updated'::text,
  'password_changed'::text,
  'mfa_enabled'::text,
  'mfa_disabled'::text,
  'service_ordered'::text,
  'payment_completed'::text,
  'task_created'::text,
  'task_updated'::text,
  'task_completed'::text,
  'message_sent'::text,
  'document_approved'::text,
  'document_rejected'::text,
  'consultant_assigned'::text,
  'client_created'::text,
  'project_created'::text,
  'meeting_scheduled'::text,
  'invoice_created'::text,
  'payment_failed'::text,
  'backup_codes_generated'::text,
  'security_event'::text,
  'suspicious_activity'::text,
  'other'::text,
  'your_new_action_type'::text,
  'document_deleted'::text
]));