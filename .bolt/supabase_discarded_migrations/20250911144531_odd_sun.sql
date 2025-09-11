-- Notifications tablosundaki RLS politikalarını kontrol et
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

-- RLS aktif mi kontrol et
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'notifications';

-- Tablo sahipliğini kontrol et
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename = 'notifications';

-- Service role'ün tam yetkilerini kontrol et
SELECT 
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin,
    rolreplication,
    rolbypassrls,
    rolconnlimit
FROM pg_roles 
WHERE rolname = 'service_role';