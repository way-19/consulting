/*
  # Add document_id column to mail_forwarding_requests table

  1. Changes
     - Add document_id column to existing mail_forwarding_requests table
     - Add foreign key constraint to documents table
     - Add index for performance

  2. Security
     - Maintain existing RLS policies
*/

-- Add document_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mail_forwarding_requests' 
    AND column_name = 'document_id'
  ) THEN
    ALTER TABLE mail_forwarding_requests ADD COLUMN document_id uuid;
  END IF;
END $$;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_mail_forwarding_requests_document_id 
ON mail_forwarding_requests(document_id);

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_mail_forwarding_requests_document'
  ) THEN
    ALTER TABLE mail_forwarding_requests 
    ADD CONSTRAINT fk_mail_forwarding_requests_document 
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL;
  END IF;
END $$;