/*
  # Update User Profiles with Existing Auth Users

  1. Updates existing user profiles using actual auth.users IDs
  2. Creates missing profiles for existing auth users
  3. Sets up client-consultant relationships
  4. Assigns consultant to Georgia

  This migration safely updates profiles without creating new auth users.
*/

DO $$
DECLARE
    georgia_country_id UUID;
    admin_user_id UUID;
    consultant_user_id UUID;
    client_user_id UUID;
    existing_client_id UUID;
BEGIN
    -- Get Georgia country ID
    SELECT id INTO georgia_country_id 
    FROM countries 
    WHERE code = 'GE' OR name = 'Georgia' 
    LIMIT 1;

    -- If Georgia doesn't exist, create it
    IF georgia_country_id IS NULL THEN
        INSERT INTO countries (name, code, flag_emoji, is_active)
        VALUES ('Georgia', 'GE', '🇬🇪', TRUE)
        RETURNING id INTO georgia_country_id;
    END IF;

    -- Get existing user IDs from auth.users
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@consulting19.com' 
    LIMIT 1;

    SELECT id INTO consultant_user_id 
    FROM auth.users 
    WHERE email = 'giorgi.meskhi@consulting19.com' 
    LIMIT 1;

    SELECT id INTO client_user_id 
    FROM auth.users 
    WHERE email = 'client@consulting19.com' 
    LIMIT 1;

    -- Update or create admin profile
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.user_profiles (
            id, email, full_name, role, country_id, 
            is_active, preferred_language, timezone, company
        ) VALUES (
            admin_user_id,
            'admin@consulting19.com',
            'Admin User',
            'admin',
            georgia_country_id,
            TRUE,
            'en',
            'UTC',
            'Consulting19'
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            country_id = EXCLUDED.country_id,
            is_active = EXCLUDED.is_active,
            preferred_language = EXCLUDED.preferred_language,
            timezone = EXCLUDED.timezone,
            company = EXCLUDED.company;
    END IF;

    -- Update or create consultant profile
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
            'Asia/Tbilisi',
            'Meskhi & Associates'
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            country_id = EXCLUDED.country_id,
            is_active = EXCLUDED.is_active,
            preferred_language = EXCLUDED.preferred_language,
            timezone = EXCLUDED.timezone,
            company = EXCLUDED.company;

        -- Assign consultant to Georgia
        INSERT INTO consultant_country_assignments (
            consultant_id, country_id, is_active
        ) VALUES (
            consultant_user_id, georgia_country_id, TRUE
        ) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
            is_active = EXCLUDED.is_active;
    END IF;

    -- Update or create client profile
    IF client_user_id IS NOT NULL THEN
        INSERT INTO public.user_profiles (
            id, email, full_name, role, country_id, 
            is_active, preferred_language, timezone, company
        ) VALUES (
            client_user_id,
            'client@consulting19.com',
            'Test Client',
            'client',
            georgia_country_id,
            TRUE,
            'en',
            'UTC',
            'Client Company Ltd'
        ) ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            role = EXCLUDED.role,
            country_id = EXCLUDED.country_id,
            is_active = EXCLUDED.is_active,
            preferred_language = EXCLUDED.preferred_language,
            timezone = EXCLUDED.timezone,
            company = EXCLUDED.company;

        -- Create or update client record
        INSERT INTO clients (
            profile_id, assigned_consultant_id, company_name, status, priority
        ) VALUES (
            client_user_id, consultant_user_id, 'Client Company Ltd', 'active', 'medium'
        ) ON CONFLICT (profile_id) DO UPDATE SET
            assigned_consultant_id = EXCLUDED.assigned_consultant_id,
            company_name = EXCLUDED.company_name,
            status = EXCLUDED.status,
            priority = EXCLUDED.priority;
    END IF;

    RAISE NOTICE 'User profiles updated successfully!';
    RAISE NOTICE 'Admin ID: %', admin_user_id;
    RAISE NOTICE 'Consultant ID: %', consultant_user_id;
    RAISE NOTICE 'Client ID: %', client_user_id;
    RAISE NOTICE 'Georgia Country ID: %', georgia_country_id;

END $$;