/*
  # Countries Tablosu Güncellemeleri

  1. Yeni Sütunlar
    - `is_recommended` (boolean, önerilen ülke durumu)
  
  2. Mevcut Sütun Güncellemeleri
    - `flag_emoji` sütunu zaten mevcut, güncelleme gerekmiyor
*/

-- Add is_recommended column to countries table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'countries' AND column_name = 'is_recommended'
  ) THEN
    ALTER TABLE countries ADD COLUMN is_recommended boolean DEFAULT false;
  END IF;
END $$;

-- Update existing countries to set some as recommended (örnek veriler)
UPDATE countries 
SET is_recommended = true 
WHERE code IN ('GE', 'EE', 'AE', 'MT', 'PT') 
AND is_recommended IS NULL OR is_recommended = false;