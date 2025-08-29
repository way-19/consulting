import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    dashboard: 'Dashboard',
    logout: 'Logout',
    
    // Hero Section
    heroTitle1: 'AI-Powered Global',
    heroSubtitle1: 'Business Consulting',
    heroDescription1: 'Expert guidance for international expansion across 19+ countries. From company formation to tax optimization, our AI Oracle connects you with the right advisors.',
    heroPrimaryCTA1: 'Start Free Consultation',
    heroSecondaryCTA1: 'Explore Services',
    
    heroTitle2: 'Expert Network in',
    heroSubtitle2: '19+ Countries',
    heroDescription2: 'Connect with local specialists who understand regulations, banking, and business culture in your target markets.',
    heroPrimaryCTA2: 'Find Your Advisor',
    heroSecondaryCTA2: 'View Countries',
    
    heroTitle3: 'Smart Automation',
    heroSubtitle3: 'Human Expertise',
    heroDescription3: 'Our AI Oracle analyzes your needs and matches you with the perfect jurisdiction and advisor for your business goals.',
    heroPrimaryCTA3: 'Try AI Assistant',
    heroSecondaryCTA3: 'Learn More',
    
    heroTitle4: 'Transparent Pricing',
    heroSubtitle4: 'No Hidden Fees',
    heroDescription4: 'Clear, upfront pricing with no surprises. Pay only for the services you need with our transparent fee structure.',
    heroPrimaryCTA4: 'View Pricing',
    heroSecondaryCTA4: 'Get Quote',
    
    heroTitle5: 'Enterprise Security',
    heroSubtitle5: 'Bank-Grade Protection',
    heroDescription5: 'Your sensitive business data is protected with enterprise-grade security and strict confidentiality protocols.',
    heroPrimaryCTA5: 'Learn About Security',
    heroSecondaryCTA5: 'View Features',
    
    // About Page
    aboutConsulting19: 'About Consulting19',
    aboutHeroSubtext: 'Since 2016, we\'ve been simplifying international expansion by combining AI-powered intelligence with a global network of expert advisors. We help founders and investors launch, bank, optimize taxes, and stay compliant across 19+ countries.',
    startYourExpansion: 'Start Your Expansion',
    exploreCountries: 'Explore Countries',
    
    ourMission: 'Our Mission',
    missionText: 'To democratize international expansion by making expert guidance accessible, fast, and fairly priced. We deliver enterprise-grade outcomes for companies of all sizes through the practical blend of automation and local expertise.',
    
    ourValues: 'Our Values',
    valuesSubtext: 'The principles that guide everything we do',
    globalExpertise: 'Global Expertise',
    globalExpertiseDesc: 'On-the-ground knowledge across 19+ jurisdictions.',
    aiPoweredEfficiency: 'AI-Powered Efficiency',
    aiPoweredEfficiencyDesc: 'Faster analysis, fewer errors, better decisions.',
    trustSecurity: 'Trust & Security',
    trustSecurityDesc: 'Enterprise-grade security and data privacy.',
    resultsDriven: 'Results-Driven',
    resultsDrivenDesc: 'Measurable outcomes and clear accountability.',
    
    foundedIn2016: 'Founded in 2016',
    ourJourney: 'Our journey from startup to global platform',
    founded: 'Founded',
    foundedDesc: 'First cross-border formation projects completed.',
    tenPlusCountries: '10+ Countries',
    tenPlusCountriesDesc: 'Scaled expert network; added banking & compliance.',
    aiAssistant: 'AI Assistant',
    aiAssistantDesc: 'Automated workflows for KYC, filings, and tax routing.',
    flagshipPlatforms: 'Flagship Platforms',
    flagshipPlatformsDesc: 'Matrix (UHNW) and FidelKey (Secured Title Investment) launched.',
    
    flagshipPlatformsTitle: 'Flagship Platforms',
    flagshipPlatformsSubtext: 'Premium solutions for sophisticated investors and wealth management',
    matrixTitle: 'Matrix — Private Wealth Platform',
    matrixDesc: 'A privacy-first platform for ultra-high-net-worth clients. AI-assisted global allocation, multi-jurisdiction banking, and discreet execution. Minimum investment: $5M.',
    aiDrivenAnalysis: 'AI-driven analysis',
    globalOpportunities: 'Global opportunities',
    strictConfidentiality: 'Strict confidentiality',
    exploreMatrixWealth: 'Explore Matrix Wealth',
    qualifiedInvestorsOnly: 'For qualified investors only.',
    
    fidelkeyTitle: 'FidelKey — Secured Title Investment System',
    fidelkeyDesc: 'The world\'s first secured-title investment gateway combining real-estate ownership, financial returns, and international visa pathways under a collateralized title model.',
    securedTitleStructure: 'Secured title structure',
    residencyOptions: 'Residency options',
    rentalDividendYield: 'Rental/dividend yield potential',
    exploreFidelkey: 'Explore FidelKey',
    
    ourStory: 'Our Story',
    storyText: 'Consulting19 began in 2016 with a simple observation: cross-border expansion was harder than it needed to be. By pairing cutting-edge AI with a curated network of local experts, we deliver enterprise-level results—company formation, banking, tax optimization, and compliance—faster and more predictably than traditional models.',
    
    countriesSupported: 'Countries Supported',
    companiesFormed: 'Companies Formed',
    successRate: 'Success Rate',
    averageSetup: 'Average Setup',
    
    readyToJoin: 'Ready to Join Our Mission?',
    readyToJoinDesc: 'Whether you\'re expanding globally or advising clients, we\'d love to collaborate.',
    becomeConsultant: 'Become a Consultant',
    
    // Common
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    viewServices: 'View Services',
    scheduleConsultation: 'Schedule Consultation',
    chooseCountry: 'Choose Country',
    
    // Services
    companyFormation: 'Company Formation',
    taxOptimization: 'Tax Optimization',
    bankingSolutions: 'Banking Solutions',
    legalCompliance: 'Legal Compliance',
    assetProtection: 'Asset Protection',
    investmentAdvisory: 'Investment Advisory',
    
    // Other existing translations...
    aiPoweredIntelligence: 'AI-Powered Intelligence',
    copyright: '© 2025 Consulting19. All rights reserved.',
    powered: 'Powered by advanced AI technology',
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
    
    // Hero Section
    heroTitle1: 'Yapay Zeka Destekli',
    heroSubtitle1: 'Küresel İş Danışmanlığı',
    heroDescription1: '19+ ülkede uluslararası genişleme için uzman rehberlik. Şirket kuruluşundan vergi optimizasyonuna, AI Oracle\'ımız sizi doğru danışmanlarla buluşturuyor.',
    heroPrimaryCTA1: 'Ücretsiz Danışmanlık Başlat',
    heroSecondaryCTA1: 'Hizmetleri Keşfet',
    
    heroTitle2: '19+ Ülkede',
    heroSubtitle2: 'Uzman Ağı',
    heroDescription2: 'Hedef pazarlarınızdaki düzenlemeleri, bankacılığı ve iş kültürünü anlayan yerel uzmanlarla bağlantı kurun.',
    heroPrimaryCTA2: 'Danışmanınızı Bulun',
    heroSecondaryCTA2: 'Ülkeleri Görüntüle',
    
    heroTitle3: 'Akıllı Otomasyon',
    heroSubtitle3: 'İnsan Uzmanlığı',
    heroDescription3: 'AI Oracle\'ımız ihtiyaçlarınızı analiz eder ve sizi iş hedefleriniz için mükemmel yargı yetkisi ve danışmanla eşleştirir.',
    heroPrimaryCTA3: 'AI Asistanı Dene',
    heroSecondaryCTA3: 'Daha Fazla Öğren',
    
    heroTitle4: 'Şeffaf Fiyatlandırma',
    heroSubtitle4: 'Gizli Ücret Yok',
    heroDescription4: 'Sürpriz olmayan net, peşin fiyatlandırma. Şeffaf ücret yapımızla sadece ihtiyacınız olan hizmetler için ödeme yapın.',
    heroPrimaryCTA4: 'Fiyatları Görüntüle',
    heroSecondaryCTA4: 'Teklif Al',
    
    heroTitle5: 'Kurumsal Güvenlik',
    heroSubtitle5: 'Banka Düzeyinde Koruma',
    heroDescription5: 'Hassas iş verileriniz kurumsal düzeyde güvenlik ve sıkı gizlilik protokolleriyle korunur.',
    heroPrimaryCTA5: 'Güvenlik Hakkında Öğren',
    heroSecondaryCTA5: 'Özellikleri Görüntüle',
    
    // About Page
    aboutConsulting19: 'Consulting19 Hakkında',
    aboutHeroSubtext: '2016\'dan beri, yapay zeka destekli zeka ile küresel uzman danışman ağını birleştirerek uluslararası genişlemeyi basitleştiriyoruz. Kurucuların ve yatırımcıların 19+ ülkede şirket kurmasına, bankacılık yapmasına, vergileri optimize etmesine ve uyumlu kalmasına yardımcı oluyoruz.',
    startYourExpansion: 'Genişlemenizi Başlatın',
    exploreCountries: 'Ülkeleri Keşfedin',
    
    ourMission: 'Misyonumuz',
    missionText: 'Uzman rehberliği erişilebilir, hızlı ve adil fiyatlı hale getirerek uluslararası genişlemeyi demokratikleştirmek. Otomasyon ve yerel uzmanlığın pratik karışımı aracılığıyla her büyüklükteki şirket için kurumsal düzeyde sonuçlar sunuyoruz.',
    
    ourValues: 'Değerlerimiz',
    valuesSubtext: 'Yaptığımız her şeye rehberlik eden ilkeler',
    globalExpertise: 'Küresel Uzmanlık',
    globalExpertiseDesc: '19+ yargı yetkisinde yerinde bilgi.',
    aiPoweredEfficiency: 'AI Destekli Verimlilik',
    aiPoweredEfficiencyDesc: 'Daha hızlı analiz, daha az hata, daha iyi kararlar.',
    trustSecurity: 'Güven ve Güvenlik',
    trustSecurityDesc: 'Kurumsal düzeyde güvenlik ve veri gizliliği.',
    resultsDriven: 'Sonuç Odaklı',
    resultsDrivenDesc: 'Ölçülebilir sonuçlar ve net hesap verebilirlik.',
    
    foundedIn2016: '2016\'da Kuruldu',
    ourJourney: 'Startup\'tan küresel platforma yolculuğumuz',
    founded: 'Kuruldu',
    foundedDesc: 'İlk sınır ötesi kuruluş projeleri tamamlandı.',
    tenPlusCountries: '10+ Ülke',
    tenPlusCountriesDesc: 'Uzman ağı ölçeklendirildi; bankacılık ve uyumluluk eklendi.',
    aiAssistant: 'AI Asistan',
    aiAssistantDesc: 'KYC, dosyalama ve vergi yönlendirme için otomatik iş akışları.',
    flagshipPlatforms: 'Amiral Gemisi Platformlar',
    flagshipPlatformsDesc: 'Matrix (UHNW) ve FidelKey (Güvenli Tapu Yatırımı) başlatıldı.',
    
    flagshipPlatformsTitle: 'Amiral Gemisi Platformlar',
    flagshipPlatformsSubtext: 'Sofistike yatırımcılar ve varlık yönetimi için premium çözümler',
    matrixTitle: 'Matrix — Özel Varlık Platformu',
    matrixDesc: 'Ultra yüksek net değerli müşteriler için gizlilik öncelikli platform. AI destekli küresel tahsis, çok yargılı bankacılık ve gizli uygulama. Minimum yatırım: 5 milyon dolar.',
    aiDrivenAnalysis: 'AI güdümlü analiz',
    globalOpportunities: 'Küresel fırsatlar',
    strictConfidentiality: 'Sıkı gizlilik',
    exploreMatrixWealth: 'Matrix Wealth\'i Keşfet',
    qualifiedInvestorsOnly: 'Sadece nitelikli yatırımcılar için.',
    
    fidelkeyTitle: 'FidelKey — Güvenli Tapu Yatırım Sistemi',
    fidelkeyDesc: 'Gayrimenkul sahipliği, finansal getiriler ve uluslararası vize yollarını teminatlı tapu modeli altında birleştiren dünyanın ilk güvenli tapu yatırım geçidi.',
    securedTitleStructure: 'Güvenli tapu yapısı',
    residencyOptions: 'İkamet seçenekleri',
    rentalDividendYield: 'Kira/temettü getiri potansiyeli',
    exploreFidelkey: 'FidelKey\'i Keşfet',
    
    ourStory: 'Hikayemiz',
    storyText: 'Consulting19, 2016\'da basit bir gözlemle başladı: sınır ötesi genişleme gerekenden daha zordu. Son teknoloji AI\'yi seçilmiş yerel uzmanlar ağıyla eşleştirerek, şirket kuruluşu, bankacılık, vergi optimizasyonu ve uyumluluk konularında kurumsal düzeyde sonuçları geleneksel modellerden daha hızlı ve öngörülebilir şekilde sunuyoruz.',
    
    countriesSupported: 'Desteklenen Ülkeler',
    companiesFormed: 'Kurulan Şirketler',
    successRate: 'Başarı Oranı',
    averageSetup: 'Ortalama Kurulum',
    
    readyToJoin: 'Misyonumuza Katılmaya Hazır mısınız?',
    readyToJoinDesc: 'İster küresel olarak genişleyin ister müşterilere danışmanlık yapın, işbirliği yapmayı çok isteriz.',
    becomeConsultant: 'Danışman Ol',
    
    // Common
    learnMore: 'Daha Fazla Öğren',
    getStarted: 'Başlayın',
    viewServices: 'Hizmetleri Görüntüle',
    scheduleConsultation: 'Danışmanlık Planla',
    chooseCountry: 'Ülke Seç',
    
    // Services
    companyFormation: 'Şirket Kuruluşu',
    taxOptimization: 'Vergi Optimizasyonu',
    bankingSolutions: 'Bankacılık Çözümleri',
    legalCompliance: 'Yasal Uyumluluk',
    assetProtection: 'Varlık Koruması',
    investmentAdvisory: 'Yatırım Danışmanlığı',
    
    // Other existing translations...
    aiPoweredIntelligence: 'AI Destekli Zeka',
    copyright: '© 2025 Consulting19. Tüm hakları saklıdır.',
    powered: 'Gelişmiş AI teknolojisi ile güçlendirilmiştir',
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
    
    // Hero Section
    heroTitle1: 'Consultoria Global',
    heroSubtitle1: 'Alimentada por IA',
    heroDescription1: 'Orientação especializada para expansão internacional em 19+ países. Da formação de empresas à otimização fiscal, nosso AI Oracle conecta você aos consultores certos.',
    heroPrimaryCTA1: 'Iniciar Consulta Gratuita',
    heroSecondaryCTA1: 'Explorar Serviços',
    
    heroTitle2: 'Rede de Especialistas',
    heroSubtitle2: 'em 19+ Países',
    heroDescription2: 'Conecte-se com especialistas locais que entendem regulamentações, bancos e cultura empresarial em seus mercados-alvo.',
    heroPrimaryCTA2: 'Encontre Seu Consultor',
    heroSecondaryCTA2: 'Ver Países',
    
    heroTitle3: 'Automação Inteligente',
    heroSubtitle3: 'Expertise Humana',
    heroDescription3: 'Nosso AI Oracle analisa suas necessidades e combina você com a jurisdição e consultor perfeitos para seus objetivos empresariais.',
    heroPrimaryCTA3: 'Experimentar Assistente IA',
    heroSecondaryCTA3: 'Saiba Mais',
    
    heroTitle4: 'Preços Transparentes',
    heroSubtitle4: 'Sem Taxas Ocultas',
    heroDescription4: 'Preços claros e antecipados sem surpresas. Pague apenas pelos serviços que precisa com nossa estrutura de taxas transparente.',
    heroPrimaryCTA4: 'Ver Preços',
    heroSecondaryCTA4: 'Obter Cotação',
    
    heroTitle5: 'Segurança Empresarial',
    heroSubtitle5: 'Proteção Nível Bancário',
    heroDescription5: 'Seus dados empresariais sensíveis são protegidos com segurança de nível empresarial e protocolos rigorosos de confidencialidade.',
    heroPrimaryCTA5: 'Saiba Sobre Segurança',
    heroSecondaryCTA5: 'Ver Recursos',
    
    // About Page
    aboutConsulting19: 'Sobre a Consulting19',
    aboutHeroSubtext: 'Desde 2016, temos simplificado a expansão internacional combinando inteligência alimentada por IA com uma rede global de consultores especialistas. Ajudamos fundadores e investidores a lançar, fazer operações bancárias, otimizar impostos e manter conformidade em 19+ países.',
    startYourExpansion: 'Inicie Sua Expansão',
    exploreCountries: 'Explorar Países',
    
    ourMission: 'Nossa Missão',
    missionText: 'Democratizar a expansão internacional tornando a orientação especializada acessível, rápida e com preços justos. Entregamos resultados de nível empresarial para empresas de todos os tamanhos através da combinação prática de automação e expertise local.',
    
    ourValues: 'Nossos Valores',
    valuesSubtext: 'Os princípios que orientam tudo o que fazemos',
    globalExpertise: 'Expertise Global',
    globalExpertiseDesc: 'Conhecimento local em 19+ jurisdições.',
    aiPoweredEfficiency: 'Eficiência Alimentada por IA',
    aiPoweredEfficiencyDesc: 'Análise mais rápida, menos erros, melhores decisões.',
    trustSecurity: 'Confiança e Segurança',
    trustSecurityDesc: 'Segurança de nível empresarial e privacidade de dados.',
    resultsDriven: 'Orientado a Resultados',
    resultsDrivenDesc: 'Resultados mensuráveis e responsabilidade clara.',
    
    foundedIn2016: 'Fundada em 2016',
    ourJourney: 'Nossa jornada de startup para plataforma global',
    founded: 'Fundada',
    foundedDesc: 'Primeiros projetos de formação transfronteiriça concluídos.',
    tenPlusCountries: '10+ Países',
    tenPlusCountriesDesc: 'Rede de especialistas expandida; adicionados serviços bancários e conformidade.',
    aiAssistant: 'Assistente IA',
    aiAssistantDesc: 'Fluxos de trabalho automatizados para KYC, arquivamentos e roteamento fiscal.',
    flagshipPlatforms: 'Plataformas Principais',
    flagshipPlatformsDesc: 'Matrix (UHNW) e FidelKey (Investimento de Título Seguro) lançadas.',
    
    flagshipPlatformsTitle: 'Plataformas Principais',
    flagshipPlatformsSubtext: 'Soluções premium para investidores sofisticados e gestão de patrimônio',
    matrixTitle: 'Matrix — Plataforma de Patrimônio Privado',
    matrixDesc: 'Uma plataforma que prioriza a privacidade para clientes de patrimônio líquido ultra alto. Alocação global assistida por IA, bancos multi-jurisdicionais e execução discreta. Investimento mínimo: $5M.',
    aiDrivenAnalysis: 'Análise orientada por IA',
    globalOpportunities: 'Oportunidades globais',
    strictConfidentiality: 'Confidencialidade rigorosa',
    exploreMatrixWealth: 'Explorar Matrix Wealth',
    qualifiedInvestorsOnly: 'Apenas para investidores qualificados.',
    
    fidelkeyTitle: 'FidelKey — Sistema de Investimento de Título Seguro',
    fidelkeyDesc: 'O primeiro gateway de investimento de título seguro do mundo combinando propriedade imobiliária, retornos financeiros e caminhos de visto internacional sob um modelo de título garantido.',
    securedTitleStructure: 'Estrutura de título seguro',
    residencyOptions: 'Opções de residência',
    rentalDividendYield: 'Potencial de rendimento de aluguel/dividendo',
    exploreFidelkey: 'Explorar FidelKey',
    
    ourStory: 'Nossa História',
    storyText: 'A Consulting19 começou em 2016 com uma observação simples: a expansão transfronteiriça era mais difícil do que precisava ser. Ao combinar IA de ponta com uma rede curada de especialistas locais, entregamos resultados de nível empresarial—formação de empresas, bancos, otimização fiscal e conformidade—mais rápido e mais previsivelmente do que modelos tradicionais.',
    
    countriesSupported: 'Países Suportados',
    companiesFormed: 'Empresas Formadas',
    successRate: 'Taxa de Sucesso',
    averageSetup: 'Configuração Média',
    
    readyToJoin: 'Pronto para Se Juntar à Nossa Missão?',
    readyToJoinDesc: 'Seja expandindo globalmente ou aconselhando clientes, adoraríamos colaborar.',
    becomeConsultant: 'Torne-se um Consultor',
    
    // Common
    learnMore: 'Saiba Mais',
    getStarted: 'Começar',
    viewServices: 'Ver Serviços',
    scheduleConsultation: 'Agendar Consulta',
    chooseCountry: 'Escolher País',
    
    // Services
    companyFormation: 'Formação de Empresa',
    taxOptimization: 'Otimização Fiscal',
    bankingSolutions: 'Soluções Bancárias',
    legalCompliance: 'Conformidade Legal',
    assetProtection: 'Proteção de Ativos',
    investmentAdvisory: 'Consultoria de Investimento',
    
    // Other existing translations...
    aiPoweredIntelligence: 'Inteligência Alimentada por IA',
    copyright: '© 2025 Consulting19. Todos os direitos reservados.',
    powered: 'Alimentado por tecnologia IA avançada',
  },
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
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