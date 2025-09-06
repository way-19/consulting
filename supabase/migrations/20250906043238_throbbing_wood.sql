/*
  # Fix storage analytics error

  1. Remove problematic storage_analytics view
  2. Create simpler storage management functions
  3. Fix any dependencies
*/

-- Drop the problematic view if it exists
DROP VIEW IF EXISTS storage_analytics;

-- Drop and recreate the storage functions with better error handling
DROP FUNCTION IF EXISTS increment_storage(uuid, bigint);
DROP FUNCTION IF EXISTS decrement_storage(uuid, bigint);

-- Create improved storage increment function
CREATE OR REPLACE FUNCTION increment_storage(user_id_param uuid, size_bytes_param bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_profiles
  SET 
    storage_used_bytes = COALESCE(storage_used_bytes, 0) + size_bytes_param,
    last_file_activity = now()
  WHERE id = user_id_param;
  
  -- Ensure the update happened
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found for ID: %', user_id_param;
  END IF;
END;
$$;

-- Create improved storage decrement function
CREATE OR REPLACE FUNCTION decrement_storage(user_id_param uuid, size_bytes_param bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE user_profiles
  SET 
    storage_used_bytes = GREATEST(COALESCE(storage_used_bytes, 0) - size_bytes_param, 0),
    last_file_activity = now()
  WHERE id = user_id_param;
  
  -- Ensure the update happened
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found for ID: %', user_id_param;
  END IF;
END;
$$;

-- Create storage usage trigger function
CREATE OR REPLACE FUNCTION update_storage_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_to_update uuid;
BEGIN
  -- Get the user ID from the client who owns this file
  IF TG_OP = 'INSERT' THEN
    -- Get user ID from client relationship
    SELECT c.profile_id INTO user_id_to_update
    FROM clients c
    WHERE c.id = NEW.client_id;
    
    IF user_id_to_update IS NOT NULL AND NEW.file_size IS NOT NULL THEN
      PERFORM increment_storage(user_id_to_update, NEW.file_size);
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Get user ID from client relationship
    SELECT c.profile_id INTO user_id_to_update
    FROM clients c
    WHERE c.id = OLD.client_id;
    
    IF user_id_to_update IS NOT NULL AND OLD.file_size IS NOT NULL THEN
      PERFORM decrement_storage(user_id_to_update, OLD.file_size);
    END IF;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$;

-- Apply the trigger to file_manager table
DROP TRIGGER IF EXISTS trigger_update_storage_usage ON file_manager;
CREATE TRIGGER trigger_update_storage_usage
  AFTER INSERT OR DELETE ON file_manager
  FOR EACH ROW
  EXECUTE FUNCTION update_storage_usage();

-- Create a simple function to get storage stats (instead of view)
CREATE OR REPLACE FUNCTION get_user_storage_stats(user_id_param uuid)
RETURNS TABLE (
  storage_limit_gb numeric,
  storage_used_bytes bigint,
  storage_used_gb numeric,
  storage_percentage numeric,
  files_count bigint,
  folders_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.storage_limit_gb,
    up.storage_used_bytes,
    ROUND(up.storage_used_bytes / (1024.0 * 1024.0 * 1024.0), 2) as storage_used_gb,
    ROUND((up.storage_used_bytes / (up.storage_limit_gb * 1024.0 * 1024.0 * 1024.0)) * 100, 1) as storage_percentage,
    COALESCE(file_stats.files_count, 0) as files_count,
    COALESCE(folder_stats.folders_count, 0) as folders_count
  FROM user_profiles up
  LEFT JOIN (
    SELECT c.profile_id, COUNT(*) as files_count
    FROM file_manager fm
    JOIN clients c ON c.id = fm.client_id
    WHERE fm.type = 'file'
    GROUP BY c.profile_id
  ) file_stats ON file_stats.profile_id = up.id
  LEFT JOIN (
    SELECT c.profile_id, COUNT(*) as folders_count
    FROM file_manager fm
    JOIN clients c ON c.id = fm.client_id
    WHERE fm.type = 'folder'
    GROUP BY c.profile_id
  ) folder_stats ON folder_stats.profile_id = up.id
  WHERE up.id = user_id_param;
END;
$$;