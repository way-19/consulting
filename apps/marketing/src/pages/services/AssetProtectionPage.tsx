import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Globe, Briefcase, Users, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';
import { useState } from 'react';

const AssetProtectionPage = () => {
  const { t, language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const content = {
    en: {
      heroTitle: 'Asset Protection Services – Safeguard Your Wealth',
      heroDescription: 'Protect your wealth from legal risks, creditors, and political instability. We design compliant trust, foundation, and holding structures that safeguard assets while maintaining access and control.',
      whatWeOfferTitle: 'What We Offer',
      whatWeOfferDescription: 'Sophisticated asset protection strategies for high-net-worth individuals and businesses',
      processTitle: 'Our Asset Protection Process',
      processDescription: 'Comprehensive approach to protecting your wealth and assets',
      jurisdictionsTitle: 'Premier Asset Protection Jurisdictions',
      jurisdictionsDescription: 'Countries offering the strongest asset protection laws and privacy frameworks',
      faqTitle: 'Frequently Asked Questions',
      faqDescription: 'Common questions about asset protection strategies and offshore structures',
      ctaTitle: 'Ready to Protect Your Assets?',
      ctaDescription: 'Get expert guidance for comprehensive asset protection strategies',
      services: [
        {
          title: 'Offshore Trusts',
          description: 'Establish sophisticated offshore trust structures in premier jurisdictions for maximum asset protection and privacy. Our trust specialists design compliant frameworks that shield wealth from creditors, litigation risks, and political instability while maintaining beneficial ownership control.'
        },
        {
          title: 'Private Foundations',
          description: 'Create private foundation structures for wealth preservation, succession planning, and philanthropic objectives in leading foundation jurisdictions. Our foundation experts establish compliant structures that offer enhanced privacy, asset protection, and flexible governance frameworks.'
        },
        {
          title: 'Holding Companies',
          description: 'Design multi-layered holding company structures for asset isolation, creditor protection, and operational efficiency across multiple jurisdictions. Our holding structure specialists create compliant frameworks that separate business risks, optimize tax efficiency, and provide enhanced privacy protection.'
        },
        {
          title: 'Family Offices',
          description: 'Establish comprehensive family office structures for ultra-high-net-worth families seeking centralized wealth management and governance solutions. Our family office specialists design bespoke frameworks that coordinate investment management, tax planning, estate planning, and family governance across multiple generations.'
        },
        {
          title: 'Succession Planning',
          description: 'Develop comprehensive succession planning strategies and wealth transfer structures that minimize tax liability while ensuring smooth generational transitions. Our succession specialists create compliant frameworks using trusts, foundations, and holding structures to facilitate efficient wealth transfer.'
        },
        {
          title: 'Privacy Solutions',
          description: 'Implement advanced privacy solutions and confidentiality structures for high-profile individuals and sensitive business operations. Our privacy specialists design compliant frameworks that enhance anonymity, protect beneficial ownership information, and shield personal and business activities from public scrutiny.'
        }
      ],
      processSteps: [
        {
          title: 'Asset Assessment',
          description: 'Map your asset portfolio, legal risks, and exposure points across jurisdictions'
        },
        {
          title: 'Protection Strategy',
          description: 'Design trust, foundation, and holding structures tailored to control, access, and succession needs'
        },
        {
          title: 'Structure Implementation',
          description: 'Establish entities, draft deeds and bylaws, implement governance frameworks, and set up banking'
        },
        {
          title: 'Ongoing Management',
          description: 'Handle filings, renewals, monitoring, and maintain audit-ready records for compliance'
        }
      ],
      faqs: [
        {
          question: 'Is offshore asset protection legal?',
          answer: 'Yes—when structured within the law and with proper substance. We follow international compliance standards, beneficial ownership requirements, and reporting obligations to ensure your asset protection structures are compliant, auditable, and defensible. Our approach reduces legal risks while providing legitimate wealth protection through established jurisdictions with strong legal frameworks.'
        },
        {
          question: 'Should I use a trust or foundation structure?',
          answer: 'The choice depends on your jurisdiction, control preferences, and succession goals. Trusts offer flexibility and common law familiarity, while foundations provide corporate-like governance and civil law advantages. We analyze your specific needs, family structure, and objectives to recommend the optimal vehicle for your asset protection and wealth transfer requirements.'
        },
        {
          question: 'Will I lose control of my assets?',
          answer: 'No—properly structured asset protection maintains your practical control while providing legal separation. We design frameworks that preserve your decision-making authority through advisory roles, investment committees, and distribution guidelines. The key is balancing protection benefits with control retention through compliant structures that satisfy both legal requirements and your operational needs.'
        },
        {
          question: 'How effective is creditor protection?',
          answer: 'Effectiveness depends on timing, jurisdiction selection, and structure design. Pre-existing debt or fraudulent transfer risks can limit protection, so early planning is crucial. We evaluate your risk profile, select optimal jurisdictions with strong creditor protection laws, and implement structures that provide maximum legal separation while maintaining compliance with international standards and reporting requirements.'
        },
        {
          question: 'What are the reporting requirements?',
          answer: 'Reporting obligations vary by your tax residency and structure jurisdiction. Most countries require disclosure of foreign trusts, foundations, and controlled entities through various forms and deadlines. We ensure full compliance with CRS, FATCA, and local reporting requirements while maintaining maximum privacy within legal boundaries and providing ongoing compliance monitoring.'
        },
        {
          question: 'How long does asset protection setup take?',
          answer: 'Structure establishment typically takes 4-8 weeks depending on jurisdiction complexity and banking requirements. Simple trust structures can be completed faster, while complex multi-jurisdictional frameworks require additional time for proper documentation and compliance setup. We provide clear timelines and milestone tracking throughout the entire asset protection implementation process.'
        }
      ]
    },
    tr: {
      heroTitle: 'Varlık Koruma Hizmetleri – Servetinizi Koruyun',
      heroDescription: 'Servetinizi yasal risklerden, alacaklılardan ve siyasi istikrarsızlıktan koruyun. Erişim ve kontrolü sürdürürken varlıkları koruyan uyumlu tröst, vakıf ve holding yapıları tasarlıyoruz.',
      whatWeOfferTitle: 'Neler Sunuyoruz',
      whatWeOfferDescription: 'Yüksek net değerli bireyler ve işletmeler için sofistike varlık koruma stratejileri',
      processTitle: 'Varlık Koruma Sürecimiz',
      processDescription: 'Servetinizi ve varlıklarınızı korumak için kapsamlı yaklaşım',
      jurisdictionsTitle: 'Önde Gelen Varlık Koruma Yargı Alanları',
      jurisdictionsDescription: 'En güçlü varlık koruma yasaları ve gizlilik çerçeveleri sunan ülkeler',
      faqTitle: 'Sık Sorulan Sorular',
      faqDescription: 'Varlık koruma stratejileri ve offshore yapılar hakkında yaygın sorular',
      ctaTitle: 'Varlıklarınızı Korumaya Hazır mısınız?',
      ctaDescription: 'Kapsamlı varlık koruma stratejileri için uzman rehberlik alın',
      services: [
        {
          title: 'Offshore Tröstler',
          description: 'Maksimum varlık korunması ve gizlilik için önde gelen yargı alanlarında sofistike offshore tröst yapıları kurun. Tröst uzmanlarımız faydalı mülkiyet kontrolünü sürdürürken serveti alacaklılardan, dava risklerinden ve siyasi istikrarsızlıktan koruyan uyumlu çerçeveler tasarlar.'
        },
        {
          title: 'Özel Vakıflar',
          description: 'Önde gelen vakıf yargı alanlarında servet korunması, veraset planlaması ve hayırseverlik hedefleri için özel vakıf yapıları oluşturun. Vakıf uzmanlarımız gelişmiş gizlilik, varlık korunması ve esnek yönetişim çerçeveleri sunan uyumlu yapılar kurar.'
        },
        {
          title: 'Holding Şirketleri',
          description: 'Birden fazla yargı alanında varlık izolasyonu, alacaklı korunması ve operasyonel verimlilik için çok katmanlı holding şirketi yapıları tasarlayın. Holding yapısı uzmanlarımız iş risklerini ayıran, vergi verimliliğini optimize eden ve gelişmiş gizlilik korunması sağlayan uyumlu çerçeveler oluşturur.'
        },
        {
          title: 'Aile Ofisleri',
          description: 'Merkezi servet yönetimi ve yönetişim çözümleri arayan ultra yüksek net değerli aileler için kapsamlı aile ofisi yapıları kurun. Aile ofisi uzmanlarımız birden fazla nesil boyunca yatırım yönetimi, vergi planlaması, emlak planlaması ve aile yönetişimini koordine eden özel çerçeveler tasarlar.'
        },
        {
          title: 'Veraset Planlaması',
          description: 'Sorunsuz nesil geçişlerini sağlarken vergi yükümlülüğünü minimize eden kapsamlı veraset planlama stratejileri ve servet transfer yapıları geliştirin. Veraset uzmanlarımız verimli servet transferini kolaylaştırmak için tröstler, vakıflar ve holding yapıları kullanarak uyumlu çerçeveler oluşturur.'
        },
        {
          title: 'Gizlilik Çözümleri',
          description: 'Yüksek profilli bireyler ve hassas iş operasyonları için gelişmiş gizlilik çözümleri ve gizlilik yapıları uygulayın. Gizlilik uzmanlarımız anonimliği artıran, faydalı mülkiyet bilgilerini koruyan ve kişisel ve iş faaliyetlerini kamu incelemesinden koruyan uyumlu çerçeveler tasarlar.'
        }
      ],
      processSteps: [
        {
          title: 'Varlık Değerlendirmesi',
          description: 'Varlık portföyünüzü, yasal riskleri ve yargı alanları boyunca maruz kalma noktalarını haritalayın'
        },
        {
          title: 'Koruma Stratejisi',
          description: 'Kontrol, erişim ve veraset ihtiyaçlarına göre uyarlanmış tröst, vakıf ve holding yapıları tasarlayın'
        },
        {
          title: 'Yapı Uygulaması',
          description: 'Varlıklar kurun, senetler ve tüzükler taslağı hazırlayın, yönetişim çerçeveleri uygulayın ve bankacılık kurun'
        },
        {
          title: 'Devam Eden Yönetim',
          description: 'Dosyalamaları, yenilemeleri, izlemeyi ele alın ve uyumluluk için denetim hazır kayıtları sürdürün'
        }
      ],
      faqs: [
        {
          question: 'Offshore varlık korunması yasal mı?',
          answer: 'Evet—yasa çerçevesinde ve uygun öz ile yapılandırıldığında. Varlık koruma yapılarınızın uyumlu, denetlenebilir ve savunulabilir olmasını sağlamak için uluslararası uyumluluk standartları, faydalı mülkiyet gereksinimleri ve raporlama yükümlülüklerini takip ediyoruz. Yaklaşımımız güçlü yasal çerçevelere sahip yerleşik yargı alanları aracılığıyla meşru servet korunması sağlarken yasal riskleri azaltır.'
        },
        {
          question: 'Tröst mü yoksa vakıf yapısı mı kullanmalıyım?',
          answer: 'Seçim yargı alanınıza, kontrol tercihlerinize ve veraset hedeflerinize bağlıdır. Tröstler esneklik ve ortak hukuk aşinalığı sunarken, vakıflar kurumsal benzeri yönetişim ve medeni hukuk avantajları sağlar. Varlık koruma ve servet transfer gereksinimleriniz için optimal aracı önermek için özel ihtiyaçlarınızı, aile yapınızı ve hedeflerinizi analiz ediyoruz.'
        },
        {
          question: 'Varlıklarımın kontrolünü kaybeder miyim?',
          answer: 'Hayır—düzgün yapılandırılmış varlık korunması yasal ayrım sağlarken pratik kontrolünüzü sürdürür. Danışma rolleri, yatırım komiteleri ve dağıtım yönergeleri aracılığıyla karar verme otoritenizi koruyan çerçeveler tasarlıyoruz. Anahtar hem yasal gereksinimleri hem de operasyonel ihtiyaçlarınızı karşılayan uyumlu yapılar aracılığıyla koruma faydaları ile kontrol tutma arasında denge kurmaktır.'
        },
        {
          question: 'Alacaklı korunması ne kadar etkili?',
          answer: 'Etkinlik zamanlama, yargı alanı seçimi ve yapı tasarımına bağlıdır. Önceden var olan borç veya hileli transfer riskleri korunmayı sınırlayabilir, bu nedenle erken planlama çok önemlidir. Risk profilinizi değerlendiriyor, güçlü alacaklı koruma yasalarına sahip optimal yargı alanları seçiyor ve uluslararası standartlar ve raporlama gereksinimleriyle uyumluluğu sürdürürken maksimum yasal ayrım sağlayan yapılar uyguluyoruz.'
        },
        {
          question: 'Raporlama gereksinimleri nelerdir?',
          answer: 'Raporlama yükümlülükleri vergi ikametinize ve yapı yargı alanınıza göre değişir. Çoğu ülke çeşitli formlar ve son tarihler aracılığıyla yabancı tröstler, vakıflar ve kontrollü varlıkların açıklanmasını gerektirir. Yasal sınırlar içinde maksimum gizliliği sürdürürken ve devam eden uyumluluk izleme sağlarken CRS, FATCA ve yerel raporlama gereksinimleriyle tam uyumluluk sağlıyoruz.'
        },
        {
          question: 'Varlık koruma kurulumu ne kadar sürer?',
          answer: 'Yapı kurulumu genellikle yargı alanı karmaşıklığına ve bankacılık gereksinimlerine bağlı olarak 4-8 hafta sürer. Basit tröst yapıları daha hızlı tamamlanabilirken, karmaşık çok yargı alanı çerçeveleri uygun dokümantasyon ve uyumluluk kurulumu için ek zaman gerektirir. Tüm varlık koruma uygulama süreci boyunca net zaman çizelgeleri ve kilometre taşı takibi sağlıyoruz.'
        }
      ]
    },
    pt: {
      heroTitle: 'Serviços de Proteção de Ativos – Proteja Sua Riqueza',
      heroDescription: 'Proteja sua riqueza de riscos legais, credores e instabilidade política. Projetamos estruturas compatíveis de trust, fundação e holding que protegem ativos mantendo acesso e controle.',
      whatWeOfferTitle: 'O Que Oferecemos',
      whatWeOfferDescription: 'Estratégias sofisticadas de proteção de ativos para indivíduos e empresas de alto patrimônio líquido',
      processTitle: 'Nosso Processo de Proteção de Ativos',
      processDescription: 'Abordagem abrangente para proteger sua riqueza e ativos',
      jurisdictionsTitle: 'Principais Jurisdições de Proteção de Ativos',
      jurisdictionsDescription: 'Países oferecendo as leis de proteção de ativos mais fortes e estruturas de privacidade',
      faqTitle: 'Perguntas Frequentes',
      faqDescription: 'Perguntas comuns sobre estratégias de proteção de ativos e estruturas offshore',
      ctaTitle: 'Pronto para Proteger Seus Ativos?',
      ctaDescription: 'Obtenha orientação especializada para estratégias abrangentes de proteção de ativos',
      services: [
        {
          title: 'Trusts Offshore',
          description: 'Estabeleça estruturas sofisticadas de trust offshore em jurisdições premium para máxima proteção de ativos e privacidade. Nossos especialistas em trust projetam estruturas compatíveis que protegem riqueza de credores, riscos de litígio e instabilidade política mantendo controle de propriedade benéfica.'
        },
        {
          title: 'Fundações Privadas',
          description: 'Crie estruturas de fundação privada para preservação de riqueza, planejamento sucessório e objetivos filantrópicos em jurisdições líderes de fundação. Nossos especialistas em fundação estabelecem estruturas compatíveis que oferecem privacidade aprimorada, proteção de ativos e estruturas de governança flexíveis.'
        },
        {
          title: 'Holdings',
          description: 'Projete estruturas de holding multi-camadas para isolamento de ativos, proteção de credores e eficiência operacional em múltiplas jurisdições. Nossos especialistas em estrutura de holding criam estruturas compatíveis que separam riscos empresariais, otimizam eficiência fiscal e fornecem proteção de privacidade aprimorada.'
        },
        {
          title: 'Family Offices',
          description: 'Estabeleça estruturas abrangentes de family office para famílias ultra-alto-patrimônio-líquido buscando soluções centralizadas de gestão de patrimônio e governança. Nossos especialistas em family office projetam estruturas sob medida que coordenam gestão de investimentos, planejamento fiscal, planejamento patrimonial e governança familiar em múltiplas gerações.'
        },
        {
          title: 'Planejamento Sucessório',
          description: 'Desenvolva estratégias abrangentes de planejamento sucessório e estruturas de transferência de riqueza que minimizam responsabilidade fiscal garantindo transições geracionais suaves. Nossos especialistas sucessórios criam estruturas compatíveis usando trusts, fundações e estruturas de holding para facilitar transferência eficiente de riqueza.'
        },
        {
          title: 'Soluções de Privacidade',
          description: 'Implemente soluções avançadas de privacidade e estruturas de confidencialidade para indivíduos de alto perfil e operações empresariais sensíveis. Nossos especialistas em privacidade projetam estruturas compatíveis que aumentam anonimato, protegem informações de propriedade benéfica e protegem atividades pessoais e empresariais do escrutínio público.'
        }
      ],
      processSteps: [
        {
          title: 'Avaliação de Ativos',
          description: 'Mapeie seu portfólio de ativos, riscos legais e pontos de exposição em jurisdições'
        },
        {
          title: 'Estratégia de Proteção',
          description: 'Projete estruturas de trust, fundação e holding adaptadas às necessidades de controle, acesso e sucessão'
        },
        {
          title: 'Implementação de Estrutura',
          description: 'Estabeleça entidades, redija escrituras e estatutos, implemente estruturas de governança e configure bancos'
        },
        {
          title: 'Gestão Contínua',
          description: 'Lide com arquivamentos, renovações, monitoramento e mantenha registros prontos para auditoria para conformidade'
        }
      ],
      faqs: [
        {
          question: 'A proteção de ativos offshore é legal?',
          answer: 'Sim—quando estruturada dentro da lei e com substância adequada. Seguimos padrões de conformidade internacional, requisitos de propriedade benéfica e obrigações de relatórios para garantir que suas estruturas de proteção de ativos sejam compatíveis, auditáveis e defensáveis. Nossa abordagem reduz riscos legais fornecendo proteção legítima de riqueza através de jurisdições estabelecidas com estruturas legais fortes.'
        },
        {
          question: 'Devo usar uma estrutura de trust ou fundação?',
          answer: 'A escolha depende de sua jurisdição, preferências de controle e objetivos sucessórios. Trusts oferecem flexibilidade e familiaridade de common law, enquanto fundações fornecem governança corporativa e vantagens de direito civil. Analisamos suas necessidades específicas, estrutura familiar e objetivos para recomendar o veículo ótimo para seus requisitos de proteção de ativos e transferência de riqueza.'
        },
        {
          question: 'Perderei controle dos meus ativos?',
          answer: 'Não—proteção de ativos adequadamente estruturada mantém seu controle prático fornecendo separação legal. Projetamos estruturas que preservam sua autoridade de tomada de decisão através de papéis consultivos, comitês de investimento e diretrizes de distribuição. A chave é equilibrar benefícios de proteção com retenção de controle através de estruturas compatíveis que satisfazem tanto requisitos legais quanto suas necessidades operacionais.'
        },
        {
          question: 'Quão efetiva é a proteção de credores?',
          answer: 'A efetividade depende de timing, seleção de jurisdição e design de estrutura. Dívida pré-existente ou riscos de transferência fraudulenta podem limitar proteção, então planejamento antecipado é crucial. Avaliamos seu perfil de risco, selecionamos jurisdições ótimas com leis fortes de proteção de credores e implementamos estruturas que fornecem separação legal máxima mantendo conformidade com padrões internacionais e requisitos de relatórios.'
        },
        {
          question: 'Quais são os requisitos de relatórios?',
          answer: 'Obrigações de relatórios variam por sua residência fiscal e jurisdição de estrutura. A maioria dos países requer divulgação de trusts estrangeiros, fundações e entidades controladas através de várias formas e prazos. Garantimos conformidade completa com CRS, FATCA e requisitos de relatórios locais mantendo máxima privacidade dentro de limites legais e fornecendo monitoramento contínuo de conformidade.'
        },
        {
          question: 'Quanto tempo leva a configuração de proteção de ativos?',
          answer: 'Estabelecimento de estrutura tipicamente leva 4-8 semanas dependendo da complexidade da jurisdição e requisitos bancários. Estruturas simples de trust podem ser completadas mais rapidamente, enquanto estruturas multi-jurisdicionais complexas requerem tempo adicional para documentação adequada e configuração de conformidade. Fornecemos cronogramas claros e rastreamento de marcos durante todo o processo de implementação de proteção de ativos.'
        }
      ]
    }
  };

  const currentContent = content[language] || content.en;

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8 overflow-hidden">
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
              <p className="text-xl text-purple-100 leading-relaxed mb-8">
                {currentContent.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/countries?service=asset-protection">
                  <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700">
                    {t('getStarted')}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  {t('scheduleConsultation')}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Asset protection"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Matrix Premium Promo */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700/90 via-purple-600/85 to-fuchsia-600/80" />
            </div>

            {/* Content */}
            <div className="relative p-6 md:p-8 lg:p-10 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 ring-1 ring-white/25 text-sm font-semibold mb-4">
                <span>💎 Premium</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                Matrix — Private Wealth Platform
              </h3>
              <p className="mt-3 text-white/90 max-w-3xl">
                A privacy-first platform for ultra-high-net-worth clients. AI-assisted global allocation, multi-jurisdiction banking, and discreet execution. Minimum investment: $5M.
              </p>

              {/* Bullets */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-sm">AI-driven analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-white" />
                  <span className="text-sm">Global opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-sm">Strict confidentiality</span>
                </div>
              </div>

              {/* KPI chips */}
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="px-3 py-1 rounded-md bg-white/15 ring-1 ring-white/25 text-sm">
                  $2.5B+ AUM
                </div>
                <div className="px-3 py-1 rounded-md bg-white/15 ring-1 ring-white/25 text-sm">
                  98% success rate
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wealth.consulting19.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button size="lg" className="bg-amber-400 text-black hover:bg-amber-300">
                    Explore Matrix Wealth
                  </Button>
                </a>
              </div>
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
                    src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-4 h-48 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-200 text-xs leading-relaxed line-clamp-4 overflow-hidden">
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
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {index === 0 && <Shield className="w-6 h-6 text-white" />}
                    {index === 1 && <Lock className="w-6 h-6 text-white" />}
                    {index === 2 && <Eye className="w-6 h-6 text-white" />}
                    {index === 3 && <Globe className="w-6 h-6 text-white" />}
                  </div>
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'United Arab Emirates', flag: '🇦🇪', tag: 'Free Zones', highlight: 'Modern asset protection framework with business-friendly free zone structures', slug: 'united-arab-emirates' },
              { name: 'Estonia', flag: '🇪🇪', tag: 'e-Residency', highlight: 'Digital asset protection solutions with EU compliance and online management', slug: 'estonia' },
              { name: 'Georgia', flag: '🇬🇪', tag: '1% Small Business Tax', highlight: 'Simple asset protection structures with minimal tax burden and low compliance', slug: 'georgia' },
              { name: 'Malta', flag: '🇲🇹', tag: 'EU Hub', highlight: 'EU-compliant asset protection with blockchain-friendly regulations and privacy', slug: 'malta' },
              { name: 'Panama', flag: '🇵🇦', tag: 'Territorial', highlight: 'Strong privacy laws with territorial taxation and robust banking secrecy', slug: 'panama' },
              { name: 'Portugal', flag: '🇵🇹', tag: 'EU Access', highlight: 'EU asset protection with investment immigration and NHR tax benefits', slug: 'portugal' },
              { name: 'United States', flag: '🇺🇸', tag: 'Federal System', highlight: 'Advanced trust and LLC structures with strong legal framework and privacy', slug: 'united-states' },
              { name: 'Switzerland', flag: '🇨🇭', tag: 'Premium', highlight: 'World-class banking privacy with political stability and wealth management', slug: 'switzerland' },
              { name: 'Montenegro', flag: '🇲🇪', tag: 'EU Candidate', highlight: 'Emerging asset protection jurisdiction with EU alignment and citizenship options', slug: 'montenegro' }
            ].map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className="bg-purple-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-bold text-purple-900">{country.tag}</div>
                    <div className="text-xs text-purple-700">{country.highlight}</div>
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

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentContent.faqTitle}</h2>
            <p className="text-xl text-gray-600">
              {currentContent.faqDescription}
            </p>
          </div>

          <div className="space-y-4">
            {currentContent.faqs.map((faq, index) => (
              <Card key={index}>
                <Card.Body>
                  <button
                    onClick={() => toggleFaq(index.toString())}
                    className="w-full text-left flex justify-between items-center"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {expandedFaq === index.toString() ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === index.toString() && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{currentContent.ctaTitle}</h2>
          <p className="text-xl text-purple-100 mb-8">
            {currentContent.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/countries?service=asset-protection">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                {t('getStarted')}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              {t('scheduleConsultation')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssetProtectionPage;