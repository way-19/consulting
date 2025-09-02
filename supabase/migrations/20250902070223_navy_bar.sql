/*
  # Update existing test user profiles

  1. Updates
    - Update existing user profiles with correct roles and country assignment
    - Assign all users to Georgia (b078d0fb-86a4-48dc-ba83-5d600479e074)
    - Create client record for client user
    - Create consultant country assignment

  2. Security
    - Uses existing RLS policies
    - Updates only test accounts
*/

DO $$
DECLARE
    georgia_country_id UUID := 'b078d0fb-86a4-48dc-ba83-5d600479e074';
    admin_user_id UUID;
    consultant_user_id UUID;
    client_user_id UUID;
    client_record_id UUID;
BEGIN
    -- Get existing user IDs by email
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@consulting19.com';
    
    SELECT id INTO consultant_user_id 
    FROM auth.users 
    WHERE email = 'giorgi.meskhi@consulting19.com';
    
    SELECT id INTO client_user_id 
    FROM auth.users 
    WHERE email = 'client@consulting19.com';

    -- Update or insert admin profile
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.user_profiles (
            id, email, full_name, role, country_id, 
            is_active, preferred_language, timezone
        ) VALUES (
            admin_user_id,
            'admin@consulting19.com',
            'Admin User',
            'admin',
            georgia_country_id,
            TRUE,
            'en',
            'UTC'
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            country_id = EXCLUDED.country_id,
            is_active = EXCLUDED.is_active,
            preferred_language = EXCLUDED.preferred_language,
            timezone = EXCLUDED.timezone;
    END IF;

    -- Update or insert consultant profile
    IF consultant_user_id IS NOT NULL THEN
        INSERT INTO public.user_profiles (
            id, email, full_name, role, country_id, 
            is_active, preferred_language, timezone, company
        ) VALUES (
            consultant_user_id,
            'giorgi.meskhi@consulting19.com',
            'Giorgi Meskhi',
            'consultant',
            georgia_country_id,
            TRUE,
            'en',
            'Asia/Tbilisi'
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            country_id = EXCLUDED.country_id,
            is_active = EXCLUDED.is_active,
            preferred_language = EXCLUDED.preferred_language,
            timezone = EXCLUDED.timezone,
            company = EXCLUDED.company;
    END IF;

    -- Update or insert client profile
    IF client_user_id IS NOT NULL THEN
        INSERT INTO public.user_profiles (
            id, email, full_name, role, country_id, 
            is_active, preferred_language, timezone
        ) VALUES (
            client_user_id,
            'client@consulting19.com',
            'Test Client',
            'client',
            georgia_country_id,
            TRUE,
            'en',
            'UTC'
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            country_id = EXCLUDED.country_id,
            is_active = EXCLUDED.is_active,
            preferred_language = EXCLUDED.preferred_language,
            timezone = EXCLUDED.timezone;
    END IF;

    -- Create or update client record (for client user)
    IF client_user_id IS NOT NULL AND consultant_user_id IS NOT NULL THEN
        INSERT INTO public.clients (
            profile_id,
            assigned_consultant_id,
            status,
            priority,
            notes
        ) VALUES (
            client_user_id,
            consultant_user_id,
            'active',
            'medium',
            'Test client assigned to Georgian consultant'
        ) ON CONFLICT (profile_id) DO UPDATE SET
            assigned_consultant_id = EXCLUDED.assigned_consultant_id,
            status = EXCLUDED.status,
            priority = EXCLUDED.priority,
            notes = EXCLUDED.notes;
    END IF;

    -- Create consultant country assignment
    IF consultant_user_id IS NOT NULL THEN
        INSERT INTO public.consultant_country_assignments (
            consultant_id,
            country_id,
            is_active
        ) VALUES (
            consultant_user_id,
            georgia_country_id,
            TRUE
        ) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
            is_active = EXCLUDED.is_active;
    END IF;

    RAISE NOTICE 'Test profiles updated successfully!';
    RAISE NOTICE 'Admin ID: %', admin_user_id;
    RAISE NOTICE 'Consultant ID: %', consultant_user_id;
    RAISE NOTICE 'Client ID: %', client_user_id;
    RAISE NOTICE 'Georgia Country ID: %', georgia_country_id;

END $$;