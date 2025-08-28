import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.countries': 'Countries',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',

    // Hero Section
    'hero.title': 'Global Business Solutions',
    'hero.subtitle': 'Expert consulting for international business formation and growth',
    'hero.cta': 'Get Started',

    // Wealth Management
    'wealth.title': 'Design the Future of Your Wealth',
    'wealth.subtitle': 'Premium wealth management with AI-powered insights and global reach',
    'wealth.feature1': 'AI Advisor',
    'wealth.feature2': 'Global Risk',
    'wealth.feature3': 'Digital Immortality',
    'wealth.stat1': '$2.4B+ Assets',
    'wealth.stat2': '150+ Countries',
    'wealth.cta': 'Apply Now',

    // Company Formation
    'company.title': 'Start Your Company Now',
    'company.subtitle': 'Fast and secure online company formation',
    'company.feature1': 'Register in 24 hours',
    'company.feature2': '19+ business-friendly countries',
    'company.feature3': 'Full legal compliance',
    'company.feature4': 'Expert guidance included',
    'company.cta': 'Order Now',

    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive business solutions',

    // Countries
    'countries.title': 'Business Destinations',
    'countries.subtitle': 'Choose the perfect jurisdiction for your business',

    // Footer
    'footer.company': 'Company',
    'footer.services': 'Services',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.rights': 'All rights reserved.',
  },
  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.services': 'Hizmetler',
    'nav.countries': 'Ülkeler',
    'nav.about': 'Hakkımızda',
    'nav.contact': 'İletişim',
    'nav.blog': 'Blog',
    'nav.login': 'Giriş',
    'nav.register': 'Kayıt',
    'nav.dashboard': 'Panel',
    'nav.logout': 'Çıkış',

    // Hero Section
    'hero.title': 'Küresel İş Çözümleri',
    'hero.subtitle': 'Uluslararası iş kurma ve büyüme için uzman danışmanlık',
    'hero.cta': 'Başlayın',

    // Wealth Management
    'wealth.title': 'Varlığınızın Geleceğini Tasarlayın',
    'wealth.subtitle': 'AI destekli içgörüler ve küresel erişim ile premium varlık yönetimi',
    'wealth.feature1': 'AI Danışman',
    'wealth.feature2': 'Global Risk',
    'wealth.feature3': 'Dijital Ölümsüzlük',
    'wealth.stat1': '$2.4B+ Varlık',
    'wealth.stat2': '150+ Ülke',
    'wealth.cta': 'Başvuru Yapın',

    // Company Formation
    'company.title': 'Şirketinizi Hemen Kurun',
    'company.subtitle': 'Hızlı ve güvenli online şirket kurma',
    'company.feature1': '24 saatte tescil',
    'company.feature2': '19+ iş dostu ülke',
    'company.feature3': 'Tam yasal uyumluluk',
    'company.feature4': 'Uzman rehberlik dahil',
    'company.cta': 'Hemen Sipariş Ver',

    // Services
    'services.title': 'Hizmetlerimiz',
    'services.subtitle': 'Kapsamlı iş çözümleri',

    // Countries
    'countries.title': 'İş Destinasyonları',
    'countries.subtitle': 'İşiniz için mükemmel yargı alanını seçin',

    // Footer
    'footer.company': 'Şirket',
    'footer.services': 'Hizmetler',
    'footer.support': 'Destek',
    'footer.legal': 'Yasal',
    'footer.rights': 'Tüm hakları saklıdır.',
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.services': 'Serviços',
    'nav.countries': 'Países',
    'nav.about': 'Sobre',
    'nav.contact': 'Contato',
    'nav.blog': 'Blog',
    'nav.login': 'Entrar',
    'nav.register': 'Registrar',
    'nav.dashboard': 'Painel',
    'nav.logout': 'Sair',

    // Hero Section
    'hero.title': 'Soluções Empresariais Globais',
    'hero.subtitle': 'Consultoria especializada para formação e crescimento de negócios internacionais',
    'hero.cta': 'Começar',

    // Wealth Management
    'wealth.title': 'Projete o Futuro da Sua Riqueza',
    'wealth.subtitle': 'Gestão de patrimônio premium com insights alimentados por IA e alcance global',
    'wealth.feature1': 'Consultor IA',
    'wealth.feature2': 'Risco Global',
    'wealth.feature3': 'Imortalidade Digital',
    'wealth.stat1': '$2.4B+ Patrimônio',
    'wealth.stat2': '150+ Países',
    'wealth.cta': 'Candidatar-se',

    // Company Formation
    'company.title': 'Abra Sua Empresa Agora',
    'company.subtitle': 'Formação de empresa online rápida e segura',
    'company.feature1': 'Registro em 24 horas',
    'company.feature2': '19+ países favoráveis aos negócios',
    'company.feature3': 'Conformidade legal completa',
    'company.feature4': 'Orientação especializada incluída',
    'company.cta': 'Peça Agora',

    // Services
    'services.title': 'Nossos Serviços',
    'services.subtitle': 'Soluções empresariais abrangentes',

    // Countries
    'countries.title': 'Destinos de Negócios',
    'countries.subtitle': 'Escolha a jurisdição perfeita para o seu negócio',

    // Footer
    'footer.company': 'Empresa',
    'footer.services': 'Serviços',
    'footer.support': 'Suporte',
    'footer.legal': 'Legal',
    'footer.rights': 'Todos os direitos reservados.',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};