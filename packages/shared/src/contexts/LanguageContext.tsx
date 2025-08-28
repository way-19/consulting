import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'tr' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    home: 'Home',
    services: 'Services',
    countries: 'Countries',
    about: 'About',
    blog: 'Blog',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    dashboard: 'Dashboard',
    viewAllServices: 'View All Services',
    viewAllCountries: 'View All Countries',

    // Hero Section
    heroTitle: 'AI-Enhanced Global Intelligence',
    heroSubtitle: 'at Your Service',
    heroDescription: 'Next-level regulatory guidance with intelligent automation. Our AI-powered platform connects you with expert consultants across the world\'s most business-friendly jurisdictions.',
    getStarted: 'Get Started Today',
    exploreServices: 'Explore Services',

    // Services
    companyFormation: 'Company Formation',
    taxOptimization: 'Tax Optimization',
    bankingSolutions: 'Banking Solutions',
    legalCompliance: 'Legal Compliance',
    assetProtection: 'Asset Protection',
    investmentAdvisory: 'Investment Advisory',

    // Footer
    copyright: '© 2025 Consulting19. All rights reserved',
    powered: 'Powered by AI Oracle',

    // Company Formation CTA
    companyTitle: 'Company Formation',
    companySubtitle: 'Fast & reliable business setup worldwide',
    companyFeature1: 'Expert guidance',
    companyFeature2: 'Global network',
    companyFeature3: 'Compliance assured',
    companyFeature4: 'Professional support',
    companyCta: 'Start Company Formation',

    // Wealth Management CTA
    wealthTitle: 'Wealth Management',
    wealthSubtitle: 'AI-powered investment strategies for global wealth optimization',
    wealthFeature1: 'AI-driven analysis',
    wealthFeature2: 'Global opportunities',
    wealthFeature3: 'Unlimited potential',
    wealthStat1: '$2.5B+ Managed',
    wealthStat2: '98% Success Rate',
    wealthCta: 'Explore Wealth Solutions',
  },
  tr: {
    // Navigation
    home: 'Ana Sayfa',
    services: 'Hizmetler',
    countries: 'Ülkeler',
    about: 'Hakkımızda',
    blog: 'Blog',
    contact: 'İletişim',
    login: 'Giriş Yap',
    register: 'Kayıt Ol',
    logout: 'Çıkış Yap',
    dashboard: 'Panel',
    viewAllServices: 'Tüm Hizmetleri Görüntüle',
    viewAllCountries: 'Tüm Ülkeleri Görüntüle',

    // Hero Section
    heroTitle: 'AI Destekli Küresel Zeka',
    heroSubtitle: 'Hizmetinizde',
    heroDescription: 'Akıllı otomasyon ile yeni nesil düzenleyici rehberlik. AI destekli platformumuz sizi dünyanın en iş dostu yargı alanlarındaki uzman danışmanlarla bağlar.',
    getStarted: 'Bugün Başlayın',
    exploreServices: 'Hizmetleri Keşfedin',

    // Services
    companyFormation: 'Şirket Kuruluşu',
    taxOptimization: 'Vergi Optimizasyonu',
    bankingSolutions: 'Bankacılık Çözümleri',
    legalCompliance: 'Yasal Uyumluluk',
    assetProtection: 'Varlık Korunması',
    investmentAdvisory: 'Yatırım Danışmanlığı',

    // Footer
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır',
    powered: 'AI Oracle tarafından desteklenmektedir',

    // Company Formation CTA
    companyTitle: 'Şirket Kuruluşu',
    companySubtitle: 'Dünya çapında hızlı ve güvenilir iş kurulumu',
    companyFeature1: 'Uzman rehberliği',
    companyFeature2: 'Küresel ağ',
    companyFeature3: 'Uyumluluk garantisi',
    companyFeature4: 'Profesyonel destek',
    companyCta: 'Şirket Kuruluşunu Başlat',

    // Wealth Management CTA
    wealthTitle: 'Varlık Yönetimi',
    wealthSubtitle: 'Küresel servet optimizasyonu için AI destekli yatırım stratejileri',
    wealthFeature1: 'AI odaklı analiz',
    wealthFeature2: 'Küresel fırsatlar',
    wealthFeature3: 'Sınırsız potansiyel',
    wealthStat1: '2.5 Milyar$+ Yönetilen',
    wealthStat2: '%98 Başarı Oranı',
    wealthCta: 'Varlık Çözümlerini Keşfet',
  },
  pt: {
    // Navigation
    home: 'Início',
    services: 'Serviços',
    countries: 'Países',
    about: 'Sobre',
    blog: 'Blog',
    contact: 'Contato',
    login: 'Entrar',
    register: 'Registrar',
    logout: 'Sair',
    dashboard: 'Painel',
    viewAllServices: 'Ver Todos os Serviços',
    viewAllCountries: 'Ver Todos os Países',

    // Hero Section
    heroTitle: 'Inteligência Global Aprimorada por IA',
    heroSubtitle: 'ao Seu Serviço',
    heroDescription: 'Orientação regulatória de próximo nível com automação inteligente. Nossa plataforma alimentada por IA conecta você com consultores especialistas nas jurisdições mais favoráveis aos negócios do mundo.',
    getStarted: 'Comece Hoje',
    exploreServices: 'Explorar Serviços',

    // Services
    companyFormation: 'Formação de Empresa',
    taxOptimization: 'Otimização Fiscal',
    bankingSolutions: 'Soluções Bancárias',
    legalCompliance: 'Conformidade Legal',
    assetProtection: 'Proteção de Ativos',
    investmentAdvisory: 'Consultoria de Investimento',

    // Footer
    copyright: '© 2025 Consulting19. Todos os direitos reservados',
    powered: 'Desenvolvido por AI Oracle',

    // Company Formation CTA
    companyTitle: 'Formação de Empresa',
    companySubtitle: 'Configuração de negócios rápida e confiável em todo o mundo',
    companyFeature1: 'Orientação especializada',
    companyFeature2: 'Rede global',
    companyFeature3: 'Conformidade garantida',
    companyFeature4: 'Suporte profissional',
    companyCta: 'Iniciar Formação de Empresa',

    // Wealth Management CTA
    wealthTitle: 'Gestão de Patrimônio',
    wealthSubtitle: 'Estratégias de investimento com IA para otimização global de patrimônio',
    wealthFeature1: 'Análise orientada por IA',
    wealthFeature2: 'Oportunidades globais',
    wealthFeature3: 'Potencial ilimitado',
    wealthStat1: '$2,5B+ Gerenciados',
    wealthStat2: '98% Taxa de Sucesso',
    wealthCta: 'Explorar Soluções de Patrimônio',
  },
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('consulting19-language') as Language;
    if (savedLanguage && ['en', 'tr', 'pt'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('consulting19-language', language);
  }, [language]);

  const t = (key: string): string => {
    const value = translations[language][key as keyof typeof translations[typeof language]];
    return value || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}