/*
  # Fix User Profiles Table Constraints

  1. Drop and recreate user_profiles table with proper constraints
  2. Add unique constraints for id and email
  3. Fix the trigger function to handle conflicts properly
  4. Update RLS policies
*/

-- Drop existing table and recreate with proper constraints
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table with proper constraints
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role DEFAULT 'client',
  country text,
  language text DEFAULT 'en',
  phone text,
  company text,
  bio text,
  profile_image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fix the handle_new_user function to use proper UPSERT
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (
    id,
    email,
    full_name,
    role,
    country,
    language
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client'),
    NEW.raw_user_meta_data->>'country',
    COALESCE(NEW.raw_user_meta_data->>'language', 'en')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name),
    role = COALESCE(EXCLUDED.role, user_profiles.role),
    country = COALESCE(EXCLUDED.country, user_profiles.country),
    language = COALESCE(EXCLUDED.language, user_profiles.language),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the auth trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();