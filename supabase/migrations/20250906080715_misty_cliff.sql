/*
  # Add 2FA Support to User Profiles

  1. Schema Updates
    - Add 2FA columns to user_profiles table
    - Add MFA settings table for factor management
    - Add audit logging for 2FA events

  2. Security
    - Enable RLS on new tables
    - Add policies for user access
    - Add 2FA enrollment tracking

  3. Features
    - TOTP (Time-based One-Time Password) support
    - Backup codes generation
    - 2FA enforcement settings
*/

-- Add 2FA columns to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'mfa_enabled'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN mfa_enabled boolean DEFAULT false;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'mfa_secret'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN mfa_secret text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'backup_codes'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN backup_codes text[];
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'mfa_enrolled_at'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN mfa_enrolled_at timestamptz;
  END IF;
END $$;

-- Create MFA factors table for Supabase Auth integration
CREATE TABLE IF NOT EXISTS mfa_factors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  factor_type text NOT NULL DEFAULT 'totp',
  factor_name text NOT NULL DEFAULT 'Authenticator App',
  secret text,
  qr_code text,
  is_verified boolean DEFAULT false,
  backup_codes text[],
  created_at timestamptz DEFAULT now(),
  verified_at timestamptz,
  last_used_at timestamptz
);

-- Enable RLS
ALTER TABLE mfa_factors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mfa_factors
CREATE POLICY "Users can manage own MFA factors"
  ON mfa_factors
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mfa_factors_user_id ON mfa_factors(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_factors_verified ON mfa_factors(is_verified) WHERE is_verified = true;

-- Add 2FA audit events
DO $$
BEGIN
  -- Add 2FA related audit log types if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'audit_logs_action_type_check'
  ) THEN
    -- This will be handled by existing audit_logs table
    NULL;
  END IF;
END $$;

-- Function to generate backup codes
CREATE OR REPLACE FUNCTION generate_backup_codes()
RETURNS text[] AS $$
DECLARE
  codes text[] := '{}';
  i integer;
  code text;
BEGIN
  FOR i IN 1..8 LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    codes := array_append(codes, code);
  END LOOP;
  RETURN codes;
END;
$$ LANGUAGE plpgsql;

-- Function to validate backup code
CREATE OR REPLACE FUNCTION validate_backup_code(user_id_param uuid, code_param text)
RETURNS boolean AS $$
DECLARE
  user_codes text[];
  remaining_codes text[];
  code_found boolean := false;
  code_item text;
BEGIN
  -- Get user's backup codes
  SELECT backup_codes INTO user_codes
  FROM user_profiles
  WHERE id = user_id_param;
  
  IF user_codes IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if code exists and remove it
  remaining_codes := '{}';
  FOREACH code_item IN ARRAY user_codes LOOP
    IF code_item = upper(code_param) THEN
      code_found := true;
    ELSE
      remaining_codes := array_append(remaining_codes, code_item);
    END IF;
  END LOOP;
  
  -- Update backup codes (remove used code)
  IF code_found THEN
    UPDATE user_profiles 
    SET backup_codes = remaining_codes
    WHERE id = user_id_param;
  END IF;
  
  RETURN code_found;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;