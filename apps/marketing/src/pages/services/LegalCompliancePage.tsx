import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, Shield, CheckCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const LegalCompliancePage: React.FC = () => {
  const { t, language } = useLanguage();

  const content = {
    en: {
      heroTitle: 'Legal Compliance Services – Stay Compliant, Stay Competitive',
      heroDescription: 'Ensure full legal compliance across all jurisdictions. Our experts help you navigate complex regulations, maintain good standing, and stay audit-ready in every country you operate.',
      whatWeOfferTitle: 'What We Offer',
      whatWeOfferDescription: 'Comprehensive legal compliance services for international businesses',
      processTitle: 'Our Legal Compliance Process',
      processDescription: 'Systematic approach to ensuring comprehensive legal compliance across all jurisdictions',
      jurisdictionsTitle: 'Leading Legal Jurisdictions',
      jurisdictionsDescription: 'Countries offering the most robust and business-friendly legal frameworks for international business compliance',
      ctaTitle: 'Ready to Ensure Compliance?',
      ctaDescription: 'Get expert legal guidance for your international business operations',
      services: [
        {
          title: 'Corporate Governance',
          description: 'Establish robust corporate governance frameworks including board resolutions, shareholder agreements, and compliance policies. Our services ensure your business meets regulatory standards while optimizing decision-making processes and protecting stakeholders across multiple jurisdictions.'
        },
        {
          title: 'Regulatory Compliance',
          description: 'Navigate industry-specific regulatory requirements across finance, healthcare, technology, and other sectors. Our experts provide comprehensive audits, policy development, and monitoring services to ensure your business stays current with evolving regulations and maintains proper licensing.'
        },
        {
          title: 'Data Protection Compliance',
          description: 'Achieve full GDPR compliance, CCPA adherence, and comprehensive data privacy regulation compliance across global jurisdictions. Our specialists implement privacy policies, conduct audits, and establish secure data handling procedures to protect customer information and avoid regulatory fines.'
        },
        {
          title: 'Anti-Money Laundering (AML/KYC)',
          description: 'Implement comprehensive AML KYC procedures and compliance programs that meet international standards. Our specialists design risk-based frameworks, conduct due diligence training, and establish monitoring systems to prevent financial crimes and protect against reputational risks.'
        },
        {
          title: 'Contract Management',
          description: 'Professional legal contract drafting, review, and management systems for international business operations. Our services include agreement templates, compliance reviews, and automated lifecycle management to reduce legal risks and ensure contractual compliance across jurisdictions.'
        },
        {
          title: 'Intellectual Property Protection',
          description: 'Comprehensive intellectual property protection strategies including patent filing, trademark registration, and copyright protection across global markets. Our IP specialists help secure valuable assets, conduct audits, and develop protection strategies for international expansion.'
        }
      ],
      processSteps: [
        {
          title: 'Compliance Assessment',
          description: 'Evaluate your current status, risks, and gaps across jurisdictions with a documented baseline'
        },
        {
          title: 'Regulatory Mapping',
          description: 'Identify all applicable laws and obligations, including sector-specific rules and filing deadlines'
        },
        {
          title: 'Implementation',
          description: 'Deploy policies, procedures, and documentation systems; align teams with clear workflows'
        },
        {
          title: 'Ongoing Monitoring',
          description: 'Track regulatory changes, renewals, and audits with scheduled reviews and automated reminders'
        }
      ]
    },
    tr: {
      heroTitle: 'Yasal Uyumluluk Hizmetleri – Uyumlu Kalın, Rekabetçi Kalın',
      heroDescription: 'Tüm yargı alanlarında tam yasal uyumluluk sağlayın. Uzmanlarımız karmaşık düzenlemelerde gezinmenize, iyi durumda kalmanıza ve faaliyet gösterdiğiniz her ülkede denetim hazır kalmanıza yardımcı olur.',
      whatWeOfferTitle: 'Neler Sunuyoruz',
      whatWeOfferDescription: 'Uluslararası işletmeler için kapsamlı yasal uyumluluk hizmetleri',
      processTitle: 'Yasal Uyumluluk Sürecimiz',
      processDescription: 'Tüm yargı alanlarında kapsamlı yasal uyumluluk sağlamak için sistematik yaklaşım',
      jurisdictionsTitle: 'Önde Gelen Yasal Yargı Alanları',
      jurisdictionsDescription: 'Uluslararası iş uyumluluğu için en sağlam ve iş dostu yasal çerçeveler sunan ülkeler',
      ctaTitle: 'Uyumluluk Sağlamaya Hazır mısınız?',
      ctaDescription: 'Uluslararası iş operasyonlarınız için uzman yasal rehberlik alın',
      services: [
        {
          title: 'Kurumsal Yönetişim',
          description: 'Yönetim kurulu kararları, hissedar anlaşmaları ve uyumluluk politikaları dahil sağlam kurumsal yönetişim çerçeveleri kurun. Hizmetlerimiz işinizin düzenleyici standartları karşılamasını sağlarken karar verme süreçlerini optimize eder ve birden fazla yargı alanında paydaşları korur.'
        },
        {
          title: 'Düzenleyici Uyumluluk',
          description: 'Finans, sağlık, teknoloji ve diğer sektörlerde sektöre özgü düzenleyici gereksinimlerde gezinin. Uzmanlarımız işinizin gelişen düzenlemelerle güncel kalmasını ve uygun lisanslamayı sürdürmesini sağlamak için kapsamlı denetimler, politika geliştirme ve izleme hizmetleri sağlar.'
        },
        {
          title: 'Veri Koruma Uyumluluğu',
          description: 'Küresel yargı alanlarında tam GDPR uyumluluğu, CCPA bağlılığı ve kapsamlı veri gizliliği düzenlemesi uyumluluğu elde edin. Uzmanlarımız müşteri bilgilerini korumak ve düzenleyici cezalardan kaçınmak için gizlilik politikaları uygular, denetimler yapar ve güvenli veri işleme prosedürleri kurar.'
        },
        {
          title: 'Kara Para Aklamayı Önleme (AML/KYC)',
          description: 'Uluslararası standartları karşılayan kapsamlı AML KYC prosedürleri ve uyumluluk programları uygulayın. Uzmanlarımız finansal suçları önlemek ve itibar risklerine karşı korumak için risk tabanlı çerçeveler tasarlar, durum tespiti eğitimi verir ve izleme sistemleri kurar.'
        },
        {
          title: 'Sözleşme Yönetimi',
          description: 'Uluslararası iş operasyonları için profesyonel yasal sözleşme taslağı, inceleme ve yönetim sistemleri. Hizmetlerimiz yasal riskleri azaltmak ve yargı alanları boyunca sözleşmeli uyumluluk sağlamak için anlaşma şablonları, uyumluluk incelemeleri ve otomatik yaşam döngüsü yönetimi içerir.'
        },
        {
          title: 'Fikri Mülkiyet Korunması',
          description: 'Küresel pazarlarda patent dosyalama, marka tescili ve telif hakkı korunması dahil kapsamlı fikri mülkiyet koruma stratejileri. Fikri mülkiyet uzmanlarımız değerli varlıkları güvence altına almaya, denetimler yapmaya ve uluslararası genişleme için koruma stratejileri geliştirmeye yardımcı olur.'
        }
      ],
      processSteps: [
        {
          title: 'Uyumluluk Değerlendirmesi',
          description: 'Belgelenmiş bir temel ile yargı alanları boyunca mevcut durumunuzu, risklerinizi ve boşluklarınızı değerlendirin'
        },
        {
          title: 'Düzenleyici Haritalama',
          description: 'Sektöre özgü kurallar ve dosyalama son tarihleri dahil tüm geçerli yasaları ve yükümlülükleri belirleyin'
        },
        {
          title: 'Uygulama',
          description: 'Politikalar, prosedürler ve dokümantasyon sistemleri dağıtın; ekipleri net iş akışlarıyla hizalayın'
        },
        {
          title: 'Devam Eden İzleme',
          description: 'Planlı incelemeler ve otomatik hatırlatmalarla düzenleyici değişiklikleri, yenilemeleri ve denetimleri takip edin'
        }
      ]
    },
    pt: {
      heroTitle: 'Serviços de Conformidade Legal – Mantenha-se Compatível, Mantenha-se Competitivo',
      heroDescription: 'Garanta conformidade legal completa em todas as jurisdições. Nossos especialistas ajudam você a navegar regulamentações complexas, manter boa situação e permanecer pronto para auditoria em todos os países onde opera.',
      whatWeOfferTitle: 'O Que Oferecemos',
      whatWeOfferDescription: 'Serviços abrangentes de conformidade legal para empresas internacionais',
      processTitle: 'Nosso Processo de Conformidade Legal',
      processDescription: 'Abordagem sistemática para garantir conformidade legal abrangente em todas as jurisdições',
      jurisdictionsTitle: 'Principais Jurisdições Legais',
      jurisdictionsDescription: 'Países oferecendo as estruturas legais mais robustas e favoráveis aos negócios para conformidade empresarial internacional',
      ctaTitle: 'Pronto para Garantir Conformidade?',
      ctaDescription: 'Obtenha orientação legal especializada para suas operações empresariais internacionais',
      services: [
        {
          title: 'Governança Corporativa',
          description: 'Estabeleça estruturas robustas de governança corporativa incluindo resoluções do conselho, acordos de acionistas e políticas de conformidade. Nossos serviços garantem que seu negócio atenda padrões regulatórios enquanto otimiza processos de tomada de decisão e protege stakeholders em múltiplas jurisdições.'
        },
        {
          title: 'Conformidade Regulatória',
          description: 'Navegue requisitos regulatórios específicos do setor em finanças, saúde, tecnologia e outros setores. Nossos especialistas fornecem auditorias abrangentes, desenvolvimento de políticas e serviços de monitoramento para garantir que seu negócio permaneça atualizado com regulamentações em evolução e mantenha licenciamento adequado.'
        },
        {
          title: 'Conformidade de Proteção de Dados',
          description: 'Alcance conformidade completa GDPR, aderência CCPA e conformidade abrangente de regulamentação de privacidade de dados em jurisdições globais. Nossos especialistas implementam políticas de privacidade, conduzem auditorias e estabelecem procedimentos seguros de manuseio de dados para proteger informações do cliente e evitar multas regulatórias.'
        },
        {
          title: 'Anti-Lavagem de Dinheiro (AML/KYC)',
          description: 'Implemente procedimentos abrangentes AML KYC e programas de conformidade que atendem padrões internacionais. Nossos especialistas projetam estruturas baseadas em risco, conduzem treinamento de due diligence e estabelecem sistemas de monitoramento para prevenir crimes financeiros e proteger contra riscos reputacionais.'
        },
        {
          title: 'Gestão de Contratos',
          description: 'Sistemas profissionais de redação, revisão e gestão de contratos legais para operações empresariais internacionais. Nossos serviços incluem modelos de acordo, revisões de conformidade e gestão automatizada de ciclo de vida para reduzir riscos legais e garantir conformidade contratual em jurisdições.'
        },
        {
          title: 'Proteção de Propriedade Intelectual',
          description: 'Estratégias abrangentes de proteção de propriedade intelectual incluindo arquivamento de patentes, registro de marcas e proteção de direitos autorais em mercados globais. Nossos especialistas em PI ajudam a proteger ativos valiosos, conduzir auditorias e desenvolver estratégias de proteção para expansão internacional.'
        }
      ],
      processSteps: [
        {
          title: 'Avaliação de Conformidade',
          description: 'Avalie seu status atual, riscos e lacunas em jurisdições com uma linha de base documentada'
        },
        {
          title: 'Mapeamento Regulatório',
          description: 'Identifique todas as leis e obrigações aplicáveis, incluindo regras específicas do setor e prazos de arquivamento'
        },
        {
          title: 'Implementação',
          description: 'Implante políticas, procedimentos e sistemas de documentação; alinhe equipes com fluxos de trabalho claros'
        },
        {
          title: 'Monitoramento Contínuo',
          description: 'Acompanhe mudanças regulatórias, renovações e auditorias com revisões programadas e lembretes automatizados'
        }
      ]
    }
  };

  const currentContent = content[language] || content.en;

  const processSteps = [
    { title: currentContent.processSteps[0].title, description: currentContent.processSteps[0].description, icon: FileText },
    { title: currentContent.processSteps[1].title, description: currentContent.processSteps[1].description, icon: Scale },
    { title: currentContent.processSteps[2].title, description: currentContent.processSteps[2].description, icon: Shield },
    { title: currentContent.processSteps[3].title, description: currentContent.processSteps[3].description, icon: CheckCircle },
  ];

  const featuredCountries = [
    { name: 'United Arab Emirates', flag: '🇦🇪', tag: 'Free Zones', highlight: 'Modern legal framework with business-friendly free zone regulations', slug: 'united-arab-emirates' },
    { name: 'Estonia', flag: '🇪🇪', tag: 'e-Residency', highlight: 'Advanced digital legal infrastructure with comprehensive EU access', slug: 'estonia' },
    { name: 'Georgia', flag: '🇬🇪', tag: '1% Small Business Tax', highlight: 'Streamlined legal system with minimal bureaucracy and low tax compliance', slug: 'georgia' },
    { name: 'Malta', flag: '🇲🇹', tag: 'EU Hub', highlight: 'Strong EU legal framework with progressive blockchain and fintech regulations', slug: 'malta' },
    { name: 'Panama', flag: '🇵🇦', tag: 'Territorial', highlight: 'Strong privacy protection with territorial legal system and banking secrecy', slug: 'panama' },
    { name: 'Portugal', flag: '🇵🇹', tag: 'EU Access', highlight: 'Comprehensive EU legal compliance with attractive investment immigration programs', slug: 'portugal' },
    { name: 'United States', flag: '🇺🇸', tag: 'Federal System', highlight: 'Robust common law legal framework with strong business protections and privacy', slug: 'united-states' },
    { name: 'Switzerland', flag: '🇨🇭', tag: 'Premium', highlight: 'Political stability with predictable legal system and world-class banking laws', slug: 'switzerland' },
    { name: 'Montenegro', flag: '🇲🇪', tag: 'EU Candidate', highlight: 'Developing legal framework with EU alignment and citizenship investment options', slug: 'montenegro' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/70 rounded-full" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/70 rounded-lg rotate-45" />
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{currentContent.heroTitle}</h1>
              <p className="text-lg md:text-xl text-green-100 leading-relaxed mb-8">
                {currentContent.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/countries?service=legal-compliance">
                  <Button size="lg" className="bg-green-600 text-white hover:bg-green-700">{t('chooseCountry')}</Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  {t('scheduleConsultation')}
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Legal compliance"
                className="rounded-xl shadow-2xl w-full h-[260px] md:h-[360px] object-cover"
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
                <div className="absolute inset-0">
                  <img
                    src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
                </div>
                <div className="relative p-6 h-48 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{service.description}</p>
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
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCountries.map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{country.name}</h3>
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-green-900">{country.tag}</div>
                    <div className="text-xs text-green-700">{country.highlight}</div>
                  </div>
                  <Link to={`/countries/${country.slug}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      {t('learnMore')}
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{currentContent.ctaTitle}</h2>
          <p className="text-xl text-green-100 mb-8">{currentContent.ctaDescription}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/countries?service=legal-compliance">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">{t('chooseCountry')}</Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">{t('scheduleConsultation')}</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalCompliancePage;