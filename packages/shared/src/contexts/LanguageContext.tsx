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
    'nav.viewAllServices': 'View All Services',
    'nav.viewAllCountries': 'View All Countries',

    // Hero Section (HomePage)
    heroTitle: 'AI-Enhanced Global Intelligence',
    heroSubtitle: 'at Your Service',
    heroDescription: 'Next-level regulatory guidance with intelligent automation. Our AI-powered platform connects you with expert consultants across the world\'s most business-friendly jurisdictions.',
    getStarted: 'Get Started Today',
    exploreServices: 'Explore Services',

    // Services (HomePage & ServicesPage)
    companyFormation: 'Company Formation',
    taxOptimization: 'Tax Optimization',
    bankingSolutions: 'Banking Solutions',
    legalCompliance: 'Legal Compliance',
    assetProtection: 'Asset Protection',
    investmentAdvisory: 'Investment Advisory',
    visaResidency: 'Visa & Residency',
    marketResearch: 'Market Research',

    // Footer
    copyright: '© 2025 Consulting19. All rights reserved',
    powered: 'Powered by AI Oracle',

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

    // Services Page
    'servicesPage.heroTitle': 'Comprehensive International Business Services',
    'servicesPage.heroDescription': 'From company formation to ongoing compliance, we provide end-to-end support delivered by expert consultants in over 19 countries worldwide.',
    'servicesPage.companyFormationDesc': 'Complete assistance in company registration and incorporation across business-friendly jurisdictions.',
    'servicesPage.companyFormationService1': 'Company registration and incorporation',
    'servicesPage.companyFormationService2': 'Business license applications',
    'servicesPage.companyFormationService3': 'Corporate structure optimization',
    'servicesPage.companyFormationService4': 'Registered agent services',
    'servicesPage.companyFormationService5': 'Virtual office solutions',
    'servicesPage.taxOptimizationDesc': 'Strategic tax planning and optimization to minimize your international tax burden legally.',
    'servicesPage.taxOptimizationService1': 'International tax planning',
    'servicesPage.taxOptimizationService2': 'Double taxation treaty optimization',
    'servicesPage.taxOptimizationService3': 'Tax residence strategies',
    'servicesPage.taxOptimizationService4': 'Transfer pricing guidance',
    'servicesPage.taxOptimizationService5': 'Annual tax compliance',
    'servicesPage.bankingSolutionsDesc': 'Comprehensive banking support for international business operations.',
    'servicesPage.bankingSolutionsService1': 'International bank account opening',
    'servicesPage.bankingSolutionsService2': 'Multi-currency account setup',
    'servicesPage.bankingSolutionsService3': 'Payment gateway integration',
    'servicesPage.bankingSolutionsService4': 'Banking relationship management',
    'servicesPage.bankingSolutionsService5': 'Trade finance solutions',
    'servicesPage.legalComplianceDesc': 'Ongoing legal and regulatory compliance support to keep your business compliant.',
    'servicesPage.legalComplianceService1': 'Regulatory compliance monitoring',
    'servicesPage.legalComplianceService2': 'Contract reviews and drafting',
    'servicesPage.legalComplianceService3': 'Legal structure optimization',
    'servicesPage.legalComplianceService4': 'Intellectual property protection',
    'servicesPage.legalComplianceService5': 'Data protection compliance',
    'servicesPage.assetProtectionDesc': 'Advanced strategies to protect your assets and minimize risks in international operations.',
    'servicesPage.assetProtectionService1': 'Asset protection strategies',
    'servicesPage.assetProtectionService2': 'Trust and foundation setup',
    'servicesPage.assetProtectionService3': 'Risk assessment and mitigation',
    'servicesPage.assetProtectionService4': 'Estate planning for international assets',
    'servicesPage.assetProtectionService5': 'Insurance optimization',
    'servicesPage.investmentAdvisoryDesc': 'Commercial investment consulting and growth strategies for international markets.',
    'servicesPage.investmentAdvisoryService1': 'Market entry strategies',
    'servicesPage.investmentAdvisoryService2': 'Investment structure optimization',
    'servicesPage.investmentAdvisoryService3': 'Due diligence support',
    'servicesPage.investmentAdvisoryService4': 'Exit strategy planning',
    'servicesPage.investmentAdvisoryService5': 'Cross-border M&A advisory',
    'servicesPage.exploreCategory': 'Explore {categoryTitle}',
    'servicesPage.ctaTitle': 'Need a Custom Solution?',
    'servicesPage.ctaDescription': 'Our expert advisors can create a tailored strategy for your unique business needs.',
    'servicesPage.consultExpertBtn': 'Consult with Expert',
    'servicesPage.exploreCountriesBtn': 'Explore Countries',

    // Countries Page
    'countriesPage.heroTitle': 'Global Business Destinations',
    'countriesPage.heroDescription': 'Explore the world\'s most business-friendly jurisdictions. Each location offers unique advantages for international expansion and tax optimization.',
    'countriesPage.searchPlaceholder': 'Search countries...',
    'countriesPage.allRegions': 'All Regions',
    'countriesPage.regionEurope': 'Europe',
    'countriesPage.regionAsia': 'Asia',
    'countriesPage.regionMiddleEast': 'Middle East',
    'countriesPage.regionAmericas': 'Americas',
    'countriesPage.availableDestinations': 'Available Destinations',
    'countriesPage.noCountriesFoundTitle': 'No countries found',
    'countriesPage.noCountriesFoundDesc': 'Try adjusting your search or filter criteria.',
    'countriesPage.corporateTax': 'Corporate Tax',
    'countriesPage.featuredBadge': 'FEATURED',
    'countriesPage.setupTime': 'Setup',
    'countriesPage.taxRate': 'Tax',
    'countriesPage.learnMoreBtn': 'Learn More',

    // About Page
    'aboutPage.heroTitle': 'About Consulting19',
    'aboutPage.heroDescription': 'We\'re revolutionizing international business consulting by combining AI-powered intelligence with a global network of expert advisors.',
    'aboutPage.missionTitle': 'Our Mission',
    'aboutPage.missionDesc1': 'To democratize international business expansion by making expert advice accessible, affordable, and instant through the power of artificial intelligence.',
    'aboutPage.missionDesc2': 'We believe that every entrepreneur should have access to world-class international business guidance, regardless of their location or business size.',
    'aboutPage.valuesTitle': 'Our Values',
    'aboutPage.valuesDescription': 'The principles that guide everything we do at Consulting19.',
    'aboutPage.valueGlobalExpertiseTitle': 'Global Expertise',
    'aboutPage.valueGlobalExpertiseDesc': 'Deep knowledge of international business landscapes across 19+ countries.',
    'aboutPage.valueAIEfficiencyTitle': 'AI-Powered Efficiency',
    'aboutPage.valueAIEfficiencyDesc': 'Cutting-edge AI technology combined with human expertise for optimal results.',
    'aboutPage.valueTrustSecurityTitle': 'Trust & Security',
    'aboutPage.valueTrustSecurityDesc': 'Enterprise-grade security protecting your sensitive business information.',
    'aboutPage.valueResultsDrivenTitle': 'Results-Driven',
    'aboutPage.valueResultsDrivenDesc': 'Focused on delivering measurable outcomes for your international expansion.',
    'aboutPage.teamTitle': 'Meet Our Team',
    'aboutPage.teamDescription': 'Experienced professionals from leading consulting firms and technology companies.',
    'aboutPage.teamMemberRoleErdal': 'SEO & Digital Marketing Specialist',
    'aboutPage.teamMemberBioErdal': 'Expert in search engine optimization and digital marketing strategies for international business expansion.',
    'aboutPage.linkedinProfile': 'LinkedIn Profile',
    'aboutPage.storyTitle': 'Our Story',
    'aboutPage.storyDesc1': 'Consulting19 was born from a simple observation: international business expansion is unnecessarily complex and expensive. Traditional consulting firms charge premium rates while entrepreneurs struggle to navigate foreign regulations alone.',
    'aboutPage.storyDesc2': 'By combining cutting-edge AI technology with a carefully curated network of expert advisors in business-friendly jurisdictions, we\'ve created a platform that delivers enterprise-level consulting at a fraction of traditional costs.',
    'aboutPage.storyDesc3': 'Today, we\'re proud to serve hundreds of entrepreneurs worldwide, helping them save millions in taxes while expanding their businesses across borders with confidence.',
    'aboutPage.ctaTitle': 'Ready to Join Our Mission?',
    'aboutPage.ctaDescription': 'Whether you\'re an entrepreneur looking to expand globally or an expert advisor wanting to help others, we\'d love to have you on board.',
    'aboutPage.startExpansionBtn': 'Start Your Expansion',
    'aboutPage.becomeConsultantBtn': 'Become a Consultant',
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
    'nav.viewAllServices': 'Tüm Hizmetleri Görüntüle',
    'nav.viewAllCountries': 'Tüm Ülkeleri Görüntüle',

    // Hero Section (HomePage)
    heroTitle: 'Yapay Zeka Destekli Küresel Zeka',
    heroSubtitle: 'Hizmetinizde',
    heroDescription: 'Akıllı otomasyon ile yeni nesil düzenleyici rehberlik. Yapay zeka destekli platformumuz, sizi dünyanın en iş dostu yargı bölgelerindeki uzman danışmanlarla buluşturur.',
    getStarted: 'Bugün Başlayın',
    exploreServices: 'Hizmetleri Keşfedin',

    // Services (HomePage & ServicesPage)
    companyFormation: 'Şirket Kuruluşu',
    taxOptimization: 'Vergi Optimizasyonu',
    bankingSolutions: 'Bankacılık Çözümleri',
    legalCompliance: 'Yasal Uyumluluk',
    assetProtection: 'Varlık Korunması',
    investmentAdvisory: 'Yatırım Danışmanlığı',
    visaResidency: 'Vize & Oturum',
    marketResearch: 'Pazar Araştırması',

    // Footer
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır',
    powered: 'AI Oracle tarafından desteklenmektedir',

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

    // Services Page
    'servicesPage.heroTitle': 'Kapsamlı Uluslararası İş Hizmetleri',
    'servicesPage.heroDescription': 'Şirket kuruluşundan sürekli uyumluluğa kadar, 19\'dan fazla ülkedeki uzman danışmanlar tarafından sunulan uçtan uca destek sağlıyoruz.',
    'servicesPage.companyFormationDesc': 'İş dostu yargı bölgelerinde şirket tescili ve kuruluşu konusunda eksiksiz yardım.',
    'servicesPage.companyFormationService1': 'Şirket tescili ve kuruluşu',
    'servicesPage.companyFormationService2': 'İşletme lisansı başvuruları',
    'servicesPage.companyFormationService3': 'Kurumsal yapı optimizasyonu',
    'servicesPage.companyFormationService4': 'Tescilli acente hizmetleri',
    'servicesPage.companyFormationService5': 'Sanal ofis çözümleri',
    'servicesPage.taxOptimizationDesc': 'Uluslararası vergi yükünüzü yasal olarak en aza indirmek için stratejik vergi planlaması ve optimizasyonu.',
    'servicesPage.taxOptimizationService1': 'Uluslararası vergi planlaması',
    'servicesPage.taxOptimizationService2': 'Çifte vergilendirme anlaşması optimizasyonu',
    'servicesPage.taxOptimizationService3': 'Vergi ikametgahı stratejileri',
    'servicesPage.taxOptimizationService4': 'Transfer fiyatlandırması rehberliği',
    'servicesPage.taxOptimizationService5': 'Yıllık vergi uyumluluğu',
    'servicesPage.bankingSolutionsDesc': 'Uluslararası iş operasyonları için kapsamlı bankacılık desteği.',
    'servicesPage.bankingSolutionsService1': 'Uluslararası banka hesabı açılışı',
    'servicesPage.bankingSolutionsService2': 'Çoklu para birimi hesabı kurulumu',
    'servicesPage.bankingSolutionsService3': 'Ödeme ağ geçidi entegrasyonu',
    'servicesPage.bankingSolutionsService4': 'Bankacılık ilişkileri yönetimi',
    'servicesPage.bankingSolutionsService5': 'Ticaret finansmanı çözümleri',
    'servicesPage.legalComplianceDesc': 'İşletmenizin uyumlu kalması için sürekli yasal ve düzenleyici uyumluluk desteği.',
    'servicesPage.legalComplianceService1': 'Düzenleyici uyumluluk izleme',
    'servicesPage.legalComplianceService2': 'Sözleşme incelemeleri ve taslağı',
    'servicesPage.legalComplianceService3': 'Yasal yapı optimizasyonu',
    'servicesPage.legalComplianceService4': 'Fikri mülkiyet koruması',
    'servicesPage.legalComplianceService5': 'Veri koruma uyumluluğu',
    'servicesPage.assetProtectionDesc': 'Uluslararası operasyonlarda varlıklarınızı korumak ve riskleri en aza indirmek için gelişmiş stratejiler.',
    'servicesPage.assetProtectionService1': 'Varlık koruma stratejileri',
    'servicesPage.assetProtectionService2': 'Vakıf ve fon kurulumu',
    'servicesPage.assetProtectionService3': 'Risk değerlendirmesi ve azaltma',
    'servicesPage.assetProtectionService4': 'Uluslararası varlıklar için miras planlaması',
    'servicesPage.assetProtectionService5': 'Sigorta optimizasyonu',
    'servicesPage.investmentAdvisoryDesc': 'Uluslararası pazarlar için ticari yatırım danışmanlığı ve büyüme stratejileri.',
    'servicesPage.investmentAdvisoryService1': 'Pazara giriş stratejileri',
    'servicesPage.investmentAdvisoryService2': 'Yatırım yapısı optimizasyonu',
    'servicesPage.investmentAdvisoryService3': 'Durum tespiti desteği',
    'servicesPage.investmentAdvisoryService4': 'Çıkış stratejisi planlaması',
    'servicesPage.investmentAdvisoryService5': 'Sınır ötesi birleşme ve satın alma danışmanlığı',
    'servicesPage.exploreCategory': 'Keşfet {categoryTitle}',
    'servicesPage.ctaTitle': 'Özel Bir Çözüme mi İhtiyacınız Var?',
    'servicesPage.ctaDescription': 'Uzman danışmanlarımız, benzersiz iş ihtiyaçlarınız için özel bir strateji oluşturabilir.',
    'servicesPage.consultExpertBtn': 'Uzmanla Danışın',
    'servicesPage.exploreCountriesBtn': 'Ülkeleri Keşfedin',

    // Countries Page
    'countriesPage.heroTitle': 'Küresel İş Destinasyonları',
    'countriesPage.heroDescription': 'Dünyanın en iş dostu yargı bölgelerini keşfedin. Her konum, uluslararası genişleme ve vergi optimizasyonu için benzersiz avantajlar sunar.',
    'countriesPage.searchPlaceholder': 'Ülkeleri ara...',
    'countriesPage.allRegions': 'Tüm Bölgeler',
    'countriesPage.regionEurope': 'Avrupa',
    'countriesPage.regionAsia': 'Asya',
    'countriesPage.regionMiddleEast': 'Orta Doğu',
    'countriesPage.regionAmericas': 'Amerika',
    'countriesPage.availableDestinations': 'Mevcut Destinasyonlar',
    'countriesPage.noCountriesFoundTitle': 'Ülke bulunamadı',
    'countriesPage.noCountriesFoundDesc': 'Arama veya filtreleme kriterlerinizi ayarlamayı deneyin.',
    'countriesPage.corporateTax': 'Kurumlar Vergisi',
    'countriesPage.featuredBadge': 'ÖNE ÇIKAN',
    'countriesPage.setupTime': 'Kurulum',
    'countriesPage.taxRate': 'Vergi',
    'countriesPage.learnMoreBtn': 'Daha Fazla Bilgi',

    // About Page
    'aboutPage.heroTitle': 'Consulting19 Hakkında',
    'aboutPage.heroDescription': 'Yapay zeka destekli zekayı küresel uzman danışman ağıyla birleştirerek uluslararası iş danışmanlığını devrim niteliğinde değiştiriyoruz.',
    'aboutPage.missionTitle': 'Misyonumuz',
    'aboutPage.missionDesc1': 'Yapay zekanın gücüyle uzman tavsiyesini erişilebilir, uygun fiyatlı ve anında hale getirerek uluslararası iş genişlemesini demokratikleştirmek.',
    'aboutPage.missionDesc2': 'Her girişimcinin, konumu veya işletme büyüklüğü ne olursa olsun, dünya standartlarında uluslararası iş rehberliğine erişmesi gerektiğine inanıyoruz.',
    'aboutPage.valuesTitle': 'Değerlerimiz',
    'aboutPage.valuesDescription': 'Consulting19\'da yaptığımız her şeye rehberlik eden ilkeler.',
    'aboutPage.valueGlobalExpertiseTitle': 'Küresel Uzmanlık',
    'aboutPage.valueGlobalExpertiseDesc': '19\'dan fazla ülkedeki uluslararası iş ortamları hakkında derin bilgi.',
    'aboutPage.valueAIEfficiencyTitle': 'Yapay Zeka Destekli Verimlilik',
    'aboutPage.valueAIEfficiencyDesc': 'Optimal sonuçlar için insan uzmanlığıyla birleştirilmiş son teknoloji yapay zeka teknolojisi.',
    'aboutPage.valueTrustSecurityTitle': 'Güven & Güvenlik',
    'aboutPage.valueTrustSecurityDesc': 'Hassas iş bilgilerinizi koruyan kurumsal düzeyde güvenlik.',
    'aboutPage.valueResultsDrivenTitle': 'Sonuç Odaklı',
    'aboutPage.valueResultsDrivenDesc': 'Uluslararası genişlemeniz için ölçülebilir sonuçlar sunmaya odaklanmıştır.',
    'aboutPage.teamTitle': 'Ekibimizle Tanışın',
    'aboutPage.teamDescription': 'Önde gelen danışmanlık firmalarından ve teknoloji şirketlerinden deneyimli profesyoneller.',
    'aboutPage.teamMemberRoleErdal': 'SEO & Dijital Pazarlama Uzmanı',
    'aboutPage.teamMemberBioErdal': 'Uluslararası iş genişlemesi için arama motoru optimizasyonu ve dijital pazarlama stratejileri konusunda uzman.',
    'aboutPage.linkedinProfile': 'LinkedIn Profili',
    'aboutPage.storyTitle': 'Hikayemiz',
    'aboutPage.storyDesc1': 'Consulting19, basit bir gözlemden doğdu: uluslararası iş genişlemesi gereksiz yere karmaşık ve pahalı. Geleneksel danışmanlık firmaları yüksek ücretler talep ederken, girişimciler yabancı düzenlemelerde tek başına gezinmekte zorlanıyor.',
    'aboutPage.storyDesc2': 'Son teknoloji yapay zeka teknolojisini, iş dostu yargı bölgelerindeki özenle seçilmiş uzman danışman ağıyla birleştirerek, geleneksel maliyetlerin çok altında kurumsal düzeyde danışmanlık sunan bir platform oluşturduk.',
    'aboutPage.storyDesc3': 'Bugün, dünya çapında yüzlerce girişimciye hizmet vermekten gurur duyuyoruz, işlerini güvenle sınırlar ötesine genişletirken milyonlarca vergi tasarrufu yapmalarına yardımcı oluyoruz.',
    'aboutPage.ctaTitle': 'Misyonumuza Katılmaya Hazır mısınız?',
    'aboutPage.ctaDescription': 'İster küresel olarak genişlemek isteyen bir girişimci olun, ister başkalarına yardım etmek isteyen bir uzman danışman olun, sizi aramızda görmekten mutluluk duyarız.',
    'aboutPage.startExpansionBtn': 'Genişlemenizi Başlatın',
    'aboutPage.becomeConsultantBtn': 'Danışman Olun',
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
    'nav.viewAllServices': 'Ver Todos os Serviços',
    'nav.viewAllCountries': 'Ver Todos os Países',

    // Hero Section (HomePage)
    heroTitle: 'Inteligência Global Aprimorada por IA',
    heroSubtitle: 'ao Seu Serviço',
    heroDescription: 'Orientação regulatória de próximo nível com automação inteligente. Nossa plataforma alimentada por IA conecta você com consultores especialistas nas jurisdições mais favoráveis aos negócios do mundo.',
    getStarted: 'Comece Hoje',
    exploreServices: 'Explorar Serviços',

    // Services (HomePage & ServicesPage)
    companyFormation: 'Formação de Empresa',
    taxOptimization: 'Otimização Fiscal',
    bankingSolutions: 'Soluções Bancárias',
    legalCompliance: 'Conformidade Legal',
    assetProtection: 'Proteção de Ativos',
    investmentAdvisory: 'Consultoria de Investimento',
    visaResidency: 'Visto & Residência',
    marketResearch: 'Pesquisa de Mercado',

    // Footer
    copyright: '© 2025 Consulting19. Todos os direitos reservados',
    powered: 'Desenvolvido por AI Oracle',

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

    // Services Page
    'servicesPage.heroTitle': 'Serviços Abrangentes de Negócios Internacionais',
    'servicesPage.heroDescription': 'Desde a formação da empresa até a conformidade contínua, fornecemos suporte completo entregue por consultores especializados em mais de 19 países em todo o mundo.',
    'servicesPage.companyFormationDesc': 'Assistência completa no registro e incorporação de empresas em jurisdições favoráveis aos negócios.',
    'servicesPage.companyFormationService1': 'Registro e incorporação de empresas',
    'servicesPage.companyFormationService2': 'Pedidos de licença comercial',
    'servicesPage.companyFormationService3': 'Otimização da estrutura corporativa',
    'servicesPage.companyFormationService4': 'Serviços de agente registrado',
    'servicesPage.companyFormationService5': 'Soluções de escritório virtual',
    'servicesPage.taxOptimizationDesc': 'Planejamento e otimização fiscal estratégica para minimizar legalmente sua carga tributária internacional.',
    'servicesPage.taxOptimizationService1': 'Planejamento tributário internacional',
    'servicesPage.taxOptimizationService2': 'Otimização de tratados de dupla tributação',
    'servicesPage.taxOptimizationService3': 'Estratégias de residência fiscal',
    'servicesPage.taxOptimizationService4': 'Orientação sobre preços de transferência',
    'servicesPage.taxOptimizationService5': 'Conformidade fiscal anual',
    'servicesPage.bankingSolutionsDesc': 'Suporte bancário abrangente para operações comerciais internacionais.',
    'servicesPage.bankingSolutionsService1': 'Abertura de conta bancária internacional',
    'servicesPage.bankingSolutionsService2': 'Configuração de conta em várias moedas',
    'servicesPage.bankingSolutionsService3': 'Integração de gateway de pagamento',
    'servicesPage.bankingSolutionsService4': 'Gestão de relacionamento bancário',
    'servicesPage.bankingSolutionsService5': 'Soluções de financiamento comercial',
    'servicesPage.legalComplianceDesc': 'Suporte contínuo de conformidade legal e regulatória para manter seu negócio em conformidade.',
    'servicesPage.legalComplianceService1': 'Monitoramento de conformidade regulatória',
    'servicesPage.legalComplianceService2': 'Revisão e elaboração de contratos',
    'servicesPage.legalComplianceService3': 'Otimização da estrutura legal',
    'servicesPage.legalComplianceService4': 'Proteção da propriedade intelectual',
    'servicesPage.legalComplianceService5': 'Conformidade com a proteção de dados',
    'servicesPage.assetProtectionDesc': 'Estratégias avançadas para proteger seus ativos e minimizar riscos em operações internacionais.',
    'servicesPage.assetProtectionService1': 'Estratégias de proteção de ativos',
    'servicesPage.assetProtectionService2': 'Configuração de trust e fundação',
    'servicesPage.assetProtectionService3': 'Avaliação e mitigação de riscos',
    'servicesPage.assetProtectionService4': 'Planejamento patrimonial para ativos internacionais',
    'servicesPage.assetProtectionService5': 'Otimização de seguros',
    'servicesPage.investmentAdvisoryDesc': 'Consultoria de investimento comercial e estratégias de crescimento para mercados internacionais.',
    'servicesPage.investmentAdvisoryService1': 'Estratégias de entrada no mercado',
    'servicesPage.investmentAdvisoryService2': 'Otimização da estrutura de investimento',
    'servicesPage.investmentAdvisoryService3': 'Suporte de due diligence',
    'servicesPage.investmentAdvisoryService4': 'Planejamento de estratégia de saída',
    'servicesPage.investmentAdvisoryService5': 'Consultoria de M&A transfronteiriça',
    'servicesPage.exploreCategory': 'Explorar {categoryTitle}',
    'servicesPage.ctaTitle': 'Precisa de uma Solução Personalizada?',
    'servicesPage.ctaDescription': 'Nossos consultores especializados podem criar uma estratégia sob medida para suas necessidades de negócios exclusivas.',
    'servicesPage.consultExpertBtn': 'Consultar Especialista',
    'servicesPage.exploreCountriesBtn': 'Explorar Países',

    // Countries Page
    'countriesPage.heroTitle': 'Destinos de Negócios Globais',
    'countriesPage.heroDescription': 'Explore as jurisdições mais favoráveis aos negócios do mundo. Cada local oferece vantagens únicas para expansão internacional e otimização fiscal.',
    'countriesPage.searchPlaceholder': 'Pesquisar países...',
    'countriesPage.allRegions': 'Todas as Regiões',
    'countriesPage.regionEurope': 'Europa',
    'countriesPage.regionAsia': 'Ásia',
    'countriesPage.regionMiddleEast': 'Oriente Médio',
    'countriesPage.regionAmericas': 'Américas',
    'countriesPage.availableDestinations': 'Destinos Disponíveis',
    'countriesPage.noCountriesFoundTitle': 'Nenhum país encontrado',
    'countriesPage.noCountriesFoundDesc': 'Tente ajustar seus critérios de pesquisa ou filtro.',
    'countriesPage.corporateTax': 'Imposto Corporativo',
    'countriesPage.featuredBadge': 'DESTAQUE',
    'countriesPage.setupTime': 'Configuração',
    'countriesPage.taxRate': 'Imposto',
    'countriesPage.learnMoreBtn': 'Saiba Mais',

    // About Page
    'aboutPage.heroTitle': 'Sobre a Consulting19',
    'aboutPage.heroDescription': 'Estamos revolucionando a consultoria de negócios internacionais combinando inteligência alimentada por IA com uma rede global de consultores especializados.',
    'aboutPage.missionTitle': 'Nossa Missão',
    'aboutPage.missionDesc1': 'Democratizar a expansão de negócios internacionais, tornando o aconselhamento especializado acessível, acessível e instantâneo através do poder da inteligência artificial.',
    'aboutPage.missionDesc2': 'Acreditamos que todo empreendedor deve ter acesso a orientação de negócios internacionais de classe mundial, independentemente de sua localização ou tamanho de negócio.',
    'aboutPage.valuesTitle': 'Nossos Valores',
    'aboutPage.valuesDescription': 'Os princípios que guiam tudo o que fazemos na Consulting19.',
    'aboutPage.valueGlobalExpertiseTitle': 'Experiência Global',
    'aboutPage.valueGlobalExpertiseDesc': 'Conhecimento profundo dos cenários de negócios internacionais em mais de 19 países.',
    'aboutPage.valueAIEfficiencyTitle': 'Eficiência Alimentada por IA',
    'aboutPage.valueAIEfficiencyDesc': 'Tecnologia de IA de ponta combinada com experiência humana para resultados ótimos.',
    'aboutPage.valueTrustSecurityTitle': 'Confiança e Segurança',
    'aboutPage.valueTrustSecurityDesc': 'Segurança de nível empresarial protegendo suas informações comerciais confidenciais.',
    'aboutPage.valueResultsDrivenTitle': 'Orientado a Resultados',
    'aboutPage.valueResultsDrivenDesc': 'Focado em entregar resultados mensuráveis para sua expansão internacional.',
    'aboutPage.teamTitle': 'Conheça Nossa Equipe',
    'aboutPage.teamDescription': 'Profissionais experientes de empresas de consultoria e tecnologia líderes.',
    'aboutPage.teamMemberRoleErdal': 'Especialista em SEO e Marketing Digital',
    'aboutPage.teamMemberBioErdal': 'Especialista em otimização de mecanismos de busca e estratégias de marketing digital para expansão de negócios internacionais.',
    'aboutPage.linkedinProfile': 'Perfil do LinkedIn',
    'aboutPage.storyTitle': 'Nossa História',
    'aboutPage.storyDesc1': 'A Consulting19 nasceu de uma observação simples: a expansão de negócios internacionais é desnecessariamente complexa e cara. As firmas de consultoria tradicionais cobram taxas premium enquanto os empreendedores lutam para navegar sozinhos pelas regulamentações estrangeiras.',
    'aboutPage.storyDesc2': 'Ao combinar tecnologia de IA de ponta com uma rede cuidadosamente selecionada de consultores especializados em jurisdições favoráveis aos negócios, criamos uma plataforma que oferece consultoria de nível empresarial por uma fração dos custos tradicionais.',
    'aboutPage.storyDesc3': 'Hoje, temos orgulho de atender centenas de empreendedores em todo o mundo, ajudando-os a economizar milhões em impostos enquanto expandem seus negócios além das fronteiras com confiança.',
    'aboutPage.ctaTitle': 'Pronto para se Juntar à Nossa Missão?',
    'aboutPage.ctaDescription': 'Seja você um empreendedor buscando expandir globalmente ou um consultor especializado querendo ajudar outros, adoraríamos tê-lo a bordo.',
    'aboutPage.startExpansionBtn': 'Comece Sua Expansão',
    'aboutPage.becomeConsultantBtn': 'Torne-se um Consultor',
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