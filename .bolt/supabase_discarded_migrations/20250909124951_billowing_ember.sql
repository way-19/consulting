/*
  # Advanced Analytics & Reporting System

  1. New Tables
    - `consultant_performance_analytics` - Real-time consultant metrics
    - `client_interaction_logs` - Detailed interaction tracking
    - `performance_benchmarks` - Industry benchmarks
    - `custom_reports` - User-defined reports
    - `report_schedules` - Automated report generation

  2. Advanced Features
    - Real-time performance tracking
    - Custom report builder
    - Export capabilities
    - Benchmarking system

  3. Security
    - RLS policies for all tables
    - Performance data protection
*/

-- Consultant performance analytics
CREATE TABLE IF NOT EXISTS consultant_performance_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_clients integer DEFAULT 0,
  active_clients integer DEFAULT 0,
  new_clients integer DEFAULT 0,
  churned_clients integer DEFAULT 0,
  total_revenue numeric(12,2) DEFAULT 0,
  commission_earned numeric(12,2) DEFAULT 0,
  avg_order_value numeric(10,2) DEFAULT 0,
  completion_rate numeric(5,2) DEFAULT 0,
  avg_response_time_hours numeric(5,2) DEFAULT 0,
  client_satisfaction_score numeric(5,2) DEFAULT 0,
  messages_sent integer DEFAULT 0,
  messages_received integer DEFAULT 0,
  tasks_completed integer DEFAULT 0,
  meetings_conducted integer DEFAULT 0,
  documents_processed integer DEFAULT 0,
  efficiency_score numeric(5,2) DEFAULT 0,
  growth_rate numeric(5,2) DEFAULT 0,
  rank_among_consultants integer DEFAULT 0,
  calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Detailed interaction tracking
CREATE TABLE IF NOT EXISTS client_interaction_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('message', 'meeting', 'document_upload', 'task_completion', 'payment', 'service_order')),
  interaction_data jsonb DEFAULT '{}',
  duration_seconds integer,
  outcome text,
  satisfaction_rating integer CHECK (satisfaction_rating BETWEEN 1 AND 5),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Performance benchmarks
CREATE TABLE IF NOT EXISTS performance_benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  benchmark_type text NOT NULL CHECK (benchmark_type IN ('consultant_revenue', 'response_time', 'completion_rate', 'client_satisfaction')),
  period_type text NOT NULL DEFAULT 'monthly' CHECK (period_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  percentile_25 numeric(10,2),
  percentile_50 numeric(10,2),
  percentile_75 numeric(10,2),
  percentile_90 numeric(10,2),
  average numeric(10,2),
  best_performer numeric(10,2),
  sample_size integer DEFAULT 0,
  period_start date NOT NULL,
  period_end date NOT NULL,
  calculated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Custom report builder
CREATE TABLE IF NOT EXISTS custom_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  report_name text NOT NULL,
  report_description text,
  report_config jsonb NOT NULL DEFAULT '{}',
  data_sources text[] DEFAULT '{}',
  filters jsonb DEFAULT '{}',
  chart_config jsonb DEFAULT '{}',
  export_format text DEFAULT 'csv' CHECK (export_format IN ('csv', 'pdf', 'excel')),
  is_shared boolean DEFAULT false,
  run_count integer DEFAULT 0,
  last_run_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scheduled reports
CREATE TABLE IF NOT EXISTS report_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  report_id uuid REFERENCES custom_reports(id) ON DELETE CASCADE,
  schedule_name text NOT NULL,
  cron_expression text NOT NULL,
  recipient_emails text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  last_executed_at timestamptz,
  next_execution_at timestamptz,
  execution_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consultant_performance_analytics_consultant_period ON consultant_performance_analytics(consultant_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_client_interaction_logs_client_consultant ON client_interaction_logs(client_id, consultant_id);
CREATE INDEX IF NOT EXISTS idx_performance_benchmarks_type_period ON performance_benchmarks(benchmark_type, period_start);
CREATE INDEX IF NOT EXISTS idx_custom_reports_consultant ON custom_reports(consultant_id);

-- Enable RLS
ALTER TABLE consultant_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_interaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Consultants can view own performance analytics"
  ON consultant_performance_analytics
  FOR SELECT
  TO authenticated
  USING (consultant_id = uid());

CREATE POLICY "Consultants can manage own interaction logs"
  ON client_interaction_logs
  FOR ALL
  TO authenticated
  USING (consultant_id = uid());

CREATE POLICY "Anyone can read performance benchmarks"
  ON performance_benchmarks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Consultants can manage own custom reports"
  ON custom_reports
  FOR ALL
  TO authenticated
  USING (consultant_id = uid());

CREATE POLICY "Consultants can manage own report schedules"
  ON report_schedules
  FOR ALL
  TO authenticated
  USING (consultant_id = uid());

-- Triggers
CREATE TRIGGER update_consultant_performance_analytics_updated_at
  BEFORE UPDATE ON consultant_performance_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_reports_updated_at
  BEFORE UPDATE ON custom_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_schedules_updated_at
  BEFORE UPDATE ON report_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();