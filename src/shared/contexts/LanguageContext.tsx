import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'tr' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive translations
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
    dashboard: 'Dashboard',
    logout: 'Logout',
    
    // Common
    getStarted: 'Get Started',
    learnMore: 'Learn More',
    scheduleConsultation: 'Schedule Consultation',
    backToServices: 'Back to Services',
    chooseCountry: 'Choose Country',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    
    // Services
    companyFormation: 'Company Formation',
    taxOptimization: 'Tax Optimization',
    bankingSolutions: 'Banking Solutions',
    legalCompliance: 'Legal Compliance',
    assetProtection: 'Asset Protection',
    investmentAdvisory: 'Investment Advisory',
    visaResidency: 'Visa & Residency',
    marketResearch: 'Market Research',
    
    // Hero Section
    heroTitle: 'AI-Powered Global Business Consulting',
    heroSubtitle: 'Expert Guidance Worldwide',
    heroDescription: 'Connect with expert advisors in 19+ countries for seamless international business expansion.',
    heroPrimaryCTA: 'Start Your Expansion',
    heroSecondaryCTA: 'Explore Services',
    
    // Features
    aiPoweredIntelligence: 'AI-Powered Intelligence',
    expertNetwork: 'Expert Network',
    comprehensiveServices: 'Comprehensive Services',
    multiLanguageSupport: 'Multi-Language Support',
    
    // Footer
    copyright: '© 2025 Consulting19. All rights reserved.',
    powered: 'Powered by AI Oracle technology',
    
    // Auth
    signInTitle: 'Sign In to Your Account',
    signUpTitle: 'Create Your Account',
    email: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    company: 'Company',
    country: 'Country',
    phone: 'Phone',
    role: 'Role',
    
    // Dashboard
    welcome: 'Welcome',
    overview: 'Overview',
    clients: 'Clients',
    projects: 'Projects',
    tasks: 'Tasks',
    documents: 'Documents',
    messages: 'Messages',
    billing: 'Billing',
    settings: 'Settings',
    analytics: 'Analytics',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Priority
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
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
    dashboard: 'Panel',
    logout: 'Çıkış',
    
    // Common
    getStarted: 'Başlayın',
    learnMore: 'Daha Fazla Bilgi',
    scheduleConsultation: 'Danışmanlık Planlayın',
    backToServices: 'Hizmetlere Dön',
    chooseCountry: 'Ülke Seçin',
    loading: 'Yükleniyor...',
    save: 'Kaydet',
    cancel: 'İptal',
    edit: 'Düzenle',
    delete: 'Sil',
    view: 'Görüntüle',
    add: 'Ekle',
    search: 'Ara',
    filter: 'Filtrele',
    
    // Services
    companyFormation: 'Şirket Kuruluşu',
    taxOptimization: 'Vergi Optimizasyonu',
    bankingSolutions: 'Bankacılık Çözümleri',
    legalCompliance: 'Yasal Uyumluluk',
    assetProtection: 'Varlık Koruma',
    investmentAdvisory: 'Yatırım Danışmanlığı',
    visaResidency: 'Vize ve İkamet',
    marketResearch: 'Pazar Araştırması',
    
    // Hero Section
    heroTitle: 'AI Destekli Küresel İş Danışmanlığı',
    heroSubtitle: 'Dünya Çapında Uzman Rehberlik',
    heroDescription: '19+ ülkede uzman danışmanlarla sorunsuz uluslararası iş genişlemesi için bağlantı kurun.',
    heroPrimaryCTA: 'Genişlemenizi Başlatın',
    heroSecondaryCTA: 'Hizmetleri Keşfedin',
    
    // Features
    aiPoweredIntelligence: 'AI Destekli Zeka',
    expertNetwork: 'Uzman Ağı',
    comprehensiveServices: 'Kapsamlı Hizmetler',
    multiLanguageSupport: 'Çok Dilli Destek',
    
    // Footer
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır.',
    powered: 'AI Oracle teknolojisi ile güçlendirilmiştir',
    
    // Auth
    signInTitle: 'Hesabınıza Giriş Yapın',
    signUpTitle: 'Hesabınızı Oluşturun',
    email: 'E-posta Adresi',
    password: 'Şifre',
    confirmPassword: 'Şifre Onayı',
    fullName: 'Ad Soyad',
    company: 'Şirket',
    country: 'Ülke',
    phone: 'Telefon',
    role: 'Rol',
    
    // Dashboard
    welcome: 'Hoş Geldiniz',
    overview: 'Genel Bakış',
    clients: 'Müşteriler',
    projects: 'Projeler',
    tasks: 'Görevler',
    documents: 'Belgeler',
    messages: 'Mesajlar',
    billing: 'Faturalama',
    settings: 'Ayarlar',
    analytics: 'Analitik',
    
    // Status
    active: 'Aktif',
    inactive: 'Pasif',
    pending: 'Bekleyen',
    completed: 'Tamamlandı',
    cancelled: 'İptal Edildi',
    
    // Priority
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
    urgent: 'Acil',
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
    dashboard: 'Painel',
    logout: 'Sair',
    
    // Common
    getStarted: 'Começar',
    learnMore: 'Saiba Mais',
    scheduleConsultation: 'Agendar Consulta',
    backToServices: 'Voltar aos Serviços',
    chooseCountry: 'Escolher País',
    loading: 'Carregando...',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    view: 'Ver',
    add: 'Adicionar',
    search: 'Pesquisar',
    filter: 'Filtrar',
    
    // Services
    companyFormation: 'Formação de Empresa',
    taxOptimization: 'Otimização Fiscal',
    bankingSolutions: 'Soluções Bancárias',
    legalCompliance: 'Conformidade Legal',
    assetProtection: 'Proteção de Ativos',
    investmentAdvisory: 'Consultoria de Investimento',
    visaResidency: 'Visto e Residência',
    marketResearch: 'Pesquisa de Mercado',
    
    // Hero Section
    heroTitle: 'Consultoria Empresarial Global Alimentada por IA',
    heroSubtitle: 'Orientação Especializada Mundial',
    heroDescription: 'Conecte-se com consultores especialistas em 19+ países para expansão empresarial internacional perfeita.',
    heroPrimaryCTA: 'Inicie Sua Expansão',
    heroSecondaryCTA: 'Explorar Serviços',
    
    // Features
    aiPoweredIntelligence: 'Inteligência Alimentada por IA',
    expertNetwork: 'Rede de Especialistas',
    comprehensiveServices: 'Serviços Abrangentes',
    multiLanguageSupport: 'Suporte Multi-idioma',
    
    // Footer
    copyright: '© 2025 Consulting19. Todos os direitos reservados.',
    powered: 'Alimentado pela tecnologia AI Oracle',
    
    // Auth
    signInTitle: 'Entre na Sua Conta',
    signUpTitle: 'Crie Sua Conta',
    email: 'Endereço de Email',
    password: 'Senha',
    confirmPassword: 'Confirmar Senha',
    fullName: 'Nome Completo',
    company: 'Empresa',
    country: 'País',
    phone: 'Telefone',
    role: 'Função',
    
    // Dashboard
    welcome: 'Bem-vindo',
    overview: 'Visão Geral',
    clients: 'Clientes',
    projects: 'Projetos',
    tasks: 'Tarefas',
    documents: 'Documentos',
    messages: 'Mensagens',
    billing: 'Faturamento',
    settings: 'Configurações',
    analytics: 'Análise',
    
    // Status
    active: 'Ativo',
    inactive: 'Inativo',
    pending: 'Pendente',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    
    // Priority
    low: 'Baixo',
    medium: 'Médio',
    high: 'Alto',
    urgent: 'Urgente',
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