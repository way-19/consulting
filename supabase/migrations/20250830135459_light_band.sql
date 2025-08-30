/*
  # Fix marketing_pages RLS policies

  1. Problem
    - Current "Enable write access for admin users" policy uses FOR ALL
    - This causes conflicts with read access for non-admin users
    - Permission denied errors for marketing_pages table

  2. Solution
    - Drop the problematic FOR ALL policy
    - Create separate INSERT, UPDATE, DELETE policies for admins
    - Keep the existing read policy for all users
    - Ensure proper policy separation

  3. Security
    - All users can read marketing_pages (public content)
    - Only admins can modify marketing_pages content
    - Clear separation between read and write permissions
*/

-- Drop the problematic FOR ALL policy that causes conflicts
DROP POLICY IF EXISTS "Enable write access for admin users" ON marketing_pages;

-- Create separate admin policies for write operations
CREATE POLICY "Enable insert for admin users"
  ON marketing_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  );

CREATE POLICY "Enable update for admin users"
  ON marketing_pages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  );

CREATE POLICY "Enable delete for admin users"
  ON marketing_pages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'::user_role
    )
  );

-- Ensure the read policy exists (should already exist from previous migration)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'marketing_pages' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    CREATE POLICY "Enable read access for all users"
      ON marketing_pages
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;