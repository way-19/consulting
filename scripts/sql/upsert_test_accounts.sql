-- Link Maria as a client
WITH au AS (SELECT id FROM auth.users WHERE email = 'maria@test.com')
INSERT INTO public.users (email, role, auth_user_id, status)
VALUES ('maria@test.com', 'client', (SELECT id FROM au), true)
ON CONFLICT (email) DO UPDATE
SET auth_user_id = EXCLUDED.auth_user_id,
    role = 'client',
    status = true;

-- Link Georgia consultant (already working, kept for completeness)
WITH cu AS (SELECT id FROM auth.users WHERE email = 'georgia_consultant@consulting19.com')
INSERT INTO public.users (email, role, auth_user_id, status)
VALUES ('georgia_consultant@consulting19.com', 'consultant', (SELECT id FROM cu), true)
ON CONFLICT (email) DO UPDATE
SET auth_user_id = EXCLUDED.auth_user_id,
    role = 'consultant',
    status = true;
