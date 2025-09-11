-- Notifications tablosundaki tüm RLS politikalarını listele
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'notifications' 
ORDER BY policyname;

-- RLS'in aktif olup olmadığını kontrol et
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'notifications';

-- Service role'ün yetkilerini kontrol et
SELECT 
    rolname,
    rolsuper,
    rolbypassrls
FROM pg_roles 
WHERE rolname = 'service_role';