/*
  # Fix RLS policies for all tables

  1. Security Updates
    - Create proper RLS policies for projects, transactions, and other tables
    - Enable authenticated users to access their own data
    - Fix foreign key relationships in queries

  2. Policy Changes
    - projects: consultants can read their assigned projects, clients can read their projects
    - transactions: participants can read their transactions
    - countries: public read access for active countries
    - services: consultants can manage their services, public can read active services
    - documents: users can manage their own documents
*/

-- Projects table policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for project participants" ON projects;
DROP POLICY IF EXISTS "Enable insert for clients" ON projects;
DROP POLICY IF EXISTS "Enable update for consultants" ON projects;

CREATE POLICY "Enable read for project participants"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = consultant_id);

CREATE POLICY "Enable insert for clients"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Enable update for consultants"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

-- Transactions table policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for transaction participants" ON transactions;

CREATE POLICY "Enable read for transaction participants"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = consultant_id);

-- Countries table policies (public read)
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for all users" ON countries;

CREATE POLICY "Enable read for all users"
  ON countries
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Services table policies
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for consultant's own services" ON services;
DROP POLICY IF EXISTS "Enable read for public services" ON services;

CREATE POLICY "Enable all for consultant's own services"
  ON services
  FOR ALL
  TO authenticated
  USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

CREATE POLICY "Enable read for public services"
  ON services
  FOR SELECT
  TO authenticated
  USING (is_public = true AND is_active = true);

-- Documents table policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for document owner" ON documents;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON documents;

CREATE POLICY "Enable read for document owner"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = uploader_id);

CREATE POLICY "Enable insert for authenticated users"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploader_id);