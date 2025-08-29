```sql
-- Insert sample data into the 'services' table
-- Ensure these country_ids match actual UUIDs in your 'countries' table
-- You might need to adjust these UUIDs based on your actual 'countries' table data
-- For demonstration, using placeholder UUIDs that are valid format.

-- Placeholder UUIDs for countries (replace with actual UUIDs from your 'countries' table if available)
-- Example: SELECT id, name FROM countries;
-- UAE: '00000000-0000-4000-8000-000000000001' (replace with actual UAE country ID)
-- Estonia: '00000000-0000-4000-8000-000000000002' (replace with actual Estonia country ID)
-- Georgia: '00000000-0000-4000-8000-000000000003' (replace with actual Georgia country ID)

INSERT INTO public.services (id, consultant_id, country_id, title, description, price, is_recurring, billing_period, is_public, is_active, image_url)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, '00000000-0000-4000-8000-000000000001', 'UAE Company Formation Basic', 'Comprehensive package for setting up a free zone company in UAE.', 2500.00, FALSE, NULL, TRUE, TRUE, 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', NULL, '00000000-0000-4000-8000-000000000001', 'UAE Bank Account Opening', 'Assistance with opening a corporate bank account in UAE.', 800.00, FALSE, NULL, TRUE, TRUE, 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', NULL, '00000000-0000-4000-8000-000000000002', 'Estonia e-Residency Setup', 'Guide through the e-Residency application and company registration in Estonia.', 1200.00, FALSE, NULL, TRUE, TRUE, 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800'),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', NULL, '00000000-0000-4000-8000-000000000003', 'Georgia Small Business Registration', 'Register your business in Georgia with 1% tax status.', 500.00, FALSE, NULL, TRUE, TRUE, 'https://images.pexels.com/photos/5137987/pexels-photo-5137987.jpeg?auto=compress&cs=tinysrgb&w=800');
```