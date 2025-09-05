/*
  # Invoice to Service Order Automation System

  1. New Tables
     - `invoices` table for payment tracking
     - Links to service_orders via service_order_id

  2. Automation System
     - DB trigger automatically updates service_orders.status = 'completed' when invoices.status = 'paid'
     - Stripe webhook integration ready

  3. Security
     - Enable RLS on invoices table
     - Add policies for client and admin access
*/

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  service_order_id uuid REFERENCES service_orders(id) ON DELETE SET NULL,
  amount_due numeric(10,2) NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  stripe_invoice_id text,
  stripe_payment_intent text,
  stripe_session_id text,
  memo text,
  due_date timestamp with time zone,
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_service_order_id ON invoices(service_order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
CREATE POLICY "Clients can read own invoices"
  ON invoices
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all invoices"
  ON invoices
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Automation: Invoice paid → Service Order completed
CREATE OR REPLACE FUNCTION public.on_invoice_paid_update_order()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Sadece status paid olduğunda tetikle
  IF NEW.status = 'paid' AND NEW.service_order_id IS NOT NULL THEN
    UPDATE public.service_orders
    SET status = 'completed',
        updated_at = now()
    WHERE id = NEW.service_order_id
      AND status <> 'completed';
    
    -- Set paid_at timestamp
    NEW.paid_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trg_invoice_paid_update_order ON public.invoices;

CREATE TRIGGER trg_invoice_paid_update_order
  AFTER INSERT OR UPDATE OF status ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.on_invoice_paid_update_order();