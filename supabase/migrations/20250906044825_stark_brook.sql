/*
  # Add Storage Tier to Clients Table

  1. Schema Updates
    - Add storage_tier column to clients table
    - Add constraint for valid tier values
    - Set default tier to 'basic'
    
  2. Storage Tiers
    - basic: 5GB (free)
    - standard: 20GB ($19/month) 
    - premium: 50GB ($49/month)
    - enterprise: 100GB ($99/month)
*/

-- Add storage_tier column to clients table
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'clients' AND column_name = 'storage_tier'
  ) THEN
    ALTER TABLE clients ADD COLUMN storage_tier text DEFAULT 'basic';
  END IF;
END $$;

-- Add check constraint for valid storage tiers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'clients_storage_tier_check'
  ) THEN
    ALTER TABLE clients 
    ADD CONSTRAINT clients_storage_tier_check 
    CHECK (storage_tier IN ('basic', 'standard', 'premium', 'enterprise'));
  END IF;
END $$;