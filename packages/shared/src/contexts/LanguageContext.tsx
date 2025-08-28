import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.countries': 'Countries',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.viewAllServices': 'View All Services',
    'nav.viewAllCountries': 'View All Countries',

    // Hero Section
    'hero.title': 'Global Business Solutions',
    'hero.subtitle': 'Expert consulting services for international business expansion',
    'hero.cta': 'Get Started',

    // Services
    'services.title': 'Our Services',
    'services.subtitle': 'Comprehensive business solutions',

    // Countries
    'countries.title': 'Featured Countries',
    'countries.subtitle': 'Explore business opportunities worldwide',

    // Company Formation
    'company.title': 'Company Formation',
    'company.subtitle': 'Fast and reliable company registration services',
    'company.feature1': 'Quick Setup Process',
    'company.feature2': 'Global Jurisdictions',
    'company.feature3': 'Legal Compliance',
    'company.feature4': 'Expert Support',
    'company.cta': 'Start Company Formation',

    // Wealth Management
    'wealth.title': 'AI Wealth Management',
    'wealth.subtitle': 'Smart investment strategies powered by artificial intelligence',
    'wealth.feature1': 'AI-Powered Analysis',
    'wealth.feature2': 'Global Markets',
    'wealth.feature3': 'Unlimited Potential',
    'wealth.stat1': '$2.5B+ Managed',
    'wealth.stat2': '98% Success Rate',
    'wealth.cta': 'Explore Wealth Solutions',

    // Common
    'common.learnMore': 'Learn More',
    'common.getStarted': 'Get Started',
    'common.viewAll': 'View All',
  },
  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.services': 'Hizmetler',
    'nav.countries': 'Ülkeler',
    'nav.about': 'Hakkımızda',
    'nav.blog': 'Blog',
    'nav.contact': 'İletişim',
    'nav.login': 'Giriş',
    'nav.register': 'Kayıt',
    'nav.viewAllServices': 'Tüm Hizmetleri Görüntüle',
    'nav.viewAllCountries': 'Tüm Ülkeleri Görüntüle',

    // Hero Section
    'hero.title': 'Küresel İş Çözümleri',
    'hero.subtitle': 'Uluslararası iş genişlemesi için uzman danışmanlık hizmetleri',
    'hero.cta': 'Başlayın',

    // Services
    'services.title': 'Hizmetlerimiz',
    'services.subtitle': 'Kapsamlı iş çözümleri',

    // Countries
    'countries.title': 'Öne Çıkan Ülkeler',
    'countries.subtitle': 'Dünya çapında iş fırsatlarını keşfedin',

    // Company Formation
    'company.title': 'Şirket Kuruluşu',
    'company.subtitle': 'Hızlı ve güvenilir şirket kayıt hizmetleri',
    'company.feature1': 'Hızlı Kurulum Süreci',
    'company.feature2': 'Küresel Yargı Alanları',
    'company.feature3': 'Yasal Uyumluluk',
    'company.feature4': 'Uzman Desteği',
    'company.cta': 'Şirket Kuruluşunu Başlat',

    // Wealth Management
    'wealth.title': 'AI Varlık Yönetimi',
    'wealth.subtitle': 'Yapay zeka ile desteklenen akıllı yatırım stratejileri',
    'wealth.feature1': 'AI Destekli Analiz',
    'wealth.feature2': 'Küresel Piyasalar',
    'wealth.feature3': 'Sınırsız Potansiyel',
    'wealth.stat1': '$2.5B+ Yönetilen',
    'wealth.stat2': '%98 Başarı Oranı',
    'wealth.cta': 'Varlık Çözümlerini Keşfet',

    // Common
    'common.learnMore': 'Daha Fazla Bilgi',
    'common.getStarted': 'Başlayın',
    'common.viewAll': 'Tümünü Görüntüle',
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.services': 'Serviços',
    'nav.countries': 'Países',
    'nav.about': 'Sobre',
    'nav.blog': 'Blog',
    'nav.contact': 'Contato',
    'nav.login': 'Entrar',
    'nav.register': 'Registrar',
    'nav.viewAllServices': 'Ver Todos os Serviços',
    'nav.viewAllCountries': 'Ver Todos os Países',

    // Hero Section
    'hero.title': 'Soluções Empresariais Globais',
    'hero.subtitle': 'Serviços de consultoria especializada para expansão internacional de negócios',
    'hero.cta': 'Começar',

    // Services
    'services.title': 'Nossos Serviços',
    'services.subtitle': 'Soluções empresariais abrangentes',

    // Countries
    'countries.title': 'Países em Destaque',
    'countries.subtitle': 'Explore oportunidades de negócios em todo o mundo',

    // Company Formation
    'company.title': 'Formação de Empresa',
    'company.subtitle': 'Serviços de registro de empresa rápidos e confiáveis',
    'company.feature1': 'Processo de Configuração Rápida',
    'company.feature2': 'Jurisdições Globais',
    'company.feature3': 'Conformidade Legal',
    'company.feature4': 'Suporte Especializado',
    'company.cta': 'Iniciar Formação de Empresa',

    // Wealth Management
    'wealth.title': 'Gestão de Patrimônio IA',
    'wealth.subtitle': 'Estratégias de investimento inteligentes alimentadas por inteligência artificial',
    'wealth.feature1': 'Análise Alimentada por IA',
    'wealth.feature2': 'Mercados Globais',
    'wealth.feature3': 'Potencial Ilimitado',
    'wealth.stat1': '$2.5B+ Gerenciado',
    'wealth.stat2': '98% Taxa de Sucesso',
    'wealth.cta': 'Explorar Soluções de Patrimônio',

    // Common
    'common.learnMore': 'Saiba Mais',
    'common.getStarted': 'Começar',
    'common.viewAll': 'Ver Todos',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language as keyof typeof translations];
    
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