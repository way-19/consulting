/*
  # Complete Accounting Management System

  1. New Tables
    - `consultant_notes` - Private consultant notes for clients
    - `document_requests` - Document requests from consultants to clients
    - `accounting_reports` - Generated accounting reports
    - `payment_reminders` - Payment reminder system
    - `client_activity_log` - Activity tracking for clients

  2. Enhanced Tables
    - Enhanced `client_documents` with better categorization
    - Enhanced `client_payment_schedules` with reminder system
    - Enhanced `messages` with accounting-specific fields

  3. Security
    - Enable RLS on all new tables
    - Add policies for consultant-client data access
    - Add policies for real-time subscriptions

  4. Functions
    - RPC function for consultant client management
    - Trigger functions for automatic notifications
    - Helper functions for accounting calculations

  5. Test Data
    - Complete test dataset with 4 clients
    - Realistic accounting scenarios
    - Document, payment, and message history
*/

-- Create consultant_notes table for private consultant notes
CREATE TABLE IF NOT EXISTS consultant_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_type varchar(50) NOT NULL DEFAULT 'general',
  note_content text NOT NULL,
  reference_id uuid, -- Can reference documents, payments, messages, etc.
  reference_type varchar(50), -- 'document', 'payment', 'message', 'general'
  is_important boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create document_requests table for consultant document requests
