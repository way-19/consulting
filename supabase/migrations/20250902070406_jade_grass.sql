/*
  # Update Test User Profiles for Consulting19

  1. Profile Updates
    - Update existing user profiles with proper roles and country assignment
    - Admin: System administrator
    - Consultant: Giorgi Meskhi (Georgia specialist)
    - Client: Test client assigned to consultant

  2. Relationships
    - Create client record for test client
    - Assign client to consultant
    - Assign consultant to Georgia country

  3. Security
    - All profiles set to active status
    - Proper role assignments maintained
*/

DO $$
DECLARE
    georgia_country_id uuid;
    admin_user_id uuid := '11111111-1111-1111-1111-111111111111';
    consultant_user_id uuid := '22222222-2222-2222-2222-222222222222';
    client_user_id uuid := '33333333-3333-3333-3333-333333333333';
    client_record_id uuid;
BEGIN
    -- Get Georgia country ID
    SELECT id INTO georgia_country_id 
    FROM public.countries 
    WHERE id = 'b078d0fb-86a4-48dc-ba83-5d600479e074';

    IF georgia_country_id IS NULL THEN
        RAISE EXCEPTION 'Georgia country not found with ID: b078d0fb-86a4-48dc-ba83-5d600479e074';
    END IF;

    -- Update/Insert Admin Profile
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

    -- Update/Insert Consultant Profile
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

    -- Update/Insert Client Profile
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

    -- Create/Update Client Record
    INSERT INTO public.clients (
        profile_id,
        assigned_consultant_id,
        company_name,
        status,
        priority,
        notes
    ) VALUES (
        client_user_id,
        consultant_user_id,
        'Client Company Ltd',
        'active',
        'medium',
        'Test client for platform demonstration'
    ) ON CONFLICT (profile_id) DO UPDATE SET
        assigned_consultant_id = EXCLUDED.assigned_consultant_id,
        company_name = EXCLUDED.company_name,
        status = EXCLUDED.status,
        priority = EXCLUDED.priority,
        notes = EXCLUDED.notes;

    -- Assign Consultant to Georgia
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

    RAISE NOTICE 'Test profiles updated successfully!';
    RAISE NOTICE 'Admin ID: %', admin_user_id;
    RAISE NOTICE 'Consultant ID: %', consultant_user_id;
    RAISE NOTICE 'Client ID: %', client_user_id;
    RAISE NOTICE 'Georgia Country ID: %', georgia_country_id;

END $$;