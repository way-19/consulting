import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Globe, CheckCircle, Users, Clock, Shield, Zap, CreditCard, FileText, Target, Bot, TrendingUp, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';
import { useState } from 'react';

const CompanyFormationPage = () => {
  const { t, language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const content = {
    en: {
      heroTitle: 'Global Company Formation – From Idea to Incorporation',
      heroDescription: 'Establish your business in 19+ countries with expert legal guidance and AI-powered process automation. Fast and compliant incorporation with full banking support.',
      whatWeOfferTitle: 'Comprehensive Company Formation Services',
      whatWeOfferDescription: 'End-to-end business setup solutions with AI-powered jurisdiction analysis and local expert support',
      whyChooseTitle: 'Why Choose Consulting19 for Company Formation?',
      whyChooseDescription: 'Combining global expertise with local knowledge and AI automation for seamless business setup',
      howItWorksTitle: 'How Our Global Company Formation Works',
      howItWorksDescription: 'Simple 4-step process from jurisdiction selection to operational business setup',
      jurisdictionsTitle: 'Best Jurisdictions for Fast Company Registration',
      jurisdictionsDescription: 'Fast company registration in business-friendly jurisdictions',
      faqTitle: 'Frequently Asked Questions',
      faqDescription: 'Common questions about offshore incorporation and global business setup',
      ctaTitle: 'Ready to Start Your Company?',
      ctaDescription: 'Get expert guidance for your international business formation',
      services: [
        {
          title: 'LLC & Corporation Formation',
          description: 'Professional LLC and corporation formation services across multiple jurisdictions. We handle all legal documentation, regulatory filings, and compliance requirements to establish your business entity with complete liability protection.'
        },
        {
          title: 'Offshore Company Registration',
          description: 'Strategic offshore incorporation in business-friendly jurisdictions with favorable tax structures. Our offshore setup services include complete legal documentation, regulatory compliance, and ongoing support.'
        },
        {
          title: 'Jurisdiction Analysis',
          description: 'Advanced AI-powered jurisdiction analysis that evaluates tax implications, regulatory requirements, and business advantages across 19+ countries.'
        },
        {
          title: 'Digital Identity & e-Residency',
          description: 'Complete digital identity solutions including Estonia e-Residency program for 100% online business management. Access EU markets through digital business identity programs.'
        },
        {
          title: 'Banking & Payment Solutions',
          description: 'Comprehensive corporate banking solutions including business account opening, multi-currency accounts, and international payment processing setup.'
        },
        {
          title: 'Holding Company Structures',
          description: 'Sophisticated holding company structures designed for asset protection, tax optimization, and international business expansion.'
        },
        {
          title: 'Compliance Monitoring',
          description: 'Automated compliance monitoring services that track regulatory deadlines, filing requirements, and ongoing obligations across all jurisdictions.'
        },
        {
          title: 'AI-Assistant Integration',
          description: 'Intelligent AI assistant integration for automated document management, compliance deadline tracking, and real-time business guidance.'
        }
      ],
      whyChooseUs: [
        {
          title: 'Global + Local Expertise',
          description: 'Local specialists in 19+ countries combined with AI-powered global insights. Our clients benefit from jurisdiction-specific knowledge and automated workflows that streamline the entire company formation process.'
        },
        {
          title: '500+ Successful Setups',
          description: '98% success rate with over 500 companies formed across multiple jurisdictions. Our proven track record demonstrates consistent delivery of fast company registration with complete legal compliance and banking integration.'
        },
        {
          title: 'AI-Powered Automation',
          description: 'Smart document tracking, compliance deadlines, and automated progress updates. Our clients save time and money with automated document workflows and jurisdiction-specific insights that eliminate manual processes and reduce formation timelines.'
        },
        {
          title: 'Transparent & Cost-Effective',
          description: 'Clear pricing with no hidden fees and competitive rates for premium services. Our transparent fee structure and efficient processes deliver exceptional value for global business setup and offshore incorporation services.'
        }
      ],
      processSteps: [
        {
          title: 'Choose Your Jurisdiction',
          description: 'Select the country that best fits your goals with expert recommendations and AI-powered jurisdiction analysis'
        },
        {
          title: 'Free Expert Consultation',
          description: 'Discuss your needs with our advisors for personalized guidance and strategic business planning'
        },
        {
          title: 'Fast Company Setup',
          description: 'Complete incorporation in as little as 14 days with AI-supported compliance and legal documentation'
        },
        {
          title: 'Banking & Operations',
          description: 'Open bank accounts and enable operations with integrated financial solutions and payment processing'
        }
      ],
      faqs: [
        {
          question: 'Is offshore company formation legal?',
          answer: 'Yes, offshore incorporation is fully legal when structured within international compliance standards. Consulting19 ensures your setup follows jurisdiction-specific laws while offering global banking access. Many multinational corporations use offshore structures for tax optimization, asset protection, and international expansion through legitimate business purposes and proper regulatory compliance.'
        },
        {
          question: 'What are the annual reporting requirements?',
          answer: 'Annual reporting requirements vary significantly by jurisdiction and business structure. Most countries require annual financial statements, tax returns, and corporate registry updates to maintain good standing. Our automated compliance monitoring service tracks all regulatory deadlines and ensures timely submissions. We provide ongoing support for all compliance services including filing requirements, regulatory updates, and deadline management.'
        },
        {
          question: 'What banking options are available?',
          answer: 'We provide access to corporate banking in major financial centers including UAE, Estonia, Switzerland, and other business-friendly jurisdictions. Banking options include traditional banks, digital banking solutions, and multi-currency accounts with international payment processing. Our banking specialists facilitate account opening procedures and ensure your company formation includes complete financial infrastructure setup.'
        },
        {
          question: 'What are the total costs for company formation?',
          answer: 'Company formation costs vary by jurisdiction and services required for complete business setup. Basic offshore incorporation starts from $1,500 (Georgia) to $5,000+ (UAE/Switzerland) including government fees, legal documentation, and our comprehensive service fees. We provide transparent pricing with no hidden costs, and our AI-powered process automation helps reduce overall formation expenses while maintaining premium service quality.'
        },
        {
          question: 'How long does the entire process take?',
          answer: 'Fast company registration timelines depend on jurisdiction complexity and documentation completeness. Quick jurisdictions like Estonia (1-2 weeks) and Georgia (3-5 days) offer the fastest incorporation processes. More comprehensive setups in UAE or Switzerland typically take 2-6 weeks including banking and compliance services. Our AI-powered automation and real-time progress tracking ensure efficient processing throughout the entire company formation journey.'
        }
      ]
    },
    tr: {
      heroTitle: 'Küresel Şirket Kuruluşu – Fikirden Kuruluşa',
      heroDescription: '19+ ülkede uzman hukuki rehberlik ve AI destekli süreç otomasyonu ile işinizi kurun. Tam bankacılık desteği ile hızlı ve uyumlu kuruluş.',
      whatWeOfferTitle: 'Kapsamlı Şirket Kuruluş Hizmetleri',
      whatWeOfferDescription: 'AI destekli yargı alanı analizi ve yerel uzman desteği ile uçtan uca iş kurulum çözümleri',
      whyChooseTitle: 'Şirket Kuruluşu için Neden Consulting19\'u Seçmelisiniz?',
      whyChooseDescription: 'Sorunsuz iş kurulumu için küresel uzmanlığı yerel bilgi ve AI otomasyonu ile birleştirme',
      howItWorksTitle: 'Küresel Şirket Kuruluşumuz Nasıl Çalışır',
      howItWorksDescription: 'Yargı alanı seçiminden operasyonel iş kurulumuna basit 4 adımlı süreç',
      jurisdictionsTitle: 'Hızlı Şirket Kaydı için En İyi Yargı Alanları',
      jurisdictionsDescription: 'İş dostu yargı alanlarında hızlı şirket kaydı',
      faqTitle: 'Sık Sorulan Sorular',
      faqDescription: 'Offshore kuruluş ve küresel iş kurulumu hakkında yaygın sorular',
      ctaTitle: 'Şirketinizi Kurmaya Hazır mısınız?',
      ctaDescription: 'Uluslararası iş kuruluşunuz için uzman rehberlik alın',
      services: [
        {
          title: 'LLC ve Şirket Kuruluşu',
          description: 'Birden fazla yargı alanında profesyonel LLC ve şirket kuruluş hizmetleri. Tam sorumluluk koruması ile iş varlığınızı kurmak için tüm yasal dokümantasyon, düzenleyici dosyalamalar ve uyumluluk gereksinimlerini ele alıyoruz.'
        },
        {
          title: 'Offshore Şirket Kaydı',
          description: 'Uygun vergi yapıları ile iş dostu yargı alanlarında stratejik offshore kuruluş. Offshore kurulum hizmetlerimiz tam yasal dokümantasyon, düzenleyici uyumluluk ve devam eden destek içerir.'
        },
        {
          title: 'Yargı Alanı Analizi',
          description: '19+ ülke boyunca vergi etkilerini, düzenleyici gereksinimleri ve iş avantajlarını değerlendiren gelişmiş AI destekli yargı alanı analizi.'
        },
        {
          title: 'Dijital Kimlik ve e-İkamet',
          description: '%100 online iş yönetimi için Estonya e-İkamet programı dahil tam dijital kimlik çözümleri. Dijital iş kimlik programları aracılığıyla AB pazarlarına erişim.'
        },
        {
          title: 'Bankacılık ve Ödeme Çözümleri',
          description: 'İş hesabı açma, çok para birimli hesaplar ve uluslararası ödeme işleme kurulumu dahil kapsamlı kurumsal bankacılık çözümleri.'
        },
        {
          title: 'Holding Şirketi Yapıları',
          description: 'Varlık korunması, vergi optimizasyonu ve uluslararası iş genişlemesi için tasarlanmış sofistike holding şirketi yapıları.'
        },
        {
          title: 'Uyumluluk İzleme',
          description: 'Tüm yargı alanlarında düzenleyici son tarihleri, dosyalama gereksinimlerini ve devam eden yükümlülükleri takip eden otomatik uyumluluk izleme hizmetleri.'
        },
        {
          title: 'AI Asistan Entegrasyonu',
          description: 'Otomatik belge yönetimi, uyumluluk son tarih takibi ve gerçek zamanlı iş rehberliği için akıllı AI asistan entegrasyonu.'
        }
      ],
      whyChooseUs: [
        {
          title: 'Küresel + Yerel Uzmanlık',
          description: 'AI destekli küresel içgörülerle birleştirilmiş 19+ ülkede yerel uzmanlar. Müşterilerimiz tüm şirket kuruluş sürecini kolaylaştıran yargı alanına özgü bilgi ve otomatik iş akışlarından yararlanır.'
        },
        {
          title: '500+ Başarılı Kurulum',
          description: 'Birden fazla yargı alanında kurulan 500\'den fazla şirketle %98 başarı oranı. Kanıtlanmış sicilimiz tam yasal uyumluluk ve bankacılık entegrasyonu ile hızlı şirket kaydının tutarlı teslimatını gösterir.'
        },
        {
          title: 'AI Destekli Otomasyon',
          description: 'Akıllı belge takibi, uyumluluk son tarihleri ve otomatik ilerleme güncellemeleri. Müşterilerimiz manuel süreçleri ortadan kaldıran ve kuruluş zaman çizelgelerini azaltan otomatik belge iş akışları ve yargı alanına özgü içgörülerle zaman ve para tasarrufu sağlar.'
        },
        {
          title: 'Şeffaf ve Uygun Maliyetli',
          description: 'Premium hizmetler için gizli ücret olmayan net fiyatlandırma ve rekabetçi oranlar. Şeffaf ücret yapımız ve verimli süreçlerimiz küresel iş kurulumu ve offshore kuruluş hizmetleri için olağanüstü değer sunar.'
        }
      ],
      processSteps: [
        {
          title: 'Yargı Alanınızı Seçin',
          description: 'Uzman önerileri ve AI destekli yargı alanı analizi ile hedeflerinize en uygun ülkeyi seçin'
        },
        {
          title: 'Ücretsiz Uzman Danışmanlığı',
          description: 'Kişiselleştirilmiş rehberlik ve stratejik iş planlaması için danışmanlarımızla ihtiyaçlarınızı görüşün'
        },
        {
          title: 'Hızlı Şirket Kurulumu',
          description: 'AI destekli uyumluluk ve yasal dokümantasyon ile 14 gün gibi kısa sürede tam kuruluş'
        },
        {
          title: 'Bankacılık ve Operasyonlar',
          description: 'Entegre finansal çözümler ve ödeme işleme ile banka hesapları açın ve operasyonları etkinleştirin'
        }
      ],
      faqs: [
        {
          question: 'Offshore şirket kuruluşu yasal mı?',
          answer: 'Evet, offshore kuruluş uluslararası uyumluluk standartları çerçevesinde yapılandırıldığında tamamen yasaldır. Consulting19 kurulumunuzun küresel bankacılık erişimi sunarken yargı alanına özgü yasaları takip etmesini sağlar. Birçok çok uluslu şirket meşru iş amaçları ve uygun düzenleyici uyumluluk yoluyla vergi optimizasyonu, varlık korunması ve uluslararası genişleme için offshore yapılar kullanır.'
        },
        {
          question: 'Yıllık raporlama gereksinimleri nelerdir?',
          answer: 'Yıllık raporlama gereksinimleri yargı alanı ve iş yapısına göre önemli ölçüde değişir. Çoğu ülke iyi durumda kalmak için yıllık mali tablolar, vergi beyannameleri ve kurumsal kayıt güncellemeleri gerektirir. Otomatik uyumluluk izleme hizmetimiz tüm düzenleyici son tarihleri takip eder ve zamanında sunumları sağlar. Dosyalama gereksinimleri, düzenleyici güncellemeler ve son tarih yönetimi dahil tüm uyumluluk hizmetleri için devam eden destek sağlıyoruz.'
        },
        {
          question: 'Hangi bankacılık seçenekleri mevcut?',
          answer: 'BAE, Estonya, İsviçre ve diğer iş dostu yargı alanları dahil büyük finansal merkezlerde kurumsal bankacılığa erişim sağlıyoruz. Bankacılık seçenekleri geleneksel bankalar, dijital bankacılık çözümleri ve uluslararası ödeme işleme ile çok para birimli hesapları içerir. Bankacılık uzmanlarımız hesap açma prosedürlerini kolaylaştırır ve şirket kuruluşunuzun tam finansal altyapı kurulumunu içermesini sağlar.'
        },
        {
          question: 'Şirket kuruluşu için toplam maliyetler nelerdir?',
          answer: 'Şirket kuruluş maliyetleri yargı alanı ve tam iş kurulumu için gerekli hizmetlere göre değişir. Temel offshore kuruluş devlet ücretleri, yasal dokümantasyon ve kapsamlı hizmet ücretlerimiz dahil 1.500$ (Gürcistan) ile 5.000$+ (BAE/İsviçre) arasında başlar. Gizli maliyet olmayan şeffaf fiyatlandırma sağlıyoruz ve AI destekli süreç otomasyonumuz premium hizmet kalitesini korurken genel kuruluş giderlerini azaltmaya yardımcı olur.'
        },
        {
          question: 'Tüm süreç ne kadar sürer?',
          answer: 'Hızlı şirket kayıt zaman çizelgeleri yargı alanı karmaşıklığına ve dokümantasyon eksiksizliğine bağlıdır. Estonya (1-2 hafta) ve Gürcistan (3-5 gün) gibi hızlı yargı alanları en hızlı kuruluş süreçlerini sunar. BAE veya İsviçre\'deki daha kapsamlı kurulumlar genellikle bankacılık ve uyumluluk hizmetleri dahil 2-6 hafta sürer. AI destekli otomasyonumuz ve gerçek zamanlı ilerleme takibimiz tüm şirket kuruluş yolculuğu boyunca verimli işleme sağlar.'
        }
      ]
    },
    pt: {
      heroTitle: 'Formação Global de Empresa – Da Ideia à Incorporação',
      heroDescription: 'Estabeleça seu negócio em 19+ países com orientação jurídica especializada e automação de processo alimentada por IA. Incorporação rápida e compatível com suporte bancário completo.',
      whatWeOfferTitle: 'Serviços Abrangentes de Formação de Empresa',
      whatWeOfferDescription: 'Soluções completas de configuração de negócios com análise de jurisdição alimentada por IA e suporte especializado local',
      whyChooseTitle: 'Por Que Escolher Consulting19 para Formação de Empresa?',
      whyChooseDescription: 'Combinando expertise global com conhecimento local e automação IA para configuração perfeita de negócios',
      howItWorksTitle: 'Como Nossa Formação Global de Empresa Funciona',
      howItWorksDescription: 'Processo simples de 4 etapas da seleção de jurisdição à configuração operacional de negócios',
      jurisdictionsTitle: 'Melhores Jurisdições para Registro Rápido de Empresa',
      jurisdictionsDescription: 'Registro rápido de empresa em jurisdições favoráveis aos negócios',
      faqTitle: 'Perguntas Frequentes',
      faqDescription: 'Perguntas comuns sobre incorporação offshore e configuração global de negócios',
      ctaTitle: 'Pronto para Iniciar Sua Empresa?',
      ctaDescription: 'Obtenha orientação especializada para sua formação internacional de negócios',
      services: [
        {
          title: 'Formação de LLC e Corporação',
          description: 'Serviços profissionais de formação de LLC e corporação em múltiplas jurisdições. Lidamos com toda documentação legal, arquivamentos regulatórios e requisitos de conformidade para estabelecer sua entidade empresarial com proteção completa de responsabilidade.'
        },
        {
          title: 'Registro de Empresa Offshore',
          description: 'Incorporação offshore estratégica em jurisdições favoráveis aos negócios com estruturas fiscais favoráveis. Nossos serviços de configuração offshore incluem documentação legal completa, conformidade regulatória e suporte contínuo.'
        },
        {
          title: 'Análise de Jurisdição',
          description: 'Análise avançada de jurisdição alimentada por IA que avalia implicações fiscais, requisitos regulatórios e vantagens empresariais em 19+ países.'
        },
        {
          title: 'Identidade Digital e e-Residência',
          description: 'Soluções completas de identidade digital incluindo programa de e-Residência da Estônia para gestão 100% online de negócios. Acesse mercados da UE através de programas de identidade empresarial digital.'
        },
        {
          title: 'Soluções Bancárias e de Pagamento',
          description: 'Soluções bancárias corporativas abrangentes incluindo abertura de conta empresarial, contas multi-moeda e configuração de processamento de pagamento internacional.'
        },
        {
          title: 'Estruturas de Holding',
          description: 'Estruturas sofisticadas de holding projetadas para proteção de ativos, otimização fiscal e expansão internacional de negócios.'
        },
        {
          title: 'Monitoramento de Conformidade',
          description: 'Serviços automatizados de monitoramento de conformidade que rastreiam prazos regulatórios, requisitos de arquivamento e obrigações contínuas em todas as jurisdições.'
        },
        {
          title: 'Integração de Assistente IA',
          description: 'Integração inteligente de assistente IA para gestão automatizada de documentos, rastreamento de prazos de conformidade e orientação empresarial em tempo real.'
        }
      ],
      whyChooseUs: [
        {
          title: 'Expertise Global + Local',
          description: 'Especialistas locais em 19+ países combinados com insights globais alimentados por IA. Nossos clientes se beneficiam de conhecimento específico de jurisdição e fluxos de trabalho automatizados que simplificam todo o processo de formação de empresa.'
        },
        {
          title: '500+ Configurações Bem-Sucedidas',
          description: 'Taxa de sucesso de 98% com mais de 500 empresas formadas em múltiplas jurisdições. Nosso histórico comprovado demonstra entrega consistente de registro rápido de empresa com conformidade legal completa e integração bancária.'
        },
        {
          title: 'Automação Alimentada por IA',
          description: 'Rastreamento inteligente de documentos, prazos de conformidade e atualizações automatizadas de progresso. Nossos clientes economizam tempo e dinheiro com fluxos de trabalho automatizados de documentos e insights específicos de jurisdição que eliminam processos manuais e reduzem cronogramas de formação.'
        },
        {
          title: 'Transparente e Custo-Efetivo',
          description: 'Preços claros sem taxas ocultas e tarifas competitivas para serviços premium. Nossa estrutura de taxas transparente e processos eficientes entregam valor excepcional para configuração global de negócios e serviços de incorporação offshore.'
        }
      ],
      processSteps: [
        {
          title: 'Escolha Sua Jurisdição',
          description: 'Selecione o país que melhor se adapta aos seus objetivos com recomendações especializadas e análise de jurisdição alimentada por IA'
        },
        {
          title: 'Consulta Especializada Gratuita',
          description: 'Discuta suas necessidades com nossos consultores para orientação personalizada e planejamento estratégico de negócios'
        },
        {
          title: 'Configuração Rápida de Empresa',
          description: 'Incorporação completa em apenas 14 dias com conformidade apoiada por IA e documentação legal'
        },
        {
          title: 'Bancos e Operações',
          description: 'Abra contas bancárias e habilite operações com soluções financeiras integradas e processamento de pagamentos'
        }
      ],
      faqs: [
        {
          question: 'A formação de empresa offshore é legal?',
          answer: 'Sim, a incorporação offshore é totalmente legal quando estruturada dentro de padrões de conformidade internacional. Consulting19 garante que sua configuração siga leis específicas de jurisdição enquanto oferece acesso bancário global. Muitas corporações multinacionais usam estruturas offshore para otimização fiscal, proteção de ativos e expansão internacional através de propósitos empresariais legítimos e conformidade regulatória adequada.'
        },
        {
          question: 'Quais são os requisitos de relatórios anuais?',
          answer: 'Requisitos de relatórios anuais variam significativamente por jurisdição e estrutura empresarial. A maioria dos países requer demonstrações financeiras anuais, declarações fiscais e atualizações de registro corporativo para manter boa situação. Nosso serviço automatizado de monitoramento de conformidade rastreia todos os prazos regulatórios e garante submissões oportunas. Fornecemos suporte contínuo para todos os serviços de conformidade incluindo requisitos de arquivamento, atualizações regulatórias e gestão de prazos.'
        },
        {
          question: 'Quais opções bancárias estão disponíveis?',
          answer: 'Fornecemos acesso a bancos corporativos em grandes centros financeiros incluindo EAU, Estônia, Suíça e outras jurisdições favoráveis aos negócios. Opções bancárias incluem bancos tradicionais, soluções bancárias digitais e contas multi-moeda com processamento de pagamento internacional. Nossos especialistas bancários facilitam procedimentos de abertura de conta e garantem que sua formação de empresa inclua configuração completa de infraestrutura financeira.'
        },
        {
          question: 'Quais são os custos totais para formação de empresa?',
          answer: 'Custos de formação de empresa variam por jurisdição e serviços necessários para configuração completa de negócios. Incorporação offshore básica começa de $1.500 (Geórgia) a $5.000+ (EAU/Suíça) incluindo taxas governamentais, documentação legal e nossas taxas de serviço abrangentes. Fornecemos preços transparentes sem custos ocultos, e nossa automação de processo alimentada por IA ajuda a reduzir despesas gerais de formação mantendo qualidade de serviço premium.'
        },
        {
          question: 'Quanto tempo leva todo o processo?',
          answer: 'Cronogramas de registro rápido de empresa dependem da complexidade da jurisdição e completude da documentação. Jurisdições rápidas como Estônia (1-2 semanas) e Geórgia (3-5 dias) oferecem os processos de incorporação mais rápidos. Configurações mais abrangentes em EAU ou Suíça tipicamente levam 2-6 semanas incluindo serviços bancários e de conformidade. Nossa automação alimentada por IA e rastreamento de progresso em tempo real garantem processamento eficiente durante toda a jornada de formação de empresa.'
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
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 overflow-hidden">
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
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                {currentContent.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                  {t('getStarted')}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Global company formation services"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentContent.services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg group">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-6 h-64 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed line-clamp-4">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentContent.whyChooseTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.whyChooseDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.whyChooseUs.map((item, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {index === 0 && <Globe className="w-6 h-6 text-white" />}
                    {index === 1 && <TrendingUp className="w-6 h-6 text-white" />}
                    {index === 2 && <Bot className="w-6 h-6 text-white" />}
                    {index === 3 && <Target className="w-6 h-6 text-white" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentContent.howItWorksTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.howItWorksDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.processSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < currentContent.processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 z-0"></div>
                )}
                
                <Card hover className="text-center h-full relative z-10">
                  <Card.Body>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      {index === 0 && <Globe className="w-6 h-6 text-white" />}
                      {index === 1 && <Users className="w-6 h-6 text-white" />}
                      {index === 2 && <Building2 className="w-6 h-6 text-white" />}
                      {index === 3 && <CreditCard className="w-6 h-6 text-white" />}
                    </div>
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Countries */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentContent.jurisdictionsTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.jurisdictionsDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'UAE', flag: '🇦🇪', taxRate: '0%', setupTime: '7-14 days', compliance: 'Annual license renewal' },
              { name: 'Estonia', flag: '🇪🇪', taxRate: '0%*', setupTime: '1-2 weeks', compliance: 'Annual report filing' },
              { name: 'United States', flag: '🇺🇸', taxRate: 'No state tax', setupTime: '3-5 days', compliance: 'Annual franchise tax' },
              { name: 'Georgia', flag: '🇬🇪', taxRate: '1%', setupTime: '3-5 days', compliance: 'Monthly tax filing' },
              { name: 'Malta', flag: '🇲🇹', taxRate: '5%', setupTime: '2-3 weeks', compliance: 'Annual returns' },
              { name: 'Panama', flag: '🇵🇦', taxRate: '25%', setupTime: '2-4 weeks', compliance: 'Annual returns' },
              { name: 'Portugal', flag: '🇵🇹', taxRate: '21%', setupTime: '3-6 weeks', compliance: 'Annual filing' },
              { name: 'Switzerland', flag: '🇨🇭', taxRate: '11-24%', setupTime: '2-4 weeks', compliance: 'Annual filing' },
              { name: 'Montenegro', flag: '🇲🇪', taxRate: '9%', setupTime: '2-3 weeks', compliance: 'Annual returns' }
            ].map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center p-3">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    {country.name}
                  </h3>
                  
                  <div className="space-y-1 mb-4">
                    <div className="bg-green-50 p-1.5 rounded-lg">
                      <div className="text-xs text-green-700 font-medium">Tax Advantages</div>
                      <div className="text-xs font-bold text-green-900">{country.taxRate}</div>
                    </div>
                    
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <div className="text-xs text-blue-700 font-medium">Setup Time</div>
                      <div className="text-xs font-bold text-blue-900">{country.setupTime}</div>
                    </div>
                    
                    <div className="bg-orange-50 p-1.5 rounded-lg">
                      <div className="text-xs text-orange-700 font-medium">Annual Compliance</div>
                      <div className="text-xs font-bold text-orange-900">{country.compliance}</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full text-xs py-1">
                    {t('learnMore')}
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-white">
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">{currentContent.ctaTitle}</h2>
            <p className="text-xl text-blue-100 mb-8">
              {currentContent.ctaDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Step 1: Choose Country</h3>
              <p className="text-blue-100">AI analyzes your needs and recommends optimal jurisdiction</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Step 2: Free Consultation</h3>
              <p className="text-blue-100">Connect with local specialists for personalized guidance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Step 3: 14-Day Setup</h3>
              <p className="text-blue-100">Complete incorporation with banking and compliance setup</p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8">
                {t('getStarted')}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-medium">
                {t('scheduleConsultation')}
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100 font-medium">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span>98% Success Rate</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>500+ Companies Formed</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-300 mr-2" />
                <span>14-Day Average Setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyFormationPage;