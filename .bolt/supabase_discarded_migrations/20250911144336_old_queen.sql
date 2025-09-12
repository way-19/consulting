-- Notifications tablosundaki tüm RLS politikalarını detaylı göster
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

-- RLS durumunu kontrol et
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    tableowner
FROM pg_tables 
WHERE tablename = 'notifications';

-- Notifications tablosunun yapısını kontrol et
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;