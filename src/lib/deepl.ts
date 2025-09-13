import { supabase } from './supabase';

export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('translate-message', {
      body: {
        text: text,
        target_lang: targetLang.toLowerCase()
      }
    });

    if (error) {
      throw new Error(`Supabase function error: ${error.message}`);
    }

    if (!data || !data.translated) {
      throw new Error('Invalid response from translation service');
    }

    return data.translated;
  } catch (error) {
    console.error('Translation failed:', error);
    throw error;
  }
}