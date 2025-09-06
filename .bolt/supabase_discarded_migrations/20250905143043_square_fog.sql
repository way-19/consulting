/*
  # Initialize User Profiles and Authentication System

  1. Core User Management
    - `user_profiles` - Extended user information with roles
    - `countries` - Supported countries with i18n
    - `clients` - Client-specific data and consultant assignments

  2. Authentication & Security
    - Enable RLS on all tables
    - Create role-based access policies
    - Set up admin/consultant/client permissions

  3. Helper Functions
    - `is_admin()` - Check if user is admin
    - `update_updated_at_column()` - Auto-update timestamps
    - `handle_new_user()` - Auto-create profile on signup
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin' AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to automatically update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Countries table
CREATE TABLE IF NOT EXISTS countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  code text UNIQUE NOT NULL,
  flag_emoji text NOT NULL,
  description_i18n jsonb DEFAULT '{}',
  capital text,
  language text,
  currency text,
  timezone text,
  is_active boolean DEFAULT true,
  is_recommended boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

-- Public read access to active countries
CREATE POLICY "Allow public read access to countries"
  ON countries FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  display_name text,
  role text NOT NULL DEFAULT 'client',
  country_id uuid REFERENCES countries(id),
  phone text,
  company text,
  avatar_url text,
  preferred_language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  is_active boolean DEFAULT true,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT user_profiles_role_check 
    CHECK (role IN ('admin', 'consultant', 'client')),
  CONSTRAINT user_profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- User profile policies
CREATE POLICY "up_insert_self" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "up_select_self" ON user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "up_update_self" ON user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "up_admin_all_select" ON user_profiles
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "up_select_assigned_consultant" ON user_profiles
  FOR SELECT TO authenticated
  USING (
    role = 'consultant' AND EXISTS (
      SELECT 1 FROM clients c 
      WHERE c.profile_id = auth.uid() AND c.assigned_consultant_id = user_profiles.id
    )
  );

CREATE POLICY "up_select_clients_of_consultant" ON user_profiles
  FOR SELECT TO authenticated
  USING (
    role = 'client' AND EXISTS (
      SELECT 1 FROM clients c 
      WHERE c.assigned_consultant_id = auth.uid() AND c.profile_id = user_profiles.id
    )
  );

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  assigned_consultant_id uuid REFERENCES user_profiles(id),
  company_name text,
  status text DEFAULT 'active',
  priority text DEFAULT 'medium',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT clients_status_check 
    CHECK (status IN ('active', 'inactive', 'pending', 'completed')),
  CONSTRAINT clients_priority_check 
    CHECK (priority IN ('low', 'medium', 'high'))
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Client policies
CREATE POLICY "clients_insert_own" ON clients
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "clients_read_own" ON clients
  FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "clients_update_own" ON clients
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "clients_admin_access" ON clients
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "clients_consultant_read" ON clients
  FOR SELECT TO authenticated
  USING (assigned_consultant_id = auth.uid());

CREATE POLICY "clients_consultant_update" ON clients
  FOR UPDATE TO authenticated
  USING (assigned_consultant_id = auth.uid())
  WITH CHECK (assigned_consultant_id = auth.uid());

-- Triggers
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (
    id, 
    email, 
    full_name, 
    role,
    country_id,
    phone,
    company
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client'),
    CASE 
      WHEN NEW.raw_user_meta_data->>'country_id' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'country_id')::uuid 
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'company'
  );
  
  -- Create client record if role is client
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'client') = 'client' THEN
    INSERT INTO clients (
      profile_id,
      company_name,
      status,
      priority
    )
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'company',
      'active',
      'medium'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_profile_id ON clients(profile_id);
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(email);
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles(role) WHERE is_active = true;

-- Insert sample countries
INSERT INTO countries (name, code, flag_emoji, description_i18n, is_active, is_recommended) VALUES
  ('United States', 'US', '🇺🇸', '{"en": "Leading global business hub", "tr": "Önde gelen küresel iş merkezi"}', true, true),
  ('United Kingdom', 'GB', '🇬🇧', '{"en": "Financial center with global reach", "tr": "Küresel erişimi olan finans merkezi"}', true, true),
  ('Germany', 'DE', '🇩🇪', '{"en": "Europe''s largest economy", "tr": "Avrupa''nın en büyük ekonomisi"}', true, true),
  ('Singapore', 'SG', '🇸🇬', '{"en": "Asian business gateway", "tr": "Asya iş kapısı"}', true, true),
  ('Estonia', 'EE', '🇪🇪', '{"en": "Digital nomad friendly", "tr": "Dijital göçebe dostu"}', true, true),
  ('Georgia', 'GE', '🇬🇪', '{"en": "Low tax jurisdiction", "tr": "Düşük vergi yargı alanı"}', true, true),
  ('Cyprus', 'CY', '🇨🇾', '{"en": "EU member with tax benefits", "tr": "Vergi avantajlı AB üyesi"}', true, false),
  ('Malta', 'MT', '🇲🇹', '{"en": "EU blockchain hub", "tr": "AB blockchain merkezi"}', true, false),
  ('Portugal', 'PT', '🇵🇹', '{"en": "Non-habitual resident program", "tr": "Mukim olmayan program"}', true, false),
  ('Turkey', 'TR', '🇹🇷', '{"en": "Bridge between Europe and Asia", "tr": "Avrupa ve Asya arasında köprü"}', true, false)
ON CONFLICT (code) DO NOTHING;