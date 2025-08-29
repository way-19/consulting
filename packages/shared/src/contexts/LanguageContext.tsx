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
    
    // About Page - New Content
    aboutHeroTitle: 'About Consulting19',
    aboutHeroDescription: 'Since 2016, we\'ve been simplifying international expansion by combining AI-powered intelligence with a global network of expert advisors. We help founders and investors launch, bank, optimize taxes, and stay compliant across 19+ countries.',
    startYourExpansion: 'Start Your Expansion',
    exploreCountries: 'Explore Countries',
    
    missionTitle: 'Our Mission',
    missionDescription: 'To democratize international expansion by making expert guidance accessible, fast, and fairly priced. We deliver enterprise-grade outcomes for companies of all sizes through the practical blend of automation and local expertise.',
    
    valuesTitle: 'Our Values',
    valuesDescription: 'The principles that guide everything we do at Consulting19.',
    globalExpertise: 'Global Expertise',
    globalExpertiseDesc: 'On-the-ground knowledge across 19+ jurisdictions.',
    aiEfficiency: 'AI-Powered Efficiency',
    aiEfficiencyDesc: 'Faster analysis, fewer errors, better decisions.',
    trustSecurity: 'Trust & Security',
    trustSecurityDesc: 'Enterprise-grade security and data privacy.',
    resultsDriven: 'Results-Driven',
    resultsDrivenDesc: 'Measurable outcomes and clear accountability.',
    
    foundedTitle: 'Founded in 2016',
    founded2016: 'Founded',
    founded2016Desc: 'First cross-border formation projects completed.',
    founded2019: '10+ Countries',
    founded2019Desc: 'Scaled expert network; added banking & compliance.',
    founded2022: 'AI Assistant',
    founded2022Desc: 'Automated workflows for KYC, filings, and tax routing.',
    founded2025: 'Flagship Platforms',
    founded2025Desc: 'Matrix (UHNW) and FidelKey (Secured Title Investment) launched.',
    
    flagshipPlatformsTitle: 'Flagship Platforms',
    flagshipPlatformsDescription: 'Premium solutions for sophisticated clients and unique investment opportunities.',
    
    matrixBadge: 'Premium',
    matrixTitle: 'Matrix — Private Wealth Platform',
    matrixDescription: 'A privacy-first platform for ultra-high-net-worth clients. AI-assisted global allocation, multi-jurisdiction banking, and discreet execution. Minimum investment: $5M.',
    matrixFeature1: 'AI-driven analysis',
    matrixFeature2: 'Global opportunities',
    matrixFeature3: 'Strict confidentiality',
    matrixCTA: 'Explore Matrix Wealth',
    matrixNote: 'For qualified investors only.',
    
    fidelkeyBadge: 'Innovation',
    fidelkeyTitle: 'FidelKey — Secured Title Investment System',
    fidelkeyDescription: 'The world\'s first secured-title investment gateway combining real-estate ownership, financial returns, and international visa pathways under a collateralized title model.',
    fidelkeyFeature1: 'Secured title structure',
    fidelkeyFeature2: 'Residency options',
    fidelkeyFeature3: 'Rental/dividend yield potential',
    fidelkeyCTA: 'Explore FidelKey',
    
    storyTitle: 'Our Story',
    storyDescription: 'Consulting19 began in 2016 with a simple observation: cross-border expansion was harder than it needed to be. By pairing cutting-edge AI with a curated network of local experts, we deliver enterprise-level results—company formation, banking, tax optimization, and compliance—faster and more predictably than traditional models.',
    
    impactMetricsTitle: 'Impact Metrics',
    countriesSupported: 'Countries supported',
    companiesFormed: 'Companies formed & supported',
    successRate: 'Success rate (company setup)',
    avgSetupTime: 'Days average setup (selected jurisdictions)',
    
    finalCtaTitle: 'Ready to Join Our Mission?',
    finalCtaDescription: 'Whether you\'re expanding globally or advising clients, we\'d love to collaborate.',
    becomeConsultant: 'Become a Consultant',
    
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
    heroSubtitle3: 'Smart
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
    register: 'Kayıt',
    logout: 'Çıkış',
    dashboard: 'Panel',
    viewAllServices: 'Tüm Hizmetleri Görüntüle',
    viewAllCountries: 'Tüm Ülkeleri Görüntüle',

    // Hero Section (HomePage)
    heroTitle: 'AI Destekli Küresel İstihbarat',
    heroSubtitle: 'Hizmetinizde',
    heroDescription: 'Akıllı otomasyon ile yeni nesil düzenleyici rehberlik. AI destekli platformumuz sizi dünyanın en iş dostu yargı alanlarındaki uzman danışmanlarla buluşturuyor.',
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
    wealthSubtitle: 'Küresel varlık optimizasyonu için AI destekli yatırım stratejileri',
    wealthFeature1: 'AI odaklı analiz',
    wealthFeature2: 'Küresel fırsatlar',
    wealthFeature3: 'Sınırsız potansiyel',
    wealthStat1: '$2.5B+ Yönetilen',
    wealthStat2: '%98 Başarı Oranı',
    wealthCta: 'Varlık Çözümlerini Keşfedin',

    // Footer
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır',
    powered: 'AI Oracle tarafından desteklenmektedir',

    // Services Page
    servicesHeroTitle: 'Kapsamlı Uluslararası İş Hizmetleri',
    servicesHeroDescription: 'Şirket kuruluşundan sürekli uyumluluğa kadar, dünya çapında 19\'dan fazla ülkede uzman danışmanlar tarafından sunulan uçtan uca destek sağlıyoruz.',
    
    // Service Categories
    companyFormation: 'Şirket Kuruluşu',
    companyFormationDesc: 'İş dostu yargı alanlarında şirket kaydı ve kuruluşunda tam destek.',
    companyFormationService1: 'Şirket kaydı ve kuruluşu',
    companyFormationService2: 'İş lisansı başvuruları',
    companyFormationService3: 'Kurumsal yapı optimizasyonu',
    companyFormationService4: 'Kayıtlı temsilci hizmetleri',
    companyFormationService5: 'Sanal ofis çözümleri',

    taxOptimization: 'Vergi Optimizasyonu',
    taxOptimizationDesc: 'Uluslararası vergi yükünüzü yasal olarak minimize etmek için stratejik vergi planlama ve optimizasyon.',
    taxOptimizationService1: 'Uluslararası vergi planlama',
    taxOptimizationService2: 'Çifte vergilendirme anlaşması optimizasyonu',
    taxOptimizationService3: 'Vergi ikamet stratejileri',
    taxOptimizationService4: 'Transfer fiyatlandırması rehberliği',
    taxOptimizationService5: 'Yıllık vergi uyumluluğu',

    bankingSolutions: 'Bankacılık Çözümleri',
    bankingSolutionsDesc: 'Uluslararası iş operasyonları için kapsamlı bankacılık desteği.',
    bankingSolutionsService1: 'Uluslararası banka hesabı açma',
    bankingSolutionsService2: 'Çok para birimli hesap kurulumu',
    bankingSolutionsService3: 'Ödeme geçidi entegrasyonu',
    bankingSolutionsService4: 'Bankacılık ilişkileri yönetimi',
    bankingSolutionsService5: 'Ticaret finansmanı çözümleri',

    legalCompliance: 'Yasal Uyumluluk',
    legalComplianceDesc: 'İşinizi uyumlu tutmak için sürekli yasal ve düzenleyici uyumluluk desteği.',
    legalComplianceService1: 'Düzenleyici uyumluluk izleme',
    legalComplianceService2: 'Sözleşme incelemeleri ve taslak hazırlama',
    legalComplianceService3: 'Yasal yapı optimizasyonu',
    legalComplianceService4: 'Fikri mülkiyet koruması',
    legalComplianceService5: 'Veri koruma uyumluluğu',

    assetProtection: 'Varlık Koruması',
    assetProtectionDesc: 'Uluslararası operasyonlarda varlıklarınızı korumak ve riskleri minimize etmek için gelişmiş stratejiler.',
    assetProtectionService1: 'Varlık koruma stratejileri',
    assetProtectionService2: 'Güven ve vakıf kurulumu',
    assetProtectionService3: 'Risk değerlendirmesi ve azaltma',
    assetProtectionService4: 'Uluslararası varlıklar için emlak planlama',
    assetProtectionService5: 'Sigorta optimizasyonu',

    investmentAdvisory: 'Yatırım Danışmanlığı',
    investmentAdvisoryDesc: 'Uluslararası pazarlar için ticari yatırım danışmanlığı ve büyüme stratejileri.',
    investmentAdvisoryService1: 'Pazar giriş stratejileri',
    investmentAdvisoryService2: 'Yatırım yapısı optimizasyonu',
    investmentAdvisoryService3: 'Durum tespiti desteği',
    investmentAdvisoryService4: 'Çıkış stratejisi planlama',
    investmentAdvisoryService5: 'Sınır ötesi M&A danışmanlığı',

    exploreCategory: 'Keşfet',
    servicesCtaTitle: 'Özel Bir Çözüme İhtiyacınız Var mı?',
    servicesCtaDescription: 'Uzman danışmanlarımız benzersiz iş ihtiyaçlarınız için özel bir strateji oluşturabilir.',
    consultExpertBtn: 'Uzmanla Görüşün',
    exploreCountriesBtn: 'Ülkeleri Keşfedin',

    // Countries Page
    countriesHeroTitle: 'Küresel İş Destinasyonları',
    countriesHeroDescription: 'Dünyanın en iş dostu yargı alanlarını keşfedin. Her lokasyon uluslararası genişleme ve vergi optimizasyonu için benzersiz avantajlar sunar.',
    searchPlaceholder: 'Ülke ara...',
    allRegions: 'Tüm Bölgeler',
    regionEurope: 'Avrupa',
    regionAsia: 'Asya',
    regionMiddleEast: 'Orta Doğu',
    regionAmericas: 'Amerika',
    availableDestinations: 'Mevcut Destinasyonlar',
    noCountriesFoundTitle: 'Ülke bulunamadı',
    noCountriesFoundDesc: 'Arama veya filtre kriterlerinizi ayarlamayı deneyin.',
    corporateTax: 'Kurumlar Vergisi',
    featuredBadge: 'ÖNE ÇIKAN',
    learnMoreBtn: 'Daha Fazla Bilgi',

    // About Page
    aboutHeroTitle: 'Consulting19 Hakkında',
    aboutHeroDescription: 'AI destekli zeka ile küresel uzman danışman ağını birleştirerek uluslararası iş danışmanlığında devrim yaratıyoruz.',
    missionTitle: 'Misyonumuz',
    missionDesc1: 'Yapay zeka gücü aracılığıyla uzman tavsiyeyi erişilebilir, uygun fiyatlı ve anında hale getirerek uluslararası iş genişlemesini demokratikleştirmek.',
    missionDesc2: 'Her girişimcinin, konumu veya işletme büyüklüğü ne olursa olsun, dünya standartlarında uluslararası iş rehberliğine erişimi olması gerektiğine inanıyoruz.',
    valuesTitle: 'Değerlerimiz',
    valuesDescription: 'Consulting19\'da yaptığımız her şeye rehberlik eden ilkeler.',
    globalExpertise: 'Küresel Uzmanlık',
    globalExpertiseDesc: '19+ ülkede uluslararası iş manzaralarının derinlemesine bilgisi.',
    aiEfficiency: 'AI Destekli Verimlilik',
    aiEfficiencyDesc: 'Optimal sonuçlar için insan uzmanlığı ile birleştirilmiş son teknoloji AI.',
    trustSecurity: 'Güven ve Güvenlik',
    trustSecurityDesc: 'Hassas iş bilgilerinizi koruyan kurumsal düzeyde güvenlik.',
    resultsDriven: 'Sonuç Odaklı',
    resultsDrivenDesc: 'Uluslararası genişlemeniz için ölçülebilir sonuçlar sunmaya odaklanmış.',
    teamTitle: 'Ekibimizle Tanışın',
    teamDescription: 'Önde gelen danışmanlık firmalarından ve teknoloji şirketlerinden deneyimli profesyoneller.',
    teamMemberRoleErdal: 'SEO ve Dijital Pazarlama Uzmanı',
    teamMemberBioErdal: 'Uluslararası iş genişlemesi için arama motoru optimizasyonu ve dijital pazarlama stratejileri uzmanı.',
    linkedinProfile: 'LinkedIn Profili',
    storyTitle: 'Hikayemiz',
    storyDesc1: 'Consulting19 basit bir gözlemden doğdu: uluslararası iş genişlemesi gereksiz yere karmaşık ve pahalı. Geleneksel danışmanlık firmaları premium ücretler alırken girişimciler yabancı düzenlemelerde tek başlarına yol almaya çalışıyor.',
    storyDesc2: 'Son teknoloji AI teknolojisini iş dostu yargı alanlarındaki özenle seçilmiş uzman danışman ağıyla birleştirerek, geleneksel maliyetlerin çok altında kurumsal düzeyde danışmanlık sunan bir platform yarattık.',
    storyDesc3: 'Bugün, dünya çapında yüzlerce girişimciye hizmet vermekten gurur duyuyoruz, vergilerde milyonlar tasarruf etmelerine yardımcı olurken işlerini güvenle sınırlar ötesine genişletiyoruz.',
    ctaTitle: 'Misyonumuza Katılmaya Hazır mısınız?',
    ctaDescription: 'Küresel olarak genişleyen bir girişimci veya başkalarına yardım etmek isteyen uzman danışman olun, sizi aramızda görmek isteriz.',
    startExpansionBtn: 'Genişlemenizi Başlatın',
    becomeConsultantBtn: 'Danışman Olun',

    // Hero Section
    heroTitle1: 'AI Destekli Küresel İstihbarat',
    heroSubtitle1: 'Hizmetinizde',
    heroDescription1: 'Akıllı otomasyon ile yeni nesil düzenleyici rehberlik. AI destekli platformumuz sizi dünyanın en iş dostu yargı alanlarındaki uzman danışmanlarla buluşturuyor.',
    heroTitle2: 'Küresel Uzman Ağı',
    heroSubtitle2: '19+ Ülkede',
    heroDescription2: 'Stratejik yargı alanlarında sertifikalı iş danışmanları ve hukuk uzmanlarıyla bağlantı kurun. BAE\'den Estonya\'ya, ağımız küresel erişimle yerel uzmanlık almanızı sağlar.',
    heroTitle3: 'Anında AI Destekli Eşleştirme',
    heroSubtitle3: 'Akıllı'
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
    wealthSubtitle: 'Estratégias de investimento alimentadas por IA para otimização global de patrimônio',
    wealthFeature1: 'Análise orientada por IA',
    wealthFeature2: 'Oportunidades globais',
    wealthFeature3: 'Potencial ilimitado',
    wealthStat1: '$2.5B+ Gerenciados',
    wealthStat2: '98% Taxa de Sucesso',
    wealthCta: 'Explorar Soluções de Patrimônio',

    // Footer
    copyright: '© 2025 Consulting19. Todos os direitos reservados',
    powered: 'Alimentado por AI Oracle',

    // Services Page
    servicesHeroTitle: 'Serviços Empresariais Internacionais Abrangentes',
    servicesHeroDescription: 'Da formação de empresas à conformidade contínua, fornecemos suporte completo entregue por consultores especialistas em mais de 19 países ao redor do mundo.',
    
    // Service Categories
    companyFormation: 'Formação de Empresa',
    companyFormationDesc: 'Assistência completa no registro e incorporação de empresas em jurisdições favoráveis aos negócios.',
    companyFormationService1: 'Registro e incorporação de empresa',
    companyFormationService2: 'Aplicações de licença comercial',
    companyFormationService3: 'Otimização de estrutura corporativa',
    companyFormationService4: 'Serviços de agente registrado',
    companyFormationService5: 'Soluções de escritório virtual',

    taxOptimization: 'Otimização Fiscal',
    taxOptimizationDesc: 'Planejamento fiscal estratégico e otimização para minimizar legalmente sua carga tributária internacional.',
    taxOptimizationService1: 'Planejamento fiscal internacional',
    taxOptimizationService2: 'Otimização de tratado de dupla tributação',
    taxOptimizationService3: 'Estratégias de residência fiscal',
    taxOptimizationService4: 'Orientação de preços de transferência',
    taxOptimizationService5: 'Conformidade fiscal anual',

    bankingSolutions: 'Soluções Bancárias',
    bankingSolutionsDesc: 'Suporte bancário abrangente para operações comerciais internacionais.',
    bankingSolutionsService1: 'Abertura de conta bancária internacional',
    bankingSolutionsService2: 'Configuração de conta multi-moeda',
    bankingSolutionsService3: 'Integração de gateway de pagamento',
    bankingSolutionsService4: 'Gestão de relacionamento bancário',
    bankingSolutionsService5: 'Soluções de financiamento comercial',

    legalCompliance: 'Conformidade Legal',
    legalComplianceDesc: 'Suporte contínuo de conformidade legal e regulatória para manter seu negócio em conformidade.',
    legalComplianceService1: 'Monitoramento de conformidade regulatória',
    legalComplianceService2: 'Revisões e redação de contratos',
    legalComplianceService3: 'Otimização de estrutura legal',
    legalComplianceService4: 'Proteção de propriedade intelectual',
    legalComplianceService5: 'Conformidade de proteção de dados',

    assetProtection: 'Proteção de Ativos',
    assetProtectionDesc: 'Estratégias avançadas para proteger seus ativos e minimizar riscos em operações internacionais.',
    assetProtectionService1: 'Estratégias de proteção de ativos',
    assetProtectionService2: 'Configuração de trust e fundação',
    assetProtectionService3: 'Avaliação e mitigação de riscos',
    assetProtectionService4: 'Planejamento imobiliário para ativos internacionais',
    assetProtectionService5: 'Otimização de seguros',

    investmentAdvisory: 'Consultoria de Investimento',
    investmentAdvisoryDesc: 'Consultoria de investimento comercial e estratégias de crescimento para mercados internacionais.',
    investmentAdvisoryService1: 'Estratégias de entrada no mercado',
    investmentAdvisoryService2: 'Otimização de estrutura de investimento',
    investmentAdvisoryService3: 'Suporte de due diligence',
    investmentAdvisoryService4: 'Planejamento de estratégia de saída',
    investmentAdvisoryService5: 'Consultoria de M&A transfronteiriça',

    exploreCategory: 'Explorar',
    servicesCtaTitle: 'Precisa de uma Solução Personalizada?',
    servicesCtaDescription: 'Nossos consultores especialistas podem criar uma estratégia personalizada para suas necessidades comerciais únicas.',
    consultExpertBtn: 'Consultar com Especialista',
    exploreCountriesBtn: 'Explorar Todos os Países',
    
    // About Page - New Content
    aboutHeroTitle: 'Sobre a Consulting19',
    aboutHeroDescription: 'Desde 2016, temos simplificado a expansão internacional combinando inteligência alimentada por IA com uma rede global de consultores especialistas. Ajudamos fundadores e investidores a lançar, fazer operações bancárias, otimizar impostos e manter conformidade em 19+ países.',
    startYourExpansion: 'Inicie Sua Expansão',
    exploreCountries: 'Explorar Países',
    
    missionTitle: 'Nossa Missão',
    missionDescription: 'Democratizar a expansão internacional tornando a orientação especializada acessível, rápida e com preços justos. Entregamos resultados de nível empresarial para empresas de todos os tamanhos através da combinação prática de automação e expertise local.',
    
    valuesTitle: 'Nossos Valores',
    valuesDescription: 'Os princípios que orientam tudo o que fazemos na Consulting19.',
    globalExpertise: 'Expertise Global',
    globalExpertiseDesc: 'Conhecimento no terreno em 19+ jurisdições.',
    aiEfficiency: 'Eficiência Alimentada por IA',
    aiEfficiencyDesc: 'Análise mais rápida, menos erros, melhores decisões.',
    trustSecurity: 'Confiança e Segurança',
    trustSecurityDesc: 'Segurança de nível empresarial e privacidade de dados.',
    resultsDriven: 'Orientado por Resultados',
    resultsDrivenDesc: 'Resultados mensuráveis e responsabilidade clara.',
    
    foundedTitle: 'Fundada em 2016',
    founded2016: 'Fundação',
    founded2016Desc: 'Primeiros projetos de formação transfronteiriça concluídos.',
    founded2019: '10+ Países',
    founded2019Desc: 'Rede de especialistas expandida; adicionados serviços bancários e conformidade.',
    founded2022: 'Assistente IA',
    founded2022Desc: 'Fluxos de trabalho automatizados para KYC, arquivamentos e roteamento fiscal.',
    founded2025: 'Plataformas Principais',
    founded2025Desc: 'Matrix (UHNW) e FidelKey (Investimento de Título Seguro) lançados.',
    
    flagshipPlatformsTitle: 'Plataformas Principais',
    flagshipPlatformsDescription: 'Soluções premium para clientes sofisticados e oportunidades de investimento únicas.',
    
    matrixBadge: 'Premium',
    matrixTitle: 'Matrix — Plataforma de Riqueza Privada',
    matrixDescription: 'Uma plataforma que prioriza a privacidade para clientes de patrimônio líquido ultra-alto. Alocação global assistida por IA, operações bancárias multi-jurisdicionais e execução discreta. Investimento mínimo: $5M.',
    matrixFeature1: 'Análise orientada por IA',
    matrixFeature2: 'Oportunidades globais',
    matrixFeature3: 'Confidencialidade rigorosa',
    matrixCTA: 'Explorar Matrix Wealth',
    matrixNote: 'Apenas para investidores qualificados.',
    
    fidelkeyBadge: 'Inovação',
    fidelkeyTitle: 'FidelKey — Sistema de Investimento de Título Seguro',
    fidelkeyDescription: 'O primeiro gateway de investimento de título seguro do mundo, combinando propriedade imobiliária, retornos financeiros e caminhos de visto internacional sob um modelo de título colateralizado.',
    fidelkeyFeature1: 'Estrutura de título seguro',
    fidelkeyFeature2: 'Opções de residência',
    fidelkeyFeature3: 'Potencial de rendimento de aluguel/dividendo',
    fidelkeyCTA: 'Explorar FidelKey',
    
    storyTitle: 'Nossa História',
    storyDescription: 'A Consulting19 começou em 2016 com uma observação simples: a expansão transfronteiriça era mais difícil do que precisava ser. Ao combinar IA de ponta com uma rede curada de especialistas locais, entregamos resultados de nível empresarial—formação de empresas, operações bancárias, otimização fiscal e conformidade—mais rápido e de forma mais previsível que modelos tradicionais.',
    
    impactMetricsTitle: 'Métricas de Impacto',
    countriesSupported: 'Países apoiados',
    companiesFormed: 'Empresas formadas e apoiadas',
    successRate: 'Taxa de sucesso (configuração de empresa)',
    avgSetupTime: 'Dias de configuração média (jurisdições selecionadas)',
    
    finalCtaTitle: 'Pronto para Se Juntar à Nossa Missão?',
    finalCtaDescription: 'Seja expandindo globalmente ou aconselhando clientes, adoraríamos colaborar.',
    becomeConsultant: 'Torne-se um Consultor',
    
    // Services
    servicesOverviewTitle: 'Soluções Empresariais Abrangentes',
    servicesOverviewDescription: 'Suporte completo para expansão internacional de negócios em todas as áreas críticas.',

    // Countries Page
    countriesHeroTitle: 'Destinos Empresariais Globais',
    countriesHeroDescription: 'Explore as jurisdições mais favoráveis aos negócios do mundo. Cada localização oferece vantagens únicas para expansão internacional e otimização fiscal.',
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
    aboutHeroDescription: 'Estamos revolucionando a consultoria empresarial internacional combinando inteligência alimentada por IA com uma rede global de consultores especialistas.',
    missionTitle: 'Nossa Missão',
    missionDesc1: 'Democratizar a expansão empresarial internacional tornando o aconselhamento especializado acessível, acessível e instantâneo através do poder da inteligência artificial.',
    missionDesc2: 'Acreditamos que todo empreendedor deve ter acesso à orientação empresarial internacional de classe mundial, independentemente de sua localização ou tamanho do negócio.',
    valuesTitle: 'Nossos Valores',
    valuesDescription: 'Os princípios que orientam tudo o que fazemos na Consulting19.',
    globalExpertise: 'Expertise Global',
    globalExpertiseDesc: 'Conhecimento profundo de paisagens empresariais internacionais em 19+ países.',
    aiEfficiency: 'Eficiência Alimentada por IA',
    aiEfficiencyDesc: 'Tecnologia de IA de ponta combinada com expertise humana para resultados ótimos.',
    trustSecurity: 'Confiança e Segurança',
    trustSecurityDesc: 'Segurança de nível empresarial protegendo suas informações comerciais sensíveis.',
    resultsDriven: 'Orientado por Resultados',
    resultsDrivenDesc: 'Focado em entregar resultados mensuráveis para sua expansão internacional.',
    teamTitle: 'Conheça Nossa Equipe',
    teamDescription: 'Profissionais experientes de empresas de consultoria líderes e empresas de tecnologia.',
    teamMemberRoleErdal: 'Especialista em SEO e Marketing Digital',
    teamMemberBioErdal: 'Especialista em otimização de mecanismos de busca e estratégias de marketing digital para expansão empresarial internacional.',
    linkedinProfile: 'Perfil do LinkedIn',
    storyTitle: 'Nossa História',
    storyDesc1: 'A Consulting19 nasceu de uma observação simples: a expansão empresarial internacional é desnecessariamente complexa e cara. Empresas de consultoria tradicionais cobram taxas premium enquanto empreendedores lutam para navegar regulamentações estrangeiras sozinhos.',
    storyDesc2: 'Ao combinar tecnologia de IA de ponta com uma rede cuidadosamente curada de consultores especialistas em jurisdições favoráveis aos negócios, criamos uma plataforma que entrega consultoria de nível empresarial por uma fração dos custos tradicionais.',
    storyDesc3: 'Hoje, temos orgulho de servir centenas de empreendedores em todo o mundo, ajudando-os a economizar milhões em impostos enquanto expandem seus negócios através das fronteiras com confiança.',
    ctaTitle: 'Pronto para Se Juntar à Nossa Missão?',
    ctaDescription: 'Seja você um empreendedor procurando expandir globalmente ou um consultor especialista querendo ajudar outros, adoraríamos tê-lo a bordo.',
    startExpansionBtn: 'Inicie Sua Expansão',
    becomeConsultantBtn: 'Torne-se um Consultor',

    // Hero Section
    heroTitle1: 'Inteligência Global Aprimorada por IA',
    heroSubtitle1: 'ao Seu Serviço',
    heroDescription1: 'Orientação regulatória de próximo nível com automação inteligente. Nossa plataforma alimentada por IA conecta você com consultores especialistas nas jurisdições mais favoráveis aos negócios do mundo.',
    heroTitle2: 'Rede Global de Especialistas',
    heroSubtitle2: 'em 19+ Países',
    heroDescription2: 'Conecte-se com consultores empresariais certificados e especialistas legais em jurisdições estratégicas. Dos Emirados Árabes Unidos à Estônia, nossa rede garante que você obtenha expertise local com alcance global.',
    heroTitle3: 'Correspondência Instantânea Alimentada por IA',
    heroSubtitle3: 'Inteligente'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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