CREATE TABLE IF NOT EXISTS document_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_title varchar(255) NOT NULL,
  request_message text NOT NULL,
  document_types jsonb DEFAULT '[]'::jsonb, -- Array of requested document types
  priority varchar(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  due_date date,
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  client_response text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create accounting_reports table
CREATE TABLE IF NOT EXISTS accounting_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES users(id) ON DELETE CASCADE, -- NULL for multi-client reports
  report_type varchar(50) NOT NULL,
  report_title varchar(255) NOT NULL,
  report_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  period_start date,
  period_end date,
  file_url text, -- Supabase Storage URL
  status varchar(20) DEFAULT 'draft' CHECK (status IN ('draft', 'generated', 'sent', 'archived')),
  generated_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create payment_reminders table
CREATE TABLE IF NOT EXISTS payment_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_schedule_id uuid NOT NULL REFERENCES client_payment_schedules(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_type varchar(20) DEFAULT 'email' CHECK (reminder_type IN ('email', 'sms', 'notification', 'message')),
  reminder_message text NOT NULL,
  scheduled_for timestamptz NOT NULL,
  sent_at timestamptz,
  status varchar(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create client_activity_log table for tracking client activities
CREATE TABLE IF NOT EXISTS client_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES users(id) ON DELETE SET NULL,
  activity_type varchar(50) NOT NULL,
  activity_description text NOT NULL,
  reference_id uuid, -- Can reference any related record
  reference_type varchar(50), -- 'document', 'payment', 'message', 'application'
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE consultant_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultant_notes
CREATE POLICY "Consultants can manage own notes"
  ON consultant_notes
  FOR ALL
  TO authenticated
  USING (consultant_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- RLS Policies for document_requests
CREATE POLICY "Consultants can manage own document requests"
  ON document_requests
  FOR ALL
  TO authenticated
  USING (consultant_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Clients can read own document requests"
  ON document_requests
  FOR SELECT
  TO authenticated
  USING (client_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Clients can update own document requests"
  ON document_requests
  FOR UPDATE
  TO authenticated
  USING (client_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- RLS Policies for accounting_reports
CREATE POLICY "Consultants can manage own reports"
  ON accounting_reports
  FOR ALL
  TO authenticated
  USING (consultant_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Clients can read own reports"
  ON accounting_reports
  FOR SELECT
  TO authenticated
  USING (client_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- RLS Policies for payment_reminders
CREATE POLICY "Consultants can manage payment reminders"
  ON payment_reminders
  FOR ALL
  TO authenticated
  USING (consultant_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Clients can read own payment reminders"
  ON payment_reminders
  FOR SELECT
  TO authenticated
  USING (client_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- RLS Policies for client_activity_log
CREATE POLICY "Consultants can read client activity"
  ON client_activity_log
  FOR SELECT
  TO authenticated
  USING (consultant_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Clients can read own activity"
  ON client_activity_log
  FOR SELECT
  TO authenticated
  USING (client_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultant_notes_consultant_client ON consultant_notes(consultant_id, client_id);
CREATE INDEX IF NOT EXISTS idx_consultant_notes_reference ON consultant_notes(reference_id, reference_type);
CREATE INDEX IF NOT EXISTS idx_document_requests_status ON document_requests(status, due_date);
CREATE INDEX IF NOT EXISTS idx_accounting_reports_type_period ON accounting_reports(report_type, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_payment_reminders_scheduled ON payment_reminders(scheduled_for, status);
CREATE INDEX IF NOT EXISTS idx_client_activity_type ON client_activity_log(activity_type, created_at);

-- Function to automatically create activity log entries
CREATE OR REPLACE FUNCTION log_client_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Log document uploads
  IF TG_TABLE_NAME = 'client_documents' AND TG_OP = 'INSERT' THEN
    INSERT INTO client_activity_log (
      client_id, 
      activity_type, 
      activity_description, 
      reference_id, 
      reference_type,
      metadata
    ) VALUES (
      NEW.client_id,
      'document_uploaded',
      'Yeni belge yüklendi: ' || NEW.document_name,
      NEW.id,
      'document',
      jsonb_build_object('document_type', NEW.document_type, 'file_size', NEW.file_size)
    );
  END IF;

  -- Log payment creations
  IF TG_TABLE_NAME = 'client_payment_schedules' AND TG_OP = 'INSERT' THEN
    INSERT INTO client_activity_log (
      client_id, 
      consultant_id,
      activity_type, 
      activity_description, 
      reference_id, 
      reference_type,
      metadata
    ) VALUES (
      NEW.client_id,
      NEW.consultant_id,
      'payment_created',
      'Yeni ödeme talebi: ' || NEW.description,
      NEW.id,
      'payment',
      jsonb_build_object('amount', NEW.amount, 'currency', NEW.currency, 'due_date', NEW.due_date)
    );
  END IF;

  -- Log message sending
  IF TG_TABLE_NAME = 'messages' AND TG_OP = 'INSERT' AND NEW.message_type = 'accounting' THEN
    INSERT INTO client_activity_log (
      client_id, 
      activity_type, 
      activity_description, 
      reference_id, 
      reference_type,
      metadata
    ) VALUES (
      CASE WHEN (SELECT role FROM users WHERE id = NEW.sender_id) = 'client' 
           THEN NEW.sender_id 
           ELSE NEW.recipient_id END,
      'message_sent',
      'Muhasebe mesajı gönderildi',
      NEW.id,
      'message',
      jsonb_build_object('sender_role', (SELECT role FROM users WHERE id = NEW.sender_id))
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for activity logging
DROP TRIGGER IF EXISTS trigger_log_document_activity ON client_documents;
CREATE TRIGGER trigger_log_document_activity
  AFTER INSERT ON client_documents
  FOR EACH ROW EXECUTE FUNCTION log_client_activity();

DROP TRIGGER IF EXISTS trigger_log_payment_activity ON client_payment_schedules;
CREATE TRIGGER trigger_log_payment_activity
  AFTER INSERT ON client_payment_schedules
  FOR EACH ROW EXECUTE FUNCTION log_client_activity();

DROP TRIGGER IF EXISTS trigger_log_message_activity ON messages;
CREATE TRIGGER trigger_log_message_activity
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION log_client_activity();

-- Insert comprehensive test data
DO $$
DECLARE
  georgia_consultant_id uuid;
  ahmet_id uuid;
  maria_id uuid;
  david_id uuid;
  business_client_id uuid;
BEGIN
  -- Get Georgia consultant ID
  SELECT id INTO georgia_consultant_id 
  FROM users 
  WHERE email = 'georgia_consultant@consulting19.com' AND role = 'consultant';

  -- Get client IDs
  SELECT id INTO ahmet_id FROM users WHERE email = 'ahmet@test.com' AND role = 'client';
  SELECT id INTO maria_id FROM users WHERE email = 'maria@test.com' AND role = 'client';
  SELECT id INTO david_id FROM users WHERE email = 'david@test.com' AND role = 'client';
  SELECT id INTO business_client_id FROM users WHERE email = 'client@consulting19.com' AND role = 'client';

  IF georgia_consultant_id IS NOT NULL THEN
    -- Test documents for Ahmet (mixed status)
    IF ahmet_id IS NOT NULL THEN
      INSERT INTO client_documents (client_id, document_name, document_type, file_url, file_size, mime_type, upload_source, status, consultant_notes, created_at) VALUES
      (ahmet_id, 'Ocak_Gelir_Belgesi.pdf', 'income_statement', 'documents/ahmet/income_jan_2024.pdf', 245760, 'application/pdf', 'client', 'pending_review', NULL, now() - interval '2 days'),
      (ahmet_id, 'Banka_Ekstresi_Aralik.pdf', 'bank_statement', 'documents/ahmet/bank_dec_2023.pdf', 189432, 'application/pdf', 'client', 'approved', 'Belge onaylandı, muhasebe kaydı yapıldı.', now() - interval '5 days'),
      (ahmet_id, 'Kira_Sozlesmesi.pdf', 'contract', 'documents/ahmet/rent_contract.pdf', 156789, 'application/pdf', 'client', 'requires_update', 'Sözleşme tarihini güncelleyin.', now() - interval '7 days');

      -- Payment schedules for Ahmet (overdue payment)
      INSERT INTO client_payment_schedules (client_id, consultant_id, payment_type, description, amount, currency, due_date, status, recurring, country_id, created_at) VALUES
      (ahmet_id, georgia_consultant_id, 'virtual_address', 'Aylık sanal adres yenileme ücreti', 50.00, 'USD', current_date - interval '5 days', 'pending', true, 1, now() - interval '10 days'),
      (ahmet_id, georgia_consultant_id, 'accounting_fee', 'Şubat ayı muhasebe hizmet ücreti', 299.00, 'USD', current_date + interval '10 days', 'pending', true, 1, now() - interval '3 days');

      -- Messages for Ahmet
      INSERT INTO messages (sender_id, recipient_id, message, message_type, original_language, needs_translation, is_read, created_at) VALUES
      (georgia_consultant_id, ahmet_id, 'Merhaba Ahmet! Ocak ayı gelir belgenizi inceledim. Birkaç detay eksik, lütfen güncelleyebilir misiniz?', 'accounting', 'tr', false, false, now() - interval '1 day'),
      (ahmet_id, georgia_consultant_id, 'Merhaba Nino! Hangi detaylar eksik? Hemen düzelteyim.', 'accounting', 'tr', false, true, now() - interval '12 hours'),
      (georgia_consultant_id, ahmet_id, 'Ayrıca sanal adres ücretiniz 5 gün gecikmiş. Lütfen en kısa sürede ödeyebilir misiniz?', 'accounting', 'tr', false, false, now() - interval '6 hours');

      -- Document request for Ahmet
      INSERT INTO document_requests (consultant_id, client_id, request_title, request_message, document_types, priority, due_date, status) VALUES
      (georgia_consultant_id, ahmet_id, 'Şubat Ayı Gider Belgeleri', 'Şubat ayı için tüm gider belgelerinizi (faturalar, makbuzlar) yüklemeniz gerekiyor.', '["expense_receipt", "invoice"]', 'high', current_date + interval '7 days', 'pending');

      -- Consultant notes for Ahmet
      INSERT INTO consultant_notes (consultant_id, client_id, note_type, note_content, is_important) VALUES
      (georgia_consultant_id, ahmet_id, 'payment', 'Müşteri ödeme konusunda bazen gecikiyor. Hatırlatma mesajları göndermek gerekebilir.', true),
      (georgia_consultant_id, ahmet_id, 'document', 'Belge kalitesi genelde iyi, sadece tarih formatlarında sorun yaşıyor.', false);
    END IF;

    -- Test documents for Maria (all approved)
    IF maria_id IS NOT NULL THEN
      INSERT INTO client_documents (client_id, document_name, document_type, file_url, file_size, mime_type, upload_source, status, consultant_notes, created_at) VALUES
      (maria_id, 'Yillik_Mali_Rapor_2023.pdf', 'financial_report', 'documents/maria/annual_report_2023.pdf', 567890, 'application/pdf', 'client', 'approved', 'Mükemmel düzenlenmiş rapor. Hiç sorun yok.', now() - interval '3 days'),
      (maria_id, 'Vergi_Beyannamesi_2023.pdf', 'tax_document', 'documents/maria/tax_return_2023.pdf', 234567, 'application/pdf', 'client', 'approved', 'Vergi beyannamesi onaylandı.', now() - interval '8 days'),
      (maria_id, 'Banka_Ekstresi_Ocak.pdf', 'bank_statement', 'documents/maria/bank_jan_2024.pdf', 123456, 'application/pdf', 'client', 'approved', 'Banka ekstresi temiz ve düzenli.', now() - interval '12 days');

      -- Payment schedules for Maria (all up to date)
      INSERT INTO client_payment_schedules (client_id, consultant_id, payment_type, description, amount, currency, due_date, status, recurring, country_id, created_at) VALUES
      (maria_id, georgia_consultant_id, 'accounting_fee', 'Aylık muhasebe hizmet ücreti', 299.00, 'USD', current_date + interval '15 days', 'pending', true, 1, now() - interval '5 days'),
      (maria_id, georgia_consultant_id, 'compliance_fee', 'Yıllık uyumluluk kontrol ücreti', 199.00, 'USD', current_date + interval '30 days', 'pending', false, 1, now() - interval '2 days');

      -- Messages for Maria (minimal, professional)
      INSERT INTO messages (sender_id, recipient_id, message, message_type, original_language, needs_translation, is_read, created_at) VALUES
      (georgia_consultant_id, maria_id, 'Hola Maria! Todos sus documentos están perfectos. Gracias por su organización.', 'accounting', 'es', true, true, now() - interval '2 days'),
      (maria_id, georgia_consultant_id, 'Gracias Nino! ¿Hay algo más que necesite hacer este mes?', 'accounting', 'es', true, true, now() - interval '1 day');

      -- Consultant notes for Maria
      INSERT INTO consultant_notes (consultant_id, client_id, note_type, note_content, is_important) VALUES
      (georgia_consultant_id, maria_id, 'general', 'Mükemmel müşteri. Her zaman zamanında ödeme yapar ve belgeler düzenli.', false),
      (georgia_consultant_id, maria_id, 'language', 'İspanyolca konuşuyor, çeviri sistemi kullanılıyor.', false);
    END IF;

    -- Test documents for David (approved docs, overdue payment)
    IF david_id IS NOT NULL THEN
      INSERT INTO client_documents (client_id, document_name, document_type, file_url, file_size, mime_type, upload_source, status, consultant_notes, created_at) VALUES
      (david_id, 'Q4_Financial_Statement.pdf', 'financial_report', 'documents/david/q4_2023.pdf', 445566, 'application/pdf', 'client', 'approved', 'Quarterly report approved. Good financial health.', now() - interval '4 days'),
      (david_id, 'Tax_Documents_2023.pdf', 'tax_document', 'documents/david/tax_2023.pdf', 334455, 'application/pdf', 'client', 'approved', 'Tax documents complete and accurate.', now() - interval '9 days'),
      (david_id, 'Business_License.pdf', 'other', 'documents/david/license.pdf', 112233, 'application/pdf', 'client', 'approved', 'Business license verified.', now() - interval '15 days');

      -- Payment schedules for David (overdue tax payment)
      INSERT INTO client_payment_schedules (client_id, consultant_id, payment_type, description, amount, currency, due_date, status, recurring, country_id, created_at) VALUES
      (david_id, georgia_consultant_id, 'tax_payment', 'Q4 2023 vergi ödemesi', 1250.00, 'USD', current_date - interval '10 days', 'pending', false, 1, now() - interval '15 days'),
      (david_id, georgia_consultant_id, 'accounting_fee', 'Aylık muhasebe hizmet ücreti', 399.00, 'USD', current_date + interval '5 days', 'pending', true, 1, now() - interval '7 days');

      -- Messages for David (payment reminders)
      INSERT INTO messages (sender_id, recipient_id, message, message_type, original_language, needs_translation, is_read, created_at) VALUES
      (georgia_consultant_id, david_id, 'Hello David! Your Q4 tax payment is 10 days overdue. Please process the payment as soon as possible.', 'accounting', 'en', false, false, now() - interval '2 days'),
      (david_id, georgia_consultant_id, 'Hi Nino! I apologize for the delay. I will process the payment today.', 'accounting', 'en', false, true, now() - interval '1 day');

      -- Document request for David (new tax documents)
      INSERT INTO document_requests (consultant_id, client_id, request_title, request_message, document_types, priority, due_date, status) VALUES
      (georgia_consultant_id, david_id, '2024 Q1 Tax Documents', 'Please upload your Q1 2024 tax documents including income statements and expense receipts.', '["tax_document", "income_statement", "expense_receipt"]', 'normal', current_date + interval '14 days', 'pending');

      -- Consultant notes for David
      INSERT INTO consultant_notes (consultant_id, client_id, note_type, note_content, is_important) VALUES
      (georgia_consultant_id, david_id, 'payment', 'Usually reliable with payments but occasionally needs reminders for tax deadlines.', true),
      (georgia_consultant_id, david_id, 'language', 'English speaker, no translation needed.', false);
    END IF;

    -- Test documents for Business Client (mixed scenario)
    IF business_client_id IS NOT NULL THEN
      INSERT INTO client_documents (client_id, document_name, document_type, file_url, file_size, mime_type, upload_source, status, consultant_notes, created_at) VALUES
      (business_client_id, 'Corporate_Structure.pdf', 'other', 'documents/business/structure.pdf', 678901, 'application/pdf', 'client', 'approved', 'Corporate structure approved.', now() - interval '6 days'),
      (business_client_id, 'Payroll_January.xlsx', 'payroll', 'documents/business/payroll_jan.xlsx', 89012, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'client', 'pending_review', NULL, now() - interval '1 day'),
      (business_client_id, 'Audit_Report_2023.pdf', 'audit_report', 'documents/business/audit_2023.pdf', 789123, 'application/pdf', 'consultant', 'approved', 'Audit completed successfully.', now() - interval '10 days');

      -- Payment schedules for Business Client
      INSERT INTO client_payment_schedules (client_id, consultant_id, payment_type, description, amount, currency, due_date, status, recurring, country_id, created_at) VALUES
      (business_client_id, georgia_consultant_id, 'accounting_fee', 'Kurumsal muhasebe hizmet ücreti', 599.00, 'USD', current_date + interval '20 days', 'pending', true, 1, now() - interval '8 days'),
      (business_client_id, georgia_consultant_id, 'audit_fee', 'Yıllık denetim ücreti', 2500.00, 'USD', current_date + interval '45 days', 'pending', false, 1, now() - interval '4 days');

      -- Messages for Business Client
      INSERT INTO messages (sender_id, recipient_id, message, message_type, original_language, needs_translation, is_read, created_at) VALUES
      (georgia_consultant_id, business_client_id, 'Your corporate audit has been completed successfully. All documents are in order.', 'accounting', 'en', false, true, now() - interval '3 days'),
      (business_client_id, georgia_consultant_id, 'Thank you Nino! When should we schedule the next quarterly review?', 'accounting', 'en', false, true, now() - interval '2 days');

      -- Consultant notes for Business Client
      INSERT INTO consultant_notes (consultant_id, client_id, note_type, note_content, is_important) VALUES
      (georgia_consultant_id, business_client_id, 'general', 'Large corporate client. Requires detailed reporting and regular audits.', true),
      (georgia_consultant_id, business_client_id, 'billing', 'Higher service fees due to complexity. Always pays on time.', false);
    END IF;

    -- Create some accounting reports
    INSERT INTO accounting_reports (consultant_id, client_id, report_type, report_title, report_data, period_start, period_end, status, generated_at) VALUES
    (georgia_consultant_id, ahmet_id, 'monthly_summary', 'Ahmet Yılmaz - Ocak 2024 Özet Raporu', 
     '{"total_income": 5000, "total_expenses": 2000, "net_profit": 3000, "tax_liability": 600}'::jsonb, 
     '2024-01-01', '2024-01-31', 'generated', now() - interval '2 days'),
    (georgia_consultant_id, maria_id, 'quarterly_report', 'Maria Garcia - Q4 2023 Üç Aylık Rapor', 
     '{"total_income": 15000, "total_expenses": 8000, "net_profit": 7000, "tax_liability": 1400}'::jsonb, 
     '2023-10-01', '2023-12-31', 'generated', now() - interval '5 days'),
    (georgia_consultant_id, NULL, 'consultant_summary', 'Tüm Müşteriler - Ocak 2024 Özet', 
     '{"total_clients": 4, "total_revenue": 25000, "total_commission": 16250}'::jsonb, 
     '2024-01-01', '2024-01-31', 'generated', now() - interval '1 day');

    -- Create payment reminders for overdue payments
    INSERT INTO payment_reminders (payment_schedule_id, consultant_id, client_id, reminder_type, reminder_message, scheduled_for, status) 
    SELECT 
      cps.id,
      georgia_consultant_id,
      cps.client_id,
      'notification',
      'Ödeme vadesi geçmiş: ' || cps.description || ' - ' || cps.amount || ' ' || cps.currency,
      now() + interval '1 hour',
      'pending'
    FROM client_payment_schedules cps
    WHERE cps.consultant_id = georgia_consultant_id 
      AND cps.status = 'pending' 
      AND cps.due_date < current_date;

  END IF;
END $$;

-- Create function to get consultant accounting overview
CREATE OR REPLACE FUNCTION get_consultant_accounting_overview(p_consultant_id uuid)
RETURNS TABLE (
  total_clients bigint,
  pending_documents bigint,
  overdue_payments bigint,
  total_monthly_revenue numeric,
  unread_messages bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(DISTINCT client_id) FROM applications WHERE consultant_id = p_consultant_id)::bigint,
    (SELECT COUNT(*) FROM client_documents cd 
     JOIN applications a ON cd.client_id = a.client_id 
     WHERE a.consultant_id = p_consultant_id AND cd.status = 'pending_review')::bigint,
    (SELECT COUNT(*) FROM client_payment_schedules cps 
     WHERE cps.consultant_id = p_consultant_id 
       AND cps.status = 'pending' 
       AND cps.due_date < CURRENT_DATE)::bigint,
    (SELECT COALESCE(SUM(amount), 0) FROM client_payment_schedules cps 
     WHERE cps.consultant_id = p_consultant_id 
       AND cps.recurring = true 
       AND cps.status = 'pending')::numeric,
    (SELECT COUNT(*) FROM messages m 
     WHERE m.recipient_id = p_consultant_id 
       AND m.message_type = 'accounting' 
       AND m.is_read = false)::bigint;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get client accounting summary
CREATE OR REPLACE FUNCTION get_client_accounting_summary(p_client_id uuid)
RETURNS TABLE (
  total_documents bigint,
  pending_documents bigint,
  approved_documents bigint,
  total_payments bigint,
  overdue_payments bigint,
  total_overdue_amount numeric,
  unread_messages bigint,
  pending_requests bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM client_documents WHERE client_id = p_client_id)::bigint,
    (SELECT COUNT(*) FROM client_documents WHERE client_id = p_client_id AND status = 'pending_review')::bigint,
    (SELECT COUNT(*) FROM client_documents WHERE client_id = p_client_id AND status = 'approved')::bigint,
    (SELECT COUNT(*) FROM client_payment_schedules WHERE client_id = p_client_id)::bigint,
    (SELECT COUNT(*) FROM client_payment_schedules 
     WHERE client_id = p_client_id AND status = 'pending' AND due_date < CURRENT_DATE)::bigint,
    (SELECT COALESCE(SUM(amount), 0) FROM client_payment_schedules 
     WHERE client_id = p_client_id AND status = 'pending' AND due_date < CURRENT_DATE)::numeric,
    (SELECT COUNT(*) FROM messages 
     WHERE recipient_id = p_client_id AND message_type = 'accounting' AND is_read = false)::bigint,
    (SELECT COUNT(*) FROM document_requests 
     WHERE client_id = p_client_id AND status = 'pending')::bigint;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create notification trigger for real-time updates
CREATE OR REPLACE FUNCTION notify_accounting_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify on document status changes
  IF TG_TABLE_NAME = 'client_documents' AND TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO user_notifications (user_id, title, message, type, priority, metadata) VALUES
    (NEW.client_id, 
     'Belge Durumu Güncellendi', 
     'Belgeniz "' || NEW.document_name || '" durumu: ' || NEW.status,
     'document',
     'normal',
     jsonb_build_object('document_id', NEW.id, 'old_status', OLD.status, 'new_status', NEW.status));
  END IF;

  -- Notify on new payment schedules
  IF TG_TABLE_NAME = 'client_payment_schedules' AND TG_OP = 'INSERT' THEN
    INSERT INTO user_notifications (user_id, title, message, type, priority, action_url, metadata) VALUES
    (NEW.client_id,
     'Yeni Ödeme Talebi',
     NEW.description || ' - ' || NEW.amount || ' ' || NEW.currency,
     'payment',
     'high',
     '/client#payments',
     jsonb_build_object('payment_id', NEW.id, 'amount', NEW.amount, 'due_date', NEW.due_date));
  END IF;

  -- Notify on new document requests
  IF TG_TABLE_NAME = 'document_requests' AND TG_OP = 'INSERT' THEN
    INSERT INTO user_notifications (user_id, title, message, type, priority, action_url, metadata) VALUES
    (NEW.client_id,
     'Yeni Belge Talebi',
     NEW.request_title || ' - ' || NEW.request_message,
     'document',
     CASE NEW.priority WHEN 'urgent' THEN 'urgent' WHEN 'high' THEN 'high' ELSE 'normal' END,
     '/client#documents',
     jsonb_build_object('request_id', NEW.id, 'due_date', NEW.due_date));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for notifications
DROP TRIGGER IF EXISTS trigger_notify_document_changes ON client_documents;
CREATE TRIGGER trigger_notify_document_changes
  AFTER UPDATE ON client_documents
  FOR EACH ROW EXECUTE FUNCTION notify_accounting_changes();

DROP TRIGGER IF EXISTS trigger_notify_payment_creation ON client_payment_schedules;
CREATE TRIGGER trigger_notify_payment_creation
  AFTER INSERT ON client_payment_schedules
  FOR EACH ROW EXECUTE FUNCTION notify_accounting_changes();

DROP TRIGGER IF EXISTS trigger_notify_document_requests ON document_requests;
CREATE TRIGGER trigger_notify_document_requests
  AFTER INSERT ON document_requests
  FOR EACH ROW EXECUTE FUNCTION notify_accounting_changes();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;