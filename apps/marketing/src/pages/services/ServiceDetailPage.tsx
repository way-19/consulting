import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Globe, Users, Star, Clock, Shield, TrendingUp, Zap, FileText, CreditCard, Award, ChevronRight } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const { t } = useLanguage();

  // Complete list of all countries with their details
  const allCountries = [
    { 
      id: 'uae', 
      name: { en: 'UAE', tr: 'BAE', pt: 'EAU' }, 
      flag: '🇦🇪', 
      highlight: { 
        en: '0% tax in free zones', 
        tr: 'Serbest bölgelerde %0 vergi', 
        pt: '0% de imposto em zonas francas' 
      },
      setupTime: { en: '7-14 days', tr: '7-14 gün', pt: '7-14 dias' },
      taxAdvantages: { 
        en: '0% corporate tax for 50 years in free zones, no personal income tax', 
        tr: 'Serbest bölgelerde 50 yıl %0 kurumlar vergisi, kişisel gelir vergisi yok', 
        pt: '0% imposto corporativo por 50 anos em zonas francas, sem imposto de renda pessoal' 
      },
      compliance: { 
        en: 'Annual license renewal, audit exemption for small companies', 
        tr: 'Yıllık lisans yenileme, küçük şirketler için denetim muafiyeti', 
        pt: 'Renovação anual de licença, isenção de auditoria para pequenas empresas' 
      }
    },
    { 
      id: 'estonia', 
      name: { en: 'Estonia', tr: 'Estonya', pt: 'Estônia' }, 
      flag: '🇪🇪', 
      highlight: { 
        en: 'Digital e-Residency', 
        tr: 'Dijital e-Residency', 
        pt: 'e-Residência Digital' 
      },
      setupTime: { en: '1-2 weeks', tr: '1-2 hafta', pt: '1-2 semanas' },
      taxAdvantages: { 
        en: '0% tax on retained earnings, 20% only on distributed profits', 
        tr: 'Dağıtılmayan kârda %0 vergi, sadece dağıtılan kârda %20', 
        pt: '0% imposto sobre lucros retidos, 20% apenas sobre lucros distribuídos' 
      },
      compliance: { 
        en: 'Annual report, simple online filing', 
        tr: 'Yıllık rapor, basit online başvuru', 
        pt: 'Relatório anual, arquivamento online simples' 
      }
    },
    { 
      id: 'georgia', 
      name: { en: 'Georgia', tr: 'Gürcistan', pt: 'Geórgia' }, 
      flag: '🇬🇪', 
      highlight: { 
        en: '1% small business tax', 
        tr: '%1 küçük işletme vergisi', 
        pt: '1% imposto pequenas empresas' 
      },
      setupTime: { en: '3-5 days', tr: '3-5 gün', pt: '3-5 dias' },
      taxAdvantages: { 
        en: '1% tax on turnover up to 500,000 GEL, no VAT registration required', 
        tr: '500,000 GEL\'e kadar ciroda %1 vergi, KDV kaydı gerekmiyor', 
        pt: '1% imposto sobre faturamento até 500.000 GEL, sem registro de IVA necessário' 
      },
      compliance: { 
        en: 'Monthly tax payment, minimal reporting', 
        tr: 'Aylık vergi ödemesi, minimal raporlama', 
        pt: 'Pagamento mensal de impostos, relatórios mínimos' 
      }
    },
    { 
      id: 'malta', 
      name: { en: 'Malta', tr: 'Malta', pt: 'Malta' }, 
      flag: '🇲🇹', 
      highlight: { 
        en: 'EU access, 5% tax', 
        tr: 'AB erişimi, %5 vergi', 
        pt: 'Acesso UE, 5% imposto' 
      },
      setupTime: { en: '2-3 weeks', tr: '2-3 hafta', pt: '2-3 semanas' },
      taxAdvantages: { 
        en: '5% effective corporate tax rate with refunds, EU market access', 
        tr: 'İadelerle %5 efektif kurumlar vergisi oranı, AB pazar erişimi', 
        pt: '5% taxa efetiva de imposto corporativo com reembolsos, acesso ao mercado da UE' 
      },
      compliance: { 
        en: 'Annual returns, audit requirements for larger companies', 
        tr: 'Yıllık beyannameler, büyük şirketler için denetim gereklilikleri', 
        pt: 'Declarações anuais, requisitos de auditoria para empresas maiores' 
      }
    },
    { 
      id: 'panama', 
      name: { en: 'Panama', tr: 'Panama', pt: 'Panamá' }, 
      flag: '🇵🇦', 
      highlight: { 
        en: 'Territorial taxation', 
        tr: 'Bölgesel vergilendirme', 
        pt: 'Tributação territorial' 
      },
      setupTime: { en: '2-4 weeks', tr: '2-4 hafta', pt: '2-4 semanas' },
      taxAdvantages: { 
        en: 'No tax on foreign-sourced income, strong privacy laws', 
        tr: 'Yabancı kaynaklı gelirde vergi yok, güçlü gizlilik yasaları', 
        pt: 'Sem imposto sobre renda de origem estrangeira, leis de privacidade rigorosas' 
      },
      compliance: { 
        en: 'Annual franchise tax, resident agent required', 
        tr: 'Yıllık franchise vergisi, yerleşik temsilci gerekli', 
        pt: 'Taxa anual de franquia, agente residente obrigatório' 
      }
    },
    { 
      id: 'portugal', 
      name: { en: 'Portugal', tr: 'Portekiz', pt: 'Portugal' }, 
      flag: '🇵🇹', 
      highlight: { 
        en: 'Golden Visa program', 
        tr: 'Altın Vize programı', 
        pt: 'Programa Golden Visa' 
      },
      setupTime: { en: '3-6 weeks', tr: '3-6 hafta', pt: '3-6 semanas' },
      taxAdvantages: { 
        en: 'NHR program with 0% tax on foreign income for 10 years', 
        tr: 'NHR programı ile 10 yıl yabancı gelirde %0 vergi', 
        pt: 'Programa NHR com 0% imposto sobre renda estrangeira por 10 anos' 
      },
      compliance: { 
        en: 'Annual corporate tax returns, social security contributions', 
        tr: 'Yıllık kurumlar vergisi beyannameleri, sosyal güvenlik katkıları', 
        pt: 'Declarações anuais de imposto corporativo, contribuições de segurança social' 
      }
    },
    { 
      id: 'usa', 
      name: { en: 'United States', tr: 'Amerika Birleşik Devletleri', pt: 'Estados Unidos' }, 
      flag: '🇺🇸', 
      highlight: { 
        en: 'World\'s largest market', 
        tr: 'Dünyanın en büyük pazarı', 
        pt: 'Maior mercado do mundo' 
      },
      setupTime: { en: '1-2 weeks', tr: '1-2 hafta', pt: '1-2 semanas' },
      taxAdvantages: { 
        en: 'Pass-through taxation for LLCs, no federal tax for foreign owners on certain income', 
        tr: 'LLC\'ler için geçiş vergilendirmesi, belirli gelirlerde yabancı sahipler için federal vergi yok', 
        pt: 'Tributação pass-through para LLCs, sem imposto federal para proprietários estrangeiros em certas rendas' 
      },
      compliance: { 
        en: 'Annual state filings, Form 5472 for foreign-owned LLCs', 
        tr: 'Yıllık eyalet başvuruları, yabancı sahipli LLC\'ler için Form 5472', 
        pt: 'Arquivamentos estaduais anuais, Formulário 5472 para LLCs de propriedade estrangeira' 
      }
    },
    { 
      id: 'switzerland', 
      name: { en: 'Switzerland', tr: 'İsviçre', pt: 'Suíça' }, 
      flag: '🇨🇭', 
      highlight: { 
        en: 'Banking excellence', 
        tr: 'Bankacılık mükemmelliği', 
        pt: 'Excelência bancária' 
      },
      setupTime: { en: '2-4 weeks', tr: '2-4 hafta', pt: '2-4 semanas' },
      taxAdvantages: { 
        en: '11-24% corporate tax depending on canton, holding company privileges', 
        tr: 'Kantona göre %11-24 kurumlar vergisi, holding şirketi ayrıcalıkları', 
        pt: '11-24% imposto corporativo dependendo do cantão, privilégios de holding' 
      },
      compliance: { 
        en: 'Annual financial statements, commercial register updates', 
        tr: 'Yıllık mali tablolar, ticaret sicili güncellemeleri', 
        pt: 'Demonstrações financeiras anuais, atualizações do registro comercial' 
      }
    },
    { 
      id: 'montenegro', 
      name: { en: 'Montenegro', tr: 'Karadağ', pt: 'Montenegro' }, 
      flag: '🇲🇪', 
      highlight: { 
        en: 'EU candidate, citizenship', 
        tr: 'AB adayı, vatandaşlık', 
        pt: 'Candidato UE, cidadania' 
      },
      setupTime: { en: '2-3 weeks', tr: '2-3 hafta', pt: '2-3 semanas' },
      taxAdvantages: { 
        en: '9% corporate tax, citizenship by investment available', 
        tr: '%9 kurumlar vergisi, yatırımla vatandaşlık mevcut', 
        pt: '9% imposto corporativo, cidadania por investimento disponível' 
      },
      compliance: { 
        en: 'Annual tax returns, statistical reports', 
        tr: 'Yıllık vergi beyannameleri, istatistiksel raporlar', 
        pt: 'Declarações fiscais anuais, relatórios estatísticos' 
      }
    },
  ];

  const serviceData: { [key: string]: any } = {
    'company-formation': {
      title: {
        en: 'Seamless Global Company Formation – From Idea to Incorporation',
        tr: 'Sorunsuz Küresel Şirket Kuruluşu – Fikirden Kuruluşa',
        pt: 'Formação Global de Empresas Sem Complicações – Da Ideia à Incorporação'
      },
      subtitle: {
        en: 'Expert company formation services across 19+ business-friendly jurisdictions with AI-powered process automation and local expertise.',
        tr: '19+ iş dostu yargı yetkisinde AI destekli süreç otomasyonu ve yerel uzmanlık ile uzman şirket kuruluş hizmetleri.',
        pt: 'Serviços especializados de formação de empresas em mais de 19 jurisdições favoráveis aos negócios com automação de processos alimentada por IA e expertise local.'
      },
      description: {
        en: 'Transform your business vision into reality with our comprehensive global company formation services. We combine cutting-edge AI technology with local expertise to deliver fast, compliant, and cost-effective business registration solutions worldwide.',
        tr: 'Kapsamlı küresel şirket kuruluş hizmetlerimizle iş vizyonunuzu gerçeğe dönüştürün. Dünya çapında hızlı, uyumlu ve uygun maliyetli iş kayıt çözümleri sunmak için son teknoloji AI teknolojisini yerel uzmanlıkla birleştiriyoruz.',
        pt: 'Transforme sua visão de negócios em realidade com nossos serviços abrangentes de formação global de empresas. Combinamos tecnologia de IA de ponta com expertise local para entregar soluções de registro de negócios rápidas, conformes e econômicas em todo o mundo.'
      },
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      benefits: [
        {
          title: {
            en: 'AI-Powered Jurisdiction Analysis',
            tr: 'AI Destekli Yargı Yetkisi Analizi',
            pt: 'Análise de Jurisdição Alimentada por IA'
          },
          description: {
            en: 'Our AI Oracle analyzes your business model, target markets, and goals to recommend the optimal jurisdiction for your company formation.',
            tr: 'AI Oracle\'ımız iş modelinizi, hedef pazarlarınızı ve hedeflerinizi analiz ederek şirket kuruluşunuz için optimal yargı yetkisini önerir.',
            pt: 'Nosso AI Oracle analisa seu modelo de negócios, mercados-alvo e objetivos para recomendar a jurisdição ideal para a formação de sua empresa.'
          }
        },
        {
          title: {
            en: 'Complete Documentation & Legal Compliance',
            tr: 'Tam Dokümantasyon ve Yasal Uyumluluk',
            pt: 'Documentação Completa e Conformidade Legal'
          },
          description: {
            en: 'End-to-end document preparation, legal structure optimization, and full compliance with local regulations and international standards.',
            tr: 'Uçtan uca belge hazırlama, yasal yapı optimizasyonu ve yerel düzenlemeler ile uluslararası standartlara tam uyumluluk.',
            pt: 'Preparação completa de documentos, otimização de estrutura legal e total conformidade com regulamentações locais e padrões internacionais.'
          }
        },
        {
          title: {
            en: 'Digital Identity & e-Residency Solutions',
            tr: 'Dijital Kimlik ve e-Residency Çözümleri',
            pt: 'Soluções de Identidade Digital e e-Residência'
          },
          description: {
            en: 'Access to digital residency programs like Estonia e-Residency, enabling 100% online business management and EU market access.',
            tr: 'Estonya e-Residency gibi dijital ikamet programlarına erişim, %100 online iş yönetimi ve AB pazar erişimi sağlar.',
            pt: 'Acesso a programas de residência digital como e-Residência da Estônia, permitindo gestão 100% online de negócios e acesso ao mercado da UE.'
          }
        },
        {
          title: {
            en: 'Integrated Banking & Payment Solutions',
            tr: 'Entegre Bankacılık ve Ödeme Çözümleri',
            pt: 'Soluções Integradas de Banco e Pagamento'
          },
          description: {
            en: 'Seamless corporate banking setup, multi-currency accounts, and payment gateway integration to get your business operational immediately.',
            tr: 'Sorunsuz kurumsal bankacılık kurulumu, çok para birimli hesaplar ve işinizi hemen operasyonel hale getirmek için ödeme ağ geçidi entegrasyonu.',
            pt: 'Configuração perfeita de banco corporativo, contas multi-moeda e integração de gateway de pagamento para tornar seu negócio operacional imediatamente.'
          }
        },
        {
          title: {
            en: 'Tax Optimization & Structure Planning',
            tr: 'Vergi Optimizasyonu ve Yapı Planlaması',
            pt: 'Otimização Fiscal e Planejamento de Estrutura'
          },
          description: {
            en: 'Strategic tax planning to minimize your global tax burden while maintaining full compliance with international tax regulations.',
            tr: 'Uluslararası vergi düzenlemelerine tam uyumu korurken küresel vergi yükünüzü minimize etmek için stratejik vergi planlaması.',
            pt: 'Planejamento fiscal estratégico para minimizar sua carga tributária global mantendo total conformidade com regulamentações fiscais internacionais.'
          }
        },
        {
          title: {
            en: 'Ongoing Compliance Monitoring',
            tr: 'Sürekli Uyumluluk İzleme',
            pt: 'Monitoramento Contínuo de Conformidade'
          },
          description: {
            en: 'Automated compliance tracking, deadline reminders, and annual filing support to keep your company in good standing.',
            tr: 'Şirketinizi iyi durumda tutmak için otomatik uyumluluk takibi, son tarih hatırlatmaları ve yıllık dosyalama desteği.',
            pt: 'Rastreamento automatizado de conformidade, lembretes de prazos e suporte de arquivamento anual para manter sua empresa em boa situação.'
          }
        },
        {
          title: {
            en: 'Registered Office & Virtual Address Services',
            tr: 'Kayıtlı Ofis ve Sanal Adres Hizmetleri',
            pt: 'Serviços de Escritório Registrado e Endereço Virtual'
          },
          description: {
            en: 'Professional registered office addresses, mail forwarding, and virtual office services to establish your business presence.',
            tr: 'İş varlığınızı kurmak için profesyonel kayıtlı ofis adresleri, posta yönlendirme ve sanal ofis hizmetleri.',
            pt: 'Endereços profissionais de escritório registrado, encaminhamento de correspondência e serviços de escritório virtual para estabelecer sua presença empresarial.'
          }
        },
        {
          title: {
            en: 'Post-Incorporation Support & Growth Services',
            tr: 'Kuruluş Sonrası Destek ve Büyüme Hizmetleri',
            pt: 'Suporte Pós-Incorporação e Serviços de Crescimento'
          },
          description: {
            en: 'Ongoing business support including accounting, legal updates, expansion planning, and additional jurisdiction setup as you grow.',
            tr: 'Büyürken muhasebe, yasal güncellemeler, genişleme planlaması ve ek yargı yetkisi kurulumu dahil sürekli iş desteği.',
            pt: 'Suporte empresarial contínuo incluindo contabilidade, atualizações legais, planejamento de expansão e configuração de jurisdição adicional conforme você cresce.'
          }
        }
      ],
      advantages: [
        {
          title: {
            en: 'Global Network, Local Expertise',
            tr: 'Küresel Ağ, Yerel Uzmanlık',
            pt: 'Rede Global, Expertise Local'
          },
          description: {
            en: 'Our network of certified local experts across 19+ countries ensures you receive specialized knowledge of regional regulations, cultural nuances, and business practices. Each jurisdiction specialist has deep understanding of local requirements and maintains relationships with key authorities.',
            tr: '19+ ülkedeki sertifikalı yerel uzmanlarımızın ağı, bölgesel düzenlemeler, kültürel nüanslar ve iş uygulamaları konusunda uzman bilgi almanızı sağlar. Her yargı yetkisi uzmanı yerel gereksinimleri derinlemesine anlar ve kilit otoritelerle ilişkiler sürdürür.',
            pt: 'Nossa rede de especialistas locais certificados em mais de 19 países garante que você receba conhecimento especializado sobre regulamentações regionais, nuances culturais e práticas comerciais. Cada especialista em jurisdição tem profundo entendimento dos requisitos locais e mantém relacionamentos com autoridades-chave.'
          }
        },
        {
          title: {
            en: 'Proven Track Record & Success Rate',
            tr: 'Kanıtlanmış Sicil ve Başarı Oranı',
            pt: 'Histórico Comprovado e Taxa de Sucesso'
          },
          description: {
            en: 'With over 500 successful company formations and a 98% success rate, we have established ourselves as the leading global business formation platform. Our clients range from tech startups to multinational corporations, all benefiting from our streamlined processes and expert guidance.',
            tr: '500\'den fazla başarılı şirket kuruluşu ve %98 başarı oranı ile kendimizi önde gelen küresel iş kuruluş platformu olarak konumlandırdık. Müşterilerimiz teknoloji girişimlerinden çok uluslu şirketlere kadar uzanıyor, hepsi akıcı süreçlerimiz ve uzman rehberliğimizden faydalanıyor.',
            pt: 'Com mais de 500 formações de empresas bem-sucedidas e uma taxa de sucesso de 98%, nos estabelecemos como a plataforma líder global de formação de negócios. Nossos clientes variam de startups de tecnologia a corporações multinacionais, todos se beneficiando de nossos processos simplificados e orientação especializada.'
          }
        },
        {
          title: {
            en: 'AI-Powered Automation & Efficiency',
            tr: 'AI Destekli Otomasyon ve Verimlilik',
            pt: 'Automação e Eficiência Alimentadas por IA'
          },
          description: {
            en: 'Our proprietary AI Oracle technology automates document tracking, compliance monitoring, and deadline management. This reduces processing time by 60% and eliminates human errors, ensuring your company formation is completed faster and more accurately than traditional methods.',
            tr: 'Özel AI Oracle teknolojimiz belge takibi, uyumluluk izleme ve son tarih yönetimini otomatikleştirir. Bu, işlem süresini %60 azaltır ve insan hatalarını ortadan kaldırır, şirket kuruluşunuzun geleneksel yöntemlerden daha hızlı ve daha doğru tamamlanmasını sağlar.',
            pt: 'Nossa tecnologia proprietária AI Oracle automatiza o rastreamento de documentos, monitoramento de conformidade e gerenciamento de prazos. Isso reduz o tempo de processamento em 60% e elimina erros humanos, garantindo que a formação de sua empresa seja concluída mais rápida e precisamente do que métodos tradicionais.'
          }
        },
        {
          title: {
            en: 'Transparent Pricing & Cost-Effective Solutions',
            tr: 'Şeffaf Fiyatlandırma ve Uygun Maliyetli Çözümler',
            pt: 'Preços Transparentes e Soluções Econômicas'
          },
          description: {
            en: 'No hidden fees, no surprise costs. Our transparent pricing model includes all government fees, legal documentation, and expert consultation. We offer competitive rates that are typically 30-40% lower than traditional law firms while providing superior service quality and faster turnaround times.',
            tr: 'Gizli ücret yok, sürpriz maliyet yok. Şeffaf fiyatlandırma modelimiz tüm devlet ücretlerini, yasal belgeleri ve uzman danışmanlığını içerir. Üstün hizmet kalitesi ve daha hızlı geri dönüş süreleri sağlarken geleneksel hukuk firmalarından tipik olarak %30-40 daha düşük rekabetçi oranlar sunuyoruz.',
            pt: 'Sem taxas ocultas, sem custos surpresa. Nosso modelo de preços transparente inclui todas as taxas governamentais, documentação legal e consultoria especializada. Oferecemos tarifas competitivas que são tipicamente 30-40% menores que escritórios de advocacia tradicionais, fornecendo qualidade de serviço superior e tempos de resposta mais rápidos.'
          }
        }
      ],
      howItWorks: [
        {
          step: 1,
          title: {
            en: 'Choose Your Jurisdiction',
            tr: 'Yargı Yetkisini Seçin',
            pt: 'Escolha Sua Jurisdição'
          },
          description: {
            en: 'Use our AI Oracle to analyze your business needs and get personalized jurisdiction recommendations based on your industry, target markets, and tax optimization goals.',
            tr: 'İş ihtiyaçlarınızı analiz etmek ve sektörünüz, hedef pazarlarınız ve vergi optimizasyon hedeflerinize dayalı kişiselleştirilmiş yargı yetkisi önerileri almak için AI Oracle\'ımızı kullanın.',
            pt: 'Use nosso AI Oracle para analisar suas necessidades de negócios e obter recomendações personalizadas de jurisdição baseadas em sua indústria, mercados-alvo e objetivos de otimização fiscal.'
          }
        },
        {
          step: 2,
          title: {
            en: 'Expert Consultation & Planning',
            tr: 'Uzman Danışmanlığı ve Planlama',
            pt: 'Consultoria Especializada e Planejamento'
          },
          description: {
            en: 'Connect with our local jurisdiction expert for a comprehensive consultation. We\'ll design your optimal corporate structure, prepare all documentation, and create your incorporation timeline.',
            tr: 'Kapsamlı bir danışmanlık için yerel yargı yetkisi uzmanımızla bağlantı kurun. Optimal kurumsal yapınızı tasarlayacak, tüm belgeleri hazırlayacak ve kuruluş zaman çizelgenizi oluşturacağız.',
            pt: 'Conecte-se com nosso especialista local em jurisdição para uma consultoria abrangente. Projetaremos sua estrutura corporativa ideal, prepararemos toda a documentação e criaremos seu cronograma de incorporação.'
          }
        },
        {
          step: 3,
          title: {
            en: 'Incorporation & Registration',
            tr: 'Kuruluş ve Kayıt',
            pt: 'Incorporação e Registro'
          },
          description: {
            en: 'We handle all government filings, legal registrations, and compliance requirements. Our AI system tracks progress in real-time and keeps you updated throughout the process.',
            tr: 'Tüm devlet başvurularını, yasal kayıtları ve uyumluluk gereksinimlerini hallederiz. AI sistemimiz ilerlemeyi gerçek zamanlı olarak takip eder ve süreç boyunca sizi güncel tutar.',
            pt: 'Cuidamos de todos os arquivamentos governamentais, registros legais e requisitos de conformidade. Nosso sistema de IA rastreia o progresso em tempo real e mantém você atualizado durante todo o processo.'
          }
        },
        {
          step: 4,
          title: {
            en: 'Banking & Business Activation',
            tr: 'Bankacılık ve İş Aktivasyonu',
            pt: 'Ativação Bancária e Empresarial'
          },
          description: {
            en: 'Complete your business setup with corporate banking, payment solutions, and operational tools. Your company is ready to operate globally within 14 days of starting the process.',
            tr: 'Kurumsal bankacılık, ödeme çözümleri ve operasyonel araçlarla iş kurulumunuzu tamamlayın. Şirketiniz süreci başlattıktan sonra 14 gün içinde küresel olarak faaliyet göstermeye hazır.',
            pt: 'Complete a configuração de seu negócio com banco corporativo, soluções de pagamento e ferramentas operacionais. Sua empresa está pronta para operar globalmente dentro de 14 dias do início do processo.'
          }
        }
      ],
      successStories: [
        {
          company: 'TechFlow Solutions',
          industry: {
            en: 'Software Development',
            tr: 'Yazılım Geliştirme',
            pt: 'Desenvolvimento de Software'
          },
          jurisdiction: {
            en: 'Estonia',
            tr: 'Estonya',
            pt: 'Estônia'
          },
          challenge: {
            en: 'US-based startup needed EU market access for their SaaS platform while minimizing tax burden.',
            tr: 'ABD merkezli girişim, vergi yükünü minimize ederken SaaS platformları için AB pazar erişimine ihtiyaç duyuyordu.',
            pt: 'Startup baseada nos EUA precisava de acesso ao mercado da UE para sua plataforma SaaS minimizando a carga tributária.'
          },
          solution: {
            en: 'Established Estonian company with e-Residency, enabling 100% online management and 0% tax on retained earnings.',
            tr: 'e-Residency ile Estonya şirketi kurdu, %100 online yönetim ve dağıtılmayan kazançlarda %0 vergi sağladı.',
            pt: 'Estabeleceu empresa estoniana com e-Residência, permitindo gestão 100% online e 0% imposto sobre lucros retidos.'
          },
          result: {
            en: '40% tax savings, full EU compliance, and 300% revenue growth in first year.',
            tr: '%40 vergi tasarrufu, tam AB uyumluluğu ve ilk yılda %300 gelir artışı.',
            pt: '40% economia fiscal, total conformidade com a UE e 300% crescimento de receita no primeiro ano.'
          }
        },
        {
          company: 'Global Trade Partners',
          industry: {
            en: 'International Trading',
            tr: 'Uluslararası Ticaret',
            pt: 'Comércio Internacional'
          },
          jurisdiction: {
            en: 'UAE (DMCC)',
            tr: 'BAE (DMCC)',
            pt: 'EAU (DMCC)'
          },
          challenge: {
            en: 'International trading company needed tax-efficient structure for Middle East and Asian operations.',
            tr: 'Uluslararası ticaret şirketi Orta Doğu ve Asya operasyonları için vergi etkin yapıya ihtiyaç duyuyordu.',
            pt: 'Empresa de comércio internacional precisava de estrutura fiscalmente eficiente para operações no Oriente Médio e Ásia.'
          },
          solution: {
            en: 'Set up DMCC free zone company with 0% corporate tax and streamlined import/export procedures.',
            tr: '%0 kurumlar vergisi ve akıcı ithalat/ihracat prosedürleri ile DMCC serbest bölge şirketi kurdu.',
            pt: 'Estabeleceu empresa de zona franca DMCC com 0% imposto corporativo e procedimentos simplificados de importação/exportação.'
          },
          result: {
            en: 'Zero tax liability, 50% reduction in operational costs, expanded to 12 new markets.',
            tr: 'Sıfır vergi yükümlülüğü, operasyonel maliyetlerde %50 azalma, 12 yeni pazara genişleme.',
            pt: 'Zero responsabilidade fiscal, 50% redução nos custos operacionais, expandiu para 12 novos mercados.'
          }
        },
        {
          company: 'Digital Nomad Consulting',
          industry: {
            en: 'Business Consulting',
            tr: 'İş Danışmanlığı',
            pt: 'Consultoria Empresarial'
          },
          jurisdiction: {
            en: 'Georgia',
            tr: 'Gürcistan',
            pt: 'Geórgia'
          },
          challenge: {
            en: 'Location-independent consultant needed simple, low-tax structure for global client base.',
            tr: 'Lokasyon bağımsız danışman, küresel müşteri tabanı için basit, düşük vergili yapıya ihtiyaç duyuyordu.',
            pt: 'Consultor independente de localização precisava de estrutura simples e de baixo imposto para base de clientes global.'
          },
          solution: {
            en: 'Established Georgian LLC with Small Business Status, paying only 1% tax on turnover.',
            tr: 'Küçük İşletme Statüsü ile Gürcistan LLC kurdu, ciroda sadece %1 vergi ödüyor.',
            pt: 'Estabeleceu LLC georgiana com Status de Pequena Empresa, pagando apenas 1% imposto sobre faturamento.'
          },
          result: {
            en: '90% tax reduction, simplified compliance, and ability to focus on business growth.',
            tr: '%90 vergi azalması, basitleştirilmiş uyumluluk ve iş büyümesine odaklanma kabiliyeti.',
            pt: '90% redução fiscal, conformidade simplificada e capacidade de focar no crescimento do negócio.'
          }
        }
      ],
      faqs: [
        {
          question: {
            en: 'Is offshore company formation legal?',
            tr: 'Offshore şirket kuruluşu yasal mı?',
            pt: 'A formação de empresa offshore é legal?'
          },
          answer: {
            en: 'Yes, offshore company formation is completely legal when done for legitimate business purposes and with proper compliance. All our jurisdictions are reputable, regulated, and maintain international compliance standards. We ensure full transparency and adherence to all applicable laws.',
            tr: 'Evet, offshore şirket kuruluşu meşru iş amaçları için yapıldığında ve uygun uyumlulukla tamamen yasaldır. Tüm yargı yetkilerimiz saygın, düzenlenmiş ve uluslararası uyumluluk standartlarını korur. Tam şeffaflık ve tüm geçerli yasalara uyumu sağlarız.',
            pt: 'Sim, a formação de empresa offshore é completamente legal quando feita para propósitos comerciais legítimos e com conformidade adequada. Todas as nossas jurisdições são respeitáveis, regulamentadas e mantêm padrões de conformidade internacional. Garantimos total transparência e aderência a todas as leis aplicáveis.'
          }
        },
        {
          question: {
            en: 'What are the annual reporting requirements?',
            tr: 'Yıllık raporlama gereksinimleri nelerdir?',
            pt: 'Quais são os requisitos de relatórios anuais?'
          },
          answer: {
            en: 'Annual reporting requirements vary by jurisdiction. Most require basic annual returns and financial statements. Some jurisdictions like Estonia have minimal reporting for small companies, while others like Malta may require audited accounts for larger entities. We provide ongoing compliance support to ensure all requirements are met.',
            tr: 'Yıllık raporlama gereksinimleri yargı yetkisine göre değişir. Çoğu temel yıllık beyannameler ve mali tablolar gerektirir. Estonya gibi bazı yargı yetkileri küçük şirketler için minimal raporlama gerektirirken, Malta gibi diğerleri büyük kuruluşlar için denetlenmiş hesaplar gerektirebilir. Tüm gereksinimlerin karşılanmasını sağlamak için sürekli uyumluluk desteği sağlarız.',
            pt: 'Os requisitos de relatórios anuais variam por jurisdição. A maioria requer declarações anuais básicas e demonstrações financeiras. Algumas jurisdições como Estônia têm relatórios mínimos para pequenas empresas, enquanto outras como Malta podem exigir contas auditadas para entidades maiores. Fornecemos suporte contínuo de conformidade para garantir que todos os requisitos sejam atendidos.'
          }
        },
        {
          question: {
            en: 'How quickly can I open a business bank account?',
            tr: 'Ne kadar hızlı bir iş banka hesabı açabilirim?',
            pt: 'Quão rapidamente posso abrir uma conta bancária comercial?'
          },
          answer: {
            en: 'Banking timelines vary by jurisdiction and bank requirements. Digital-first jurisdictions like Estonia allow online account opening within 1-2 weeks. Traditional banking jurisdictions may require 2-4 weeks and sometimes in-person visits. We have established relationships with banks in all our jurisdictions to expedite the process.',
            tr: 'Bankacılık zaman çizelgeleri yargı yetkisi ve banka gereksinimlerine göre değişir. Estonya gibi dijital öncelikli yargı yetkileri 1-2 hafta içinde online hesap açmaya izin verir. Geleneksel bankacılık yargı yetkileri 2-4 hafta gerektirebilir ve bazen şahsen ziyaret gerektirebilir. Süreci hızlandırmak için tüm yargı yetkilerimizde bankalarla kurulmuş ilişkilerimiz var.',
            pt: 'Os cronogramas bancários variam por jurisdição e requisitos do banco. Jurisdições digitais como Estônia permitem abertura de conta online dentro de 1-2 semanas. Jurisdições bancárias tradicionais podem exigir 2-4 semanas e às vezes visitas pessoais. Temos relacionamentos estabelecidos com bancos em todas as nossas jurisdições para acelerar o processo.'
          }
        },
        {
          question: {
            en: 'What ongoing compliance duties do I have?',
            tr: 'Hangi sürekli uyumluluk görevlerim var?',
            pt: 'Que deveres de conformidade contínuos eu tenho?'
          },
          answer: {
            en: 'Ongoing compliance varies by jurisdiction but typically includes annual filings, tax returns, maintaining registered office, and keeping corporate records updated. Our AI-powered compliance monitoring system tracks all deadlines and requirements, sending automated reminders and providing support to ensure you never miss important obligations.',
            tr: 'Sürekli uyumluluk yargı yetkisine göre değişir ancak tipik olarak yıllık başvurular, vergi beyannameleri, kayıtlı ofisi koruma ve kurumsal kayıtları güncel tutmayı içerir. AI destekli uyumluluk izleme sistemimiz tüm son tarihleri ve gereksinimleri takip eder, otomatik hatırlatmalar gönderir ve önemli yükümlülükleri asla kaçırmamanızı sağlamak için destek sağlar.',
            pt: 'A conformidade contínua varia por jurisdição, mas tipicamente inclui arquivamentos anuais, declarações fiscais, manutenção de escritório registrado e manutenção de registros corporativos atualizados. Nosso sistema de monitoramento de conformidade alimentado por IA rastreia todos os prazos e requisitos, enviando lembretes automatizados e fornecendo suporte para garantir que você nunca perca obrigações importantes.'
          }
        },
        {
          question: {
            en: 'Can I change my company jurisdiction later?',
            tr: 'Şirket yargı yetkimi daha sonra değiştirebilir miyim?',
            pt: 'Posso mudar a jurisdição da minha empresa mais tarde?'
          },
          answer: {
            en: 'Yes, it\'s possible to relocate your company to a different jurisdiction through various mechanisms like redomiciliation, merger, or establishing a new entity. However, this process can be complex and may have tax implications. We recommend careful planning from the start, but our experts can guide you through jurisdiction changes when business needs evolve.',
            tr: 'Evet, şirketinizi yeniden yerleşim, birleşme veya yeni bir kuruluş oluşturma gibi çeşitli mekanizmalar aracılığıyla farklı bir yargı yetkisine taşımak mümkündür. Ancak bu süreç karmaşık olabilir ve vergi etkileri olabilir. Baştan dikkatli planlama öneriyoruz, ancak uzmanlarımız iş ihtiyaçları geliştiğinde yargı yetkisi değişiklikleri konusunda size rehberlik edebilir.',
            pt: 'Sim, é possível realocar sua empresa para uma jurisdição diferente através de vários mecanismos como redomiciliação, fusão ou estabelecimento de nova entidade. No entanto, este processo pode ser complexo e pode ter implicações fiscais. Recomendamos planejamento cuidadoso desde o início, mas nossos especialistas podem guiá-lo através de mudanças de jurisdição quando as necessidades do negócio evoluem.'
          }
        }
      ]
    },
    'tax-optimization': {
      title: {
        en: 'Strategic Tax Optimization Services',
        tr: 'Stratejik Vergi Optimizasyon Hizmetleri',
        pt: 'Serviços de Otimização Fiscal Estratégica'
      },
      subtitle: {
        en: 'Legal tax minimization strategies across multiple jurisdictions with expert guidance and AI-powered compliance monitoring.',
        tr: 'Uzman rehberliği ve AI destekli uyumluluk izleme ile birden fazla yargı yetkisinde yasal vergi minimizasyon stratejileri.',
        pt: 'Estratégias legais de minimização fiscal em múltiplas jurisdições com orientação especializada e monitoramento de conformidade alimentado por IA.'
      },
      description: {
        en: 'Minimize your global tax burden legally and efficiently with our comprehensive tax optimization services.',
        tr: 'Kapsamlı vergi optimizasyon hizmetlerimizle küresel vergi yükünüzü yasal ve verimli bir şekilde minimize edin.',
        pt: 'Minimize sua carga tributária global legal e eficientemente com nossos serviços abrangentes de otimização fiscal.'
      },
      image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
      benefits: [
        {
          title: {
            en: 'Legal Tax Minimization Strategies',
            tr: 'Yasal Vergi Minimizasyon Stratejileri',
            pt: 'Estratégias Legais de Minimização Fiscal'
          },
          description: {
            en: 'Comprehensive tax planning to reduce your overall tax burden while maintaining full compliance with all applicable laws.',
            tr: 'Tüm geçerli yasalara tam uyumu korurken genel vergi yükünüzü azaltmak için kapsamlı vergi planlaması.',
            pt: 'Planejamento fiscal abrangente para reduzir sua carga tributária geral mantendo total conformidade com todas as leis aplicáveis.'
          }
        }
      ],
      advantages: [],
      howItWorks: [],
      successStories: [],
      faqs: []
    },
    'banking-solutions': {
      title: {
        en: 'International Banking Solutions',
        tr: 'Uluslararası Bankacılık Çözümleri',
        pt: 'Soluções Bancárias Internacionais'
      },
      subtitle: {
        en: 'Comprehensive banking support for opening international accounts and establishing global financial relationships.',
        tr: 'Uluslararası hesap açma ve küresel finansal ilişkiler kurma için kapsamlı bankacılık desteği.',
        pt: 'Suporte bancário abrangente para abertura de contas internacionais e estabelecimento de relacionamentos financeiros globais.'
      },
      description: {
        en: 'Comprehensive banking support for opening international accounts and establishing global financial relationships.',
        tr: 'Uluslararası hesap açma ve küresel finansal ilişkiler kurma için kapsamlı bankacılık desteği.',
        pt: 'Suporte bancário abrangente para abertura de contas internacionais e estabelecimento de relacionamentos financeiros globais.'
      },
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      benefits: [],
      advantages: [],
      howItWorks: [],
      successStories: [],
      faqs: []
    },
    'visa-residency': {
      title: {
        en: 'Visa & Residency Services',
        tr: 'Vize ve İkamet Hizmetleri',
        pt: 'Serviços de Visto e Residência'
      },
      subtitle: {
        en: 'Complete visa and residency solutions for international business owners, investors, and their families.',
        tr: 'Uluslararası işletme sahipleri, yatırımcılar ve aileleri için eksiksiz vize ve ikamet çözümleri.',
        pt: 'Soluções completas de visto e residência para proprietários de negócios internacionais, investidores e suas famílias.'
      },
      description: {
        en: 'Complete visa and residency solutions for international business owners, investors, and their families.',
        tr: 'Uluslararası işletme sahipleri, yatırımcılar ve aileleri için eksiksiz vize ve ikamet çözümleri.',
        pt: 'Soluções completas de visto e residência para proprietários de negócios internacionais, investidores e suas famílias.'
      },
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
      benefits: [],
      advantages: [],
      howItWorks: [],
      successStories: [],
      faqs: []
    },
    'market-research': {
      title: {
        en: 'Market Research Services',
        tr: 'Pazar Araştırması Hizmetleri',
        pt: 'Serviços de Pesquisa de Mercado'
      },
      subtitle: {
        en: 'In-depth market analysis and research for successful international business expansion and strategic decision-making.',
        tr: 'Başarılı uluslararası iş genişlemesi ve stratejik karar verme için derinlemesine pazar analizi ve araştırması.',
        pt: 'Análise de mercado aprofundada e pesquisa para expansão internacional de negócios bem-sucedida e tomada de decisões estratégicas.'
      },
      description: {
        en: 'In-depth market analysis and research for successful international business expansion and strategic decision-making.',
        tr: 'Başarılı uluslararası iş genişlemesi ve stratejik karar verme için derinlemesine pazar analizi ve araştırması.',
        pt: 'Análise de mercado aprofundada e pesquisa para expansão internacional de negócios bem-sucedida e tomada de decisões estratégicas.'
      },
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
      benefits: [],
      advantages: [],
      howItWorks: [],
      successStories: [],
      faqs: []
    }
  };

  const service = serviceData[serviceId || ''] || serviceData['company-formation'];
  const currentLanguage = t('language') === 'Türkçe' ? 'tr' : t('language') === 'Português' ? 'pt' : 'en';

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/services">
            <Button variant="ghost" icon={ArrowLeft} iconPosition="left">
              {currentLanguage === 'tr' ? 'Hizmetlere Dön' : currentLanguage === 'pt' ? 'Voltar aos Serviços' : 'Back to Services'}
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-16">
          <div className="absolute inset-0">
            <img 
              src={service.image} 
              alt={service.title[currentLanguage]}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          </div>
          <div className="relative p-12 text-white">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {service.title[currentLanguage]}
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                {service.subtitle[currentLanguage]}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0">
                  {currentLanguage === 'tr' ? 'Ücretsiz Danışmanlık Alın' : currentLanguage === 'pt' ? 'Obter Consultoria Gratuita' : 'Get Free Consultation'}
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  {currentLanguage === 'tr' ? 'Ülkeleri Keşfedin' : currentLanguage === 'pt' ? 'Explorar Países' : 'Explore Countries'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* What We Offer */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {currentLanguage === 'tr' ? 'Neler Sunuyoruz' : currentLanguage === 'pt' ? 'O Que Oferecemos' : 'What We Offer'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.benefits.map((benefit: any, index: number) => (
                  <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-300">
                    <Card.Body>
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            {benefit.title[currentLanguage]}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {benefit.description[currentLanguage]}
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>

            {/* Why Choose Us */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {currentLanguage === 'tr' ? 'Neden Bizi Seçmelisiniz' : currentLanguage === 'pt' ? 'Por Que Nos Escolher' : 'Why Choose Us'}
              </h2>
              <div className="space-y-8">
                {service.advantages.map((advantage: any, index: number) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <Card.Body>
                      <div className="border-l-4 border-blue-600 pl-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                          {advantage.title[currentLanguage]}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {advantage.description[currentLanguage]}
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {currentLanguage === 'tr' ? 'Nasıl Çalışır' : currentLanguage === 'pt' ? 'Como Funciona' : 'How It Works'}
              </h2>
              <div className="space-y-6">
                {service.howItWorks.map((step: any, index: number) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <Card.Body>
                      <div className="flex items-start space-x-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-3">
                            {step.title[currentLanguage]}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {step.description[currentLanguage]}
                          </p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>

            {/* Success Stories */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {currentLanguage === 'tr' ? 'Başarı Hikayeleri' : currentLanguage === 'pt' ? 'Histórias de Sucesso' : 'Success Stories'}
              </h2>
              <div className="space-y-8">
                {service.successStories.map((story: any, index: number) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <Card.Body>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{story.company}</h3>
                          <p className="text-blue-600 font-medium">{story.industry[currentLanguage]} • {story.jurisdiction[currentLanguage]}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {currentLanguage === 'tr' ? 'Zorluk:' : currentLanguage === 'pt' ? 'Desafio:' : 'Challenge:'}
                          </h4>
                          <p className="text-gray-600">{story.challenge[currentLanguage]}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {currentLanguage === 'tr' ? 'Çözüm:' : currentLanguage === 'pt' ? 'Solução:' : 'Solution:'}
                          </h4>
                          <p className="text-gray-600">{story.solution[currentLanguage]}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {currentLanguage === 'tr' ? 'Sonuç:' : currentLanguage === 'pt' ? 'Resultado:' : 'Result:'}
                          </h4>
                          <p className="text-green-600 font-medium">{story.result[currentLanguage]}</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {currentLanguage === 'tr' ? 'Sık Sorulan Sorular' : currentLanguage === 'pt' ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
              </h2>
              <div className="space-y-4">
                {service.faqs.map((faq: any, index: number) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <Card.Body>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {faq.question[currentLanguage]}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer[currentLanguage]}
                      </p>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white sticky top-8">
              <Card.Body className="text-center">
                <h3 className="text-xl font-semibold mb-4">
                  {currentLanguage === 'tr' ? 'Başlamaya Hazır mısınız?' : currentLanguage === 'pt' ? 'Pronto para Começar?' : 'Ready to Get Started?'}
                </h3>
                <p className="text-blue-100 mb-6">
                  {currentLanguage === 'tr' ? 'Uzman danışmanlarımızla bağlantı kurun ve yolculuğunuza bugün başlayın.' : 
                   currentLanguage === 'pt' ? 'Conecte-se com nossos consultores especialistas e comece sua jornada hoje.' : 
                   'Connect with our expert advisors and begin your journey today.'}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{currentLanguage === 'tr' ? '1. Adım' : currentLanguage === 'pt' ? 'Passo 1' : 'Step 1'}</span>
                    <span className="font-medium">{currentLanguage === 'tr' ? 'Ülkenizi seçin' : currentLanguage === 'pt' ? 'Escolha seu país' : 'Choose your country'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{currentLanguage === 'tr' ? '2. Adım' : currentLanguage === 'pt' ? 'Passo 2' : 'Step 2'}</span>
                    <span className="font-medium">{currentLanguage === 'tr' ? 'Ücretsiz danışmanlık' : currentLanguage === 'pt' ? 'Consultoria gratuita' : 'Free consultation'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{currentLanguage === 'tr' ? '3. Adım' : currentLanguage === 'pt' ? 'Passo 3' : 'Step 3'}</span>
                    <span className="font-medium">{currentLanguage === 'tr' ? '14 günde kuruluş' : currentLanguage === 'pt' ? 'Incorporação em 14 dias' : 'Incorporate in 14 days'}</span>
                  </div>
                </div>
                <Button variant="secondary" size="lg" className="w-full mt-6">
                  {currentLanguage === 'tr' ? 'Ücretsiz Danışmanlık Başlat' : currentLanguage === 'pt' ? 'Iniciar Consultoria Gratuita' : 'Start Free Consultation'}
                </Button>
              </Card.Body>
            </Card>

            {/* Stats */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentLanguage === 'tr' ? 'Başarı Sicilimiz' : currentLanguage === 'pt' ? 'Nosso Histórico' : 'Our Track Record'}
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLanguage === 'tr' ? 'Başarı Oranı' : currentLanguage === 'pt' ? 'Taxa de Sucesso' : 'Success Rate'}</span>
                    <span className="font-bold text-green-600">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLanguage === 'tr' ? 'Hizmet Verilen Müşteri' : currentLanguage === 'pt' ? 'Clientes Atendidos' : 'Clients Served'}</span>
                    <span className="font-bold">500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLanguage === 'tr' ? 'Ülke' : currentLanguage === 'pt' ? 'Países' : 'Countries'}</span>
                    <span className="font-bold">19+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{currentLanguage === 'tr' ? 'Ort. İşlem Süresi' : currentLanguage === 'pt' ? 'Tempo Médio' : 'Avg. Processing Time'}</span>
                    <span className="font-bold">14 {currentLanguage === 'tr' ? 'gün' : currentLanguage === 'pt' ? 'dias' : 'days'}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Awards */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentLanguage === 'tr' ? 'Ödüller ve Sertifikalar' : currentLanguage === 'pt' ? 'Prêmios e Certificações' : 'Awards & Certifications'}
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-700">
                      {currentLanguage === 'tr' ? 'En İyi Küresel İş Kuruluş Platformu 2024' : 
                       currentLanguage === 'pt' ? 'Melhor Plataforma Global de Formação 2024' : 
                       'Best Global Business Formation Platform 2024'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-700">
                      {currentLanguage === 'tr' ? 'ISO 27001 Sertifikalı' : 
                       currentLanguage === 'pt' ? 'Certificado ISO 27001' : 
                       'ISO 27001 Certified'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-700">
                      {currentLanguage === 'tr' ? 'Fintech Mükemmellik Ödülü' : 
                       currentLanguage === 'pt' ? 'Prêmio de Excelência Fintech' : 
                       'Fintech Excellence Award'}
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Countries Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 rounded-full px-6 py-3 mb-6">
              <Globe className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">
                {currentLanguage === 'tr' ? `${allCountries.length} Ülkede Mevcut` : 
                 currentLanguage === 'pt' ? `Disponível em ${allCountries.length} Países` : 
                 `Available in ${allCountries.length} Countries`}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {currentLanguage === 'tr' ? 'Bu Hizmeti Hangi Ülkeden Almak İstiyorsunuz?' : 
               currentLanguage === 'pt' ? 'De Qual País Você Gostaria Deste Serviço?' : 
               'Which Country Would You Like This Service From?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {currentLanguage === 'tr' ? 'Her ülke benzersiz avantajlar sunar. Size en uygun yargı yetkisini seçin.' : 
               currentLanguage === 'pt' ? 'Cada país oferece vantagens únicas. Escolha a jurisdição mais adequada para você.' : 
               'Each country offers unique advantages. Choose the jurisdiction that best fits your needs.'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allCountries.map((country, index) => (
              <Link key={index} to={`/countries/${country.id}`} className="group">
                <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 hover:border-blue-200">
                  <Card.Body className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 text-4xl flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors duration-300">
                      {country.flag}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                      {country.name[currentLanguage]}
                    </h3>
                    <p className="text-xs text-blue-600 font-medium mb-4 leading-tight">
                      {country.highlight[currentLanguage]}
                    </p>
                    
                    {/* Country Details */}
                    <div className="space-y-2 mb-4 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <Clock className="w-3 h-3" />
                        <span>{country.setupTime[currentLanguage]}</span>
                      </div>
                      <div className="border-t pt-2">
                        <p className="font-medium text-gray-700 mb-1">
                          {currentLanguage === 'tr' ? 'Vergi Avantajları:' : 
                           currentLanguage === 'pt' ? 'Vantagens Fiscais:' : 
                           'Tax Advantages:'}
                        </p>
                        <p className="leading-tight">{country.taxAdvantages[currentLanguage]}</p>
                      </div>
                      <div className="border-t pt-2">
                        <p className="font-medium text-gray-700 mb-1">
                          {currentLanguage === 'tr' ? 'Yıllık Uyumluluk:' : 
                           currentLanguage === 'pt' ? 'Conformidade Anual:' : 
                           'Annual Compliance:'}
                        </p>
                        <p className="leading-tight">{country.compliance[currentLanguage]}</p>
                      </div>
                    </div>
                    
                    <Button variant="primary" size="sm" className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 border-0">
                      {currentLanguage === 'tr' ? 'Başlayın' : currentLanguage === 'pt' ? 'Começar' : 'Get Started'}
                      <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Card.Body>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;