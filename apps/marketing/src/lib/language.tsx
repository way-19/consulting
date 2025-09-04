// apps/marketing/src/lib/language.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'tr' | 'pt' | 'es';

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
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    
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
    
    // Asset Protection Page
    protectWhatMatters: 'Protect What Matters Most',
    assetProtectionSubtitle: 'Comprehensive asset protection and wealth security strategies – powered by AI and trusted by clients worldwide',
    joinStartProtection: 'Join to Start Asset Protection',
    freeProtectionConsultation: 'Free Protection Consultation',
    globalExpertise: 'Global Expertise',
    aiMultilingualSupport: 'AI Multilingual Support',
    provenProtectionStructures: 'Proven Protection Structures',
    offshoreProtectionJurisdictions: 'Offshore Protection Jurisdictions',
    aiBackedSecurityGuidance: 'AI-Backed Security Guidance',
    customizedWealthStrategies: 'Customized Wealth Strategies',
    maximumPrivacyRiskMitigation: 'Maximum Privacy & Risk Mitigation',
    whyConsulting19AssetProtection: 'Why Consulting19 for Asset Protection?',
    provenStrategies: 'Proven Strategies',
    localExpertise: 'Local Expertise',
    aiAdvantage: 'AI Advantage',
    confidentialSecure: 'Confidential & Secure',
    protectionStrategies: 'Protection Strategies',
    protectionProcess: 'Protection Process',
    whatsIncluded: 'What\'s Included',
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    readyToProtectAssets: 'Ready to Protect Your Assets?',
    secureWealthDescription: 'Secure your wealth with professional asset protection strategies and expert guidance from qualified specialists',
    joinForProtectionAssessment: 'Join for Protection Assessment',
    
    // Features
    aiPoweredIntelligence: 'AI-Powered Intelligence',
    expertNetwork: 'Expert Network',
    
    // Footer
    copyright: '© 2025 Consulting19. All rights reserved.',
    powered: 'Powered by AI Oracle technology',
    
    // Auth
    email: 'Email Address',
    password: 'Password',
    fullName: 'Full Name',
    company: 'Company',
    country: 'Country',
    
    // Dashboard
    welcome: 'Welcome',
    clients: 'Clients',
    projects: 'Projects',
    documents: 'Documents',
    messages: 'Messages',
    settings: 'Settings',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',

    // Order Form
    orderForm: {
      companyDetails: {
        title: 'Company Details',
        subtitle: 'Enter basic information about your business',
        companyName: 'Company Name',
        companyNamePlaceholder: 'Full name of your company',
        companyType: 'Company Type',
        companyTypePlaceholder: 'Select your company type',
        contactInfo: 'Contact Information',
        contactEmail: 'Contact Email',
        contactEmailPlaceholder: 'example@company.com',
        phoneNumber: 'Phone Number',
        phoneNumberPlaceholder: '+90 555 123 4567',
        alertFillAllFields: 'Please fill in all fields.',
        companyTypes: {
          llc: 'LLC (Limited Liability Company)',
          corporation: 'Corporation (Inc.)',
          individualEntrepreneur: 'Individual Entrepreneur (IE)',
          partnership: 'Partnership',
          other: 'Other',
        },
      },
      serviceSelection: {
        title: 'Service Selection',
        subtitle: 'Select your country, package, and additional services',
        countrySelection: 'Country Selection',
        packageSelection: 'Package Selection',
        additionalServices: 'Additional Services (Optional)',
        recommendedCountries: 'Recommended Countries',
        otherCountries: 'Other Countries',
        alertSelectCountryPackage: 'Please select a country and package.',
        loadingServices: 'Loading additional services...',
        noAdditionalServices: 'No additional services found for the selected country.',
        selectCountryFirst: 'Please select a country first to see additional services.',
        recommended: 'Recommended',
      },
      bankingDetails: {
        title: 'Bank Selection',
        subtitle: 'Select the bank where you want to open a business account',
        bankSelection: 'Bank Selection',
        bankDescription: 'International banking solutions with {{bankName}}.',
        alertSelectBank: 'Please select a bank.',
      },
      reviewAndPay: {
        title: 'Review and Pay Your Order',
        subtitle: 'Check all your information and complete your order',
        companyDetails: 'Company Details',
        companyName: 'Company Name',
        companyType: 'Company Type',
        contactEmail: 'Contact Email',
        phoneNumber: 'Phone Number',
        serviceSelection: 'Service Selection',
        selectedCountry: 'Selected Country',
        selectedPackage: 'Selected Package',
        additionalServices: 'Additional Services',
        none: 'None',
        bankingDetails: 'Banking Details',
        selectedBank: 'Selected Bank',
        totalAmount: 'Total Amount',
        completeOrder: 'Complete Order and Pay',
        submittingOrder: 'Submitting Order...',
      },
      common: {
        next: 'Next',
        back: 'Back',
        step1: 'Company Details',
        step2: 'Service Selection',
        step3: 'Bank Details',
        step4: 'Review & Pay',
      }
    }
  },
  es: {
    // Navigation
    home: 'Inicio',
    services: 'Servicios',
    countries: 'Países',
    about: 'Acerca de',
    blog: 'Blog',
    contact: 'Contacto',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    dashboard: 'Panel',
    logout: 'Cerrar Sesión',
    
    // Common
    getStarted: 'Comenzar',
    learnMore: 'Saber Más',
    scheduleConsultation: 'Programar Consulta',
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    
    // Services
    companyFormation: 'Formación de Empresa',
    taxOptimization: 'Optimización Fiscal',
    bankingSolutions: 'Soluciones Bancarias',
    legalCompliance: 'Cumplimiento Legal',
    assetProtection: 'Protección de Activos',
    investmentAdvisory: 'Asesoría de Inversión',
    visaResidency: 'Visa y Residencia',
    marketResearch: 'Investigación de Mercado',
    
    // Hero Section
    heroTitle: 'Consultoría Empresarial Global Impulsada por IA',
    heroSubtitle: 'Orientación Experta Mundial',
    heroDescription: 'Conéctate con asesores expertos en 19+ países para una expansión empresarial internacional sin problemas.',
    heroPrimaryCTA: 'Inicia Tu Expansión',
    heroSecondaryCTA: 'Explorar Servicios',
    
    // Asset Protection Page
    protectWhatMatters: 'Protege Lo Que Más Importa',
    assetProtectionSubtitle: 'Estrategias integrales de protección de activos y seguridad patrimonial – impulsadas por IA y confiadas por clientes en todo el mundo',
    joinStartProtection: 'Únete para Comenzar Protección de Activos',
    freeProtectionConsultation: 'Consulta Gratuita de Protección',
    globalExpertise: 'Experiencia Global',
    aiMultilingualSupport: 'Soporte Multilingüe de IA',
    provenProtectionStructures: 'Estructuras de Protección Probadas',
    offshoreProtectionJurisdictions: 'Jurisdicciones de Protección Offshore',
    aiBackedSecurityGuidance: 'Orientación de Seguridad Respaldada por IA',
    customizedWealthStrategies: 'Estrategias de Riqueza Personalizadas',
    maximumPrivacyRiskMitigation: 'Máxima Privacidad y Mitigación de Riesgos',
    whyConsulting19AssetProtection: '¿Por qué Consulting19 para Protección de Activos?',
    provenStrategies: 'Estrategias Probadas',
    localExpertise: 'Experiencia Local',
    aiAdvantage: 'Ventaja de IA',
    confidentialSecure: 'Confidencial y Seguro',
    protectionStrategies: 'Estrategias de Protección',
    protectionProcess: 'Proceso de Protección',
    whatsIncluded: 'Qué Está Incluido',
    frequentlyAskedQuestions: 'Preguntas Frecuentes',
    readyToProtectAssets: '¿Listo para Proteger Tus Activos?',
    secureWealthDescription: 'Asegura tu riqueza con estrategias profesionales de protección de activos y orientación experta de especialistas calificados',
    joinForProtectionAssessment: 'Únete para Evaluación de Protección',
    
    // Features
    aiPoweredIntelligence: 'Inteligencia Impulsada por IA',
    expertNetwork: 'Red de Expertos',
    
    // Footer
    copyright: '© 2025 Consulting19. Todos los derechos reservados.',
    powered: 'Impulsado por la tecnología AI Oracle',
    
    // Auth
    email: 'Dirección de Correo Electrónico',
    password: 'Contraseña',
    fullName: 'Nombre Completo',
    company: 'Empresa',
    country: 'País',
    
    // Dashboard
    welcome: 'Bienvenido',
    clients: 'Clientes',
    projects: 'Proyectos',
    documents: 'Documentos',
    messages: 'Mensajes',
    settings: 'Configuración',
    
    // Status
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',

    // Order Form
    orderForm: {
      companyDetails: {
        title: 'Detalles de la Empresa',
        subtitle: 'Ingrese información básica sobre su negocio',
        companyName: 'Nombre de la Empresa',
        companyNamePlaceholder: 'Nombre completo de su empresa',
        companyType: 'Tipo de Empresa',
        companyTypePlaceholder: 'Seleccione el tipo de empresa',
        contactInfo: 'Información de Contacto',
        contactEmail: 'Correo Electrónico de Contacto',
        contactEmailPlaceholder: 'ejemplo@empresa.com',
        phoneNumber: 'Número de Teléfono',
        phoneNumberPlaceholder: '+90 555 123 4567',
        alertFillAllFields: 'Por favor, complete todos los campos.',
        companyTypes: {
          llc: 'LLC (Sociedad de Responsabilidad Limitada)',
          corporation: 'Corporación (Inc.)',
          individualEntrepreneur: 'Empresario Individual (IE)',
          partnership: 'Sociedad',
          other: 'Otro',
        },
      },
      serviceSelection: {
        title: 'Selección de Servicio',
        subtitle: 'Seleccione su país, paquete y servicios adicionales',
        countrySelection: 'Selección de País',
        packageSelection: 'Selección de Paquete',
        additionalServices: 'Servicios Adicionales (Opcional)',
        recommendedCountries: 'Países Recomendados',
        otherCountries: 'Otros Países',
        alertSelectCountryPackage: 'Por favor, seleccione un país y un paquete.',
        loadingServices: 'Cargando servicios adicionales...',
        noAdditionalServices: 'No se encontraron servicios adicionales para el país seleccionado.',
        selectCountryFirst: 'Por favor, seleccione un país primero para ver los servicios adicionales.',
        recommended: 'Recomendado',
      },
      bankingDetails: {
        title: 'Selección de Banco',
        subtitle: 'Seleccione el banco donde desea abrir una cuenta de negocios',
        bankSelection: 'Selección de Banco',
        bankDescription: 'Soluciones bancarias internacionales con {{bankName}}.',
        alertSelectBank: 'Por favor, seleccione un banco.',
      },
      reviewAndPay: {
        title: 'Revise y Pague Su Pedido',
        subtitle: 'Verifique toda su información y complete su pedido',
        companyDetails: 'Detalles de la Empresa',
        companyName: 'Nombre de la Empresa',
        companyType: 'Tipo de Empresa',
        contactEmail: 'Correo Electrónico de Contacto',
        phoneNumber: 'Número de Teléfono',
        serviceSelection: 'Selección de Servicio',
        selectedCountry: 'País Seleccionado',
        selectedPackage: 'Paquete Seleccionado',
        additionalServices: 'Servicios Adicionales',
        none: 'Ninguno',
        bankingDetails: 'Detalles Bancarios',
        selectedBank: 'Banco Seleccionado',
        totalAmount: 'Monto Total',
        completeOrder: 'Completar Pedido y Pagar',
        submittingOrder: 'Enviando Pedido...',
      },
      common: {
        next: 'Siguiente',
        back: 'Atrás',
        step1: 'Detalles de la Empresa',
        step2: 'Selección de Servicio',
        step3: 'Detalles Bancarios',
        step4: 'Revisar y Pagar',
      }
    }
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
    loading: 'Yükleniyor...',
    save: 'Kaydet',
    cancel: 'İptal',
    edit: 'Düzenle',
    delete: 'Sil',
    
    // Services
    companyFormation: 'Şirket Kuruluşu',
    taxOptimization: 'Vergi Optimizasyonu',
    bankingSolutions: 'Bankacılık Çözümleri',
    legalCompliance: 'Yasal Uyumluluk',
    assetProtection: 'Varlık Korunması',
    investmentAdvisory: 'Yatırım Danışmanlığı',
    visaResidency: 'Vize ve İkamet',
    marketResearch: 'Pazar Araştırması',
    
    // Hero Section
    heroTitle: 'AI Destekli Küresel İş Danışmanlığı',
    heroSubtitle: 'Dünya Çapında Uzman Rehberlik',
    heroDescription: '19+ ülkede uzman danışmanlarla sorunsuz uluslararası iş genişlemesi için bağlantı kurun.',
    heroPrimaryCTA: 'Genişlemenizi Başlatın',
    heroSecondaryCTA: 'Hizmetleri Keşfedin',
    
    // Asset Protection Page
    protectWhatMatters: 'En Değerli Varlıklarınızı Koruyun',
    assetProtectionSubtitle: 'AI destekli kapsamlı varlık korunması ve servet güvenliği stratejileri – dünya çapında müşteriler tarafından güvenilen',
    joinStartProtection: 'Varlık Korunmasına Başlamak İçin Üye Olun',
    freeProtectionConsultation: 'Ücretsiz Koruma Danışmanlığı',
    globalExpertise: 'Küresel Uzmanlık',
    aiMultilingualSupport: 'AI Çok Dilli Destek',
    provenProtectionStructures: 'Kanıtlanmış Koruma Yapıları',
    offshoreProtectionJurisdictions: 'Offshore Koruma Yargı Bölgeleri',
    aiBackedSecurityGuidance: 'AI Destekli Güvenlik Rehberliği',
    customizedWealthStrategies: 'Özelleştirilmiş Servet Stratejileri',
    maximumPrivacyRiskMitigation: 'Maksimum Gizlilik ve Risk Azaltma',
    whyConsulting19AssetProtection: 'Varlık Korunması İçin Neden Consulting19?',
    provenStrategies: 'Kanıtlanmış Stratejiler',
    localExpertise: 'Yerel Uzmanlık',
    aiAdvantage: 'AI Avantajı',
    confidentialSecure: 'Gizli ve Güvenli',
    protectionStrategies: 'Koruma Stratejileri',
    protectionProcess: 'Koruma Süreci',
    whatsIncluded: 'Neler Dahil',
    frequentlyAskedQuestions: 'Sıkça Sorulan Sorular',
    readyToProtectAssets: 'Varlıklarınızı Korumaya Hazır mısınız?',
    secureWealthDescription: 'Nitelikli uzmanlardan profesyonel varlık koruma stratejileri ve uzman rehberliği ile servetinizi güvence altına alın',
    joinForProtectionAssessment: 'Koruma Değerlendirmesi İçin Üye Olun',
    
    // Features
    aiPoweredIntelligence: 'AI Destekli Zeka',
    expertNetwork: 'Uzman Ağı',
    
    // Footer
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır.',
    powered: 'AI Oracle teknolojisi ile güçlendirilmiştir',
    
    // Auth
    email: 'E-posta Adresi',
    password: 'Şifre',
    fullName: 'Ad Soyad',
    company: 'Şirket',
    country: 'Ülke',
    
    // Dashboard
    welcome: 'Hoş Geldiniz',
    clients: 'Müşteriler',
    projects: 'Projeler',
    documents: 'Belgeler',
    messages: 'Mesajlar',
    settings: 'Ayarlar',
    
    // Status
    active: 'Aktif',
    inactive: 'Pasif',
    pending: 'Bekleyen',

    // Order Form
    orderForm: {
      companyDetails: {
        title: 'Şirket Bilgileri',
        subtitle: 'İşletmenizin temel bilgilerini girin',
        companyName: 'Şirket Adı',
        companyNamePlaceholder: 'Şirketinizin tam adı',
        companyType: 'Şirket Tipi',
        companyTypePlaceholder: 'Şirket tipinizi seçin',
        contactInfo: 'İletişim Bilgileri',
        contactEmail: 'İletişim E-postası',
        contactEmailPlaceholder: 'örnek@sirket.com',
        phoneNumber: 'Telefon Numarası',
        phoneNumberPlaceholder: '+90 555 123 4567',
        alertFillAllFields: 'Lütfen tüm alanları doldurun.',
        companyTypes: {
          llc: 'LLC (Limited Şirket)',
          corporation: 'Anonim Şirket (A.Ş.)',
          individualEntrepreneur: 'Şahıs Şirketi (Şahıs İşletmesi)',
          partnership: 'Ortaklık',
          other: 'Diğer',
        },
      },
      serviceSelection: {
        title: 'Hizmet Seçimi',
        subtitle: 'Ülke, paket ve ek hizmetlerinizi seçin',
        countrySelection: 'Ülke Seçimi',
        packageSelection: 'Paket Seçimi',
        additionalServices: 'Ek Hizmetler (İsteğe Bağlı)',
        recommendedCountries: 'Önerilen Ülkeler',
        otherCountries: 'Diğer Ülkeler',
        alertSelectCountryPackage: 'Lütfen ülke ve paket seçimi yapın.',
        loadingServices: 'Ek hizmetler yükleniyor...',
        noAdditionalServices: 'Seçilen ülke için ek hizmet bulunamadı.',
        selectCountryFirst: 'Lütfen ek hizmetleri görmek için önce bir ülke seçin.',
        recommended: 'Önerilen',
      },
      bankingDetails: {
        title: 'Banka Seçimi',
        subtitle: 'İşletmeniz için banka hesabı açmak istediğiniz bankayı seçin',
        bankSelection: 'Banka Seçimi',
        bankDescription: 'Uluslararası bankacılık çözümleri {{bankName}} ile.',
        alertSelectBank: 'Lütfen bir banka seçimi yapın.',
      },
      reviewAndPay: {
        title: 'Siparişinizi İnceleyin ve Ödeyin',
        subtitle: 'Tüm bilgilerinizi kontrol edin ve siparişinizi tamamlayın',
        companyDetails: 'Şirket Bilgileri',
        companyName: 'Şirket Adı',
        companyType: 'Şirket Tipi',
        contactEmail: 'İletişim E-postası',
        phoneNumber: 'Telefon Numarası',
        serviceSelection: 'Hizmet Seçimi',
        selectedCountry: 'Seçilen Ülke',
        selectedPackage: 'Seçilen Paket',
        additionalServices: 'Ek Hizmetler',
        none: 'Yok',
        bankingDetails: 'Banka Bilgileri',
        selectedBank: 'Seçilen Banka',
        totalAmount: 'Toplam Tutar',
        completeOrder: 'Siparişi Tamamla ve Öde',
        submittingOrder: 'Sipariş Oluşturuluyor...',
      },
      common: {
        next: 'İleri',
        back: 'Geri',
        step1: 'Şirket Bilgileri',
        step2: 'Hizmet Seçimi',
        step3: 'Banka Bilgileri',
        step4: 'İncele ve Öde',
      }
    }
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
    loading: 'Carregando...',
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    
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
    
    // Asset Protection Page
    protectWhatMatters: 'Proteja o Que Mais Importa',
    assetProtectionSubtitle: 'Estratégias abrangentes de proteção de ativos e segurança patrimonial – alimentadas por IA e confiadas por clientes em todo o mundo',
    joinStartProtection: 'Junte-se para Iniciar Proteção de Ativos',
    freeProtectionConsultation: 'Consulta Gratuita de Proteção',
    globalExpertise: 'Expertise Global',
    aiMultilingualSupport: 'Suporte Multilíngue AI',
    provenProtectionStructures: 'Estruturas de Proteção Comprovadas',
    offshoreProtectionJurisdictions: 'Jurisdições de Proteção Offshore',
    aiBackedSecurityGuidance: 'Orientação de Segurança Apoiada por IA',
    customizedWealthStrategies: 'Estratégias de Riqueza Personalizadas',
    maximumPrivacyRiskMitigation: 'Máxima Privacidade e Mitigação de Riscos',
    whyConsulting19AssetProtection: 'Por que Consulting19 para Proteção de Ativos?',
    provenStrategies: 'Estratégias Comprovadas',
    localExpertise: 'Expertise Local',
    aiAdvantage: 'Vantagem da IA',
    confidentialSecure: 'Confidencial e Seguro',
    protectionStrategies: 'Estratégias de Proteção',
    protectionProcess: 'Processo de Proteção',
    whatsIncluded: 'O Que Está Incluído',
    frequentlyAskedQuestions: 'Perguntas Frequentes',
    readyToProtectAssets: 'Pronto para Proteger Seus Ativos?',
    secureWealthDescription: 'Proteja sua riqueza com estratégias profissionais de proteção de ativos e orientação especializada de especialistas qualificados',
    joinForProtectionAssessment: 'Junte-se para Avaliação de Proteção',
    
    // Features
    aiPoweredIntelligence: 'Inteligência Alimentada por IA',
    expertNetwork: 'Rede de Especialistas',
    
    // Footer
    copyright: '© 2025 Consulting19. Todos os direitos reservados.',
    powered: 'Alimentado pela tecnologia AI Oracle',
    
    // Auth
    email: 'Endereço de Email',
    password: 'Senha',
    fullName: 'Nome Completo',
    company: 'Empresa',
    country: 'País',
    
    // Dashboard
    welcome: 'Bem-vindo',
    clients: 'Clientes',
    projects: 'Projetos',
    documents: 'Documentos',
    messages: 'Mensagens',
    settings: 'Configurações',
    
    // Status
    active: 'Ativo',
    inactive: 'Inativo',
    pending: 'Pendente',

    // Order Form
    orderForm: {
      companyDetails: {
        title: 'Detalhes da Empresa',
        subtitle: 'Insira informações básicas sobre sua empresa',
        companyName: 'Nome da Empresa',
        companyNamePlaceholder: 'Nome completo da sua empresa',
        companyType: 'Tipo de Empresa',
        companyTypePlaceholder: 'Selecione o tipo de empresa',
        contactInfo: 'Informações de Contato',
        contactEmail: 'Email de Contato',
        contactEmailPlaceholder: 'exemplo@empresa.com',
        phoneNumber: 'Número de Telefone',
        phoneNumberPlaceholder: '+90 555 123 4567',
        alertFillAllFields: 'Por favor, preencha todos os campos.',
        companyTypes: {
          llc: 'LLC (Sociedade de Responsabilidade Limitada)',
          corporation: 'Corporação (Inc.)',
          individualEntrepreneur: 'Empresário Individual (EI)',
          partnership: 'Parceria',
          other: 'Outro',
        },
      },
      serviceSelection: {
        title: 'Seleção de Serviço',
        subtitle: 'Selecione seu país, pacote e serviços adicionais',
        countrySelection: 'Seleção de País',
        packageSelection: 'Seleção de Pacote',
        additionalServices: 'Serviços Adicionais (Opcional)',
        recommendedCountries: 'Países Recomendados',
        otherCountries: 'Outros Países',
        alertSelectCountryPackage: 'Por favor, selecione um país e um pacote.',
        loadingServices: 'Carregando serviços adicionais...',
        noAdditionalServices: 'Nenhum serviço adicional encontrado para o país selecionado.',
        selectCountryFirst: 'Por favor, selecione um país primeiro para ver os serviços adicionais.',
        recommended: 'Recomendado',
      },
      bankingDetails: {
        title: 'Seleção de Banco',
        subtitle: 'Selecione o banco onde você deseja abrir uma conta comercial',
        bankSelection: 'Seleção de Banco',
        bankDescription: 'Soluções bancárias internacionais com {{bankName}}.',
        alertSelectBank: 'Por favor, selecione um banco.',
      },
      reviewAndPay: {
        title: 'Revise e Pague Seu Pedido',
        subtitle: 'Verifique todas as suas informações e complete seu pedido',
        companyDetails: 'Detalhes da Empresa',
        companyName: 'Nome da Empresa',
        companyType: 'Tipo de Empresa',
        contactEmail: 'Email de Contato',
        phoneNumber: 'Número de Telefone',
        serviceSelection: 'Seleção de Serviço',
        selectedCountry: 'País Selecionado',
        selectedPackage: 'Pacote Selecionado',
        additionalServices: 'Serviços Adicionais',
        none: 'Nenhum',
        bankingDetails: 'Detalhes Bancários',
        selectedBank: 'Banco Selecionado',
        totalAmount: 'Valor Total',
        completeOrder: 'Completar Pedido e Pagar',
        submittingOrder: 'Enviando Pedido...',
      },
      common: {
        next: 'Próximo',
        back: 'Voltar',
        step1: 'Detalhes da Empresa',
        step2: 'Seleção de Serviço',
        step3: 'Detalhes Bancários',
        step4: 'Revisar e Pagar',
      }
    }
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

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found for current language
        value = translations.en;
        for (const ek of keys) {
          if (value && typeof value === 'object' && ek in value) {
            value = value[ek];
          } else {
            value = undefined;
            break;
          }
        }
        break;
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