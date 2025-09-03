/*
  # Safe Database Cleanup

  This migration safely drops all existing tables and types by checking if they exist first.
  It will not throw errors if tables don't exist.

  1. Drop Tables (if they exist)
  2. Drop Custom Types (if they exist)  
  3. Drop Functions (if they exist)
*/

-- Drop tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop custom types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;

-- Drop functions if they exist
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;

-- Drop triggers if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;

-- Clean up any remaining policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Everyone can read countries" ON countries;
DROP POLICY IF EXISTS "Admins can manage countries" ON countries;
DROP POLICY IF EXISTS "Clients can read own projects" ON projects;
DROP POLICY IF EXISTS "Consultants can read assigned projects" ON projects;
DROP POLICY IF EXISTS "Admins can read all projects" ON projects;
DROP POLICY IF EXISTS "Consultants can manage own services" ON services;
DROP POLICY IF EXISTS "Everyone can read public services" ON services;
DROP POLICY IF EXISTS "Admins can read all services" ON services;
DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
DROP POLICY IF EXISTS "Consultants can read own transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can read all transactions" ON transactions;
DROP POLICY IF EXISTS "Project participants can read documents" ON documents;
DROP POLICY IF EXISTS "Project participants can upload documents" ON documents;
DROP POLICY IF EXISTS "Admins can manage all documents" ON documents;

-- Disable RLS on any remaining tables
ALTER TABLE IF EXISTS user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS documents DISABLE ROW LEVEL SECURITY;