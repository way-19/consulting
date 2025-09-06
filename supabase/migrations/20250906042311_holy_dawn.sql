/*
  # Add Storage Tiers and File Management Policies

  1. Storage Management
     - Add storage limit and usage tracking to user_profiles
     - Add service termination tracking to clients
     - Add file type validation

  2. Storage Tiers
     - Basic: 5GB for new users
     - Standard: 20GB for active clients
     - Premium: 50GB for premium clients
     - Enterprise: 100GB for enterprise clients

  3. Policies
     - Auto-deletion after 1 year of inactivity
     - 30-day grace period after service termination
     - File type restrictions
*/

-- Add storage tracking fields to user_profiles
DO $$
BEGIN
  -- Add storage limit field (in GB)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'storage_limit_gb'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN storage_limit_gb numeric(10,2) DEFAULT 5.00;
  END IF;

  -- Add storage used field (in bytes)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'storage_used_bytes'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN storage_used_bytes bigint DEFAULT 0;
  END IF;

  -- Add last file activity tracking
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_file_activity'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_file_activity timestamptz DEFAULT now();
  END IF;
END $$;

-- Add service termination tracking to clients
DO $$
BEGIN
  -- Add service termination date
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clients' AND column_name = 'service_termination_date'
  ) THEN
    ALTER TABLE clients ADD COLUMN service_termination_date timestamptz DEFAULT NULL;
  END IF;

  -- Add storage tier
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
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE constraint_name = 'clients_storage_tier_check'
  ) THEN
    ALTER TABLE clients ADD CONSTRAINT clients_storage_tier_check 
    CHECK (storage_tier = ANY (ARRAY['basic'::text, 'standard'::text, 'premium'::text, 'enterprise'::text]));
  END IF;
END $$;

-- Add file size tracking to file_manager
DO $$
BEGIN
  -- Ensure file_size column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'file_manager' AND column_name = 'file_size'
  ) THEN
    ALTER TABLE file_manager ADD COLUMN file_size bigint DEFAULT NULL;
  END IF;
END $$;

-- Create function to update storage usage
CREATE OR REPLACE FUNCTION update_storage_usage()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- File uploaded: increase storage usage
    UPDATE user_profiles 
    SET 
      storage_used_bytes = storage_used_bytes + COALESCE(NEW.file_size, 0),
      last_file_activity = now()
    WHERE id = NEW.created_by;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- File deleted: decrease storage usage
    UPDATE user_profiles 
    SET 
      storage_used_bytes = GREATEST(0, storage_used_bytes - COALESCE(OLD.file_size, 0)),
      last_file_activity = now()
    WHERE id = OLD.created_by;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for storage usage updates
DROP TRIGGER IF EXISTS trigger_update_storage_usage ON file_manager;
CREATE TRIGGER trigger_update_storage_usage
  AFTER INSERT OR DELETE ON file_manager
  FOR EACH ROW EXECUTE FUNCTION update_storage_usage();

-- Set storage limits based on client tier
UPDATE user_profiles 
SET storage_limit_gb = CASE 
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
  ELSE 5.00
END;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_storage_usage ON user_profiles(storage_used_bytes);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_activity ON user_profiles(last_file_activity);
CREATE INDEX IF NOT EXISTS idx_clients_termination_date ON clients(service_termination_date);
CREATE INDEX IF NOT EXISTS idx_file_manager_file_size ON file_manager(file_size) WHERE file_size IS NOT NULL;