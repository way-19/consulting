/*
  # Fix message translation trigger function

  1. Problem
    - PostgreSQL cannot determine if `needs_translation` refers to table column or PL/pgSQL variable
    - This causes PGRST201 error when inserting messages

  2. Solution
    - Use local variable `message_needs_translation` instead of `needs_translation`
    - Add table alias for clarity
    - Improve language detection logic
    - Add proper error handling

  3. Changes
    - Rename variable to avoid naming conflict
    - Use table alias `m` for messages table
    - Add better language detection for Turkish/non-English content
    - Add updated_at timestamp
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS handle_message_translation() CASCADE;

-- Create improved message translation trigger function
CREATE OR REPLACE FUNCTION handle_message_translation()
RETURNS TRIGGER AS $$
DECLARE
    sender_language TEXT;
    recipient_language TEXT;
    message_needs_translation BOOLEAN := FALSE;
    detected_language TEXT;
BEGIN
    -- Get sender language preference
    SELECT language INTO sender_language 
    FROM users 
    WHERE id = NEW.sender_id;
    
    -- Get recipient language preference (if recipient exists)
    IF NEW.recipient_id IS NOT NULL THEN
        SELECT language INTO recipient_language 
        FROM users 
        WHERE id = NEW.recipient_id;
    END IF;
    
    -- Set default languages if not found
    sender_language := COALESCE(sender_language, 'en');
    recipient_language := COALESCE(recipient_language, 'en');
    
    -- Detect message language if not provided
    detected_language := COALESCE(NEW.original_language, sender_language);
    
    -- Simple language detection for Turkish content
    IF NEW.message ~ '[çğıöşüÇĞIİÖŞÜ]' THEN
        detected_language := 'tr';
    END IF;
    
    -- Determine if translation is needed
    message_needs_translation := (detected_language != recipient_language);
    
    -- Update the message record with translation info
    UPDATE messages m SET
        original_language = detected_language,
        translated_language = CASE 
            WHEN message_needs_translation THEN recipient_language 
            ELSE NULL 
        END,
        needs_translation = message_needs_translation,
        translation_status = CASE 
            WHEN message_needs_translation THEN 'pending'
            ELSE 'not_needed'
        END,
        updated_at = NOW()
    WHERE m.id = NEW.id;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error and continue without breaking the insert
        RAISE WARNING 'Error in message translation trigger: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS trigger_message_translation ON messages;
CREATE TRIGGER trigger_message_translation
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION handle_message_translation();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION handle_message_translation() TO authenticated;
GRANT EXECUTE ON FUNCTION handle_message_translation() TO service_role;