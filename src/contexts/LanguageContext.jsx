// contexts/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation data
const translations = {
  tr: {
    'nav.about': 'Hakkımızda',
    'nav.services': 'Hizmetler',
    'nav.countries': 'Ülkeler',
    'nav.blog': 'Blog',
    'nav.contact': 'İletişim',
    'nav.partnership': 'Ortaklık Programı',
    'nav.getStarted': 'Başla',
    'home.title': 'AI-Destekli Global İstihbarat Ağı',
    'home.subtitle': 'Hizmetinizde',
    'home.description': '8 stratejik yargı alanında gerçek zamanlı düzenleyici güncellemeler ve sınır ötesi fırsatlar',
    'service.companyFormation': 'Şirket Kuruluşu',
    'service.investmentAdvisory': 'Yatırım Danışmanlığı',
    'service.legalConsulting': 'Hukuki Danışmanlık',
    'service.accounting': 'Muhasebe Hizmetleri',
    'common.explore': 'Keşfet',
    'common.getStarted': 'Başla',
    'common.learnMore': 'Daha Fazla Bilgi'
  },
  en: {
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.countries': 'Countries',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.partnership': 'Partnership Program',
    'nav.getStarted': 'Get Started',
    'home.title': 'AI-Enhanced Global Intelligence Network',
    'home.subtitle': 'at Your Service',
    'home.description': 'Real-time regulatory updates and cross-border opportunities across 8 strategic jurisdictions',
    'service.companyFormation': 'Company Formation',
    'service.investmentAdvisory': 'Investment Advisory',
    'service.legalConsulting': 'Legal Consulting',
    'service.accounting': 'Accounting Services',
    'common.explore': 'Explore',
    'common.getStarted': 'Get Started',
    'common.learnMore': 'Learn More'
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('tr');

  useEffect(() => {
    const savedLang = localStorage.getItem('consulting19_language');
    if (savedLang && ['tr', 'en'].includes(savedLang)) {
      setCurrentLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (['tr', 'en'].includes(lang)) {
      setCurrentLanguage(lang);
      localStorage.setItem('consulting19_language', lang);
    }
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    supportedLanguages: ['tr', 'en']
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};