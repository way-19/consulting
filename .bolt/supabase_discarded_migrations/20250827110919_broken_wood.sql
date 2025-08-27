/*
  # Add sample data for testing integration

  1. Sample Data
    - Countries with consultants
    - Sample projects
    - Sample services
    - Test user profiles

  2. Test Scenarios
    - Client with active projects
    - Consultant with clients
    - Admin oversight
*/

-- Insert sample countries
INSERT INTO countries (name, code, flag_emoji, description, tax_rate, business_advantages, featured, is_active) VALUES
('United Arab Emirates', 'AE', '🇦🇪', 'Premier destination for international business with zero corporate tax in free zones', 0, ARRAY['0% corporate tax in free zones', '100% foreign ownership', 'No personal income tax', 'Strategic location'], true, true),
('Estonia', 'EE', '🇪🇪', 'Digital-first country with 100% online e-Residency program', 20, ARRAY['100% online e-Residency', 'EU market access', 'Digital innovation support', 'Low bureaucracy'], true, true),
('Georgia', 'GE', '🇬🇪', 'Business-friendly country with very low tax rates', 1, ARRAY['Small Business Status - 1% tax', 'Simple incorporation', 'Strategic location', 'Fast setup'], false, true)
ON CONFLICT (code) DO NOTHING;

-- Get country IDs for reference
DO $$
DECLARE
    uae_id uuid;
    estonia_id uuid;
    georgia_id uuid;
    consultant_id uuid;
    client_id uuid;
BEGIN
    -- Get country IDs
    SELECT id INTO uae_id FROM countries WHERE code = 'AE';
    SELECT id INTO estonia_id FROM countries WHERE code = 'EE';
    SELECT id INTO georgia_id FROM countries WHERE code = 'GE';
    
    -- Create sample consultant profile (if not exists)
    INSERT INTO user_profiles (id, email, full_name, role, country, bio, is_active)
    VALUES (
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        'giorgi.meskhi@consulting19.com',
        'Giorgi Meskhi',
        'consultant',
        'Georgia',
        'Georgia business formation specialist with 8+ years experience helping international businesses establish operations.',
        true
    ) ON CONFLICT (id) DO NOTHING;
    
    consultant_id := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
    
    -- Create sample client profile (if not exists)
    INSERT INTO user_profiles (id, email, full_name, role, country, company, is_active)
    VALUES (
        'b2c3d4e5-f6g7-8901-bcde-f23456789012',
        'client@consulting19.com',
        'Sarah Johnson',
        'client',
        'United States',
        'TechStart Inc.',
        true
    ) ON CONFLICT (id) DO NOTHING;
    
    client_id := 'b2c3d4e5-f6g7-8901-bcde-f23456789012';
    
    -- Update Georgia country with consultant
    UPDATE countries SET consultant_id = consultant_id WHERE code = 'GE';
    
    -- Insert sample services
    INSERT INTO services (consultant_id, country_id, title, description, price, is_public, is_active) VALUES
    (consultant_id, georgia_id, 'Georgia Company Formation', 'Complete company registration in Georgia with Small Business Status for 1% tax rate', 1500.00, true, true),
    (consultant_id, georgia_id, 'Georgia Banking Setup', 'Assistance with opening corporate bank accounts in Georgian banks', 800.00, true, true),
    (consultant_id, georgia_id, 'Tax Optimization Consultation', 'Strategic tax planning consultation for Georgia operations', 500.00, true, true)
    ON CONFLICT DO NOTHING;
    
    -- Insert sample project
    INSERT INTO projects (client_id, consultant_id, country_id, title, description, status, progress, total_amount, due_date) VALUES
    (client_id, consultant_id, georgia_id, 'TechStart Inc. Georgia Expansion', 'Complete business setup in Georgia including company formation, banking, and tax optimization', 'in_progress', 60, 2800.00, '2025-03-15')
    ON CONFLICT DO NOTHING;
    
END $$;