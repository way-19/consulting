-- Clean up all custom tables and functions
-- WARNING: This will delete ALL custom data

-- Drop tables in correct dependency order
DROP TABLE IF EXISTS public.time_entries CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.document_requests CASCADE;
DROP TABLE IF EXISTS public.service_orders CASCADE;
DROP TABLE IF EXISTS public.custom_services CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.message_threads CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.thread_participants CASCADE;
DROP TABLE IF EXISTS public.consultant_availability CASCADE;
DROP TABLE IF EXISTS public.booking_requests CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.marketing_pages CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.countries CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.telemetry_events CASCADE;
DROP TABLE IF EXISTS public.email_templates CASCADE;
DROP TABLE IF EXISTS public.email_template_versions CASCADE;
DROP TABLE IF EXISTS public.document_categories CASCADE;
DROP TABLE IF EXISTS public.client_onboarding_progress CASCADE;

-- Drop custom functions
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.log_admin_action(text, text, text, jsonb, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.log_telemetry_event(text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.admin_revenue_overview(date, date, text) CASCADE;
DROP FUNCTION IF EXISTS public.admin_ar_aging(date) CASCADE;
DROP FUNCTION IF EXISTS public.admin_payouts_by_consultant(date, date) CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.project_status CASCADE;
DROP TYPE IF EXISTS public.task_status CASCADE;
DROP TYPE IF EXISTS public.document_status CASCADE;
DROP TYPE IF EXISTS public.priority_level CASCADE;

-- Note: Supabase auth tables (auth.users, etc.) remain intact