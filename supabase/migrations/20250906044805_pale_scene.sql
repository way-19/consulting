/*
  # Fix Storage Function Return Type

  1. Issues Resolved
    - Drop existing function with incompatible return type
    - Recreate with correct OUT parameter structure
    - Add proper error handling and security

  2. Storage Functions
    - get_user_storage_stats() with correct return type
    - increment_storage() with validation
    - decrement_storage() with validation
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_user_storage_stats(uuid);
DROP FUNCTION IF EXISTS increment_storage(uuid, bigint);
DROP FUNCTION IF EXISTS decrement_storage(uuid, bigint);

-- Create storage stats function with correct return type
CREATE OR REPLACE FUNCTION get_user_storage_stats(user_id_param uuid)
RETURNS TABLE(
  storage_limit_gb numeric,
  storage_used_bytes bigint,
  storage_used_mb numeric,
  storage_percentage numeric,
  files_count integer,
  tier text
) 
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  client_record RECORD;
  file_count integer;
  used_mb numeric;
  percentage_used numeric;
BEGIN
  -- Get user profile with client info
  SELECT 
    up.storage_limit_gb,
    up.storage_used_bytes,
    c.storage_tier
  INTO client_record
  FROM user_profiles up
  LEFT JOIN clients c ON c.profile_id = up.id
  WHERE up.id = user_id_param;

  -- If no record found, return default values
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      5.00::numeric as storage_limit_gb,
      0::bigint as storage_used_bytes,
      0.00::numeric as storage_used_mb,
      0.00::numeric as storage_percentage,
      0::integer as files_count,
      'basic'::text as tier;
    RETURN;
  END IF;

  -- Get file count
  SELECT COUNT(*)
  INTO file_count
  FROM file_manager fm
  JOIN clients c ON c.id = fm.client_id
  WHERE c.profile_id = user_id_param 
    AND fm.type = 'file';

  -- Calculate values
  used_mb := ROUND((client_record.storage_used_bytes / 1024.0 / 1024.0)::numeric, 2);
  percentage_used := CASE 
    WHEN client_record.storage_limit_gb > 0 THEN
      ROUND(((client_record.storage_used_bytes / 1024.0 / 1024.0 / 1024.0) / client_record.storage_limit_gb * 100.0)::numeric, 2)
    ELSE 0
  END;

  RETURN QUERY SELECT 
    COALESCE(client_record.storage_limit_gb, 5.00),
    COALESCE(client_record.storage_used_bytes, 0),
    COALESCE(used_mb, 0.00),
    COALESCE(percentage_used, 0.00),
    COALESCE(file_count, 0),
    COALESCE(client_record.storage_tier, 'basic');
END;
$$;

-- Create increment storage function
CREATE OR REPLACE FUNCTION increment_storage(user_id_param uuid, size_bytes_param bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE user_profiles
  SET 
    storage_used_bytes = COALESCE(storage_used_bytes, 0) + size_bytes_param,
    last_file_activity = now()
  WHERE id = user_id_param;
  
  -- Log if no rows affected
  IF NOT FOUND THEN
    RAISE WARNING 'No user profile found for ID: %', user_id_param;
  END IF;
END;
$$;

-- Create decrement storage function
CREATE OR REPLACE FUNCTION decrement_storage(user_id_param uuid, size_bytes_param bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE user_profiles
  SET 
    storage_used_bytes = GREATEST(0, COALESCE(storage_used_bytes, 0) - size_bytes_param),
    last_file_activity = now()
  WHERE id = user_id_param;
  
  -- Log if no rows affected
  IF NOT FOUND THEN
    RAISE WARNING 'No user profile found for ID: %', user_id_param;
  END IF;
END;
$$;