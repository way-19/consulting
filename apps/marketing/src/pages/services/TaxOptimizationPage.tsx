import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, TrendingDown, Shield, FileText, Globe, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';
import { useState } from 'react';

const TaxOptimizationPage = () => {
  const { t, language } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const content = {
    en: {
      heroTitle: 'Tax Optimization Services – Maximize Efficiency, Minimize Liability',
      heroDescription: 'Leverage 19+ jurisdictions and AI-powered analysis to reduce tax burdens legally and transparently. We design compliant, audit-ready structures tailored to your operations.',
      whatWeOfferTitle: 'What We Offer',
      whatWeOfferDescription: 'Comprehensive tax optimization strategies for international businesses and individuals',
      howItWorksTitle: 'How It Works',
      howItWorksDescription: 'Systematic approach to international tax planning and cross-border compliance',
      jurisdictionsTitle: 'Premier Tax-Efficient Jurisdictions',
      jurisdictionsDescription: 'Leading jurisdictions offering the most attractive tax optimization opportunities',
      faqTitle: 'Frequently Asked Questions',
      faqDescription: 'Common questions about international tax planning and optimization strategies',
      ctaTitle: 'Ready to Optimize Your Taxes?',
      ctaDescription: 'Get expert tax planning guidance for your international business',
      services: [
        {
          title: 'International Tax Planning',
          description: 'Strategic international tax planning that leverages global jurisdictions to minimize corporate and personal tax obligations while maintaining full compliance.'
        },
        {
          title: 'Transfer Pricing Strategies',
          description: 'Advanced transfer pricing strategies for multinational enterprises operating across multiple jurisdictions with complex intercompany transactions.'
        },
        {
          title: 'Cross-Border Compliance',
          description: 'Comprehensive cross-border taxation compliance services that navigate complex international tax obligations and reporting requirements.'
        },
        {
          title: 'Holding & Group Structuring',
          description: 'Sophisticated holding company structures designed for tax optimization, asset protection, and international business expansion.'
        },
        {
          title: 'IP & Royalty Planning',
          description: 'Intellectual property and royalty planning strategies that align value creation with tax outcomes while ensuring OECD BEPS compliance.'
        },
        {
          title: 'VAT/GST & Indirect Tax',
          description: 'Comprehensive VAT/GST and indirect tax compliance services for businesses operating across multiple jurisdictions with complex supply chains.'
        },
        {
          title: 'Permanent Establishment (PE) Review',
          description: 'Professional permanent establishment risk assessment and mitigation strategies for businesses operating across international borders.'
        },
        {
          title: 'Residency & Treaty Benefits',
          description: 'Strategic tax residency planning and double tax treaty optimization to maximize international tax efficiency and minimize withholding taxes.'
        }
      ],
      processSteps: [
        {
          title: 'Discovery & Risk Assessment',
          description: 'Map your business model, revenue flows, and exposure points across jurisdictions'
        },
        {
          title: 'Jurisdiction & Treaty Analysis',
          description: 'Evaluate double tax treaties, withholding taxes, and substance requirements to select optimal routes'
        },
        {
          title: 'Implementation & Documentation',
          description: 'Set up compliant structures, transfer pricing policies, and statutory documentation'
        },
        {
          title: 'Monitoring & Reporting',
          description: 'Track rule changes, perform annual reviews, and prepare audit-ready reports'
        }
      ],
      faqs: [
        {
          question: 'Is international tax optimization legal?',
          answer: 'Yes—when structured within the law. We follow OECD BEPS guidance, EU directives, and local rules to ensure your structure is compliant, auditable, and defensible. Our approach reduces risk while targeting sustainable efficiency through legitimate international tax planning strategies.'
        },
        {
          question: 'Do I need transfer pricing documentation?',
          answer: 'If you have related-party transactions across borders, yes. We prepare master/local files, benchmarking studies, and intercompany agreements aligned with your jurisdictional thresholds and deadlines. Our transfer pricing documentation ensures OECD compliance and withstands regulatory scrutiny.'
        },
        {
          question: 'How do double tax treaties affect my plan?',
          answer: 'Treaties can reduce withholding taxes and prevent double taxation, but benefits require substance, residency, and beneficial ownership tests. We assess eligibility and implement documentation to secure treaty relief while ensuring compliance with anti-treaty shopping rules.'
        },
        {
          question: 'What is Permanent Establishment (PE) risk?',
          answer: 'PE arises when your activities in a country constitute a taxable presence. We review functions, personnel, and contracts to mitigate PE exposure and align with local interpretations. Our PE risk assessment ensures your international operations remain tax-efficient.'
        },
        {
          question: 'How are IP and royalties optimized?',
          answer: 'We evaluate IP location, DEMPE functions, and royalty rates to align value creation with tax outcomes. Structures prioritize substance, transfer pricing compliance, and treaty access while ensuring OECD BEPS compliance for sustainable IP tax optimization.'
        },
        {
          question: 'What is the typical timeline?',
          answer: 'Discovery and analysis can be completed in 1–2 weeks, with implementation depending on jurisdictional filings and banking steps. We provide a clear timeline and checklist before execution, ensuring transparent project management throughout the tax optimization process.'
        }
      ]
    },
    tr: {
      heroTitle: 'Vergi Optimizasyonu Hizmetleri – Verimliliği Maksimize Edin, Yükümlülüğü Minimize Edin',
      heroDescription: '19+ yargı alanından ve AI destekli analizden yararlanarak vergi yüklerini yasal ve şeffaf şekilde azaltın. Operasyonlarınıza özel uyumlu, denetim hazır yapılar tasarlıyoruz.',
      whatWeOfferTitle: 'Neler Sunuyoruz',
      whatWeOfferDescription: 'Uluslararası işletmeler ve bireyler için kapsamlı vergi optimizasyon stratejileri',
      howItWorksTitle: 'Nasıl Çalışır',
      howItWorksDescription: 'Uluslararası vergi planlaması ve sınır ötesi uyumluluk için sistematik yaklaşım',
      jurisdictionsTitle: 'Önde Gelen Vergi Verimli Yargı Alanları',
      jurisdictionsDescription: 'En çekici vergi optimizasyon fırsatları sunan önde gelen yargı alanları',
      faqTitle: 'Sık Sorulan Sorular',
      faqDescription: 'Uluslararası vergi planlaması ve optimizasyon stratejileri hakkında yaygın sorular',
      ctaTitle: 'Vergilerinizi Optimize Etmeye Hazır mısınız?',
      ctaDescription: 'Uluslararası işiniz için uzman vergi planlama rehberliği alın',
      services: [
        {
          title: 'Uluslararası Vergi Planlaması',
          description: 'Tam uyumluluk sağlarken kurumsal ve kişisel vergi yükümlülüklerini minimize etmek için küresel yargı alanlarından yararlanan stratejik uluslararası vergi planlaması.'
        },
        {
          title: 'Transfer Fiyatlandırma Stratejileri',
          description: 'Karmaşık şirketler arası işlemlerle birden fazla yargı alanında faaliyet gösteren çok uluslu işletmeler için gelişmiş transfer fiyatlandırma stratejileri.'
        },
        {
          title: 'Sınır Ötesi Uyumluluk',
          description: 'Karmaşık uluslararası vergi yükümlülükleri ve raporlama gereksinimlerinde gezinen kapsamlı sınır ötesi vergilendirme uyumluluk hizmetleri.'
        },
        {
          title: 'Holding ve Grup Yapılandırması',
          description: 'Vergi optimizasyonu, varlık korunması ve uluslararası iş genişlemesi için tasarlanmış sofistike holding şirketi yapıları.'
        },
        {
          title: 'Fikri Mülkiyet ve Telif Planlaması',
          description: 'OECD BEPS uyumluluğunu sağlarken değer yaratımını vergi sonuçlarıyla hizalayan fikri mülkiyet ve telif planlama stratejileri.'
        },
        {
          title: 'KDV/GST ve Dolaylı Vergi',
          description: 'Karmaşık tedarik zincirleri ile birden fazla yargı alanında faaliyet gösteren işletmeler için kapsamlı KDV/GST ve dolaylı vergi uyumluluk hizmetleri.'
        },
        {
          title: 'Daimi İşyeri (PE) İncelemesi',
          description: 'Uluslararası sınırlar boyunca faaliyet gösteren işletmeler için profesyonel daimi işyeri risk değerlendirmesi ve azaltma stratejileri.'
        },
        {
          title: 'İkamet ve Anlaşma Faydaları',
          description: 'Uluslararası vergi verimliliğini maksimize etmek ve stopaj vergilerini minimize etmek için stratejik vergi ikameti planlaması ve çifte vergilendirme anlaşması optimizasyonu.'
        }
      ],
      processSteps: [
        {
          title: 'Keşif ve Risk Değerlendirmesi',
          description: 'İş modelinizi, gelir akışlarınızı ve yargı alanları boyunca maruz kalma noktalarınızı haritalayın'
        },
        {
          title: 'Yargı Alanı ve Anlaşma Analizi',
          description: 'Optimal rotaları seçmek için çifte vergilendirme anlaşmalarını, stopaj vergilerini ve öz gereksinimlerini değerlendirin'
        },
        {
          title: 'Uygulama ve Dokümantasyon',
          description: 'Uyumlu yapılar, transfer fiyatlandırma politikaları ve yasal dokümantasyon kurun'
        },
        {
          title: 'İzleme ve Raporlama',
          description: 'Kural değişikliklerini takip edin, yıllık incelemeler yapın ve denetim hazır raporlar hazırlayın'
        }
      ],
      faqs: [
        {
          question: 'Uluslararası vergi optimizasyonu yasal mı?',
          answer: 'Evet—yasa çerçevesinde yapılandırıldığında. Yapınızın uyumlu, denetlenebilir ve savunulabilir olmasını sağlamak için OECD BEPS rehberliği, AB direktifleri ve yerel kuralları takip ediyoruz. Yaklaşımımız meşru uluslararası vergi planlama stratejileri yoluyla sürdürülebilir verimliliği hedeflerken riski azaltır.'
        },
        {
          question: 'Transfer fiyatlandırma dokümantasyonuna ihtiyacım var mı?',
          answer: 'Sınırlar arası ilişkili taraf işlemleriniz varsa, evet. Yargı alanı eşikleriniz ve son tarihlerinizle uyumlu ana/yerel dosyalar, kıyaslama çalışmaları ve şirketler arası anlaşmalar hazırlıyoruz. Transfer fiyatlandırma dokümantasyonumuz OECD uyumluluğunu sağlar ve düzenleyici incelemeye dayanır.'
        },
        {
          question: 'Çifte vergilendirme anlaşmaları planımı nasıl etkiler?',
          answer: 'Anlaşmalar stopaj vergilerini azaltabilir ve çifte vergilendirmeyi önleyebilir, ancak faydalar öz, ikamet ve gerçek faydalanıcı testleri gerektirir. Uygunluğu değerlendiriyor ve anlaşma karşıtı alışveriş kurallarına uyumu sağlarken anlaşma rahatlığını güvence altına almak için dokümantasyon uyguluyoruz.'
        },
        {
          question: 'Daimi İşyeri (PE) riski nedir?',
          answer: 'PE, bir ülkedeki faaliyetleriniz vergiye tabi bir varlık oluşturduğunda ortaya çıkar. PE maruziyetini azaltmak ve yerel yorumlarla uyumlu hale getirmek için işlevleri, personeli ve sözleşmeleri gözden geçiriyoruz. PE risk değerlendirmemiz uluslararası operasyonlarınızın vergi açısından verimli kalmasını sağlar.'
        },
        {
          question: 'Fikri mülkiyet ve telif hakları nasıl optimize edilir?',
          answer: 'Değer yaratımını vergi sonuçlarıyla hizalamak için fikri mülkiyet konumunu, DEMPE işlevlerini ve telif oranlarını değerlendiriyoruz. Yapılar, sürdürülebilir fikri mülkiyet vergi optimizasyonu için OECD BEPS uyumluluğunu sağlarken öz, transfer fiyatlandırma uyumluluğu ve anlaşma erişimini öncelendirir.'
        },
        {
          question: 'Tipik zaman çizelgesi nedir?',
          answer: 'Keşif ve analiz 1-2 haftada tamamlanabilir, uygulama yargı alanı dosyalamalarına ve bankacılık adımlarına bağlıdır. Yürütmeden önce net bir zaman çizelgesi ve kontrol listesi sağlıyoruz, vergi optimizasyon süreci boyunca şeffaf proje yönetimi sağlıyoruz.'
        }
      ]
    },
    pt: {
      heroTitle: 'Serviços de Otimização Fiscal – Maximize a Eficiência, Minimize a Responsabilidade',
      heroDescription: 'Aproveite 19+ jurisdições e análise alimentada por IA para reduzir cargas fiscais legal e transparentemente. Projetamos estruturas compatíveis e prontas para auditoria adaptadas às suas operações.',
      whatWeOfferTitle: 'O Que Oferecemos',
      whatWeOfferDescription: 'Estratégias abrangentes de otimização fiscal para empresas e indivíduos internacionais',
      howItWorksTitle: 'Como Funciona',
      howItWorksDescription: 'Abordagem sistemática para planejamento fiscal internacional e conformidade transfronteiriça',
      jurisdictionsTitle: 'Principais Jurisdições Fiscalmente Eficientes',
      jurisdictionsDescription: 'Jurisdições líderes oferecendo as oportunidades de otimização fiscal mais atrativas',
      faqTitle: 'Perguntas Frequentes',
      faqDescription: 'Perguntas comuns sobre planejamento fiscal internacional e estratégias de otimização',
      ctaTitle: 'Pronto para Otimizar Seus Impostos?',
      ctaDescription: 'Obtenha orientação especializada em planejamento fiscal para seu negócio internacional',
      services: [
        {
          title: 'Planejamento Fiscal Internacional',
          description: 'Planejamento fiscal internacional estratégico que aproveita jurisdições globais para minimizar obrigações fiscais corporativas e pessoais mantendo total conformidade.'
        },
        {
          title: 'Estratégias de Preços de Transferência',
          description: 'Estratégias avançadas de preços de transferência para empresas multinacionais operando em múltiplas jurisdições com transações intercompanhias complexas.'
        },
        {
          title: 'Conformidade Transfronteiriça',
          description: 'Serviços abrangentes de conformidade fiscal transfronteiriça que navegam obrigações fiscais internacionais complexas e requisitos de relatórios.'
        },
        {
          title: 'Estruturação de Holdings e Grupos',
          description: 'Estruturas sofisticadas de holdings projetadas para otimização fiscal, proteção de ativos e expansão internacional de negócios.'
        },
        {
          title: 'Planejamento de PI e Royalties',
          description: 'Estratégias de planejamento de propriedade intelectual e royalties que alinham criação de valor com resultados fiscais garantindo conformidade OECD BEPS.'
        },
        {
          title: 'IVA/GST e Impostos Indiretos',
          description: 'Serviços abrangentes de conformidade IVA/GST e impostos indiretos para empresas operando em múltiplas jurisdições com cadeias de suprimento complexas.'
        },
        {
          title: 'Revisão de Estabelecimento Permanente (EP)',
          description: 'Avaliação profissional de risco de estabelecimento permanente e estratégias de mitigação para empresas operando através de fronteiras internacionais.'
        },
        {
          title: 'Benefícios de Residência e Tratados',
          description: 'Planejamento estratégico de residência fiscal e otimização de tratados de dupla tributação para maximizar eficiência fiscal internacional e minimizar impostos retidos na fonte.'
        }
      ],
      processSteps: [
        {
          title: 'Descoberta e Avaliação de Risco',
          description: 'Mapeie seu modelo de negócio, fluxos de receita e pontos de exposição através de jurisdições'
        },
        {
          title: 'Análise de Jurisdição e Tratados',
          description: 'Avalie tratados de dupla tributação, impostos retidos na fonte e requisitos de substância para selecionar rotas ótimas'
        },
        {
          title: 'Implementação e Documentação',
          description: 'Configure estruturas compatíveis, políticas de preços de transferência e documentação estatutária'
        },
        {
          title: 'Monitoramento e Relatórios',
          description: 'Acompanhe mudanças de regras, realize revisões anuais e prepare relatórios prontos para auditoria'
        }
      ],
      faqs: [
        {
          question: 'A otimização fiscal internacional é legal?',
          answer: 'Sim—quando estruturada dentro da lei. Seguimos orientação OECD BEPS, diretivas da UE e regras locais para garantir que sua estrutura seja compatível, auditável e defensável. Nossa abordagem reduz riscos enquanto visa eficiência sustentável através de estratégias legítimas de planejamento fiscal internacional.'
        },
        {
          question: 'Preciso de documentação de preços de transferência?',
          answer: 'Se você tem transações de partes relacionadas através de fronteiras, sim. Preparamos arquivos mestre/locais, estudos de benchmarking e acordos intercompanhias alinhados com seus limites jurisdicionais e prazos. Nossa documentação de preços de transferência garante conformidade OECD e resiste ao escrutínio regulatório.'
        },
        {
          question: 'Como os tratados de dupla tributação afetam meu plano?',
          answer: 'Tratados podem reduzir impostos retidos na fonte e prevenir dupla tributação, mas benefícios requerem testes de substância, residência e propriedade benéfica. Avaliamos elegibilidade e implementamos documentação para garantir alívio de tratado enquanto asseguramos conformidade com regras anti-treaty shopping.'
        },
        {
          question: 'O que é risco de Estabelecimento Permanente (EP)?',
          answer: 'EP surge quando suas atividades em um país constituem uma presença tributável. Revisamos funções, pessoal e contratos para mitigar exposição EP e alinhar com interpretações locais. Nossa avaliação de risco EP garante que suas operações internacionais permaneçam fiscalmente eficientes.'
        },
        {
          question: 'Como PI e royalties são otimizados?',
          answer: 'Avaliamos localização de PI, funções DEMPE e taxas de royalty para alinhar criação de valor com resultados fiscais. Estruturas priorizam substância, conformidade de preços de transferência e acesso a tratados enquanto garantem conformidade OECD BEPS para otimização fiscal sustentável de PI.'
        },
        {
          question: 'Qual é o cronograma típico?',
          answer: 'Descoberta e análise podem ser completadas em 1-2 semanas, com implementação dependendo de arquivamentos jurisdicionais e etapas bancárias. Fornecemos um cronograma claro e lista de verificação antes da execução, garantindo gestão transparente de projeto durante todo o processo de otimização fiscal.'
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
      <section className="relative bg-gradient-to-r from-teal-600 to-green-600 text-white py-8 overflow-hidden">
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
              <p className="text-xl text-teal-100 leading-relaxed mb-8">
                {currentContent.heroDescription}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/countries?service=tax-optimization">
                  <Button size="lg" className="bg-teal-600 text-white hover:bg-teal-700">
                    {t('chooseCountry')}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
                  {t('scheduleConsultation')}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Tax optimization"
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
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentContent.howItWorksTitle}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentContent.howItWorksDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentContent.processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {index === 0 && <Calculator className="w-6 h-6 text-white" />}
                    {index === 1 && <TrendingDown className="w-6 h-6 text-white" />}
                    {index === 2 && <Shield className="w-6 h-6 text-white" />}
                    {index === 3 && <FileText className="w-6 h-6 text-white" />}
                  </div>
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
              { name: 'United Arab Emirates', flag: '🇦🇪', tag: 'Free Zones', highlight: 'Zero corporate and personal income tax in business-friendly free zones', slug: 'united-arab-emirates' },
              { name: 'Georgia', flag: '🇬🇪', taxRate: '1%', highlight: 'Small business status with 1% tax rate', slug: 'georgia' },
              { name: 'Estonia', flag: '🇪🇪', tag: 'e-Residency', highlight: 'Deferred taxation system - pay tax only on distributed profits', slug: 'estonia' },
              { name: 'Malta', flag: '🇲🇹', tag: 'EU Hub', highlight: 'Effective 5% corporate tax rate with full European Union market access', slug: 'malta' },
              { name: 'Panama', flag: '🇵🇦', tag: 'Territorial', highlight: 'Territorial tax system with no tax on foreign-sourced income', slug: 'panama' },
              { name: 'Portugal', flag: '🇵🇹', tag: 'EU Access', highlight: 'NHR program with zero tax on foreign income for new residents', slug: 'portugal' },
              { name: 'United States', flag: '🇺🇸', tag: 'Federal System', highlight: 'State-level tax optimization with Delaware and Wyoming advantages', slug: 'united-states' },
              { name: 'Switzerland', flag: '🇨🇭', tag: 'Premium', highlight: 'Cantonal tax variations with holding company privileges and treaty access', slug: 'switzerland' },
              { name: 'Montenegro', flag: '🇲🇪', tag: 'EU Candidate', highlight: 'Low 9% corporate tax with territorial benefits and EU alignment', slug: 'montenegro' }
            ].map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className="bg-teal-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-bold text-teal-900">{country.tag}</div>
                    <div className="text-xs text-teal-700">{country.highlight}</div>
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
      <section className="py-16 bg-gradient-to-r from-teal-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{currentContent.ctaTitle}</h2>
          <p className="text-xl text-teal-100 mb-8">
            {currentContent.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/countries?service=tax-optimization">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                {t('chooseCountry')}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
              {t('scheduleConsultation')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaxOptimizationPage;