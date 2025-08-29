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
    
    // Services Page
    servicesHeroTitle: 'Comprehensive International Business Services',
    servicesHeroDescription: 'From company formation to ongoing compliance, we provide end-to-end support delivered by expert consultants in 19+ countries.',
    
    // Company Formation
    companyFormationTitle: 'Company Formation',
    companyFormationSummary: 'End-to-end company registration and incorporation in business-friendly jurisdictions.',
    companyFormationHeroTitle: 'Seamless Global Company Formation – From Idea to Incorporation',
    companyFormationHeroDescription: 'Establish your business in 19+ countries with expert legal guidance and AI-powered process automation. Fast and compliant incorporation with full banking support.',
    
    // Tax Optimization
    taxOptimizationTitle: 'Tax Optimization',
    taxOptimizationSummary: 'Strategic international tax planning to minimize legal tax liability across jurisdictions.',
    taxOptimizationHeroTitle: 'Tax Optimization Services – Maximize Efficiency, Minimize Liability',
    taxOptimizationHeroDescription: 'Leverage 19+ jurisdictions and AI-powered analysis to reduce tax burdens legally and transparently. We design compliant, audit-ready structures tailored to your operations.',
    
    // Banking Solutions
    bankingSolutionsTitle: 'Banking Solutions',
    bankingSolutionsSummary: 'Global banking support for opening and managing corporate accounts.',
    bankingSolutionsHeroTitle: 'Global Banking Solutions – Secure, Compliant, and Efficient',
    bankingSolutionsHeroDescription: 'Access premium corporate and personal banking worldwide. Consulting19 helps you connect with leading financial centers, ensuring compliance, multi-currency solutions, and advanced digital banking services.',
    
    // Legal Compliance
    legalComplianceTitle: 'Legal Compliance',
    legalComplianceSummary: 'Ongoing legal and regulatory support to keep your business compliant.',
    legalComplianceHeroTitle: 'Legal Compliance Services',
    legalComplianceHeroDescription: 'Ensure full legal compliance across all jurisdictions. Our experts help you navigate complex regulations, maintain good standing, and stay audit-ready in every country you operate.',
    
    // Asset Protection
    assetProtectionTitle: 'Asset Protection',
    assetProtectionSummary: 'Trusts, foundations, and holding structures to protect assets and reduce risk.',
    assetProtectionHeroTitle: 'Asset Protection Services',
    assetProtectionHeroDescription: 'Protect your wealth from legal risks, creditors, and political instability. We design compliant trust, foundation, and holding structures that safeguard assets while maintaining access and control.',
    
    // Investment Advisory
    investmentAdvisoryTitle: 'Investment Advisory',
    investmentAdvisorySummary: 'Tailored, globally diversified strategies across public and private markets.',
    investmentAdvisoryHeroTitle: 'Investment Advisory Services',
    investmentAdvisoryHeroDescription: 'Maximize long-term returns with disciplined, globally diversified strategies. Our advisors deliver tailored asset allocation, risk management, and access to qualified opportunities across public and private markets.',
    
    // Visa & Residency
    visaResidencyTitle: 'Visa & Residency',
    visaResidencySummary: 'End-to-end visa and residency solutions for founders, investors, and their families.',
    visaResidencyHeroTitle: 'Visa & Residency Services',
    visaResidencyHeroDescription: 'Secure residency or citizenship in your preferred country. Our immigration experts guide you through eligibility, program selection, compliant documentation, and end-to-end application support.',
    
    // Market Research
    marketResearchTitle: 'Market Research',
    marketResearchSummary: 'In-depth market and competitive analysis for successful international expansion.',
    marketResearchHeroTitle: 'Market Research Services',
    marketResearchHeroDescription: 'Make informed decisions with data-driven market intelligence. Our researchers deliver deep insights on customers, competitors, regulations, and go-to-market opportunities across global markets.',
    
    // Common
    backToServices: 'Back to Services',
    whatWeOffer: 'What We Offer',
    howItWorks: 'How It Works',
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    scheduleConsultation: 'Schedule Consultation',
    chooseCountry: 'Choose Country',
    frequentlyAskedQuestions: 'Frequently Asked Questions',
    needCustomSolution: 'Need a Custom Solution?',
    customSolutionDescription: 'Our expert advisors can design a tailored strategy for your business needs.',
    consultWithExpert: 'Consult with Expert',
    exploreCountries: 'Explore Countries',
    
    // Countries
    unitedArabEmirates: 'United Arab Emirates',
    estonia: 'Estonia',
    georgia: 'Georgia',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portugal',
    unitedStates: 'United States',
    switzerland: 'Switzerland',
    montenegro: 'Montenegro',
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
    
    // Services Page
    servicesHeroTitle: 'Kapsamlı Uluslararası İş Hizmetleri',
    servicesHeroDescription: 'Şirket kuruluşundan sürekli uyum sağlamaya kadar, 19+ ülkede uzman danışmanlar tarafından sunulan uçtan uca destek sağlıyoruz.',
    
    // Company Formation
    companyFormationTitle: 'Şirket Kuruluşu',
    companyFormationSummary: 'İş dostu yargı alanlarında uçtan uca şirket kaydı ve kuruluşu.',
    companyFormationHeroTitle: 'Sorunsuz Küresel Şirket Kuruluşu – Fikirden Kuruluşa',
    companyFormationHeroDescription: '19+ ülkede uzman hukuki rehberlik ve AI destekli süreç otomasyonu ile işinizi kurun. Tam bankacılık desteği ile hızlı ve uyumlu kuruluş.',
    
    // Tax Optimization
    taxOptimizationTitle: 'Vergi Optimizasyonu',
    taxOptimizationSummary: 'Yargı alanları genelinde yasal vergi yükümlülüğünü minimize etmek için stratejik uluslararası vergi planlaması.',
    taxOptimizationHeroTitle: 'Vergi Optimizasyon Hizmetleri – Verimliliği Maksimize Edin, Yükümlülüğü Minimize Edin',
    taxOptimizationHeroDescription: '19+ yargı alanı ve AI destekli analiz ile vergi yüklerini yasal ve şeffaf şekilde azaltın. Operasyonlarınıza özel uyumlu, denetim hazır yapılar tasarlıyoruz.',
    
    // Banking Solutions
    bankingSolutionsTitle: 'Bankacılık Çözümleri',
    bankingSolutionsSummary: 'Kurumsal hesap açma ve yönetimi için küresel bankacılık desteği.',
    bankingSolutionsHeroTitle: 'Küresel Bankacılık Çözümleri – Güvenli, Uyumlu ve Verimli',
    bankingSolutionsHeroDescription: 'Dünya çapında premium kurumsal ve kişisel bankacılığa erişin. Consulting19, önde gelen finansal merkezlerle bağlantı kurmanıza yardımcı olur, uyumluluk, çok para birimli çözümler ve gelişmiş dijital bankacılık hizmetleri sağlar.',
    
    // Legal Compliance
    legalComplianceTitle: 'Hukuki Uyumluluk',
    legalComplianceSummary: 'İşinizi uyumlu tutmak için sürekli hukuki ve düzenleyici destek.',
    legalComplianceHeroTitle: 'Hukuki Uyumluluk Hizmetleri',
    legalComplianceHeroDescription: 'Tüm yargı alanlarında tam hukuki uyumluluk sağlayın. Uzmanlarımız karmaşık düzenlemelerde gezinmenize, iyi durumda kalmanıza ve faaliyet gösterdiğiniz her ülkede denetim hazır olmanıza yardımcı olur.',
    
    // Asset Protection
    assetProtectionTitle: 'Varlık Koruması',
    assetProtectionSummary: 'Varlıkları korumak ve riski azaltmak için tröstler, vakıflar ve holding yapıları.',
    assetProtectionHeroTitle: 'Varlık Koruma Hizmetleri',
    assetProtectionHeroDescription: 'Servetinizi hukuki risklerden, alacaklılardan ve siyasi istikrarsızlıktan koruyun. Erişim ve kontrolü korurken varlıkları koruyan uyumlu tröst, vakıf ve holding yapıları tasarlıyoruz.',
    
    // Investment Advisory
    investmentAdvisoryTitle: 'Yatırım Danışmanlığı',
    investmentAdvisorySummary: 'Kamu ve özel piyasalarda özel, küresel olarak çeşitlendirilmiş stratejiler.',
    investmentAdvisoryHeroTitle: 'Yatırım Danışmanlığı Hizmetleri',
    investmentAdvisoryHeroDescription: 'Disiplinli, küresel olarak çeşitlendirilmiş stratejilerle uzun vadeli getirileri maksimize edin. Danışmanlarımız kamu ve özel piyasalarda özel varlık tahsisi, risk yönetimi ve nitelikli fırsatlara erişim sunar.',
    
    // Visa & Residency
    visaResidencyTitle: 'Vize ve İkamet',
    visaResidencySummary: 'Kurucular, yatırımcılar ve aileleri için uçtan uca vize ve ikamet çözümleri.',
    visaResidencyHeroTitle: 'Vize ve İkamet Hizmetleri',
    visaResidencyHeroDescription: 'Tercih ettiğiniz ülkede ikamet veya vatandaşlık güvence altına alın. Göçmenlik uzmanlarımız uygunluk, program seçimi, uyumlu belgelendirme ve uçtan uca başvuru desteği konularında size rehberlik eder.',
    
    // Market Research
    marketResearchTitle: 'Pazar Araştırması',
    marketResearchSummary: 'Başarılı uluslararası genişleme için derinlemesine pazar ve rekabet analizi.',
    marketResearchHeroTitle: 'Pazar Araştırması Hizmetleri',
    marketResearchHeroDescription: 'Veri odaklı pazar zekası ile bilinçli kararlar alın. Araştırmacılarımız küresel pazarlarda müşteriler, rakipler, düzenlemeler ve pazara giriş fırsatları hakkında derin içgörüler sunar.',
    
    // Common
    backToServices: 'Hizmetlere Dön',
    whatWeOffer: 'Neler Sunuyoruz',
    howItWorks: 'Nasıl Çalışır',
    learnMore: 'Daha Fazla Bilgi',
    getStarted: 'Başlayın',
    scheduleConsultation: 'Danışmanlık Planlayın',
    chooseCountry: 'Ülke Seçin',
    frequentlyAskedQuestions: 'Sık Sorulan Sorular',
    needCustomSolution: 'Özel Çözüme İhtiyacınız Var mı?',
    customSolutionDescription: 'Uzman danışmanlarımız iş ihtiyaçlarınız için özel bir strateji tasarlayabilir.',
    consultWithExpert: 'Uzmanla Görüşün',
    exploreCountries: 'Ülkeleri Keşfedin',
    
    // Countries
    unitedArabEmirates: 'Birleşik Arap Emirlikleri',
    estonia: 'Estonya',
    georgia: 'Gürcistan',
    malta: 'Malta',
    panama: 'Panama',
    portugal: 'Portekiz',
    unitedStates: 'Amerika Birleşik Devletleri',
    switzerland: 'İsviçre',
    montenegro: 'Karadağ',
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
    
    // Services Page
    servicesHeroTitle: 'Serviços Abrangentes de Negócios Internacionais',
    servicesHeroDescription: 'Da formação de empresas à conformidade contínua, fornecemos suporte completo entregue por consultores especialistas em mais de 19 países.',
    
    // Company Formation
    companyFormationTitle: 'Formação de Empresa',
    companyFormationSummary: 'Registro e incorporação completa de empresas em jurisdições favoráveis aos negócios.',
    companyFormationHeroTitle: 'Formação Global de Empresas Sem Complicações – Da Ideia à Incorporação',
    companyFormationHeroDescription: 'Estabeleça seu negócio em mais de 19 países com orientação jurídica especializada e automação de processos com IA. Incorporação rápida e compatível com suporte bancário completo.',
    
    // Tax Optimization
    taxOptimizationTitle: 'Otimização Fiscal',
    taxOptimizationSummary: 'Planejamento tributário internacional estratégico para minimizar a responsabilidade fiscal legal entre jurisdições.',
    taxOptimizationHeroTitle: 'Serviços de Otimização Fiscal – Maximize a Eficiência, Minimize a Responsabilidade',
    taxOptimizationHeroDescription: 'Aproveite mais de 19 jurisdições e análise com IA para reduzir cargas tributárias legal e transparentemente. Projetamos estruturas compatíveis e prontas para auditoria adaptadas às suas operações.',
    
    // Banking Solutions
    bankingSolutionsTitle: 'Soluções Bancárias',
    bankingSolutionsSummary: 'Suporte bancário global para abertura e gestão de contas corporativas.',
    bankingSolutionsHeroTitle: 'Soluções Bancárias Globais – Seguras, Compatíveis e Eficientes',
    bankingSolutionsHeroDescription: 'Acesse serviços bancários corporativos e pessoais premium em todo o mundo. A Consulting19 ajuda você a se conectar com centros financeiros líderes, garantindo conformidade, soluções multi-moeda e serviços bancários digitais avançados.',
    
    // Legal Compliance
    legalComplianceTitle: 'Conformidade Legal',
    legalComplianceSummary: 'Suporte jurídico e regulatório contínuo para manter seu negócio em conformidade.',
    legalComplianceHeroTitle: 'Serviços de Conformidade Legal',
    legalComplianceHeroDescription: 'Garanta total conformidade legal em todas as jurisdições. Nossos especialistas ajudam você a navegar regulamentações complexas, manter boa reputação e estar pronto para auditoria em todos os países onde opera.',
    
    // Asset Protection
    assetProtectionTitle: 'Proteção de Ativos',
    assetProtectionSummary: 'Trusts, fundações e estruturas holding para proteger ativos e reduzir riscos.',
    assetProtectionHeroTitle: 'Serviços de Proteção de Ativos',
    assetProtectionHeroDescription: 'Proteja sua riqueza de riscos legais, credores e instabilidade política. Projetamos estruturas compatíveis de trust, fundação e holding que protegem ativos mantendo acesso e controle.',
    
    // Investment Advisory
    investmentAdvisoryTitle: 'Consultoria de Investimentos',
    investmentAdvisorySummary: 'Estratégias personalizadas e globalmente diversificadas em mercados públicos e privados.',
    investmentAdvisoryHeroTitle: 'Serviços de Consultoria de Investimentos',
    investmentAdvisoryHeroDescription: 'Maximize retornos de longo prazo com estratégias disciplinadas e globalmente diversificadas. Nossos consultores oferecem alocação de ativos personalizada, gestão de riscos e acesso a oportunidades qualificadas em mercados públicos e privados.',
    
    // Visa & Residency
    visaResidencyTitle: 'Visto e Residência',
    visaResidencySummary: 'Soluções completas de visto e residência para fundadores, investidores e suas famílias.',
    visaResidencyHeroTitle: 'Serviços de Visto e Residência',
    visaResidencyHeroDescription: 'Garanta residência ou cidadania no país de sua preferência. Nossos especialistas em imigração orientam você através de elegibilidade, seleção de programa, documentação compatível e suporte completo de aplicação.',
    
    // Market Research
    marketResearchTitle: 'Pesquisa de Mercado',
    marketResearchSummary: 'Análise aprofundada de mercado e competitiva para expansão internacional bem-sucedida.',
    marketResearchHeroTitle: 'Serviços de Pesquisa de Mercado',
    marketResearchHeroDescription: 'Tome decisões informadas com inteligência de mercado baseada em dados. Nossos pesquisadores fornecem insights profundos sobre clientes, concorrentes, regulamentações e oportunidades de entrada no mercado em mercados globais.',
    
    // Common
    backToServices: 'Voltar aos Serviços',
    whatWeOffer: 'O Que Oferecemos',
    howItWorks: 'Como Funciona',
    learnMore: 'Saiba Mais',
    getStarted: 'Começar',
    scheduleConsultation: 'Agendar Consulta',
    chooseCountry: 'Escolher País',
    frequentlyAskedQuestions: 'Perguntas Frequentes',
    needCustomSolution: 'Precisa de uma Solução Personalizada?',
    customSolutionDescription: 'Nossos consultores especialistas podem projetar uma estratégia personalizada para suas necessidades de negócio.',
    consultWithExpert: 'Consultar com Especialista',
    exploreCountries: 'Explorar Países',
    
    // Countries
    unitedArabEmirates: 'Emirados Árabes Unidos',
    estonia: 'Estônia',
    georgia: 'Geórgia',
    malta: 'Malta',
    panama: 'Panamá',
    portugal: 'Portugal',
    unitedStates: 'Estados Unidos',
    switzerland: 'Suíça',
    montenegro: 'Montenegro',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
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
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}