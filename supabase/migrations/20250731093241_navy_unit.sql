/*
  # Admin Dashboard Views and Analytics

  1. Admin Views
    - `admin_overview` - Global metrics overview
    - `consultant_performance_analytics` - Consultant performance data
    - `revenue_analytics` - Revenue breakdown by source
    - `ai_safety_analytics` - AI interaction safety metrics

  2. Security
    - Enable RLS on all admin views
    - Add admin-only access policies
*/

-- Admin Dashboard Overview View
CREATE OR REPLACE VIEW admin_overview AS
SELECT 
  (SELECT COUNT(*) FROM legacy_order_integrations WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_legacy_orders,
  (SELECT COUNT(*) FROM applications WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_new_applications,
  (SELECT COUNT(*) FROM users WHERE role = 'consultant' AND status = true) as active_consultants,
  (SELECT COUNT(*) FROM users WHERE role = 'client') as total_clients,
  (SELECT COALESCE(SUM(consultant_commission), 0) FROM consultant_commission_ledger WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_consultant_commissions,
  (SELECT COALESCE(SUM(platform_commission), 0) FROM consultant_commission_ledger WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_platform_revenue,
  (SELECT COUNT(*) FROM ai_interactions WHERE created_at >= CURRENT_DATE - INTERVAL '24 hours' AND risk_level = 'high') as high_risk_ai_interactions,
  (SELECT COUNT(*) FROM service_payment_requests WHERE status = 'pending') as pending_payment_requests;

-- Consultant Performance Analytics View
CREATE OR REPLACE VIEW consultant_performance_analytics AS
SELECT 
  u.id,
  u.first_name,
  u.last_name,
  u.country_id,
  c.name as country_name,
  c.flag_emoji,
  u.performance_rating,
  u.commission_rate,
  (SELECT COUNT(*) FROM legacy_order_integrations WHERE assigned_consultant_id = u.id) as legacy_orders_handled,
  (SELECT COUNT(*) FROM applications WHERE consultant_id = u.id) as platform_applications,
  (SELECT COUNT(*) FROM consultant_custom_services WHERE consultant_id = u.id AND active = true) as active_custom_services,
  (SELECT COALESCE(SUM(consultant_commission), 0) FROM consultant_commission_ledger WHERE consultant_id = u.id) as total_earnings,
  (SELECT COALESCE(AVG(client_satisfaction_rating), 0) FROM applications WHERE consultant_id = u.id AND client_satisfaction_rating IS NOT NULL) as avg_satisfaction,
  (SELECT COUNT(*) FROM ai_interactions WHERE consultant_id = u.id AND created_at >= CURRENT_DATE - INTERVAL '30 days') as monthly_ai_interactions,
  u.created_at,
  u.status
FROM users u
LEFT JOIN countries c ON u.country_id = c.id
WHERE u.role = 'consultant';

-- Revenue Analytics View
CREATE OR REPLACE VIEW revenue_analytics AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  revenue_source,
  COUNT(*) as transaction_count,
  COALESCE(SUM(total_amount), 0) as total_revenue,
  COALESCE(SUM(platform_commission), 0) as platform_commission,
  COALESCE(SUM(consultant_commission), 0) as consultant_commission
FROM consultant_commission_ledger
GROUP BY DATE_TRUNC('month', created_at), revenue_source
ORDER BY month DESC;

-- AI Safety Analytics View
CREATE OR REPLACE VIEW ai_safety_analytics AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  risk_level,
  COUNT(*) as interaction_count,
  COALESCE(AVG(confidence_score), 0) as avg_confidence,
  COUNT(CASE WHEN human_review_required = true THEN 1 END) as human_review_required,
  COUNT(CASE WHEN legal_review_required = true THEN 1 END) as legal_review_required,
  COUNT(CASE WHEN emergency_stopped = true THEN 1 END) as emergency_stops
FROM ai_interactions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at), risk_level
ORDER BY date DESC;

-- AI Emergency Stops Table
CREATE TABLE IF NOT EXISTS ai_emergency_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id),
  reason TEXT NOT NULL,
  system_status VARCHAR(20) DEFAULT 'stopped',
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Monitoring Alerts Table
CREATE TABLE IF NOT EXISTS ai_monitoring_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  message TEXT NOT NULL,
  interaction_id UUID REFERENCES ai_interactions(id),
  acknowledged_at TIMESTAMP,
  acknowledged_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on admin views
ALTER TABLE ai_emergency_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_monitoring_alerts ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies
CREATE POLICY "Admins can manage emergency stops"
  ON ai_emergency_stops
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage monitoring alerts"
  ON ai_monitoring_alerts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );