import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'tr' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Basic translations for smoke test
const translations = {
  en: {
    home: 'Home',
    services: 'Services',
    countries: 'Countries',
    about: 'About',
    blog: 'Blog',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    scheduleConsultation: 'Schedule Consultation',
    backToServices: 'Back to Services',
    chooseCountry: 'Choose Country',
    companyFormation: 'Company Formation',
    taxOptimization: 'Tax Optimization',
    bankingSolutions: 'Banking Solutions',
    legalCompliance: 'Legal Compliance',
    assetProtection: 'Asset Protection',
    investmentAdvisory: 'Investment Advisory',
    visaResidency: 'Visa & Residency',
    marketResearch: 'Market Research',
    heroTitle1: 'AI-Powered Global Business Consulting',
    heroSubtitle1: 'Expert Guidance Worldwide',
    heroDescription1: 'Connect with expert advisors in 19+ countries for seamless international business expansion.',
    heroPrimaryCTA1: 'Start Your Expansion',
    heroSecondaryCTA1: 'Explore Services',
    aiPoweredIntelligence: 'AI-Powered Intelligence',
    online: 'Online',
    send: 'Send',
    aiOracleAssistant: 'AI Oracle Assistant',
    aiAssistantGreeting: 'Hello! I\'m your AI Oracle assistant. How can I help with your international business expansion?',
    aiAssistantQuick1: 'I want to start a tech company',
    aiAssistantQuick2: 'Looking for tax optimization',
    aiAssistantQuick3: 'Need EU market access',
    aiAssistantQuick4: 'Interested in crypto business',
    aiAssistantPlaceholder: 'Type your message...',
    copyright: '© 2025 Consulting19. All rights reserved.',
    powered: 'Powered by AI Oracle technology'
  },
  tr: {
    home: 'Ana Sayfa',
    services: 'Hizmetler',
    countries: 'Ülkeler',
    about: 'Hakkımızda',
    blog: 'Blog',
    contact: 'İletişim',
    login: 'Giriş',
    register: 'Kayıt Ol',
    dashboard: 'Panel',
    logout: 'Çıkış',
    getStarted: 'Başlayın',
    learnMore: 'Daha Fazla Bilgi',
    scheduleConsultation: 'Danışmanlık Planlayın',
    backToServices: 'Hizmetlere Dön',
    chooseCountry: 'Ülke Seçin',
    companyFormation: 'Şirket Kuruluşu',
    taxOptimization: 'Vergi Optimizasyonu',
    bankingSolutions: 'Bankacılık Çözümleri',
    legalCompliance: 'Yasal Uyumluluk',
    assetProtection: 'Varlık Koruma',
    investmentAdvisory: 'Yatırım Danışmanlığı',
    visaResidency: 'Vize ve İkamet',
    marketResearch: 'Pazar Araştırması',
    heroTitle1: 'AI Destekli Küresel İş Danışmanlığı',
    heroSubtitle1: 'Dünya Çapında Uzman Rehberlik',
    heroDescription1: '19+ ülkede uzman danışmanlarla sorunsuz uluslararası iş genişlemesi için bağlantı kurun.',
    heroPrimaryCTA1: 'Genişlemenizi Başlatın',
    heroSecondaryCTA1: 'Hizmetleri Keşfedin',
    aiPoweredIntelligence: 'AI Destekli Zeka',
    online: 'Çevrimiçi',
    send: 'Gönder',
    aiOracleAssistant: 'AI Oracle Asistan',
    aiAssistantGreeting: 'Merhaba! Ben AI Oracle asistanınızım. Uluslararası iş genişlemenizde nasıl yardımcı olabilirim?',
    aiAssistantQuick1: 'Teknoloji şirketi kurmak istiyorum',
    aiAssistantQuick2: 'Vergi optimizasyonu arıyorum',
    aiAssistantQuick3: 'AB pazarına erişim istiyorum',
    aiAssistantQuick4: 'Kripto işi yapmak istiyorum',
    aiAssistantPlaceholder: 'Mesajınızı yazın...',
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır.',
    powered: 'AI Oracle teknolojisi ile güçlendirilmiştir'
  },
  pt: {
    home: 'Início',
    services: 'Serviços',
    countries: 'Países',
    about: 'Sobre',
    blog: 'Blog',
    contact: 'Contato',
    login: 'Entrar',
    register: 'Registrar',
    dashboard: 'Painel',
    logout: 'Sair',
    getStarted: 'Começar',
    learnMore: 'Saiba Mais',
    scheduleConsultation: 'Agendar Consulta',
    backToServices: 'Voltar aos Serviços',
    chooseCountry: 'Escolher País',
    companyFormation: 'Formação de Empresa',
    taxOptimization: 'Otimização Fiscal',
    bankingSolutions: 'Soluções Bancárias',
    legalCompliance: 'Conformidade Legal',
    assetProtection: 'Proteção de Ativos',
    investmentAdvisory: 'Consultoria de Investimento',
    visaResidency: 'Visto e Residência',
    marketResearch: 'Pesquisa de Mercado',
    heroTitle1: 'Consultoria Empresarial Global Alimentada por IA',
    heroSubtitle1: 'Orientação Especializada Mundial',
    heroDescription1: 'Conecte-se com consultores especialistas em 19+ países para expansão empresarial internacional perfeita.',
    heroPrimaryCTA1: 'Inicie Sua Expansão',
    heroSecondaryCTA1: 'Explorar Serviços',
    aiPoweredIntelligence: 'Inteligência Alimentada por IA',
    online: 'Online',
    send: 'Enviar',
    aiOracleAssistant: 'Assistente AI Oracle',
    aiAssistantGreeting: 'Olá! Sou seu assistente AI Oracle. Como posso ajudar com sua expansão empresarial internacional?',
    aiAssistantQuick1: 'Quero começar uma empresa de tecnologia',
    aiAssistantQuick2: 'Procurando otimização fiscal',
    aiAssistantQuick3: 'Preciso de acesso ao mercado da UE',
    aiAssistantQuick4: 'Interessado em negócios cripto',
    aiAssistantPlaceholder: 'Digite sua mensagem...',
    copyright: '© 2025 Consulting19. Todos os direitos reservados.',
    powered: 'Alimentado pela tecnologia AI Oracle'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('consulting19-language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('consulting19-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};