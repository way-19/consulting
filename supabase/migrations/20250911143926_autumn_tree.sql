-- Notifications tablosundaki tüm RLS politikalarını listele
SELECT 
    schemaname,
    tablename,
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
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'notifications';

-- Service role'ün hangi rollere sahip olduğunu kontrol et
SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin,
    rolreplication,
    rolbypassrls
FROM pg_roles 
WHERE rolname IN ('service_role', 'authenticated', 'anon');

-- Notifications tablosunun sahibini kontrol et
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename = 'notifications';

-- Mevcut kullanıcının rolünü kontrol et
SELECT current_user, session_user, current_role;