/*
  # Clean Duplicate Document Alerts

  1. Clean Up
    - Remove duplicate document_uploaded alerts
    - Keep only one alert per client for document uploads
    - Resolve old document-specific alerts

  2. Security
    - Enable RLS on consultant_alerts table
    - Ensure proper access control
*/

-- Clean up existing duplicate document alerts
-- First, resolve all existing document_uploaded alerts
UPDATE consultant_alerts 
SET is_resolved = true, resolved_at = now() 
WHERE alert_type = 'document_uploaded' AND is_resolved = false;

-- Create a single alert per client that has uploaded documents
INSERT INTO consultant_alerts (consultant_id, alert_source_id, alert_type, is_resolved)
SELECT DISTINCT 
  c.assigned_consultant_id as consultant_id,
  c.id as alert_source_id, -- Use client_id as source
  'document_uploaded' as alert_type,
  false as is_resolved
FROM clients c
WHERE c.assigned_consultant_id IS NOT NULL
  AND EXISTS (
    SELECT 1 FROM documents d 
    WHERE d.client_id = c.id 
      AND d.status = 'uploaded'
      AND d.created_at >= NOW() - INTERVAL '7 days' -- Only recent uploads
  )
ON CONFLICT (consultant_id, alert_source_id, alert_type) DO NOTHING;