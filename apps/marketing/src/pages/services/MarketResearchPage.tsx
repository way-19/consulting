import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Search, Target, TrendingUp, Users, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const MarketResearchPage = () => {
  const { t, language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const content = {
    en: {
      heroTitle: 'Market Research Services – Data-Driven Expansion Decisions',
      heroDescription: 'Make informed decisions with data-driven market intelligence. Our researchers deliver deep insights on customers, competitors, regulations, and go-to-market opportunities across global markets.',
      whatWeOfferTitle: 'What We Offer',
      whatWeOfferDescription: 'Data-driven market research and business intelligence services for informed expansion decisions',
      processTitle: 'Our Market Research Process',
      processDescription: 'Systematic approach to understanding markets and identifying opportunities',
      jurisdictionsTitle: 'Key Market Research Destinations',
      jurisdictionsDescription: 'Leading markets with comprehensive research capabilities and business opportunities',
      faqTitle: 'Frequently Asked Questions',
      faqDescription: 'Common questions about market research services and business intelligence solutions',
      ctaTitle: 'Ready to Research Your Market?',
      ctaDescription: 'Get comprehensive market intelligence to drive confident expansion decisions',
      services: [
        {
          title: 'Market Entry Analysis',
          description: 'Comprehensive market entry strategies that include demand sizing, route-to-market evaluation, pricing corridors analysis, and partner model assessment. Our market research specialists conduct thorough regulatory barrier analysis and competitive landscape mapping to deliver clear entry recommendations.'
        },
        {
          title: 'Competitor Intelligence',
          description: 'Strategic competitor analysis covering competitive strategy and positioning, share-of-voice and share-of-shelf metrics, pricing and promotional strategies, and comprehensive strengths and risks assessment. Our competitive intelligence services produce tactical response plans with actionable market insights.'
        },
        {
          title: 'Consumer Research',
          description: 'Advanced consumer insights using quantitative and qualitative research methods including surveys, interviews, and consumer panels for comprehensive market understanding. Our consumer research specialists develop detailed segmentation analysis, customer personas, and purchase drivers and barriers assessment.'
        },
        {
          title: 'Industry Reports',
          description: 'Comprehensive industry analysis including Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM) calculations with detailed trend mapping and value chain analysis. Our industry report services provide technology roadmaps, scenario analysis, and board-ready strategic recommendations.'
        },
        {
          title: 'Regulatory Research',
          description: 'Detailed regulatory landscape analysis covering compliance requirements, licensing and permit procedures, implementation timelines and associated costs, and comprehensive monitoring of upcoming regulatory changes. Our regulatory analysis services help businesses de-risk international expansion through thorough compliance planning.'
        },
        {
          title: 'Partnership Opportunities',
          description: 'Strategic partnership identification services including comprehensive long-list and short-list development of potential distributors and integrators with detailed scoring matrices and evaluation criteria. Our partnership research includes customized outreach scripts and structured meeting pipeline development.'
        }
      ],
      processSteps: [
        {
          title: 'Market Analysis',
          description: 'Define objectives and scope; collect primary/secondary data to quantify demand and dynamics'
        },
        {
          title: 'Competitive Research',
          description: 'Map players, offerings, pricing, and positioning to reveal white-space and threats'
        },
        {
          title: 'Strategy Development',
          description: 'Translate findings into entry strategy, messaging, and commercial model with KPIs'
        },
        {
          title: 'Implementation Support',
          description: 'Assist with partner outreach, pilots, and first-90-days tracking to validate results'
        }
      ],
      faqs: [
        {
          question: 'Which market research approach is best for my business?',
          answer: 'The optimal research approach depends on your expansion goals, target markets, budget, and timeline requirements. We analyze your specific business model and objectives to recommend the most effective research methodology. Our assessment considers your industry dynamics, competitive landscape, and market maturity to design comprehensive market research that delivers actionable insights for successful international expansion.'
        },
        {
          question: 'How much does comprehensive market research cost?',
          answer: 'Market research costs vary significantly based on scope, methodology, and geographic coverage requirements. Basic market entry analysis typically starts from $5,000, while comprehensive multi-market studies can range from $15,000 to $50,000+ depending on research depth and primary data collection needs. We provide transparent pricing with detailed scope definitions and deliverable specifications for all market research services.'
        },
        {
          question: 'How long does market research take to complete?',
          answer: 'Research timelines typically range from 4-12 weeks depending on study complexity, primary data collection requirements, and geographic scope. Desk research and competitive analysis can be completed in 4-6 weeks, while comprehensive consumer research with primary data collection may require 8-12 weeks. We provide detailed project timelines with milestone tracking throughout the entire market research process.'
        },
        {
          question: 'What data sources do you use for market research?',
          answer: 'We utilize a comprehensive mix of primary and secondary data sources including industry databases, government statistics, trade associations, consumer surveys, expert interviews, and proprietary research partnerships. Our market research methodology combines quantitative analysis with qualitative insights to provide complete market intelligence. We ensure all data sources are credible, current, and relevant to your specific market research objectives.'
        },
        {
          question: 'How do you ensure research insights are actionable?',
          answer: 'Our market research deliverables focus on strategic recommendations rather than raw data presentation. We translate research findings into specific go-to-market strategies, pricing recommendations, partnership opportunities, and risk mitigation plans. Each market research report includes executive summaries, implementation roadmaps, and success metrics to ensure insights drive concrete business decisions and measurable outcomes.'
        },
        {
          question: 'Do you provide ongoing market monitoring after initial research?',
          answer: 'Yes, we offer ongoing market monitoring services to track competitive changes, regulatory updates, and market evolution after your initial market research project. Our continuous monitoring includes quarterly market updates, competitive intelligence alerts, and annual strategy reviews. This ongoing support ensures your market research investment continues delivering value as markets evolve and your business expands internationally.'
        }
      ]
    },
    tr: {
      heroTitle: 'Pazar Araştırması Hizmetleri – Veri Odaklı Genişleme Kararları',
      heroDescription: 'Veri odaklı pazar zekası ile bilinçli kararlar alın. Araştırmacılarımız küresel pazarlarda müşteriler, rakipler, düzenlemeler ve pazara giriş fırsatları hakkında derin içgörüler sunar.',
      whatWeOfferTitle: 'Neler Sunuyoruz',
      whatWeOfferDescription: 'Bilinçli genişleme kararları için veri odaklı pazar araştırması ve iş zekası hizmetleri',
      processTitle: 'Pazar Araştırması Sürecimiz',
      processDescription: 'Pazarları anlama ve fırsatları belirleme için sistematik yaklaşım',
      jurisdictionsTitle: 'Anahtar Pazar Araştırması Destinasyonları',
      jurisdictionsDescription: 'Kapsamlı araştırma yetenekleri ve iş fırsatları olan önde gelen pazarlar',
      faqTitle: 'Sık Sorulan Sorular',
      faqDescription: 'Pazar araştırması hizmetleri ve iş zekası çözümleri hakkında yaygın sorular',
      ctaTitle: 'Pazarınızı Araştırmaya Hazır mısınız?',
      ctaDescription: 'Güvenli genişleme kararları için kapsamlı pazar zekası alın',
      services: [
        {
          title: 'Pazar Giriş Analizi',
          description: 'Talep boyutlandırma, pazara giriş rotası değerlendirmesi, fiyatlandırma koridorları analizi ve ortak model değerlendirmesi içeren kapsamlı pazar giriş stratejileri. Pazar araştırması uzmanlarımız net giriş önerileri sunmak için kapsamlı düzenleyici engel analizi ve rekabetçi manzara haritalama yapar.'
        },
        {
          title: 'Rakip Zekası',
          description: 'Rekabetçi strateji ve konumlandırma, ses payı ve raf payı metrikleri, fiyatlandırma ve promosyon stratejileri ve kapsamlı güçlü ve zayıf yönler değerlendirmesini kapsayan stratejik rakip analizi. Rekabetçi zeka hizmetlerimiz eyleme geçirilebilir pazar içgörüleri ile taktiksel yanıt planları üretir.'
        },
        {
          title: 'Tüketici Araştırması',
          description: 'Kapsamlı pazar anlayışı için anketler, görüşmeler ve tüketici panelleri dahil nicel ve nitel araştırma yöntemleri kullanarak gelişmiş tüketici içgörüleri. Tüketici araştırması uzmanlarımız detaylı segmentasyon analizi, müşteri kişilikleri ve satın alma itici güçleri ve engelleri değerlendirmesi geliştirir.'
        },
        {
          title: 'Endüstri Raporları',
          description: 'Detaylı trend haritalama ve değer zinciri analizi ile Toplam Adreslenebilir Pazar (TAM), Hizmet Edilebilir Adreslenebilir Pazar (SAM) ve Hizmet Edilebilir Elde Edilebilir Pazar (SOM) hesaplamaları dahil kapsamlı endüstri analizi. Endüstri raporu hizmetlerimiz teknoloji yol haritaları, senaryo analizi ve yönetim kurulu hazır stratejik öneriler sağlar.'
        },
        {
          title: 'Düzenleyici Araştırma',
          description: 'Uyumluluk gereksinimleri, lisanslama ve izin prosedürleri, uygulama zaman çizelgeleri ve ilgili maliyetler ve yaklaşan düzenleyici değişikliklerin kapsamlı izlenmesini kapsayan detaylı düzenleyici manzara analizi. Düzenleyici analiz hizmetlerimiz kapsamlı uyumluluk planlaması yoluyla işletmelerin uluslararası genişleme riskini azaltmasına yardımcı olur.'
        },
        {
          title: 'Ortaklık Fırsatları',
          description: 'Detaylı puanlama matrisleri ve değerlendirme kriterleri ile potansiyel distribütörler ve entegratörlerin kapsamlı uzun liste ve kısa liste geliştirilmesi dahil stratejik ortaklık belirleme hizmetleri. Ortaklık araştırmamız özelleştirilmiş erişim komut dosyaları ve yapılandırılmış toplantı boru hattı geliştirmeyi içerir.'
        }
      ],
      processSteps: [
        {
          title: 'Pazar Analizi',
          description: 'Hedefleri ve kapsamı tanımlayın; talep ve dinamikleri ölçmek için birincil/ikincil veri toplayın'
        },
        {
          title: 'Rekabetçi Araştırma',
          description: 'Boş alanları ve tehditleri ortaya çıkarmak için oyuncuları, teklifleri, fiyatlandırmayı ve konumlandırmayı haritalayın'
        },
        {
          title: 'Strateji Geliştirme',
          description: 'Bulguları KPI\'lar ile giriş stratejisi, mesajlaşma ve ticari modele çevirin'
        },
        {
          title: 'Uygulama Desteği',
          description: 'Sonuçları doğrulamak için ortak erişimi, pilot projeler ve ilk 90 gün takibi ile yardım edin'
        }
      ],
      faqs: [
        {
          question: 'İşim için hangi pazar araştırması yaklaşımı en iyisi?',
          answer: 'Optimal araştırma yaklaşımı genişleme hedeflerinize, hedef pazarlarınıza, bütçenize ve zaman çizelgesi gereksinimlerinize bağlıdır. En etkili araştırma metodolojisini önermek için özel iş modelinizi ve hedeflerinizi analiz ediyoruz. Değerlendirmemiz başarılı uluslararası genişleme için eyleme geçirilebilir içgörüler sunan kapsamlı pazar araştırması tasarlamak için endüstri dinamiklerinizi, rekabetçi manzaranızı ve pazar olgunluğunu dikkate alır.'
        },
        {
          question: 'Kapsamlı pazar araştırması ne kadar tutar?',
          answer: 'Pazar araştırması maliyetleri kapsam, metodoloji ve coğrafi kapsama gereksinimlerine göre önemli ölçüde değişir. Temel pazar giriş analizi genellikle 5.000$\'dan başlar, kapsamlı çok pazarlı çalışmalar araştırma derinliği ve birincil veri toplama ihtiyaçlarına bağlı olarak 15.000$ ile 50.000$+ arasında değişebilir. Tüm pazar araştırması hizmetleri için detaylı kapsam tanımları ve teslim edilebilir spesifikasyonları ile şeffaf fiyatlandırma sağlıyoruz.'
        },
        {
          question: 'Pazar araştırmasının tamamlanması ne kadar sürer?',
          answer: 'Araştırma zaman çizelgeleri genellikle çalışma karmaşıklığına, birincil veri toplama gereksinimlerine ve coğrafi kapsama bağlı olarak 4-12 hafta arasında değişir. Masa araştırması ve rekabetçi analiz 4-6 haftada tamamlanabilirken, birincil veri toplama ile kapsamlı tüketici araştırması 8-12 hafta gerektirebilir. Tüm pazar araştırması süreci boyunca kilometre taşı takibi ile detaylı proje zaman çizelgeleri sağlıyoruz.'
        },
        {
          question: 'Pazar araştırması için hangi veri kaynaklarını kullanıyorsunuz?',
          answer: 'Endüstri veritabanları, hükümet istatistikleri, ticaret dernekleri, tüketici anketleri, uzman görüşmeleri ve özel araştırma ortaklıkları dahil birincil ve ikincil veri kaynaklarının kapsamlı bir karışımını kullanıyoruz. Pazar araştırması metodolojimiz tam pazar zekası sağlamak için nicel analizi nitel içgörülerle birleştirir. Tüm veri kaynaklarının özel pazar araştırması hedeflerinizle ilgili, güncel ve güvenilir olmasını sağlıyoruz.'
        },
        {
          question: 'Araştırma içgörülerinin eyleme geçirilebilir olmasını nasıl sağlıyorsunuz?',
          answer: 'Pazar araştırması teslim edilebilirlerimiz ham veri sunumu yerine stratejik önerilere odaklanır. Araştırma bulgularını özel pazara giriş stratejileri, fiyatlandırma önerileri, ortaklık fırsatları ve risk azaltma planlarına çeviriyoruz. Her pazar araştırması raporu içgörülerin somut iş kararları ve ölçülebilir sonuçlar sağlamasını garanti etmek için yönetici özetleri, uygulama yol haritaları ve başarı metrikleri içerir.'
        },
        {
          question: 'İlk araştırmadan sonra devam eden pazar izleme sağlıyor musunuz?',
          answer: 'Evet, ilk pazar araştırması projenizden sonra rekabetçi değişiklikleri, düzenleyici güncellemeleri ve pazar evrimini takip etmek için devam eden pazar izleme hizmetleri sunuyoruz. Sürekli izlememiz üç aylık pazar güncellemeleri, rekabetçi zeka uyarıları ve yıllık strateji incelemeleri içerir. Bu devam eden destek pazar araştırması yatırımınızın pazarlar geliştikçe ve işiniz uluslararası olarak genişledikçe değer sunmaya devam etmesini sağlar.'
        }
      ]
    },
    pt: {
      heroTitle: 'Serviços de Pesquisa de Mercado – Decisões de Expansão Baseadas em Dados',
      heroDescription: 'Tome decisões informadas com inteligência de mercado baseada em dados. Nossos pesquisadores entregam insights profundos sobre clientes, concorrentes, regulamentações e oportunidades de entrada no mercado em mercados globais.',
      whatWeOfferTitle: 'O Que Oferecemos',
      whatWeOfferDescription: 'Serviços de pesquisa de mercado baseada em dados e inteligência empresarial para decisões informadas de expansão',
      processTitle: 'Nosso Processo de Pesquisa de Mercado',
      processDescription: 'Abordagem sistemática para entender mercados e identificar oportunidades',
      jurisdictionsTitle: 'Principais Destinos de Pesquisa de Mercado',
      jurisdictionsDescription: 'Mercados líderes com capacidades abrangentes de pesquisa e oportunidades empresariais',
      faqTitle: 'Perguntas Frequentes',
      faqDescription: 'Perguntas comuns sobre serviços de pesquisa de mercado e soluções de inteligência empresarial',
      ctaTitle: 'Pronto para Pesquisar Seu Mercado?',
      ctaDescription: 'Obtenha inteligência de mercado abrangente para impulsionar decisões confiantes de expansão',
      services: [
        {
          title: 'Análise de Entrada no Mercado',
          description: 'Estratégias abrangentes de entrada no mercado que incluem dimensionamento de demanda, avaliação de rota para mercado, análise de corredores de preços e avaliação de modelo de parceiro. Nossos especialistas em pesquisa de mercado conduzem análise completa de barreiras regulatórias e mapeamento de paisagem competitiva para entregar recomendações claras de entrada.'
        },
        {
          title: 'Inteligência Competitiva',
          description: 'Análise estratégica de concorrentes cobrindo estratégia competitiva e posicionamento, métricas de share-of-voice e share-of-shelf, estratégias de preços e promocionais, e avaliação abrangente de forças e riscos. Nossos serviços de inteligência competitiva produzem planos de resposta tática com insights de mercado acionáveis.'
        },
        {
          title: 'Pesquisa do Consumidor',
          description: 'Insights avançados do consumidor usando métodos de pesquisa quantitativos e qualitativos incluindo pesquisas, entrevistas e painéis de consumidores para compreensão abrangente do mercado. Nossos especialistas em pesquisa do consumidor desenvolvem análise detalhada de segmentação, personas de clientes e avaliação de drivers e barreiras de compra.'
        },
        {
          title: 'Relatórios da Indústria',
          description: 'Análise abrangente da indústria incluindo cálculos de Mercado Total Endereçável (TAM), Mercado Endereçável Serviceable (SAM) e Mercado Obtível Serviceable (SOM) com mapeamento detalhado de tendências e análise de cadeia de valor. Nossos serviços de relatório da indústria fornecem roadmaps de tecnologia, análise de cenários e recomendações estratégicas prontas para o conselho.'
        },
        {
          title: 'Pesquisa Regulatória',
          description: 'Análise detalhada da paisagem regulatória cobrindo requisitos de conformidade, procedimentos de licenciamento e permissão, cronogramas de implementação e custos associados, e monitoramento abrangente de mudanças regulatórias futuras. Nossos serviços de análise regulatória ajudam empresas a reduzir riscos de expansão internacional através de planejamento completo de conformidade.'
        },
        {
          title: 'Oportunidades de Parceria',
          description: 'Serviços de identificação de parceria estratégica incluindo desenvolvimento abrangente de lista longa e lista curta de potenciais distribuidores e integradores com matrizes detalhadas de pontuação e critérios de avaliação. Nossa pesquisa de parceria inclui scripts de alcance customizados e desenvolvimento estruturado de pipeline de reuniões.'
        }
      ],
      processSteps: [
        {
          title: 'Análise de Mercado',
          description: 'Defina objetivos e escopo; colete dados primários/secundários para quantificar demanda e dinâmicas'
        },
        {
          title: 'Pesquisa Competitiva',
          description: 'Mapeie jogadores, ofertas, preços e posicionamento para revelar espaços em branco e ameaças'
        },
        {
          title: 'Desenvolvimento de Estratégia',
          description: 'Traduza descobertas em estratégia de entrada, mensagens e modelo comercial com KPIs'
        },
        {
          title: 'Suporte de Implementação',
          description: 'Auxilie com alcance de parceiros, pilotos e rastreamento dos primeiros 90 dias para validar resultados'
        }
      ],
      faqs: [
        {
          question: 'İşim için hangi pazar araştırması yaklaşımı en iyisi?',
          answer: 'Optimal araştırma yaklaşımı genişleme hedeflerinize, hedef pazarlarınıza, bütçenize ve zaman çizelgesi gereksinimlerinize bağlıdır. En etkili araştırma metodolojisini önermek için özel iş modelinizi ve hedeflerinizi analiz ediyoruz. Değerlendirmemiz başarılı uluslararası genişleme için eyleme geçirilebilir içgörüler sunan kapsamlı pazar araştırması tasarlamak için endüstri dinamiklerinizi, rekabetçi manzaranızı ve pazar olgunluğunu dikkate alır.'
        },
        {
          question: 'Kapsamlı pazar araştırması ne kadar tutar?',
          answer: 'Pazar araştırması maliyetleri kapsam, metodoloji ve coğrafi kapsama gereksinimlerine göre önemli ölçüde değişir. Temel pazar giriş analizi genellikle 5.000$\'dan başlar, kapsamlı çok pazarlı çalışmalar araştırma derinliği ve birincil veri toplama ihtiyaçlarına bağlı olarak 15.000$ ile 50.000$+ arasında değişebilir. Tüm pazar araştırması hizmetleri için detaylı kapsam tanımları ve teslim edilebilir spesifikasyonları ile şeffaf fiyatlandırma sağlıyoruz.'
        },
        {
          question: 'Pazar araştırmasının tamamlanması ne kadar sürer?',
          answer: 'Araştırma zaman çizelgeleri genellikle çalışma karmaşıklığına, birincil veri toplama gereksinimlerine ve coğrafi kapsama bağlı olarak 4-12 hafta arasında değişir. Masa araştırması ve rekabetçi analiz 4-6 haftada tamamlanabilirken, birincil veri toplama ile kapsamlı tüketici araştırması 8-12 hafta gerektirebilir. Tüm pazar araştırması süreci boyunca kilometre taşı takibi ile detaylı proje zaman çizelgeleri sağlıyoruz.'
        },
        {
          question: 'Pazar araştırması için hangi veri kaynaklarını kullanıyorsunuz?',
          answer: 'Endüstri veritabanları, hükümet istatistikleri, ticaret dernekleri, tüketici anketleri, uzman görüşmeleri ve özel araştırma ortaklıkları dahil birincil ve ikincil veri kaynaklarının kapsamlı bir karışımını kullanıyoruz. Pazar araştırması metodolojimiz tam pazar zekası sağlamak için nicel analizi nitel içgörülerle birleştirir. Tüm veri kaynaklarının özel pazar araştırması hedeflerinizle ilgili, güncel ve güvenilir olmasını sağlıyoruz.'
        },
        {
          question: 'Araştırma içgörülerinin eyleme geçirilebilir olmasını nasıl sağlıyorsunuz?',
          answer: 'Pazar araştırması teslim edilebilirlerimiz ham veri sunumu yerine stratejik önerilere odaklanır. Araştırma bulgularını özel pazara giriş stratejileri, fiyatlandırma önerileri, ortaklık fırsatları ve risk azaltma planlarına çeviriyoruz. Her pazar araştırması raporu içgörülerin somut iş kararları ve ölçülebilir sonuçlar sağlamasını garanti etmek için yönetici özetleri, uygulama yol haritaları ve başarı metrikleri içerir.'
        },
        {
          question: 'İlk araştırmadan sonra devam eden pazar izleme sağlıyor musunuz?',
          answer: 'Evet, ilk pazar araştırması projenizden sonra rekabetçi değişiklikleri, düzenleyici güncellemeleri ve pazar evrimini takip etmek için devam eden pazar izleme hizmetleri sunuyoruz. Sürekli izlememiz üç aylık pazar güncellemeleri, rekabetçi zeka uyarıları ve yıllık strateji incelemeleri içerir. Bu devam eden destek pazar araştırması yatırımınızın pazarlar geliştikçe ve işiniz uluslararası olarak genişledikçe değer sunmaya devam etmesini sağlar.'
        }
      ]
    }
  };

  const currentContent = content[language] || content.en;

  const featuredCountries = [
    {
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      tag: 'GCC Hub',
      highlight: 'Gateway to Gulf demand with strong B2B and fintech ecosystems',
      slug: 'uae',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      tag: 'Digital First',
      highlight: 'EU market with advanced digital infrastructure and e-services data',
      slug: 'estonia',
    },
    {
      name: 'Georgia',
      flag: '🇬🇪',
      tag: 'Growth',
      highlight: 'Fast-moving market for testing pricing and channel strategies',
      slug: 'georgia',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      tag: 'EU Hub',
      highlight: 'EU access point for regulated sectors and maritime/aviation niches',
      slug: 'malta',
    },
    {
      name: 'Panama',
      flag: '🇵🇦',
      tag: 'Logistics',
      highlight: 'Canal-driven logistics cluster and LATAM gateway signals',
      slug: 'panama',
    },
    {
      name: 'Portugal',
      flag: '🇵🇹',
      tag: 'EU Access',
      highlight: 'Rising tech/nearshore hub with consumer and SME datasets',
      slug: 'portugal',
    },
    {
      name: 'United States',
      flag: '🇺🇸',
      tag: 'Markets',
      highlight: 'Deepest datasets and competitive benchmarks across categories',
      slug: 'usa',
    },
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      tag: 'Premium',
      highlight: 'High-value niches (medtech, finance) with rigorous regulatory data',
      slug: 'switzerland',
    },
    {
      name: 'Montenegro',
      flag: '🇲🇪',
      tag: 'Emerging',
      highlight: 'Cost-efficient testing ground with expanding EU-candidate alignment',
      slug: 'montenegro',
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 to-rose-600 text-white py-8 overflow-hidden">
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
              <p className="text-xl text-pink-100 leading-relaxed mb-8">
                {currentContent.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact?topic=market-research">
                  <Button size="lg" className="bg-pink-600 text-white hover:bg-pink-700">
                    {t('getStarted')}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
                  {t('scheduleConsultation')}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Market research analysis"
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
                    src="https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-6 h-64 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
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
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {index === 0 && <BarChart3 className="w-6 h-6 text-white" />}
                    {index === 1 && <Search className="w-6 h-6 text-white" />}
                    {index === 2 && <Target className="w-6 h-6 text-white" />}
                    {index === 3 && <TrendingUp className="w-6 h-6 text-white" />}
                  </div>
                  <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            {featuredCountries.map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className="bg-pink-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-bold text-pink-900">{country.tag}</div>
                    <div className="text-xs text-pink-700">{country.highlight}</div>
                  </div>
                  <Link to={`/countries/${country.slug}`}>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full"
                      aria-label={`Learn more about ${country.name} market research`}
                    >
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
      <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{currentContent.ctaTitle}</h2>
          <p className="text-xl text-pink-100 mb-8">
            {currentContent.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact?topic=market-research">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                {t('getStarted')}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
              {t('scheduleConsultation')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketResearchPage;