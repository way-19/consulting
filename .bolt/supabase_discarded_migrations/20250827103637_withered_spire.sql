/*
  # Create User Profiles and Roles System

  1. New Tables
    - `user_profiles`
      - `id` (uuid, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (user_role enum: client, consultant, admin)
      - `country` (text)
      - `language` (text, default 'en')
      - `phone` (text)
      - `company` (text)
      - `bio` (text)
      - `profile_image_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to manage their own profiles
    - Add policies for admins to manage all profiles

  3. Functions
    - Create trigger function to auto-create profiles
    - Create trigger to update updated_at timestamp
*/

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'client', 'consultant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    full_name text NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    country text,
    language text NOT NULL DEFAULT 'en',
    phone text,
    company text,
    bio text,
    profile_image_url text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

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

CREATE POLICY "Admins can update all profiles"
    ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "System can insert profiles"
    ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create function to handle new user registration
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
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
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
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail user creation
        RAISE WARNING 'Error creating user profile: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();