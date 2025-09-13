-- FIX 1: Create the missing log_privacy_action function
-- This function is expected by a database trigger

CREATE OR REPLACE FUNCTION log_privacy_action(
    user_id uuid,
    action_type text,
    resource_type text DEFAULT 'document',
    resource_id uuid DEFAULT NULL,
    details text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Simple privacy logging function
    -- You can customize this based on your privacy requirements
    
    INSERT INTO privacy_logs (
        user_id,
        action_type,
        resource_type,
        resource_id,
        details,
        created_at
    ) VALUES (
        user_id,
        action_type,
        resource_type,
        resource_id,
        details,
        NOW()
    );
    
    -- If privacy_logs table doesn't exist, just do nothing
    EXCEPTION
        WHEN undefined_table THEN
            -- Silently continue if privacy_logs table doesn't exist
            RETURN;
        WHEN OTHERS THEN
            -- Log the error but don't fail the main operation
            RAISE WARNING 'Privacy logging failed: %', SQLERRM;
            RETURN;
END;
$$;

-- FIX 2: Alternative - Disable the problematic trigger temporarily
-- Commented out by default, uncomment if you prefer to disable the trigger

-- DROP TRIGGER IF EXISTS handle_document_upload ON documents;
-- DROP TRIGGER IF EXISTS document_privacy_trigger ON documents;
-- DROP TRIGGER IF EXISTS log_privacy_action_trigger ON documents;

-- FIX 3: Create privacy_logs table if it doesn't exist
-- This table stores privacy action logs

CREATE TABLE IF NOT EXISTS privacy_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id),
    action_type text NOT NULL,
    resource_type text DEFAULT 'document',
    resource_id uuid,
    details text,
    created_at timestamp with time zone DEFAULT NOW()
);

-- Enable RLS on privacy_logs table
ALTER TABLE privacy_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for privacy_logs (users can only see their own logs)
CREATE POLICY "Users can view own privacy logs" ON privacy_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Allow system to insert privacy logs
CREATE POLICY "System can insert privacy logs" ON privacy_logs
    FOR INSERT WITH CHECK (true);

-- INSTRUCTIONS:
-- 1. Copy this SQL and run it in your Supabase SQL Editor
-- 2. Go to: https://supabase.com/dashboard/project/[your-project]/sql
-- 3. Paste the SQL and click "Run"
-- 4. Test the document upload again

-- This should resolve the "function log_privacy_action does not exist" error