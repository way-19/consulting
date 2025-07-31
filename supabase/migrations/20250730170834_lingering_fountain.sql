-- CONSULTING19.COM Complete Database Schema
-- Production-ready PostgreSQL schema for Supabase

-- Countries (7 Initial Strategic Jurisdictions)
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  flag_emoji VARCHAR(10),
  description TEXT,
  advantages JSONB DEFAULT '[]',
  primary_language VARCHAR(5) DEFAULT 'en',
  supported_languages JSONB DEFAULT '["en"]',
  auto_language_detection BOOLEAN DEFAULT true,
  legacy_form_integration BOOLEAN DEFAULT true,
  consultant_auto_assignment BOOLEAN DEFAULT true,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users (Unified table for all roles: admin, consultant, client, legal_reviewer)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) CHECK (role IN ('admin', 'consultant', 'client', 'legal_reviewer')) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  country_id INTEGER REFERENCES countries(id),
  language VARCHAR(5) DEFAULT 'en',
  auto_language_detection BOOLEAN DEFAULT true,
  country_language_preferences JSONB DEFAULT '{}',
  consultant_specialties JSONB DEFAULT '[]',
  commission_rate DECIMAL(5,2) DEFAULT 65.00,
  legacy_customer_access BOOLEAN DEFAULT true,
  custom_service_creation_enabled BOOLEAN DEFAULT true,
  performance_rating DECIMAL(3,2) DEFAULT 0,
  total_clients_served INTEGER DEFAULT 0,
  status BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Legacy Order Integration System
CREATE TABLE IF NOT EXISTS legacy_order_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_payment_id INTEGER NOT NULL,
  consulting19_application_id UUID,
  source_country_slug VARCHAR(50),
  assigned_consultant_id UUID REFERENCES users(id),
  assignment_date TIMESTAMP,
  commission_calculated BOOLEAN DEFAULT false,
  platform_commission DECIMAL(10,2),
  consultant_commission DECIMAL(10,2),
  integration_status VARCHAR(20) DEFAULT 'pending',
  customer_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Consultant Custom Services System
CREATE TABLE IF NOT EXISTS consultant_custom_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES users(id) NOT NULL,
  service_name VARCHAR(200) NOT NULL,
  service_description TEXT,
  service_category VARCHAR(50),
  price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES users(id),
  approval_date TIMESTAMP,
  active BOOLEAN DEFAULT true,
  legacy_customer_eligible BOOLEAN DEFAULT true,
  recurring_service BOOLEAN DEFAULT false,
  recurring_interval VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Service Payment Requests System
CREATE TABLE IF NOT EXISTS service_payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES users(id) NOT NULL,
  client_id UUID REFERENCES users(id),
  service_id UUID REFERENCES consultant_custom_services(id),
  legacy_client_reference INTEGER,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  description TEXT,
  invoice_number VARCHAR(50) UNIQUE,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  commission_status VARCHAR(20) DEFAULT 'pending',
  platform_commission DECIMAL(10,2),
  consultant_commission DECIMAL(10,2),
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Comprehensive Commission Tracking System
CREATE TABLE IF NOT EXISTS consultant_commission_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES users(id) NOT NULL,
  revenue_source VARCHAR(50) NOT NULL,
  source_reference_id VARCHAR(100),
  client_reference VARCHAR(100),
  total_amount DECIMAL(12,2) NOT NULL,
  platform_commission DECIMAL(12,2),
  consultant_commission DECIMAL(12,2),
  commission_rate DECIMAL(5,2) DEFAULT 65.00,
  payout_status VARCHAR(20) DEFAULT 'pending',
  payout_date DATE,
  tax_period VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Interactions and Safety System
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID,
  user_id UUID REFERENCES users(id),
  consultant_id UUID REFERENCES users(id),
  ai_query TEXT NOT NULL,
  ai_response TEXT,
  interaction_language VARCHAR(5) DEFAULT 'en',
  translated_response JSONB,
  confidence_score DECIMAL(3,2),
  risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  human_review_required BOOLEAN DEFAULT false,
  human_reviewed BOOLEAN DEFAULT false,
  legal_review_required BOOLEAN DEFAULT false,
  legal_reviewed BOOLEAN DEFAULT false,
  legal_reviewer_id UUID REFERENCES users(id),
  consultant_approval BOOLEAN,
  consultant_notes TEXT,
  legal_notes TEXT,
  client_satisfaction INTEGER,
  emergency_stopped BOOLEAN DEFAULT false,
  legacy_customer_context JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI Legal Review System
