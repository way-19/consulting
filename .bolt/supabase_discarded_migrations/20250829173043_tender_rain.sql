-- Remove markdown code block delimiters
DROP POLICY IF EXISTS "Enable public read for active countries" ON public.countries;
DROP POLICY IF EXISTS "Enable authenticated read for countries" ON public.countries;
DROP POLICY IF EXISTS "Enable public read for countries" ON public.countries;

CREATE POLICY "Enable public read for active countries"
ON public.countries
FOR SELECT
USING (is_active = true);

CREATE POLICY "Enable authenticated read for countries"
ON public.countries
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable public read for countries"
ON public.countries
FOR SELECT
TO public
USING (is_active = true);