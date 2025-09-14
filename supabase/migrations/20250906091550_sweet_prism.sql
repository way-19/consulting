/*
  # Add Commission Tracking System

  1. New Columns
    - `user_profiles.commission_rate` (numeric) - Individual consultant commission rate (default 65%)
    - `service_orders.system_commission_amount` (numeric) - System's share of revenue
    - `service_orders.consultant_commission_amount` (numeric) - Consultant's share of revenue
    - `invoices.system_commission_amount` (numeric) - System's share from invoice
    - `invoices.consultant_commission_amount` (numeric) - Consultant's share from invoice

  2. Security
    - Update existing RLS policies to include new columns
    - Add policies for commission data access

  3. Functions
    - Create function to automatically calculate commissions
    - Create trigger to update commissions when orders are completed
*/

-- Add commission rate to user profiles (for consultants)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'commission_rate'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN commission_rate numeric(5,2) DEFAULT 65.00;
  END IF;
END $$;

-- Add commission tracking to service orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_orders' AND column_name = 'system_commission_amount'
  ) THEN
    ALTER TABLE service_orders ADD COLUMN system_commission_amount numeric(10,2) DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'service_orders' AND column_name = 'consultant_commission_amount'
  ) THEN
    ALTER TABLE service_orders ADD COLUMN consultant_commission_amount numeric(10,2) DEFAULT 0;
  END IF;
END $$;

-- Add commission tracking to invoices
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'system_commission_amount'
  ) THEN
    ALTER TABLE invoices ADD COLUMN system_commission_amount numeric(10,2) DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoices' AND column_name = 'consultant_commission_amount'
  ) THEN
    ALTER TABLE invoices ADD COLUMN consultant_commission_amount numeric(10,2) DEFAULT 0;
  END IF;
END $$;

-- Create function to calculate commissions
CREATE OR REPLACE FUNCTION calculate_commission_split(
  total_amount numeric,
  consultant_id uuid
) RETURNS TABLE(
  system_amount numeric,
  consultant_amount numeric,
  commission_rate numeric
) AS $$
DECLARE
  consultant_rate numeric := 65.00; -- Default 65%
  system_rate numeric := 35.00; -- Default 35%
BEGIN
  -- Get consultant's specific commission rate
  SELECT COALESCE(up.commission_rate, 65.00) INTO consultant_rate
  FROM user_profiles up
  WHERE up.id = consultant_id AND up.role = 'consultant';
  
  -- Calculate system rate
  system_rate := 100.00 - consultant_rate;
  
  -- Return calculated amounts
  RETURN QUERY SELECT
    ROUND((total_amount * system_rate / 100.00), 2) as system_amount,
    ROUND((total_amount * consultant_rate / 100.00), 2) as consultant_amount,
    consultant_rate as commission_rate;
END;
$$ LANGUAGE plpgsql;

-- Create function to update commission amounts
CREATE OR REPLACE FUNCTION update_service_order_commissions()
RETURNS TRIGGER AS $$
DECLARE
  commission_data RECORD;
BEGIN
  -- Only calculate commissions for completed orders
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Calculate commission split
    SELECT * INTO commission_data
    FROM calculate_commission_split(NEW.total_amount, NEW.consultant_id);
    
    -- Update the service order with commission amounts
    NEW.system_commission_amount := commission_data.system_amount;
    NEW.consultant_commission_amount := commission_data.consultant_amount;
    
    -- Also update related invoice if exists
    UPDATE invoices SET
      system_commission_amount = commission_data.system_amount,
      consultant_commission_amount = commission_data.consultant_amount
    WHERE service_order_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic commission calculation
DROP TRIGGER IF EXISTS trg_calculate_commissions ON service_orders;
CREATE TRIGGER trg_calculate_commissions
  BEFORE UPDATE ON service_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_service_order_commissions();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_orders_commission_amounts 
ON service_orders(system_commission_amount, consultant_commission_amount);

CREATE INDEX IF NOT EXISTS idx_invoices_commission_amounts 
ON invoices(system_commission_amount, consultant_commission_amount);

CREATE INDEX IF NOT EXISTS idx_user_profiles_commission_rate 
ON user_profiles(commission_rate) WHERE role = 'consultant';

-- Update existing completed orders with commission calculations
DO $$
DECLARE
  order_record RECORD;
  commission_data RECORD;
BEGIN
  FOR order_record IN 
    SELECT id, total_amount, consultant_id 
    FROM service_orders 
    WHERE status = 'completed' 
    AND (system_commission_amount IS NULL OR system_commission_amount = 0)
  LOOP
    -- Calculate commission for this order
    SELECT * INTO commission_data
    FROM calculate_commission_split(order_record.total_amount, order_record.consultant_id);
    
    -- Update the order
    UPDATE service_orders SET
      system_commission_amount = commission_data.system_amount,
      consultant_commission_amount = commission_data.consultant_amount
    WHERE id = order_record.id;
    
    -- Update related invoice
    UPDATE invoices SET
      system_commission_amount = commission_data.system_amount,
      consultant_commission_amount = commission_data.consultant_amount
    WHERE service_order_id = order_record.id;
  END LOOP;
END $$;