import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'tr';
  setLanguage: (lang: 'en' | 'tr') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Navigation
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.countries': 'Countries',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.partnership': 'Partnership',
    
    // Hero
    'hero.title': 'AI-Enhanced Global Intelligence Network at Your Service',
    'hero.subtitle': 'Expert business consulting across 7 strategic jurisdictions with AI-powered guidance and legal oversight.',
    'hero.cta': 'Get Started',
    
    // Countries
    'countries.title': 'Strategic Jurisdictions',
    'countries.subtitle': 'Choose the perfect location for your business',
    'countries.explore': 'Explore',
    
    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive business solutions',
    'services.learnMore': 'Learn More',
    
    // Footer
    'footer.description': 'World\'s first AI-enhanced territorial consultancy platform. Expert guidance across 7 strategic jurisdictions with intelligent oversight.',
    'footer.quickLinks': 'Quick Links',
    'footer.support': '24/7 Global Support',
    'footer.copyright': '© 2024 CONSULTING19. All rights reserved.',
    
    // Country specific
    'country.georgia.advantage': '0% Tax on Foreign Income',
    'country.usa.advantage': 'Global Market Access',
    'country.montenegro.advantage': 'EU Candidate Benefits',
    'country.estonia.advantage': 'Digital Nomad Paradise',
    'country.portugal.advantage': 'Golden Visa Gateway',
    'country.malta.advantage': 'EU Tax Optimization',
    'country.panama.advantage': 'Offshore Finance Hub',
    
    // Buttons
    'button.companyFormation': 'Start Company Formation',
    'button.contactExpert': 'Contact Expert',
    'button.readMore': 'Read More',
    'button.sendMessage': 'Send Message',
    
    // Forms
    'form.name': 'Full Name',
    'form.email': 'Email Address',
    'form.country': 'Country of Interest',
    'form.service': 'Service Needed',
    'form.message': 'Message',
    'form.selectCountry': 'Select a country',
    'form.selectService': 'Select a service',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success!',
    'common.backHome': 'Back to Home',
    'common.goBack': 'Go Back'
  },
  tr: {
    // Navigation
    'nav.about': 'Hakkımızda',
    'nav.services': 'Hizmetler',
    'nav.countries': 'Ülkeler',
    'nav.contact': 'İletişim',
    'nav.blog': 'Blog',
    'nav.partnership': 'Ortaklık',
    
    // Hero
    'hero.title': 'AI Destekli Küresel İstihbarat Ağı Hizmetinizde',
    'hero.subtitle': '7 stratejik yargı alanında AI destekli rehberlik ve hukuki gözetim ile uzman iş danışmanlığı.',
    'hero.cta': 'Başlayın',
    
    // Countries
    'countries.title': 'Stratejik Yargı Alanları',
    'countries.subtitle': 'İşiniz için mükemmel konumu seçin',
    'countries.explore': 'Keşfet',
    
    // Services
    'services.title': 'Hizmetlerimiz',
    'services.subtitle': 'Kapsamlı iş çözümleri',
    'services.learnMore': 'Daha Fazla',
    
    // Footer
    'footer.description': 'Dünyanın ilk AI destekli bölgesel danışmanlık platformu. 7 stratejik yargı alanında akıllı gözetim ile uzman rehberliği.',
    'footer.quickLinks': 'Hızlı Bağlantılar',
    'footer.support': '7/24 Küresel Destek',
    'footer.copyright': '© 2024 CONSULTING19. Tüm hakları saklıdır.',
    
    // Country specific
    'country.georgia.advantage': 'Yabancı Gelirde %0 Vergi',
    'country.usa.advantage': 'Küresel Pazar Erişimi',
    'country.montenegro.advantage': 'AB Aday Ülke Avantajları',
    'country.estonia.advantage': 'Dijital Göçebe Cenneti',
    'country.portugal.advantage': 'Altın Vize Kapısı',
    'country.malta.advantage': 'AB Vergi Optimizasyonu',
    'country.panama.advantage': 'Offshore Finans Merkezi',
    
    // Buttons
    'button.companyFormation': 'Şirket Kuruluşunu Başlat',
    'button.contactExpert': 'Uzmanla İletişim',
    'button.readMore': 'Devamını Oku',
    'button.sendMessage': 'Mesaj Gönder',
    
    // Forms
    'form.name': 'Ad Soyad',
    'form.email': 'E-posta Adresi',
    'form.country': 'İlgilendiğiniz Ülke',
    'form.service': 'İhtiyaç Duyulan Hizmet',
    'form.message': 'Mesaj',
    'form.selectCountry': 'Ülke seçin',
    'form.selectService': 'Hizmet seçin',
    
    // Common
    'common.loading': 'Yükleniyor...',
    'common.error': 'Bir hata oluştu',
    'common.success': 'Başarılı!',
    'common.backHome': 'Ana Sayfaya Dön',
    'common.goBack': 'Geri Git'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'tr'>('en');

  // Auto-detect browser language on first load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('consulting19-language') as 'en' | 'tr';
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('tr')) {
        setLanguageState('tr');
      } else {
        setLanguageState('en');
      }
    }
  }, []);

  const setLanguage = (lang: 'en' | 'tr') => {
    setLanguageState(lang);
    localStorage.setItem('consulting19-language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};