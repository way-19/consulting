/*
  # Storage Helper Functions

  1. Storage Calculation Functions
     - increment_storage: Safely increase storage usage
     - decrement_storage: Safely decrease storage usage
     - calculate_user_storage: Recalculate total storage for a user

  2. Storage Management
     - Storage limit enforcement
     - Usage tracking
     - Cleanup utilities
*/

-- Function to safely increment storage usage
CREATE OR REPLACE FUNCTION increment_storage(user_id uuid, size_bytes bigint)
RETURNS bigint AS $$
DECLARE
  current_usage bigint;
  storage_limit numeric(10,2);
  new_usage bigint;
BEGIN
  -- Get current usage and limit
  SELECT storage_used_bytes, storage_limit_gb 
  INTO current_usage, storage_limit
  FROM user_profiles 
  WHERE id = user_id;
  
  -- Calculate new usage
  new_usage := COALESCE(current_usage, 0) + size_bytes;
  
  -- Check if it would exceed limit
  IF new_usage > (storage_limit * 1024 * 1024 * 1024) THEN
    RAISE EXCEPTION 'Storage limit would be exceeded. Current: % bytes, Adding: % bytes, Limit: % GB',
      current_usage, size_bytes, storage_limit;
  END IF;
  
  RETURN new_usage;
END;
$$ LANGUAGE plpgsql;

-- Function to safely decrement storage usage
CREATE OR REPLACE FUNCTION decrement_storage(user_id uuid, size_bytes bigint)
RETURNS bigint AS $$
DECLARE
  current_usage bigint;
  new_usage bigint;
BEGIN
  -- Get current usage
  SELECT storage_used_bytes 
  INTO current_usage
  FROM user_profiles 
  WHERE id = user_id;
  
  -- Calculate new usage (ensure it doesn't go below 0)
  new_usage := GREATEST(0, COALESCE(current_usage, 0) - size_bytes);
  
  RETURN new_usage;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate storage usage for a user
CREATE OR REPLACE FUNCTION calculate_user_storage(user_id uuid)
RETURNS bigint AS $$
DECLARE
  total_usage bigint;
BEGIN
  SELECT COALESCE(SUM(file_size), 0)
  INTO total_usage
  FROM file_manager 
  WHERE created_by = user_id AND type = 'file' AND file_size IS NOT NULL;
  
  -- Update the user's storage usage
  UPDATE user_profiles 
  SET storage_used_bytes = total_usage
  WHERE id = user_id;
  
  RETURN total_usage;
END;
$$ LANGUAGE plpgsql;

-- Function to get storage tier benefits
CREATE OR REPLACE FUNCTION get_storage_tier_benefits(tier text)
RETURNS jsonb AS $$
BEGIN
  CASE tier
    WHEN 'enterprise' THEN
      RETURN jsonb_build_object(
        'storage_gb', 100,
        'features', ARRAY['Unlimited folders', 'Version history', 'Advanced sharing', 'Priority support'],
        'price_monthly', 99
      );
    WHEN 'premium' THEN
      RETURN jsonb_build_object(
        'storage_gb', 50,
        'features', ARRAY['Advanced folders', 'File sharing', 'Extended history', 'Email support'],
        'price_monthly', 49
      );
    WHEN 'standard' THEN
      RETURN jsonb_build_object(
        'storage_gb', 20,
        'features', ARRAY['Folder organization', 'Basic sharing', 'Standard support'],
        'price_monthly', 19
      );
    ELSE
      RETURN jsonb_build_object(
        'storage_gb', 5,
        'features', ARRAY['Basic storage', 'Limited sharing'],
        'price_monthly', 0
      );
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Update storage limits for existing clients based on their service status
UPDATE user_profiles 
SET storage_limit_gb = CASE 
  WHEN id IN (
    SELECT c.profile_id 
    FROM clients c 
    WHERE c.status = 'active' AND COALESCE(c.storage_tier, 'standard') = 'enterprise'
  ) THEN 100.00
  WHEN id IN (
    SELECT c.profile_id 
    FROM clients c 
    WHERE c.status = 'active' AND COALESCE(c.storage_tier, 'standard') = 'premium'
  ) THEN 50.00
  WHEN id IN (
    SELECT c.profile_id 
    FROM clients c 
    WHERE c.status = 'active'
  ) THEN 20.00  -- Standard tier for active clients
  ELSE 5.00     -- Basic tier for inactive users
END;

-- Recalculate storage usage for all users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id FROM user_profiles WHERE role = 'client'
  LOOP
    PERFORM calculate_user_storage(user_record.id);
  END LOOP;
END $$;

-- Create notification template for storage warnings
INSERT INTO notification_templates (type, language_code, subject, body_template, is_active) VALUES
('storage_limit_warning', 'en', 'Storage Limit Warning', 
 'Your file storage is {{usage_percentage}}% full ({{used_gb}}GB of {{limit_gb}}GB). Consider upgrading your storage plan or cleaning up old files.',
 true)
ON CONFLICT (type, language_code) DO UPDATE SET
  body_template = EXCLUDED.body_template,
  updated_at = now();

INSERT INTO notification_templates (type, language_code, subject, body_template, is_active) VALUES
('storage_limit_exceeded', 'en', 'Storage Limit Exceeded', 
 'Your storage limit has been reached. Please upgrade your plan or remove some files to continue uploading.',
 true)
ON CONFLICT (type, language_code) DO UPDATE SET
  body_template = EXCLUDED.body_template,
  updated_at = now();

INSERT INTO notification_templates (type, language_code, subject, body_template, is_active) VALUES
('service_termination_warning', 'en', 'File Deletion Notice', 
 'Your consulting service has ended. Your files will be automatically deleted on {{deletion_date}} unless you reactivate services.',
 true)
ON CONFLICT (type, language_code) DO UPDATE SET
  body_template = EXCLUDED.body_template,
  updated_at = now();