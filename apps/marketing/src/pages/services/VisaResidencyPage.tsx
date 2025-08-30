import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Plane, Home, Globe, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const VisaResidencyPage = () => {
  const { t, language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const content = {
    en: {
      heroTitle: 'Visa & Residency Services – Your Gateway to Global Mobility',
      heroDescription: 'Secure residency or citizenship in your preferred country. Our immigration experts guide you through eligibility, program selection, compliant documentation, and end-to-end application support.',
      whatWeOfferTitle: 'What We Offer',
      whatWeOfferDescription: 'Comprehensive visa and residency services for global mobility',
      processTitle: 'Our Visa & Residency Process',
      processDescription: 'Step-by-step guidance through visa applications and residency programs',
      jurisdictionsTitle: 'Popular Residency Destinations',
      jurisdictionsDescription: 'Countries offering attractive visa and residency programs for investors',
      faqTitle: 'Frequently Asked Questions',
      faqDescription: 'Common questions about visa services and residency programs',
      ctaTitle: 'Ready to Secure Your Residency?',
      ctaDescription: 'Get expert immigration guidance for your global mobility goals',
      services: [
        {
          title: 'Golden Visa Programs',
          description: 'Investment-based residency programs offering pathways to EU and global mobility through real estate, fund investments, or business creation. Our specialists handle complete due diligence processes, investment structuring, and renewal requirements to ensure compliant golden visa applications.'
        },
        {
          title: 'Investor Visas',
          description: 'Entrepreneur and business investor visa routes designed for founders creating jobs and driving innovation in target countries. Our immigration experts navigate job creation criteria, business plan requirements, and compliance frameworks to secure investor visa approvals.'
        },
        {
          title: 'Citizenship by Investment',
          description: 'Fast-track citizenship programs through approved government investment routes with comprehensive background screening and family inclusion options. Our citizenship specialists manage source-of-funds verification, due diligence processes, and investment structuring to ensure compliant applications.'
        },
        {
          title: 'Skilled Worker Visas',
          description: 'Employment-based visa programs for professionals seeking international career opportunities through employer sponsorship and skills-based immigration routes. Our specialists handle labor market testing, credential evaluation, and relocation planning to secure skilled worker visa approvals.'
        },
        {
          title: 'Family Reunification',
          description: 'Comprehensive family visa services for spouses, children, and dependent relatives seeking to join family members in new countries. Our immigration experts navigate income thresholds, relationship documentation, and document legalization requirements for successful family reunification applications.'
        },
        {
          title: 'Permanent Residency',
          description: 'Long-term settlement pathways leading to permanent residency status with comprehensive integration and renewal support. Our residency specialists guide clients through language requirements, integration programs, and PR renewal obligations to maintain permanent status.'
        }
      ],
      processSteps: [
        {
          title: 'Eligibility Assessment',
          description: 'Assess your profile against program criteria, timelines, and total costs'
        },
        {
          title: 'Program Selection',
          description: 'Compare countries and routes; choose the option that fits your goals and risk tolerance'
        },
        {
          title: 'Application Preparation',
          description: 'Gather documents, translations, legalizations, and compliant investment proofs'
        },
        {
          title: 'Approval & Settlement',
          description: 'Liaise with authorities, track approvals, and assist with landing, PR, and renewals'
        }
      ],
      faqs: [
        {
          question: 'Which residency route is best for me?',
          answer: 'The optimal route depends on your goals (mobility, tax, lifestyle), budget, timing, and risk tolerance. We analyze your specific circumstances and compare available programs to present a shortlist with detailed timelines and total costs.'
        },
        {
          question: 'How much do Golden Visa programs cost?',
          answer: 'Investment thresholds and fees vary significantly by country and investment route (real estate, funds, or business creation). Total costs typically range from €250,000 to €2,000,000 plus government fees, legal costs, and due diligence expenses.'
        },
        {
          question: 'Can I include my family?',
          answer: 'Most residency programs allow inclusion of spouses and dependent children, with some extending to parents and grandparents under specific conditions. Each family member requires separate documentation and may incur additional fees.'
        },
        {
          question: 'How long does the process take?',
          answer: 'Processing timelines typically range from 2-12 months depending on program complexity, due diligence requirements, document legalization needs, and government processing speeds. Investment-based programs generally take 4-8 months.'
        },
        {
          question: 'Do I need to live in the country full-time?',
          answer: 'Physical presence requirements vary significantly by program and residency type. Some golden visa programs require only 7-14 days annually, while others mandate 183+ days for tax residency or citizenship eligibility.'
        },
        {
          question: 'Will this change my taxes?',
          answer: 'Obtaining residency can significantly affect your tax status, including potential worldwide income taxation, domicile changes, and treaty benefits or obligations. We coordinate with our tax optimization specialists to assess implications before you commit to any residency programs.'
        }
      ]
    },
    tr: {
      heroTitle: 'Vize ve İkamet Hizmetleri – Küresel Mobiliteye Geçidiniz',
      heroDescription: 'Tercih ettiğiniz ülkede ikamet veya vatandaşlık güvence altına alın. Göçmenlik uzmanlarımız uygunluk, program seçimi, uyumlu dokümantasyon ve uçtan uca başvuru desteği konusunda size rehberlik eder.',
      whatWeOfferTitle: 'Neler Sunuyoruz',
      whatWeOfferDescription: 'Küresel mobilite için kapsamlı vize ve ikamet hizmetleri',
      processTitle: 'Vize ve İkamet Sürecimiz',
      processDescription: 'Vize başvuruları ve ikamet programları boyunca adım adım rehberlik',
      jurisdictionsTitle: 'Popüler İkamet Destinasyonları',
      jurisdictionsDescription: 'Yatırımcılar için çekici vize ve ikamet programları sunan ülkeler',
      faqTitle: 'Sık Sorulan Sorular',
      faqDescription: 'Vize hizmetleri ve ikamet programları hakkında yaygın sorular',
      ctaTitle: 'İkametinizi Güvence Altına Almaya Hazır mısınız?',
      ctaDescription: 'Küresel mobilite hedefleriniz için uzman göçmenlik rehberliği alın',
      services: [
        {
          title: 'Altın Vize Programları',
          description: 'Gayrimenkul, fon yatırımları veya iş yaratma yoluyla AB ve küresel mobiliteye yollar sunan yatırım tabanlı ikamet programları. Uzmanlarımız uyumlu altın vize başvurularını sağlamak için tam durum tespiti süreçleri, yatırım yapılandırması ve yenileme gereksinimlerini ele alır.'
        },
        {
          title: 'Yatırımcı Vizeleri',
          description: 'Hedef ülkelerde iş yaratma ve inovasyonu yönlendiren kurucular için tasarlanmış girişimci ve iş yatırımcısı vize rotaları. Göçmenlik uzmanlarımız yatırımcı vize onaylarını güvence altına almak için iş yaratma kriterleri, iş planı gereksinimleri ve uyumluluk çerçevelerinde gezinir.'
        },
        {
          title: 'Yatırımla Vatandaşlık',
          description: 'Kapsamlı geçmiş tarama ve aile dahil etme seçenekleri ile onaylanmış hükümet yatırım rotaları aracılığıyla hızlı vatandaşlık programları. Vatandaşlık uzmanlarımız uyumlu başvuruları sağlamak için fon kaynağı doğrulaması, durum tespiti süreçleri ve yatırım yapılandırmasını yönetir.'
        },
        {
          title: 'Nitelikli İşçi Vizeleri',
          description: 'İşveren sponsorluğu ve beceri tabanlı göçmenlik rotaları aracılığıyla uluslararası kariyer fırsatları arayan profesyoneller için istihdam tabanlı vize programları. Uzmanlarımız nitelikli işçi vize onaylarını güvence altına almak için işgücü piyasası testi, kimlik belgesi değerlendirmesi ve yer değiştirme planlamasını ele alır.'
        },
        {
          title: 'Aile Birleşimi',
          description: 'Yeni ülkelerde aile üyelerine katılmak isteyen eşler, çocuklar ve bağımlı akrabalar için kapsamlı aile vize hizmetleri. Göçmenlik uzmanlarımız başarılı aile birleşimi başvuruları için gelir eşikleri, ilişki dokümantasyonu ve belge yasallaştırma gereksinimlerinde gezinir.'
        },
        {
          title: 'Daimi İkamet',
          description: 'Kapsamlı entegrasyon ve yenileme desteği ile daimi ikamet statüsüne yol açan uzun vadeli yerleşim yolları. İkamet uzmanlarımız daimi statüyü sürdürmek için müşterileri dil gereksinimleri, entegrasyon programları ve PR yenileme yükümlülükleri konusunda yönlendirir.'
        }
      ],
      processSteps: [
        {
          title: 'Uygunluk Değerlendirmesi',
          description: 'Profilinizi program kriterleri, zaman çizelgeleri ve toplam maliyetlere karşı değerlendirin'
        },
        {
          title: 'Program Seçimi',
          description: 'Ülkeleri ve rotaları karşılaştırın; hedeflerinize ve risk toleransınıza uygun seçeneği seçin'
        },
        {
          title: 'Başvuru Hazırlığı',
          description: 'Belgeler, çeviriler, yasallaştırmalar ve uyumlu yatırım kanıtları toplayın'
        },
        {
          title: 'Onay ve Yerleşim',
          description: 'Yetkililerle irtibat kurun, onayları takip edin ve iniş, PR ve yenilemelerle yardım edin'
        }
      ],
      faqs: [
        {
          question: 'Hangi ikamet rotası benim için en iyisi?',
          answer: 'Optimal rota hedeflerinize (mobilite, vergi, yaşam tarzı), bütçenize, zamanlamanıza ve risk toleransınıza bağlıdır. Özel durumlarınızı analiz ediyor ve detaylı zaman çizelgeleri ve toplam maliyetlerle bir kısa liste sunmak için mevcut programları karşılaştırıyoruz.'
        },
        {
          question: 'Altın Vize programları ne kadar tutar?',
          answer: 'Yatırım eşikleri ve ücretler ülke ve yatırım rotasına (gayrimenkul, fonlar veya iş yaratma) göre önemli ölçüde değişir. Toplam maliyetler genellikle hükümet ücretleri, yasal maliyetler ve durum tespiti giderleri artı 250.000€ ile 2.000.000€ arasında değişir.'
        },
        {
          question: 'Ailemi dahil edebilir miyim?',
          answer: 'Çoğu ikamet programı eşlerin ve bağımlı çocukların dahil edilmesine izin verir, bazıları belirli koşullar altında ebeveynler ve büyükanne büyükbabalara kadar uzanır. Her aile üyesi ayrı dokümantasyon gerektirir ve ek ücretlere tabi olabilir.'
        },
        {
          question: 'Süreç ne kadar sürer?',
          answer: 'İşleme zaman çizelgeleri genellikle program karmaşıklığına, durum tespiti gereksinimlerine, belge yasallaştırma ihtiyaçlarına ve hükümet işleme hızlarına bağlı olarak 2-12 ay arasında değişir. Yatırım tabanlı programlar genellikle 4-8 ay sürer.'
        },
        {
          question: 'Ülkede tam zamanlı yaşamam gerekir mi?',
          answer: 'Fiziksel varlık gereksinimleri program ve ikamet türüne göre önemli ölçüde değişir. Bazı altın vize programları yılda sadece 7-14 gün gerektirir, diğerleri vergi ikameti veya vatandaşlık uygunluğu için 183+ gün zorunlu kılar.'
        },
        {
          question: 'Bu vergilerimi değiştirir mi?',
          answer: 'İkamet elde etmek potansiyel dünya çapında gelir vergilendirmesi, ikametgah değişiklikleri ve anlaşma faydaları veya yükümlülükleri dahil vergi durumunuzu önemli ölçüde etkileyebilir. Herhangi bir ikamet programına taahhüt etmeden önce etkilerini değerlendirmek için vergi optimizasyon uzmanlarımızla koordine oluyoruz.'
        }
      ]
    },
    pt: {
      heroTitle: 'Serviços de Visto e Residência – Sua Porta de Entrada para Mobilidade Global',
      heroDescription: 'Garanta residência ou cidadania em seu país preferido. Nossos especialistas em imigração orientam você através de elegibilidade, seleção de programa, documentação compatível e suporte completo de aplicação.',
      whatWeOfferTitle: 'O Que Oferecemos',
      whatWeOfferDescription: 'Serviços abrangentes de visto e residência para mobilidade global',
      processTitle: 'Nosso Processo de Visto e Residência',
      processDescription: 'Orientação passo a passo através de aplicações de visto e programas de residência',
      jurisdictionsTitle: 'Destinos Populares de Residência',
      jurisdictionsDescription: 'Países oferecendo programas atrativos de visto e residência para investidores',
      faqTitle: 'Perguntas Frequentes',
      faqDescription: 'Perguntas comuns sobre serviços de visto e programas de residência',
      ctaTitle: 'Pronto para Garantir Sua Residência?',
      ctaDescription: 'Obtenha orientação especializada em imigração para seus objetivos de mobilidade global',
      services: [
        {
          title: 'Programas Golden Visa',
          description: 'Programas de residência baseados em investimento oferecendo caminhos para mobilidade da UE e global através de imóveis, investimentos em fundos ou criação de negócios. Nossos especialistas lidam com processos completos de due diligence, estruturação de investimento e requisitos de renovação para garantir aplicações compatíveis de golden visa.'
        },
        {
          title: 'Vistos de Investidor',
          description: 'Rotas de visto de empreendedor e investidor empresarial projetadas para fundadores criando empregos e impulsionando inovação em países-alvo. Nossos especialistas em imigração navegam critérios de criação de empregos, requisitos de plano de negócios e estruturas de conformidade para garantir aprovações de visto de investidor.'
        },
        {
          title: 'Cidadania por Investimento',
          description: 'Programas de cidadania acelerada através de rotas de investimento governamental aprovadas com triagem abrangente de antecedentes e opções de inclusão familiar. Nossos especialistas em cidadania gerenciam verificação de fonte de fundos, processos de due diligence e estruturação de investimento para garantir aplicações compatíveis.'
        },
        {
          title: 'Vistos de Trabalhador Qualificado',
          description: 'Programas de visto baseados em emprego para profissionais buscando oportunidades de carreira internacional através de patrocínio de empregador e rotas de imigração baseadas em habilidades. Nossos especialistas lidam com testes de mercado de trabalho, avaliação de credenciais e planejamento de realocação para garantir aprovações de visto de trabalhador qualificado.'
        },
        {
          title: 'Reunificação Familiar',
          description: 'Serviços abrangentes de visto familiar para cônjuges, filhos e parentes dependentes buscando se juntar a membros da família em novos países. Nossos especialistas em imigração navegam limites de renda, documentação de relacionamento e requisitos de legalização de documentos para aplicações bem-sucedidas de reunificação familiar.'
        },
        {
          title: 'Residência Permanente',
          description: 'Caminhos de assentamento de longo prazo levando ao status de residência permanente com suporte abrangente de integração e renovação. Nossos especialistas em residência orientam clientes através de requisitos de idioma, programas de integração e obrigações de renovação de RP para manter status permanente.'
        }
      ],
      processSteps: [
        {
          title: 'Avaliação de Elegibilidade',
          description: 'Avalie seu perfil contra critérios de programa, cronogramas e custos totais'
        },
        {
          title: 'Seleção de Programa',
          description: 'Compare países e rotas; escolha a opção que se adapta aos seus objetivos e tolerância ao risco'
        },
        {
          title: 'Preparação de Aplicação',
          description: 'Reúna documentos, traduções, legalizações e provas de investimento compatíveis'
        },
        {
          title: 'Aprovação e Assentamento',
          description: 'Faça ligação com autoridades, acompanhe aprovações e auxilie com aterrissagem, RP e renovações'
        }
      ],
      faqs: [
        {
          question: 'Qual rota de residência é melhor para mim?',
          answer: 'A rota ótima depende de seus objetivos (mobilidade, impostos, estilo de vida), orçamento, timing e tolerância ao risco. Analisamos suas circunstâncias específicas e comparamos programas disponíveis para apresentar uma lista curta com cronogramas detalhados e custos totais.'
        },
        {
          question: 'Quanto custam os programas Golden Visa?',
          answer: 'Limites de investimento e taxas variam significativamente por país e rota de investimento (imóveis, fundos ou criação de negócios). Custos totais tipicamente variam de €250.000 a €2.000.000 mais taxas governamentais, custos legais e despesas de due diligence.'
        },
        {
          question: 'Posso incluir minha família?',
          answer: 'A maioria dos programas de residência permite inclusão de cônjuges e filhos dependentes, com alguns se estendendo a pais e avós sob condições específicas. Cada membro da família requer documentação separada e pode incorrer em taxas adicionais.'
        },
        {
          question: 'Quanto tempo leva o processo?',
          answer: 'Cronogramas de processamento tipicamente variam de 2-12 meses dependendo da complexidade do programa, requisitos de due diligence, necessidades de legalização de documentos e velocidades de processamento governamental. Programas baseados em investimento geralmente levam 4-8 meses.'
        },
        {
          question: 'Preciso viver no país em tempo integral?',
          answer: 'Requisitos de presença física variam significativamente por programa e tipo de residência. Alguns programas de golden visa requerem apenas 7-14 dias anualmente, enquanto outros mandam 183+ dias para residência fiscal ou elegibilidade de cidadania.'
        },
        {
          question: 'Isso mudará meus impostos?',
          answer: 'Obter residência pode afetar significativamente seu status fiscal, incluindo potencial tributação de renda mundial, mudanças de domicílio e benefícios ou obrigações de tratado. Coordenamos com nossos especialistas em otimização fiscal para avaliar implicações antes de você se comprometer com qualquer programa de residência.'
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
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 overflow-hidden">
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
              <p className="text-xl text-indigo-100 leading-relaxed mb-8">
                {currentContent.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700">
                  {t('getStarted')}
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                  {t('scheduleConsultation')}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Visa and residency"
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
                    src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {index === 0 && <Users className="w-6 h-6 text-white" />}
                    {index === 1 && <Plane className="w-6 h-6 text-white" />}
                    {index === 2 && <Home className="w-6 h-6 text-white" />}
                    {index === 3 && <Globe className="w-6 h-6 text-white" />}
                  </div>
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
              { name: 'United Arab Emirates', flag: '🇦🇪', tag: 'Free Zones', highlight: 'Residence via company formation and investment options', slug: 'uae' },
              { name: 'Estonia', flag: '🇪🇪', tag: 'Digital First', highlight: 'EU access with e-Residency pathways and startup routes', slug: 'estonia' },
              { name: 'Georgia', flag: '🇬🇪', tag: 'Flexible', highlight: 'Efficient setup and favorable residence options', slug: 'georgia' },
              { name: 'Malta', flag: '🇲🇹', tag: 'EU Hub', highlight: 'Robust residency and long-term settlement programs', slug: 'malta' },
              { name: 'Panama', flag: '🇵🇦', tag: 'Friendly Nations', highlight: 'Territorial system with attractive residency routes', slug: 'panama' },
              { name: 'Portugal', flag: '🇵🇹', tag: 'EU Access', highlight: 'Investor and digital-nomad pathways with EU mobility', slug: 'portugal' },
              { name: 'United States', flag: '🇺🇸', tag: 'Markets', highlight: 'E-2/EB-5, employment-based, and founder routes', slug: 'usa' },
              { name: 'Switzerland', flag: '🇨🇭', tag: 'Premium', highlight: 'Residence via employment or lump-sum taxation (cantonal approval)', slug: 'switzerland' },
              { name: 'Montenegro', flag: '🇲🇪', tag: 'Residency', highlight: 'Business/residency options with EU-candidate status', slug: 'montenegro' }
            ].map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-bold text-indigo-900">{country.tag}</div>
                    <div className="text-xs text-indigo-700">{country.highlight}</div>
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
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{currentContent.ctaTitle}</h2>
          <p className="text-xl text-indigo-100 mb-8">
            {currentContent.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              {t('getStarted')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
              {t('scheduleConsultation')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisaResidencyPage;