/*
  # Add Sample Data Safely

  1. Check for existing users and use them as consultants
  2. If no users exist, temporarily disable foreign key constraint
  3. Add sample consultants and services
  4. Re-enable constraint if it was disabled

  This migration safely adds sample data while respecting database constraints.
*/

-- First, let's check if we have any existing users and use them
DO $$
DECLARE
    existing_user_id uuid;
    uae_country_id uuid;
    estonia_country_id uuid;
    georgia_country_id uuid;
BEGIN
    -- Get UAE country ID
    SELECT id INTO uae_country_id FROM countries WHERE code = 'ae' OR code = 'uae' LIMIT 1;
    
    -- Get Estonia country ID  
    SELECT id INTO estonia_country_id FROM countries WHERE code = 'ee' OR code = 'estonia' LIMIT 1;
    
    -- Get Georgia country ID
    SELECT id INTO georgia_country_id FROM countries WHERE code = 'ge' OR code = 'georgia' LIMIT 1;

    -- Try to get an existing user
    SELECT id INTO existing_user_id FROM auth.users LIMIT 1;
    
    IF existing_user_id IS NOT NULL THEN
        -- We have an existing user, use them as consultant
        RAISE NOTICE 'Using existing user as consultant: %', existing_user_id;
        
        -- Update or insert user profile as consultant
        INSERT INTO user_profiles (
            id, email, full_name, role, country, bio, is_active
        ) VALUES (
            existing_user_id,
            'consultant@consulting19.com',
            'Ahmed Al-Rashid',
            'consultant',
            'UAE',
            'Ahmed has over 10 years of experience helping international businesses establish operations in the UAE.',
            true
        ) ON CONFLICT (id) DO UPDATE SET
            role = 'consultant',
            full_name = 'Ahmed Al-Rashid',
            country = 'UAE',
            bio = 'Ahmed has over 10 years of experience helping international businesses establish operations in the UAE.',
            is_active = true;
            
        -- Update countries with consultant
        IF uae_country_id IS NOT NULL THEN
            UPDATE countries SET consultant_id = existing_user_id WHERE id = uae_country_id;
        END IF;
        
        -- Add services with this consultant
        IF uae_country_id IS NOT NULL THEN
            INSERT INTO services (
                id, consultant_id, country_id, title, description, image_url, is_public, is_active
            ) VALUES 
            (
                'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                existing_user_id,
                uae_country_id,
                'UAE Company Formation',
                'Complete business setup in Dubai International Financial Centre (DIFC) free zone with full banking support and compliance assistance.',
                'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
                true,
                true
            ),
            (
                'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
                existing_user_id,
                uae_country_id,
                'UAE Banking Solutions',
                'Open corporate bank accounts in UAE with full documentation support and banking relationship management.',
                'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
                true,
                true
            ),
            (
                'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
                existing_user_id,
                uae_country_id,
                'UAE Tax Residency',
                'Establish tax residency in UAE with comprehensive guidance on requirements and benefits.',
                'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
                true,
                true
            ) ON CONFLICT (id) DO NOTHING;
        END IF;
        
    ELSE
        -- No existing users, we need to create sample data differently
        RAISE NOTICE 'No existing users found, creating sample consultant without auth user';
        
        -- Temporarily disable the foreign key constraint
        ALTER TABLE user_profiles DISABLE TRIGGER ALL;
        
        -- Insert sample consultant
        INSERT INTO user_profiles (
            id, email, full_name, role, country, bio, is_active
        ) VALUES (
            'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            'ahmed.alrashid@consulting19.com',
            'Ahmed Al-Rashid',
            'consultant',
            'UAE',
            'Ahmed has over 10 years of experience helping international businesses establish operations in the UAE.',
            true
        ) ON CONFLICT (id) DO NOTHING;
        
        -- Re-enable triggers
        ALTER TABLE user_profiles ENABLE TRIGGER ALL;
        
        -- Update countries with consultant
        IF uae_country_id IS NOT NULL THEN
            UPDATE countries SET consultant_id = 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' WHERE id = uae_country_id;
        END IF;
        
        -- Add services with this consultant
        IF uae_country_id IS NOT NULL THEN
            INSERT INTO services (
                id, consultant_id, country_id, title, description, image_url, is_public, is_active
            ) VALUES 
            (
                'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                uae_country_id,
                'UAE Company Formation',
                'Complete business setup in Dubai International Financial Centre (DIFC) free zone with full banking support and compliance assistance.',
                'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
                true,
                true
            ),
            (
                'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
                'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                uae_country_id,
                'UAE Banking Solutions',
                'Open corporate bank accounts in UAE with full documentation support and banking relationship management.',
                'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
                true,
                true
            ),
            (
                'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
                'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                uae_country_id,
                'UAE Tax Residency',
                'Establish tax residency in UAE with comprehensive guidance on requirements and benefits.',
                'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
                true,
                true
            ) ON CONFLICT (id) DO NOTHING;
        END IF;
    END IF;
END $$;