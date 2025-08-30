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
    contactUs: 'Contact Us',
    scheduleConsultation: 'Schedule Consultation',
    
    // Hero Section
    heroTitle1: 'AI-Powered Global Business Consulting',
    heroSubtitle1: 'Expand Internationally',
    heroDescription1: 'Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance.',
    heroPrimaryCTA1: 'Start Your Expansion',
    heroSecondaryCTA1: 'Explore Services',
    
    heroTitle2: 'Expert Advisors in',
    heroSubtitle2: '19+ Countries',
    heroDescription2: 'Connect with local specialists who understand regulations, banking, and business culture in your target markets. Get personalized guidance for successful international expansion.',
    heroPrimaryCTA2: 'Find Your Advisor',
    heroSecondaryCTA2: 'View Countries',
    
    heroTitle3: 'AI Oracle Assistant',
    heroSubtitle3: 'Smart Recommendations',
    heroDescription3: 'Get instant jurisdiction recommendations, tax optimization strategies, and business structure advice powered by advanced AI technology and real-world expertise.',
    heroPrimaryCTA3: 'Try AI Assistant',
    heroSecondaryCTA3: 'Learn More',
    
    heroTitle4: 'Transparent Pricing',
    heroSubtitle4: 'No Hidden Fees',
    heroDescription4: 'Clear, upfront pricing with no surprises. Pay only for the services you need with transparent fee structures and competitive rates for premium international business services.',
    heroPrimaryCTA4: 'View Pricing',
    heroSecondaryCTA4: 'Get Quote',
    
    heroTitle5: 'Secure & Compliant',
    heroSubtitle5: 'Enterprise Security',
    heroDescription5: 'Bank-grade security and full regulatory compliance across all jurisdictions. Your sensitive business information is protected with enterprise-level security measures.',
    heroPrimaryCTA5: 'Security Details',
    heroSecondaryCTA5: 'Compliance Info',
    
    // How It Works
    howItWorksTitle: 'How It Works',
    howItWorksDescription: 'Simple 4-step process to expand your business globally',
    step1Title: 'Discover Opportunities',
    step1Description: 'AI Oracle analyzes your business and recommends optimal jurisdictions',
    step2Title: 'Get Matched',
    step2Description: 'Connect with expert advisors in your target countries',
    step3Title: 'Execute Strategy',
    step3Description: 'Implement your expansion plan with professional guidance',
    step4Title: 'Scale Globally',
    step4Description: 'Grow your business with ongoing support and compliance',
    
    // Services
    servicesOverviewTitle: 'Comprehensive Business Services',
    servicesOverviewDescription: 'End-to-end solutions for international business expansion',
    companyFormationTitle: 'Company Formation',
    companyFormationDesc: 'Complete business setup and incorporation services',
    taxOptimizationTitle: 'Tax Optimization',
    taxOptimizationDesc: 'Strategic tax planning and compliance solutions',
    bankingSolutionsTitle: 'Banking Solutions',
    bankingSolutionsDesc: 'Global banking and payment processing services',
    legalComplianceTitle: 'Legal Compliance',
    legalComplianceDesc: 'Ongoing legal and regulatory support',
    assetProtectionTitle: 'Asset Protection',
    assetProtectionDesc: 'Wealth protection and risk mitigation strategies',
    investmentAdvisoryTitle: 'Investment Advisory',
    investmentAdvisoryDesc: 'Professional investment and wealth management',
    visaResidencyTitle: 'Visa & Residency',
    visaResidencyDesc: 'Immigration and residency solutions',
    marketResearchTitle: 'Market Research',
    marketResearchDesc: 'Market analysis and business intelligence',
    
    // Countries
    featuredCountriesTitle: 'Featured Business Destinations',
    featuredCountriesDescription: 'Explore the world\'s most business-friendly jurisdictions',
    unitedArabEmirates: 'United Arab Emirates',
    estonia: 'Estonia',
    georgia: 'Georgia',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portugal',
    unitedStates: 'United States',
    switzerland: 'Switzerland',
    
    // Country highlights
    uaeHighlight: '0% corporate tax for 50 years in free zones',
    estoniaHighlight: '100% online e-Residency program',
    georgiaHighlight: 'Small Business Status - 1% tax',
    maltaHighlight: 'EU membership with 5% effective tax rate',
    panamaHighlight: 'Territorial tax system',
    portugalHighlight: 'Golden Visa program with EU residency',
    usaHighlight: 'World\'s largest economy and market',
    switzerlandHighlight: 'Political stability and banking excellence',
    
    // Country advantages
    noPersonalIncomeTax: 'No personal income tax',
    strategicLocation: 'Strategic location',
    modernInfrastructure: 'Modern infrastructure',
    businessFriendlyRegulations: 'Business-friendly regulations',
    digitalFirstApproach: 'Digital-first approach',
    euMarketAccess: 'EU market access',
    lowBureaucracy: 'Low bureaucracy',
    innovationFriendly: 'Innovation-friendly',
    simpleIncorporation: 'Simple incorporation',
    veryLowTaxes: 'Very low taxes',
    fastSetup: 'Fast setup',
    blockchainFriendly: 'Blockchain-friendly',
    englishSpeaking: 'English-speaking',
    strategicMediterraneanLocation: 'Strategic Mediterranean location',
    territorialTaxation: 'Territorial taxation',
    strongBankingPrivacy: 'Strong banking privacy',
    usDollarEconomy: 'US dollar economy',
    internationalBusinessHub: 'International business hub',
    nhrTaxProgram: 'NHR tax program',
    investmentImmigration: 'Investment immigration',
    strategicAtlanticLocation: 'Strategic Atlantic location',
    largestConsumerMarket: 'Largest consumer market',
    advancedInfrastructure: 'Advanced infrastructure',
    innovationHub: 'Innovation hub',
    strongLegalSystem: 'Strong legal system',
    politicalStability: 'Political stability',
    worldClassBanking: 'World-class banking',
    strategicEuLocation: 'Strategic EU location',
    
    // AI Assistant
    aiOracleAssistant: 'AI Oracle Assistant',
    aiAssistantGreeting: 'Hello! I\'m your AI Oracle assistant. I can help you with international business expansion. What type of business are you looking to establish?',
    aiAssistantPageTitle: 'AI Oracle Assistant',
    aiAssistantPageSubtitle: 'Get instant recommendations for your international business expansion',
    aiAssistantQuickStart: 'Quick start:',
    aiAssistantQuick1: 'I want to start a tech company',
    aiAssistantQuick2: 'Looking for tax optimization',
    aiAssistantQuick3: 'Need EU market access',
    aiAssistantQuick4: 'Interested in crypto business',
    aiAssistantPlaceholder: 'Type your message...',
    aiAssistantReadyTitle: 'Ready to Get Started?',
    aiAssistantReadyDesc: 'Connect with our expert advisors to begin your expansion',
    createFreeAccount: 'Create Free Account',
    send: 'Send',
    online: 'Online',
    
    // AI Promotion
    aiPoweredIntelligence: 'AI-Powered Intelligence',
    aiPromotionTitle: 'Meet Your AI Oracle Assistant',
    aiPromotionDescription: 'Get instant jurisdiction recommendations and expert matching powered by advanced AI',
    instantJurisdictionRecommendations: 'Instant jurisdiction recommendations',
    aiPoweredExpertMatching: 'AI-powered expert matching',
    personalizedBusinessStrategies: 'Personalized business strategies',
    tryAiAssistantFree: 'Try AI Assistant Free',
    startConsultation: 'Start Consultation',
    
    // Real-time Analytics
    realTimeAnalyticsTitle: 'Global Intelligence Network',
    realTimeAnalyticsDescription: 'Real-time insights from our worldwide network of business advisors',
    activeConsultations: 'Active Consultations',
    strategicJurisdictions: 'Strategic Jurisdictions',
    successRate: 'Success Rate',
    avgResponseTime: 'Avg Response Time',
    aiPoweredMatching: 'AI-Powered Matching',
    aiMatchingDescription: 'Smart advisor matching based on expertise',
    legalCompliance: 'Legal Compliance',
    legalComplianceDescription: 'Full regulatory compliance across jurisdictions',
    successOptimization: 'Success Optimization',
    successOptimizationDescription: 'Proven strategies for business success',
    joinThousandsTitle: 'Join Thousands of Successful Entrepreneurs',
    joinThousandsDescription: 'Start your international expansion journey today',
    startYourJourney: 'Start Your Journey',
    
    // Blog
    blogNewsTitle: 'Latest Insights & News',
    viewAllPosts: 'View All Posts',
    
    // Footer
    copyright: '© 2025 Consulting19. All rights reserved.',
    powered: 'Powered by AI Oracle technology',
    
    // Search and filters
    searchPlaceholder: 'Search countries...',
    allRegions: 'All Regions',
    regionEurope: 'Europe',
    regionAsia: 'Asia',
    regionMiddleEast: 'Middle East',
    regionAmericas: 'Americas',
    
    // Countries page
    countriesHeroTitle: 'Business-Friendly Destinations',
    countriesHeroDescription: 'Explore the world\'s most attractive jurisdictions for international business',
    availableDestinations: 'Available Destinations',
    noCountriesFoundTitle: 'No countries found',
    noCountriesFoundDesc: 'Try adjusting your search criteria',
    featuredBadge: 'Featured',
    corporateTax: 'Corporate Tax',
    learnMoreBtn: 'Learn More',
    
    // Navigation dropdowns
    viewAllServices: 'View All Services',
    viewAllCountries: 'View All Countries',
    
    // Process terms
    aiPoweredProcess: 'AI-Powered Process',
    endToEndSolutions: 'End-to-End Solutions',
    businessFriendlyJurisdictions: 'Business-Friendly Jurisdictions',
    globalIntelligenceNetwork: 'Global Intelligence Network',
    experienceAiConsulting: 'Experience AI-Powered Consulting',
    
    // Service page buttons
    viewAllServicesBtn: 'View All Services',
    exploreAllCountriesBtn: 'Explore All Countries',
    
    // Homepage CTAs
    companyTitle: 'Company Formation',
    companySubtitle: 'Fast, compliant business setup in 19+ countries',
    companyFeature1: 'AI-powered jurisdiction analysis',
    companyFeature2: 'Expert local guidance',
    companyFeature3: 'Banking & compliance included',
    companyFeature4: 'Full legal documentation',
    companyCta: 'Start Company Formation',
    
    wealthTitle: 'Matrix — Private Wealth',
    wealthSubtitle: 'Ultra-high-net-worth platform with AI-assisted global allocation',
    wealthFeature1: 'AI-driven portfolio analysis',
    wealthFeature2: 'Global investment opportunities',
    wealthFeature3: 'Strict confidentiality protocols',
    wealthStat1: '$2.5B+ AUM',
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
    learnMore: 'Daha Fazla Öğren',
    getStarted: 'Başlayın',
    viewAll: 'Tümünü Gör',
    readMore: 'Devamını Oku',
    contactUs: 'Bize Ulaşın',
    scheduleConsultation: 'Danışmanlık Planlayın',
    
    // Hero Section
    heroTitle1: 'AI Destekli Küresel İş Danışmanlığı',
    heroSubtitle1: 'Uluslararası Genişleyin',
    heroDescription1: 'Uluslararası iş genişleme için uzman rehberlik. 19+ ülkede vergi optimizasyonu, şirket kuruluşu ve yasal uyumluluk için danışmanlarla sizi buluşturan AI destekli platform.',
    heroPrimaryCTA1: 'Genişlemenizi Başlatın',
    heroSecondaryCTA1: 'Hizmetleri Keşfedin',
    
    heroTitle2: 'Uzman Danışmanlar',
    heroSubtitle2: '19+ Ülkede',
    heroDescription2: 'Hedef pazarlarınızdaki düzenlemeleri, bankacılığı ve iş kültürünü anlayan yerel uzmanlarla bağlantı kurun. Başarılı uluslararası genişleme için kişiselleştirilmiş rehberlik alın.',
    heroPrimaryCTA2: 'Danışmanınızı Bulun',
    heroSecondaryCTA2: 'Ülkeleri Görüntüle',
    
    heroTitle3: 'AI Oracle Asistanı',
    heroSubtitle3: 'Akıllı Öneriler',
    heroDescription3: 'Gelişmiş AI teknolojisi ve gerçek dünya uzmanlığı ile desteklenen anlık yargı yetkisi önerileri, vergi optimizasyon stratejileri ve iş yapısı tavsiyeleri alın.',
    heroPrimaryCTA3: 'AI Asistanını Deneyin',
    heroSecondaryCTA3: 'Daha Fazla Öğren',
    
    heroTitle4: 'Şeffaf Fiyatlandırma',
    heroSubtitle4: 'Gizli Ücret Yok',
    heroDescription4: 'Sürpriz olmayan açık, peşin fiyatlandırma. Premium uluslararası iş hizmetleri için şeffaf ücret yapıları ve rekabetçi oranlarla sadece ihtiyacınız olan hizmetler için ödeme yapın.',
    heroPrimaryCTA4: 'Fiyatları Görüntüle',
    heroSecondaryCTA4: 'Teklif Alın',
    
    heroTitle5: 'Güvenli ve Uyumlu',
    heroSubtitle5: 'Kurumsal Güvenlik',
    heroDescription5: 'Tüm yargı yetkilerinde banka düzeyinde güvenlik ve tam düzenleyici uyumluluk. Hassas iş bilgileriniz kurumsal düzeyde güvenlik önlemleriyle korunur.',
    heroPrimaryCTA5: 'Güvenlik Detayları',
    heroSecondaryCTA5: 'Uyumluluk Bilgisi',
    
    // How It Works
    howItWorksTitle: 'Nasıl Çalışır',
    howItWorksDescription: 'İşinizi küresel olarak genişletmek için basit 4 adımlı süreç',
    step1Title: 'Fırsatları Keşfedin',
    step1Description: 'AI Oracle işinizi analiz eder ve optimal yargı yetkilerini önerir',
    step2Title: 'Eşleştirilme',
    step2Description: 'Hedef ülkelerinizdeki uzman danışmanlarla bağlantı kurun',
    step3Title: 'Strateji Uygulayın',
    step3Description: 'Profesyonel rehberlikle genişleme planınızı uygulayın',
    step4Title: 'Küresel Ölçeklendirin',
    step4Description: 'Devam eden destek ve uyumlulukla işinizi büyütün',
    
    // Services
    servicesOverviewTitle: 'Kapsamlı İş Hizmetleri',
    servicesOverviewDescription: 'Uluslararası iş genişleme için uçtan uca çözümler',
    companyFormationTitle: 'Şirket Kuruluşu',
    companyFormationDesc: 'Komple iş kurulumu ve kuruluş hizmetleri',
    taxOptimizationTitle: 'Vergi Optimizasyonu',
    taxOptimizationDesc: 'Stratejik vergi planlama ve uyumluluk çözümleri',
    bankingSolutionsTitle: 'Bankacılık Çözümleri',
    bankingSolutionsDesc: 'Küresel bankacılık ve ödeme işleme hizmetleri',
    legalComplianceTitle: 'Yasal Uyumluluk',
    legalComplianceDesc: 'Devam eden yasal ve düzenleyici destek',
    assetProtectionTitle: 'Varlık Koruma',
    assetProtectionDesc: 'Servet koruma ve risk azaltma stratejileri',
    investmentAdvisoryTitle: 'Yatırım Danışmanlığı',
    investmentAdvisoryDesc: 'Profesyonel yatırım ve servet yönetimi',
    visaResidencyTitle: 'Vize ve İkamet',
    visaResidencyDesc: 'Göçmenlik ve ikamet çözümleri',
    marketResearchTitle: 'Pazar Araştırması',
    marketResearchDesc: 'Pazar analizi ve iş zekası',
    
    // Countries
    featuredCountriesTitle: 'Öne Çıkan İş Destinasyonları',
    featuredCountriesDescription: 'Dünyanın en iş dostu yargı yetkilerini keşfedin',
    unitedArabEmirates: 'Birleşik Arap Emirlikleri',
    estonia: 'Estonya',
    georgia: 'Gürcistan',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portekiz',
    unitedStates: 'Amerika Birleşik Devletleri',
    switzerland: 'İsviçre',
    
    // Country highlights
    uaeHighlight: 'Serbest bölgelerde 50 yıl boyunca %0 kurumlar vergisi',
    estoniaHighlight: '%100 online e-Residency programı',
    georgiaHighlight: 'Küçük İşletme Statüsü - %1 vergi',
    maltaHighlight: '%5 efektif vergi oranı ile AB üyeliği',
    panamaHighlight: 'Bölgesel vergi sistemi',
    portugalHighlight: 'AB ikameti ile Altın Vize programı',
    usaHighlight: 'Dünyanın en büyük ekonomisi ve pazarı',
    switzerlandHighlight: 'Siyasi istikrar ve bankacılık mükemmelliği',
    
    // Country advantages
    noPersonalIncomeTax: 'Kişisel gelir vergisi yok',
    strategicLocation: 'Stratejik konum',
    modernInfrastructure: 'Modern altyapı',
    businessFriendlyRegulations: 'İş dostu düzenlemeler',
    digitalFirstApproach: 'Dijital öncelikli yaklaşım',
    euMarketAccess: 'AB pazar erişimi',
    lowBureaucracy: 'Düşük bürokrasi',
    innovationFriendly: 'İnovasyon dostu',
    simpleIncorporation: 'Basit kuruluş',
    veryLowTaxes: 'Çok düşük vergiler',
    fastSetup: 'Hızlı kurulum',
    blockchainFriendly: 'Blockchain dostu',
    englishSpeaking: 'İngilizce konuşulan',
    strategicMediterraneanLocation: 'Stratejik Akdeniz konumu',
    territorialTaxation: 'Bölgesel vergilendirme',
    strongBankingPrivacy: 'Güçlü bankacılık gizliliği',
    usDollarEconomy: 'ABD doları ekonomisi',
    internationalBusinessHub: 'Uluslararası iş merkezi',
    nhrTaxProgram: 'NHR vergi programı',
    investmentImmigration: 'Yatırım göçmenliği',
    strategicAtlanticLocation: 'Stratejik Atlantik konumu',
    largestConsumerMarket: 'En büyük tüketici pazarı',
    advancedInfrastructure: 'Gelişmiş altyapı',
    innovationHub: 'İnovasyon merkezi',
    strongLegalSystem: 'Güçlü hukuk sistemi',
    politicalStability: 'Siyasi istikrar',
    worldClassBanking: 'Dünya standartlarında bankacılık',
    strategicEuLocation: 'Stratejik AB konumu',
    
    // AI Assistant
    aiOracleAssistant: 'AI Oracle Asistanı',
    aiAssistantGreeting: 'Merhaba! Ben AI Oracle asistanınızım. Uluslararası iş genişlemeniz için size yardımcı olabilirim. Hangi tür bir iş kurmak istiyorsunuz?',
    aiAssistantPageTitle: 'AI Oracle Asistanı',
    aiAssistantPageSubtitle: 'Uluslararası iş genişlemeniz için anında öneriler alın',
    aiAssistantQuickStart: 'Hızlı başlangıç:',
    aiAssistantQuick1: 'Teknoloji şirketi kurmak istiyorum',
    aiAssistantQuick2: 'Vergi optimizasyonu arıyorum',
    aiAssistantQuick3: 'AB pazarına erişim istiyorum',
    aiAssistantQuick4: 'Kripto işi yapmak istiyorum',
    aiAssistantPlaceholder: 'Mesajınızı yazın...',
    aiAssistantReadyTitle: 'Başlamaya Hazır mısınız?',
    aiAssistantReadyDesc: 'Genişlemenizi başlatmak için uzman danışmanlarımızla bağlantı kurun',
    createFreeAccount: 'Ücretsiz Hesap Oluşturun',
    send: 'Gönder',
    online: 'Çevrimiçi',
    
    // AI Promotion
    aiPoweredIntelligence: 'AI Destekli Zeka',
    aiPromotionTitle: 'AI Oracle Asistanınızla Tanışın',
    aiPromotionDescription: 'Gelişmiş AI ile desteklenen anlık yargı yetkisi önerileri ve uzman eşleştirmesi alın',
    instantJurisdictionRecommendations: 'Anlık yargı yetkisi önerileri',
    aiPoweredExpertMatching: 'AI destekli uzman eşleştirmesi',
    personalizedBusinessStrategies: 'Kişiselleştirilmiş iş stratejileri',
    tryAiAssistantFree: 'AI Asistanını Ücretsiz Deneyin',
    startConsultation: 'Danışmanlığa Başlayın',
    
    // Real-time Analytics
    realTimeAnalyticsTitle: 'Küresel Zeka Ağı',
    realTimeAnalyticsDescription: 'Dünya çapındaki iş danışmanları ağımızdan gerçek zamanlı içgörüler',
    activeConsultations: 'Aktif Danışmanlıklar',
    strategicJurisdictions: 'Stratejik Yargı Yetkileri',
    successRate: 'Başarı Oranı',
    avgResponseTime: 'Ort. Yanıt Süresi',
    aiPoweredMatching: 'AI Destekli Eşleştirme',
    aiMatchingDescription: 'Uzmanlığa dayalı akıllı danışman eşleştirmesi',
    legalCompliance: 'Yasal Uyumluluk',
    legalComplianceDescription: 'Tüm yargı yetkilerinde tam düzenleyici uyumluluk',
    successOptimization: 'Başarı Optimizasyonu',
    successOptimizationDescription: 'İş başarısı için kanıtlanmış stratejiler',
    joinThousandsTitle: 'Binlerce Başarılı Girişimciye Katılın',
    joinThousandsDescription: 'Uluslararası genişleme yolculuğunuza bugün başlayın',
    startYourJourney: 'Yolculuğunuza Başlayın',
    
    // Blog
    blogNewsTitle: 'Son İçgörüler ve Haberler',
    viewAllPosts: 'Tüm Yazıları Görüntüle',
    
    // Footer
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır.',
    powered: 'AI Oracle teknolojisi ile güçlendirilmiştir',
    
    // Search and filters
    searchPlaceholder: 'Ülkeleri arayın...',
    allRegions: 'Tüm Bölgeler',
    regionEurope: 'Avrupa',
    regionAsia: 'Asya',
    regionMiddleEast: 'Orta Doğu',
    regionAmericas: 'Amerika',
    
    // Countries page
    countriesHeroTitle: 'İş Dostu Destinasyonlar',
    countriesHeroDescription: 'Uluslararası iş için dünyanın en çekici yargı yetkilerini keşfedin',
    availableDestinations: 'Mevcut Destinasyonlar',
    noCountriesFoundTitle: 'Ülke bulunamadı',
    noCountriesFoundDesc: 'Arama kriterlerinizi ayarlamayı deneyin',
    featuredBadge: 'Öne Çıkan',
    corporateTax: 'Kurumlar Vergisi',
    learnMoreBtn: 'Daha Fazla Öğren',
    
    // Navigation dropdowns
    viewAllServices: 'Tüm Hizmetleri Görüntüle',
    viewAllCountries: 'Tüm Ülkeleri Görüntüle',
    
    // Process terms
    aiPoweredProcess: 'AI Destekli Süreç',
    endToEndSolutions: 'Uçtan Uca Çözümler',
    businessFriendlyJurisdictions: 'İş Dostu Yargı Yetkileri',
    globalIntelligenceNetwork: 'Küresel Zeka Ağı',
    experienceAiConsulting: 'AI Destekli Danışmanlığı Deneyimleyin',
    
    // Service page buttons
    viewAllServicesBtn: 'Tüm Hizmetleri Görüntüle',
    exploreAllCountriesBtn: 'Tüm Ülkeleri Keşfedin',
    
    // Homepage CTAs
    companyTitle: 'Şirket Kuruluşu',
    companySubtitle: '19+ ülkede hızlı, uyumlu iş kurulumu',
    companyFeature1: 'AI destekli yargı yetkisi analizi',
    companyFeature2: 'Uzman yerel rehberlik',
    companyFeature3: 'Bankacılık ve uyumluluk dahil',
    companyFeature4: 'Tam yasal dokümantasyon',
    companyCta: 'Şirket Kuruluşunu Başlat',
    
    wealthTitle: 'Matrix — Özel Servet',
    wealthSubtitle: 'AI destekli küresel tahsis ile ultra yüksek net değerli platform',
    wealthFeature1: 'AI güdümlü portföy analizi',
    wealthFeature2: 'Küresel yatırım fırsatları',
    wealthFeature3: 'Sıkı gizlilik protokolleri',
    wealthStat1: '$2.5B+ YVV',
    wealthStat2: '%98 Başarı',
    wealthCta: 'Matrix Wealth\'i Keşfedin',
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
    readMore: 'Leia Mais',
    contactUs: 'Entre em Contato',
    scheduleConsultation: 'Agendar Consulta',
    
    // Hero Section
    heroTitle1: 'Consultoria Empresarial Global com IA',
    heroSubtitle1: 'Expanda Internacionalmente',
    heroDescription1: 'Orientação especializada para expansão internacional de negócios. Plataforma com IA conectando você com consultores em 19+ países para otimização fiscal, formação de empresas e conformidade legal.',
    heroPrimaryCTA1: 'Inicie Sua Expansão',
    heroSecondaryCTA1: 'Explorar Serviços',
    
    heroTitle2: 'Consultores Especialistas em',
    heroSubtitle2: '19+ Países',
    heroDescription2: 'Conecte-se com especialistas locais que entendem regulamentações, bancos e cultura empresarial em seus mercados-alvo. Obtenha orientação personalizada para expansão internacional bem-sucedida.',
    heroPrimaryCTA2: 'Encontre Seu Consultor',
    heroSecondaryCTA2: 'Ver Países',
    
    heroTitle3: 'Assistente AI Oracle',
    heroSubtitle3: 'Recomendações Inteligentes',
    heroDescription3: 'Obtenha recomendações instantâneas de jurisdição, estratégias de otimização fiscal e conselhos de estrutura empresarial alimentados por tecnologia AI avançada e expertise do mundo real.',
    heroPrimaryCTA3: 'Experimente o Assistente AI',
    heroSecondaryCTA3: 'Saiba Mais',
    
    heroTitle4: 'Preços Transparentes',
    heroSubtitle4: 'Sem Taxas Ocultas',
    heroDescription4: 'Preços claros e antecipados sem surpresas. Pague apenas pelos serviços que precisa com estruturas de taxas transparentes e tarifas competitivas para serviços empresariais internacionais premium.',
    heroPrimaryCTA4: 'Ver Preços',
    heroSecondaryCTA4: 'Obter Cotação',
    
    heroTitle5: 'Seguro e Compatível',
    heroSubtitle5: 'Segurança Empresarial',
    heroDescription5: 'Segurança de nível bancário e total conformidade regulatória em todas as jurisdições. Suas informações empresariais sensíveis são protegidas com medidas de segurança de nível empresarial.',
    heroPrimaryCTA5: 'Detalhes de Segurança',
    heroSecondaryCTA5: 'Informações de Conformidade',
    
    // How It Works
    howItWorksTitle: 'Como Funciona',
    howItWorksDescription: 'Processo simples de 4 etapas para expandir seu negócio globalmente',
    step1Title: 'Descobrir Oportunidades',
    step1Description: 'AI Oracle analisa seu negócio e recomenda jurisdições ideais',
    step2Title: 'Ser Combinado',
    step2Description: 'Conecte-se com consultores especialistas em seus países-alvo',
    step3Title: 'Executar Estratégia',
    step3Description: 'Implemente seu plano de expansão com orientação profissional',
    step4Title: 'Escalar Globalmente',
    step4Description: 'Faça seu negócio crescer com suporte contínuo e conformidade',
    
    // Services
    servicesOverviewTitle: 'Serviços Empresariais Abrangentes',
    servicesOverviewDescription: 'Soluções completas para expansão internacional de negócios',
    companyFormationTitle: 'Formação de Empresa',
    companyFormationDesc: 'Serviços completos de configuração e incorporação de negócios',
    taxOptimizationTitle: 'Otimização Fiscal',
    taxOptimizationDesc: 'Planejamento fiscal estratégico e soluções de conformidade',
    bankingSolutionsTitle: 'Soluções Bancárias',
    bankingSolutionsDesc: 'Serviços globais de bancos e processamento de pagamentos',
    legalComplianceTitle: 'Conformidade Legal',
    legalComplianceDesc: 'Suporte legal e regulatório contínuo',
    assetProtectionTitle: 'Proteção de Ativos',
    assetProtectionDesc: 'Estratégias de proteção de riqueza e mitigação de riscos',
    investmentAdvisoryTitle: 'Consultoria de Investimento',
    investmentAdvisoryDesc: 'Gestão profissional de investimentos e patrimônio',
    visaResidencyTitle: 'Visto e Residência',
    visaResidencyDesc: 'Soluções de imigração e residência',
    marketResearchTitle: 'Pesquisa de Mercado',
    marketResearchDesc: 'Análise de mercado e inteligência empresarial',
    
    // Countries
    featuredCountriesTitle: 'Destinos Empresariais em Destaque',
    featuredCountriesDescription: 'Explore as jurisdições mais favoráveis aos negócios do mundo',
    unitedArabEmirates: 'Emirados Árabes Unidos',
    estonia: 'Estônia',
    georgia: 'Geórgia',
    malta: 'Malta',
    panama: 'Panamá',
    portugal: 'Portugal',
    unitedStates: 'Estados Unidos',
    switzerland: 'Suíça',
    
    // Country highlights
    uaeHighlight: '0% de imposto corporativo por 50 anos em zonas francas',
    estoniaHighlight: 'Programa de e-Residência 100% online',
    georgiaHighlight: 'Status de Pequena Empresa - 1% de imposto',
    maltaHighlight: 'Adesão à UE com taxa efetiva de 5% de imposto',
    panamaHighlight: 'Sistema fiscal territorial',
    portugalHighlight: 'Programa Golden Visa com residência na UE',
    usaHighlight: 'Maior economia e mercado do mundo',
    switzerlandHighlight: 'Estabilidade política e excelência bancária',
    
    // Country advantages
    noPersonalIncomeTax: 'Sem imposto de renda pessoal',
    strategicLocation: 'Localização estratégica',
    modernInfrastructure: 'Infraestrutura moderna',
    businessFriendlyRegulations: 'Regulamentações favoráveis aos negócios',
    digitalFirstApproach: 'Abordagem digital em primeiro lugar',
    euMarketAccess: 'Acesso ao mercado da UE',
    lowBureaucracy: 'Baixa burocracia',
    innovationFriendly: 'Amigável à inovação',
    simpleIncorporation: 'Incorporação simples',
    veryLowTaxes: 'Impostos muito baixos',
    fastSetup: 'Configuração rápida',
    blockchainFriendly: 'Amigável ao blockchain',
    englishSpeaking: 'Falante de inglês',
    strategicMediterraneanLocation: 'Localização estratégica no Mediterrâneo',
    territorialTaxation: 'Tributação territorial',
    strongBankingPrivacy: 'Forte privacidade bancária',
    usDollarEconomy: 'Economia em dólar americano',
    internationalBusinessHub: 'Centro de negócios internacional',
    nhrTaxProgram: 'Programa fiscal NHR',
    investmentImmigration: 'Imigração por investimento',
    strategicAtlanticLocation: 'Localização estratégica no Atlântico',
    largestConsumerMarket: 'Maior mercado consumidor',
    advancedInfrastructure: 'Infraestrutura avançada',
    innovationHub: 'Centro de inovação',
    strongLegalSystem: 'Sistema legal forte',
    politicalStability: 'Estabilidade política',
    worldClassBanking: 'Bancos de classe mundial',
    strategicEuLocation: 'Localização estratégica na UE',
    
    // AI Assistant
    aiOracleAssistant: 'Assistente AI Oracle',
    aiAssistantGreeting: 'Olá! Sou seu assistente AI Oracle. Posso ajudá-lo com expansão internacional de negócios. Que tipo de negócio você está procurando estabelecer?',
    aiAssistantPageTitle: 'Assistente AI Oracle',
    aiAssistantPageSubtitle: 'Obtenha recomendações instantâneas para sua expansão internacional de negócios',
    aiAssistantQuickStart: 'Início rápido:',
    aiAssistantQuick1: 'Quero começar uma empresa de tecnologia',
    aiAssistantQuick2: 'Procurando otimização fiscal',
    aiAssistantQuick3: 'Preciso de acesso ao mercado da UE',
    aiAssistantQuick4: 'Interessado em negócios cripto',
    aiAssistantPlaceholder: 'Digite sua mensagem...',
    aiAssistantReadyTitle: 'Pronto para Começar?',
    aiAssistantReadyDesc: 'Conecte-se com nossos consultores especialistas para iniciar sua expansão',
    createFreeAccount: 'Criar Conta Gratuita',
    send: 'Enviar',
    online: 'Online',
    
    // AI Promotion
    aiPoweredIntelligence: 'Inteligência com IA',
    aiPromotionTitle: 'Conheça Seu Assistente AI Oracle',
    aiPromotionDescription: 'Obtenha recomendações instantâneas de jurisdição e correspondência de especialistas alimentadas por IA avançada',
    instantJurisdictionRecommendations: 'Recomendações instantâneas de jurisdição',
    aiPoweredExpertMatching: 'Correspondência de especialistas com IA',
    personalizedBusinessStrategies: 'Estratégias empresariais personalizadas',
    tryAiAssistantFree: 'Experimente o Assistente AI Grátis',
    startConsultation: 'Iniciar Consulta',
    
    // Real-time Analytics
    realTimeAnalyticsTitle: 'Rede de Inteligência Global',
    realTimeAnalyticsDescription: 'Insights em tempo real de nossa rede mundial de consultores empresariais',
    activeConsultations: 'Consultas Ativas',
    strategicJurisdictions: 'Jurisdições Estratégicas',
    successRate: 'Taxa de Sucesso',
    avgResponseTime: 'Tempo Médio de Resposta',
    aiPoweredMatching: 'Correspondência com IA',
    aiMatchingDescription: 'Correspondência inteligente de consultores baseada em expertise',
    legalCompliance: 'Conformidade Legal',
    legalComplianceDescription: 'Conformidade regulatória completa em todas as jurisdições',
    successOptimization: 'Otimização de Sucesso',
    successOptimizationDescription: 'Estratégias comprovadas para sucesso empresarial',
    joinThousandsTitle: 'Junte-se a Milhares de Empreendedores Bem-Sucedidos',
    joinThousandsDescription: 'Inicie sua jornada de expansão internacional hoje',
    startYourJourney: 'Inicie Sua Jornada',
    
    // Blog
    blogNewsTitle: 'Últimas Insights e Notícias',
    viewAllPosts: 'Ver Todas as Postagens',
    
    // Footer
    copyright: '© 2025 Consulting19. Todos os direitos reservados.',
    powered: 'Alimentado pela tecnologia AI Oracle',
    
    // Search and filters
    searchPlaceholder: 'Pesquisar países...',
    allRegions: 'Todas as Regiões',
    regionEurope: 'Europa',
    regionAsia: 'Ásia',
    regionMiddleEast: 'Oriente Médio',
    regionAmericas: 'Américas',
    
    // Countries page
    countriesHeroTitle: 'Destinos Favoráveis aos Negócios',
    countriesHeroDescription: 'Explore as jurisdições mais atrativas do mundo para negócios internacionais',
    availableDestinations: 'Destinos Disponíveis',
    noCountriesFoundTitle: 'Nenhum país encontrado',
    noCountriesFoundDesc: 'Tente ajustar seus critérios de pesquisa',
    featuredBadge: 'Destaque',
    corporateTax: 'Imposto Corporativo',
    learnMoreBtn: 'Saiba Mais',
    
    // Navigation dropdowns
    viewAllServices: 'Ver Todos os Serviços',
    viewAllCountries: 'Ver Todos os Países',
    
    // Process terms
    aiPoweredProcess: 'Processo com IA',
    endToEndSolutions: 'Soluções Completas',
    businessFriendlyJurisdictions: 'Jurisdições Favoráveis aos Negócios',
    globalIntelligenceNetwork: 'Rede de Inteligência Global',
    experienceAiConsulting: 'Experimente Consultoria com IA',
    
    // Service page buttons
    viewAllServicesBtn: 'Ver Todos os Serviços',
    exploreAllCountriesBtn: 'Explorar Todos os Países',
    
    // Homepage CTAs
    companyTitle: 'Formação de Empresa',
    companySubtitle: 'Configuração de negócios rápida e compatível em 19+ países',
    companyFeature1: 'Análise de jurisdição com IA',
    companyFeature2: 'Orientação especializada local',
    companyFeature3: 'Bancos e conformidade incluídos',
    companyFeature4: 'Documentação legal completa',
    companyCta: 'Iniciar Formação de Empresa',
    
    wealthTitle: 'Matrix — Riqueza Privada',
    wealthSubtitle: 'Plataforma ultra-alta-net-worth com alocação global assistida por IA',
    wealthFeature1: 'Análise de portfólio orientada por IA',
    wealthFeature2: 'Oportunidades de investimento global',
    wealthFeature3: 'Protocolos de confidencialidade rigorosos',
    wealthStat1: '$2.5B+ AUM',
    wealthStat2: '98% Sucesso',
    wealthCta: 'Explorar Matrix Wealth',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('consulting19-language') as Language;
    if (savedLanguage && ['en', 'tr', 'pt'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('consulting19-language', lang);
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