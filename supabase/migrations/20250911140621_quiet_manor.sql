/*
  # Add DELETE policies for documents table

  1. Security Policies
    - Enable clients to delete their own documents
    - Enable consultants to delete documents for assigned clients
    - Enable admins to delete any documents

  2. Storage Cleanup
    - Add trigger to clean up storage files when documents are deleted
    - Ensure referential integrity
*/

-- Add DELETE policy for clients to delete their own documents
CREATE POLICY "Clients can delete their own documents"
ON public.documents FOR DELETE TO authenticated 
USING (
  client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.profile_id = auth.uid()
  )
);

-- Add DELETE policy for consultants to delete documents for assigned clients
CREATE POLICY "Consultants can delete documents for assigned clients"
ON public.documents FOR DELETE TO authenticated 
USING (
  client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.assigned_consultant_id = auth.uid()
  )
);

-- Add DELETE policy for admins to delete any documents
CREATE POLICY "Admins can delete any documents"
ON public.documents FOR DELETE TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);

-- Create function to clean up storage files when documents are deleted
CREATE OR REPLACE FUNCTION cleanup_document_storage()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the deletion for audit purposes
  INSERT INTO audit_logs (
    user_id,
    action_type,
    description,
    payload
  ) VALUES (
    auth.uid(),
    'document_deleted',
    'Document deleted: ' || OLD.name,
    jsonb_build_object(
      'document_id', OLD.id,
      'file_url', OLD.file_url,
      'file_size', OLD.file_size,
      'client_id', OLD.client_id
    )
  );

  -- Note: In production, you would also delete the file from Supabase Storage here
  -- This requires a storage deletion function or edge function call
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run cleanup function when documents are deleted
DROP TRIGGER IF EXISTS cleanup_document_storage_trigger ON public.documents;
CREATE TRIGGER cleanup_document_storage_trigger
  BEFORE DELETE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_document_storage();

-- Add similar DELETE policies for file_manager table
CREATE POLICY "Clients can delete their own files"
ON public.file_manager FOR DELETE TO authenticated 
USING (
  client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.profile_id = auth.uid()
  )
);

CREATE POLICY "Consultants can delete files for assigned clients"
ON public.file_manager FOR DELETE TO authenticated 
USING (
  client_id IN (
    SELECT clients.id 
    FROM clients 
    WHERE clients.assigned_consultant_id = auth.uid()
  )
);

CREATE POLICY "Admins can delete any files"
ON public.file_manager FOR DELETE TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  )
);