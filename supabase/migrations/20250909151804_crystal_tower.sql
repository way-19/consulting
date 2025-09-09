/*
  # Muhasebe ve Ödeme Sistemi Güncellemesi

  1. Yeni Tablolar
    - Mevcut invoice ve meeting tabloları genişletiliyor
    
  2. Güvenlik
    - Mevcut RLS politikaları korunuyor
    
  3. Değişiklikler
    - invoices tablosuna payment_type ve related_entity_id ekleniyor
    - meetings tablosuna komisyon sütunları ekleniyor
    - Vergi ödemelerini komisyon hesaplamasından hariç tutan logic ekleniyor
*/

-- invoices tablosuna yeni sütunlar ekle
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'payment_type'
  ) THEN
    ALTER TABLE invoices ADD COLUMN payment_type text DEFAULT 'service_order';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'invoices' AND column_name = 'related_entity_id'
  ) THEN
    ALTER TABLE invoices ADD COLUMN related_entity_id uuid;
  END IF;
END $$;

-- meetings tablosuna komisyon sütunları ekle
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'meetings' AND column_name = 'system_commission_amount'
  ) THEN
    ALTER TABLE meetings ADD COLUMN system_commission_amount numeric(10,2) DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'meetings' AND column_name = 'consultant_commission_amount'
  ) THEN
    ALTER TABLE meetings ADD COLUMN consultant_commission_amount numeric(10,2) DEFAULT 0;
  END IF;
END $$;

-- consultant_alerts tablosuna tax_notification alert type'ını ekle
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'alert_type_enum'
  ) THEN
    -- Enum yoksa onu da kontrol et ve güncelle
    ALTER TABLE consultant_alerts 
    DROP CONSTRAINT IF EXISTS consultant_alerts_alert_type_check;
    
    ALTER TABLE consultant_alerts 
    ADD CONSTRAINT consultant_alerts_alert_type_check 
    CHECK (alert_type = ANY (ARRAY[
      'document_due'::text, 
      'payment_overdue'::text, 
      'task_assigned'::text, 
      'client_inactive'::text, 
      'tax_notification'::text,
      'other'::text
    ]));
  END IF;
END $$;

-- payment_type için check constraint ekle
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'invoices_payment_type_check'
  ) THEN
    ALTER TABLE invoices 
    ADD CONSTRAINT invoices_payment_type_check 
    CHECK (payment_type = ANY (ARRAY[
      'service_order'::text,
      'accounting_fee'::text,
      'virtual_office_fee'::text,
      'tax_payment'::text,
      'meeting_fee'::text
    ]));
  END IF;
END $$;

-- Meeting komisyon hesaplama fonksiyonu
CREATE OR REPLACE FUNCTION calculate_meeting_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- Sadece ödeme yapıldığında komisyon hesapla
  IF NEW.price_paid > 0 AND (OLD.price_paid IS NULL OR OLD.price_paid = 0) THEN
    -- Danışmanın komisyon oranını al
    SELECT commission_rate INTO NEW.consultant_commission_amount 
    FROM user_profiles 
    WHERE id = NEW.consultant_id;
    
    -- Komisyon hesapla (default: %65 danışman, %35 sistem)
    NEW.consultant_commission_amount := COALESCE(NEW.consultant_commission_amount, 65.00);
    NEW.consultant_commission_amount := (NEW.price_paid * NEW.consultant_commission_amount / 100);
    NEW.system_commission_amount := NEW.price_paid - NEW.consultant_commission_amount;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Meeting komisyon hesaplama trigger'ını ekle
DROP TRIGGER IF EXISTS meeting_commission_calculation ON meetings;
CREATE TRIGGER meeting_commission_calculation
  BEFORE UPDATE OF price_paid ON meetings
  FOR EACH ROW
  EXECUTE FUNCTION calculate_meeting_commission();

-- Vergi ödemesi komisyon hariç tutma fonksiyonu
CREATE OR REPLACE FUNCTION handle_tax_payment_commission()
RETURNS TRIGGER AS $$
BEGIN
  -- Eğer payment_type tax_payment ise komisyonları sıfırla
  IF NEW.payment_type = 'tax_payment' THEN
    NEW.system_commission_amount := 0;
    NEW.consultant_commission_amount := 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tax payment komisyon hariç tutma trigger'ını ekle
DROP TRIGGER IF EXISTS tax_payment_commission_override ON invoices;
CREATE TRIGGER tax_payment_commission_override
  BEFORE INSERT OR UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION handle_tax_payment_commission();