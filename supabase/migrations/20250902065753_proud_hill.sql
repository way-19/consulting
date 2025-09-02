```sql
-- Bu SQL dosyası, public.user_profiles ve public.clients tablolarına veri ekler.
-- ÖNEMLİ: Bu komutlar Supabase'in kimlik doğrulama (auth.users) sisteminde kullanıcı oluşturmaz.
-- Bu kullanıcıların giriş yapabilmesi için, önce Supabase Auth üzerinden kaydolmaları gerekir.

-- Gürcistan Ülke ID'si
DO $$
DECLARE
    georgia_country_id UUID := 'b078d0fb-86a4-48dc-ba83-5d600479e074';
    admin_profile_id UUID;
    consultant_profile_id UUID;
    client_profile_id UUID;
BEGIN
    -- Admin profilini oluştur
    INSERT INTO public.user_profiles (id, email, full_name, role, country_id, is_active, preferred_language, timezone)
    VALUES (gen_random_uuid(), 'admin@consulting19.com', 'Admin User', 'admin', georgia_country_id, TRUE, 'en', 'UTC')
    ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        country_id = EXCLUDED.country_id,
        is_active = EXCLUDED.is_active,
        preferred_language = EXCLUDED.preferred_language,
        timezone = EXCLUDED.timezone
    RETURNING id INTO admin_profile_id;

    -- Danışman profilini oluştur
    INSERT INTO public.user_profiles (id, email, full_name, role, country_id, is_active, preferred_language, timezone)
    VALUES (gen_random_uuid(), 'giorgi.meskhi@consulting19.com', 'Giorgi Meskhi', 'consultant', georgia_country_id, TRUE, 'en', 'UTC')
    ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        country_id = EXCLUDED.country_id,
        is_active = EXCLUDED.is_active,
        preferred_language = EXCLUDED.preferred_language,
        timezone = EXCLUDED.timezone
    RETURNING id INTO consultant_profile_id;

    -- Müşteri profilini oluştur
    INSERT INTO public.user_profiles (id, email, full_name, role, country_id, is_active, preferred_language, timezone)
    VALUES (gen_random_uuid(), 'client@consulting19.com', 'Client User', 'client', georgia_country_id, TRUE, 'en', 'UTC')
    ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        country_id = EXCLUDED.country_id,
        is_active = EXCLUDED.is_active,
        preferred_language = EXCLUDED.preferred_language,
        timezone = EXCLUDED.timezone
    RETURNING id INTO client_profile_id;

    -- Müşteri için clients tablosuna kayıt ekle (eğer yoksa)
    INSERT INTO public.clients (id, profile_id, assigned_consultant_id, status, priority)
    VALUES (gen_random_uuid(), client_profile_id, consultant_profile_id, 'active', 'medium')
    ON CONFLICT (profile_id) DO UPDATE SET
        assigned_consultant_id = EXCLUDED.assigned_consultant_id,
        status = EXCLUDED.status,
        priority = EXCLUDED.priority;

END $$;
```