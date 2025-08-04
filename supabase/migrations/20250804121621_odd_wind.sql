```sql
-- add_email_verified_to_users.sql

ALTER TABLE public.users
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

-- Mevcut admin ve danışman hesaplarını otomatik olarak doğrulanmış olarak işaretle
UPDATE public.users
SET email_verified = TRUE
WHERE role IN ('admin', 'consultant');

-- Mevcut test client hesaplarını da doğrulanmış olarak işaretleyebiliriz (isteğe bağlı)
-- Eğer belirli test client e-postaları varsa, onları da buraya ekleyebilirsiniz.
-- Örneğin:
-- UPDATE public.users
-- SET email_verified = TRUE
-- WHERE email IN ('client@consulting19.com', 'georgia_client@consulting19.com');
```