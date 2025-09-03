/*
  # Minimal Database Cleanup
  
  This script only drops tables and types that actually exist.
  Run this first to see what exists, then clean accordingly.
*/

-- Drop tables only if they exist (based on current schema info)
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS countries CASCADE;

-- Drop custom types only if they exist
DO $$ 
BEGIN
    -- Check and drop user_role enum if it exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        DROP TYPE user_role CASCADE;
    END IF;
    
    -- Check and drop project_status enum if it exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        DROP TYPE project_status CASCADE;
    END IF;
    
    -- Check and drop document_type enum if it exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'document_type') THEN
        DROP TYPE document_type CASCADE;
    END IF;
    
    -- Check and drop transaction_status enum if it exists
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_status') THEN
        DROP TYPE transaction_status CASCADE;
    END IF;
END $$;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;