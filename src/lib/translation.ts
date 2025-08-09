import { supabase } from './supabaseClient';

export interface TranslationService {
  translateMessage: (messageId: string, originalText: string, sourceLang: string, targetLang: string) => Promise<string>;
  detectLanguage: (text: string) => Promise<string>;
  getSupportedLanguages: () => string[];
}

export class DeepLTranslationService implements TranslationService {
  private readonly supportedLanguages = [
    'en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'ja', 'zh'
  ];

  async translateMessage(
    messageId: string, 
    originalText: string, 
    sourceLang: string, 
    targetLang: string
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('translate-message', {
        body: {
          messageId,
          originalText,
          sourceLang,
          targetLang,
        },
      });
      if (error) throw error;
      // data may contain translatedText
      return (data as any)?.translatedText || originalText;
    } catch (error) {
      console.error('Translation error:', error);
      return originalText; // Fallback to original text
    }
  }

  async detectLanguage(text: string): Promise<string> {
    // Simple language detection based on character patterns
    // This is a basic implementation - in production you might want to use a proper detection service
    
    // Turkish detection
    if (/[çğıöşüÇĞIİÖŞÜ]/.test(text)) {
      return 'tr';
    }
    
    // German detection
    if (/[äöüßÄÖÜ]/.test(text)) {
      return 'de';
    }
    
    // French detection
    if (/[àâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/.test(text)) {
      return 'fr';
    }
    
    // Spanish detection
    if (/[ñáéíóúüÑÁÉÍÓÚÜ]/.test(text)) {
      return 'es';
    }
    
    // Default to English
    return 'en';
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }
}

export const translationService = new DeepLTranslationService();

// Language utilities
export const getLanguageName = (code: string): string => {
  const languageNames: Record<string, string> = {
    'en': 'English',
    'tr': 'Türkçe',
    'de': 'Deutsch',
    'fr': 'Français',
    'es': 'Español',
    'it': 'Italiano',
    'pt': 'Português',
    'ru': 'Русский',
    'ja': '日本語',
    'zh': '中文'
  };
  return languageNames[code] || code.toUpperCase();
};

export const getLanguageFlag = (code: string): string => {
  const languageFlags: Record<string, string> = {
    'en': '🇺🇸',
    'tr': '🇹🇷',
    'de': '🇩🇪',
    'fr': '🇫🇷',
    'es': '🇪🇸',
    'it': '🇮🇹',
    'pt': '🇵🇹',
    'ru': '🇷🇺',
    'ja': '🇯🇵',
    'zh': '🇨🇳'
  };
  return languageFlags[code] || '🌍';
};