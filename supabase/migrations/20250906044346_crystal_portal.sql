/*
  # Storage Management Helper Functions

  1. Storage calculation functions
  2. File cleanup utilities
  3. Storage validation functions
*/

-- Function to safely increment storage usage
CREATE OR REPLACE FUNCTION increment_storage(user_id_param uuid, size_bytes_param bigint)
RETURNS bigint
SECURITY DEFINER
AS $$
DECLARE
  current_usage bigint;
  new_usage bigint;
BEGIN
  -- Get current usage
  SELECT storage_used_bytes INTO current_usage
  FROM user_profiles
  WHERE id = user_id_param;
  
  -- Calculate new usage
  new_usage := COALESCE(current_usage, 0) + size_bytes_param;
  
  -- Update and return new value
  UPDATE user_profiles 
  SET storage_used_bytes = new_usage
  WHERE id = user_id_param;
  
  RETURN new_usage;
END;
$$ LANGUAGE plpgsql;

-- Function to safely decrement storage usage
CREATE OR REPLACE FUNCTION decrement_storage(user_id_param uuid, size_bytes_param bigint)
RETURNS bigint
SECURITY DEFINER
AS $$
DECLARE
  current_usage bigint;
  new_usage bigint;
BEGIN
  -- Get current usage
  SELECT storage_used_bytes INTO current_usage
  FROM user_profiles
  WHERE id = user_id_param;
  
  -- Calculate new usage (never go below 0)
  new_usage := GREATEST(0, COALESCE(current_usage, 0) - size_bytes_param);
  
  -- Update and return new value
  UPDATE user_profiles 
  SET storage_used_bytes = new_usage
  WHERE id = user_id_param;
  
  RETURN new_usage;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can upload a file
CREATE OR REPLACE FUNCTION can_upload_file(user_id_param uuid, file_size_param bigint)
RETURNS boolean
SECURITY DEFINER
AS $$
DECLARE
  storage_limit numeric;
  current_usage bigint;
  limit_bytes bigint;
BEGIN
  -- Get user's storage info
  SELECT storage_limit_gb, storage_used_bytes
  INTO storage_limit, current_usage
  FROM user_profiles
  WHERE id = user_id_param;
  
  -- Convert limit to bytes
  limit_bytes := (COALESCE(storage_limit, 5) * 1024 * 1024 * 1024)::bigint;
  
  -- Check if new file would exceed limit
  RETURN (COALESCE(current_usage, 0) + file_size_param) <= limit_bytes;
END;
$$ LANGUAGE plpgsql;

-- Function to get storage tier by limit
CREATE OR REPLACE FUNCTION get_storage_tier_by_limit(limit_gb numeric)
RETURNS text
AS $$
BEGIN
  CASE 
    WHEN limit_gb <= 5 THEN RETURN 'basic';
    WHEN limit_gb <= 20 THEN RETURN 'standard';
    WHEN limit_gb <= 50 THEN RETURN 'premium';
    WHEN limit_gb <= 100 THEN RETURN 'enterprise';
    ELSE RETURN 'enterprise';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to upgrade storage tier
CREATE OR REPLACE FUNCTION upgrade_storage_tier(user_id_param uuid, new_tier text)
RETURNS boolean
SECURITY DEFINER
AS $$
DECLARE
  new_limit numeric;
  client_id_val uuid;
BEGIN
  -- Determine new storage limit
  CASE new_tier
    WHEN 'basic' THEN new_limit := 5;
    WHEN 'standard' THEN new_limit := 20;
    WHEN 'premium' THEN new_limit := 50;
    WHEN 'enterprise' THEN new_limit := 100;
    ELSE RETURN false;
  END CASE;
  
  -- Update user profile
  UPDATE user_profiles 
  SET storage_limit_gb = new_limit
  WHERE id = user_id_param;
  
  -- Update client storage tier
  SELECT id INTO client_id_val
  FROM clients
  WHERE profile_id = user_id_param;
  
  IF client_id_val IS NOT NULL THEN
    UPDATE clients 
    SET storage_tier = new_tier
    WHERE id = client_id_val;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;