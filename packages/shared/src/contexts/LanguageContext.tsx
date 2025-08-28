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
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.countries': 'Countries',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',
    'nav.home': 'Home',
    'nav.viewAllServices': 'View All Services',
    'nav.viewAllCountries': 'View All Countries',

    // Services
    'services.companyFormation': 'Company Formation',
    'services.taxOptimization': 'Tax Optimization',
    'services.bankingSolutions': 'Banking Solutions',
    'services.legalCompliance': 'Legal Compliance',
    'services.assetProtection': 'Asset Protection',
    'services.investmentAdvisory': 'Investment Advisory',

    // Footer
    'footer.copyright': '© 2025 Consulting19. All rights reserved',
    'footer.powered': 'Powered by AI Oracle',

    // Company Formation CTA
    'company.title': 'Company Formation',
    'company.subtitle': 'Fast & reliable business setup worldwide',
    'company.feature1': 'Expert guidance',
    'company.feature2': 'Global network',
    'company.feature3': 'Compliance assured',
    'company.feature4': 'Professional support',
    'company.cta': 'Start Company Formation',

    // Wealth Management CTA
    'wealth.title': 'Wealth Management',
    'wealth.subtitle': 'AI-powered investment strategies for global wealth optimization',
    'wealth.feature1': 'AI-driven analysis',
    'wealth.feature2': 'Global opportunities',
    'wealth.feature3': 'Unlimited potential',
    'wealth.stat1': '$2.5B+ Managed',
    'wealth.stat2': '98% Success Rate',
    'wealth.cta': 'Explore Wealth Solutions',
  },
  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.services': 'Hizmetler',
    'nav.countries': 'Ülkeler',
    'nav.about': 'Hakkımızda',
    'nav.blog': 'Blog',
    'nav.contact': 'İletişim',
    'nav.login': 'Giriş Yap',
    'nav.register': 'Kayıt Ol',
    'nav.logout': 'Çıkış Yap',
    'nav.dashboard': 'Panel',
    'nav.home': 'Ana Sayfa',
    'nav.viewAllServices': 'Tüm Hizmetleri Görüntüle',
    'nav.viewAllCountries': 'Tüm Ülkeleri Görüntüle',

    // Services
    'services.companyFormation': 'Şirket Kuruluşu',
    'services.taxOptimization': 'Vergi Optimizasyonu',
    'services.bankingSolutions': 'Bankacılık Çözümleri',
    'services.legalCompliance': 'Yasal Uyumluluk',
    'services.assetProtection': 'Varlık Korunması',
    'services.investmentAdvisory': 'Yatırım Danışmanlığı',

    // Footer
    'footer.copyright': '© 2025 Consulting19. Tüm hakları saklıdır',
    'footer.powered': 'AI Oracle tarafından desteklenmektedir',

    // Company Formation CTA
    'company.title': 'Şirket Kuruluşu',
    'company.subtitle': 'Dünya çapında hızlı ve güvenilir iş kurulumu',
    'company.feature1': 'Uzman rehberliği',
    'company.feature2': 'Küresel ağ',
    'company.feature3': 'Uyumluluk garantisi',
    'company.feature4': 'Profesyonel destek',
    'company.cta': 'Şirket Kuruluşunu Başlat',

    // Wealth Management CTA
    'wealth.title': 'Varlık Yönetimi',
    'wealth.subtitle': 'Küresel servet optimizasyonu için AI destekli yatırım stratejileri',
    'wealth.feature1': 'AI odaklı analiz',
    'wealth.feature2': 'Küresel fırsatlar',
    'wealth.feature3': 'Sınırsız potansiyel',
    'wealth.stat1': '2.5 Milyar$+ Yönetilen',
    'wealth.stat2': '%98 Başarı Oranı',
    'wealth.cta': 'Varlık Çözümlerini Keşfet',
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
    'nav.logout': 'Sair',
    'nav.dashboard': 'Painel',
    'nav.home': 'Início',
    'nav.viewAllServices': 'Ver Todos os Serviços',
    'nav.viewAllCountries': 'Ver Todos os Países',

    // Services
    'services.companyFormation': 'Formação de Empresa',
    'services.taxOptimization': 'Otimização Fiscal',
    'services.bankingSolutions': 'Soluções Bancárias',
    'services.legalCompliance': 'Conformidade Legal',
    'services.assetProtection': 'Proteção de Ativos',
    'services.investmentAdvisory': 'Consultoria de Investimento',

    // Footer
    'footer.copyright': '© 2025 Consulting19. Todos os direitos reservados',
    'footer.powered': 'Desenvolvido por AI Oracle',

    // Company Formation CTA
    'company.title': 'Formação de Empresa',
    'company.subtitle': 'Configuração de negócios rápida e confiável em todo o mundo',
    'company.feature1': 'Orientação especializada',
    'company.feature2': 'Rede global',
    'company.feature3': 'Conformidade garantida',
    'company.feature4': 'Suporte profissional',
    'company.cta': 'Iniciar Formação de Empresa',

    // Wealth Management CTA
    'wealth.title': 'Gestão de Patrimônio',
    'wealth.subtitle': 'Estratégias de investimento com IA para otimização global de patrimônio',
    'wealth.feature1': 'Análise orientada por IA',
    'wealth.feature2': 'Oportunidades globais',
    'wealth.feature3': 'Potencial ilimitado',
    'wealth.stat1': '$2,5B+ Gerenciados',
    'wealth.stat2': '98% Taxa de Sucesso',
    'wealth.cta': 'Explorar Soluções de Patrimônio',
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
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
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
