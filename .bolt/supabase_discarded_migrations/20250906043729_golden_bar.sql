/*
  # Storage Management System for Client File Manager

  1. Storage Fields
    - Add storage tracking to user_profiles table
    - Add file activity tracking
    - Add storage tier management

  2. Helper Functions
    - Storage calculation functions
    - File cleanup utilities
    - Storage tier validation

  3. Triggers
    - Automatic storage usage updates
    - File activity tracking
*/

-- Add storage fields to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'storage_limit_gb'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN storage_limit_gb numeric(10,2) DEFAULT 5.00;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'storage_used_bytes'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN storage_used_bytes bigint DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_file_activity'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_file_activity timestamptz DEFAULT now();
  END IF;
END $$;

-- Add service termination date to clients table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'service_termination_date'
  ) THEN
    ALTER TABLE clients ADD COLUMN service_termination_date timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'storage_tier'
  ) THEN
    ALTER TABLE clients ADD COLUMN storage_tier text DEFAULT 'basic';
  END IF;
END $$;

-- Add storage tier constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'clients_storage_tier_check'
  ) THEN
    ALTER TABLE clients ADD CONSTRAINT clients_storage_tier_check 
    CHECK (storage_tier IN ('basic', 'standard', 'premium', 'enterprise'));
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_storage_usage ON user_profiles(storage_used_bytes);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_activity ON user_profiles(last_file_activity);
CREATE INDEX IF NOT EXISTS idx_clients_termination_date ON clients(service_termination_date);

-- Helper function to get storage stats for a user
CREATE OR REPLACE FUNCTION get_user_storage_stats(user_id_param uuid)
RETURNS TABLE (
  storage_limit_gb numeric,
  storage_used_bytes bigint,
  storage_used_mb numeric,
  storage_percentage numeric,
  files_count bigint,
  tier text
) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.storage_limit_gb,
    up.storage_used_bytes,
    ROUND(up.storage_used_bytes::numeric / (1024 * 1024), 2) as storage_used_mb,
    CASE 
      WHEN up.storage_limit_gb > 0 THEN 
        ROUND((up.storage_used_bytes::numeric / (up.storage_limit_gb * 1024 * 1024 * 1024)) * 100, 1)
      ELSE 0
    END as storage_percentage,
    COALESCE(file_stats.files_count, 0) as files_count,
    COALESCE(c.storage_tier, 'basic') as tier
  FROM user_profiles up
  LEFT JOIN clients c ON c.profile_id = up.id
  LEFT JOIN (
    SELECT 
      fm.created_by,
      COUNT(*) as files_count
    FROM file_manager fm
    INNER JOIN clients cl ON cl.id = fm.client_id
    WHERE fm.type = 'file' AND cl.profile_id = user_id_param
    GROUP BY fm.created_by
  ) file_stats ON file_stats.created_by = up.id
  WHERE up.id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to update storage usage
CREATE OR REPLACE FUNCTION update_storage_usage()
RETURNS TRIGGER
SECURITY DEFINER
AS $$
DECLARE
  user_id_val uuid;
BEGIN
  -- Get user_id from client relationship
  IF TG_OP = 'INSERT' THEN
    SELECT c.profile_id INTO user_id_val
    FROM clients c
    WHERE c.id = NEW.client_id;
    
    -- Increment storage usage
    IF user_id_val IS NOT NULL AND NEW.file_size IS NOT NULL THEN
      UPDATE user_profiles 
      SET 
        storage_used_bytes = storage_used_bytes + NEW.file_size,
        last_file_activity = now()
      WHERE id = user_id_val;
    END IF;
    
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    SELECT c.profile_id INTO user_id_val
    FROM clients c
    WHERE c.id = OLD.client_id;
    
    -- Decrement storage usage
    IF user_id_val IS NOT NULL AND OLD.file_size IS NOT NULL THEN
      UPDATE user_profiles 
      SET 
        storage_used_bytes = GREATEST(0, storage_used_bytes - OLD.file_size),
        last_file_activity = now()
      WHERE id = user_id_val;
    END IF;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on file_manager table
DROP TRIGGER IF EXISTS trigger_update_storage_usage ON file_manager;
CREATE TRIGGER trigger_update_storage_usage
  AFTER INSERT OR DELETE ON file_manager
  FOR EACH ROW
  EXECUTE FUNCTION update_storage_usage();

-- Function to update file manager updated_at timestamp
CREATE OR REPLACE FUNCTION update_file_manager_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_file_manager_updated_at ON file_manager;
CREATE TRIGGER update_file_manager_updated_at
  BEFORE UPDATE ON file_manager
  FOR EACH ROW
  EXECUTE FUNCTION update_file_manager_updated_at();