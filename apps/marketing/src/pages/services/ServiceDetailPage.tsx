import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  Calculator, 
  CreditCard, 
  FileText, 
  Shield, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Users,
  Globe,
  Zap,
  Clock,
  Star,
  MessageCircle,
  Bot,
  Target,
  Award
} from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const { t, language } = useLanguage();

  // Service content based on existing translation keys
  const serviceContent = {
    'company-formation': {
      title: t('companyFormation'),
      heroTitle: language === 'tr' ? 'Sorunsuz Küresel Şirket Kuruluşu – Fikirden Kuruluşa' :
                 language === 'pt' ? 'Formação Global de Empresas Sem Complicações – Da Ideia à Incorporação' :
                 'Seamless Global Company Formation – From Idea to Incorporation',
      heroDesc: language === 'tr' ? '19+ ülkede yerel uzmanlar ve AI destekli süreç otomasyonu ile hızlı, güvenilir ve uygun maliyetli şirket kuruluşu hizmetleri.' :
                language === 'pt' ? 'Serviços de formação de empresas rápidos, confiáveis e econômicos com especialistas locais em 19+ países e automação de processos com IA.' :
                'Fast, reliable, and cost-effective company formation services with local experts in 19+ countries and AI-powered process automation.',
    },
    'tax-optimization': {
      title: t('taxOptimization'),
      heroTitle: language === 'tr' ? 'Akıllı Vergi Optimizasyonu – Yasal Yollarla Maksimum Tasarruf' :
                 language === 'pt' ? 'Otimização Fiscal Inteligente – Máxima Economia por Meios Legais' :
                 'Smart Tax Optimization – Maximum Savings Through Legal Means',
      heroDesc: language === 'tr' ? 'AI destekli vergi analizi ve uzman danışmanlığı ile yasal vergi yükümlülüklerinizi minimize edin. Uluslararası vergi planlaması ve yapılandırma hizmetleri.' :
                language === 'pt' ? 'Minimize suas obrigações fiscais legais com análise fiscal com IA e consultoria especializada. Serviços de planejamento e estruturação fiscal internacional.' :
                'Minimize your legal tax obligations with AI-powered tax analysis and expert advisory. International tax planning and structuring services.',
    },
    'banking-solutions': {
      title: t('bankingSolutions'),
      heroTitle: language === 'tr' ? 'Küresel Bankacılık Çözümleri – Her Ülkede Güvenli Hesap Açılışı' :
                 language === 'pt' ? 'Soluções Bancárias Globais – Abertura Segura de Contas em Qualquer País' :
                 'Global Banking Solutions – Secure Account Opening in Any Country',
      heroDesc: language === 'tr' ? 'Kurumsal banka hesabı açılışı, çoklu para birimi hesapları ve uluslararası ödeme sistemleri kurulumu. Bankacılık uzmanlarımızla güvenli finansal altyapı.' :
                language === 'pt' ? 'Abertura de conta bancária corporativa, contas multi-moeda e configuração de sistemas de pagamento internacional. Infraestrutura financeira segura com nossos especialistas bancários.' :
                'Corporate bank account opening, multi-currency accounts, and international payment systems setup. Secure financial infrastructure with our banking experts.',
    },
    'legal-compliance': {
      title: t('legalCompliance'),
      heroTitle: language === 'tr' ? 'Yasal Uyumluluk ve Düzenleyici Rehberlik – Güvenli İş Yürütme' :
                 language === 'pt' ? 'Conformidade Legal e Orientação Regulatória – Operação Comercial Segura' :
                 'Legal Compliance & Regulatory Guidance – Safe Business Operations',
      heroDesc: language === 'tr' ? 'Uluslararası yasal gereksinimler, düzenleyici uyumluluk ve sürekli izleme hizmetleri. Yasal risklerinizi minimize edin, işinizi güvenle büyütün.' :
                language === 'pt' ? 'Requisitos legais internacionais, conformidade regulatória e serviços de monitoramento contínuo. Minimize seus riscos legais, cresça seu negócio com segurança.' :
                'International legal requirements, regulatory compliance, and ongoing monitoring services. Minimize your legal risks, grow your business safely.',
    },
    'asset-protection': {
      title: t('assetProtection'),
      heroTitle: language === 'tr' ? 'Varlık Koruma Stratejileri – Servetinizi Güvence Altına Alın' :
                 language === 'pt' ? 'Estratégias de Proteção de Ativos – Proteja Sua Riqueza' :
                 'Asset Protection Strategies – Safeguard Your Wealth',
      heroDesc: language === 'tr' ? 'Uluslararası varlık koruma yapıları, offshore trust\'lar ve yasal koruma mekanizmaları. Servetinizi ekonomik ve politik risklerden koruyun.' :
                language === 'pt' ? 'Estruturas internacionais de proteção de ativos, trusts offshore e mecanismos de proteção legal. Proteja sua riqueza de riscos econômicos e políticos.' :
                'International asset protection structures, offshore trusts, and legal protection mechanisms. Protect your wealth from economic and political risks.',
    },
    'investment-advisory': {
      title: t('investmentAdvisory'),
      heroTitle: language === 'tr' ? 'Yatırım Danışmanlığı – Küresel Fırsatları Değerlendirin' :
                 language === 'pt' ? 'Consultoria de Investimento – Avalie Oportunidades Globais' :
                 'Investment Advisory – Evaluate Global Opportunities',
      heroDesc: language === 'tr' ? 'Uluslararası yatırım fırsatları, portföy çeşitlendirme ve risk yönetimi. Küresel pazarlarda akıllı yatırım kararları alın.' :
                language === 'pt' ? 'Oportunidades de investimento internacional, diversificação de portfólio e gestão de risco. Tome decisões de investimento inteligentes em mercados globais.' :
                'International investment opportunities, portfolio diversification, and risk management. Make smart investment decisions in global markets.',
    },
  };

  const currentService = serviceContent[serviceId as keyof typeof serviceContent] || serviceContent['company-formation'];

  // What We Offer - 8 services
  const services = [
    {
      icon: Bot,
      title: language === 'tr' ? 'AI Destekli Yargı Yetkisi Analizi' :
             language === 'pt' ? 'Análise de Jurisdição com IA' :
             'AI-Powered Jurisdiction Analysis',
      description: language === 'tr' ? 'Yapay zeka Oracle\'ımız işinizin ihtiyaçlarını analiz ederek en uygun ülke ve vergi yapısını önerir.' :
                   language === 'pt' ? 'Nosso Oracle de IA analisa as necessidades do seu negócio para recomendar o país e estrutura fiscal mais adequados.' :
                   'Our AI Oracle analyzes your business needs to recommend the most suitable country and tax structure.'
    },
    {
      icon: FileText,
      title: language === 'tr' ? 'Kapsamlı Dokümantasyon ve Yasal Uyumluluk' :
             language === 'pt' ? 'Documentação Abrangente e Conformidade Legal' :
             'Complete Documentation & Legal Compliance',
      description: language === 'tr' ? 'Tüm yasal belgeler, devlet başvuruları ve uyumluluk gereksinimlerini uzmanlarımız halleder.' :
                   language === 'pt' ? 'Nossos especialistas cuidam de todos os documentos legais, aplicações governamentais e requisitos de conformidade.' :
                   'Our experts handle all legal documents, government applications, and compliance requirements.'
    },
    {
      icon: Globe,
      title: language === 'tr' ? 'Dijital Kimlik ve e-Residency Çözümleri' :
             language === 'pt' ? 'Identidade Digital e Soluções de e-Residência' :
             'Digital Identity & e-Residency Solutions',
      description: language === 'tr' ? 'Estonya ve diğer ülkelerde dijital kimlik ve e-residency başvurularınızı yönetiyoruz.' :
                   language === 'pt' ? 'Gerenciamos suas aplicações de identidade digital e e-residência na Estônia e outros países.' :
                   'We manage your digital identity and e-residency applications in Estonia and other countries.'
    },
    {
      icon: CreditCard,
      title: language === 'tr' ? 'Entegre Bankacılık ve Ödeme Çözümleri' :
             language === 'pt' ? 'Soluções Integradas de Banco e Pagamento' :
             'Integrated Banking & Payment Solutions',
      description: language === 'tr' ? 'Kurumsal banka hesabı açılışı, ödeme sistemleri ve finansal altyapı kurulumu.' :
                   language === 'pt' ? 'Abertura de conta bancária corporativa, sistemas de pagamento e configuração de infraestrutura financeira.' :
                   'Corporate bank account opening, payment systems, and financial infrastructure setup.'
    },
    {
      icon: Calculator,
      title: language === 'tr' ? 'Vergi Optimizasyonu ve Yapı Planlaması' :
             language === 'pt' ? 'Otimização Fiscal e Planejamento de Estrutura' :
             'Tax Optimization & Structure Planning',
      description: language === 'tr' ? 'Yasal vergi avantajlarından maksimum fayda sağlayacak şirket yapısı tasarımı.' :
                   language === 'pt' ? 'Design de estrutura corporativa para maximizar os benefícios fiscais legais.' :
                   'Corporate structure design to maximize legal tax benefits.'
    },
    {
      icon: Shield,
      title: language === 'tr' ? 'Sürekli Uyumluluk İzleme' :
             language === 'pt' ? 'Monitoramento Contínuo de Conformidade' :
             'Ongoing Compliance Monitoring',
      description: language === 'tr' ? 'AI destekli sistem ile yasal yükümlülüklerinizi takip eder, son tarihleri hatırlatır.' :
                   language === 'pt' ? 'Sistema com IA monitora suas obrigações legais e lembra prazos importantes.' :
                   'AI-powered system monitors your legal obligations and reminds you of important deadlines.'
    },
    {
      icon: Building2,
      title: language === 'tr' ? 'Kayıtlı Ofis ve Sanal Adres Hizmetleri' :
             language === 'pt' ? 'Escritório Registrado e Serviços de Endereço Virtual' :
             'Registered Office & Virtual Address Services',
      description: language === 'tr' ? 'Profesyonel iş adresi, posta yönlendirme ve yasal temsilcilik hizmetleri.' :
                   language === 'pt' ? 'Endereço comercial profissional, redirecionamento de correspondência e serviços de representação legal.' :
                   'Professional business address, mail forwarding, and legal representation services.'
    },
    {
      icon: TrendingUp,
      title: language === 'tr' ? 'Kuruluş Sonrası Destek ve Büyüme Hizmetleri' :
             language === 'pt' ? 'Suporte Pós-Incorporação e Serviços de Crescimento' :
             'Post-Incorporation Support & Growth Services',
      description: language === 'tr' ? 'Muhasebe, bordro, yasal danışmanlık ve iş geliştirme desteği.' :
                   language === 'pt' ? 'Contabilidade, folha de pagamento, consultoria jurídica e suporte ao desenvolvimento de negócios.' :
                   'Accounting, payroll, legal advisory, and business development support.'
    }
  ];

  // Why Choose Us - 4 advantages
  const advantages = [
    {
      icon: Globe,
      title: language === 'tr' ? 'Küresel Ağ, Yerel Uzmanlık' :
             language === 'pt' ? 'Rede Global, Expertise Local' :
             'Global Network, Local Expertise',
      description: language === 'tr' ? '19+ ülkede yerel uzmanlarımız var. Her yargı yetkisinin kendine özgü kurallarını bilen danışmanlarla çalışıyorsunuz.' :
                   language === 'pt' ? 'Temos especialistas locais em 19+ países. Você trabalha com consultores que conhecem as regras específicas de cada jurisdição.' :
                   'We have local experts in 19+ countries. You work with consultants who know the specific rules of each jurisdiction.',
      stats: language === 'tr' ? '500+ başarılı kuruluş' :
             language === 'pt' ? '500+ formações bem-sucedidas' :
             '500+ successful formations'
    },
    {
      icon: Award,
      title: language === 'tr' ? 'Kanıtlanmış Başarı Geçmişi' :
             language === 'pt' ? 'Histórico Comprovado de Sucesso' :
             'Proven Track Record',
      description: language === 'tr' ? 'Son 3 yılda %98 başarı oranı ile 500+ şirket kurduk. Müşterilerimizin %95\'i hizmetimizi arkadaşlarına öneriyor.' :
                   language === 'pt' ? 'Formamos 500+ empresas com 98% de taxa de sucesso nos últimos 3 anos. 95% dos nossos clientes recomendam nosso serviço.' :
                   'We\'ve formed 500+ companies with a 98% success rate over the last 3 years. 95% of our clients recommend our service.',
      stats: language === 'tr' ? '%98 başarı oranı' :
             language === 'pt' ? '98% taxa de sucesso' :
             '98% success rate'
    },
    {
      icon: Zap,
      title: language === 'tr' ? 'AI Destekli Otomasyon' :
             language === 'pt' ? 'Automação com IA' :
             'AI-Powered Automation',
      description: language === 'tr' ? 'Yapay zeka teknolojimiz süreçleri %60 hızlandırır, hataları elimine eder ve 24/7 destek sağlar.' :
                   language === 'pt' ? 'Nossa tecnologia de IA acelera processos em 60%, elimina erros e fornece suporte 24/7.' :
                   'Our AI technology speeds up processes by 60%, eliminates errors, and provides 24/7 support.',
      stats: language === 'tr' ? '%60 daha hızlı' :
             language === 'pt' ? '60% mais rápido' :
             '60% faster'
    },
    {
      icon: Target,
      title: language === 'tr' ? 'Şeffaf Fiyatlandırma' :
             language === 'pt' ? 'Preços Transparentes' :
             'Transparent Pricing',
      description: language === 'tr' ? 'Geleneksel firmalara göre %30-40 daha uygun fiyatlarla, gizli ücret yok, net fiyat garantisi.' :
                   language === 'pt' ? '30-40% mais acessível que firmas tradicionais, sem taxas ocultas, garantia de preço fixo.' :
                   '30-40% more affordable than traditional firms, no hidden fees, fixed price guarantee.',
      stats: language === 'tr' ? '%30-40 daha uygun' :
             language === 'pt' ? '30-40% mais acessível' :
             '30-40% more affordable'
    }
  ];

  // How It Works - 4 steps
  const steps = [
    {
      number: 1,
      title: language === 'tr' ? 'Yargı Yetkisini Seçin' :
             language === 'pt' ? 'Escolha Sua Jurisdição' :
             'Choose Your Jurisdiction',
      description: language === 'tr' ? 'AI Oracle\'ımız işinizin ihtiyaçlarını analiz ederek en uygun ülkeyi önerir.' :
                   language === 'pt' ? 'Nosso Oracle de IA analisa as necessidades do seu negócio para recomendar o país mais adequado.' :
                   'Our AI Oracle analyzes your business needs to recommend the most suitable country.',
      duration: language === 'tr' ? '15 dakika' :
                language === 'pt' ? '15 minutos' :
                '15 minutes'
    },
    {
      number: 2,
      title: language === 'tr' ? 'Uzman Danışmanlığı ve Planlama' :
             language === 'pt' ? 'Consultoria Especializada e Planejamento' :
             'Expert Consultation & Planning',
      description: language === 'tr' ? 'Yerel uzmanımızla detaylı görüşme, belge listesi ve süreç planlaması.' :
                   language === 'pt' ? 'Reunião detalhada com nosso especialista local, lista de documentos e planejamento do processo.' :
                   'Detailed meeting with our local expert, document list, and process planning.',
      duration: language === 'tr' ? '1-2 gün' :
                language === 'pt' ? '1-2 dias' :
                '1-2 days'
    },
    {
      number: 3,
      title: language === 'tr' ? 'Kuruluş ve Kayıt' :
             language === 'pt' ? 'Incorporação e Registro' :
             'Incorporation & Registration',
      description: language === 'tr' ? 'Devlet başvuruları, yasal belgeler ve tüm uyumluluk işlemleri.' :
                   language === 'pt' ? 'Aplicações governamentais, documentos legais e todos os procedimentos de conformidade.' :
                   'Government applications, legal documents, and all compliance procedures.',
      duration: language === 'tr' ? '7-14 gün' :
                language === 'pt' ? '7-14 dias' :
                '7-14 days'
    },
    {
      number: 4,
      title: language === 'tr' ? 'Bankacılık ve İş Aktivasyonu' :
             language === 'pt' ? 'Banco e Ativação de Negócios' :
             'Banking & Business Activation',
      description: language === 'tr' ? 'Banka hesabı açılışı, ödeme sistemleri kurulumu ve işe başlama.' :
                   language === 'pt' ? 'Abertura de conta bancária, configuração de sistemas de pagamento e início das operações.' :
                   'Bank account opening, payment systems setup, and business launch.',
      duration: language === 'tr' ? '3-7 gün' :
                language === 'pt' ? '3-7 dias' :
                '3-7 days'
    }
  ];

  // Countries data
  const countries = [
    {
      id: 'uae',
      name: language === 'tr' ? 'Birleşik Arap Emirlikleri' :
            language === 'pt' ? 'Emirados Árabes Unidos' :
            'United Arab Emirates',
      flag: '🇦🇪',
      setupTime: language === 'tr' ? '7-14 gün' :
                 language === 'pt' ? '7-14 dias' :
                 '7-14 days',
      taxAdvantages: language === 'tr' ? 'Serbest bölgelerde %0 kurumlar vergisi, kişisel gelir vergisi yok' :
                     language === 'pt' ? '0% imposto corporativo em zonas francas, sem imposto de renda pessoal' :
                     '0% corporate tax in free zones, no personal income tax',
      compliance: language === 'tr' ? 'Yıllık lisans yenileme, denetim raporu' :
                  language === 'pt' ? 'Renovação anual de licença, relatório de auditoria' :
                  'Annual license renewal, audit report',
      image: 'https://images.pexels.com/photos/1769606/pexels-photo-1769606.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'estonia',
      name: language === 'tr' ? 'Estonya' :
            language === 'pt' ? 'Estônia' :
            'Estonia',
      flag: '🇪🇪',
      setupTime: language === 'tr' ? '1-2 hafta' :
                 language === 'pt' ? '1-2 semanas' :
                 '1-2 weeks',
      taxAdvantages: language === 'tr' ? '%100 online e-Residency, ertelenmiş vergilendirme' :
                     language === 'pt' ? '100% e-Residência online, tributação diferida' :
                     '100% online e-Residency, deferred taxation',
      compliance: language === 'tr' ? 'Yıllık rapor, KDV beyannamesi (gerekirse)' :
                  language === 'pt' ? 'Relatório anual, declaração de IVA (se aplicável)' :
                  'Annual report, VAT declaration (if applicable)',
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'georgia',
      name: language === 'tr' ? 'Gürcistan' :
            language === 'pt' ? 'Geórgia' :
            'Georgia',
      flag: '🇬🇪',
      setupTime: language === 'tr' ? '3-5 gün' :
                 language === 'pt' ? '3-5 dias' :
                 '3-5 days',
      taxAdvantages: language === 'tr' ? 'Küçük işletme statüsü ile %1 vergi' :
                     language === 'pt' ? '1% de imposto com status de pequena empresa' :
                     '1% tax with small business status',
      compliance: language === 'tr' ? 'Aylık vergi ödemesi, basit kayıt tutma' :
                  language === 'pt' ? 'Pagamento mensal de impostos, manutenção simples de registros' :
                  'Monthly tax payment, simple record keeping',
      image: 'https://images.pexels.com/photos/5137987/pexels-photo-5137987.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: 'malta',
      name: language === 'tr' ? 'Malta' :
            language === 'pt' ? 'Malta' :
            'Malta',
      flag: '🇲🇹',
      setupTime: language === 'tr' ? '2-3 hafta' :
                 language === 'pt' ? '2-3 semanas' :
                 '2-3 weeks',
      taxAdvantages: language === 'tr' ? 'AB üyeliği ile %5 efektif vergi oranı' :
                     language === 'pt' ? '5% taxa efetiva com adesão à UE' :
                     '5% effective tax rate with EU membership',
      compliance: language === 'tr' ? 'Yıllık beyanname, denetim (ciro >700K€)' :
                  language === 'pt' ? 'Declaração anual, auditoria (faturamento >700K€)' :
                  'Annual return, audit (turnover >€700K)',
      image: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: language === 'tr' ? 'Offshore şirket kurmak yasal mı?' :
                language === 'pt' ? 'É legal formar uma empresa offshore?' :
                'Is it legal to form an offshore company?',
      answer: language === 'tr' ? 'Evet, offshore şirket kurmak tamamen yasaldır. Vergi optimizasyonu için yasal yolları kullanmak her işletmenin hakkıdır. Önemli olan tüm yasal yükümlülükleri yerine getirmek ve şeffaf olmaktır.' :
              language === 'pt' ? 'Sim, formar uma empresa offshore é completamente legal. Usar métodos legais para otimização fiscal é direito de qualquer empresa. O importante é cumprir todas as obrigações legais e ser transparente.' :
              'Yes, forming an offshore company is completely legal. Using legal methods for tax optimization is every business\'s right. The key is to fulfill all legal obligations and be transparent.'
    },
    {
      question: language === 'tr' ? 'Yıllık raporlama gereksinimleri nelerdir?' :
                language === 'pt' ? 'Quais são os requisitos de relatórios anuais?' :
                'What are the annual reporting requirements?',
      answer: language === 'tr' ? 'Her ülkenin kendine özgü raporlama gereksinimleri vardır. Genellikle yıllık mali tablo, vergi beyannamesi ve şirket kayıtlarının güncellenmesi gerekir. Uzmanlarımız tüm bu süreçleri yönetir.' :
              language === 'pt' ? 'Cada país tem seus próprios requisitos de relatórios. Geralmente são necessárias demonstrações financeiras anuais, declarações fiscais e atualizações de registros da empresa. Nossos especialistas gerenciam todos esses processos.' :
              'Each country has its own reporting requirements. Generally, annual financial statements, tax returns, and company record updates are required. Our experts manage all these processes.'
    },
    {
      question: language === 'tr' ? 'Banka hesabı açmak ne kadar sürer?' :
                language === 'pt' ? 'Quanto tempo leva para abrir uma conta bancária?' :
                'How long does it take to open a bank account?',
      answer: language === 'tr' ? 'Banka hesabı açma süresi ülkeye ve banka türüne göre değişir. Dijital bankalar 1-3 gün, geleneksel bankalar 2-4 hafta sürebilir. Belgeleriniz hazır olduğunda süreci hızlandırabiliriz.' :
              language === 'pt' ? 'O tempo para abrir uma conta bancária varia por país e tipo de banco. Bancos digitais levam 1-3 dias, bancos tradicionais podem levar 2-4 semanas. Podemos acelerar o processo quando seus documentos estiverem prontos.' :
              'Bank account opening time varies by country and bank type. Digital banks take 1-3 days, traditional banks may take 2-4 weeks. We can speed up the process when your documents are ready.'
    },
    {
      question: language === 'tr' ? 'Uyumluluk yükümlülüklerim nelerdir?' :
                language === 'pt' ? 'Quais são minhas obrigações de conformidade?' :
                'What are my compliance obligations?',
      answer: language === 'tr' ? 'Uyumluluk yükümlülükleri şirketinizin bulunduğu ülkeye göre değişir. Genellikle vergi beyannameleri, yıllık raporlar, kayıt güncellemeleri ve yasal temsilci atanması gerekir. AI sistemimiz tüm son tarihleri takip eder.' :
              language === 'pt' ? 'As obrigações de conformidade variam de acordo com o país onde sua empresa está localizada. Geralmente são necessárias declarações fiscais, relatórios anuais, atualizações de registros e nomeação de representante legal. Nosso sistema de IA rastreia todos os prazos.' :
              'Compliance obligations vary according to the country where your company is located. Generally, tax returns, annual reports, record updates, and legal representative appointment are required. Our AI system tracks all deadlines.'
    },
    {
      question: language === 'tr' ? 'Kurulduktan sonra yargı yetkisini değiştirebilir miyim?' :
                language === 'pt' ? 'Posso mudar de jurisdição após a formação?' :
                'Can I change jurisdiction after formation?',
      answer: language === 'tr' ? 'Evet, şirketinizi başka bir ülkeye taşıyabilirsiniz ancak bu karmaşık bir süreçtir. Yeni ülkede yeniden kuruluş veya domisil değişikliği gerekebilir. Bu durumda uzmanlarımızla görüşmenizi öneririz.' :
              language === 'pt' ? 'Sim, você pode mover sua empresa para outro país, mas é um processo complexo. Pode ser necessária reincorporação ou mudança de domicílio no novo país. Neste caso, recomendamos consultar nossos especialistas.' :
              'Yes, you can move your company to another country, but it\'s a complex process. Re-incorporation or domicile change in the new country may be required. In this case, we recommend consulting with our experts.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-6">
                <Building2 className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  {language === 'tr' ? 'Küresel İş Kurulumu' :
                   language === 'pt' ? 'Configuração Global de Negócios' :
                   'Global Business Setup'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {currentService.heroTitle}
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {currentService.heroDesc}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                  {language === 'tr' ? 'Ücretsiz Danışmanlık Alın' :
                   language === 'pt' ? 'Obtenha Consultoria Gratuita' :
                   'Get Free Consultation'}
                </Button>
                <Link to="/countries">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                    {language === 'tr' ? 'Ülkeleri Keşfedin' :
                     language === 'pt' ? 'Explorar Países' :
                     'Explore Countries'}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Global business formation"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'tr' ? 'Sunduğumuz Hizmetler' :
               language === 'pt' ? 'O Que Oferecemos' :
               'What We Offer'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'tr' ? 'Şirket kuruluşundan büyümeye kadar tüm süreçte yanınızdayız. 8 ana hizmet alanımızla işinizi küresel pazarlara taşıyoruz.' :
               language === 'pt' ? 'Estamos com você em todo o processo, desde a formação da empresa até o crescimento. Levamos seu negócio aos mercados globais com nossas 8 principais áreas de serviço.' :
               'We\'re with you throughout the entire process from company formation to growth. We take your business to global markets with our 8 main service areas.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} hover className="h-full bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl border border-slate-700">
                <Card.Body className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-3 p-4">
                    {service.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed p-4">
                    {service.description}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'tr' ? 'Neden Bizi Seçmelisiniz?' :
               language === 'pt' ? 'Por Que Nos Escolher?' :
               'Why Choose Us?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'tr' ? 'Küresel deneyim, yerel uzmanlık ve AI destekli teknoloji ile fark yaratıyoruz.' :
               language === 'pt' ? 'Fazemos a diferença com experiência global, expertise local e tecnologia com IA.' :
               'We make the difference with global experience, local expertise, and AI-powered technology.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advantages.map((advantage, index) => (
              <Card key={index} hover className="h-full">
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <advantage.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {advantage.description}
                      </p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{advantage.stats}</div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'tr' ? 'Nasıl Çalışır?' :
               language === 'pt' ? 'Como Funciona?' :
               'How It Works?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'tr' ? '4 basit adımda şirketinizi kurun ve 14 gün içinde işe başlayın.' :
               language === 'pt' ? 'Forme sua empresa em 4 passos simples e comece a operar em 14 dias.' :
               'Form your company in 4 simple steps and start operating within 14 days.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 to-transparent z-0"></div>
                )}
                
                <Card hover className="relative z-10 h-full">
                  <Card.Body className="text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {step.description}
                    </p>
                    
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <div className="text-sm font-medium text-blue-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {step.duration}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {language === 'tr' ? 'Popüler Yargı Yetkileri' :
               language === 'pt' ? 'Jurisdições Populares' :
               'All Available Countries'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'tr' ? 'En çok tercih edilen ülkeler ve avantajları.' :
               language === 'pt' ? 'Países mais preferidos e suas vantagens.' :
               'Explore all available jurisdictions for your business formation.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {countries.map((country, index) => (
              <Link key={index} to={`/countries/${country.id}`} className="group">
                <Card hover className="h-full transition-all duration-300 group-hover:shadow-lg">
                  <div className="h-20 overflow-hidden rounded-t-xl">
                    <img 
                      src={country.image} 
                      alt={country.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <Card.Body className="p-3">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <span className="text-lg">{country.flag}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 text-center mb-2 line-clamp-2">
                      {country.name}
                    </h3>
                    
                    <div className="text-center">
                      <div className="text-xs font-medium text-blue-600 mb-1">{country.setupTime}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{country.taxAdvantages}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            ))}
            
            {/* Additional countries */}
            <Link to="/countries/panama" className="group">
              <Card hover className="h-full transition-all duration-300 group-hover:shadow-lg">
                <div className="h-20 overflow-hidden rounded-t-xl">
                  <img 
                    src="https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Panama"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <Card.Body className="p-3">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <span className="text-lg">🇵🇦</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 text-center mb-2">
                    {language === 'tr' ? 'Panama' : language === 'pt' ? 'Panamá' : 'Panama'}
                  </h3>
                  
                  <div className="text-center">
                    <div className="text-xs font-medium text-blue-600 mb-1">
                      {language === 'tr' ? '2-4 hafta' : language === 'pt' ? '2-4 semanas' : '2-4 weeks'}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {language === 'tr' ? 'Teritoryal vergi sistemi' : 
                       language === 'pt' ? 'Sistema fiscal territorial' : 
                       'Territorial tax system'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
            
            <Link to="/countries/portugal" className="group">
              <Card hover className="h-full">
                <div className="h-20 overflow-hidden rounded-t-xl">
                  <img 
                    src="https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Portugal"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <Card.Body className="p-3">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <span className="text-lg">🇵🇹</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 text-center mb-2">
                    {language === 'tr' ? 'Portekiz' : language === 'pt' ? 'Portugal' : 'Portugal'}
                  </h3>
                  
                  <div className="text-center">
                    <div className="text-xs font-medium text-blue-600 mb-1">
                      {language === 'tr' ? '3-6 hafta' : language === 'pt' ? '3-6 semanas' : '3-6 weeks'}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {language === 'tr' ? 'Golden Visa programı' : 
                       language === 'pt' ? 'Programa Golden Visa' : 
                       'Golden Visa program'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
            
            <Link to="/countries/usa" className="group">
              <Card hover className="h-full">
                <div className="h-20 overflow-hidden rounded-t-xl">
                  <img 
                    src="https://images.pexels.com/photos/1975844/pexels-photo-1975844.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="USA"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <Card.Body className="p-3">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <span className="text-lg">🇺🇸</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 text-center mb-2">
                    {language === 'tr' ? 'Amerika Birleşik Devletleri' : 
                     language === 'pt' ? 'Estados Unidos' : 
                     'United States'}
                  </h3>
                  
                  <div className="text-center">
                    <div className="text-xs font-medium text-blue-600 mb-1">
                      {language === 'tr' ? '1-2 hafta' : language === 'pt' ? '1-2 semanas' : '1-2 weeks'}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {language === 'tr' ? 'Dünyanın en büyük pazarı' : 
                       language === 'pt' ? 'Maior mercado do mundo' : 
                       'World\'s largest market'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
            
            <Link to="/countries/switzerland" className="group">
              <Card hover className="h-full">
                <div className="h-20 overflow-hidden rounded-t-xl">
                  <img 
                    src="https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Switzerland"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                  
                <Card.Body className="p-3">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <span className="text-lg">🇨🇭</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 text-center mb-2">
                    {language === 'tr' ? 'İsviçre' : 
                     language === 'pt' ? 'Suíça' : 
                     'Switzerland'}
                  </h3>
                  
                  <div className="text-center">
                    <div className="text-xs font-medium text-blue-600 mb-1">
                      {language === 'tr' ? '2-4 hafta' : language === 'pt' ? '2-4 semanas' : '2-4 weeks'}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {language === 'tr' ? 'Politik istikrar ve bankacılık' : 
                       language === 'pt' ? 'Estabilidade política e bancária' : 
                       'Political stability & banking'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
            
            <Link to="/countries/singapore" className="group">
              <Card hover className="h-full">
                <div className="h-20 overflow-hidden rounded-t-xl">
                  <img 
                    src="https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Singapore"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <Card.Body className="p-3">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <span className="text-lg">🇸🇬</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 text-center mb-2">
                    {language === 'tr' ? 'Singapur' : 
                     language === 'pt' ? 'Singapura' : 
                     'Singapore'}
                  </h3>
                  
                  <div className="text-center">
                    <div className="text-xs font-medium text-blue-600 mb-1">
                      {language === 'tr' ? '2-3 hafta' : language === 'pt' ? '2-3 semanas' : '2-3 weeks'}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {language === 'tr' ? 'Asya pazarlarına geçit' : 
                       language === 'pt' ? 'Portal para mercados asiáticos' : 
                       'Gateway to Asian markets'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
            
            <Link to="/countries/montenegro" className="group">
              <Card hover className="h-full">
                <div className="h-20 overflow-hidden rounded-t-xl">
                  <img 
                    src="https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt="Montenegro"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                <Card.Body className="p-3">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    <span className="text-lg">🇲🇪</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 text-center mb-2">
                    {language === 'tr' ? 'Karadağ' : 
                     language === 'pt' ? 'Montenegro' : 
                     'Montenegro'}
                  </h3>
                  
                  <div className="text-center">
                    <div className="text-xs font-medium text-blue-600 mb-1">
                      {language === 'tr' ? '3-6 ay' : language === 'pt' ? '3-6 meses' : '3-6 months'}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {language === 'tr' ? 'Yatırımla vatandaşlık' : 
                       language === 'pt' ? 'Cidadania por investimento' : 
                       'Citizenship by investment'}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/countries">
              <Button variant="outline" icon={Globe} iconPosition="left">
                {language === 'tr' ? 'Tüm Ülkeleri Görün' :
                 language === 'pt' ? 'Ver Todos os Países' :
                 'View All Countries'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'tr' ? 'Sıkça Sorulan Sorular' :
               language === 'pt' ? 'Perguntas Frequentes' :
               'Frequently Asked Questions'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'tr' ? 'Şirket kuruluşu hakkında merak ettikleriniz.' :
               language === 'pt' ? 'Suas dúvidas sobre formação de empresas.' :
               'Your questions about company formation.'}
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <Card.Body>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'tr' ? 'Şirketinizi 3 Adımda Kurun' :
             language === 'pt' ? 'Forme Sua Empresa em 3 Passos' :
             'Form Your Company in 3 Steps'}
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            {language === 'tr' ? 'Küresel pazarlara açılmak için bugün başlayın.' :
             language === 'pt' ? 'Comece hoje para se abrir aos mercados globais.' :
             'Start today to open up to global markets.'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'tr' ? 'Ülkenizi Seçin' :
                 language === 'pt' ? 'Escolha Seu País' :
                 'Choose Your Country'}
              </h3>
              <p className="text-blue-100 text-sm">
                {language === 'tr' ? 'AI Oracle ile en uygun yargı yetkisini bulun' :
                 language === 'pt' ? 'Encontre a jurisdição mais adequada com AI Oracle' :
                 'Find the most suitable jurisdiction with AI Oracle'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'tr' ? 'Ücretsiz Danışmanlık Alın' :
                 language === 'pt' ? 'Obtenha Consultoria Gratuita' :
                 'Get Free Consultation'}
              </h3>
              <p className="text-blue-100 text-sm">
                {language === 'tr' ? 'Yerel uzmanımızla detaylı görüşme yapın' :
                 language === 'pt' ? 'Tenha uma reunião detalhada com nosso especialista local' :
                 'Have a detailed meeting with our local expert'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {language === 'tr' ? '14 Günde Kuruluş' :
                 language === 'pt' ? 'Incorporação em 14 Dias' :
                 'Incorporate in 14 Days'}
              </h3>
              <p className="text-blue-100 text-sm">
                {language === 'tr' ? 'Tüm işlemler tamamlanır, işe başlarsınız' :
                 language === 'pt' ? 'Todos os procedimentos são concluídos, você começa a operar' :
                 'All procedures completed, you start operating'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" icon={MessageCircle} iconPosition="left">
              {language === 'tr' ? 'Ücretsiz Danışmanlık Başlat' :
               language === 'pt' ? 'Iniciar Consultoria Gratuita' :
               'Start Free Consultation'}
            </Button>
            <Link to="/countries">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" icon={Globe} iconPosition="left">
                {language === 'tr' ? 'Ülkeleri Keşfet' :
                 language === 'pt' ? 'Explorar Países' :
                 'Explore Countries'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;