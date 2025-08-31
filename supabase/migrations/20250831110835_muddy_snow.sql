/*
  # Create services and orders tables

  1. New Tables
    - `global_services` (Admin managed global service categories)
    - `custom_services` (Consultant service offerings)
    - `service_orders` (Customer orders)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each role
*/

-- Create global_services table (Admin managed)
CREATE TABLE IF NOT EXISTS global_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_i18n jsonb NOT NULL DEFAULT '{}',
  description_i18n jsonb NOT NULL DEFAULT '{}',
  icon_name text DEFAULT 'Building2',
  image_url text,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create custom_services table (Consultant managed)
CREATE TABLE IF NOT EXISTS custom_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  country_id uuid REFERENCES countries(id),
  title_i18n jsonb NOT NULL DEFAULT '{}',
  description_i18n jsonb NOT NULL DEFAULT '{}',
  features_i18n jsonb DEFAULT '{}',
  category text NOT NULL DEFAULT 'general',
  price numeric(10, 2) DEFAULT 0,
  currency text DEFAULT 'USD',
  billing_type text DEFAULT 'one_time' CHECK (billing_type IN ('one_time', 'monthly', 'quarterly', 'yearly')),
  is_active boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create service_orders table (Customer orders)
CREATE TABLE IF NOT EXISTS service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id),
  custom_service_id uuid REFERENCES custom_services(id),
  title text NOT NULL,
  description text,
  total_amount numeric(10, 2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'in_progress', 'completed', 'cancelled')),
  stripe_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE global_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

-- Global services policies (Admin only)
CREATE POLICY "Admins can manage global services"
  ON global_services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can read active global services"
  ON global_services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Custom services policies
CREATE POLICY "Consultants can manage own services"
  ON custom_services
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Anyone can read active custom services"
  ON custom_services
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Service orders policies
CREATE POLICY "Clients can read own orders"
  ON service_orders
  FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Consultants can read assigned orders"
  ON service_orders
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "Admins can read all orders"
  ON service_orders
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Updated at triggers
CREATE TRIGGER update_global_services_updated_at
  BEFORE UPDATE ON global_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_services_updated_at
  BEFORE UPDATE ON custom_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at
  BEFORE UPDATE ON service_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();