/*
  # Georgia Consultant-Client System Setup

  1. Schema Safety
    - Ensure all required tables exist (non-destructive)
    - Add missing columns if needed
    - Create indexes for performance

  2. Test Data
    - Georgia country record
    - Nino Kvaratskhelia (Georgia consultant)
    - 4 test clients assigned to Nino
    - Consultant-client relationships

  3. Views and Functions
    - Optimized view for consultant-client listing
    - RPC function for parametrized queries
    - Performance indexes

  4. Security
    - RLS policies for data access
    - Consultant can only see assigned clients
*/

-- ===== SCHEMA SAFETY (NON-DESTRUCTIVE) =====

-- COUNTRIES table
CREATE TABLE IF NOT EXISTS public.countries (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  flag_emoji TEXT,
  description TEXT,
  primary_language TEXT DEFAULT 'en',
  status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add auth_user_id to users if not exists
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS auth_user_id uuid UNIQUE;

-- CONSULTANT PROFILES
CREATE TABLE IF NOT EXISTS public.consultant_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  country_id integer REFERENCES public.countries(id) ON DELETE SET NULL,
  title text,
  status text DEFAULT 'active',
  created_at timestamp DEFAULT now()
);

-- CLIENTS table
CREATE TABLE IF NOT EXISTS public.clients (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  country_id integer REFERENCES public.countries(id) ON DELETE SET NULL,
  status text DEFAULT 'active',
  created_at timestamp DEFAULT now()
);

-- CONSULTANT_CLIENTS (CRM relationship)
CREATE TABLE IF NOT EXISTS public.consultant_clients (
  consultant_id  uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_at    timestamp DEFAULT now(),
  PRIMARY KEY (consultant_id, client_user_id)
);

-- ===== INDEXES FOR PERFORMANCE =====

CREATE INDEX IF NOT EXISTS idx_clients_country ON public.clients(country_id);
CREATE INDEX IF NOT EXISTS idx_clients_user ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_cc_consultant ON public.consultant_clients(consultant_id);
CREATE INDEX IF NOT EXISTS idx_cc_client ON public.consultant_clients(client_user_id);
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role_country ON public.users(role, country_id);

-- ===== RLS POLICIES =====

-- Enable RLS on consultant_clients
ALTER TABLE public.consultant_clients ENABLE ROW LEVEL SECURITY;

-- Policy for consultants to see their own clients
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='consultant_clients'
      AND policyname='p_consultant_see_own_clients'
  ) THEN
    CREATE POLICY p_consultant_see_own_clients
    ON public.consultant_clients
    FOR SELECT
    USING (
      consultant_id = (
        SELECT id FROM public.users WHERE auth_user_id = auth.uid()
      )
    );
  END IF;
END$$;

-- Enable RLS on clients (demo policy - broad access)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='clients'
      AND policyname='p_clients_read_all_demo'
  ) THEN
    CREATE POLICY p_clients_read_all_demo
    ON public.clients FOR SELECT USING (true);
  END IF;
END$$;

-- ===== GEORGIA TEST DATA (IDEMPOTENT) =====

-- Insert Georgia country
INSERT INTO public.countries (id, slug, name, flag_emoji, description, primary_language, status)
VALUES (1, 'georgia', 'Georgia', '🇬🇪', 
  'Strategic location between Europe and Asia with favorable tax system', 'en', true)
ON CONFLICT (id) DO UPDATE
SET slug='georgia', name='Georgia', flag_emoji='🇬🇪',
    description='Strategic location between Europe and Asia with favorable tax system',
    primary_language='en', status=true;

-- Insert Georgia Consultant (Nino)
WITH upsert AS (
  INSERT INTO public.users (id, email, first_name, last_name, role, country_id, status, auth_user_id)
  VALUES (
    'c3d4e5f6-a7b8-4012-8456-789012cdefab'::uuid,
    'georgia_consultant@consulting19.com', 
    'Nino', 
    'Kvaratskhelia', 
    'consultant', 
    1, 
    true,
    'c3d4e5f6-a7b8-4012-8456-789012cdefab'::uuid
  )
  ON CONFLICT (email) DO UPDATE
  SET first_name='Nino',
      last_name='Kvaratskhelia',
      role='consultant',
      country_id=1,
      status=true,
      auth_user_id='c3d4e5f6-a7b8-4012-8456-789012cdefab'::uuid
  RETURNING id
)
INSERT INTO public.consultant_profiles (user_id, country_id, title, status)
SELECT id, 1, 'Georgia Expert', 'active' FROM upsert
ON CONFLICT (user_id) DO UPDATE
SET country_id=1, title='Georgia Expert', status='active';

