/*
  # Complete Consulting19 Database Schema

  This migration creates the complete database schema for the Consulting19 platform
  with all necessary tables, types, functions, triggers, and RLS policies.

  ## Tables Created:
  1. user_profiles - User information and roles
  2. countries - Available countries for business formation
  3. projects - Client-consultant projects
  4. services - Services offered by consultants
  5. transactions - Payment and commission tracking
  6. documents - Secure document storage

  ## Security:
  - Row Level Security (RLS) enabled on all tables
  - Role-based access policies
  - Secure document access
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'client', 'consultant');
CREATE TYPE project_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE document_type AS ENUM ('identity', 'business', 'financial', 'legal', 'other');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'client',
    country TEXT,
    language TEXT DEFAULT 'en',
    phone TEXT,
    company TEXT,
    bio TEXT,
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create countries table
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    flag_emoji TEXT NOT NULL,
    description TEXT NOT NULL,
    tax_rate DECIMAL(5,2),
    business_advantages TEXT[] DEFAULT '{}',
    consultant_id UUID REFERENCES user_profiles(id),
    featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    consultant_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES countries(id),
    title TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'pending',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    total_amount DECIMAL(10,2),
    platform_commission DECIMAL(10,2),
    consultant_earnings DECIMAL(10,2),
    due_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultant_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    country_id UUID REFERENCES countries(id),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2),
    is_recurring BOOLEAN DEFAULT false,
    billing_period TEXT,
    is_public BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    service_id UUID REFERENCES services(id),
    client_id UUID NOT NULL REFERENCES user_profiles(id),
    consultant_id UUID NOT NULL REFERENCES user_profiles(id),
    amount DECIMAL(10,2) NOT NULL,
    platform_commission DECIMAL(10,2) NOT NULL,
    consultant_earnings DECIMAL(10,2) NOT NULL,
    status transaction_status DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    uploader_id UUID NOT NULL REFERENCES user_profiles(id),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type TEXT,
    document_type document_type DEFAULT 'other',
    description TEXT,
    is_confidential BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can read own profile"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Consultants can read client profiles in their projects"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM projects
            WHERE consultant_id = auth.uid() AND client_id = user_profiles.id
        )
    );

-- Countries Policies
CREATE POLICY "Anyone can read active countries"
    ON countries FOR SELECT
    TO authenticated
    USING (is_active = true);

CREATE POLICY "Admins can manage countries"
    ON countries FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Projects Policies
CREATE POLICY "Clients can read own projects"
    ON projects FOR SELECT
    TO authenticated
    USING (client_id = auth.uid());

CREATE POLICY "Consultants can read assigned projects"
    ON projects FOR SELECT
    TO authenticated
    USING (consultant_id = auth.uid());

CREATE POLICY "Clients can create projects"
    ON projects FOR INSERT
    TO authenticated
    WITH CHECK (client_id = auth.uid());

CREATE POLICY "Consultants can update assigned projects"
    ON projects FOR UPDATE
    TO authenticated
    USING (consultant_id = auth.uid());

CREATE POLICY "Admins can read all projects"
    ON projects FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Services Policies
CREATE POLICY "Anyone can read public services"
    ON services FOR SELECT
    TO authenticated
    USING (is_public = true AND is_active = true);

CREATE POLICY "Consultants can manage own services"
    ON services FOR ALL
    TO authenticated
    USING (consultant_id = auth.uid());

CREATE POLICY "Admins can read all services"
    ON services FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Transactions Policies
CREATE POLICY "Clients can read own transactions"
    ON transactions FOR SELECT
    TO authenticated
    USING (client_id = auth.uid());

CREATE POLICY "Consultants can read own transactions"
    ON transactions FOR SELECT
    TO authenticated
    USING (consultant_id = auth.uid());

CREATE POLICY "Admins can read all transactions"
    ON transactions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Documents Policies
CREATE POLICY "Project participants can read project documents"
    ON documents FOR SELECT
    TO authenticated
    USING (
        project_id IS NULL OR
        EXISTS (
            SELECT 1 FROM projects
            WHERE id = documents.project_id
            AND (client_id = auth.uid() OR consultant_id = auth.uid())
        )
    );

CREATE POLICY "Users can upload documents"
    ON documents FOR INSERT
    TO authenticated
    WITH CHECK (uploader_id = auth.uid());

CREATE POLICY "Admins can read all documents"
    ON documents FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'client')::user_role
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();