CREATE TABLE IF NOT EXISTS ai_legal_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interaction_id UUID REFERENCES ai_interactions(id),
  legal_reviewer_id UUID REFERENCES users(id),
  review_status VARCHAR(20) CHECK (review_status IN ('pending', 'approved', 'rejected', 'requires_modification')),
  review_notes TEXT,
  modified_response TEXT,
  review_duration_minutes INTEGER,
  priority_level VARCHAR(10) CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
  legacy_customer_special_handling BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

-- Country-Language Mapping System
CREATE TABLE IF NOT EXISTS country_language_mappings (
  id SERIAL PRIMARY KEY,
  country_id INTEGER REFERENCES countries(id),
  language_code VARCHAR(5),
  priority INTEGER DEFAULT 1,
  auto_switch_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Language Sessions for Smart Detection
CREATE TABLE IF NOT EXISTS user_language_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  detected_language VARCHAR(5),
  browser_language VARCHAR(5),
  country_context VARCHAR(50),
  final_language VARCHAR(5),
  auto_switched BOOLEAN DEFAULT false,
  user_confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Applications/Orders System
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id) NOT NULL,
  consultant_id UUID REFERENCES users(id),
  service_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  client_preferred_language VARCHAR(5) DEFAULT 'en',
  application_data JSONB,
  source_type VARCHAR(30) DEFAULT 'platform',
  ai_success_prediction DECIMAL(5,2),
  legacy_payment_reference INTEGER,
  source_country_page VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents System
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id),
  legacy_payment_id INTEGER,
  filename VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  uploaded_by UUID REFERENCES users(id),
  document_source VARCHAR(20) DEFAULT 'platform',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages System
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id),
  legacy_payment_id INTEGER,
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  message_language VARCHAR(5) DEFAULT 'en',
  translated_message JSONB,
  message_type VARCHAR(20) DEFAULT 'general',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced Payments System
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id),
  legacy_payment_reference INTEGER,
  service_payment_request_id UUID REFERENCES service_payment_requests(id),
  stripe_payment_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_type VARCHAR(30) DEFAULT 'application',
  status VARCHAR(20) DEFAULT 'pending',
  commission_calculated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Referral System
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id),
  referred_id UUID REFERENCES users(id),
  referrer_type VARCHAR(20),
  referral_code VARCHAR(50) UNIQUE,
  referral_source VARCHAR(30),
  conversion_date TIMESTAMP,
  reward_amount DECIMAL(10,2),
  reward_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Case Studies and Success Stories
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES users(id),
  consultant_id UUID REFERENCES users(id),
  country_id INTEGER REFERENCES countries(id),
  title VARCHAR(255),
  description TEXT,
  success_metrics JSONB,
  testimonial TEXT,
  client_consent BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  source_type VARCHAR(30) DEFAULT 'platform',
  legacy_order_reference INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SEO Management System
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type VARCHAR(50),
  country_id INTEGER REFERENCES countries(id),
  language VARCHAR(5) DEFAULT 'en',
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  keywords JSONB,
  schema_markup JSONB,
  canonical_url VARCHAR(255),
  hreflang_settings JSONB,
  legacy_integration_optimized BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Monthly Consultant Payouts
CREATE TABLE IF NOT EXISTS consultant_monthly_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES users(id),
  payout_period VARCHAR(7),
  legacy_order_commission DECIMAL(12,2) DEFAULT 0,
  custom_service_commission DECIMAL(12,2) DEFAULT 0,
  platform_application_commission DECIMAL(12,2) DEFAULT 0,
  referral_bonus DECIMAL(12,2) DEFAULT 0,
  performance_bonus DECIMAL(12,2) DEFAULT 0,
  total_gross_payout DECIMAL(12,2),
  tax_withholding DECIMAL(12,2),
  total_net_payout DECIMAL(12,2),
  payout_method VARCHAR(50),
  payout_reference VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending',
  processed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert 7 Strategic Countries
