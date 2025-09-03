/*
  # Update test client profile with full name

  1. Updates
    - Set full_name for test client account
    - Ensure proper display name is available

  2. Purpose
    - Fix client dashboard to show actual name instead of "Client"
    - Ensure Georgian consultant integration is properly set up
*/

-- Update the test client profile with a proper full name
UPDATE user_profiles 
SET 
  full_name = 'María González',
  display_name = 'María',
  updated_at = now()
WHERE email = 'client@consulting19.com';

-- Ensure the client record exists and is assigned to Georgian consultant
DO $$
DECLARE
  client_profile_id uuid;
  georgian_consultant_id uuid;
  client_record_id uuid;
BEGIN
  -- Get the client profile ID
  SELECT id INTO client_profile_id 
  FROM user_profiles 
  WHERE email = 'client@consulting19.com';
  
  -- Get the Georgian consultant ID
  SELECT id INTO georgian_consultant_id 
  FROM user_profiles 
  WHERE email = 'giorgi.meskhi@consulting19.com';
  
  IF client_profile_id IS NOT NULL AND georgian_consultant_id IS NOT NULL THEN
    -- Check if client record exists
    SELECT id INTO client_record_id 
    FROM clients 
    WHERE profile_id = client_profile_id;
    
    IF client_record_id IS NULL THEN
      -- Create client record
      INSERT INTO clients (
        profile_id,
        assigned_consultant_id,
        company_name,
        status,
        priority,
        notes
      ) VALUES (
        client_profile_id,
        georgian_consultant_id,
        'González Consulting SL',
        'active',
        'medium',
        'Test client assigned to Georgian consultant for demo purposes'
      );
    ELSE
      -- Update existing client record to ensure Georgian consultant assignment
      UPDATE clients 
      SET 
        assigned_consultant_id = georgian_consultant_id,
        company_name = 'González Consulting SL',
        updated_at = now()
      WHERE id = client_record_id;
    END IF;
  END IF;
END $$;