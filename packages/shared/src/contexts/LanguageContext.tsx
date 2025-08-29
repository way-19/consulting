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
    
    // Hero Section
    heroTitle1: 'AI-Powered Global Business Consulting',
    heroSubtitle1: 'Expert Guidance Worldwide',
    heroDescription1: 'Connect with expert advisors in 19+ countries for seamless international business expansion, tax optimization, and legal compliance.',
    heroPrimaryCTA1: 'Start Your Expansion',
    heroSecondaryCTA1: 'Explore Services',
    
    heroTitle2: 'Expand Your Business',
    heroSubtitle2: 'Across 19+ Countries',
    heroDescription2: 'From company formation to banking solutions, our AI-powered platform connects you with local experts for successful international growth.',
    heroPrimaryCTA2: 'Get Started Today',
    heroSecondaryCTA2: 'View Countries',
    
    heroTitle3: 'Smart International',
    heroSubtitle3: 'Business Solutions',
    heroDescription3: 'Leverage AI intelligence and expert knowledge to navigate complex international regulations and optimize your global business strategy.',
    heroPrimaryCTA3: 'Discover Solutions',
    heroSecondaryCTA3: 'Learn More',
    
    heroTitle4: 'Global Expansion',
    heroSubtitle4: 'Made Simple',
    heroDescription4: 'Transform your business vision into reality with our comprehensive international expansion services and expert guidance.',
    heroPrimaryCTA4: 'Begin Journey',
    heroSecondaryCTA4: 'Explore Options',
    
    heroTitle5: 'Your Gateway to',
    heroSubtitle5: 'International Success',
    heroDescription5: 'Join thousands of successful entrepreneurs who have expanded globally with our AI-powered consulting platform.',
    heroPrimaryCTA5: 'Join Now',
    heroSecondaryCTA5: 'See Success Stories',
    
    // AI Assistant
    aiPoweredIntelligence: 'AI-Powered Intelligence',
    aiOracleAssistant: 'AI Oracle Assistant',
    online: 'Online',
    aiAssistantGreeting: 'Hello! I\'m your AI Oracle assistant. I can help you with international business expansion. What type of business are you looking to establish?',
    aiAssistantPlaceholder: 'Type your message...',
    aiAssistantQuickStart: 'Quick start:',
    aiAssistantQuick1: 'I want to start a tech company',
    aiAssistantQuick2: 'Looking for tax optimization',
    aiAssistantQuick3: 'Need EU market access',
    aiAssistantQuick4: 'Interested in crypto business',
    send: 'Send',
    
    // Services
    companyFormation: 'Company Formation',
    taxOptimization: 'Tax Optimization',
    bankingSolutions: 'Banking Solutions',
    legalCompliance: 'Legal Compliance',
    assetProtection: 'Asset Protection',
    investmentAdvisory: 'Investment Advisory',
    viewAllServices: 'View All Services',
    
    // Countries
    availableDestinations: 'Available Destinations',
    searchPlaceholder: 'Search countries...',
    allRegions: 'All Regions',
    regionEurope: 'Europe',
    regionAsia: 'Asia',
    regionMiddleEast: 'Middle East',
    regionAmericas: 'Americas',
    featuredBadge: 'Featured',
    corporateTax: 'Corporate Tax',
    learnMoreBtn: 'Learn More',
    noCountriesFoundTitle: 'No Countries Found',
    noCountriesFoundDesc: 'Try adjusting your search or filter criteria.',
    
    // Country Names
    unitedArabEmirates: 'United Arab Emirates',
    estonia: 'Estonia',
    georgia: 'Georgia',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portugal',
    unitedStates: 'United States',
    switzerland: 'Switzerland',
    
    // Country Highlights
    uaeHighlight: '0% corporate tax for 50 years in free zones',
    estoniaHighlight: '100% online e-Residency program',
    georgiaHighlight: 'Small Business Status - 1% tax',
    maltaHighlight: 'EU membership with 5% effective tax rate',
    panamaHighlight: 'Territorial tax system',
    portugalHighlight: 'Golden Visa program with EU residency',
    usaHighlight: 'World\'s largest economy and market',
    switzerlandHighlight: 'Political stability and banking excellence',
    
    // Country Advantages
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
    
    // How It Works
    howItWorksTitle: 'How It Works',
    howItWorksDescription: 'Simple 4-step process powered by AI intelligence',
    aiPoweredProcess: 'AI-Powered Process',
    step1Title: 'Discover Your Needs',
    step1Description: 'AI Oracle analyzes your business goals and recommends optimal jurisdictions',
    step2Title: 'AI-Powered Matching',
    step2Description: 'Get instantly matched with expert advisors in your chosen countries',
    step3Title: 'Expert Consultation',
    step3Description: 'Work directly with local specialists who understand your target markets',
    step4Title: 'Global Success',
    step4Description: 'Launch your international business with full compliance and support',
    experienceAiConsulting: 'Experience AI-Powered Consulting',
    
    // Services Overview
    servicesOverviewTitle: 'Comprehensive Business Services',
    servicesOverviewDescription: 'End-to-end solutions for international business expansion',
    endToEndSolutions: 'End-to-End Solutions',
    companyFormationTitle: 'Company Formation',
    companyFormationDesc: 'Complete business setup and incorporation services',
    taxOptimizationTitle: 'Tax Optimization',
    taxOptimizationDesc: 'Strategic international tax planning and compliance',
    bankingSolutionsTitle: 'Banking Solutions',
    bankingSolutionsDesc: 'Global banking and payment processing setup',
    legalComplianceTitle: 'Legal Compliance',
    legalComplianceDesc: 'Ongoing legal and regulatory support',
    assetProtectionTitle: 'Asset Protection',
    assetProtectionDesc: 'Trusts, foundations, and wealth preservation',
    investmentAdvisoryTitle: 'Investment Advisory',
    investmentAdvisoryDesc: 'Portfolio management and investment strategies',
    visaResidencyTitle: 'Visa & Residency',
    visaResidencyDesc: 'Immigration and residency solutions',
    marketResearchTitle: 'Market Research',
    marketResearchDesc: 'Market analysis and business intelligence',
    viewAllServicesBtn: 'View All Services',
    
    // Featured Countries
    featuredCountriesTitle: 'Business-Friendly Destinations',
    featuredCountriesDescription: 'Explore premier jurisdictions for international business expansion',
    businessFriendlyJurisdictions: 'Business-Friendly Jurisdictions',
    learnMore: 'Learn More',
    exploreAllCountriesBtn: 'Explore All Countries',
    
    // AI Promotion
    aiPromotionTitle: 'Meet Your AI Oracle Assistant',
    aiPromotionDescription: 'Get instant jurisdiction recommendations and expert matching powered by advanced AI',
    instantJurisdictionRecommendations: 'Instant jurisdiction recommendations',
    aiPoweredExpertMatching: 'AI-powered expert matching',
    personalizedBusinessStrategies: 'Personalized business strategies',
    tryAiAssistantFree: 'Try AI Assistant Free',
    
    // Real-time Analytics
    realTimeAnalyticsTitle: 'Real-Time Global Intelligence',
    realTimeAnalyticsDescription: 'Live insights from our global network of business advisors and AI systems',
    globalIntelligenceNetwork: 'Global Intelligence Network',
    activeConsultations: 'Active Consultations',
    strategicJurisdictions: 'Strategic Jurisdictions',
    successRate: 'Success Rate',
    avgResponseTime: 'Avg Response Time',
    aiPoweredMatching: 'AI-Powered Matching',
    aiMatchingDescription: 'Smart advisor-client matching',
    legalCompliance: 'Legal Compliance',
    legalComplianceDescription: 'Automated compliance monitoring',
    successOptimization: 'Success Optimization',
    successOptimizationDescription: 'Data-driven outcome improvement',
    joinThousandsTitle: 'Join Thousands of Successful Entrepreneurs',
    joinThousandsDescription: 'Experience the future of international business consulting',
    startYourJourney: 'Start Your Journey',
    
    // Blog
    blogNewsTitle: 'Latest Insights & News',
    viewAllPosts: 'View All Posts',
    
    // Countries Page
    countriesHeroTitle: 'Choose Your Business Destination',
    countriesHeroDescription: 'Explore business-friendly countries with expert local support',
    
    // AI Assistant Page
    aiAssistantPageTitle: 'AI Oracle Assistant',
    aiAssistantPageSubtitle: 'Get instant recommendations for your international business expansion',
    aiAssistantReadyTitle: 'Ready to Get Started?',
    aiAssistantReadyDesc: 'Create a free account to access our full platform and connect with expert advisors.',
    createFreeAccount: 'Create Free Account',
    startConsultation: 'Start Consultation',
    
    // Footer
    copyright: '© 2025 Consulting19. All rights reserved.',
    powered: 'Powered by AI Oracle technology',
    
    // Wealth Management CTA
    wealthTitle: 'Matrix — Private Wealth Platform',
    wealthSubtitle: 'A privacy-first platform for ultra-high-net-worth clients. AI-assisted global allocation, multi-jurisdiction banking, and discreet execution.',
    wealthFeature1: 'AI-driven analysis',
    wealthFeature2: 'Global opportunities',
    wealthFeature3: 'Strict confidentiality',
    wealthStat1: '$5M min',
    wealthStat2: '98% success',
    wealthCta: 'Explore Matrix Wealth',
    
    // Company Formation CTA
    companyTitle: 'Company Formation Services',
    companySubtitle: 'Fast, compliant business setup in 19+ countries with expert guidance and AI-powered process automation.',
    companyFeature1: 'AI-powered jurisdiction analysis',
    companyFeature2: 'Expert local advisors',
    companyFeature3: 'Complete compliance support',
    companyFeature4: 'Banking integration',
    companyCta: 'Start Company Formation',
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
    
    // Hero Section
    heroTitle1: 'AI Destekli Küresel İş Danışmanlığı',
    heroSubtitle1: 'Dünya Çapında Uzman Rehberlik',
    heroDescription1: '19+ ülkede uzman danışmanlarla sorunsuz uluslararası iş genişlemesi, vergi optimizasyonu ve yasal uyumluluk için bağlantı kurun.',
    heroPrimaryCTA1: 'Genişlemenizi Başlatın',
    heroSecondaryCTA1: 'Hizmetleri Keşfedin',
    
    heroTitle2: 'İşinizi Genişletin',
    heroSubtitle2: '19+ Ülkede',
    heroDescription2: 'Şirket kuruluşundan bankacılık çözümlerine kadar, AI destekli platformumuz sizi başarılı uluslararası büyüme için yerel uzmanlarla buluşturuyor.',
    heroPrimaryCTA2: 'Bugün Başlayın',
    heroSecondaryCTA2: 'Ülkeleri Görüntüle',
    
    heroTitle3: 'Akıllı Uluslararası',
    heroSubtitle3: 'İş Çözümleri',
    heroDescription3: 'Karmaşık uluslararası düzenlemelerde gezinmek ve küresel iş stratejinizi optimize etmek için AI zekası ve uzman bilgisinden yararlanın.',
    heroPrimaryCTA3: 'Çözümleri Keşfedin',
    heroSecondaryCTA3: 'Daha Fazla Öğrenin',
    
    heroTitle4: 'Küresel Genişleme',
    heroSubtitle4: 'Basitleştirildi',
    heroDescription4: 'Kapsamlı uluslararası genişleme hizmetlerimiz ve uzman rehberliğimizle iş vizyonunuzu gerçeğe dönüştürün.',
    heroPrimaryCTA4: 'Yolculuğa Başlayın',
    heroSecondaryCTA4: 'Seçenekleri Keşfedin',
    
    heroTitle5: 'Uluslararası Başarıya',
    heroSubtitle5: 'Geçidiniz',
    heroDescription5: 'AI destekli danışmanlık platformumuzla küresel olarak genişleyen binlerce başarılı girişimciye katılın.',
    heroPrimaryCTA5: 'Şimdi Katılın',
    heroSecondaryCTA5: 'Başarı Hikayelerini Görün',
    
    // AI Assistant
    aiPoweredIntelligence: 'AI Destekli Zeka',
    aiOracleAssistant: 'AI Oracle Asistan',
    online: 'Çevrimiçi',
    aiAssistantGreeting: 'Merhaba! Ben AI Oracle asistanınızım. Uluslararası iş genişlemeniz için size yardımcı olabilirim. Hangi tür bir iş kurmak istiyorsunuz?',
    aiAssistantPlaceholder: 'Mesajınızı yazın...',
    aiAssistantQuickStart: 'Hızlı başlangıç:',
    aiAssistantQuick1: 'Teknoloji şirketi kurmak istiyorum',
    aiAssistantQuick2: 'Vergi optimizasyonu arıyorum',
    aiAssistantQuick3: 'AB pazarına erişim istiyorum',
    aiAssistantQuick4: 'Kripto işi yapmak istiyorum',
    send: 'Gönder',
    
    // Services
    companyFormation: 'Şirket Kuruluşu',
    taxOptimization: 'Vergi Optimizasyonu',
    bankingSolutions: 'Bankacılık Çözümleri',
    legalCompliance: 'Yasal Uyumluluk',
    assetProtection: 'Varlık Koruması',
    investmentAdvisory: 'Yatırım Danışmanlığı',
    viewAllServices: 'Tüm Hizmetleri Görüntüle',
    
    // Countries
    availableDestinations: 'Mevcut Destinasyonlar',
    searchPlaceholder: 'Ülke ara...',
    allRegions: 'Tüm Bölgeler',
    regionEurope: 'Avrupa',
    regionAsia: 'Asya',
    regionMiddleEast: 'Orta Doğu',
    regionAmericas: 'Amerika',
    featuredBadge: 'Öne Çıkan',
    corporateTax: 'Kurumlar Vergisi',
    learnMoreBtn: 'Daha Fazla Bilgi',
    noCountriesFoundTitle: 'Ülke Bulunamadı',
    noCountriesFoundDesc: 'Arama veya filtre kriterlerinizi ayarlamayı deneyin.',
    
    // Country Names
    unitedArabEmirates: 'Birleşik Arap Emirlikleri',
    estonia: 'Estonya',
    georgia: 'Gürcistan',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portekiz',
    unitedStates: 'Amerika Birleşik Devletleri',
    switzerland: 'İsviçre',
    
    // Country Highlights
    uaeHighlight: 'Serbest bölgelerde 50 yıl boyunca %0 kurumlar vergisi',
    estoniaHighlight: '%100 online e-Residency programı',
    georgiaHighlight: 'Küçük İşletme Statüsü - %1 vergi',
    maltaHighlight: '%5 efektif vergi oranı ile AB üyeliği',
    panamaHighlight: 'Bölgesel vergi sistemi',
    portugalHighlight: 'AB ikamet hakkı ile Altın Vize programı',
    usaHighlight: 'Dünyanın en büyük ekonomisi ve pazarı',
    switzerlandHighlight: 'Politik istikrar ve bankacılık mükemmelliği',
    
    // Country Advantages
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
    investmentImmigration: 'Yatırım göçü',
    strategicAtlanticLocation: 'Stratejik Atlantik konumu',
    largestConsumerMarket: 'En büyük tüketici pazarı',
    advancedInfrastructure: 'Gelişmiş altyapı',
    innovationHub: 'İnovasyon merkezi',
    strongLegalSystem: 'Güçlü hukuk sistemi',
    politicalStability: 'Politik istikrar',
    worldClassBanking: 'Dünya standartlarında bankacılık',
    strategicEuLocation: 'Stratejik AB konumu',
    
    // How It Works
    howItWorksTitle: 'Nasıl Çalışır',
    howItWorksDescription: 'AI zekası ile desteklenen basit 4 adımlı süreç',
    aiPoweredProcess: 'AI Destekli Süreç',
    step1Title: 'İhtiyaçlarınızı Keşfedin',
    step1Description: 'AI Oracle iş hedeflerinizi analiz eder ve optimal yargı alanlarını önerir',
    step2Title: 'AI Destekli Eşleştirme',
    step2Description: 'Seçtiğiniz ülkelerdeki uzman danışmanlarla anında eşleşin',
    step3Title: 'Uzman Danışmanlığı',
    step3Description: 'Hedef pazarlarınızı anlayan yerel uzmanlarla doğrudan çalışın',
    step4Title: 'Küresel Başarı',
    step4Description: 'Tam uyumluluk ve destekle uluslararası işinizi başlatın',
    experienceAiConsulting: 'AI Destekli Danışmanlığı Deneyimleyin',
    
    // Services Overview
    servicesOverviewTitle: 'Kapsamlı İş Hizmetleri',
    servicesOverviewDescription: 'Uluslararası iş genişlemesi için uçtan uca çözümler',
    endToEndSolutions: 'Uçtan Uca Çözümler',
    companyFormationTitle: 'Şirket Kuruluşu',
    companyFormationDesc: 'Tam iş kurulumu ve kuruluş hizmetleri',
    taxOptimizationTitle: 'Vergi Optimizasyonu',
    taxOptimizationDesc: 'Stratejik uluslararası vergi planlaması ve uyumluluk',
    bankingSolutionsTitle: 'Bankacılık Çözümleri',
    bankingSolutionsDesc: 'Küresel bankacılık ve ödeme işleme kurulumu',
    legalComplianceTitle: 'Yasal Uyumluluk',
    legalComplianceDesc: 'Sürekli yasal ve düzenleyici destek',
    assetProtectionTitle: 'Varlık Koruması',
    assetProtectionDesc: 'Tröstler, vakıflar ve servet koruması',
    investmentAdvisoryTitle: 'Yatırım Danışmanlığı',
    investmentAdvisoryDesc: 'Portföy yönetimi ve yatırım stratejileri',
    visaResidencyTitle: 'Vize ve İkamet',
    visaResidencyDesc: 'Göçmenlik ve ikamet çözümleri',
    marketResearchTitle: 'Pazar Araştırması',
    marketResearchDesc: 'Pazar analizi ve iş zekası',
    viewAllServicesBtn: 'Tüm Hizmetleri Görüntüle',
    
    // Featured Countries
    featuredCountriesTitle: 'İş Dostu Destinasyonlar',
    featuredCountriesDescription: 'Uluslararası iş genişlemesi için önde gelen yargı alanlarını keşfedin',
    businessFriendlyJurisdictions: 'İş Dostu Yargı Alanları',
    learnMore: 'Daha Fazla Öğren',
    exploreAllCountriesBtn: 'Tüm Ülkeleri Keşfedin',
    
    // AI Promotion
    aiPromotionTitle: 'AI Oracle Asistanınızla Tanışın',
    aiPromotionDescription: 'Gelişmiş AI ile desteklenen anında yargı alanı önerileri ve uzman eşleştirmesi alın',
    instantJurisdictionRecommendations: 'Anında yargı alanı önerileri',
    aiPoweredExpertMatching: 'AI destekli uzman eşleştirmesi',
    personalizedBusinessStrategies: 'Kişiselleştirilmiş iş stratejileri',
    tryAiAssistantFree: 'AI Asistanı Ücretsiz Deneyin',
    
    // Real-time Analytics
    realTimeAnalyticsTitle: 'Gerçek Zamanlı Küresel Zeka',
    realTimeAnalyticsDescription: 'Küresel iş danışmanları ağımızdan ve AI sistemlerinden canlı içgörüler',
    globalIntelligenceNetwork: 'Küresel Zeka Ağı',
    activeConsultations: 'Aktif Danışmanlıklar',
    strategicJurisdictions: 'Stratejik Yargı Alanları',
    successRate: 'Başarı Oranı',
    avgResponseTime: 'Ort. Yanıt Süresi',
    aiPoweredMatching: 'AI Destekli Eşleştirme',
    aiMatchingDescription: 'Akıllı danışman-müşteri eşleştirmesi',
    legalCompliance: 'Yasal Uyumluluk',
    legalComplianceDescription: 'Otomatik uyumluluk izleme',
    successOptimization: 'Başarı Optimizasyonu',
    successOptimizationDescription: 'Veri odaklı sonuç iyileştirme',
    joinThousandsTitle: 'Binlerce Başarılı Girişimciye Katılın',
    joinThousandsDescription: 'Uluslararası iş danışmanlığının geleceğini deneyimleyin',
    startYourJourney: 'Yolculuğunuzu Başlatın',
    
    // Blog
    blogNewsTitle: 'Son İçgörüler ve Haberler',
    viewAllPosts: 'Tüm Yazıları Görüntüle',
    
    // Countries Page
    countriesHeroTitle: 'İş Destinasyonunuzu Seçin',
    countriesHeroDescription: 'Uzman yerel destekle iş dostu ülkeleri keşfedin',
    
    // AI Assistant Page
    aiAssistantPageTitle: 'AI Oracle Asistan',
    aiAssistantPageSubtitle: 'Uluslararası iş genişlemeniz için anında öneriler alın',
    aiAssistantReadyTitle: 'Başlamaya Hazır mısınız?',
    aiAssistantReadyDesc: 'Tam platformumuza erişmek ve uzman danışmanlarla bağlantı kurmak için ücretsiz hesap oluşturun.',
    createFreeAccount: 'Ücretsiz Hesap Oluştur',
    startConsultation: 'Danışmanlığa Başla',
    
    // Footer
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır.',
    powered: 'AI Oracle teknolojisi ile güçlendirilmiştir',
    
    // Wealth Management CTA
    wealthTitle: 'Matrix — Özel Servet Platformu',
    wealthSubtitle: 'Ultra yüksek net değerli müşteriler için gizlilik odaklı platform. AI destekli küresel tahsis, çoklu yargı bankacılığı ve gizli uygulama.',
    wealthFeature1: 'AI odaklı analiz',
    wealthFeature2: 'Küresel fırsatlar',
    wealthFeature3: 'Sıkı gizlilik',
    wealthStat1: '5M$ min',
    wealthStat2: '%98 başarı',
    wealthCta: 'Matrix Wealth\'i Keşfedin',
    
    // Company Formation CTA
    companyTitle: 'Şirket Kuruluş Hizmetleri',
    companySubtitle: '19+ ülkede uzman rehberlik ve AI destekli süreç otomasyonu ile hızlı, uyumlu iş kurulumu.',
    companyFeature1: 'AI destekli yargı alanı analizi',
    companyFeature2: 'Uzman yerel danışmanlar',
    companyFeature3: 'Tam uyumluluk desteği',
    companyFeature4: 'Bankacılık entegrasyonu',
    companyCta: 'Şirket Kuruluşunu Başlat',
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
    
    // Hero Section
    heroTitle1: 'Consultoria Empresarial Global com IA',
    heroSubtitle1: 'Orientação Especializada Mundial',
    heroDescription1: 'Conecte-se com consultores especialistas em 19+ países para expansão internacional de negócios, otimização fiscal e conformidade legal.',
    heroPrimaryCTA1: 'Inicie Sua Expansão',
    heroSecondaryCTA1: 'Explorar Serviços',
    
    heroTitle2: 'Expanda Seu Negócio',
    heroSubtitle2: 'Em 19+ Países',
    heroDescription2: 'Da formação de empresas às soluções bancárias, nossa plataforma com IA conecta você com especialistas locais para crescimento internacional bem-sucedido.',
    heroPrimaryCTA2: 'Comece Hoje',
    heroSecondaryCTA2: 'Ver Países',
    
    heroTitle3: 'Soluções Empresariais',
    heroSubtitle3: 'Internacionais Inteligentes',
    heroDescription3: 'Aproveite a inteligência da IA e o conhecimento especializado para navegar em regulamentações internacionais complexas e otimizar sua estratégia de negócios global.',
    heroPrimaryCTA3: 'Descobrir Soluções',
    heroSecondaryCTA3: 'Saiba Mais',
    
    heroTitle4: 'Expansão Global',
    heroSubtitle4: 'Simplificada',
    heroDescription4: 'Transforme sua visão de negócios em realidade com nossos serviços abrangentes de expansão internacional e orientação especializada.',
    heroPrimaryCTA4: 'Iniciar Jornada',
    heroSecondaryCTA4: 'Explorar Opções',
    
    heroTitle5: 'Seu Portal para o',
    heroSubtitle5: 'Sucesso Internacional',
    heroDescription5: 'Junte-se a milhares de empreendedores bem-sucedidos que expandiram globalmente com nossa plataforma de consultoria com IA.',
    heroPrimaryCTA5: 'Junte-se Agora',
    heroSecondaryCTA5: 'Ver Histórias de Sucesso',
    
    // AI Assistant
    aiPoweredIntelligence: 'Inteligência com IA',
    aiOracleAssistant: 'Assistente AI Oracle',
    online: 'Online',
    aiAssistantGreeting: 'Olá! Sou seu assistente AI Oracle. Posso ajudá-lo com expansão internacional de negócios. Que tipo de negócio você está procurando estabelecer?',
    aiAssistantPlaceholder: 'Digite sua mensagem...',
    aiAssistantQuickStart: 'Início rápido:',
    aiAssistantQuick1: 'Quero começar uma empresa de tecnologia',
    aiAssistantQuick2: 'Procurando otimização fiscal',
    aiAssistantQuick3: 'Preciso de acesso ao mercado da UE',
    aiAssistantQuick4: 'Interessado em negócios cripto',
    send: 'Enviar',
    
    // Services
    companyFormation: 'Formação de Empresa',
    taxOptimization: 'Otimização Fiscal',
    bankingSolutions: 'Soluções Bancárias',
    legalCompliance: 'Conformidade Legal',
    assetProtection: 'Proteção de Ativos',
    investmentAdvisory: 'Consultoria de Investimento',
    viewAllServices: 'Ver Todos os Serviços',
    
    // Countries
    availableDestinations: 'Destinos Disponíveis',
    searchPlaceholder: 'Pesquisar países...',
    allRegions: 'Todas as Regiões',
    regionEurope: 'Europa',
    regionAsia: 'Ásia',
    regionMiddleEast: 'Oriente Médio',
    regionAmericas: 'Américas',
    featuredBadge: 'Destaque',
    corporateTax: 'Imposto Corporativo',
    learnMoreBtn: 'Saiba Mais',
    noCountriesFoundTitle: 'Nenhum País Encontrado',
    noCountriesFoundDesc: 'Tente ajustar seus critérios de pesquisa ou filtro.',
    
    // Country Names
    unitedArabEmirates: 'Emirados Árabes Unidos',
    estonia: 'Estônia',
    georgia: 'Geórgia',
    malta: 'Malta',
    panama: 'Panamá',
    portugal: 'Portugal',
    unitedStates: 'Estados Unidos',
    switzerland: 'Suíça',
    
    // Country Highlights
    uaeHighlight: '0% de imposto corporativo por 50 anos em zonas francas',
    estoniaHighlight: 'Programa de e-Residência 100% online',
    georgiaHighlight: 'Status de Pequena Empresa - 1% de imposto',
    maltaHighlight: 'Membro da UE com taxa efetiva de 5%',
    panamaHighlight: 'Sistema tributário territorial',
    portugalHighlight: 'Programa Golden Visa com residência na UE',
    usaHighlight: 'Maior economia e mercado do mundo',
    switzerlandHighlight: 'Estabilidade política e excelência bancária',
    
    // Country Advantages
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
    usDollarEconomy: 'Economia do dólar americano',
    internationalBusinessHub: 'Centro de negócios internacional',
    nhrTaxProgram: 'Programa fiscal NHR',
    investmentImmigration: 'Imigração por investimento',
    strategicAtlanticLocation: 'Localização estratégica no Atlântico',
    largestConsumerMarket: 'Maior mercado consumidor',
    advancedInfrastructure: 'Infraestrutura avançada',
    innovationHub: 'Centro de inovação',
    strongLegalSystem: 'Sistema legal forte',
    politicalStability: 'Estabilidade política',
    worldClassBanking: 'Bancário de classe mundial',
    strategicEuLocation: 'Localização estratégica na UE',
    
    // How It Works
    howItWorksTitle: 'Como Funciona',
    howItWorksDescription: 'Processo simples de 4 etapas alimentado por inteligência IA',
    aiPoweredProcess: 'Processo com IA',
    step1Title: 'Descubra Suas Necessidades',
    step1Description: 'AI Oracle analisa seus objetivos de negócios e recomenda jurisdições ideais',
    step2Title: 'Correspondência com IA',
    step2Description: 'Seja instantaneamente combinado com consultores especialistas em seus países escolhidos',
    step3Title: 'Consultoria Especializada',
    step3Description: 'Trabalhe diretamente com especialistas locais que entendem seus mercados-alvo',
    step4Title: 'Sucesso Global',
    step4Description: 'Lance seu negócio internacional com total conformidade e suporte',
    experienceAiConsulting: 'Experimente a Consultoria com IA',
    
    // Services Overview
    servicesOverviewTitle: 'Serviços Empresariais Abrangentes',
    servicesOverviewDescription: 'Soluções completas para expansão internacional de negócios',
    endToEndSolutions: 'Soluções Completas',
    companyFormationTitle: 'Formação de Empresa',
    companyFormationDesc: 'Configuração completa de negócios e serviços de incorporação',
    taxOptimizationTitle: 'Otimização Fiscal',
    taxOptimizationDesc: 'Planejamento fiscal internacional estratégico e conformidade',
    bankingSolutionsTitle: 'Soluções Bancárias',
    bankingSolutionsDesc: 'Configuração global de processamento bancário e de pagamentos',
    legalComplianceTitle: 'Conformidade Legal',
    legalComplianceDesc: 'Suporte legal e regulatório contínuo',
    assetProtectionTitle: 'Proteção de Ativos',
    assetProtectionDesc: 'Trusts, fundações e preservação de riqueza',
    investmentAdvisoryTitle: 'Consultoria de Investimento',
    investmentAdvisoryDesc: 'Gestão de portfólio e estratégias de investimento',
    visaResidencyTitle: 'Visto e Residência',
    visaResidencyDesc: 'Soluções de imigração e residência',
    marketResearchTitle: 'Pesquisa de Mercado',
    marketResearchDesc: 'Análise de mercado e inteligência empresarial',
    viewAllServicesBtn: 'Ver Todos os Serviços',
    
    // Featured Countries
    featuredCountriesTitle: 'Destinos Favoráveis aos Negócios',
    featuredCountriesDescription: 'Explore jurisdições de primeira linha para expansão internacional de negócios',
    businessFriendlyJurisdictions: 'Jurisdições Favoráveis aos Negócios',
    learnMore: 'Saiba Mais',
    exploreAllCountriesBtn: 'Explorar Todos os Países',
    
    // AI Promotion
    aiPromotionTitle: 'Conheça Seu Assistente AI Oracle',
    aiPromotionDescription: 'Obtenha recomendações instantâneas de jurisdição e correspondência de especialistas alimentada por IA avançada',
    instantJurisdictionRecommendations: 'Recomendações instantâneas de jurisdição',
    aiPoweredExpertMatching: 'Correspondência de especialistas com IA',
    personalizedBusinessStrategies: 'Estratégias de negócios personalizadas',
    tryAiAssistantFree: 'Experimente o Assistente IA Grátis',
    
    // Real-time Analytics
    realTimeAnalyticsTitle: 'Inteligência Global em Tempo Real',
    realTimeAnalyticsDescription: 'Insights ao vivo de nossa rede global de consultores de negócios e sistemas de IA',
    globalIntelligenceNetwork: 'Rede de Inteligência Global',
    activeConsultations: 'Consultas Ativas',
    strategicJurisdictions: 'Jurisdições Estratégicas',
    successRate: 'Taxa de Sucesso',
    avgResponseTime: 'Tempo Médio de Resposta',
    aiPoweredMatching: 'Correspondência com IA',
    aiMatchingDescription: 'Correspondência inteligente consultor-cliente',
    legalCompliance: 'Conformidade Legal',
    legalComplianceDescription: 'Monitoramento automatizado de conformidade',
    successOptimization: 'Otimização de Sucesso',
    successOptimizationDescription: 'Melhoria de resultados baseada em dados',
    joinThousandsTitle: 'Junte-se a Milhares de Empreendedores Bem-Sucedidos',
    joinThousandsDescription: 'Experimente o futuro da consultoria empresarial internacional',
    startYourJourney: 'Inicie Sua Jornada',
    
    // Blog
    blogNewsTitle: 'Últimas Insights e Notícias',
    viewAllPosts: 'Ver Todas as Postagens',
    
    // Countries Page
    countriesHeroTitle: 'Escolha Seu Destino de Negócios',
    countriesHeroDescription: 'Explore países favoráveis aos negócios com suporte especializado local',
    
    // AI Assistant Page
    aiAssistantPageTitle: 'Assistente AI Oracle',
    aiAssistantPageSubtitle: 'Obtenha recomendações instantâneas para sua expansão internacional de negócios',
    aiAssistantReadyTitle: 'Pronto para Começar?',
    aiAssistantReadyDesc: 'Crie uma conta gratuita para acessar nossa plataforma completa e conectar-se com consultores especialistas.',
    createFreeAccount: 'Criar Conta Gratuita',
    startConsultation: 'Iniciar Consulta',
    
    // Footer
    copyright: '© 2025 Consulting19. Todos os direitos reservados.',
    powered: 'Alimentado pela tecnologia AI Oracle',
    
    // Wealth Management CTA
    wealthTitle: 'Matrix — Plataforma de Riqueza Privada',
    wealthSubtitle: 'Uma plataforma com foco na privacidade para clientes de patrimônio líquido ultra-alto. Alocação global assistida por IA, bancos multi-jurisdicionais e execução discreta.',
    wealthFeature1: 'Análise orientada por IA',
    wealthFeature2: 'Oportunidades globais',
    wealthFeature3: 'Confidencialidade rigorosa',
    wealthStat1: '$5M mín',
    wealthStat2: '98% sucesso',
    wealthCta: 'Explorar Matrix Wealth',
    
    // Company Formation CTA
    companyTitle: 'Serviços de Formação de Empresa',
    companySubtitle: 'Configuração de negócios rápida e compatível em 19+ países com orientação especializada e automação de processos com IA.',
    companyFeature1: 'Análise de jurisdição com IA',
    companyFeature2: 'Consultores locais especialistas',
    companyFeature3: 'Suporte completo de conformidade',
    companyFeature4: 'Integração bancária',
    companyCta: 'Iniciar Formação de Empresa',
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

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}