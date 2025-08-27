/*
  # Fix RLS policies for all tables

  1. Security
    - Drop all existing policies to prevent conflicts
    - Create simple, working RLS policies
    - Enable RLS on all tables

  2. Tables Updated
    - user_profiles: Users can manage their own profiles
    - projects: Clients and consultants can view their projects
    - services: Public services visible, consultants manage their own
    - transactions: Users can view their own transactions
    - documents: Project participants can manage documents
    - countries: Public read access
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Clients can view their own projects" ON projects;
DROP POLICY IF EXISTS "Consultants can view their assigned projects" ON projects;
DROP POLICY IF EXISTS "Consultants can update their assigned projects" ON projects;
DROP POLICY IF EXISTS "Everyone can view public active services" ON services;
DROP POLICY IF EXISTS "Consultants can manage their own services" ON services;
DROP POLICY IF EXISTS "Clients can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Consultants can view their earnings" ON transactions;
DROP POLICY IF EXISTS "Users can view their own uploaded documents" ON documents;
DROP POLICY IF EXISTS "Users can upload their own documents" ON documents;
DROP POLICY IF EXISTS "Project participants can view project documents" ON documents;
DROP POLICY IF EXISTS "Project participants can upload documents" ON documents;
DROP POLICY IF EXISTS "Anyone can view active countries" ON countries;
DROP POLICY IF EXISTS "Consultants can view their assigned countries" ON countries;

-- USER PROFILES
CREATE POLICY "Enable read for own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- COUNTRIES (public read)
CREATE POLICY "Enable read for all users"
  ON countries FOR SELECT
  TO authenticated
  USING (is_active = true);

-- SERVICES (public read for active services, consultants manage own)
CREATE POLICY "Enable read for public services"
  ON services FOR SELECT
  TO authenticated
  USING (is_public = true AND is_active = true);

CREATE POLICY "Enable all for consultant's own services"
  ON services FOR ALL
  TO authenticated
  USING (auth.uid() = consultant_id);

-- PROJECTS (clients and consultants can view their projects)
CREATE POLICY "Enable read for project participants"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = consultant_id);

CREATE POLICY "Enable insert for clients"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Enable update for consultants"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = consultant_id);

-- TRANSACTIONS (users can view their own)
CREATE POLICY "Enable read for transaction participants"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = consultant_id);

-- DOCUMENTS (project participants can manage)
CREATE POLICY "Enable read for document owner"
  ON documents FOR SELECT
  TO authenticated
  USING (auth.uid() = uploader_id);

CREATE POLICY "Enable insert for authenticated users"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploader_id);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;