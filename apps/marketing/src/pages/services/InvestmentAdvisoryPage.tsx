import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Target, DollarSign, Globe, Shield, Sparkles, Landmark, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';
import { useState } from 'react';

const InvestmentAdvisoryPage = () => {
  const { t, language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const content = {
    en: {
      heroTitle: 'Investment Advisory Services – Grow Your Wealth Globally',
      heroDescription: 'Maximize long-term returns with disciplined, globally diversified strategies. Our advisors deliver tailored asset allocation, risk management, and access to qualified opportunities across public and private markets.',
      whatWeOfferTitle: 'What We Offer',
      whatWeOfferDescription: 'Professional investment advisory services for sophisticated investors',
      processTitle: 'Our Investment Advisory Process',
      processDescription: 'Systematic approach to building and managing your investment portfolio',
      jurisdictionsTitle: 'Premier Investment Jurisdictions',
      jurisdictionsDescription: 'Leading financial centers for investment management and wealth preservation',
      faqTitle: 'Frequently Asked Questions',
      faqDescription: 'Common questions about investment advisory services and wealth management strategies',
      ctaTitle: 'Ready to Grow Your Wealth?',
      ctaDescription: 'Get expert investment guidance for your wealth management goals',
      services: [
        {
          title: 'Portfolio Management',
          description: 'Professional portfolio management services with disciplined asset allocation and global diversification strategies. Our investment advisory specialists design customized portfolios that balance risk and return objectives while maintaining liquidity requirements.'
        },
        {
          title: 'Alternative Investments',
          description: 'Exclusive access to alternative investments including private equity, hedge funds, real estate funds, and other institutional-quality opportunities. Our investment advisory team conducts thorough due diligence on alternative investment managers and structures.'
        },
        {
          title: 'Real Estate Investment',
          description: 'International real estate investment opportunities across premier global markets with comprehensive property management and optimization services. Our real estate investment specialists identify high-quality commercial and residential properties.'
        },
        {
          title: 'Cryptocurrency Advisory',
          description: 'Professional cryptocurrency advisory services with comprehensive regulatory compliance and risk management frameworks. Our crypto compliance specialists provide strategic guidance on digital asset allocation, custody solutions, and tax-efficient structures.'
        },
        {
          title: 'ESG Investing',
          description: 'Environmental, social, and governance focused investment strategies that align financial returns with sustainable impact objectives. Our ESG investing specialists identify opportunities that meet strict sustainability criteria while delivering competitive investment performance.'
        },
        {
          title: 'Wealth Planning',
          description: 'Comprehensive wealth planning services including estate planning, tax optimization, and intergenerational wealth transfer strategies. Our wealth planning specialists design sophisticated structures that preserve and grow family wealth across generations.'
        }
      ],
      processSteps: [
        {
          title: 'Portfolio Analysis',
          description: 'Assess objectives, constraints, liquidity needs, and current exposures across asset classes and currencies'
        },
        {
          title: 'Strategy Development',
          description: 'Design a policy portfolio with risk budgets, benchmarks, and rebalancing rules tailored to goals'
        },
        {
          title: 'Implementation',
          description: 'Execute across vetted managers and platforms; optimize fees, execution, and tax efficiency'
        },
        {
          title: 'Performance Monitoring',
          description: 'Ongoing reporting, variance analysis, and quarterly reviews to adjust the strategy'
        }
      ],
      faqs: [
        {
          question: 'What are the minimum investment requirements?',
          answer: 'Investment minimums vary by strategy and jurisdiction, typically starting from $100,000 for managed portfolios and $250,000 for alternative investments. Our investment advisory team works with qualified investors to design appropriate allocation strategies.'
        },
        {
          question: 'How do you ensure proper portfolio diversification?',
          answer: 'We implement systematic diversification across asset classes, geographies, currencies, and investment styles to optimize risk-adjusted returns. Our portfolio management approach uses modern portfolio theory combined with alternative investments to reduce correlation and enhance long-term performance.'
        },
        {
          question: 'What alternative investments do you offer access to?',
          answer: 'Our alternative investments platform provides access to private equity, hedge funds, real estate funds, commodities, and other institutional opportunities. We conduct thorough due diligence on all alternative investment managers and structures.'
        },
        {
          question: 'How do you optimize tax efficiency in investment portfolios?',
          answer: 'We integrate tax-efficient investment strategies including asset location optimization, tax-loss harvesting, and jurisdiction-specific structures to minimize tax drag on investment returns. Our wealth planning specialists coordinate with tax advisors to ensure investment advisory services align with overall tax optimization objectives.'
        },
        {
          question: 'What ESG investing options are available?',
          answer: 'Our ESG investing platform offers comprehensive sustainable investment strategies that integrate environmental, social, and governance factors with financial analysis. We provide access to ESG-focused funds, impact investments, and sustainable alternative investments that meet strict sustainability criteria.'
        },
        {
          question: 'How do you report investment performance?',
          answer: 'We provide comprehensive performance reporting including portfolio analytics, benchmark comparisons, and risk metrics on a quarterly basis. Our investment advisory platform delivers real-time portfolio monitoring with detailed attribution analysis and variance reporting.'
        }
      ]
    },
    tr: {
      heroTitle: 'Yatırım Danışmanlığı Hizmetleri – Servetinizi Küresel Olarak Büyütün',
      heroDescription: 'Disiplinli, küresel olarak çeşitlendirilmiş stratejilerle uzun vadeli getirileri maksimize edin. Danışmanlarımız kamu ve özel piyasalarda özel varlık tahsisi, risk yönetimi ve nitelikli fırsatlara erişim sunar.',
      whatWeOfferTitle: 'Neler Sunuyoruz',
      whatWeOfferDescription: 'Sofistike yatırımcılar için profesyonel yatırım danışmanlığı hizmetleri',
      processTitle: 'Yatırım Danışmanlığı Sürecimiz',
      processDescription: 'Yatırım portföyünüzü oluşturma ve yönetme için sistematik yaklaşım',
      jurisdictionsTitle: 'Önde Gelen Yatırım Yargı Alanları',
      jurisdictionsDescription: 'Yatırım yönetimi ve servet korunması için önde gelen finansal merkezler',
      faqTitle: 'Sık Sorulan Sorular',
      faqDescription: 'Yatırım danışmanlığı hizmetleri ve servet yönetimi stratejileri hakkında yaygın sorular',
      ctaTitle: 'Servetinizi Büyütmeye Hazır mısınız?',
      ctaDescription: 'Servet yönetimi hedefleriniz için uzman yatırım rehberliği alın',
      services: [
        {
          title: 'Portföy Yönetimi',
          description: 'Disiplinli varlık tahsisi ve küresel çeşitlendirme stratejileri ile profesyonel portföy yönetimi hizmetleri. Yatırım danışmanlığı uzmanlarımız likidite gereksinimlerini sürdürürken risk ve getiri hedeflerini dengeleyen özelleştirilmiş portföyler tasarlar.'
        },
        {
          title: 'Alternatif Yatırımlar',
          description: 'Özel sermaye, hedge fonları, gayrimenkul fonları ve diğer kurumsal kalite fırsatları dahil alternatif yatırımlara özel erişim. Yatırım danışmanlığı ekibimiz alternatif yatırım yöneticileri ve yapıları üzerinde kapsamlı durum tespiti yapar.'
        },
        {
          title: 'Gayrimenkul Yatırımı',
          description: 'Kapsamlı mülk yönetimi ve optimizasyon hizmetleri ile önde gelen küresel pazarlarda uluslararası gayrimenkul yatırım fırsatları. Gayrimenkul yatırım uzmanlarımız yüksek kaliteli ticari ve konut mülkleri belirler.'
        },
        {
          title: 'Kripto Para Danışmanlığı',
          description: 'Kapsamlı düzenleyici uyumluluk ve risk yönetimi çerçeveleri ile profesyonel kripto para danışmanlığı hizmetleri. Kripto uyumluluk uzmanlarımız dijital varlık tahsisi, saklama çözümleri ve vergi verimli yapılar konusunda stratejik rehberlik sağlar.'
        },
        {
          title: 'ESG Yatırımı',
          description: 'Finansal getirileri sürdürülebilir etki hedefleriyle hizalayan çevresel, sosyal ve yönetişim odaklı yatırım stratejileri. ESG yatırım uzmanlarımız rekabetçi yatırım performansı sunarken sıkı sürdürülebilirlik kriterlerini karşılayan fırsatları belirler.'
        },
        {
          title: 'Servet Planlaması',
          description: 'Emlak planlaması, vergi optimizasyonu ve nesiller arası servet transfer stratejileri dahil kapsamlı servet planlama hizmetleri. Servet planlama uzmanlarımız nesiller boyunca aile servetini koruyan ve büyüten sofistike yapılar tasarlar.'
        }
      ],
      processSteps: [
        {
          title: 'Portföy Analizi',
          description: 'Varlık sınıfları ve para birimleri boyunca hedefleri, kısıtlamaları, likidite ihtiyaçlarını ve mevcut maruziyetleri değerlendirin'
        },
        {
          title: 'Strateji Geliştirme',
          description: 'Hedeflere göre uyarlanmış risk bütçeleri, kıyaslamalar ve yeniden dengeleme kuralları ile bir politika portföyü tasarlayın'
        },
        {
          title: 'Uygulama',
          description: 'Doğrulanmış yöneticiler ve platformlar arasında yürütün; ücretleri, uygulamayı ve vergi verimliliğini optimize edin'
        },
        {
          title: 'Performans İzleme',
          description: 'Stratejiyi ayarlamak için devam eden raporlama, varyans analizi ve üç aylık incelemeler'
        }
      ],
      faqs: [
        {
          question: 'Minimum yatırım gereksinimleri nelerdir?',
          answer: 'Yatırım minimumlari strateji ve yargı alanına göre değişir, genellikle yönetilen portföyler için 100.000$ ve alternatif yatırımlar için 250.000$ dan başlar. Yatırım danışmanlığı ekibimiz uygun tahsis stratejileri tasarlamak için nitelikli yatırımcılarla çalışır.'
        },
        {
          question: 'Uygun portföy çeşitlendirmesini nasıl sağlıyorsunuz?',
          answer: 'Risk ayarlı getirileri optimize etmek için varlık sınıfları, coğrafyalar, para birimleri ve yatırım stilleri boyunca sistematik çeşitlendirme uyguluyoruz. Portföy yönetimi yaklaşımımız korelasyonu azaltmak ve uzun vadeli performansı artırmak için alternatif yatırımlarla birleştirilmiş modern portföy teorisi kullanır.'
        },
        {
          question: 'Hangi alternatif yatırımlara erişim sağlıyorsunuz?',
          answer: 'Alternatif yatırımlar platformumuz özel sermaye, hedge fonları, gayrimenkul fonları, emtialar ve diğer kurumsal fırsatlara erişim sağlar. Tüm alternatif yatırım yöneticileri ve yapıları üzerinde kapsamlı durum tespiti yapıyoruz.'
        },
        {
          question: 'Yatırım portföylerinde vergi verimliliğini nasıl optimize ediyorsunuz?',
          answer: 'Yatırım getirilerinde vergi sürüklemesini minimize etmek için varlık konumu optimizasyonu, vergi kaybı hasadı ve yargı alanına özgü yapılar dahil vergi verimli yatırım stratejileri entegre ediyoruz. Servet planlama uzmanlarımız yatırım danışmanlığı hizmetlerinin genel vergi optimizasyon hedefleriyle uyumlu olmasını sağlamak için vergi danışmanlarıyla koordine olur.'
        },
        {
          question: 'Hangi ESG yatırım seçenekleri mevcut?',
          answer: 'ESG yatırım platformumuz çevresel, sosyal ve yönetişim faktörlerini finansal analizle entegre eden kapsamlı sürdürülebilir yatırım stratejileri sunar. Sıkı sürdürülebilirlik kriterlerini karşılayan ESG odaklı fonlar, etki yatırımları ve sürdürülebilir alternatif yatırımlara erişim sağlıyoruz.'
        },
        {
          question: 'Yatırım performansını nasıl raporluyorsunuz?',
          answer: 'Üç aylık bazda portföy analitiği, kıyaslama karşılaştırmaları ve risk metrikleri dahil kapsamlı performans raporlaması sağlıyoruz. Yatırım danışmanlığı platformumuz detaylı atıf analizi ve varyans raporlaması ile gerçek zamanlı portföy izleme sunar.'
        }
      ]
    },
    pt: {
      heroTitle: 'Serviços de Consultoria de Investimento – Faça Sua Riqueza Crescer Globalmente',
      heroDescription: 'Maximize retornos de longo prazo com estratégias disciplinadas e globalmente diversificadas. Nossos consultores entregam alocação de ativos sob medida, gestão de risco e acesso a oportunidades qualificadas em mercados públicos e privados.',
      whatWeOfferTitle: 'O Que Oferecemos',
      whatWeOfferDescription: 'Serviços profissionais de consultoria de investimento para investidores sofisticados',
      processTitle: 'Nosso Processo de Consultoria de Investimento',
      processDescription: 'Abordagem sistemática para construir e gerenciar seu portfólio de investimentos',
      jurisdictionsTitle: 'Principais Jurisdições de Investimento',
      jurisdictionsDescription: 'Centros financeiros líderes para gestão de investimentos e preservação de riqueza',
      faqTitle: 'Perguntas Frequentes',
      faqDescription: 'Perguntas comuns sobre serviços de consultoria de investimento e estratégias de gestão de patrimônio',
      ctaTitle: 'Pronto para Fazer Sua Riqueza Crescer?',
      ctaDescription: 'Obtenha orientação especializada em investimentos para seus objetivos de gestão de patrimônio',
      services: [
        {
          title: 'Gestão de Portfólio',
          description: 'Serviços profissionais de gestão de portfólio com alocação disciplinada de ativos e estratégias de diversificação global. Nossos especialistas em consultoria de investimento projetam portfólios customizados que equilibram objetivos de risco e retorno mantendo requisitos de liquidez.'
        },
        {
          title: 'Investimentos Alternativos',
          description: 'Acesso exclusivo a investimentos alternativos incluindo private equity, hedge funds, fundos imobiliários e outras oportunidades de qualidade institucional. Nossa equipe de consultoria de investimento conduz due diligence completa em gestores e estruturas de investimento alternativo.'
        },
        {
          title: 'Investimento Imobiliário',
          description: 'Oportunidades de investimento imobiliário internacional em mercados globais premium com serviços abrangentes de gestão e otimização de propriedades. Nossos especialistas em investimento imobiliário identificam propriedades comerciais e residenciais de alta qualidade.'
        },
        {
          title: 'Consultoria em Criptomoedas',
          description: 'Serviços profissionais de consultoria em criptomoedas com estruturas abrangentes de conformidade regulatória e gestão de risco. Nossos especialistas em conformidade cripto fornecem orientação estratégica sobre alocação de ativos digitais, soluções de custódia e estruturas fiscalmente eficientes.'
        },
        {
          title: 'Investimento ESG',
          description: 'Estratégias de investimento focadas em meio ambiente, social e governança que alinham retornos financeiros com objetivos de impacto sustentável. Nossos especialistas em investimento ESG identificam oportunidades que atendem critérios rigorosos de sustentabilidade entregando performance competitiva de investimento.'
        },
        {
          title: 'Planejamento de Patrimônio',
          description: 'Serviços abrangentes de planejamento de patrimônio incluindo planejamento patrimonial, otimização fiscal e estratégias de transferência de riqueza intergeracional. Nossos especialistas em planejamento de patrimônio projetam estruturas sofisticadas que preservam e fazem crescer riqueza familiar através de gerações.'
        }
      ],
      processSteps: [
        {
          title: 'Análise de Portfólio',
          description: 'Avalie objetivos, restrições, necessidades de liquidez e exposições atuais em classes de ativos e moedas'
        },
        {
          title: 'Desenvolvimento de Estratégia',
          description: 'Projete um portfólio de política com orçamentos de risco, benchmarks e regras de rebalanceamento adaptadas aos objetivos'
        },
        {
          title: 'Implementação',
          description: 'Execute através de gestores e plataformas verificados; otimize taxas, execução e eficiência fiscal'
        },
        {
          title: 'Monitoramento de Performance',
          description: 'Relatórios contínuos, análise de variância e revisões trimestrais para ajustar a estratégia'
        }
      ],
      faqs: [
        {
          question: 'Quais são os requisitos mínimos de investimento?',
          answer: 'Mínimos de investimento variam por estratégia e jurisdição, tipicamente começando de $100.000 para portfólios gerenciados e $250.000 para investimentos alternativos. Nossa equipe de consultoria de investimento trabalha com investidores qualificados para projetar estratégias de alocação apropriadas.'
        },
        {
          question: 'Como vocês garantem diversificação adequada de portfólio?',
          answer: 'Implementamos diversificação sistemática através de classes de ativos, geografias, moedas e estilos de investimento para otimizar retornos ajustados ao risco. Nossa abordagem de gestão de portfólio usa teoria moderna de portfólio combinada com investimentos alternativos para reduzir correlação e melhorar performance de longo prazo.'
        },
        {
          question: 'A quais investimentos alternativos vocês oferecem acesso?',
          answer: 'Nossa plataforma de investimentos alternativos fornece acesso a private equity, hedge funds, fundos imobiliários, commodities e outras oportunidades institucionais. Conduzimos due diligence completa em todos os gestores e estruturas de investimento alternativo.'
        },
        {
          question: 'Como vocês otimizam eficiência fiscal em portfólios de investimento?',
          answer: 'Integramos estratégias de investimento fiscalmente eficientes incluindo otimização de localização de ativos, colheita de perdas fiscais e estruturas específicas de jurisdição para minimizar arrasto fiscal em retornos de investimento. Nossos especialistas em planejamento de patrimônio coordenam com consultores fiscais para garantir que serviços de consultoria de investimento se alinhem com objetivos gerais de otimização fiscal.'
        },
        {
          question: 'Quais opções de investimento ESG estão disponíveis?',
          answer: 'Nossa plataforma de investimento ESG oferece estratégias abrangentes de investimento sustentável que integram fatores ambientais, sociais e de governança com análise financeira. Fornecemos acesso a fundos focados em ESG, investimentos de impacto e investimentos alternativos sustentáveis que atendem critérios rigorosos de sustentabilidade.'
        },
        {
          question: 'Como vocês relatam performance de investimento?',
          answer: 'Fornecemos relatórios abrangentes de performance incluindo análises de portfólio, comparações de benchmark e métricas de risco em base trimestral. Nossa plataforma de consultoria de investimento entrega monitoramento de portfólio em tempo real com análise detalhada de atribuição e relatórios de variância.'
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
      <section className="relative bg-gradient-to-r from-red-600 to-pink-600 text-white py-8 overflow-hidden">
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
              <p className="text-xl text-red-100 leading-relaxed mb-8">
                {currentContent.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-red-600 text-white hover:bg-red-700">
                  {t('getStarted')}
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                  {t('scheduleConsultation')}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Investment advisory"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FidelKey Promo */}
      <section className="py-8" aria-labelledby="fidelkey-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/8293687/pexels-photo-8293687.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-700/90 via-purple-700/85 to-rose-600/80" />
            </div>

            {/* Content */}
            <div className="relative p-6 md:p-8 lg:p-10 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 ring-1 ring-white/25 text-sm font-semibold mb-4">
                <span>🔷 Premium</span>
              </div>

              <h3 id="fidelkey-title" className="text-2xl md:text-3xl font-bold leading-tight">
                FidelKey — Secured Title Investment System
              </h3>
              <p className="mt-3 text-white/90 max-w-3xl">
                International visa pathways, financial returns, and real-estate ownership
                through a collateralized title model designed for compliant cross-border investing.
              </p>

              {/* Bullets */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-sm">Secured title structure</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-white" />
                  <span className="text-sm">International visa/residency options</span>
                </div>
                <div className="flex items-center gap-3">
                  <Landmark className="w-5 h-5 text-white" />
                  <span className="text-sm">Rental/dividend yield potential</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <a
                  href="https://fidelkey.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button size="lg" className="bg-amber-400 text-black hover:bg-amber-300">
                    Explore FidelKey
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
                    src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {index === 0 && <TrendingUp className="w-6 h-6 text-white" />}
                    {index === 1 && <BarChart3 className="w-6 h-6 text-white" />}
                    {index === 2 && <PieChart className="w-6 h-6 text-white" />}
                    {index === 3 && <Target className="w-6 h-6 text-white" />}
                  </div>
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
              { name: 'United Arab Emirates', flag: '🇦🇪', tag: 'Free Zones', highlight: 'Access ADGM/DIFC ecosystem and global markets', slug: 'uae' },
              { name: 'Estonia', flag: '🇪🇪', tag: 'Digital First', highlight: 'EU access with advanced digital infrastructure', slug: 'estonia' },
              { name: 'Georgia', flag: '🇬🇪', tag: 'Growth', highlight: 'Efficient setup and favorable operating environment', slug: 'georgia' },
              { name: 'Malta', flag: '🇲🇹', tag: 'EU Hub', highlight: 'EU-compliant structures supporting funds and SPVs', slug: 'malta' },
              { name: 'Panama', flag: '🇵🇦', tag: 'Territorial', highlight: 'Territorial system with international banking links', slug: 'panama' },
              { name: 'Portugal', flag: '🇵🇹', tag: 'EU Access', highlight: 'EU market access and investor residency routes', slug: 'portugal' },
              { name: 'United States', flag: '🇺🇸', tag: 'Markets', highlight: 'Deepest capital markets and manager universe', slug: 'usa' },
              { name: 'Switzerland', flag: '🇨🇭', tag: 'Premium', highlight: 'Top-tier wealth management and stability', slug: 'switzerland' },
              { name: 'Montenegro', flag: '🇲🇪', tag: 'Residency', highlight: 'Business-friendly policies with residency options', slug: 'montenegro' }
            ].map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className="bg-red-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-bold text-red-900">{country.tag}</div>
                    <div className="text-xs text-red-700">{country.highlight}</div>
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
      <section className="py-16 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{currentContent.ctaTitle}</h2>
          <p className="text-xl text-red-100 mb-8">
            {currentContent.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              {t('getStarted')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              {t('scheduleConsultation')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestmentAdvisoryPage;