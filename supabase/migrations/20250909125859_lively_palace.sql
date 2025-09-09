/*
  # Fix Missing Analytics Tables

  1. New Tables
    - `consultant_performance_analytics` - Real-time consultant metrics
    - `client_interaction_logs` - Detailed interaction tracking
    - `performance_benchmarks` - Industry benchmarks
    - `custom_reports` - Saved report templates

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for consultants and admins
*/

-- Consultant performance analytics
CREATE TABLE IF NOT EXISTS consultant_performance_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_revenue numeric(12,2) DEFAULT 0,
  total_commission numeric(12,2) DEFAULT 0,
  client_count integer DEFAULT 0,
  active_clients integer DEFAULT 0,
  completed_orders integer DEFAULT 0,
  avg_order_value numeric(10,2) DEFAULT 0,
  response_time_hours numeric(5,2) DEFAULT 0,
  client_satisfaction numeric(3,1) DEFAULT 0,
  productivity_score integer DEFAULT 0,
  efficiency_rating text DEFAULT 'good' CHECK (efficiency_rating IN ('exceptional', 'excellent', 'good', 'needs_improvement')),
  industry_rank integer DEFAULT 0,
  growth_rate numeric(5,2) DEFAULT 0,
  benchmark_score numeric(5,2) DEFAULT 0,
  calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Client interaction detailed logs
CREATE TABLE IF NOT EXISTS client_interaction_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('message', 'document_review', 'task_assigned', 'meeting', 'service_delivered')),
  interaction_data jsonb DEFAULT '{}',
  response_time_minutes integer,
  satisfaction_rating integer CHECK (satisfaction_rating BETWEEN 1 AND 5),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Performance benchmarks for industry comparison
CREATE TABLE IF NOT EXISTS performance_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_category text NOT NULL CHECK (metric_category IN ('financial', 'client_management', 'efficiency', 'satisfaction')),
  industry_average numeric(10,2) NOT NULL DEFAULT 0,
  top_quartile numeric(10,2) NOT NULL DEFAULT 0,
  median numeric(10,2) NOT NULL DEFAULT 0,
  bottom_quartile numeric(10,2) NOT NULL DEFAULT 0,
  measurement_unit text DEFAULT 'percentage',
  calculation_method text,
  last_updated timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Custom reports templates
CREATE TABLE IF NOT EXISTS custom_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  report_name text NOT NULL,
  report_description text,
  report_config jsonb NOT NULL DEFAULT '{}',
  last_run_at timestamptz,
  run_count integer DEFAULT 0,
  is_favorite boolean DEFAULT false,
  is_scheduled boolean DEFAULT false,
  schedule_frequency text CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly', 'quarterly')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE consultant_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_interaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultant_performance_analytics
CREATE POLICY "consultant_performance_analytics_read_own"
  ON consultant_performance_analytics
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "consultant_performance_analytics_admin_all"
  ON consultant_performance_analytics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for client_interaction_logs
CREATE POLICY "client_interaction_logs_read_own"
  ON client_interaction_logs
  FOR SELECT
  TO authenticated
  USING (consultant_id = auth.uid());

CREATE POLICY "client_interaction_logs_insert_own"
  ON client_interaction_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "client_interaction_logs_admin_all"
  ON client_interaction_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for performance_benchmarks
CREATE POLICY "performance_benchmarks_read_all"
  ON performance_benchmarks
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "performance_benchmarks_admin_all"
  ON performance_benchmarks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for custom_reports
CREATE POLICY "custom_reports_read_own"
  ON custom_reports
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consultant_performance_analytics_consultant_period 
  ON consultant_performance_analytics(consultant_id, period_end DESC);

CREATE INDEX IF NOT EXISTS idx_client_interaction_logs_consultant_created 
  ON client_interaction_logs(consultant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_performance_benchmarks_category 
  ON performance_benchmarks(metric_category, is_active);

CREATE INDEX IF NOT EXISTS idx_custom_reports_consultant_favorite 
  ON custom_reports(consultant_id, is_favorite);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_consultant_performance_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consultant_performance_analytics_updated_at_trigger
  BEFORE UPDATE ON consultant_performance_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_consultant_performance_analytics_updated_at();

CREATE TRIGGER update_custom_reports_updated_at_trigger
  BEFORE UPDATE ON custom_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();