INSERT INTO countries (name, slug, flag_emoji, description, advantages, primary_language, supported_languages, legacy_form_integration, consultant_auto_assignment) VALUES 
('Georgia', 'georgia', '🇬🇪', 'Easy company formation and tax advantages with dedicated consultant support', '["0% Tax on Foreign Income", "Fast 1-Day Registration", "International Banking Access", "Visa-Free EU Travel"]', 'en', '["en", "tr"]', true, true),
('United States', 'usa', '🇺🇸', 'Delaware LLC formation and global market access with expert guidance', '["Global Market Access", "USD Banking", "International Recognition", "Investment Protection"]', 'en', '["en"]', true, true),
('Montenegro', 'montenegro', '🇲🇪', 'EU candidacy and investment opportunities with professional support', '["EU Candidate Status", "Low Tax Rates", "Adriatic Coast Access", "Investment Incentives"]', 'en', '["en", "sr"]', true, true),
('Estonia', 'estonia', '🇪🇪', 'e-Residency and digital nomad friendly with AI-enhanced consulting', '["Digital Nomad Paradise", "e-Residency Program", "EU Membership", "Tech-Friendly Environment"]', 'en', '["en", "et"]', true, true),
('Portugal', 'portugal', '🇵🇹', 'Golden Visa and EU membership with multilingual consultant support', '["EU Golden Visa Gateway", "D7 Visa for Nomads", "NHR Tax Program", "Atlantic Coast Lifestyle"]', 'pt', '["pt", "en"]', true, true),
('Malta', 'malta', '🇲🇹', 'EU membership and tax optimization with expert consultation', '["EU Tax Optimization Hub", "Global Business License", "Mediterranean Lifestyle", "Investment Migration"]', 'en', '["en"]', true, true),
('Panama', 'panama', '🇵🇦', 'Offshore structures and global finance hub with dedicated support', '["Offshore Finance Hub", "Friendly Nations Visa", "No Tax on Foreign Income", "Strategic Location"]', 'es', '["es", "en"]', true, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert country-language mappings
INSERT INTO country_language_mappings (country_id, language_code, priority, auto_switch_enabled) VALUES
(1, 'en', 1, true), (1, 'tr', 2, true),
(2, 'en', 1, true),
(3, 'en', 1, true), (3, 'sr', 2, false),
(4, 'en', 1, true), (4, 'et', 2, false),
(5, 'pt', 1, true), (5, 'en', 2, true),
(6, 'en', 1, true),
(7, 'es', 1, true), (7, 'en', 2, true)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_order_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_custom_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_commission_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Countries are publicly readable" ON countries FOR SELECT USING (true);
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Consultants can read own integrations" ON legacy_order_integrations FOR SELECT USING (assigned_consultant_id = auth.uid());
CREATE POLICY "Consultants can manage own services" ON consultant_custom_services FOR ALL USING (consultant_id = auth.uid());
CREATE POLICY "Consultants can manage own payment requests" ON service_payment_requests FOR ALL USING (consultant_id = auth.uid());
CREATE POLICY "Consultants can read own commission data" ON consultant_commission_ledger FOR SELECT USING (consultant_id = auth.uid());
CREATE POLICY "Users can read own AI interactions" ON ai_interactions FOR SELECT USING (user_id = auth.uid() OR consultant_id = auth.uid());
CREATE POLICY "Users can read own applications" ON applications FOR SELECT USING (client_id = auth.uid() OR consultant_id = auth.uid());
CREATE POLICY "Users can read own documents" ON documents FOR SELECT USING (uploaded_by = auth.uid());
CREATE POLICY "Users can read own messages" ON messages FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Users can read own payments" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM applications WHERE applications.id = payments.application_id AND (applications.client_id = auth.uid() OR applications.consultant_id = auth.uid())));