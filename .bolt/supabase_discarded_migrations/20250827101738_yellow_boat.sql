/*
  # Fix user_profiles table structure

  1. Check current structure and add missing columns
  2. Update RLS policies
  3. Create trigger for automatic profile creation
*/

-- First, let's see what columns exist and add missing ones
DO $$
BEGIN
  -- Add role column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role user_role DEFAULT 'client';
  END IF;

  -- Add full_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN full_name text;
  END IF;

  -- Add country column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'country'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN country text;
  END IF;

  -- Add language column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'language'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN language text DEFAULT 'en';
  END IF;

  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN phone text;
  END IF;

  -- Add company column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'company'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN company text;
  END IF;

  -- Add bio column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'bio'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN bio text;
  END IF;

  -- Add profile_image_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'profile_image_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN profile_image_url text;
  END IF;

  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_active boolean DEFAULT true;
  END IF;

  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email text;
  END IF;

  -- Add created_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Consultants can view client profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

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

CREATE POLICY "Consultants can view client profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles consultant_profile
      WHERE consultant_profile.id = auth.uid()
      AND consultant_profile.role = 'consultant'
    )
    AND role = 'client'
  );

CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile
      WHERE admin_profile.id = auth.uid()
      AND admin_profile.role = 'admin'
    )
  );

-- Create or replace the trigger function for automatic profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name, role, language, is_active, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client'),
    COALESCE(NEW.raw_user_meta_data->>'language', 'en'),
    true,
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create or replace updated_at trigger function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing updated_at trigger if it exists
DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON user_profiles;

-- Create updated_at trigger
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();