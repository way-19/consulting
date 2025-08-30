import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building, Shield, Globe, Banknote, Users } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const BankingSolutionsPage = () => {
  const { t, language } = useLanguage();

  const content = {
    en: {
      heroTitle: 'Global Banking Solutions – Secure, Compliant, and Efficient',
      heroDescription: 'Access premium corporate and personal banking worldwide. Consulting19 helps you connect with leading financial centers, ensuring compliance, multi-currency solutions, and advanced digital banking services.',
      whatWeOfferTitle: 'What We Offer',
      whatWeOfferDescription: 'Complete banking solutions for international businesses and individuals',
      processTitle: 'Our Banking Process',
      processDescription: 'Streamlined process to open accounts in the world\'s leading banks',
      jurisdictionsTitle: 'Premier Banking Jurisdictions',
      jurisdictionsDescription: 'Access world-class banking services in leading financial centers',
      ctaTitle: 'Ready to Access Global Banking?',
      ctaDescription: 'Connect with premier financial institutions worldwide',
      services: [
        {
          title: 'Corporate Account Opening',
          description: 'Professional corporate account opening services in premier financial centers worldwide. Our banking specialists facilitate relationships with top-tier banks, ensuring your business gains access to comprehensive corporate banking solutions including business checking, savings, and credit facilities.'
        },
        {
          title: 'Multi-Currency Accounts',
          description: 'Advanced multi-currency banking solutions that enable your business to hold, manage, and transact in multiple currencies with competitive exchange rates. These accounts provide seamless international payment processing, currency hedging options, and real-time foreign exchange capabilities.'
        },
        {
          title: 'Private Banking',
          description: 'Exclusive private banking services tailored for high-net-worth individuals and successful entrepreneurs seeking personalized wealth management solutions. Our private banking partnerships provide access to dedicated relationship managers, bespoke investment products, and sophisticated financial planning services.'
        },
        {
          title: 'Trade Finance',
          description: 'Comprehensive trade finance solutions including letters of credit, bank guarantees, and international trade financing facilities. Our trade finance specialists help businesses secure working capital, manage payment risks, and facilitate smooth international transactions.'
        },
        {
          title: 'Digital Banking Solutions',
          description: 'Cutting-edge digital banking solutions designed for modern businesses and digital entrepreneurs. Access innovative fintech platforms offering real-time payments, API integrations, automated accounting connections, and mobile-first banking experiences.'
        },
        {
          title: 'Investment Banking',
          description: 'Professional investment banking services including capital raising, mergers and acquisitions advisory, and strategic financial consulting. Our investment banking partners provide access to institutional investors, debt financing solutions, and sophisticated financial structuring services.'
        }
      ],
      processSteps: [
        {
          title: 'Banking Requirements Analysis',
          description: 'Identify your business needs, compliance obligations, and preferred banking jurisdictions'
        },
        {
          title: 'Bank Selection',
          description: 'Choose the optimal bank based on jurisdiction, product features, and your operational model'
        },
        {
          title: 'Account Opening',
          description: 'Streamline documentation and due diligence processes for smooth onboarding'
        },
        {
          title: 'Banking Setup',
          description: 'Enable online banking, payment systems, and ongoing support for global operations'
        }
      ]
    },
    tr: {
      heroTitle: 'Küresel Bankacılık Çözümleri – Güvenli, Uyumlu ve Verimli',
      heroDescription: 'Dünya çapında premium kurumsal ve kişisel bankacılığa erişim. Consulting19 uyumluluk, çok para birimli çözümler ve gelişmiş dijital bankacılık hizmetleri sağlayarak önde gelen finansal merkezlerle bağlantı kurmanıza yardımcı olur.',
      whatWeOfferTitle: 'Neler Sunuyoruz',
      whatWeOfferDescription: 'Uluslararası işletmeler ve bireyler için tam bankacılık çözümleri',
      processTitle: 'Bankacılık Sürecimiz',
      processDescription: 'Dünyanın önde gelen bankalarında hesap açmak için kolaylaştırılmış süreç',
      jurisdictionsTitle: 'Önde Gelen Bankacılık Yargı Alanları',
      jurisdictionsDescription: 'Önde gelen finansal merkezlerde dünya standartlarında bankacılık hizmetlerine erişim',
      ctaTitle: 'Küresel Bankacılığa Erişmeye Hazır mısınız?',
      ctaDescription: 'Dünya çapında önde gelen finansal kurumlarla bağlantı kurun',
      services: [
        {
          title: 'Kurumsal Hesap Açma',
          description: 'Dünya çapında önde gelen finansal merkezlerde profesyonel kurumsal hesap açma hizmetleri. Bankacılık uzmanlarımız üst düzey bankalarla ilişkileri kolaylaştırır, işinizin iş çek, tasarruf ve kredi olanakları dahil kapsamlı kurumsal bankacılık çözümlerine erişim sağlamasını garanti eder.'
        },
        {
          title: 'Çok Para Birimli Hesaplar',
          description: 'İşinizin rekabetçi döviz kurları ile birden fazla para biriminde tutma, yönetme ve işlem yapmasını sağlayan gelişmiş çok para birimli bankacılık çözümleri. Bu hesaplar sorunsuz uluslararası ödeme işleme, para birimi riskten korunma seçenekleri ve gerçek zamanlı döviz yetenekleri sağlar.'
        },
        {
          title: 'Özel Bankacılık',
          description: 'Kişiselleştirilmiş servet yönetimi çözümleri arayan yüksek net değerli bireyler ve başarılı girişimciler için özel bankacılık hizmetleri. Özel bankacılık ortaklıklarımız özel ilişki yöneticileri, özel yatırım ürünleri ve sofistike finansal planlama hizmetlerine erişim sağlar.'
        },
        {
          title: 'Ticaret Finansmanı',
          description: 'Akreditifler, banka garantileri ve uluslararası ticaret finansman olanakları dahil kapsamlı ticaret finansmanı çözümleri. Ticaret finansmanı uzmanlarımız işletmelerin işletme sermayesi güvence altına almasına, ödeme risklerini yönetmesine ve sorunsuz uluslararası işlemleri kolaylaştırmasına yardımcı olur.'
        },
        {
          title: 'Dijital Bankacılık Çözümleri',
          description: 'Modern işletmeler ve dijital girişimciler için tasarlanmış son teknoloji dijital bankacılık çözümleri. Gerçek zamanlı ödemeler, API entegrasyonları, otomatik muhasebe bağlantıları ve mobil öncelikli bankacılık deneyimleri sunan yenilikçi fintech platformlarına erişim.'
        },
        {
          title: 'Yatırım Bankacılığı',
          description: 'Sermaye artırımı, birleşme ve satın alma danışmanlığı ve stratejik finansal danışmanlık dahil profesyonel yatırım bankacılığı hizmetleri. Yatırım bankacılığı ortaklarımız kurumsal yatırımcılara erişim, borç finansman çözümleri ve sofistike finansal yapılandırma hizmetleri sağlar.'
        }
      ],
      processSteps: [
        {
          title: 'Bankacılık Gereksinimleri Analizi',
          description: 'İş ihtiyaçlarınızı, uyumluluk yükümlülüklerinizi ve tercih edilen bankacılık yargı alanlarınızı belirleyin'
        },
        {
          title: 'Banka Seçimi',
          description: 'Yargı alanı, ürün özellikleri ve operasyonel modelinize dayalı optimal bankayı seçin'
        },
        {
          title: 'Hesap Açma',
          description: 'Sorunsuz işe alım için dokümantasyon ve durum tespiti süreçlerini kolaylaştırın'
        },
        {
          title: 'Bankacılık Kurulumu',
          description: 'Küresel operasyonlar için online bankacılık, ödeme sistemleri ve devam eden desteği etkinleştirin'
        }
      ]
    },
    pt: {
      heroTitle: 'Soluções Bancárias Globais – Seguras, Compatíveis e Eficientes',
      heroDescription: 'Acesse bancos corporativos e pessoais premium mundialmente. Consulting19 ajuda você a se conectar com centros financeiros líderes, garantindo conformidade, soluções multi-moeda e serviços bancários digitais avançados.',
      whatWeOfferTitle: 'O Que Oferecemos',
      whatWeOfferDescription: 'Soluções bancárias completas para empresas e indivíduos internacionais',
      processTitle: 'Nosso Processo Bancário',
      processDescription: 'Processo simplificado para abrir contas nos bancos líderes do mundo',
      jurisdictionsTitle: 'Principais Jurisdições Bancárias',
      jurisdictionsDescription: 'Acesse serviços bancários de classe mundial em centros financeiros líderes',
      ctaTitle: 'Pronto para Acessar Bancos Globais?',
      ctaDescription: 'Conecte-se com instituições financeiras premium mundialmente',
      services: [
        {
          title: 'Abertura de Conta Corporativa',
          description: 'Serviços profissionais de abertura de conta corporativa em centros financeiros premium mundialmente. Nossos especialistas bancários facilitam relacionamentos com bancos de primeira linha, garantindo que seu negócio ganhe acesso a soluções bancárias corporativas abrangentes incluindo conta corrente empresarial, poupança e facilidades de crédito.'
        },
        {
          title: 'Contas Multi-Moeda',
          description: 'Soluções bancárias multi-moeda avançadas que permitem seu negócio manter, gerenciar e transacionar em múltiplas moedas com taxas de câmbio competitivas. Essas contas fornecem processamento de pagamento internacional perfeito, opções de hedge de moeda e capacidades de câmbio em tempo real.'
        },
        {
          title: 'Private Banking',
          description: 'Serviços exclusivos de private banking adaptados para indivíduos de alto patrimônio líquido e empreendedores bem-sucedidos buscando soluções personalizadas de gestão de patrimônio. Nossas parcerias de private banking fornecem acesso a gerentes de relacionamento dedicados, produtos de investimento sob medida e serviços sofisticados de planejamento financeiro.'
        },
        {
          title: 'Financiamento Comercial',
          description: 'Soluções abrangentes de financiamento comercial incluindo cartas de crédito, garantias bancárias e facilidades de financiamento de comércio internacional. Nossos especialistas em financiamento comercial ajudam empresas a garantir capital de giro, gerenciar riscos de pagamento e facilitar transações internacionais suaves.'
        },
        {
          title: 'Soluções Bancárias Digitais',
          description: 'Soluções bancárias digitais de ponta projetadas para empresas modernas e empreendedores digitais. Acesse plataformas fintech inovadoras oferecendo pagamentos em tempo real, integrações API, conexões de contabilidade automatizadas e experiências bancárias mobile-first.'
        },
        {
          title: 'Investment Banking',
          description: 'Serviços profissionais de investment banking incluindo captação de capital, consultoria em fusões e aquisições e consultoria financeira estratégica. Nossos parceiros de investment banking fornecem acesso a investidores institucionais, soluções de financiamento de dívida e serviços sofisticados de estruturação financeira.'
        }
      ],
      processSteps: [
        {
          title: 'Análise de Requisitos Bancários',
          description: 'Identifique suas necessidades empresariais, obrigações de conformidade e jurisdições bancárias preferidas'
        },
        {
          title: 'Seleção de Banco',
          description: 'Escolha o banco ótimo baseado em jurisdição, características do produto e seu modelo operacional'
        },
        {
          title: 'Abertura de Conta',
          description: 'Simplifique documentação e processos de due diligence para integração suave'
        },
        {
          title: 'Configuração Bancária',
          description: 'Habilite banco online, sistemas de pagamento e suporte contínuo para operações globais'
        }
      ]
    }
  };

  const currentContent = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-white rounded-lg rotate-45"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/services">
              <Button variant="ghost" className="text-white hover:bg-white/20" icon={ArrowLeft} iconPosition="left">
                {t('backToServices')}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {currentContent.heroTitle}
              </h1>
              <p className="text-xl text-orange-100 leading-relaxed mb-8">
                {currentContent.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700">
                  {t('scheduleConsultation')}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Banking solutions"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentContent.whatWeOfferTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.whatWeOfferDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentContent.services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-6 h-48 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed line-clamp-4 overflow-hidden">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentContent.processTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.processDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {index === 0 && <CreditCard className="w-6 h-6 text-white" />}
                    {index === 1 && <Building className="w-6 h-6 text-white" />}
                    {index === 2 && <Shield className="w-6 h-6 text-white" />}
                    {index === 3 && <Globe className="w-6 h-6 text-white" />}
                  </div>
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Countries */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentContent.jurisdictionsTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.jurisdictionsDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Switzerland', flag: '🇨🇭', taxRate: 'Premium', highlight: 'World-renowned excellence in private banking and confidentiality' },
              { name: 'UAE', flag: '🇦🇪', taxRate: 'Modern', highlight: 'Fast-growing financial hub with access to Islamic banking solutions' },
              { name: 'Estonia', flag: '🇪🇪', taxRate: 'Digital', highlight: 'Advanced digital banking solutions with EU market access' },
              { name: 'Malta', flag: '🇲🇹', taxRate: 'EU Hub', highlight: 'Strategic EU banking center with blockchain-friendly regulations' }
            ].map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className="bg-orange-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-orange-900">{country.taxRate}</div>
                    <div className="text-xs text-orange-700">{country.highlight}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('learnMore')}
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{currentContent.ctaTitle}</h2>
          <p className="text-xl text-orange-100 mb-8">
            {currentContent.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              {t('scheduleConsultation')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              {t('learnMore')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BankingSolutionsPage;