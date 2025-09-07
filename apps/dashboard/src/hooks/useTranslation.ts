import { useState, useEffect } from 'react';

type Language = 'en' | 'tr' | 'pt';

interface TranslationData {
  [key: string]: any;
}

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  pt: { translation: pt },
  es: { translation: es }, // Bu satırı ekleyin
};

// Load translation files
const loadTranslations = async () => {
  try {
    const [enData, trData, ptData] = await Promise.all([
      import('../locales/en.json'),
      import('../locales/tr.json'),
      import('../locales/pt.json'),
    ]);
    
    translations.en = enData.default;
    translations.tr = trData.default;
    translations.pt = ptData.default;
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
};

// Initialize translations
loadTranslations();

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('dashboard-language');
    return (saved as Language) || 'en';
  });

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('dashboard-language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      // Fallback to English if translation not found
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    if (typeof value !== 'string') {
      return key; // Return key if no translation found
    }
    
    // Replace parameters
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, paramKey: string) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value;
  };

  return {
    language,
    changeLanguage,
    t,
  };
};