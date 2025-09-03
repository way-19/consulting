/*
  # Core Database Tables Setup

  1. New Tables
    - `user_profiles` - User profile information with roles
    - `countries` - Supported countries for business formation
    - `clients` - Client records with consultant assignments
    - `custom_services` - Consultant service offerings
    - `service_orders` - Customer orders for services
    - `projects` - Project management between consultants and clients
    - `tasks` - Project tasks and milestones
    - `documents` - Document management
    - `document_requests` - Document requests from consultants
    - `transactions` - Financial transactions
    - `notifications` - System notifications
    - `consultant_country_assignments` - Consultant-country relationships

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each role (admin, consultant, client)

  3. Functions
    - Trigger functions for updated_at timestamps
    - User profile creation trigger
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'consultant', 'client')),
    phone TEXT,
    company TEXT,
    country_id UUID,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Countries Table
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    flag_emoji TEXT,
    description_i18n JSONB DEFAULT '{}',
    business_info JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    assigned_consultant_id UUID REFERENCES user_profiles(id),
    company_name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'completed')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    notes TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    country TEXT,
    industry TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultant Country Assignments Table
CREATE TABLE IF NOT EXISTS consultant_country_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultant_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    specializations TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(consultant_id, country_id)
);

-- Custom Services Table (Consultant Service Offerings)
CREATE TABLE IF NOT EXISTS custom_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultant_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    country_id UUID REFERENCES countries(id),
    title_i18n JSONB NOT NULL DEFAULT '{}',
    description_i18n JSONB NOT NULL DEFAULT '{}',
    features_i18n JSONB DEFAULT '{}',
    category TEXT NOT NULL DEFAULT 'general',
    price NUMERIC(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    billing_type TEXT DEFAULT 'one_time' CHECK (billing_type IN ('one_time', 'monthly', 'quarterly', 'yearly')),
    duration_estimate TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service Orders Table (Customer Orders)
CREATE TABLE IF NOT EXISTS service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID NOT NULL REFERENCES user_profiles(id),
    custom_service_id UUID REFERENCES custom_services(id),
    title TEXT NOT NULL,
    description TEXT,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'in_progress', 'completed', 'cancelled', 'refunded')),
    stripe_session_id TEXT,
    stripe_payment_intent_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID NOT NULL REFERENCES user_profiles(id),
    service_order_id UUID REFERENCES service_orders(id),
    title TEXT NOT NULL,
    description_i18n JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'cancelled', 'intake', 'review')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    budget NUMERIC(10, 2),
    currency TEXT DEFAULT 'USD',
    start_date DATE,
    end_date DATE,
    steps JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id),
    consultant_id UUID NOT NULL REFERENCES user_profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    title_i18n JSONB DEFAULT '{}',
    description_i18n JSONB DEFAULT '{}',
    status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    due_date TIMESTAMP WITH TIME ZONE,
    estimated_hours NUMERIC(5, 2) DEFAULT 0,
    actual_hours NUMERIC(5, 2) DEFAULT 0,
    billable BOOLEAN DEFAULT TRUE,
    is_client_visible BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID REFERENCES user_profiles(id),
    requested_by_consultant_id UUID REFERENCES user_profiles(id),
    name TEXT NOT NULL,
    original_name TEXT,
    type TEXT NOT NULL DEFAULT 'other',
    category TEXT DEFAULT 'other',
    status TEXT DEFAULT 'uploaded' CHECK (status IN ('requested', 'uploaded', 'in_review', 'approved', 'rejected', 'archived')),
    file_url TEXT,
    file_size INTEGER,
    mime_type TEXT,
    is_request BOOLEAN DEFAULT FALSE,
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    version INTEGER DEFAULT 1,
    download_count INTEGER DEFAULT 0,
    uploaded_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Requests Table
CREATE TABLE IF NOT EXISTS document_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    consultant_id UUID NOT NULL REFERENCES user_profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'completed', 'cancelled')),
    document_type TEXT DEFAULT 'other',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id),
    consultant_id UUID NOT NULL REFERENCES user_profiles(id),
    service_order_id UUID REFERENCES service_orders(id),
    gross_amount NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) DEFAULT 0,
    consultant_amount NUMERIC(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    transaction_type TEXT DEFAULT 'payment' CHECK (transaction_type IN ('payment', 'refund', 'chargeback')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    stripe_payment_intent_id TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_profile_id UUID REFERENCES user_profiles(id),
    recipient_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    payload JSONB DEFAULT '{}',
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    country_id UUID REFERENCES countries(id),
    title_i18n JSONB NOT NULL DEFAULT '{}',
    excerpt_i18n JSONB DEFAULT '{}',
    content_i18n JSONB DEFAULT '{}',
    slug TEXT UNIQUE NOT NULL,
    category TEXT DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    featured_image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultant_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    country_id UUID REFERENCES countries(id),
    category TEXT NOT NULL DEFAULT 'general',
    question_i18n JSONB NOT NULL DEFAULT '{}',
    answer_i18n JSONB NOT NULL DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_global BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for countries
ALTER TABLE user_profiles 
ADD CONSTRAINT fk_user_profiles_country 
FOREIGN KEY (country_id) REFERENCES countries(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_clients_consultant ON clients(assigned_consultant_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_custom_services_consultant ON custom_services(consultant_id);
CREATE INDEX IF NOT EXISTS idx_custom_services_country ON custom_services(country_id);
CREATE INDEX IF NOT EXISTS idx_custom_services_active ON custom_services(is_active);
CREATE INDEX IF NOT EXISTS idx_service_orders_client ON service_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_consultant ON service_orders(consultant_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_consultant ON projects(consultant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_consultant ON tasks(consultant_id);
CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_profile_id);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_country_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
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

-- RLS Policies for countries
CREATE POLICY "Countries are publicly readable"
    ON countries FOR SELECT
    TO authenticated, anon
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

-- RLS Policies for clients
CREATE POLICY "Clients can read own data"
    ON clients FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid());

CREATE POLICY "Consultants can read assigned clients"
    ON clients FOR SELECT
    TO authenticated
    USING (assigned_consultant_id = auth.uid());

CREATE POLICY "Admins can read all clients"
    ON clients FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- RLS Policies for custom_services
CREATE POLICY "Custom services are publicly readable when active"
    ON custom_services FOR SELECT
    TO authenticated, anon
    USING (is_active = true);

CREATE POLICY "Consultants can manage own services"
    ON custom_services FOR ALL
    TO authenticated
    USING (consultant_id = auth.uid());

-- RLS Policies for service_orders
CREATE POLICY "Clients can read own orders"
    ON service_orders FOR SELECT
    TO authenticated
    USING (
        client_id IN (
            SELECT id FROM clients WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Consultants can read assigned orders"
    ON service_orders FOR SELECT
    TO authenticated
    USING (consultant_id = auth.uid());

-- RLS Policies for projects
CREATE POLICY "Clients can read own projects"
    ON projects FOR SELECT
    TO authenticated
    USING (
        client_id IN (
            SELECT id FROM clients WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Consultants can manage assigned projects"
    ON projects FOR ALL
    TO authenticated
    USING (consultant_id = auth.uid());

-- RLS Policies for tasks
CREATE POLICY "Clients can read visible tasks"
    ON tasks FOR SELECT
    TO authenticated
    USING (
        is_client_visible = true AND
        client_id IN (
            SELECT id FROM clients WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Consultants can manage own tasks"
    ON tasks FOR ALL
    TO authenticated
    USING (consultant_id = auth.uid());

-- RLS Policies for documents
CREATE POLICY "Clients can manage own documents"
    ON documents FOR ALL
    TO authenticated
    USING (
        client_id IN (
            SELECT id FROM clients WHERE profile_id = auth.uid()
        )
    );

CREATE POLICY "Consultants can manage client documents"
    ON documents FOR ALL
    TO authenticated
    USING (
        consultant_id = auth.uid() OR
        requested_by_consultant_id = auth.uid()
    );

-- RLS Policies for notifications
CREATE POLICY "Users can read own notifications"
    ON notifications FOR SELECT
    TO authenticated
    USING (recipient_profile_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    TO authenticated
    USING (recipient_profile_id = auth.uid());

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_countries_updated_at
    BEFORE UPDATE ON countries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultant_country_assignments_updated_at
    BEFORE UPDATE ON consultant_country_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_services_updated_at
    BEFORE UPDATE ON custom_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at
    BEFORE UPDATE ON service_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_requests_updated_at
    BEFORE UPDATE ON document_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
    BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'client')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();