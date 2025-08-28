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

    // Hero Section (HomePage)
    heroTitle: 'AI-Enhanced Global Intelligence',
    heroSubtitle: 'at Your Service',
    heroDescription: 'Next-level regulatory guidance with intelligent automation. Our AI-powered platform connects you with expert consultants across the world\'s most business-friendly jurisdictions.',
    getStarted: 'Get Started Today',
    exploreServices: 'Explore Services',

    // Company Formation CTA (HomePage)
    companyTitle: 'Company Formation',
    companySubtitle: 'Fast & reliable business setup worldwide',
    companyFeature1: 'Expert guidance',
    companyFeature2: 'Global network',
    companyFeature3: 'Compliance assured',
    companyFeature4: 'Professional support',
    companyCta: 'Start Company Formation',

    // Wealth Management CTA (HomePage)
    wealthTitle: 'Wealth Management',
    wealthSubtitle: 'AI-powered investment strategies for global wealth optimization',
    wealthFeature1: 'AI-driven analysis',
    wealthFeature2: 'Global opportunities',
    wealthFeature3: 'Unlimited potential',
    wealthStat1: '$2.5B+ Managed',
    wealthStat2: '98% Success Rate',
    wealthCta: 'Explore Wealth Solutions',

    // Footer
    copyright: '© 2025 Consulting19. All rights reserved',
    powered: 'Powered by AI Oracle',

    // Services Page
    servicesHeroTitle: 'Comprehensive International Business Services',
    servicesHeroDescription: 'From company formation to ongoing compliance, we provide end-to-end support delivered by expert consultants in over 19 countries worldwide.',
    
    // Service Categories
    companyFormation: 'Company Formation',
    companyFormationDesc: 'Complete assistance in company registration and incorporation across business-friendly jurisdictions.',
    companyFormationService1: 'Company registration and incorporation',
    companyFormationService2: 'Business license applications',
    companyFormationService3: 'Corporate structure optimization',
    companyFormationService4: 'Registered agent services',
    companyFormationService5: 'Virtual office solutions',

    taxOptimization: 'Tax Optimization',
    taxOptimizationDesc: 'Strategic tax planning and optimization to minimize your international tax burden legally.',
    taxOptimizationService1: 'International tax planning',
    taxOptimizationService2: 'Double taxation treaty optimization',
    taxOptimizationService3: 'Tax residence strategies',
    taxOptimizationService4: 'Transfer pricing guidance',
    taxOptimizationService5: 'Annual tax compliance',

    bankingSolutions: 'Banking Solutions',
    bankingSolutionsDesc: 'Comprehensive banking support for international business operations.',
    bankingSolutionsService1: 'International bank account opening',
    bankingSolutionsService2: 'Multi-currency account setup',
    bankingSolutionsService3: 'Payment gateway integration',
    bankingSolutionsService4: 'Banking relationship management',
    bankingSolutionsService5: 'Trade finance solutions',

    legalCompliance: 'Legal Compliance',
    legalComplianceDesc: 'Ongoing legal and regulatory compliance support to keep your business compliant.',
    legalComplianceService1: 'Regulatory compliance monitoring',
    legalComplianceService2: 'Contract reviews and drafting',
    legalComplianceService3: 'Legal structure optimization',
    legalComplianceService4: 'Intellectual property protection',
    legalComplianceService5: 'Data protection compliance',

    assetProtection: 'Asset Protection',
    assetProtectionDesc: 'Advanced strategies to protect your assets and minimize risks in international operations.',
    assetProtectionService1: 'Asset protection strategies',
    assetProtectionService2: 'Trust and foundation setup',
    assetProtectionService3: 'Risk assessment and mitigation',
    assetProtectionService4: 'Estate planning for international assets',
    assetProtectionService5: 'Insurance optimization',

    investmentAdvisory: 'Investment Advisory',
    investmentAdvisoryDesc: 'Commercial investment consulting and growth strategies for international markets.',
    investmentAdvisoryService1: 'Market entry strategies',
    investmentAdvisoryService2: 'Investment structure optimization',
    investmentAdvisoryService3: 'Due diligence support',
    investmentAdvisoryService4: 'Exit strategy planning',
    investmentAdvisoryService5: 'Cross-border M&A advisory',

    exploreCategory: 'Explore',
    servicesCtaTitle: 'Need a Custom Solution?',
    servicesCtaDescription: 'Our expert advisors can create a tailored strategy for your unique business needs.',
    consultExpertBtn: 'Consult with Expert',
    exploreCountriesBtn: 'Explore Countries',

    // Countries Page
    countriesHeroTitle: 'Global Business Destinations',
    countriesHeroDescription: 'Explore the world\'s most business-friendly jurisdictions. Each location offers unique advantages for international expansion and tax optimization.',
    searchPlaceholder: 'Search countries...',
    allRegions: 'All Regions',
    regionEurope: 'Europe',
    regionAsia: 'Asia',
    regionMiddleEast: 'Middle East',
    regionAmericas: 'Americas',
    availableDestinations: 'Available Destinations',
    noCountriesFoundTitle: 'No countries found',
    noCountriesFoundDesc: 'Try adjusting your search or filter criteria.',
    corporateTax: 'Corporate Tax',
    featuredBadge: 'FEATURED',
    learnMoreBtn: 'Learn More',

    // About Page
    aboutHeroTitle: 'About Consulting19',
    aboutHeroDescription: 'We\'re revolutionizing international business consulting by combining AI-powered intelligence with a global network of expert advisors.',
    missionTitle: 'Our Mission',
    missionDesc1: 'To democratize international business expansion by making expert advice accessible, affordable, and instant through the power of artificial intelligence.',
    missionDesc2: 'We believe that every entrepreneur should have access to world-class international business guidance, regardless of their location or business size.',
    valuesTitle: 'Our Values',
    valuesDescription: 'The principles that guide everything we do at Consulting19.',
    globalExpertise: 'Global Expertise',
    globalExpertiseDesc: 'Deep knowledge of international business landscapes across 19+ countries.',
    aiEfficiency: 'AI-Powered Efficiency',
    aiEfficiencyDesc: 'Cutting-edge AI technology combined with human expertise for optimal results.',
    trustSecurity: 'Trust & Security',
    trustSecurityDesc: 'Enterprise-grade security protecting your sensitive business information.',
    resultsDriven: 'Results-Driven',
    resultsDrivenDesc: 'Focused on delivering measurable outcomes for your international expansion.',
    teamTitle: 'Meet Our Team',
    teamDescription: 'Experienced professionals from leading consulting firms and technology companies.',
    teamMemberRoleErdal: 'SEO & Digital Marketing Specialist',
    teamMemberBioErdal: 'Expert in search engine optimization and digital marketing strategies for international business expansion.',
    linkedinProfile: 'LinkedIn Profile',
    storyTitle: 'Our Story',
    storyDesc1: 'Consulting19 was born from a simple observation: international business expansion is unnecessarily complex and expensive. Traditional consulting firms charge premium rates while entrepreneurs struggle to navigate foreign regulations alone.',
    storyDesc2: 'By combining cutting-edge AI technology with a carefully curated network of expert advisors in business-friendly jurisdictions, we\'ve created a platform that delivers enterprise-level consulting at a fraction of traditional costs.',
    storyDesc3: 'Today, we\'re proud to serve hundreds of entrepreneurs worldwide, helping them save millions in taxes while expanding their businesses across borders with confidence.',
    ctaTitle: 'Ready to Join Our Mission?',
    ctaDescription: 'Whether you\'re an entrepreneur looking to expand globally or an expert advisor wanting to help others, we\'d love to have you on board.',
    startExpansionBtn: 'Start Your Expansion',
    becomeConsultantBtn: 'Become a Consultant',

    // Hero Section
    heroTitle1: 'AI-Enhanced Global Intelligence',
    heroSubtitle1: 'at Your Service',
    heroDescription1: 'Next-level regulatory guidance with intelligent automation. Our AI-powered platform connects you with expert consultants across the world\'s most business-friendly jurisdictions.',
    heroTitle2: 'Global Network of Experts',
    heroSubtitle2: 'in 19+ Countries',
    heroDescription2: 'Connect with certified business advisors and legal experts across strategic jurisdictions. From UAE to Estonia, our network ensures you get local expertise with global reach.',
    heroTitle3: 'Instant AI-Powered Matching',
    heroSubtitle3: 'Smart Consultant Selection',
    heroDescription3: 'Our advanced AI Oracle analyzes your business needs and instantly matches you with the perfect consultant and jurisdiction for maximum tax efficiency and compliance.',
    heroTitle4: '98% Success Rate',
    heroSubtitle4: 'Proven Track Record',
    heroDescription4: 'Over 1,000 successful business formations with industry-leading completion rates. Our systematic approach and expert guidance ensure your international expansion succeeds.',
    heroTitle5: 'Enterprise-Grade Security',
    heroSubtitle5: 'Bank-Level Protection',
    heroDescription5: 'Your sensitive business data is protected with military-grade encryption, row-level security, and compliance with international data protection standards.',
    heroPrimaryCTA1: 'Get Started Today',
    heroSecondaryCTA1: 'Explore Services',
    heroPrimaryCTA2: 'Find Your Expert',
    heroSecondaryCTA2: 'View Countries',
    heroPrimaryCTA3: 'Try AI Oracle',
    heroSecondaryCTA3: 'Learn More',
    heroPrimaryCTA4: 'View Success Stories',
    heroSecondaryCTA4: 'Our Process',
    heroPrimaryCTA5: 'Security Details',
    heroSecondaryCTA5: 'Compliance Info',
    aiPoweredIntelligence: 'AI-Powered Intelligence',

    // How It Works Section
    howItWorksTitle: 'How Our AI Oracle Works',
    howItWorksDescription: 'Experience the future of international business consulting with our revolutionary AI-powered platform that combines artificial intelligence with human expertise.',
    aiPoweredProcess: 'AI-Powered Process',
    step1Title: 'AI-Powered Business Analysis',
    step1Description: 'Our advanced AI Oracle analyzes your business model, target markets, and growth objectives to create a personalized expansion roadmap tailored to your unique needs.',
    step2Title: 'Instant Smart Recommendations',
    step2Description: 'Within minutes, receive AI-generated recommendations for optimal jurisdictions, tax structures, and business strategies based on real-time data and regulatory intelligence.',
    step3Title: 'Expert Human Connection',
    step3Description: 'Get matched with certified specialists in your chosen countries who combine local expertise with our AI insights to deliver personalized, compliant solutions.',
    step4Title: 'Seamless Global Expansion',
    step4Description: 'Launch your international operations with confidence, backed by continuous AI monitoring, compliance updates, and expert support throughout your growth journey.',
    experienceAiConsulting: 'Experience AI-Powered Consulting Today',

    // Services Overview Section
    servicesOverviewTitle: 'Comprehensive International Business Services',
    servicesOverviewDescription: 'From company formation to ongoing compliance, we provide end-to-end support delivered by expert consultants worldwide.',
    endToEndSolutions: 'End-to-End Business Solutions',
    viewAllServicesBtn: 'View All Services',

    // Featured Countries Section
    featuredCountriesTitle: 'Global Business Destinations',
    featuredCountriesDescription: 'Choose from the world\'s most business-friendly jurisdictions for your international expansion with expert local guidance.',
    businessFriendlyJurisdictions: '19+ Business-Friendly Jurisdictions',
    exploreAllCountriesBtn: 'Explore All Countries',

    // AI Promotion Section
    aiPromotionTitle: 'Meet Your AI Oracle',
    aiPromotionDescription: 'Get instant, personalized recommendations for your international business expansion. Our AI analyzes your needs and connects you with the perfect jurisdiction and expert advisor.',
    instantJurisdictionRecommendations: 'Instant jurisdiction recommendations',
    aiPoweredExpertMatching: 'AI-powered expert matching',
    personalizedBusinessStrategies: 'Personalized business strategies',
    tryAiAssistantFree: 'Try AI Assistant Free',
    aiOracleAssistant: 'AI Oracle Assistant',
    online: 'Online',
    aiAssistantGreeting: 'Hello! I\'m your AI Oracle assistant. I can help you find the best jurisdiction and services for your international business expansion. What type of business are you looking to establish?',
    aiAssistantPlaceholder: 'Ask me about jurisdictions, tax rates, or business setup...',
    aiAssistantQuickStart: 'Quick start:',
    aiAssistantQuick1: 'I want to start a tech company',
    aiAssistantQuick2: 'Looking for tax optimization',
    aiAssistantQuick3: 'Need EU market access',
    aiAssistantQuick4: 'Interested in crypto business',
    aiAssistantPageTitle: 'AI Oracle Assistant',
    aiAssistantPageSubtitle: 'Get instant, personalized recommendations for your international business expansion. Our AI analyzes your needs and suggests the perfect jurisdiction and services.',
    aiAssistantReadyTitle: 'Ready to Get Started?',
    aiAssistantReadyDesc: 'Create your free account to connect with expert advisors and begin your international expansion.',
    createFreeAccount: 'Create Free Account',

    // Service Detail Pages
    whichCountryTitle: 'Which Country Would You Like This Service From?',
    whichCountrySubtitle: 'Choose from our network of business-friendly jurisdictions, each offering unique advantages for your specific needs.',
    availableIn: 'Available in',
    countries: 'countries',
    getStartedIn: 'Get Started in',
    send: 'Send',
    startConsultation: 'Start Consultation',

    // Real Time Analytics Section
    realTimeAnalyticsTitle: 'Real-Time Platform Analytics',
    realTimeAnalyticsDescription: 'Live insights from our worldwide network of expert consultants and AI-powered analytics driving successful business formations.',
    globalIntelligenceNetwork: 'Global Intelligence Network',
    activeConsultations: 'Active Consultations',
    strategicJurisdictions: 'Strategic Jurisdictions',
    successRate: 'Success Rate',
    avgResponseTime: 'Avg Response Time',
    aiPoweredMatching: 'AI-Powered Matching',
    aiMatchingDescription: 'Intelligent consultant-client pairing based on expertise and requirements',
    legalCompliance: 'Legal Compliance',
    legalComplianceDescription: 'All recommendations reviewed by legal experts for full compliance',
    successOptimization: 'Success Optimization',
    successOptimizationDescription: 'Continuous optimization based on successful case patterns',
    joinThousandsTitle: 'Join Thousands of Successful Businesses',
    joinThousandsDescription: 'Experience the power of AI-enhanced consulting with expert guidance across 8 strategic jurisdictions worldwide.',
    startYourJourney: 'Start Your Journey',

    // Blog Section
    blogNewsTitle: 'Blog/News',
    viewAllPosts: 'View All Posts',

    // Service names for sections
    companyFormationTitle: 'Company Formation',
    companyFormationDesc: 'Complete assistance in company registration and incorporation across business-friendly jurisdictions.',
    taxOptimizationTitle: 'Tax Optimization', 
    taxOptimizationDesc: 'Strategic tax planning and optimization to minimize your international tax burden legally.',
    bankingSolutionsTitle: 'Banking Solutions',
    bankingSolutionsDesc: 'Comprehensive banking support for opening international accounts and establishing global financial relationships.',
    legalComplianceTitle: 'Legal Compliance',
    legalComplianceDesc: 'Ongoing legal and regulatory compliance support to keep your business compliant.',
    assetProtectionTitle: 'Asset Protection',
    assetProtectionDesc: 'Advanced strategies to protect your assets and minimize risks in international operations.',
    investmentAdvisoryTitle: 'Investment Advisory',
    investmentAdvisoryDesc: 'Commercial investment consulting and growth strategies for international markets.',
    visaResidencyTitle: 'Visa & Residency',
    visaResidencyDesc: 'Complete visa and residency solutions for international business owners, investors, and their families.',
    marketResearchTitle: 'Market Research',
    marketResearchDesc: 'In-depth market analysis and research for successful international business expansion.',
    learnMore: 'Learn More',

    // Country names and details
    unitedArabEmirates: 'United Arab Emirates',
    estonia: 'Estonia',
    georgia: 'Georgia',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portugal',
    unitedStates: 'United States',
    montenegro: 'Montenegro',
    switzerland: 'Switzerland',

    // Country highlights
    uaeHighlight: '0% corporate tax for 50 years in free zones',
    estoniaHighlight: '100% online e-Residency program',
    georgiaHighlight: 'Small Business Status - 1% tax',
    maltaHighlight: 'EU membership with 5% effective tax rate',
    panamaHighlight: 'Territorial tax system',
    portugalHighlight: 'Golden Visa program with EU residency',
    usaHighlight: 'World\'s largest economy and market',
    montenegroHighlight: 'EU candidate with citizenship by investment',
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
    euCandidateStatus: 'EU candidate status',
    citizenshipByInvestment: 'Citizenship by investment',
    lowCorporateTax: 'Low corporate tax',
    beautifulLocation: 'Beautiful location',
    politicalStability: 'Political stability',
    worldClassBanking: 'World-class banking',
    strategicEuLocation: 'Strategic EU location',
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

    // Company Formation Service Page
    companyFormationHeroTitle: 'Sorunsuz Küresel Şirket Kuruluşu – Fikirden Kuruluşa',
    companyFormationHeroSubtitle: 'AI destekli otomasyon ile 19+ ülkede uzman rehberliğinde işletme kurulumu. Yargı yetkisi seçiminden bankacılık aktivasyonuna kadar – büyümeye odaklanabilmeniz için her şeyi biz hallederiz.',
    
    // What We Offer - Company Formation
    whatWeOfferTitle: 'Sunduğumuz Hizmetler',
    whatWeOfferSubtitle: 'AI teknolojisi ve yerel uzmanlık ile desteklenen kapsamlı şirket kuruluş hizmetleri',
    
    aiJurisdictionAnalysis: 'AI Destekli Yargı Yetkisi Analizi',
    aiJurisdictionAnalysisDesc: 'AI Oracle\'ımız iş modelinizi, hedef pazarlarınızı ve vergi hedeflerinizi analiz ederek şirket kuruluşunuz için optimal yargı yetkisini önerir.',
    
    completeLegalCompliance: 'Kapsamlı Dokümantasyon ve Yasal Uyumluluk',
    completeLegalComplianceDesc: 'Her yargı yetkisindeki yerel hukuk uzmanları tarafından uçtan uca yasal dokümantasyon, devlet başvuruları ve düzenleyici uyumluluk.',
    
    digitalIdentityEResidency: 'Dijital Kimlik ve e-Residency Çözümleri',
    digitalIdentityEResidencyDesc: 'Estonya\'nın e-Residency programına ve %100 online iş yönetimi için diğer dijital kimlik çözümlerine erişim.',
    
    integratedBankingPayments: 'Entegre Bankacılık ve Ödeme Çözümleri',
    integratedBankingPaymentsDesc: 'İş ihtiyaçlarınıza özel kurumsal bankacılık kurulumu, çok para birimli hesaplar ve ödeme işleme çözümleri.',
    
    taxOptimizationPlanning: 'Vergi Optimizasyonu ve Yapı Planlaması',
    taxOptimizationPlanningDesc: 'Tam uyumluluğu sağlarken vergi yükünü minimize etmek için stratejik vergi planlaması ve kurumsal yapı optimizasyonu.',
    
    ongoingComplianceMonitoring: 'Sürekli Uyumluluk İzleme',
    ongoingComplianceMonitoringDesc: 'Yıllık başvurular, yenilemeler ve düzenleyici gereksinimler için otomatik hatırlatmalarla AI destekli uyumluluk takibi.',
    
    registeredOfficeServices: 'Kayıtlı Ofis ve Sanal Adres Hizmetleri',
    registeredOfficeServicesDesc: 'Desteklenen tüm yargı yetkilerinde profesyonel iş adresleri, posta yönlendirme ve kayıtlı ofis hizmetleri.',
    
    postIncorporationSupport: 'Kuruluş Sonrası Destek ve Büyüme Hizmetleri',
    postIncorporationSupportDesc: 'Muhasebe, yasal güncellemeler, genişleme planlaması ve büyüme hızlandırma hizmetleri dahil sürekli iş desteği.',
    
    // Why Choose Us
    whyChooseUsTitle: 'Şirket Kuruluşu İçin Neden Consulting19\'u Seçmelisiniz',
    whyChooseUsSubtitle: 'Mükemmellik, verimlilik ve sonuç talep eden girişimciler için akıllı seçim',
    
    globalNetworkLocalExpertise: 'Küresel Ağ, Yerel Uzmanlık',
    globalNetworkLocalExpertiseDesc: 'Bölgesel düzenlemeleri, kültürü ve iş uygulamalarını anlayan özel yerel uzmanlarla 19+ yargı yetkisine erişim.',
    
    provenTrackRecord: 'Kanıtlanmış Başarı Geçmişi',
    provenTrackRecordDesc: '%98 başarı oranıyla 500\'den fazla başarılı şirket kuruluşu. Müşterilerimiz her seferinde zamanında sonuç vermemize güveniyor.',
    
    aiPoweredAutomation: 'AI Destekli Otomasyon',
    aiPoweredAutomationDesc: 'AI güdümlü belge hazırlama, hata tespiti ve uyumluluk izleme ile %60 daha hızlı işlem süreleri. Teknoloji uzmanlıkla buluşuyor.',
    
    transparentPricing: 'Şeffaf Fiyatlandırma',
    transparentPricingDesc: 'Gizli ücret olmayan net, peşin fiyatlandırma. Verimli süreçlerimiz geleneksel hukuk firmalarına kıyasla %30-40 maliyet tasarrufu sağlıyor.',
    
    // How It Works
    howItWorksTitle: 'Şirket Kuruluş Sürecimiz Nasıl İşliyor',
    howItWorksSubtitle: 'Danışmanlıktan kuruluşa 4 basit adımda',
    
    step1ChooseJurisdiction: 'Yargı Yetkisini Seçin',
    step1ChooseJurisdictionDesc: 'AI Oracle\'ımız iş ihtiyaçlarınızı analiz eder ve hedeflerinize göre kuruluş için en iyi ülkeleri önerir.',
    
    step2ExpertConsultation: 'Uzman Danışmanlığı ve Planlama',
    step2ExpertConsultationDesc: 'Optimal kurumsal yapınızı tasarlayan ve gerekli tüm belgeleri hazırlayan yerel uzmanlarla bağlantı kurun.',
    
    step3IncorporationRegistration: 'Kuruluş ve Kayıt',
    step3IncorporationRegistrationDesc: 'Seçtiğiniz yargı yetkisindeki tüm devlet başvurularını, yasal kayıtları ve uyumluluk gereksinimlerini hallederiz.',
    
    step4BankingActivation: 'Bankacılık ve İş Aktivasyonu',
    step4BankingActivationDesc: 'Kurumsal bankacılık kurulumu, ödeme işleme ve final iş aktivasyonu. 14 gün veya daha kısa sürede faaliyete hazır.',
    
    // Success Stories
    successStoriesTitle: 'Başarı Hikayeleri',
    successStoriesSubtitle: 'Consulting19\'u seçen gerçek girişimcilerden gerçek sonuçlar',
    
    // FAQ
    faqTitle: 'Sıkça Sorulan Sorular',
    faqSubtitle: 'Uluslararası şirket kuruluşu hakkında bilmeniz gereken her şey',
    
    // CTA Section
    ctaTitle: 'Küresel İşinizi Kurmaya Hazır mısınız?',
    ctaSubtitle: 'Şirket kuruluşu için Consulting19\'u seçen 500+ başarılı girişimciye katılın',
    ctaStep1: 'Adım 1: Ülkenizi seçin',
    ctaStep2: 'Adım 2: Ücretsiz danışmanlık alın',
    ctaStep3: 'Adım 3: 14 günde kurun',
    
    // Country specific details
    setupTime: 'Kurulum Süresi',
    taxAdvantages: 'Vergi Avantajları',
    annualCompliance: 'Yıllık Uyumluluk',
    
    // Success story details
    techFlowTitle: 'TechFlow Solutions',
    techFlowDesc: 'Estonya e-Residency bu yazılım startup\'ının AB pazarlarına erişimini sağlarken %40 vergi tasarrufu ve %300 gelir artışı elde etmesini mümkün kıldı.',
    
    globalTradeTitle: 'Global Trade Partners',
    globalTradeDesc: 'BAE DMCC serbest bölge kurulumu bu uluslararası ticaret şirketi için kurumlar vergisini tamamen ortadan kaldırarak operasyonel maliyetleri %50 azalttı.',
    
    digitalNomadTitle: 'Digital Nomad Consulting',
    digitalNomadDesc: 'Gürcistan\'ın %1 küçük işletme vergi statüsü bu lokasyon bağımsız danışmanlık firması için %90 vergi indirimi sağladı.',
    
    // FAQ Questions
    faqQuestion1: 'Offshore şirket kuruluşu yasal mı?',
    faqAnswer1: 'Evet, offshore şirket kuruluşu meşru iş amaçları için ve uygun uyumlulukla yapıldığında tamamen yasaldır. Tüm kuruluşların uluslararası yasal standartları karşılamasını sağlıyoruz.',
    
    faqQuestion2: 'Yıllık raporlama gereksinimleri nelerdir?',
    faqAnswer2: 'Yıllık gereksinimler yargı yetkisine göre değişir ancak genellikle yıllık beyannamelerin verilmesi, kayıtlı ofisin sürdürülmesi ve mali tabloların sunulmasını içerir. Sürekli uyumluluk desteği sağlıyoruz.',
    
    faqQuestion3: 'Bankacılık kurulumu ne kadar sürer?',
    faqAnswer3: 'Bankacılık kurulumu genellikle kuruluştan sonra yargı yetkisi ve banka gereksinimlerine bağlı olarak 2-4 hafta sürer. Tanıtımları kolaylaştırır ve belgelendirmede yardımcı oluruz.',
    
    faqQuestion4: 'Sürekli uyumluluk görevlerim nelerdir?',
    faqAnswer4: 'Uyumluluk görevleri yıllık başvurular, vergi beyannameleri, kurumsal kayıtların tutulması ve düzenleyici güncellemeleri içerir. AI sistemimiz tüm son tarihleri takip eder ve otomatik hatırlatmalar gönderir.',
    
    faqQuestion5: 'Kuruluştan sonra yargı yetkisini değiştirebilir miyim?',
    faqAnswer5: 'Evet, birçok yargı yetkisi şirket göçü veya yeniden yerleşime izin verir. Yargı yetkisi değişikliklerinde yardımcı olabiliriz, ancak başlangıçta doğru yargı yetkisini seçmek daha verimlidir.',

    // Hero Section (HomePage)
    heroTitle: 'Yapay Zeka Destekli Küresel Zeka',
    heroSubtitle: 'Hizmetinizde',
    heroDescription: 'Akıllı otomasyon ile yeni nesil düzenleyici rehberlik. Yapay zeka destekli platformumuz, sizi dünyanın en iş dostu yargı bölgelerindeki uzman danışmanlarla buluşturur.',
    getStarted: 'Bugün Başlayın',
    exploreServices: 'Hizmetleri Keşfedin',

    // Company Formation CTA (HomePage)
    companyTitle: 'Şirket Kuruluşu',
    companySubtitle: 'Dünya çapında hızlı ve güvenilir iş kurulumu',
    companyFeature1: 'Uzman rehberliği',
    companyFeature2: 'Küresel ağ',
    companyFeature3: 'Uyumluluk garantisi',
    companyFeature4: 'Profesyonel destek',
    companyCta: 'Şirket Kuruluşunu Başlat',

    // Wealth Management CTA (HomePage)
    wealthTitle: 'Varlık Yönetimi',
    wealthSubtitle: 'Küresel servet optimizasyonu için yapay zeka destekli yatırım stratejileri',
    wealthFeature1: 'Yapay zeka odaklı analiz',
    wealthFeature2: 'Küresel fırsatlar',
    wealthFeature3: 'Sınırsız potansiyel',
    wealthStat1: '2.5 Milyar$+ Yönetilen',
    wealthStat2: '%98 Başarı Oranı',
    wealthCta: 'Varlık Çözümlerini Keşfet',

    // Footer
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır',
    powered: 'AI Oracle tarafından desteklenmektedir',

    // Services Page
    servicesHeroTitle: 'Kapsamlı Uluslararası İş Hizmetleri',
    servicesHeroDescription: 'Şirket kuruluşundan sürekli uyumluluğa kadar, 19\'dan fazla ülkedeki uzman danışmanlar tarafından sunulan uçtan uca destek sağlıyoruz.',
    
    // Service Categories
    companyFormation: 'Şirket Kuruluşu',
    companyFormationDesc: 'İş dostu yargı bölgelerinde şirket tescili ve kuruluşu konusunda eksiksiz yardım.',
    companyFormationService1: 'Şirket tescili ve kuruluşu',
    companyFormationService2: 'İşletme lisansı başvuruları',
    companyFormationService3: 'Kurumsal yapı optimizasyonu',
    companyFormationService4: 'Tescilli acente hizmetleri',
    companyFormationService5: 'Sanal ofis çözümleri',

    taxOptimization: 'Vergi Optimizasyonu',
    taxOptimizationDesc: 'Uluslararası vergi yükünüzü yasal olarak en aza indirmek için stratejik vergi planlaması ve optimizasyonu.',
    taxOptimizationService1: 'Uluslararası vergi planlaması',
    taxOptimizationService2: 'Çifte vergilendirme anlaşması optimizasyonu',
    taxOptimizationService3: 'Vergi ikametgahı stratejileri',
    taxOptimizationService4: 'Transfer fiyatlandırması rehberliği',
    taxOptimizationService5: 'Yıllık vergi uyumluluğu',

    bankingSolutions: 'Bankacılık Çözümleri',
    bankingSolutionsDesc: 'Uluslararası iş operasyonları için kapsamlı bankacılık desteği.',
    bankingSolutionsService1: 'Uluslararası banka hesabı açılışı',
    bankingSolutionsService2: 'Çoklu para birimi hesabı kurulumu',
    bankingSolutionsService3: 'Ödeme ağ geçidi entegrasyonu',
    bankingSolutionsService4: 'Bankacılık ilişkileri yönetimi',
    bankingSolutionsService5: 'Ticaret finansmanı çözümleri',

    legalCompliance: 'Yasal Uyumluluk',
    legalComplianceDesc: 'İşletmenizin uyumlu kalması için sürekli yasal ve düzenleyici uyumluluk desteği.',
    legalComplianceService1: 'Düzenleyici uyumluluk izleme',
    legalComplianceService2: 'Sözleşme incelemeleri ve taslağı',
    legalComplianceService3: 'Yasal yapı optimizasyonu',
    legalComplianceService4: 'Fikri mülkiyet koruması',
    legalComplianceService5: 'Veri koruma uyumluluğu',

    assetProtection: 'Varlık Korunması',
    assetProtectionDesc: 'Uluslararası operasyonlarda varlıklarınızı korumak ve riskleri en aza indirmek için gelişmiş stratejiler.',
    assetProtectionService1: 'Varlık koruma stratejileri',
    assetProtectionService2: 'Vakıf ve fon kurulumu',
    assetProtectionService3: 'Risk değerlendirmesi ve azaltma',
    assetProtectionService4: 'Uluslararası varlıklar için miras planlaması',
    assetProtectionService5: 'Sigorta optimizasyonu',

    investmentAdvisory: 'Yatırım Danışmanlığı',
    investmentAdvisoryDesc: 'Uluslararası pazarlar için ticari yatırım danışmanlığı ve büyüme stratejileri.',
    investmentAdvisoryService1: 'Pazara giriş stratejileri',
    investmentAdvisoryService2: 'Yatırım yapısı optimizasyonu',
    investmentAdvisoryService3: 'Durum tespiti desteği',
    investmentAdvisoryService4: 'Çıkış stratejisi planlaması',
    investmentAdvisoryService5: 'Sınır ötesi birleşme ve satın alma danışmanlığı',

    exploreCategory: 'Keşfet',
    servicesCtaTitle: 'Özel Bir Çözüme mi İhtiyacınız Var?',
    servicesCtaDescription: 'Uzman danışmanlarımız, benzersiz iş ihtiyaçlarınız için özel bir strateji oluşturabilir.',
    consultExpertBtn: 'Uzmanla Danışın',
    exploreCountriesBtn: 'Ülkeleri Keşfedin',

    // Countries Page
    countriesHeroTitle: 'Küresel İş Destinasyonları',
    countriesHeroDescription: 'Dünyanın en iş dostu yargı bölgelerini keşfedin. Her konum, uluslararası genişleme ve vergi optimizasyonu için benzersiz avantajlar sunar.',
    searchPlaceholder: 'Ülkeleri ara...',
    allRegions: 'Tüm Bölgeler',
    regionEurope: 'Avrupa',
    regionAsia: 'Asya',
    regionMiddleEast: 'Orta Doğu',
    regionAmericas: 'Amerika',
    availableDestinations: 'Mevcut Destinasyonlar',
    noCountriesFoundTitle: 'Ülke bulunamadı',
    noCountriesFoundDesc: 'Arama veya filtreleme kriterlerinizi ayarlamayı deneyin.',
    corporateTax: 'Kurumlar Vergisi',
    featuredBadge: 'ÖNE ÇIKAN',
    learnMoreBtn: 'Daha Fazla Bilgi',

    // About Page
    aboutHeroTitle: 'Consulting19 Hakkında',
    aboutHeroDescription: 'Yapay zeka destekli zekayı küresel uzman danışman ağıyla birleştirerek uluslararası iş danışmanlığını devrim niteliğinde değiştiriyoruz.',
    missionTitle: 'Misyonumuz',
    missionDesc1: 'Yapay zekanın gücüyle uzman tavsiyesini erişilebilir, uygun fiyatlı ve anında hale getirerek uluslararası iş genişlemesini demokratikleştirmek.',
    missionDesc2: 'Her girişimcinin, konumu veya işletme büyüklüğü ne olursa olsun, dünya standartlarında uluslararası iş rehberliğine erişmesi gerektiğine inanıyoruz.',
    valuesTitle: 'Değerlerimiz',
    valuesDescription: 'Consulting19\'da yaptığımız her şeye rehberlik eden ilkeler.',
    globalExpertise: 'Küresel Uzmanlık',
    globalExpertiseDesc: '19\'dan fazla ülkedeki uluslararası iş ortamları hakkında derin bilgi.',
    aiEfficiency: 'Yapay Zeka Destekli Verimlilik',
    aiEfficiencyDesc: 'Optimal sonuçlar için insan uzmanlığıyla birleştirilmiş son teknoloji yapay zeka teknolojisi.',
    trustSecurity: 'Güven & Güvenlik',
    trustSecurityDesc: 'Hassas iş bilgilerinizi koruyan kurumsal düzeyde güvenlik.',
    resultsDriven: 'Sonuç Odaklı',
    resultsDrivenDesc: 'Uluslararası genişlemeniz için ölçülebilir sonuçlar sunmaya odaklanmıştır.',
    teamTitle: 'Ekibimizle Tanışın',
    teamDescription: 'Önde gelen danışmanlık firmalarından ve teknoloji şirketlerinden deneyimli profesyoneller.',
    teamMemberRoleErdal: 'SEO & Dijital Pazarlama Uzmanı',
    teamMemberBioErdal: 'Uluslararası iş genişlemesi için arama motoru optimizasyonu ve dijital pazarlama stratejileri konusunda uzman.',
    linkedinProfile: 'LinkedIn Profili',
    storyTitle: 'Hikayemiz',
    storyDesc1: 'Consulting19, basit bir gözlemden doğdu: uluslararası iş genişlemesi gereksiz yere karmaşık ve pahalı. Geleneksel danışmanlık firmaları yüksek ücretler talep ederken, girişimciler yabancı düzenlemelerde tek başına gezinmekte zorlanıyor.',
    storyDesc2: 'Son teknoloji yapay zeka teknolojisini, iş dostu yargı bölgelerindeki özenle seçilmiş uzman danışman ağıyla birleştirerek, geleneksel maliyetlerin çok altında kurumsal düzeyde danışmanlık sunan bir platform oluşturduk.',
    storyDesc3: 'Bugün, dünya çapında yüzlerce girişimciye hizmet vermekten gurur duyuyoruz, işlerini güvenle sınırlar ötesine genişletirken milyonlarca vergi tasarrufu yapmalarına yardımcı oluyoruz.',
    ctaTitle: 'Misyonumuza Katılmaya Hazır mısınız?',
    ctaDescription: 'İster küresel olarak genişlemek isteyen bir girişimci olun, ister başkalarına yardım etmek isteyen bir uzman danışman olun, sizi aramızda görmekten mutluluk duyarız.',
    startExpansionBtn: 'Genişlemenizi Başlatın',
    becomeConsultantBtn: 'Danışman Olun',

    // Hero Section
    heroTitle1: 'Yapay Zeka Destekli Küresel Zeka',
    heroSubtitle1: 'Hizmetinizde',
    heroDescription1: 'Akıllı otomasyon ile yeni nesil düzenleyici rehberlik. Yapay zeka destekli platformumuz, sizi dünyanın en iş dostu yargı bölgelerindeki uzman danışmanlarla buluşturur.',
    heroTitle2: 'Küresel Uzman Ağı',
    heroSubtitle2: '19+ Ülkede',
    heroDescription2: 'Stratejik yargı bölgelerindeki sertifikalı iş danışmanları ve hukuk uzmanlarıyla bağlantı kurun. BAE\'den Estonya\'ya, ağımız küresel erişimle yerel uzmanlık sağlar.',
    heroTitle3: 'Anında Yapay Zeka Destekli Eşleştirme',
    heroSubtitle3: 'Akıllı Danışman Seçimi',
    heroDescription3: 'Gelişmiş AI Oracle\'ımız iş ihtiyaçlarınızı analiz eder ve maksimum vergi verimliliği ve uyumluluk için mükemmel danışman ve yargı bölgesiyle anında eşleştirir.',
    heroTitle4: '%98 Başarı Oranı',
    heroSubtitle4: 'Kanıtlanmış Sicil',
    heroDescription4: 'Sektör lideri tamamlanma oranlarıyla 1.000\'den fazla başarılı şirket kuruluşu. Sistematik yaklaşımımız ve uzman rehberliğimiz uluslararası genişlemenizin başarılı olmasını sağlar.',
    heroTitle5: 'Kurumsal Düzeyde Güvenlik',
    heroSubtitle5: 'Banka Düzeyinde Koruma',
    heroDescription5: 'Hassas iş verileriniz askeri düzeyde şifreleme, satır düzeyinde güvenlik ve uluslararası veri koruma standartlarına uygunlukla korunur.',
    heroPrimaryCTA1: 'Bugün Başlayın',
    heroSecondaryCTA1: 'Hizmetleri Keşfedin',
    heroPrimaryCTA2: 'Uzmanınızı Bulun',
    heroSecondaryCTA2: 'Ülkeleri Görüntüleyin',
    heroPrimaryCTA3: 'AI Oracle\'ı Deneyin',
    heroSecondaryCTA3: 'Daha Fazla Bilgi',
    heroPrimaryCTA4: 'Başarı Hikayelerini Görüntüleyin',
    heroSecondaryCTA4: 'Sürecimiz',
    heroPrimaryCTA5: 'Güvenlik Detayları',
    heroSecondaryCTA5: 'Uyumluluk Bilgisi',
    aiPoweredIntelligence: 'Yapay Zeka Destekli Zeka',

    // How It Works Section
    howItWorksTitle: 'AI Oracle\'ımız Nasıl Çalışır',
    howItWorksDescription: 'Yapay zeka ile insan uzmanlığını birleştiren devrimci yapay zeka destekli platformumuzla uluslararası iş danışmanlığının geleceğini deneyimleyin.',
    aiPoweredProcess: 'Yapay Zeka Destekli Süreç',
    step1Title: 'Yapay Zeka Destekli İş Analizi',
    step1Description: 'Gelişmiş AI Oracle\'ımız iş modelinizi, hedef pazarlarınızı ve büyüme hedeflerinizi analiz ederek benzersiz ihtiyaçlarınıza göre kişiselleştirilmiş bir genişleme yol haritası oluşturur.',
    step2Title: 'Anında Akıllı Öneriler',
    step2Description: 'Dakikalar içinde, gerçek zamanlı veriler ve düzenleyici zekaya dayalı optimal yargı bölgeleri, vergi yapıları ve iş stratejileri için yapay zeka tarafından üretilen öneriler alın.',
    step3Title: 'Uzman İnsan Bağlantısı',
    step3Description: 'Kişiselleştirilmiş, uyumlu çözümler sunmak için yerel uzmanlığı AI içgörülerimizle birleştiren seçtiğiniz ülkelerdeki sertifikalı uzmanlarla eşleşin.',
    step4Title: 'Sorunsuz Küresel Genişleme',
    step4Description: 'Sürekli AI izleme, uyumluluk güncellemeleri ve büyüme yolculuğunuz boyunca uzman desteğiyle desteklenen güvenle uluslararası operasyonlarınızı başlatın.',
    experienceAiConsulting: 'Bugün Yapay Zeka Destekli Danışmanlığı Deneyimleyin',

    // Services Overview Section
    servicesOverviewTitle: 'Kapsamlı Uluslararası İş Hizmetleri',
    servicesOverviewDescription: 'Şirket kuruluşundan sürekli uyumluluğa kadar, dünya çapındaki uzman danışmanlar tarafından sunulan uçtan uca destek sağlıyoruz.',
    endToEndSolutions: 'Uçtan Uca İş Çözümleri',
    viewAllServicesBtn: 'Tüm Hizmetleri Görüntüle',

    // Featured Countries Section
    featuredCountriesTitle: 'Küresel İş Destinasyonları',
    featuredCountriesDescription: 'Uzman yerel rehberlikle uluslararası genişlemeniz için dünyanın en iş dostu yargı bölgelerinden seçim yapın.',
    businessFriendlyJurisdictions: '19+ İş Dostu Yargı Bölgesi',
    exploreAllCountriesBtn: 'Tüm Ülkeleri Keşfedin',

    // AI Promotion Section
    aiPromotionTitle: 'AI Oracle\'ınızla Tanışın',
    aiPromotionDescription: 'Uluslararası iş genişlemeniz için anında, kişiselleştirilmiş öneriler alın. AI\'mız ihtiyaçlarınızı analiz eder ve sizi mükemmel yargı bölgesi ve uzman danışmanla buluşturur.',
    instantJurisdictionRecommendations: 'Anında yargı bölgesi önerileri',
    aiPoweredExpertMatching: 'Yapay zeka destekli uzman eşleştirme',
    personalizedBusinessStrategies: 'Kişiselleştirilmiş iş stratejileri',
    tryAiAssistantFree: 'AI Asistanı Ücretsiz Deneyin',
    aiOracleAssistant: 'AI Oracle Asistanı',
    online: 'Çevrimiçi',

    // Service Detail Pages
    whichCountryTitle: 'Bu Hizmeti Hangi Ülkeden Almak İstiyorsunuz?',
    whichCountrySubtitle: 'İhtiyaçlarınıza özel avantajlar sunan, iş dostu yargı yetkilerimiz arasından seçim yapın.',
    availableIn: 'Mevcut',
    countries: 'ülkede',
    getStartedIn: 'Başlayın',
    aiAssistantGreeting: 'Merhaba! Ben AI Oracle asistanınızım. Uluslararası iş genişlemeniz için en iyi yargı yetkisi ve hizmetleri bulmanıza yardımcı olabilirim. Hangi tür bir iş kurmak istiyorsunuz?',
    aiAssistantPlaceholder: 'Yargı yetkileri, vergi oranları veya iş kurulumu hakkında sorun...',
    aiAssistantQuickStart: 'Hızlı başlangıç:',
    aiAssistantQuick1: 'Teknoloji şirketi kurmak istiyorum',
    aiAssistantQuick2: 'Vergi optimizasyonu arıyorum',
    aiAssistantQuick3: 'AB pazarına erişim istiyorum',
    aiAssistantQuick4: 'Kripto işi yapmak istiyorum',
    aiAssistantPageTitle: 'AI Oracle Asistanı',
    aiAssistantPageSubtitle: 'Uluslararası iş genişlemeniz için anında, kişiselleştirilmiş öneriler alın. AI\'mız ihtiyaçlarınızı analiz eder ve mükemmel yargı yetkisi ile hizmetleri önerir.',
    aiAssistantReadyTitle: 'Başlamaya Hazır mısınız?',
    aiAssistantReadyDesc: 'Uzman danışmanlarla bağlantı kurmak ve uluslararası genişlemenizi başlatmak için ücretsiz hesabınızı oluşturun.',
    createFreeAccount: 'Ücretsiz Hesap Oluştur',
    send: 'Gönder',
    startConsultation: 'Danışmanlığı Başlatın',

    // Real Time Analytics Section
    realTimeAnalyticsTitle: 'Gerçek Zamanlı Platform Analitikleri',
    realTimeAnalyticsDescription: 'Başarılı iş kuruluşlarını yönlendiren dünya çapındaki uzman danışman ağımızdan ve yapay zeka destekli analitiğimizden canlı içgörüler.',
    globalIntelligenceNetwork: 'Küresel Zeka Ağı',
    activeConsultations: 'Aktif Danışmanlıklar',
    strategicJurisdictions: 'Stratejik Yargı Bölgeleri',
    successRate: 'Başarı Oranı',
    avgResponseTime: 'Ort. Yanıt Süresi',
    aiPoweredMatching: 'Yapay Zeka Destekli Eşleştirme',
    aiMatchingDescription: 'Uzmanlık ve gereksinimlere dayalı akıllı danışman-müşteri eşleştirmesi',
    legalCompliance: 'Yasal Uyumluluk',
    legalComplianceDescription: 'Tüm öneriler tam uyumluluk için hukuk uzmanları tarafından gözden geçirilir',
    successOptimization: 'Başarı Optimizasyonu',
    successOptimizationDescription: 'Başarılı vaka kalıplarına dayalı sürekli optimizasyon',
    joinThousandsTitle: 'Binlerce Başarılı İşletmeye Katılın',
    joinThousandsDescription: '8 stratejik yargı bölgesinde uzman rehberlikle yapay zeka destekli danışmanlığın gücünü deneyimleyin.',
    startYourJourney: 'Yolculuğunuzu Başlatın',

    // Blog Section
    blogNewsTitle: 'Blog/Haberler',
    viewAllPosts: 'Tüm Yazıları Görüntüle',

    // Service names for sections
    companyFormationTitle: 'Şirket Kuruluşu',
    companyFormationDesc: 'İş dostu yargı bölgelerinde şirket tescili ve kuruluşu konusunda eksiksiz yardım.',
    taxOptimizationTitle: 'Vergi Optimizasyonu',
    taxOptimizationDesc: 'Uluslararası vergi yükünüzü yasal olarak en aza indirmek için stratejik vergi planlaması ve optimizasyonu.',
    bankingSolutionsTitle: 'Bankacılık Çözümleri',
    bankingSolutionsDesc: 'Uluslararası hesap açma ve küresel finansal ilişkiler kurma için kapsamlı bankacılık desteği.',
    legalComplianceTitle: 'Yasal Uyumluluk',
    legalComplianceDesc: 'İşletmenizin uyumlu kalması için sürekli yasal ve düzenleyici uyumluluk desteği.',
    assetProtectionTitle: 'Varlık Korunması',
    assetProtectionDesc: 'Uluslararası operasyonlarda varlıklarınızı korumak ve riskleri en aza indirmek için gelişmiş stratejiler.',
    investmentAdvisoryTitle: 'Yatırım Danışmanlığı',
    investmentAdvisoryDesc: 'Uluslararası pazarlar için ticari yatırım danışmanlığı ve büyüme stratejileri.',
    visaResidencyTitle: 'Vize ve İkamet',
    visaResidencyDesc: 'Uluslararası iş sahipleri, yatırımcılar ve aileleri için eksiksiz vize ve ikamet çözümleri.',
    marketResearchTitle: 'Pazar Araştırması',
    marketResearchDesc: 'Başarılı uluslararası iş genişlemesi için derinlemesine pazar analizi ve araştırması.',
    learnMore: 'Daha Fazla Bilgi',

    // Country names and details
    unitedArabEmirates: 'Birleşik Arap Emirlikleri',
    estonia: 'Estonya',
    georgia: 'Gürcistan',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portekiz',
    unitedStates: 'Amerika Birleşik Devletleri',
    montenegro: 'Karadağ',
    switzerland: 'İsviçre',

    // Country highlights
    uaeHighlight: 'Serbest bölgelerde 50 yıl boyunca %0 kurumlar vergisi',
    estoniaHighlight: '%100 online e-Residency programı',
    georgiaHighlight: 'Küçük İşletme Statüsü - %1 vergi',
    maltaHighlight: '%5 efektif vergi oranıyla AB üyeliği',
    panamaHighlight: 'Bölgesel vergi sistemi',
    portugalHighlight: 'AB ikametiyle Altın Vize programı',
    usaHighlight: 'Dünyanın en büyük ekonomisi ve pazarı',
    montenegroHighlight: 'Yatırımla vatandaşlık sunan AB adayı',
    switzerlandHighlight: 'Siyasi istikrar ve bankacılık mükemmelliği',

    // Country advantages
    noPersonalIncomeTax: 'Kişisel gelir vergisi yok',
    strategicLocation: 'Stratejik konum',
    modernInfrastructure: 'Modern altyapı',
    businessFriendlyRegulations: 'İş dostu düzenlemeler',
    digitalFirstApproach: 'Dijital öncelikli yaklaşım',
    euMarketAccess: 'AB pazarına erişim',
    lowBureaucracy: 'Düşük bürokrasi',
    innovationFriendly: 'İnovasyona dost',
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
    euCandidateStatus: 'AB aday statüsü',
    citizenshipByInvestment: 'Yatırımla vatandaşlık',
    lowCorporateTax: 'Düşük kurumlar vergisi',
    beautifulLocation: 'Güzel konum',
    politicalStability: 'Siyasi istikrar',
    worldClassBanking: 'Dünya standartlarında bankacılık',
    strategicEuLocation: 'Stratejik AB konumu',

    // Services Content
    companyFormationTitle: 'Şirket Kuruluşu',
    companyFormationDesc: 'İş dostu yargı bölgelerinde şirket tescili ve kuruluşu konusunda eksiksiz yardım.',
    taxOptimizationTitle: 'Vergi Optimizasyonu',
    taxOptimizationDesc: 'Uluslararası vergi yükünüzü yasal olarak en aza indirmek için stratejik vergi planlaması.',
    bankingSolutionsTitle: 'Bankacılık Çözümleri',
    bankingSolutionsDesc: 'Uluslararası banka hesabı açılışı ve küresel bankacılık ilişkileri kurma konusunda yardım.',
    legalComplianceTitle: 'Yasal Uyumluluk',
    legalComplianceDesc: 'İşletmenizin uyumlu kalması için sürekli yasal ve düzenleyici uyumluluk desteği.',
    assetProtectionTitle: 'Varlık Korunması',
    assetProtectionDesc: 'Uluslararası iş operasyonlarında varlıklarınızı korumak ve riskleri en aza indirmek için stratejiler.',
    investmentAdvisoryTitle: 'Yatırım Danışmanlığı',
    investmentAdvisoryDesc: 'Uluslararası pazarlar için ticari yatırım danışmanlığı ve büyüme stratejileri.',
    visaResidencyTitle: 'Vize ve İkamet',
    visaResidencyDesc: 'Uluslararası iş sahipleri ve yatırımcılar için eksiksiz vize ve ikamet çözümleri.',
    marketResearchTitle: 'Pazar Araştırması',
    marketResearchDesc: 'Başarılı uluslararası iş genişlemesi için derinlemesine pazar analizi ve araştırması.',
    learnMore: 'Daha Fazla Bilgi',

    // Countries Content
    unitedArabEmirates: 'Birleşik Arap Emirlikleri',
    estonia: 'Estonya',
    georgia: 'Gürcistan',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portekiz',
    unitedStates: 'Amerika Birleşik Devletleri',
    montenegro: 'Karadağ',
    switzerland: 'İsviçre',

    // Country highlights
    uaeHighlight: 'Serbest bölgelerde 50 yıl boyunca %0 kurumlar vergisi',
    estoniaHighlight: '%100 online e-Residency programı',
    georgiaHighlight: 'Küçük İşletme Statüsü - %1 vergi',
    maltaHighlight: '%5 efektif vergi oranıyla AB üyeliği',
    panamaHighlight: 'Bölgesel vergi sistemi',
    portugalHighlight: 'AB ikametiyle Altın Vize programı',
    usaHighlight: 'Dünyanın en büyük ekonomisi ve pazarı',
    montenegroHighlight: 'Yatırımla vatandaşlık sunan AB adayı',
    switzerlandHighlight: 'Siyasi istikrar ve bankacılık mükemmelliği',

    // Country advantages
    noPersonalIncomeTax: 'Kişisel gelir vergisi yok',
    strategicLocation: 'Stratejik konum',
    modernInfrastructure: 'Modern altyapı',
    businessFriendlyRegulations: 'İş dostu düzenlemeler',
    digitalFirstApproach: 'Dijital öncelikli yaklaşım',
    euMarketAccess: 'AB pazarına erişim',
    lowBureaucracy: 'Düşük bürokrasi',
    innovationFriendly: 'İnovasyona dost',
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
    euCandidateStatus: 'AB aday statüsü',
    citizenshipByInvestment: 'Yatırımla vatandaşlık',
    lowCorporateTax: 'Düşük kurumlar vergisi',
    beautifulLocation: 'Güzel konum',
    politicalStability: 'Siyasi istikrar',
    worldClassBanking: 'Dünya standartlarında bankacılık',
    strategicEuLocation: 'Stratejik AB konumu',
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

    // Hero Section (HomePage)
    heroTitle: 'Inteligência Global Aprimorada por IA',
    heroSubtitle: 'ao Seu Serviço',
    heroDescription: 'Orientação regulatória de próximo nível com automação inteligente. Nossa plataforma alimentada por IA conecta você com consultores especialistas nas jurisdições mais favoráveis aos negócios do mundo.',
    getStarted: 'Comece Hoje',
    exploreServices: 'Explorar Serviços',

    // Company Formation CTA (HomePage)
    companyTitle: 'Formação de Empresa',
    companySubtitle: 'Configuração de negócios rápida e confiável em todo o mundo',
    companyFeature1: 'Orientação especializada',
    companyFeature2: 'Rede global',
    companyFeature3: 'Conformidade garantida',
    companyFeature4: 'Suporte profissional',
    companyCta: 'Iniciar Formação de Empresa',

    // Wealth Management CTA (HomePage)
    wealthTitle: 'Gestão de Patrimônio',
    wealthSubtitle: 'Estratégias de investimento com IA para otimização global de patrimônio',
    wealthFeature1: 'Análise orientada por IA',
    wealthFeature2: 'Oportunidades globais',
    wealthFeature3: 'Potencial ilimitado',
    wealthStat1: '$2,5B+ Gerenciados',
    wealthStat2: '98% Taxa de Sucesso',
    wealthCta: 'Explorar Soluções de Patrimônio',

    // Footer
    copyright: '© 2025 Consulting19. Todos os direitos reservados',
    powered: 'Desenvolvido por AI Oracle',

    // Services Page
    servicesHeroTitle: 'Serviços Abrangentes de Negócios Internacionais',
    servicesHeroDescription: 'Desde a formação da empresa até a conformidade contínua, fornecemos suporte completo entregue por consultores especializados em mais de 19 países em todo o mundo.',
    
    // Service Categories
    companyFormation: 'Formação de Empresa',
    companyFormationDesc: 'Assistência completa no registro e incorporação de empresas em jurisdições favoráveis aos negócios.',
    companyFormationService1: 'Registro e incorporação de empresas',
    companyFormationService2: 'Pedidos de licença comercial',
    companyFormationService3: 'Otimização da estrutura corporativa',
    companyFormationService4: 'Serviços de agente registrado',
    companyFormationService5: 'Soluções de escritório virtual',

    taxOptimization: 'Otimização Fiscal',
    taxOptimizationDesc: 'Planejamento e otimização fiscal estratégica para minimizar legalmente sua carga tributária internacional.',
    taxOptimizationService1: 'Planejamento tributário internacional',
    taxOptimizationService2: 'Otimização de tratados de dupla tributação',
    taxOptimizationService3: 'Estratégias de residência fiscal',
    taxOptimizationService4: 'Orientação sobre preços de transferência',
    taxOptimizationService5: 'Conformidade fiscal anual',

    bankingSolutions: 'Soluções Bancárias',
    bankingSolutionsDesc: 'Suporte bancário abrangente para operações comerciais internacionais.',
    bankingSolutionsService1: 'Abertura de conta bancária internacional',
    bankingSolutionsService2: 'Configuração de conta em várias moedas',
    bankingSolutionsService3: 'Integração de gateway de pagamento',
    bankingSolutionsService4: 'Gestão de relacionamento bancário',
    bankingSolutionsService5: 'Soluções de financiamento comercial',

    legalCompliance: 'Conformidade Legal',
    legalComplianceDesc: 'Suporte contínuo de conformidade legal e regulatória para manter seu negócio em conformidade.',
    legalComplianceService1: 'Monitoramento de conformidade regulatória',
    legalComplianceService2: 'Revisão e elaboração de contratos',
    legalComplianceService3: 'Otimização da estrutura legal',
    legalComplianceService4: 'Proteção da propriedade intelectual',
    legalComplianceService5: 'Conformidade com a proteção de dados',

    assetProtection: 'Proteção de Ativos',
    assetProtectionDesc: 'Estratégias avançadas para proteger seus ativos e minimizar riscos em operações internacionais.',
    assetProtectionService1: 'Estratégias de proteção de ativos',
    assetProtectionService2: 'Configuração de trust e fundação',
    assetProtectionService3: 'Avaliação e mitigação de riscos',
    assetProtectionService4: 'Planejamento patrimonial para ativos internacionais',
    assetProtectionService5: 'Otimização de seguros',

    investmentAdvisory: 'Consultoria de Investimento',
    investmentAdvisoryDesc: 'Consultoria de investimento comercial e estratégias de crescimento para mercados internacionais.',
    investmentAdvisoryService1: 'Estratégias de entrada no mercado',
    investmentAdvisoryService2: 'Otimização da estrutura de investimento',
    investmentAdvisoryService3: 'Suporte de due diligence',
    investmentAdvisoryService4: 'Planejamento de estratégia de saída',
    investmentAdvisoryService5: 'Consultoria de M&A transfronteiriça',

    exploreCategory: 'Explorar',
    servicesCtaTitle: 'Precisa de uma Solução Personalizada?',
    servicesCtaDescription: 'Nossos consultores especializados podem criar uma estratégia sob medida para suas necessidades de negócios exclusivas.',
    consultExpertBtn: 'Consultar Especialista',
    exploreCountriesBtn: 'Explorar Países',

    // Countries Page
    countriesHeroTitle: 'Destinos de Negócios Globais',
    countriesHeroDescription: 'Explore as jurisdições mais favoráveis aos negócios do mundo. Cada local oferece vantagens únicas para expansão internacional e otimização fiscal.',
    searchPlaceholder: 'Pesquisar países...',
    allRegions: 'Todas as Regiões',
    regionEurope: 'Europa',
    regionAsia: 'Ásia',
    regionMiddleEast: 'Oriente Médio',
    regionAmericas: 'Américas',
    availableDestinations: 'Destinos Disponíveis',
    noCountriesFoundTitle: 'Nenhum país encontrado',
    noCountriesFoundDesc: 'Tente ajustar seus critérios de pesquisa ou filtro.',
    corporateTax: 'Imposto Corporativo',
    featuredBadge: 'DESTAQUE',
    learnMoreBtn: 'Saiba Mais',

    // About Page
    aboutHeroTitle: 'Sobre a Consulting19',
    aboutHeroDescription: 'Estamos revolucionando a consultoria de negócios internacionais combinando inteligência alimentada por IA com uma rede global de consultores especializados.',
    missionTitle: 'Nossa Missão',
    missionDesc1: 'Democratizar a expansão de negócios internacionais, tornando o aconselhamento especializado acessível, acessível e instantâneo através do poder da inteligência artificial.',
    missionDesc2: 'Acreditamos que todo empreendedor deve ter acesso a orientação de negócios internacionais de classe mundial, independentemente de sua localização ou tamanho de negócio.',
    valuesTitle: 'Nossos Valores',
    valuesDescription: 'Os princípios que guiam tudo o que fazemos na Consulting19.',
    globalExpertise: 'Experiência Global',
    globalExpertiseDesc: 'Conhecimento profundo dos cenários de negócios internacionais em mais de 19 países.',
    aiEfficiency: 'Eficiência Alimentada por IA',
    aiEfficiencyDesc: 'Tecnologia de IA de ponta combinada com experiência humana para resultados ótimos.',
    trustSecurity: 'Confiança e Segurança',
    trustSecurityDesc: 'Segurança de nível empresarial protegendo suas informações comerciais confidenciais.',
    resultsDriven: 'Orientado a Resultados',
    resultsDrivenDesc: 'Focado em entregar resultados mensuráveis para sua expansão internacional.',
    teamTitle: 'Conheça Nossa Equipe',
    teamDescription: 'Profissionais experientes de empresas de consultoria e tecnologia líderes.',
    teamMemberRoleErdal: 'Especialista em SEO e Marketing Digital',
    teamMemberBioErdal: 'Especialista em otimização de mecanismos de busca e estratégias de marketing digital para expansão de negócios internacionais.',
    linkedinProfile: 'Perfil do LinkedIn',
    storyTitle: 'Nossa História',
    storyDesc1: 'A Consulting19 nasceu de uma observação simples: a expansão de negócios internacionais é desnecessariamente complexa e cara. As firmas de consultoria tradicionais cobram taxas premium enquanto os empreendedores lutam para navegar sozinhos pelas regulamentações estrangeiras.',
    storyDesc2: 'Ao combinar tecnologia de IA de ponta com uma rede cuidadosamente selecionada de consultores especializados em jurisdições favoráveis aos negócios, criamos uma plataforma que oferece consultoria de nível empresarial por uma fração dos custos tradicionais.',
    storyDesc3: 'Hoje, temos orgulho de atender centenas de empreendedores em todo o mundo, ajudando-os a economizar milhões em impostos enquanto expandem seus negócios além das fronteiras com confiança.',
    ctaTitle: 'Pronto para se Juntar à Nossa Missão?',
    ctaDescription: 'Seja você um empreendedor buscando expandir globalmente ou um consultor especializado querendo ajudar outros, adoraríamos tê-lo a bordo.',
    startExpansionBtn: 'Comece Sua Expansão',
    becomeConsultantBtn: 'Torne-se um Consultor',

    // Hero Section
    heroTitle1: 'Inteligência Global Aprimorada por IA',
    heroSubtitle1: 'ao Seu Serviço',
    heroDescription1: 'Orientação regulatória de próximo nível com automação inteligente. Nossa plataforma alimentada por IA conecta você com consultores especialistas nas jurisdições mais favoráveis aos negócios do mundo.',
    heroTitle2: 'Rede Global de Especialistas',
    heroSubtitle2: 'em 19+ Países',
    heroDescription2: 'Conecte-se com consultores de negócios certificados e especialistas legais em jurisdições estratégicas. Do EAU à Estônia, nossa rede garante que você tenha experiência local com alcance global.',
    heroTitle3: 'Correspondência Instantânea Alimentada por IA',
    heroSubtitle3: 'Seleção Inteligente de Consultor',
    heroDescription3: 'Nosso AI Oracle avançado analisa suas necessidades de negócios e instantaneamente combina você com o consultor perfeito e jurisdição para máxima eficiência fiscal e conformidade.',
    heroTitle4: '98% Taxa de Sucesso',
    heroSubtitle4: 'Histórico Comprovado',
    heroDescription4: 'Mais de 1.000 formações de empresas bem-sucedidas com taxas de conclusão líderes do setor. Nossa abordagem sistemática e orientação especializada garantem que sua expansão internacional seja bem-sucedida.',
    heroTitle5: 'Segurança de Nível Empresarial',
    heroSubtitle5: 'Proteção de Nível Bancário',
    heroDescription5: 'Seus dados comerciais sensíveis são protegidos com criptografia de nível militar, segurança de nível de linha e conformidade com padrões internacionais de proteção de dados.',
    heroPrimaryCTA1: 'Comece Hoje',
    heroSecondaryCTA1: 'Explorar Serviços',
    heroPrimaryCTA2: 'Encontre Seu Especialista',
    heroSecondaryCTA2: 'Ver Países',
    heroPrimaryCTA3: 'Experimente AI Oracle',
    heroSecondaryCTA3: 'Saiba Mais',
    heroPrimaryCTA4: 'Ver Histórias de Sucesso',
    heroSecondaryCTA4: 'Nosso Processo',
    heroPrimaryCTA5: 'Detalhes de Segurança',
    heroSecondaryCTA5: 'Informações de Conformidade',
    aiPoweredIntelligence: 'Inteligência Alimentada por IA',

    // How It Works Section
    howItWorksTitle: 'Como Nosso AI Oracle Funciona',
    howItWorksDescription: 'Experimente o futuro da consultoria de negócios internacionais com nossa plataforma revolucionária alimentada por IA que combina inteligência artificial com experiência humana.',
    aiPoweredProcess: 'Processo Alimentado por IA',
    step1Title: 'Análise de Negócios Alimentada por IA',
    step1Description: 'Nosso AI Oracle avançado analisa seu modelo de negócios, mercados-alvo e objetivos de crescimento para criar um roteiro de expansão personalizado adaptado às suas necessidades únicas.',
    step2Title: 'Recomendações Inteligentes Instantâneas',
    step2Description: 'Em minutos, receba recomendações geradas por IA para jurisdições ótimas, estruturas fiscais e estratégias de negócios baseadas em dados em tempo real e inteligência regulatória.',
    step3Title: 'Conexão Humana Especializada',
    step3Description: 'Seja combinado com especialistas certificados em seus países escolhidos que combinam experiência local com nossas percepções de IA para entregar soluções personalizadas e conformes.',
    step4Title: 'Expansão Global Perfeita',
    step4Description: 'Lance suas operações internacionais com confiança, apoiado por monitoramento contínuo de IA, atualizações de conformidade e suporte especializado durante sua jornada de crescimento.',
    experienceAiConsulting: 'Experimente Consultoria Alimentada por IA Hoje',

    // Services Overview Section
    servicesOverviewTitle: 'Serviços Abrangentes de Negócios Internacionais',
    servicesOverviewDescription: 'Desde a formação da empresa até a conformidade contínua, fornecemos suporte completo entregue por consultores especializados em todo o mundo.',
    endToEndSolutions: 'Soluções de Negócios Completas',
    viewAllServicesBtn: 'Ver Todos os Serviços',

    // Featured Countries Section
    featuredCountriesTitle: 'Destinos de Negócios Globais',
    featuredCountriesDescription: 'Escolha entre as jurisdições mais favoráveis aos negócios do mundo para sua expansão internacional com orientação especializada local.',
    businessFriendlyJurisdictions: '19+ Jurisdições Favoráveis aos Negócios',
    exploreAllCountriesBtn: 'Explorar Todos os Países',

    // AI Promotion Section
    aiPromotionTitle: 'Conheça Seu AI Oracle',
    aiPromotionDescription: 'Obtenha recomendações instantâneas e personalizadas para sua expansão de negócios internacionais. Nossa IA analisa suas necessidades e conecta você com a jurisdição perfeita e consultor especialista.',
    instantJurisdictionRecommendations: 'Recomendações instantâneas de jurisdição',
    aiPoweredExpertMatching: 'Correspondência de especialistas alimentada por IA',
    personalizedBusinessStrategies: 'Estratégias de negócios personalizadas',
    tryAiAssistantFree: 'Experimente Assistente IA Grátis',
    aiOracleAssistant: 'Assistente AI Oracle',
    online: 'Online',
    aiAssistantGreeting: 'Olá! Sou seu assistente AI Oracle. Posso ajudá-lo a encontrar a melhor jurisdição e serviços para sua expansão internacional de negócios. Que tipo de negócio você está procurando estabelecer?',
    aiAssistantPlaceholder: 'Pergunte-me sobre jurisdições, taxas de impostos ou configuração de negócios...',
    aiAssistantQuickStart: 'Início rápido:',
    aiAssistantQuick1: 'Quero começar uma empresa de tecnologia',
    aiAssistantQuick2: 'Procurando otimização fiscal',
    aiAssistantQuick3: 'Preciso de acesso ao mercado da UE',
    aiAssistantQuick4: 'Interessado em negócios cripto',
    aiAssistantPageTitle: 'Assistente AI Oracle',
    aiAssistantPageSubtitle: 'Obtenha recomendações instantâneas e personalizadas para sua expansão internacional de negócios. Nossa IA analisa suas necessidades e sugere a jurisdição e serviços perfeitos.',
    aiAssistantReadyTitle: 'Pronto para Começar?',
    aiAssistantReadyDesc: 'Crie sua conta gratuita para se conectar com consultores especialistas e iniciar sua expansão internacional.',
    createFreeAccount: 'Criar Conta Gratuita',
    send: 'Enviar',
    startConsultation: 'Iniciar Consulta',

    // Service Detail Pages
    whichCountryTitle: 'De Qual País Você Gostaria Deste Serviço?',
    whichCountrySubtitle: 'Escolha entre nossa rede de jurisdições favoráveis aos negócios, cada uma oferecendo vantagens únicas para suas necessidades específicas.',
    availableIn: 'Disponível em',
    countries: 'países',
    getStartedIn: 'Começar em',

    // Real Time Analytics Section
    realTimeAnalyticsTitle: 'Análises da Plataforma em Tempo Real',
    realTimeAnalyticsDescription: 'Insights ao vivo de nossa rede mundial de consultores especializados e análises alimentadas por IA impulsionando formações de negócios bem-sucedidas.',
    globalIntelligenceNetwork: 'Rede de Inteligência Global',
    activeConsultations: 'Consultas Ativas',
    strategicJurisdictions: 'Jurisdições Estratégicas',
    successRate: 'Taxa de Sucesso',
    avgResponseTime: 'Tempo Médio de Resposta',
    aiPoweredMatching: 'Correspondência Alimentada por IA',
    aiMatchingDescription: 'Emparelhamento inteligente consultor-cliente baseado em experiência e requisitos',
    legalCompliance: 'Conformidade Legal',
    legalComplianceDescription: 'Todas as recomendações revisadas por especialistas legais para conformidade total',
    successOptimization: 'Otimização de Sucesso',
    successOptimizationDescription: 'Otimização contínua baseada em padrões de casos bem-sucedidos',
    joinThousandsTitle: 'Junte-se a Milhares de Negócios Bem-Sucedidos',
    joinThousandsDescription: 'Experimente o poder da consultoria aprimorada por IA com orientação especializada em 8 jurisdições estratégicas em todo o mundo.',
    startYourJourney: 'Comece Sua Jornada',

    // Blog Section
    blogNewsTitle: 'Blog/Notícias',
    viewAllPosts: 'Ver Todas as Postagens',

    // Service names for sections
    companyFormationTitle: 'Formação de Empresa',
    companyFormationDesc: 'Assistência completa no registro e incorporação de empresas em jurisdições favoráveis aos negócios.',
    taxOptimizationTitle: 'Otimização Fiscal',
    taxOptimizationDesc: 'Planejamento e otimização fiscal estratégica para minimizar legalmente sua carga tributária internacional.',
    bankingSolutionsTitle: 'Soluções Bancárias',
    bankingSolutionsDesc: 'Suporte bancário abrangente para abertura de contas internacionais e estabelecimento de relacionamentos financeiros globais.',
    legalComplianceTitle: 'Conformidade Legal',
    legalComplianceDesc: 'Suporte contínuo de conformidade legal e regulatória para manter seu negócio em conformidade.',
    assetProtectionTitle: 'Proteção de Ativos',
    assetProtectionDesc: 'Estratégias avançadas para proteger seus ativos e minimizar riscos em operações internacionais.',
    investmentAdvisoryTitle: 'Consultoria de Investimento',
    investmentAdvisoryDesc: 'Consultoria de investimento comercial e estratégias de crescimento para mercados internacionais.',
    visaResidencyTitle: 'Visto e Residência',
    visaResidencyDesc: 'Soluções completas de visto e residência para proprietários de empresas internacionais, investidores e suas famílias.',
    marketResearchTitle: 'Pesquisa de Mercado',
    marketResearchDesc: 'Análise e pesquisa de mercado aprofundada para expansão internacional de negócios bem-sucedida.',
    learnMore: 'Saiba Mais',

    // Country names and details
    unitedArabEmirates: 'Emirados Árabes Unidos',
    estonia: 'Estônia',
    georgia: 'Geórgia',
    malta: 'Malta',
    panama: 'Panamá',
    portugal: 'Portugal',
    unitedStates: 'Estados Unidos',
    montenegro: 'Montenegro',
    switzerland: 'Suíça',

    // Country highlights
    uaeHighlight: '0% imposto corporativo por 50 anos em zonas francas',
    estoniaHighlight: 'Programa de e-Residência 100% online',
    georgiaHighlight: 'Status de Pequena Empresa - 1% de imposto',
    maltaHighlight: 'Membro da UE com taxa efetiva de 5%',
    panamaHighlight: 'Sistema tributário territorial',
    portugalHighlight: 'Programa Golden Visa com residência na UE',
    usaHighlight: 'Maior economia e mercado do mundo',
    montenegroHighlight: 'Candidato à UE com cidadania por investimento',
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
    internationalBusinessHub: 'Centro de negócios internacionais',
    nhrTaxProgram: 'Programa fiscal NHR',
    investmentImmigration: 'Imigração por investimento',
    strategicAtlanticLocation: 'Localização estratégica no Atlântico',
    largestConsumerMarket: 'Maior mercado consumidor',
    advancedInfrastructure: 'Infraestrutura avançada',
    innovationHub: 'Centro de inovação',
    strongLegalSystem: 'Sistema legal forte',
    euCandidateStatus: 'Status de candidato à UE',
    citizenshipByInvestment: 'Cidadania por investimento',
    lowCorporateTax: 'Baixo imposto corporativo',
    beautifulLocation: 'Localização bonita',
    politicalStability: 'Estabilidade política',
    worldClassBanking: 'Bancário de classe mundial',
    strategicEuLocation: 'Localização estratégica na UE',
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