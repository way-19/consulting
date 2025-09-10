-- supabase/migrations/20250909120000_create_consultant_alerts_table.sql

CREATE TABLE public.consultant_alerts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    consultant_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    alert_source_id uuid NOT NULL, -- ID of the expected_document or invoice
    alert_type text NOT NULL, -- 'document_due', 'payment_overdue'
    is_resolved boolean DEFAULT FALSE,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

COMMENT ON TABLE public.consultant_alerts IS 'Stores consultant-specific alerts and their resolution status.';

ALTER TABLE public.consultant_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Consultants can manage their own alerts"
ON public.consultant_alerts FOR ALL
TO authenticated
USING (consultant_id = auth.uid())
WITH CHECK (consultant_id = auth.uid());

-- Optional: Index for faster lookups
CREATE INDEX idx_consultant_alerts_consultant_id_resolved ON public.consultant_alerts (consultant_id, is_resolved);
CREATE UNIQUE INDEX uq_consultant_alerts_source ON public.consultant_alerts (consultant_id, alert_source_id, alert_type);

-- Trigger to set resolved_at when is_resolved changes to true
CREATE OR REPLACE FUNCTION public.set_resolved_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_resolved = TRUE AND OLD.is_resolved = FALSE THEN
        NEW.resolved_at = now();
    ELSIF NEW.is_resolved = FALSE AND OLD.is_resolved = TRUE THEN
        NEW.resolved_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_consultant_alert_resolved_at
BEFORE UPDATE ON public.consultant_alerts
FOR EACH ROW
EXECUTE FUNCTION public.set_resolved_at();