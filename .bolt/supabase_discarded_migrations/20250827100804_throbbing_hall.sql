/*
  # Drop All Existing Tables and Types

  This migration will completely clean the database by dropping all existing tables, 
  types, policies, and functions to start fresh.

  ## What this does:
  1. Drop all existing tables
  2. Drop all custom types
  3. Drop all policies
  4. Drop all functions
  5. Clean slate for fresh setup
*/

-- Drop all tables if they exist
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS countries CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop all custom types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS document_type CASCADE;
DROP TYPE IF EXISTS transaction_status CASCADE;

-- Drop all functions if they exist
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;

-- Drop all triggers if they exist
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;