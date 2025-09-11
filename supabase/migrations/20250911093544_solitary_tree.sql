/*
  # Documents tablosuna finansal belge detayları ekleme

  ## Amaç
  Müşterilerin yüklediği finansal belgelerin daha iyi kategorize edilmesi ve takip edilmesi için documents tablosuna ek sütunlar ekleniyor.

  ## Değişiklikler
  1. **amount**: Belgedeki finansal tutar (NUMERIC(10,2))
  2. **currency**: Para birimi (TEXT, varsayılan USD)
  3. **transaction_date**: İşlem tarihi (DATE)

  ## Notlar
  - Bu sütunlar müşteri tarafından manuel olarak girilmeyecek
  - Danışman veya AI sistemi tarafından doldurulabilecek
  - Finansal belgelerin daha detaylı takibi için gerekli
  - Mevcut veriler etkilenmeyecek (NULL değerler kabul ediliyor)
*/

-- Add amount column for financial document values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'amount' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.documents 
    ADD COLUMN amount NUMERIC(10,2) NULL;
  END IF;
END $$;

-- Add currency column for financial document currency
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'currency' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.documents 
    ADD COLUMN currency TEXT NULL DEFAULT 'USD';
  END IF;
END $$;

-- Add transaction_date column for financial document transaction dates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'documents' AND column_name = 'transaction_date' AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.documents 
    ADD COLUMN transaction_date DATE NULL;
  END IF;
END $$;

-- Add index for financial document queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'documents' AND indexname = 'idx_documents_financial'
  ) THEN
    CREATE INDEX idx_documents_financial ON public.documents (type, transaction_date) 
    WHERE type = 'financial';
  END IF;
END $$;

-- Add index for amount-based queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'documents' AND indexname = 'idx_documents_amount'
  ) THEN
    CREATE INDEX idx_documents_amount ON public.documents (amount) 
    WHERE amount IS NOT NULL;
  END IF;
END $$;