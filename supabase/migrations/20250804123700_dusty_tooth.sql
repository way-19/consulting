CREATE TABLE public.country_services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id integer REFERENCES public.countries(id),
    title character varying(255) NOT NULL,
    description text,
    image_url text,
    features jsonb DEFAULT '[]'::jsonb,
    price numeric(10, 2),
    currency character varying(3) DEFAULT 'USD'::character varying,
    slug character varying(255) UNIQUE,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE public.country_faqs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id integer REFERENCES public.countries(id),
    question text NOT NULL,
    answer text NOT NULL,
    order_index integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

ALTER TABLE public.country_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.country_services FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.country_faqs FOR SELECT USING (true);

-- Policies for consultants to manage their assigned country's content (requires consultant_country_assignments)
CREATE POLICY "Consultants can insert services for their assigned countries" ON public.country_services
FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.consultant_country_assignments cca WHERE cca.consultant_id = auth.uid() AND cca.country_id = country_services.country_id AND cca.status = TRUE)
);

CREATE POLICY "Consultants can update services for their assigned countries" ON public.country_services
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.consultant_country_assignments cca WHERE cca.consultant_id = auth.uid() AND cca.country_id = country_services.country_id AND cca.status = TRUE)
);

CREATE POLICY "Consultants can delete services for their assigned countries" ON public.country_services
FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.consultant_country_assignments cca WHERE cca.consultant_id = auth.uid() AND cca.country_id = country_services.country_id AND cca.status = TRUE)
);

CREATE POLICY "Consultants can insert FAQs for their assigned countries" ON public.country_faqs
FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.consultant_country_assignments cca WHERE cca.consultant_id = auth.uid() AND cca.country_id = country_faqs.country_id AND cca.status = TRUE)
);

CREATE POLICY "Consultants can update FAQs for their assigned countries" ON public.country_faqs
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.consultant_country_assignments cca WHERE cca.consultant_id = auth.uid() AND cca.country_id = country_faqs.country_id AND cca.status = TRUE)
);

CREATE POLICY "Consultants can delete FAQs for their assigned countries" ON public.country_faqs
FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.consultant_country_assignments cca WHERE cca.consultant_id = auth.uid() AND cca.country_id = country_faqs.country_id AND cca.status = TRUE)
);