/*
  # Fix All uid() References to auth.uid()

  This migration fixes all RLS policies that incorrectly use uid() instead of auth.uid().
  
  1. Countries Table
     - Drop existing policies
     - Create new policies with correct auth.uid() syntax
  
  2. Services Table  
     - Drop existing policies
     - Create new policies with correct auth.uid() syntax
  
  3. User Profiles Table
     - Drop existing policies
     - Create new policies with correct auth.uid() syntax
*/

-- Fix Countries Table Policies
DROP POLICY IF EXISTS "Allow anonymous read for active countries" ON countries;
DROP POLICY IF EXISTS "Allow authenticated read for all countries" ON countries;
DROP POLICY IF EXISTS "Allow public read for active countries" ON countries;
DROP POLICY IF EXISTS "Enable authenticated read for countries" ON countries;
DROP POLICY IF EXISTS "Enable public read for active countries" ON countries;
DROP POLICY IF EXISTS "Enable public read for countries" ON countries;

-- Create correct policies for countries table
CREATE POLICY "Enable public read for active countries"
  ON countries
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Fix Services Table Policies  
DROP POLICY IF EXISTS "Enable all for consultant's own services" ON services;
DROP POLICY IF EXISTS "Enable public read for active services" ON services;
DROP POLICY IF EXISTS "Enable read for public services" ON services;

-- Create correct policies for services table
CREATE POLICY "Enable public read for active services"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true AND is_active = true);

CREATE POLICY "Enable all for consultant's own services"
  ON services
  FOR ALL
  TO authenticated
  USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

-- Fix User Profiles Table Policies
DROP POLICY IF EXISTS "Allow authenticated read for consultant profiles" ON user_profiles;
DROP POLICY IF EXISTS "Enable public read for consultant profiles" ON user_profiles;
DROP POLICY IF EXISTS "users_insert_own" ON user_profiles;
DROP POLICY IF EXISTS "users_select_own" ON user_profiles;
DROP POLICY IF EXISTS "users_update_own" ON user_profiles;

-- Create correct policies for user_profiles table
CREATE POLICY "Enable public read for consultant profiles"
  ON user_profiles
  FOR SELECT
  TO anon, authenticated
  USING (role = 'consultant'::user_role AND is_active = true);

CREATE POLICY "users_select_own"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_insert_own"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Fix Projects Table Policies (if they exist with uid() errors)
DROP POLICY IF EXISTS "Enable insert for clients" ON projects;
DROP POLICY IF EXISTS "Enable read for project participants" ON projects;
DROP POLICY IF EXISTS "Enable update for consultants" ON projects;
DROP POLICY IF EXISTS "client can select own projects" ON projects;
DROP POLICY IF EXISTS "consultant can select own projects" ON projects;

-- Create correct policies for projects table
CREATE POLICY "Enable insert for clients"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Enable read for project participants"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = consultant_id);

CREATE POLICY "Enable update for consultants"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = consultant_id)
  WITH CHECK (auth.uid() = consultant_id);

-- Fix Transactions Table Policies (if they exist with uid() errors)
DROP POLICY IF EXISTS "Enable read for transaction participants" ON transactions;
DROP POLICY IF EXISTS "client sees own transactions" ON transactions;
DROP POLICY IF EXISTS "consultant sees own transactions" ON transactions;

-- Create correct policies for transactions table
CREATE POLICY "Enable read for transaction participants"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = consultant_id);

-- Fix Documents Table Policies (if they exist with uid() errors)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON documents;
DROP POLICY IF EXISTS "Enable read for document owner" ON documents;

-- Create correct policies for documents table
CREATE POLICY "Enable insert for authenticated users"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploader_id);

CREATE POLICY "Enable read for document owner"
  ON documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = uploader_id);