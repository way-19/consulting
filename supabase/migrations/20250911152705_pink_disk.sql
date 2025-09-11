```sql
-- This migration sets up the overdue alerts system for consultants.
-- It includes:
-- 1. A function to check for overdue payments and documents.
-- 2. A cron job to run this check daily.
-- 3. Triggers to update `updated_at` columns.

-- Drop existing functions and types to allow recreation with changes
DROP FUNCTION IF EXISTS public.trigger_overdue_alerts_now();
DROP FUNCTION IF EXISTS public.create_test_overdue_data();

-- Function to check for overdue payments and documents and create alerts
CREATE OR REPLACE FUNCTION public.trigger_overdue_alerts_now()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    overdue_invoices_count INT := 0;
    overdue_documents_count INT := 0;
    r RECORD;
    client_consultant_id UUID;
    client_name TEXT;
    amount_due NUMERIC;
    currency TEXT;
    document_type TEXT;
    due_date DATE;
    invoice_id UUID;
    document_id UUID;
    overdue_invoices_json JSONB := '[]';
    overdue_documents_json JSONB := '[]';
BEGIN
    -- Create temporary tables to store overdue items found in this run
    CREATE TEMPORARY TABLE overdue_invoices_temp (
        id UUID,
        client_id UUID,
        consultant_id UUID,
        client_name TEXT,
        amount_due NUMERIC,
        currency TEXT,
        memo TEXT,
        due_date TIMESTAMP WITH TIME ZONE
    ) ON COMMIT DROP;

    CREATE TEMPORARY TABLE overdue_documents_temp (
        id UUID,
        client_id UUID,
        consultant_id UUID,
        client_name TEXT,
        document_type TEXT,
        due_date DATE,
        name TEXT
    ) ON COMMIT DROP;

    -- Find overdue invoices
    FOR r IN
        SELECT
            i.id AS invoice_id,
            i.client_id,
            c.assigned_consultant_id AS consultant_id,
            up.full_name AS client_full_name,
            i.amount_due,
            i.currency,
            i.memo,
            i.due_date
        FROM
            public.invoices i
        JOIN
            public.clients c ON i.client_id = c.id
        JOIN
            public.user_profiles up ON c.profile_id = up.id
        WHERE
            i.status = 'pending' AND i.due_date < NOW() AND c.assigned_consultant_id IS NOT NULL
    LOOP
        -- Insert into temporary table
        INSERT INTO overdue_invoices_temp (id, client_id, consultant_id, client_name, amount_due, currency, memo, due_date)
        VALUES (r.invoice_id, r.client_id, r.consultant_id, r.client_full_name, r.amount_due, r.currency, r.memo, r.due_date);

        overdue_invoices_count := overdue_invoices_count + 1;
    END LOOP;

    -- Find overdue expected documents
    FOR r IN
        SELECT
            ed.id AS expected_document_id,
            ed.client_id,
            ed.consultant_id,
            up.full_name AS client_full_name,
            ed.document_type,
            ed.due_date,
            ed.notes AS document_name
        FROM
            public.expected_documents ed
        JOIN
            public.user_profiles up ON ed.client_id = up.id -- Assuming client_id in expected_documents refers to user_profiles.id
        WHERE
            ed.is_submitted = FALSE AND ed.due_date < CURRENT_DATE AND ed.consultant_id IS NOT NULL
    LOOP
        -- Insert into temporary table
        INSERT INTO overdue_documents_temp (id, client_id, consultant_id, client_name, document_type, due_date, name)
        VALUES (r.expected_document_id, r.client_id, r.consultant_id, r.client_full_name, r.document_type, r.due_date, r.document_name);

        overdue_documents_count := overdue_documents_count + 1;
    END LOOP;

    -- Convert temporary tables to JSONB for return
    SELECT JSON_AGG(t) INTO overdue_invoices_json FROM overdue_invoices_temp t;
    SELECT JSON_AGG(t) INTO overdue_documents_json FROM overdue_documents_temp t;

    -- Return a JSON object with counts and details of overdue items
    RETURN JSON_BUILD_OBJECT(
        'payment_alerts', overdue_invoices_count,
        'document_alerts', overdue_documents_count,
        'total_alerts_created', overdue_invoices_count + overdue_documents_count,
        'overdue_invoices', COALESCE(overdue_invoices_json, '[]'::JSONB),
        'overdue_documents', COALESCE(overdue_documents_json, '[]'::JSONB)
    );
END;
$$;

-- Function to create test overdue data
CREATE OR REPLACE FUNCTION public.create_test_overdue_data()
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    test_client_id UUID;
    test_consultant_id UUID;
    created_invoices INT := 0;
    created_documents INT := 0;
BEGIN
    -- Create a test client and consultant if they don't exist
    SELECT id INTO test_consultant_id FROM public.user_profiles WHERE email = 'giorgi.meskhi@consulting19.com';
    IF test_consultant_id IS NULL THEN
        INSERT INTO public.user_profiles (id, email, full_name, role)
        VALUES (gen_random_uuid(), 'giorgi.meskhi@consulting19.com', 'Giorgi Meskhi', 'consultant')
        RETURNING id INTO test_consultant_id;
    END IF;

    SELECT id INTO test_client_id FROM public.clients WHERE profile_id = (SELECT id FROM public.user_profiles WHERE email = 'client@consulting19.com');
    IF test_client_id IS NULL THEN
        INSERT INTO public.user_profiles (id, email, full_name, role)
        VALUES (gen_random_uuid(), 'client@consulting19.com', 'Test Client', 'client')
        RETURNING id INTO test_client_id;

        INSERT INTO public.clients (id, profile_id, assigned_consultant_id, company_name, status)
        VALUES (gen_random_uuid(), test_client_id, test_consultant_id, 'Test Client Co.', 'active')
        RETURNING id INTO test_client_id;
    END IF;

    -- Create overdue invoice
    INSERT INTO public.invoices (client_id, amount_due, currency, status, memo, due_date)
    VALUES (test_client_id, 150.00, 'USD', 'pending', 'Overdue Accounting Fee', NOW() - INTERVAL '5 days');
    GET DIAGNOSTICS created_invoices = ROW_COUNT;

    INSERT INTO public.invoices (client_id, amount_due, currency, status, memo, due_date)
    VALUES (test_client_id, 250.00, 'USD', 'pending', 'Overdue Service Payment', NOW() - INTERVAL '10 days');
    GET DIAGNOSTICS created_invoices = created_invoices + ROW_COUNT;

    -- Create overdue expected document
    INSERT INTO public.expected_documents (client_id, consultant_id, document_type, due_date, is_submitted, notes)
    VALUES (test_client_id, test_consultant_id, 'financial', CURRENT_DATE - INTERVAL '7 days', FALSE, 'Overdue Bank Statement');
    GET DIAGNOSTICS created_documents = ROW_COUNT;

    INSERT INTO public.expected_documents (client_id, consultant_id, document_type, due_date, is_submitted, notes)
    VALUES (test_client_id, test_consultant_id, 'identity', CURRENT_DATE - INTERVAL '2 days', FALSE, 'Overdue Passport Copy');
    GET DIAGNOSTICS created_documents = created_documents + ROW_COUNT;

    RETURN JSON_BUILD_OBJECT(
        'test_invoices_created', created_invoices,
        'test_documents_created', created_documents
    );
END;
$$;

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the daily check for overdue items
-- This cron job will run every day at 09:00 AM UTC
SELECT cron.schedule(
    'daily-overdue-check',
    '0 9 * * *',
    $$
        SELECT public.trigger_overdue_alerts_now();
    $$
);

-- Optional: Add triggers for updated_at columns if not already present
-- These triggers are typically handled by a single generic function like update_updated_at_column()
-- and applied to all tables. Ensure these functions exist and are applied.

-- Example for invoices table (if not already handled by a generic trigger)
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_invoices_updated_at_trigger') THEN
        CREATE TRIGGER update_invoices_updated_at_trigger
        BEFORE UPDATE ON public.invoices
        FOR EACH ROW
        EXECUTE FUNCTION update_invoices_updated_at();
    END IF;
END $$;

-- Example for expected_documents table (if not already handled by a generic trigger)
CREATE OR REPLACE FUNCTION update_expected_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_expected_documents_updated_at_trigger') THEN
        CREATE TRIGGER update_expected_documents_updated_at_trigger
        BEFORE UPDATE ON public.expected_documents
        FOR EACH ROW
        EXECUTE FUNCTION update_expected_documents_updated_at();
    END IF;
END $$;
```