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