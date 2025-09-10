/*
  # Client Segmentation System

  1. New Tables
    - `client_tags` - Custom tags for clients
    - `client_segments` - Smart segments and groups
    - `client_tag_assignments` - Many-to-many relationship

  2. Security
    - Enable RLS on all new tables
    - Consultants can only manage their own client tags

  3. Features
    - Custom tagging system
    - Performance-based auto-segments
    - Bulk operations support
*/

-- Client Tags table
CREATE TABLE IF NOT EXISTS client_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '#3B82F6',
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(consultant_id, name)
);

-- Client Segments table  
CREATE TABLE IF NOT EXISTS client_segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  criteria jsonb DEFAULT '{}',
  is_smart boolean DEFAULT false, -- Auto-generated vs manual
  color text DEFAULT '#6B7280',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(consultant_id, name)
);

-- Client Tag Assignments (many-to-many)
CREATE TABLE IF NOT EXISTS client_tag_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES client_tags(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(client_id, tag_id)
);

-- Client Performance Metrics (for smart segments)
CREATE TABLE IF NOT EXISTS client_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  consultant_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Activity metrics
  total_orders integer DEFAULT 0,
  completed_orders integer DEFAULT 0,
  total_revenue numeric(10,2) DEFAULT 0,
  avg_order_value numeric(10,2) DEFAULT 0,
  
  -- Communication metrics
  messages_sent integer DEFAULT 0,
  messages_received integer DEFAULT 0,
  avg_response_time_hours numeric(5,2) DEFAULT 0,
  
  -- Engagement metrics  
  tasks_completed integer DEFAULT 0,
  documents_uploaded integer DEFAULT 0,
  meetings_attended integer DEFAULT 0,
  last_activity_date timestamptz,
  
  -- Performance scores (0-100)
  communication_score integer DEFAULT 50,
  payment_score integer DEFAULT 50,
  engagement_score integer DEFAULT 50,
  overall_score integer DEFAULT 50,
  
  -- Calculated at
  calculated_at timestamptz DEFAULT now(),
  
  UNIQUE(client_id, consultant_id)
);

-- Enable RLS
ALTER TABLE client_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_tags
CREATE POLICY "Consultants can manage own tags"
  ON client_tags
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for client_segments  
CREATE POLICY "Consultants can manage own segments"
  ON client_segments
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- RLS Policies for client_tag_assignments
CREATE POLICY "Consultants can manage client tags for their clients"
  ON client_tag_assignments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = client_tag_assignments.client_id 
    AND clients.assigned_consultant_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = client_tag_assignments.client_id 
    AND clients.assigned_consultant_id = auth.uid()
  ));

-- RLS Policies for client_performance_metrics
CREATE POLICY "Consultants can view own client metrics"
  ON client_performance_metrics
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_tags_consultant ON client_tags(consultant_id);
CREATE INDEX IF NOT EXISTS idx_client_segments_consultant ON client_segments(consultant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_client_tag_assignments_client ON client_tag_assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_client_tag_assignments_tag ON client_tag_assignments(tag_id);
CREATE INDEX IF NOT EXISTS idx_client_performance_metrics_scores ON client_performance_metrics(overall_score DESC, engagement_score DESC);
CREATE INDEX IF NOT EXISTS idx_client_performance_metrics_activity ON client_performance_metrics(last_activity_date DESC);

-- Triggers for updated_at
CREATE TRIGGER update_client_tags_updated_at
  BEFORE UPDATE ON client_tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_segments_updated_at
  BEFORE UPDATE ON client_segments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default segments for existing consultants
INSERT INTO client_segments (consultant_id, name, description, criteria, is_smart, color, sort_order)
SELECT 
  id as consultant_id,
  'High Value Clients' as name,
  'Clients with high revenue and engagement' as description,
  '{"min_revenue": 5000, "min_engagement_score": 70}' as criteria,
  true as is_smart,
  '#10B981' as color,
  1 as sort_order
FROM user_profiles 
WHERE role = 'consultant' AND is_active = true
ON CONFLICT (consultant_id, name) DO NOTHING;

INSERT INTO client_segments (consultant_id, name, description, criteria, is_smart, color, sort_order)
SELECT 
  id as consultant_id,
  'Active Communicators' as name,
  'Clients who message frequently' as description,
  '{"min_messages": 10, "max_response_time": 24}' as criteria,
  true as is_smart,
  '#3B82F6' as color,
  2 as sort_order
FROM user_profiles 
WHERE role = 'consultant' AND is_active = true
ON CONFLICT (consultant_id, name) DO NOTHING;

INSERT INTO client_segments (consultant_id, name, description, criteria, is_smart, color, sort_order)
SELECT 
  id as consultant_id,
  'Need Attention' as name,
  'Clients requiring follow-up' as description,
  '{"max_last_activity_days": 7, "min_pending_tasks": 1}' as criteria,
  true as is_smart,
  '#F59E0B' as color,
  3 as sort_order
FROM user_profiles 
WHERE role = 'consultant' AND is_active = true
ON CONFLICT (consultant_id, name) DO NOTHING;

-- Insert default tags
INSERT INTO client_tags (consultant_id, name, color, description)
SELECT 
  id as consultant_id,
  'VIP' as name,
  '#8B5CF6' as color,
  'High priority clients' as description
FROM user_profiles 
WHERE role = 'consultant' AND is_active = true
ON CONFLICT (consultant_id, name) DO NOTHING;

INSERT INTO client_tags (consultant_id, name, color, description)
SELECT 
  id as consultant_id,
  'New Client' as name,
  '#06B6D4' as color,
  'Recently onboarded clients' as description
FROM user_profiles 
WHERE role = 'consultant' AND is_active = true
ON CONFLICT (consultant_id, name) DO NOTHING;