import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Search, Target, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
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
          description: 'Comprehensive market entry strategies including demand sizing, route-to-market evaluation, pricing analysis, and partner assessment.'
        },
        {
          title: 'Competitor Intelligence',
          description: 'Strategic competitor analysis covering competitive positioning, market share metrics, and pricing strategies.'
        },
        {
          title: 'Consumer Research',
          description: 'Advanced consumer insights using quantitative and qualitative research methods for comprehensive market understanding.'
        },
        {
          title: 'Industry Reports',
          description: 'Comprehensive industry analysis including TAM, SAM, and SOM calculations with detailed trend mapping.'
        },
        {
          title: 'Regulatory Research',
          description: 'Detailed regulatory landscape analysis covering compliance requirements and upcoming regulatory changes.'
        },
        {
          title: 'Partnership Opportunities',
          description: 'Strategic partnership identification services including distributor and integrator evaluation.'
        }
      ],
      processSteps: [
        {
          title: 'Market Analysis',
          description: 'Define objectives and scope; collect primary/secondary data to quantify demand and dynamics'
        },
        {
          title: 'Competitive Research',
          description: 'Map players, offerings, pricing, and positioning to reveal opportunities and threats'
        },
        {
          title: 'Strategy Development',
          description: 'Translate findings into entry strategy, messaging, and commercial model with KPIs'
        },
        {
          title: 'Implementation Support',
          description: 'Assist with partner outreach, pilots, and tracking to validate results'
        }
      ],
      faqs: [
        {
          question: 'Which market research approach is best for my business?',
          answer: 'The optimal research approach depends on your expansion goals, target markets, budget, and timeline requirements. We analyze your specific business model and objectives to recommend the most effective research methodology.'
        },
        {
          question: 'How much does comprehensive market research cost?',
          answer: 'Market research costs vary based on scope, methodology, and geographic coverage. Basic market entry analysis typically starts from $5,000, while comprehensive studies can range from $15,000 to $50,000+ depending on research depth.'
        },
        {
          question: 'How long does market research take to complete?',
          answer: 'Research timelines typically range from 4-12 weeks depending on study complexity and data collection requirements. Desk research can be completed in 4-6 weeks, while comprehensive consumer research may require 8-12 weeks.'
        },
        {
          question: 'What data sources do you use for market research?',
          answer: 'We utilize comprehensive primary and secondary data sources including industry databases, government statistics, consumer surveys, expert interviews, and proprietary research partnerships.'
        },
        {
          question: 'How do you ensure research insights are actionable?',
          answer: 'Our market research deliverables focus on strategic recommendations rather than raw data. We translate findings into specific go-to-market strategies, pricing recommendations, and implementation roadmaps.'
        },
        {
          question: 'Do you provide ongoing market monitoring?',
          answer: 'Yes, we offer ongoing market monitoring services including quarterly updates, competitive intelligence alerts, and annual strategy reviews to ensure continued value from your research investment.'
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
          description: 'Talep boyutlandırma, pazara giriş rotası değerlendirmesi, fiyatlandırma analizi ve ortak değerlendirmesi içeren kapsamlı pazar giriş stratejileri.'
        },
        {
          title: 'Rakip Zekası',
          description: 'Rekabetçi konumlandırma, pazar payı metrikleri ve fiyatlandırma stratejilerini kapsayan stratejik rakip analizi.'
        },
        {
          title: 'Tüketici Araştırması',
          description: 'Kapsamlı pazar anlayışı için nicel ve nitel araştırma yöntemleri kullanarak gelişmiş tüketici içgörüleri.'
        },
        {
          title: 'Endüstri Raporları',
          description: 'Detaylı trend haritalama ile TAM, SAM ve SOM hesaplamaları dahil kapsamlı endüstri analizi.'
        },
        {
          title: 'Düzenleyici Araştırma',
          description: 'Uyumluluk gereksinimleri ve yaklaşan düzenleyici değişiklikleri kapsayan detaylı düzenleyici manzara analizi.'
        },
        {
          title: 'Ortaklık Fırsatları',
          description: 'Distribütör ve entegratör değerlendirmesi dahil stratejik ortaklık belirleme hizmetleri.'
        }
      ],
      processSteps: [
        {
          title: 'Pazar Analizi',
          description: 'Hedefleri ve kapsamı tanımlayın; talep ve dinamikleri ölçmek için birincil/ikincil veri toplayın'
        },
        {
          title: 'Rekabetçi Araştırma',
          description: 'Fırsatları ve tehditleri ortaya çıkarmak için oyuncuları, teklifleri, fiyatlandırmayı haritalayın'
        },
        {
          title: 'Strateji Geliştirme',
          description: 'Bulguları KPI\'lar ile giriş stratejisi, mesajlaşma ve ticari modele çevirin'
        },
        {
          title: 'Uygulama Desteği',
          description: 'Sonuçları doğrulamak için ortak erişimi, pilot projeler ve takip ile yardım edin'
        }
      ],
      faqs: [
        {
          question: 'İşim için hangi pazar araştırması yaklaşımı en iyisi?',
          answer: 'Optimal araştırma yaklaşımı genişleme hedeflerinize, hedef pazarlarınıza, bütçenize ve zaman çizelgesi gereksinimlerinize bağlıdır. En etkili araştırma metodolojisini önermek için özel iş modelinizi ve hedeflerinizi analiz ediyoruz.'
        },
        {
          question: 'Kapsamlı pazar araştırması ne kadar tutar?',
          answer: 'Pazar araştırması maliyetleri kapsam, metodoloji ve coğrafi kapsama göre değişir. Temel pazar giriş analizi genellikle 5.000$\'dan başlar, kapsamlı çalışmalar 15.000$ ile 50.000$+ arasında değişebilir.'
        },
        {
          question: 'Pazar araştırmasının tamamlanması ne kadar sürer?',
          answer: 'Araştırma zaman çizelgeleri genellikle çalışma karmaşıklığına ve veri toplama gereksinimlerine bağlı olarak 4-12 hafta arasında değişir. Masa araştırması 4-6 haftada, kapsamlı tüketici araştırması 8-12 hafta sürebilir.'
        },
        {
          question: 'Pazar araştırması için hangi veri kaynaklarını kullanıyorsunuz?',
          answer: 'Endüstri veritabanları, hükümet istatistikleri, tüketici anketleri, uzman görüşmeleri ve özel araştırma ortaklıkları dahil kapsamlı birincil ve ikincil veri kaynaklarını kullanıyoruz.'
        },
        {
          question: 'Araştırma içgörülerinin eyleme geçirilebilir olmasını nasıl sağlıyorsunuz?',
          answer: 'Pazar araştırması teslim edilebilirlerimiz ham veri yerine stratejik önerilere odaklanır. Bulguları özel pazara giriş stratejileri, fiyatlandırma önerileri ve uygulama yol haritalarına çeviriyoruz.'
        },
        {
          question: 'Devam eden pazar izleme sağlıyor musunuz?',
          answer: 'Evet, araştırma yatırımınızdan sürekli değer sağlamak için üç aylık güncellemeler, rekabetçi zeka uyarıları ve yıllık strateji incelemeleri dahil devam eden pazar izleme hizmetleri sunuyoruz.'
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
          description: 'Estratégias abrangentes de entrada no mercado incluindo dimensionamento de demanda, avaliação de rota para mercado, análise de preços e avaliação de parceiros.'
        },
        {
          title: 'Inteligência Competitiva',
          description: 'Análise estratégica de concorrentes cobrindo posicionamento competitivo, métricas de participação de mercado e estratégias de preços.'
        },
        {
          title: 'Pesquisa do Consumidor',
          description: 'Insights avançados do consumidor usando métodos de pesquisa quantitativos e qualitativos para compreensão abrangente do mercado.'
        },
        {
          title: 'Relatórios da Indústria',
          description: 'Análise abrangente da indústria incluindo cálculos de TAM, SAM e SOM com mapeamento detalhado de tendências.'
        },
        {
          title: 'Pesquisa Regulatória',
          description: 'Análise detalhada da paisagem regulatória cobrindo requisitos de conformidade e mudanças regulatórias futuras.'
        },
        {
          title: 'Oportunidades de Parceria',
          description: 'Serviços de identificação de parceria estratégica incluindo avaliação de distribuidores e integradores.'
        }
      ],
      processSteps: [
        {
          title: 'Análise de Mercado',
          description: 'Defina objetivos e escopo; colete dados primários/secundários para quantificar demanda e dinâmicas'
        },
        {
          title: 'Pesquisa Competitiva',
          description: 'Mapeie jogadores, ofertas, preços e posicionamento para revelar oportunidades e ameaças'
        },
        {
          title: 'Desenvolvimento de Estratégia',
          description: 'Traduza descobertas em estratégia de entrada, mensagens e modelo comercial com KPIs'
        },
        {
          title: 'Suporte de Implementação',
          description: 'Auxilie com alcance de parceiros, pilotos e rastreamento para validar resultados'
        }
      ],
      faqs: [
        {
          question: 'Qual abordagem de pesquisa de mercado é melhor para meu negócio?',
          answer: 'A abordagem ótima de pesquisa depende de seus objetivos de expansão, mercados-alvo, orçamento e requisitos de cronograma. Analisamos seu modelo de negócio específico e objetivos para recomendar a metodologia de pesquisa mais eficaz.'
        },
        {
          question: 'Quanto custa pesquisa de mercado abrangente?',
          answer: 'Custos de pesquisa de mercado variam com base em escopo, metodologia e cobertura geográfica. Análise básica de entrada no mercado tipicamente começa de $5.000, enquanto estudos abrangentes podem variar de $15.000 a $50.000+ dependendo da profundidade da pesquisa.'
        },
        {
          question: 'Quanto tempo leva para completar pesquisa de mercado?',
          answer: 'Cronogramas de pesquisa tipicamente variam de 4-12 semanas dependendo da complexidade do estudo e requisitos de coleta de dados. Pesquisa de mesa pode ser completada em 4-6 semanas, enquanto pesquisa abrangente do consumidor pode requerer 8-12 semanas.'
        },
        {
          question: 'Quais fontes de dados vocês usam para pesquisa de mercado?',
          answer: 'Utilizamos fontes abrangentes de dados primários e secundários incluindo bancos de dados da indústria, estatísticas governamentais, pesquisas de consumidores, entrevistas com especialistas e parcerias de pesquisa proprietárias.'
        },
        {
          question: 'Como vocês garantem que insights de pesquisa sejam acionáveis?',
          answer: 'Nossos entregáveis de pesquisa de mercado focam em recomendações estratégicas em vez de dados brutos. Traduzimos descobertas em estratégias específicas de entrada no mercado, recomendações de preços e roadmaps de implementação.'
        },
        {
          question: 'Vocês fornecem monitoramento contínuo de mercado?',
          answer: 'Sim, oferecemos serviços de monitoramento contínuo de mercado incluindo atualizações trimestrais, alertas de inteligência competitiva e revisões anuais de estratégia para garantir valor contínuo do seu investimento em pesquisa.'
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
                <Button size="lg" className="bg-pink-600 text-white hover:bg-pink-700">
                  {t('getStarted')}
                </Button>
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
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>
                
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
            {[
              { name: 'United Arab Emirates', flag: '🇦🇪', tag: 'GCC Hub', highlight: 'Gateway to Gulf demand with strong B2B ecosystems', slug: 'uae' },
              { name: 'Estonia', flag: '🇪🇪', tag: 'Digital First', highlight: 'EU market with advanced digital infrastructure', slug: 'estonia' },
              { name: 'Georgia', flag: '🇬🇪', tag: 'Growth', highlight: 'Fast-moving market for testing strategies', slug: 'georgia' },
              { name: 'Malta', flag: '🇲🇹', tag: 'EU Hub', highlight: 'EU access for regulated sectors', slug: 'malta' },
              { name: 'Panama', flag: '🇵🇦', tag: 'Logistics', highlight: 'Canal-driven logistics and LATAM gateway', slug: 'panama' },
              { name: 'Portugal', flag: '🇵🇹', tag: 'EU Access', highlight: 'Rising tech hub with consumer datasets', slug: 'portugal' },
              { name: 'United States', flag: '🇺🇸', tag: 'Markets', highlight: 'Deepest datasets and competitive benchmarks', slug: 'usa' },
              { name: 'Switzerland', flag: '🇨🇭', tag: 'Premium', highlight: 'High-value niches with rigorous data', slug: 'switzerland' },
              { name: 'Montenegro', flag: '🇲🇪', tag: 'Emerging', highlight: 'Cost-efficient testing ground', slug: 'montenegro' }
            ].map((country, index) => (
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
      <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{currentContent.ctaTitle}</h2>
          <p className="text-xl text-pink-100 mb-8">
            {currentContent.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
              {t('getStarted')}
            </Button>
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