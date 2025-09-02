/*
  # Create Test Users and Profiles

  1. New Auth Users
    - `admin@consulting19.com` (Admin role)
    - `giorgi.meskhi@consulting19.com` (Consultant role)  
    - `client@consulting19.com` (Client role)

  2. User Profiles
    - All users assigned to Georgia country
    - Proper roles and metadata set
    - Active status enabled

  3. Client Assignment
    - Client assigned to Georgian consultant
    - Proper relationship established
*/

DO $$
DECLARE
    georgia_country_id uuid := 'b078d0fb-86a4-48dc-ba83-5d600479e074';
    admin_user_id uuid := '11111111-1111-1111-1111-111111111111';
    consultant_user_id uuid := '22222222-2222-2222-2222-222222222222';
    client_user_id uuid := '33333333-3333-3333-3333-333333333333';
    client_record_id uuid;
BEGIN
    -- Create admin user in auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud,
        confirmation_token,
        email_change_token_new,
        recovery_token
    ) VALUES (
        admin_user_id,
        '00000000-0000-0000-0000-000000000000',
        'admin@consulting19.com',
        crypt('Admin123!', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Admin User"}',
        FALSE,
        'authenticated',
        'authenticated',
        '',
        '',
        ''
    ) ON CONFLICT (id) DO NOTHING;

    -- Create consultant user in auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud,
        confirmation_token,
        email_change_token_new,
        recovery_token
    ) VALUES (
        consultant_user_id,
        '00000000-0000-0000-0000-000000000000',
        'giorgi.meskhi@consulting19.com',
        crypt('Consultant123!', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Giorgi Meskhi"}',
        FALSE,
        'authenticated',
        'authenticated',
        '',
        '',
        ''
    ) ON CONFLICT (id) DO NOTHING;

    -- Create client user in auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        role,
        aud,
        confirmation_token,
        email_change_token_new,
        recovery_token
    ) VALUES (
        client_user_id,
        '00000000-0000-0000-0000-000000000000',
        'client@consulting19.com',
        crypt('Client123!', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "Test Client"}',
        FALSE,
        'authenticated',
        'authenticated',
        '',
        '',
        ''
    ) ON CONFLICT (id) DO NOTHING;

    -- Create admin profile
    INSERT INTO public.user_profiles (
        id,
        email,
        full_name,
        role,
        country_id,
        is_active,
        preferred_language,
        timezone,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'admin@consulting19.com',
        'Admin User',
        'admin',
        georgia_country_id,
        TRUE,
        'en',
        'UTC',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        country_id = EXCLUDED.country_id,
        is_active = EXCLUDED.is_active,
        preferred_language = EXCLUDED.preferred_language,
        timezone = EXCLUDED.timezone,
        updated_at = NOW();

    -- Create consultant profile
    INSERT INTO public.user_profiles (
        id,
        email,
        full_name,
        role,
        country_id,
        company,
        phone,
        is_active,
        preferred_language,
        timezone,
        created_at,
        updated_at
    ) VALUES (
        consultant_user_id,
        'giorgi.meskhi@consulting19.com',
        'Giorgi Meskhi',
        'consultant',
        georgia_country_id,
        'Meskhi & Associates',
        '+995 32 123 4567',
        TRUE,
        'en',
        'UTC',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        country_id = EXCLUDED.country_id,
        company = EXCLUDED.company,
        phone = EXCLUDED.phone,
        is_active = EXCLUDED.is_active,
        preferred_language = EXCLUDED.preferred_language,
        timezone = EXCLUDED.timezone,
        updated_at = NOW();

    -- Create client profile
    INSERT INTO public.user_profiles (
        id,
        email,
        full_name,
        role,
        country_id,
        company,
        is_active,
        preferred_language,
        timezone,
        created_at,
        updated_at
    ) VALUES (
        client_user_id,
        'client@consulting19.com',
        'Test Client',
        'client',
        georgia_country_id,
        'Test Company Ltd',
        TRUE,
        'en',
        'UTC',
        NOW(),
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        country_id = EXCLUDED.country_id,
        company = EXCLUDED.company,
        is_active = EXCLUDED.is_active,
        preferred_language = EXCLUDED.preferred_language,
        timezone = EXCLUDED.timezone,
        updated_at = NOW();

    -- Create client record and assign to consultant
    INSERT INTO public.clients (
        id,
        profile_id,
        assigned_consultant_id,
        company_name,
        status,
        priority,
        notes,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        client_user_id,
        consultant_user_id,
        'Test Company Ltd',
        'active',
        'medium',
        'Test client for system integration testing',
        NOW(),
        NOW()
    ) ON CONFLICT (profile_id) DO UPDATE SET
        assigned_consultant_id = EXCLUDED.assigned_consultant_id,
        company_name = EXCLUDED.company_name,
        status = EXCLUDED.status,
        priority = EXCLUDED.priority,
        notes = EXCLUDED.notes,
        updated_at = NOW()
    RETURNING id INTO client_record_id;

    -- Assign consultant to Georgia
    INSERT INTO public.consultant_country_assignments (
        id,
        consultant_id,
        country_id,
        is_active,
        created_at
    ) VALUES (
        gen_random_uuid(),
        consultant_user_id,
        georgia_country_id,
        TRUE,
        NOW()
    ) ON CONFLICT (consultant_id, country_id) DO UPDATE SET
        is_active = EXCLUDED.is_active,
        created_at = EXCLUDED.created_at;

    RAISE NOTICE 'Test users and profiles created successfully!';
    RAISE NOTICE 'Admin ID: %', admin_user_id;
    RAISE NOTICE 'Consultant ID: %', consultant_user_id;
    RAISE NOTICE 'Client ID: %', client_user_id;
    RAISE NOTICE 'All users assigned to Georgia: %', georgia_country_id;

END $$;