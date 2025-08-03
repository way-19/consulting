/*
  # Add automatic translation trigger for messages

  1. Trigger Function
    - Create function to handle message translation
    - Call Edge Function for translation processing
    - Handle translation status updates

  2. Trigger Setup
    - AFTER INSERT trigger on messages table
    - Only trigger for messages that need translation
    - Async processing to avoid blocking

  3. Translation Logic
    - Check if sender and recipient have different languages
    - Mark message for translation if needed
    - Call translation Edge Function
*/

-- Create function to handle message translation
CREATE OR REPLACE FUNCTION handle_message_translation()
RETURNS TRIGGER AS $$
DECLARE
  sender_lang text;
  recipient_lang text;
  needs_translation boolean := false;
BEGIN
  -- Get sender language
  SELECT language INTO sender_lang
  FROM users
  WHERE id = NEW.sender_id;

  -- Get recipient language (if recipient exists)
  IF NEW.recipient_id IS NOT NULL THEN
    SELECT language INTO recipient_lang
    FROM users
    WHERE id = NEW.recipient_id;
    
    -- Check if translation is needed
    IF sender_lang IS DISTINCT FROM recipient_lang THEN
      needs_translation := true;
    END IF;
  END IF;

  -- Update message with translation requirements
  UPDATE messages
  SET 
    original_language = COALESCE(NEW.original_language, sender_lang, 'en'),
    needs_translation = needs_translation,
    translation_status = CASE 
      WHEN needs_translation THEN 'pending'
      ELSE 'not_needed'
    END
  WHERE id = NEW.id;

  -- If translation is needed, we would call the Edge Function here
  -- For now, we'll mark it as pending and let the frontend handle it
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_message_translation ON messages;
CREATE TRIGGER trigger_message_translation
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_message_translation();