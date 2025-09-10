/*
  # Mass Communication System

  1. New Tables
    - `message_templates` - Predefined message templates with variables
    - `message_campaigns` - Track mass messaging campaigns
    - `message_delivery_logs` - Track message delivery status

  2. Features
    - Template management with variables
    - Campaign tracking and analytics
    - Delivery status monitoring
    - A/B testing support

  3. Security
    - Enable RLS on all tables
    - Consultants can only manage their own templates/campaigns
*/

CREATE TABLE IF NOT EXISTS message_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  variables jsonb DEFAULT '[]'::jsonb,
  category text DEFAULT 'general'::text,
  language_code text DEFAULT 'en'::text NOT NULL,
  usage_count integer DEFAULT 0,
  last_used_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS message_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  template_id uuid REFERENCES message_templates(id) ON DELETE SET NULL,
  target_criteria jsonb DEFAULT '{}'::jsonb,
  recipient_count integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  delivered_count integer DEFAULT 0,
  read_count integer DEFAULT 0,
  status text DEFAULT 'draft'::text CHECK (status IN ('draft', 'sending', 'sent', 'paused', 'cancelled')),
  priority text DEFAULT 'medium'::text CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  send_email boolean DEFAULT true,
  send_sms boolean DEFAULT false,
  auto_translate boolean DEFAULT true,
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS message_delivery_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES message_campaigns(id) ON DELETE CASCADE NOT NULL,
  recipient_profile_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  delivery_status text DEFAULT 'pending'::text CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'read', 'failed', 'bounced')),
  delivery_channel text DEFAULT 'platform'::text CHECK (delivery_channel IN ('platform', 'email', 'sms')),
  error_message text,
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_delivery_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Consultants can manage own templates"
  ON message_templates
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Consultants can manage own campaigns"
  ON message_campaigns
  FOR ALL
  TO authenticated
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

CREATE POLICY "Consultants can view own delivery logs"
  ON message_delivery_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM message_campaigns mc 
    WHERE mc.id = message_delivery_logs.campaign_id 
    AND mc.consultant_id = auth.uid()
  ));

-- Indexes for performance
CREATE INDEX idx_message_templates_consultant_category ON message_templates(consultant_id, category);
CREATE INDEX idx_message_templates_language ON message_templates(language_code);
CREATE INDEX idx_message_campaigns_consultant_status ON message_campaigns(consultant_id, status);
CREATE INDEX idx_message_campaigns_scheduled ON message_campaigns(scheduled_at) WHERE status = 'draft';
CREATE INDEX idx_delivery_logs_campaign_status ON message_delivery_logs(campaign_id, delivery_status);
CREATE INDEX idx_delivery_logs_recipient_channel ON message_delivery_logs(recipient_profile_id, delivery_channel);

-- Update triggers
CREATE TRIGGER update_message_templates_updated_at
    BEFORE UPDATE ON message_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_campaigns_updated_at
    BEFORE UPDATE ON message_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();