/*
  # Service Orders Tablosu Güncellemeleri

  1. Yeni Sütunlar
    - `company_name` (text, önerilen şirket adı)
    - `company_type` (text, şirket tipi)
    - `selected_package_id` (uuid, seçilen paket)
    - `additional_service_ids` (uuid[], seçilen ek hizmetler)
    - `customer_details` (jsonb, müşteri ek detayları)
    - `file_url` (text, yüklenen belge URL'si)
    - `country_id` (uuid, seçilen ülke)
  
  2. Foreign Key İlişkileri
    - `selected_package_id` -> `packages.id`
    - `country_id` -> `countries.id`
*/

-- Add new columns to service_orders table
DO $$
BEGIN
  -- Add company_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_orders' AND column_name = 'company_name'
  ) THEN
    ALTER TABLE service_orders ADD COLUMN company_name text;
  END IF;

  -- Add company_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_orders' AND column_name = 'company_type'
  ) THEN
    ALTER TABLE service_orders ADD COLUMN company_type text;
  END IF;

  -- Add selected_package_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_orders' AND column_name = 'selected_package_id'
  ) THEN
    ALTER TABLE service_orders ADD COLUMN selected_package_id uuid REFERENCES packages(id);
  END IF;

  -- Add additional_service_ids column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_orders' AND column_name = 'additional_service_ids'
  ) THEN
    ALTER TABLE service_orders ADD COLUMN additional_service_ids uuid[];
  END IF;

  -- Add customer_details column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_orders' AND column_name = 'customer_details'
  ) THEN
    ALTER TABLE service_orders ADD COLUMN customer_details jsonb DEFAULT '{}';
  END IF;

  -- Add file_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_orders' AND column_name = 'file_url'
  ) THEN
    ALTER TABLE service_orders ADD COLUMN file_url text;
  END IF;

  -- Add country_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_orders' AND column_name = 'country_id'
  ) THEN
    ALTER TABLE service_orders ADD COLUMN country_id uuid REFERENCES countries(id);
  END IF;
END $$;

-- Create trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_service_orders_updated_at' 
    AND tgrelid = 'service_orders'::regclass
  ) THEN
    CREATE TRIGGER update_service_orders_updated_at
      BEFORE UPDATE ON service_orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;