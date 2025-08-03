/*
  # Add message translation support

  1. Schema Updates
    - Add translation fields to messages table
    - Add language preference to users table
    - Add indexes for performance

  2. Translation Fields
    - `original_language` - Language of the original message
    - `translated_message` - Message translated to recipient's language
    - `translated_language` - Language of the translation
    - `translation_status` - Status of translation process

  3. User Language Preferences
    - Update existing language field to be more specific
    - Add auto-detection preference
*/

-- Add translation support to messages table
DO $$
BEGIN
  -- Add original_language column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'original_language'
  ) THEN
    ALTER TABLE messages ADD COLUMN original_language character varying(5) DEFAULT 'en';
  END IF;

  -- Add translated_message column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'translated_message'
  ) THEN
    ALTER TABLE messages ADD COLUMN translated_message text;
  END IF;

  -- Add translated_language column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'translated_language'
  ) THEN
    ALTER TABLE messages ADD COLUMN translated_language character varying(5);
  END IF;

  -- Add translation_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'translation_status'
  ) THEN
    ALTER TABLE messages ADD COLUMN translation_status character varying(20) DEFAULT 'pending';
  END IF;

  -- Add needs_translation column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'messages' AND column_name = 'needs_translation'
  ) THEN
    ALTER TABLE messages ADD COLUMN needs_translation boolean DEFAULT false;
  END IF;
END $$;

-- Update users table for better language support
DO $$
BEGIN
  -- Add auto_language_detection column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'auto_language_detection'
  ) THEN
    ALTER TABLE users ADD COLUMN auto_language_detection boolean DEFAULT true;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_translation_status ON messages(translation_status);
CREATE INDEX IF NOT EXISTS idx_messages_needs_translation ON messages(needs_translation);
CREATE INDEX IF NOT EXISTS idx_messages_original_language ON messages(original_language);

-- Add constraint for translation_status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'messages_translation_status_check'
  ) THEN
    ALTER TABLE messages ADD CONSTRAINT messages_translation_status_check 
    CHECK (translation_status IN ('pending', 'completed', 'failed', 'not_needed'));
  END IF;
END $$;