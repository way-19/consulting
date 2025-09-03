```sql
-- Enable RLS on the countries table if not already enabled
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- Drop existing SELECT policies for countries to prevent conflicts
-- Using IF EXISTS to avoid errors if policies don't exist
DROP POLICY IF EXISTS countries_public_access ON public.countries;
DROP POLICY IF EXISTS countries_read_access ON public.countries;
DROP POLICY IF EXISTS countries_anon_select_policy ON public.countries;
DROP POLICY IF EXISTS countries_authenticated_select_policy ON public.countries;

-- Create a new policy to allow anonymous users to read all rows from countries
CREATE POLICY countries_anon_select_policy
ON public.countries
FOR SELECT
TO anon
USING (true);

-- Create a new policy to allow authenticated users to read all rows from countries
CREATE POLICY countries_authenticated_select_policy
ON public.countries
FOR SELECT
TO authenticated
USING (true);
```