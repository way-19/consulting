import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { translationService } from '../lib/translation';

export const useMessageTranslation = (userId: string, userLanguage: string) => {
  const [processingTranslations, setProcessingTranslations] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Subscribe to new messages that need translation
    const subscription = supabase
      .channel('message-translations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${userId}`
        },
        async (payload) => {
          const message = payload.new;
          
          // Check if translation is needed
          if (message.needs_translation && message.translation_status === 'pending') {
            await processTranslation(message);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, userLanguage]);

  const processTranslation = async (message: any) => {
    const messageId = message.id;
    
    // Avoid duplicate processing
    if (processingTranslations.has(messageId)) {
      return;
    }

    setProcessingTranslations(prev => new Set(prev).add(messageId));

    try {
      // Get sender and recipient languages
      const { data: senderData } = await supabase
        .from('users')
        .select('language')
        .eq('id', message.sender_id)
        .single();

      const { data: recipientData } = await supabase
        .from('users')
        .select('language')
        .eq('id', message.recipient_id)
        .single();

      const senderLang = senderData?.language || 'en';
      const recipientLang = recipientData?.language || 'en';

      // Only translate if languages are different
      if (senderLang !== recipientLang) {
        await translationService.translateMessage(
          messageId,
          message.message,
          senderLang,
          recipientLang
        );
      }
    } catch (error) {
      console.error('Translation processing error:', error);
      
      // Mark translation as failed
      await supabase
        .from('messages')
        .update({ translation_status: 'failed' })
        .eq('id', messageId);
    } finally {
      setProcessingTranslations(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  return {
    processingTranslations: Array.from(processingTranslations)
  };
};