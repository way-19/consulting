-- This migration creates functions and triggers for overdue alerts.
-- It should be run after initial schema setup.

-- Drop existing functions and types if they exist to allow recreation
DROP TRIGGER IF EXISTS trg_check_overdue_payments ON public.invoices;
DROP TRIGGER IF EXISTS trg_check_overdue_documents ON public.expected_documents;
DROP FUNCTION IF EXISTS check_overdue_payments();
DROP FUNCTION IF EXISTS check_overdue_documents();
DROP FUNCTION IF EXISTS trigger_overdue_alerts_now();

-- Create a function to check for overdue payments
CREATE OR REPLACE FUNCTION check_overdue_payments()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'pending' AND NEW.due_date IS NOT NULL AND NEW.due_date < NOW() THEN
        -- Log or notify about overdue payment
        INSERT INTO public.consultant_alerts (consultant_id, alert_source_id, alert_type, is_resolved)
        VALUES (NEW.consultant_id, NEW.id, 'payment_overdue', FALSE)
        ON CONFLICT (consultant_id, alert_source_id, alert_type) DO UPDATE SET is_resolved = FALSE, created_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call check_overdue_payments on invoice updates
CREATE TRIGGER trg_check_overdue_payments
AFTER UPDATE OF status, due_date ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION check_overdue_payments();

-- Create a function to check for overdue documents
CREATE OR REPLACE FUNCTION check_overdue_documents()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_submitted = FALSE AND NEW.due_date IS NOT NULL AND NEW.due_date < NOW() THEN
        -- Log or notify about overdue document
        INSERT INTO public.consultant_alerts (consultant_id, alert_source_id, alert_type, is_resolved)
        VALUES (NEW.consultant_id, NEW.id, 'document_due', FALSE)
        ON CONFLICT (consultant_id, alert_source_id, alert_type) DO UPDATE SET is_resolved = FALSE, created_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call check_overdue_documents on expected_document updates
CREATE TRIGGER trg_check_overdue_documents
AFTER UPDATE OF is_submitted, due_date ON public.expected_documents
FOR EACH ROW
EXECUTE FUNCTION check_overoverdue_documents();

-- Function to manually trigger overdue checks and return results
CREATE OR REPLACE FUNCTION trigger_overdue_alerts_now()
RETURNS JSON AS $$
DECLARE
    overdue_invoices JSON;
    overdue_documents JSON;
BEGIN
    -- Find overdue invoices
    SELECT json_agg(
        json_build_object(
            'id', i.id,
            'client_id', i.client_id,
            'consultant_id', i.consultant_id,
            'amount_due', i.amount_due,
            'currency', i.currency,
            'due_date', i.due_date,
            'client_name', up.full_name
        )
    )
    INTO overdue_invoices
    FROM public.invoices i
    JOIN public.clients c ON i.client_id = c.id
    JOIN public.user_profiles up ON c.profile_id = up.id
    WHERE i.status = 'pending' AND i.due_date < NOW();

    -- Find overdue expected documents
    SELECT json_agg(
        json_build_object(
            'id', ed.id,
            'client_id', ed.client_id,
            'consultant_id', ed.consultant_id,
            'document_type', ed.document_type,
            'due_date', ed.due_date,
            'client_name', up.full_name
        )
    )
    INTO overdue_documents
    FROM public.expected_documents ed
    JOIN public.clients c ON ed.client_id = c.id
    JOIN public.user_profiles up ON c.profile_id = up.id
    WHERE ed.is_submitted = FALSE AND ed.due_date < NOW();

    -- Return both as a JSON object
    RETURN json_build_object(
        'overdue_invoices', COALESCE(overdue_invoices, '[]'::json),
        'overdue_documents', COALESCE(overdue_documents, '[]'::json)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies for the new functions if necessary
-- For trigger_overdue_alerts_now, ensure service_role can execute it.
GRANT EXECUTE ON FUNCTION trigger_overdue_alerts_now() TO service_role;