-- Remove markdown code block delimiters
DROP POLICY IF EXISTS "Enable all for consultant's own services" ON public.services;
DROP POLICY IF EXISTS "Enable public read for active services" ON public.services;
DROP POLICY IF EXISTS "Enable read for public services" ON public.services;

CREATE POLICY "Enable all for consultant's own services"
ON public.services
FOR ALL
TO authenticated
USING (uid() = consultant_id)
WITH CHECK (uid() = consultant_id);

CREATE POLICY "Enable public read for active services"
ON public.services
FOR SELECT
USING ((is_public = true) AND (is_active = true));

CREATE POLICY "Enable read for public services"
ON public.services
FOR SELECT
TO authenticated
USING ((is_public = true) AND (is_active = true));