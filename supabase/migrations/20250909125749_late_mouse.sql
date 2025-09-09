/*
  # Fix uid() Function Error in RLS Policies

  1. Problem
    - RLS policies using `uid()` function which doesn't exist
    - Need to update all policies to use `auth.uid()` instead

  2. Solution
    - Drop existing policies with uid()
    - Recreate policies with auth.uid()
    - Ensure proper RLS enforcement

  3. Security
    - Maintain same security model
    - Fix syntax errors without changing logic
*/

-- Fix consultant_performance_analytics policies
DROP POLICY IF EXISTS "Consultants can view own analytics" ON consultant_performance_analytics;
CREATE POLICY "Consultants can view own analytics"
  ON consultant_performance_analytics
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

DROP POLICY IF EXISTS "System can manage analytics" ON consultant_performance_analytics;
CREATE POLICY "System can manage analytics"
  ON consultant_performance_analytics
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ));

-- Fix client_interaction_logs policies
DROP POLICY IF EXISTS "Consultants can view client interactions" ON client_interaction_logs;
CREATE POLICY "Consultants can view client interactions"
  ON client_interaction_logs
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

DROP POLICY IF EXISTS "System can log interactions" ON client_interaction_logs;
CREATE POLICY "System can log interactions"
  ON client_interaction_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Fix performance_benchmarks policies
DROP POLICY IF EXISTS "Consultants can read benchmarks" ON performance_benchmarks;
CREATE POLICY "Consultants can read benchmarks"
  ON performance_benchmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role IN ('consultant', 'admin')
  ));

DROP POLICY IF EXISTS "Admins can manage benchmarks" ON performance_benchmarks;
CREATE POLICY "Admins can manage benchmarks"
  ON performance_benchmarks
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ))
  WITH CHECK (auth.uid() IN (
    SELECT id FROM user_profiles WHERE role = 'admin'
  ));

-- Fix custom_reports policies
DROP POLICY IF EXISTS "Consultants can manage own reports" ON custom_reports;
CREATE POLICY "Consultants can manage own reports"
  ON custom_reports
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Fix accounting_periods policies if they exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'accounting_periods') THEN
    DROP POLICY IF EXISTS "Consultants can manage client accounting periods" ON accounting_periods;
    CREATE POLICY "Consultants can manage client accounting periods"
      ON accounting_periods
      FOR ALL
      TO authenticated
      USING (consultant_id = auth.uid())
      WITH CHECK (consultant_id = auth.uid());

    DROP POLICY IF EXISTS "Clients can view own accounting periods" ON accounting_periods;
    CREATE POLICY "Clients can view own accounting periods"
      ON accounting_periods
      FOR SELECT
      TO authenticated
      USING (client_id IN (
        SELECT id FROM clients WHERE profile_id = auth.uid()
      ));
  END IF;
END $$;

-- Fix tax_calculations policies if they exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'tax_calculations') THEN
    DROP POLICY IF EXISTS "Consultants can manage tax calculations" ON tax_calculations;
    CREATE POLICY "Consultants can manage tax calculations"
      ON tax_calculations
      FOR ALL
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM accounting_periods ap 
        WHERE ap.id = tax_calculations.accounting_period_id 
        AND ap.consultant_id = auth.uid()
      ))
      WITH CHECK (EXISTS (
        SELECT 1 FROM accounting_periods ap 
        WHERE ap.id = tax_calculations.accounting_period_id 
        AND ap.consultant_id = auth.uid()
      ));

    DROP POLICY IF EXISTS "Clients can view own tax calculations" ON tax_calculations;
    CREATE POLICY "Clients can view own tax calculations"
      ON tax_calculations
      FOR SELECT
      TO authenticated
      USING (EXISTS (
        SELECT 1 FROM accounting_periods ap 
        JOIN clients c ON ap.client_id = c.id
        WHERE ap.id = tax_calculations.accounting_period_id 
        AND c.profile_id = auth.uid()
      ));
  END IF;
END $$;

-- Fix financial_reports policies if they exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'financial_reports') THEN
    DROP POLICY IF EXISTS "Consultants can manage client financial reports" ON financial_reports;
    CREATE POLICY "Consultants can manage client financial reports"
      ON financial_reports
      FOR ALL
      TO authenticated
      USING (consultant_id = auth.uid())
      WITH CHECK (consultant_id = auth.uid());

    DROP POLICY IF EXISTS "Clients can view own financial reports" ON financial_reports;
    CREATE POLICY "Clients can view own financial reports"
      ON financial_reports
      FOR SELECT
      TO authenticated
      USING (client_id IN (
        SELECT id FROM clients WHERE profile_id = auth.uid()
      ));
  END IF;
END $$;

-- Fix accounting_settings policies if they exist
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'accounting_settings') THEN
    DROP POLICY IF EXISTS "Consultants can manage own accounting settings" ON accounting_settings;
    CREATE POLICY "Consultants can manage own accounting settings"
      ON accounting_settings
      FOR ALL
      TO authenticated
      USING (consultant_id = auth.uid())
      WITH CHECK (consultant_id = auth.uid());
  END IF;
END $$;

-- Create helper function for checking admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_accounting_periods_consultant_period ON accounting_periods(consultant_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_period ON tax_calculations(accounting_period_id);
CREATE INDEX IF NOT EXISTS idx_financial_reports_consultant_period ON financial_reports(consultant_id, period_start DESC);
CREATE INDEX IF NOT EXISTS idx_consultant_performance_period ON consultant_performance_analytics(consultant_id, period_start DESC);

-- Update trigger functions
CREATE OR REPLACE FUNCTION update_accounting_periods_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_financial_reports_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
DROP TRIGGER IF EXISTS update_accounting_periods_updated_at_trigger ON accounting_periods;
CREATE TRIGGER update_accounting_periods_updated_at_trigger
  BEFORE UPDATE ON accounting_periods
  FOR EACH ROW EXECUTE FUNCTION update_accounting_periods_updated_at();

DROP TRIGGER IF EXISTS update_financial_reports_updated_at_trigger ON financial_reports;
CREATE TRIGGER update_financial_reports_updated_at_trigger
  BEFORE UPDATE ON financial_reports
  FOR EACH ROW EXECUTE FUNCTION update_financial_reports_updated_at();

-- Fix any remaining uid() references in existing tables
UPDATE pg_policy SET polcmd = REPLACE(polcmd, 'uid()', 'auth.uid()') WHERE polcmd LIKE '%uid()%';