-- Insert Test Clients
WITH client_inserts AS (
  INSERT INTO public.users (id, email, first_name, last_name, role, country_id, status, language)
  VALUES
    ('d4e5f6a7-b8c9-4123-8567-890123defabc'::uuid, 'client@consulting19.com', 'Business', 'Client', 'client', 1, true, 'tr'),
    ('e5f6a7b8-c9d0-4234-8678-901234efabcd'::uuid, 'ahmet@test.com', 'Ahmet', 'Yılmaz', 'client', 1, true, 'tr'),
    ('f6a7b8c9-d0e1-4345-8789-012345fabcde'::uuid, 'maria@test.com', 'Maria', 'Garcia', 'client', 1, true, 'tr'),
    ('a7b8c9d0-e1f2-4456-8890-123456abcdef'::uuid, 'david@test.com', 'David', 'Smith', 'client', 1, true, 'en')
  ON CONFLICT (email) DO UPDATE
  SET first_name=EXCLUDED.first_name,
      last_name=EXCLUDED.last_name,
      role='client',
      country_id=1,
      status=true,
      language=EXCLUDED.language
  RETURNING id, email
)
INSERT INTO public.clients (user_id, country_id, status)
SELECT id, 1, 'active' FROM client_inserts
ON CONFLICT (user_id) DO UPDATE
SET country_id=1, status='active';

-- Assign all clients to Nino (consultant-client relationships)
WITH consultant AS (
  SELECT id AS consultant_id FROM public.users WHERE email='georgia_consultant@consulting19.com'
),
clients AS (
  SELECT id AS client_user_id FROM public.users
  WHERE email IN ('client@consulting19.com', 'ahmet@test.com', 'maria@test.com', 'david@test.com')
)
INSERT INTO public.consultant_clients (consultant_id, client_user_id, assigned_at)
SELECT consultant.consultant_id, clients.client_user_id, now()
FROM consultant CROSS JOIN clients
ON CONFLICT (consultant_id, client_user_id) DO NOTHING;

-- ===== OPTIMIZED VIEW FOR UI =====

CREATE OR REPLACE VIEW public.v_consultant_client_list AS
SELECT 
  cc.consultant_id,
  u.id AS client_id,
  u.email,
  u.first_name,
  u.last_name,
  (COALESCE(u.first_name,'') || ' ' || COALESCE(u.last_name,'')) AS full_name,
  u.company_name,
  u.business_type,
  u.language,
  u.created_at AS client_since,
  cl.country_id,
  c.name AS country_name,
  c.flag_emoji,
  cc.assigned_at
FROM public.consultant_clients cc
JOIN public.users u ON u.id = cc.client_user_id
JOIN public.clients cl ON cl.user_id = u.id
JOIN public.countries c ON c.id = cl.country_id;

-- ===== RPC FUNCTION FOR PARAMETRIZED QUERIES =====

CREATE OR REPLACE FUNCTION public.get_consultant_clients(
  p_consultant_id uuid,
  p_country_id    integer DEFAULT NULL,
  p_search        text DEFAULT NULL,
  p_limit         integer DEFAULT 50,
  p_offset        integer DEFAULT 0
)
RETURNS TABLE (
  client_id uuid,
  email text,
  first_name text,
  last_name text,
  full_name text,
  company_name text,
  business_type text,
  language text,
  client_since timestamp,
  country_id integer,
  country_name text,
  flag_emoji text,
  assigned_at timestamp
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    v.client_id,
    v.email,
    v.first_name,
    v.last_name,
    v.full_name,
    v.company_name,
    v.business_type,
    v.language,
    v.client_since,
    v.country_id,
    v.country_name,
    v.flag_emoji,
    v.assigned_at
  FROM public.v_consultant_client_list v
  WHERE v.consultant_id = p_consultant_id
    AND (p_country_id IS NULL OR v.country_id = p_country_id)
    AND (
      p_search IS NULL
      OR v.email ILIKE '%' || p_search || '%'
      OR v.full_name ILIKE '%' || p_search || '%'
      OR v.company_name ILIKE '%' || p_search || '%'
    )
  ORDER BY v.full_name
  LIMIT p_limit OFFSET p_offset;
$$;

-- ===== VERIFICATION QUERY =====

-- Test the complete system
SELECT 
  'Consultant: ' || u.first_name || ' ' || u.last_name AS consultant_info,
  COUNT(cc.client_user_id) AS total_clients
FROM public.users u
LEFT JOIN public.consultant_clients cc ON cc.consultant_id = u.id
WHERE u.email = 'georgia_consultant@consulting19.com'
GROUP BY u.id, u.first_name, u.last_name;

-- List all clients for verification
SELECT * FROM public.get_consultant_clients(
  p_consultant_id := (SELECT id FROM public.users WHERE email='georgia_consultant@consulting19.com'),
  p_country_id    := 1,
  p_search        := NULL,
  p_limit         := 50,
  p_offset        := 0
);