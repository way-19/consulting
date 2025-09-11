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
    rowsecurity,
    tableowner
FROM pg_tables 
WHERE tablename = 'notifications';

-- Notifications tablosuna kimler erişebilir
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'notifications' 
AND table_schema = 'public'
ORDER BY grantee, privilege_type;