/*
  # Add document_uploaded alert type

  1. Schema Changes
    - Add 'document_uploaded' value to alert_type enum in consultant_alerts table
  
  2. Purpose
    - Separate document upload alerts from document due alerts
    - Improve consultant workflow clarity
*/

-- Add new alert type to enum
ALTER TYPE alert_type ADD VALUE 'document_uploaded';