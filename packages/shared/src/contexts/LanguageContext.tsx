import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'tr' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

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
    
    // Common
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    viewAll: 'View All',
    readMore: 'Read More',
    
    // Hero Section
    heroTitle1: 'AI-Powered Global',
    heroSubtitle1: 'Business Consulting',
    heroDescription1: 'Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance.',
    heroPrimaryCTA1: 'Start Your Expansion',
    heroSecondaryCTA1: 'Explore Services',
    
    heroTitle2: 'Seamless International',
    heroSubtitle2: 'Company Formation',
    heroDescription2: 'Establish your business in business-friendly jurisdictions with expert legal guidance and AI-powered process automation.',
    heroPrimaryCTA2: 'Form Your Company',
    heroSecondaryCTA2: 'View Countries',
    
    heroTitle3: 'Strategic Tax',
    heroSubtitle3: 'Optimization',
    heroDescription3: 'Minimize your tax burden legally through strategic international tax planning and jurisdiction selection.',
    heroPrimaryCTA3: 'Optimize Taxes',
    heroSecondaryCTA3: 'Learn More',
    
    heroTitle4: 'Global Investment',
    heroSubtitle4: 'Advisory',
    heroDescription4: 'Maximize returns with globally diversified strategies across public and private markets.',
    heroPrimaryCTA4: 'Start Investing',
    heroSecondaryCTA4: 'View Strategies',
    
    heroTitle5: 'Comprehensive Asset',
    heroSubtitle5: 'Protection',
    heroDescription5: 'Protect your wealth through sophisticated trust, foundation, and holding structures.',
    heroPrimaryCTA5: 'Protect Assets',
    heroSecondaryCTA5: 'Learn More',
    
    // AI Assistant
    aiPoweredIntelligence: 'AI-Powered Intelligence',
    aiOracleAssistant: 'AI Oracle Assistant',
    online: 'Online',
    aiAssistantGreeting: 'Hello! I\'m your AI Oracle assistant. I can help you with international business expansion. What type of business are you looking to establish?',
    aiAssistantQuick1: 'I want to start a tech company',
    aiAssistantQuick2: 'Looking for tax optimization',
    aiAssistantQuick3: 'Need EU market access',
    aiAssistantQuick4: 'Interested in crypto business',
    aiAssistantQuickStart: 'Quick start:',
    aiAssistantPlaceholder: 'Type your message...',
    send: 'Send',
    
    // Services
    companyFormation: 'Company Formation',
    taxOptimization: 'Tax Optimization',
    bankingSolutions: 'Banking Solutions',
    legalCompliance: 'Legal Compliance',
    assetProtection: 'Asset Protection',
    investmentAdvisory: 'Investment Advisory',
    
    // Countries
    unitedArabEmirates: 'United Arab Emirates',
    estonia: 'Estonia',
    georgia: 'Georgia',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portugal',
    unitedStates: 'United States',
    switzerland: 'Switzerland',
    
    // Footer
    copyright: '© 2025 Consulting19. All rights reserved.',
    powered: 'Powered by AI Oracle technology',
    
    // Company Section
    companyTitle: 'Company Formation',
    companySubtitle: 'Fast & compliant business setup worldwide',
    companyFeature1: 'AI-powered jurisdiction analysis',
    companyFeature2: 'Expert local guidance',
    companyFeature3: 'Complete banking integration',
    companyFeature4: 'Ongoing compliance support',
    companyCta: 'Start Company Formation',
    
    // Wealth Section
    wealthTitle: 'Matrix — Private Wealth Platform',
    wealthSubtitle: 'AI-assisted global allocation for ultra-high-net-worth clients. Minimum: $5M.',
    wealthFeature1: 'AI-driven analysis',
    wealthFeature2: 'Global opportunities',
    wealthFeature3: 'Strict confidentiality',
    wealthStat1: '$5M Min',
    wealthStat2: '98% Success',
    wealthCta: 'Explore Matrix Wealth',
  },
  tr: {
    // Navigation
    home: 'Ana Sayfa',
    services: 'Hizmetler',
    countries: 'Ülkeler',
    about: 'Hakkımızda',
    blog: 'Blog',
    contact: 'İletişim',
    login: 'Giriş',
    register: 'Kayıt Ol',
    logout: 'Çıkış',
    dashboard: 'Panel',
    
    // Common
    learnMore: 'Daha Fazla Bilgi',
    getStarted: 'Başlayın',
    viewAll: 'Tümünü Gör',
    readMore: 'Devamını Oku',
    
    // Hero Section
    heroTitle1: 'AI Destekli Küresel',
    heroSubtitle1: 'İş Danışmanlığı',
    heroDescription1: 'Uluslararası iş genişleme için uzman rehberlik. 19+ ülkede vergi optimizasyonu, şirket kuruluşu ve yasal uyumluluk için danışmanlarla bağlantı kuran AI destekli platform.',
    heroPrimaryCTA1: 'Genişlemenizi Başlatın',
    heroSecondaryCTA1: 'Hizmetleri Keşfedin',
    
    heroTitle2: 'Sorunsuz Uluslararası',
    heroSubtitle2: 'Şirket Kuruluşu',
    heroDescription2: 'İş dostu yargı alanlarında uzman hukuki rehberlik ve AI destekli süreç otomasyonu ile işinizi kurun.',
    heroPrimaryCTA2: 'Şirketinizi Kurun',
    heroSecondaryCTA2: 'Ülkeleri Görün',
    
    heroTitle3: 'Stratejik Vergi',
    heroSubtitle3: 'Optimizasyonu',
    heroDescription3: 'Stratejik uluslararası vergi planlaması ve yargı alanı seçimi ile vergi yükünüzü yasal olarak minimize edin.',
    heroPrimaryCTA3: 'Vergileri Optimize Edin',
    heroSecondaryCTA3: 'Daha Fazla Bilgi',
    
    heroTitle4: 'Küresel Yatırım',
    heroSubtitle4: 'Danışmanlığı',
    heroDescription4: 'Kamu ve özel piyasalarda küresel olarak çeşitlendirilmiş stratejilerle getirileri maksimize edin.',
    heroPrimaryCTA4: 'Yatırıma Başlayın',
    heroSecondaryCTA4: 'Stratejileri Görün',
    
    heroTitle5: 'Kapsamlı Varlık',
    heroSubtitle5: 'Koruması',
    heroDescription5: 'Sofistike tröst, vakıf ve holding yapıları ile servetinizi koruyun.',
    heroPrimaryCTA5: 'Varlıkları Koruyun',
    heroSecondaryCTA5: 'Daha Fazla Bilgi',
    
    // AI Assistant
    aiPoweredIntelligence: 'AI Destekli Zeka',
    aiOracleAssistant: 'AI Oracle Asistan',
    online: 'Çevrimiçi',
    aiAssistantGreeting: 'Merhaba! Ben AI Oracle asistanınızım. Uluslararası iş genişlemeniz için size yardımcı olabilirim. Hangi tür bir iş kurmak istiyorsunuz?',
    aiAssistantQuick1: 'Teknoloji şirketi kurmak istiyorum',
    aiAssistantQuick2: 'Vergi optimizasyonu arıyorum',
    aiAssistantQuick3: 'AB pazarına erişim istiyorum',
    aiAssistantQuick4: 'Kripto işi yapmak istiyorum',
    aiAssistantQuickStart: 'Hızlı başlangıç:',
    aiAssistantPlaceholder: 'Mesajınızı yazın...',
    send: 'Gönder',
    
    // Services
    companyFormation: 'Şirket Kuruluşu',
    taxOptimization: 'Vergi Optimizasyonu',
    bankingSolutions: 'Bankacılık Çözümleri',
    legalCompliance: 'Yasal Uyumluluk',
    assetProtection: 'Varlık Koruması',
    investmentAdvisory: 'Yatırım Danışmanlığı',
    
    // Countries
    unitedArabEmirates: 'Birleşik Arap Emirlikleri',
    estonia: 'Estonya',
    georgia: 'Gürcistan',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portekiz',
    unitedStates: 'Amerika Birleşik Devletleri',
    switzerland: 'İsviçre',
    
    // Footer
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır.',
    powered: 'AI Oracle teknolojisi ile güçlendirilmiştir',
    
    // Company Section
    companyTitle: 'Şirket Kuruluşu',
    companySubtitle: 'Dünya çapında hızlı ve uyumlu iş kurulumu',
    companyFeature1: 'AI destekli yargı alanı analizi',
    companyFeature2: 'Uzman yerel rehberlik',
    companyFeature3: 'Tam bankacılık entegrasyonu',
    companyFeature4: 'Sürekli uyumluluk desteği',
    companyCta: 'Şirket Kuruluşunu Başlat',
    
    // Wealth Section
    wealthTitle: 'Matrix — Özel Servet Platformu',
    wealthSubtitle: 'Ultra yüksek net değerli müşteriler için AI destekli küresel tahsis. Minimum: 5M$.',
    wealthFeature1: 'AI güdümlü analiz',
    wealthFeature2: 'Küresel fırsatlar',
    wealthFeature3: 'Sıkı gizlilik',
    wealthStat1: '5M$ Min',
    wealthStat2: '%98 Başarı',
    wealthCta: 'Matrix Wealth\'i Keşfet',
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
    
    // Common
    learnMore: 'Saiba Mais',
    getStarted: 'Começar',
    viewAll: 'Ver Todos',
    readMore: 'Ler Mais',
    
    // Hero Section
    heroTitle1: 'Consultoria Global',
    heroSubtitle1: 'Alimentada por IA',
    heroDescription1: 'Orientação especializada para expansão internacional de negócios. Plataforma alimentada por IA conectando você com consultores em 19+ países para otimização fiscal, formação de empresas e conformidade legal.',
    heroPrimaryCTA1: 'Inicie Sua Expansão',
    heroSecondaryCTA1: 'Explorar Serviços',
    
    heroTitle2: 'Formação Internacional',
    heroSubtitle2: 'Perfeita de Empresas',
    heroDescription2: 'Estabeleça seu negócio em jurisdições favoráveis aos negócios com orientação jurídica especializada e automação de processos alimentada por IA.',
    heroPrimaryCTA2: 'Forme Sua Empresa',
    heroSecondaryCTA2: 'Ver Países',
    
    heroTitle3: 'Otimização Fiscal',
    heroSubtitle3: 'Estratégica',
    heroDescription3: 'Minimize sua carga tributária legalmente através de planejamento fiscal internacional estratégico e seleção de jurisdição.',
    heroPrimaryCTA3: 'Otimizar Impostos',
    heroSecondaryCTA3: 'Saiba Mais',
    
    heroTitle4: 'Consultoria de',
    heroSubtitle4: 'Investimento Global',
    heroDescription4: 'Maximize retornos com estratégias globalmente diversificadas em mercados públicos e privados.',
    heroPrimaryCTA4: 'Começar a Investir',
    heroSecondaryCTA4: 'Ver Estratégias',
    
    heroTitle5: 'Proteção Abrangente',
    heroSubtitle5: 'de Ativos',
    heroDescription5: 'Proteja sua riqueza através de estruturas sofisticadas de trust, fundação e holding.',
    heroPrimaryCTA5: 'Proteger Ativos',
    heroSecondaryCTA5: 'Saiba Mais',
    
    // AI Assistant
    aiPoweredIntelligence: 'Inteligência Alimentada por IA',
    aiOracleAssistant: 'Assistente AI Oracle',
    online: 'Online',
    aiAssistantGreeting: 'Olá! Sou seu assistente AI Oracle. Posso ajudá-lo com expansão internacional de negócios. Que tipo de negócio você está procurando estabelecer?',
    aiAssistantQuick1: 'Quero começar uma empresa de tecnologia',
    aiAssistantQuick2: 'Procurando otimização fiscal',
    aiAssistantQuick3: 'Preciso de acesso ao mercado da UE',
    aiAssistantQuick4: 'Interessado em negócios cripto',
    aiAssistantQuickStart: 'Início rápido:',
    aiAssistantPlaceholder: 'Digite sua mensagem...',
    send: 'Enviar',
    
    // Services
    companyFormation: 'Formação de Empresa',
    taxOptimization: 'Otimização Fiscal',
    bankingSolutions: 'Soluções Bancárias',
    legalCompliance: 'Conformidade Legal',
    assetProtection: 'Proteção de Ativos',
    investmentAdvisory: 'Consultoria de Investimento',
    
    // Countries
    unitedArabEmirates: 'Emirados Árabes Unidos',
    estonia: 'Estônia',
    georgia: 'Geórgia',
    malta: 'Malta',
    panama: 'Panamá',
    portugal: 'Portugal',
    unitedStates: 'Estados Unidos',
    switzerland: 'Suíça',
    
    // Footer
    copyright: '© 2025 Consulting19. Todos os direitos reservados.',
    powered: 'Alimentado pela tecnologia AI Oracle',
    
    // Company Section
    companyTitle: 'Formação de Empresa',
    companySubtitle: 'Configuração de negócios rápida e compatível em todo o mundo',
    companyFeature1: 'Análise de jurisdição alimentada por IA',
    companyFeature2: 'Orientação especializada local',
    companyFeature3: 'Integração bancária completa',
    companyFeature4: 'Suporte contínuo de conformidade',
    companyCta: 'Iniciar Formação de Empresa',
    
    // Wealth Section
    wealthTitle: 'Matrix — Plataforma de Riqueza Privada',
    wealthSubtitle: 'Alocação global assistida por IA para clientes de patrimônio líquido ultra-alto. Mínimo: $5M.',
    wealthFeature1: 'Análise orientada por IA',
    wealthFeature2: 'Oportunidades globais',
    wealthFeature3: 'Confidencialidade rigorosa',
    wealthStat1: '$5M Mín',
    wealthStat2: '98% Sucesso',
    wealthCta: 'Explorar Matrix Wealth',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'tr', 'pt'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}