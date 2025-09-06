/*
  # Setup Storage Automation and Cleanup Jobs

  1. Automated Jobs
     - Weekly cleanup of old files (1+ year)
     - Daily cleanup of terminated services (30+ days)
     - Storage usage monitoring

  2. Constraints and Validations
     - File type restrictions in database
     - Storage limit enforcement

  3. Cleanup Policies
     - Auto-delete inactive files after 1 year
     - Clean terminated service files after 30 days
     - Storage usage optimization
*/

-- Create pg_cron jobs for automated cleanup
-- Weekly cleanup of old files (every Sunday at 2 AM UTC)
SELECT cron.schedule(
  'auto-delete-old-files-weekly',
  '0 2 * * 0',
  'SELECT net.http_post(
    url := ''http://localhost:54321/functions/v1/auto-delete-old-files'',
    headers := jsonb_build_object(
      ''Content-Type'', ''application/json'',
      ''Authorization'', ''Bearer '' || current_setting(''app.settings.service_role_key'', true)
    ),
    body := ''{}''::jsonb
  );'
);

-- Daily cleanup of terminated services (every day at 3 AM UTC)
SELECT cron.schedule(
  'handle-terminated-services-daily',
  '0 3 * * *',
  'SELECT net.http_post(
    url := ''http://localhost:54321/functions/v1/handle-terminated-services'',
    headers := jsonb_build_object(
      ''Content-Type'', ''application/json'',
      ''Authorization'', ''Bearer '' || current_setting(''app.settings.service_role_key'', true)
    ),
    body := ''{}''::jsonb
  );'
);

-- Create function to validate file types
CREATE OR REPLACE FUNCTION validate_file_type(mime_type text)
RETURNS boolean AS $$
BEGIN
  RETURN mime_type = ANY (ARRAY[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', -- DOCX
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', -- XLSX
    'image/jpeg',
    'image/jpg', 
    'image/png'
  ]);
END;
$$ LANGUAGE plpgsql;

-- Add file type validation to file_manager
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE constraint_name = 'file_manager_mime_type_check'
  ) THEN
    ALTER TABLE file_manager 
    ADD CONSTRAINT file_manager_mime_type_check 
    CHECK (type = 'folder' OR validate_file_type(mime_type));
  END IF;
END $$;

-- Create function to enforce storage limits
CREATE OR REPLACE FUNCTION check_storage_limit()
RETURNS trigger AS $$
DECLARE
  user_storage_limit numeric(10,2);
  user_storage_used bigint;
  new_file_size bigint;
BEGIN
  -- Only check for file uploads
  IF TG_OP = 'INSERT' AND NEW.type = 'file' THEN
    new_file_size := COALESCE(NEW.file_size, 0);
    
    -- Get user's storage info
    SELECT storage_limit_gb, storage_used_bytes 
    INTO user_storage_limit, user_storage_used
    FROM user_profiles 
    WHERE id = NEW.created_by;
    
    -- Check if adding this file would exceed the limit
    IF (user_storage_used + new_file_size) > (user_storage_limit * 1024 * 1024 * 1024) THEN
      RAISE EXCEPTION 'Storage limit exceeded. Limit: % GB, Current usage: % MB, File size: % MB', 
        user_storage_limit,
        ROUND((user_storage_used::numeric / (1024 * 1024))::numeric, 2),
        ROUND((new_file_size::numeric / (1024 * 1024))::numeric, 2);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce storage limits
DROP TRIGGER IF EXISTS trigger_check_storage_limit ON file_manager;
CREATE TRIGGER trigger_check_storage_limit
  BEFORE INSERT ON file_manager
  FOR EACH ROW EXECUTE FUNCTION check_storage_limit();

-- Update existing users to have proper storage limits
UPDATE user_profiles 
SET 
  storage_limit_gb = CASE 
    WHEN id IN (
      SELECT c.profile_id 
      FROM clients c 
      WHERE c.status = 'active' AND c.storage_tier = 'enterprise'
    ) THEN 100.00
    WHEN id IN (
      SELECT c.profile_id 
      FROM clients c 
      WHERE c.status = 'active' AND c.storage_tier = 'premium'  
    ) THEN 50.00
    WHEN id IN (
      SELECT c.profile_id 
      FROM clients c 
      WHERE c.status = 'active' AND c.storage_tier = 'standard'
    ) THEN 20.00
    WHEN id IN (
      SELECT c.profile_id 
      FROM clients c 
      WHERE c.status = 'active'
    ) THEN 20.00  -- Default for active clients
    ELSE 5.00     -- Basic for inactive or new users
  END,
  storage_used_bytes = COALESCE(
    (SELECT SUM(file_size) 
     FROM file_manager fm 
     WHERE fm.created_by = user_profiles.id AND fm.type = 'file'), 
    0
  );

-- Create view for storage analytics
CREATE OR REPLACE VIEW storage_analytics AS
SELECT 
  up.id as user_id,
  up.full_name,
  up.role,
  up.storage_limit_gb,
  up.storage_used_bytes,
  ROUND((up.storage_used_bytes::numeric / (1024 * 1024 * 1024))::numeric, 2) as storage_used_gb,
  ROUND(((up.storage_used_bytes::numeric / (up.storage_limit_gb * 1024 * 1024 * 1024)) * 100)::numeric, 2) as usage_percentage,
  c.status as client_status,
  c.storage_tier,
  c.service_termination_date,
  (SELECT COUNT(*) FROM file_manager fm WHERE fm.created_by = up.id AND fm.type = 'file') as total_files,
  up.last_file_activity
FROM user_profiles up
LEFT JOIN clients c ON c.profile_id = up.id
WHERE up.role IN ('client', 'consultant');

-- Grant permissions for the view
GRANT SELECT ON storage_analytics TO authenticated;

-- Add RLS policy for storage analytics (users can only see their own data)
ALTER VIEW storage_analytics OWNER TO postgres;
CREATE POLICY "Users can view own storage analytics" ON storage_analytics
  FOR SELECT USING (user_id = uid());