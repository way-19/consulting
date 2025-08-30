/*
  # Fix marketing pages data structure and add missing content

  1. Data Fixes
    - Update existing pages with proper JSON structure
    - Add missing homepage_hero and services_overview pages
    - Ensure all content fields have valid JSON

  2. Content Structure
    - Standardize JSON format for all content fields
    - Add comprehensive meta data for SEO
    - Include proper translations where available

  3. Safety
    - Use UPSERT pattern to avoid conflicts
    - Maintain existing data where possible
*/

-- Update about_page with better structured content
UPDATE marketing_pages 
SET 
  content_en = '{
    "page_title": "About Consulting19",
    "hero_title": "About Consulting19",
    "hero_description": "Since 2016, we have been simplifying international expansion by combining AI-powered intelligence with a global network of expert advisors. We help founders and investors launch, bank, optimize taxes, and stay compliant across 19+ countries.",
    "mission_title": "Our Mission",
    "mission_description": "To democratize international expansion by making expert guidance accessible, fast, and fairly priced. We deliver enterprise-grade outcomes for companies of all sizes through the practical blend of automation and local expertise.",
    "values_title": "Our Values",
    "values_description": "The principles that guide our approach to international business consulting",
    "timeline_title": "Our Journey",
    "timeline_description": "Our journey of innovation and growth since 2016",
    "platforms_title": "Flagship Platforms",
    "platforms_description": "Specialized platforms for sophisticated wealth management and investment opportunities",
    "story_title": "Our Story",
    "story_description": "Consulting19 began in 2016 with a simple observation: cross-border expansion was harder than it needed to be. By pairing cutting-edge AI with a curated network of local experts, we deliver enterprise-level results—company formation, banking, tax optimization, and compliance—faster and more predictably than traditional models.",
    "cta_title": "Ready to Join Our Mission?",
    "cta_description": "Whether you are expanding globally or advising clients, we would love to collaborate."
  }',
  content_tr = '{
    "page_title": "Consulting19 Hakkında",
    "hero_title": "Consulting19 Hakkında",
    "hero_description": "2016 yılından beri, AI destekli zeka ile küresel uzman danışmanlar ağını birleştirerek uluslararası genişlemeyi basitleştiriyoruz. Kurucuların ve yatırımcıların 19+ ülkede başlatma, bankacılık, vergi optimizasyonu ve uyumlu kalmasına yardımcı oluyoruz.",
    "mission_title": "Misyonumuz",
    "mission_description": "Uzman rehberliği erişilebilir, hızlı ve adil fiyatlı hale getirerek uluslararası genişlemeyi demokratikleştirmek. Otomasyon ve yerel uzmanlığın pratik karışımı yoluyla her boyuttaki şirket için kurumsal düzeyde sonuçlar sunuyoruz.",
    "values_title": "Değerlerimiz",
    "values_description": "Uluslararası iş danışmanlığı yaklaşımımıza rehberlik eden ilkeler",
    "timeline_title": "Yolculuğumuz",
    "timeline_description": "2016 yılından bu yana inovasyon ve büyüme yolculuğumuz",
    "platforms_title": "Amiral Gemisi Platformlar",
    "platforms_description": "Sofistike servet yönetimi ve yatırım fırsatları için özel platformlar",
    "story_title": "Hikayemiz",
    "story_description": "Consulting19, 2016 yılında basit bir gözlemle başladı: sınır ötesi genişleme gerekenden daha zordu. Son teknoloji AI ile seçilmiş yerel uzmanlar ağını eşleştirerek, şirket kuruluşu, bankacılık, vergi optimizasyonu ve uyumluluk konularında kurumsal düzeyde sonuçları geleneksel modellerden daha hızlı ve öngörülebilir şekilde sunuyoruz.",
    "cta_title": "Misyonumuza Katılmaya Hazır mısınız?",
    "cta_description": "İster küresel olarak genişleyin ister müşterilere danışmanlık yapın, işbirliği yapmayı çok isteriz."
  }',
  content_pt = '{
    "page_title": "Sobre a Consulting19",
    "hero_title": "Sobre a Consulting19",
    "hero_description": "Desde 2016, temos simplificado a expansão internacional combinando inteligência alimentada por IA com uma rede global de consultores especialistas. Ajudamos fundadores e investidores a lançar, fazer operações bancárias, otimizar impostos e manter conformidade em 19+ países.",
    "mission_title": "Nossa Missão",
    "mission_description": "Democratizar a expansão internacional tornando a orientação especializada acessível, rápida e com preços justos. Entregamos resultados de nível empresarial para empresas de todos os tamanhos através da combinação prática de automação e expertise local.",
    "values_title": "Nossos Valores",
    "values_description": "Os princípios que orientam nossa abordagem à consultoria empresarial internacional",
    "timeline_title": "Nossa Jornada",
    "timeline_description": "Nossa jornada de inovação e crescimento desde 2016",
    "platforms_title": "Plataformas Principais",
    "platforms_description": "Plataformas especializadas para gestão sofisticada de patrimônio e oportunidades de investimento",
    "story_title": "Nossa História",
    "story_description": "A Consulting19 começou em 2016 com uma observação simples: a expansão transfronteiriça era mais difícil do que precisava ser. Ao combinar IA de ponta com uma rede curada de especialistas locais, entregamos resultados de nível empresarial—formação de empresas, bancos, otimização fiscal e conformidade—mais rápido e mais previsivelmente que modelos tradicionais.",
    "cta_title": "Pronto para Se Juntar à Nossa Missão?",
    "cta_description": "Seja expandindo globalmente ou aconselhando clientes, adoraríamos colaborar."
  }'
WHERE page_key = 'about_page';

-- Insert homepage_hero page
INSERT INTO marketing_pages (
  page_key,
  content_en,
  content_tr,
  content_pt,
  meta_title_en,
  meta_description_en,
  meta_keywords_en,
  meta_title_tr,
  meta_description_tr,
  meta_keywords_tr,
  meta_title_pt,
  meta_description_pt,
  meta_keywords_pt
) VALUES (
  'homepage_hero',
  '{
    "title": "AI-Powered Global Business Consulting",
    "subtitle": "Expand Internationally with Expert Guidance",
    "description": "Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance.",
    "primary_cta": "Start Your Expansion",
    "secondary_cta": "Explore Services",
    "features": [
      "AI-powered jurisdiction analysis",
      "Expert advisors in 19+ countries",
      "End-to-end business solutions",
      "Transparent pricing with no hidden fees"
    ]
  }',
  '{
    "title": "AI Destekli Küresel İş Danışmanlığı",
    "subtitle": "Uzman Rehberlikle Uluslararası Genişleyin",
    "description": "Uluslararası iş genişleme için uzman rehberlik. 19+ ülkede vergi optimizasyonu, şirket kuruluşu ve yasal uyumluluk için danışmanlarla sizi buluşturan AI destekli platform.",
    "primary_cta": "Genişlemenizi Başlatın",
    "secondary_cta": "Hizmetleri Keşfedin",
    "features": [
      "AI destekli yargı alanı analizi",
      "19+ ülkede uzman danışmanlar",
      "Uçtan uca iş çözümleri",
      "Gizli ücret olmayan şeffaf fiyatlandırma"
    ]
  }',
  '{
    "title": "Consultoria Empresarial Global com IA",
    "subtitle": "Expanda Internacionalmente com Orientação Especializada",
    "description": "Orientação especializada para expansão internacional de negócios. Plataforma com IA conectando você com consultores em 19+ países para otimização fiscal, formação de empresas e conformidade legal.",
    "primary_cta": "Inicie Sua Expansão",
    "secondary_cta": "Explorar Serviços",
    "features": [
      "Análise de jurisdição com IA",
      "Consultores especialistas em 19+ países",
      "Soluções empresariais completas",
      "Preços transparentes sem taxas ocultas"
    ]
  }',
  'Consulting19 - AI-Powered Global Business Consulting Platform',
  'Expert guidance for international business expansion. AI-powered platform connecting entrepreneurs with advisors in 19+ countries for tax optimization, company formation, and legal compliance.',
  'international business, global expansion, AI consulting, business advisors, tax optimization, company formation',
  'Consulting19 - AI Destekli Küresel İş Danışmanlığı Platformu',
  'Uluslararası iş genişleme için uzman rehberlik. Girişimcileri 19+ ülkede vergi optimizasyonu, şirket kuruluşu ve yasal uyumluluk için danışmanlarla buluşturan AI destekli platform.',
  'uluslararası iş, küresel genişleme, AI danışmanlığı, iş danışmanları, vergi optimizasyonu, şirket kuruluşu',
  'Consulting19 - Plataforma de Consultoria Empresarial Global com IA',
  'Orientação especializada para expansão internacional de negócios. Plataforma com IA conectando empreendedores com consultores em 19+ países para otimização fiscal, formação de empresas e conformidade legal.',
  'negócios internacionais, expansão global, consultoria IA, consultores empresariais, otimização fiscal, formação de empresas'
) ON CONFLICT (page_key) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  content_tr = EXCLUDED.content_tr,
  content_pt = EXCLUDED.content_pt,
  meta_title_en = EXCLUDED.meta_title_en,
  meta_description_en = EXCLUDED.meta_description_en,
  meta_keywords_en = EXCLUDED.meta_keywords_en,
  meta_title_tr = EXCLUDED.meta_title_tr,
  meta_description_tr = EXCLUDED.meta_description_tr,
  meta_keywords_tr = EXCLUDED.meta_keywords_tr,
  meta_title_pt = EXCLUDED.meta_title_pt,
  meta_description_pt = EXCLUDED.meta_description_pt,
  meta_keywords_pt = EXCLUDED.meta_keywords_pt,
  updated_at = now();

-- Insert services_overview page
INSERT INTO marketing_pages (
  page_key,
  content_en,
  content_tr,
  content_pt,
  meta_title_en,
  meta_description_en,
  meta_keywords_en,
  meta_title_tr,
  meta_description_tr,
  meta_keywords_tr,
  meta_title_pt,
  meta_description_pt,
  meta_keywords_pt
) VALUES (
  'services_overview',
  '{
    "title": "Comprehensive Business Services",
    "subtitle": "End-to-end solutions for international business expansion",
    "description": "From company formation to ongoing compliance, we provide complete support delivered by expert consultants in 19+ countries.",
    "categories": [
      {
        "title": "Company Formation",
        "description": "Complete business setup and incorporation services",
        "services": ["Company registration", "Business licenses", "Corporate structure setup", "Registered agent", "Virtual office"]
      },
      {
        "title": "Tax Optimization",
        "description": "Strategic tax planning and compliance solutions",
        "services": ["International tax planning", "Double tax treaty", "Tax residency planning", "Transfer pricing", "Annual compliance"]
      },
      {
        "title": "Banking Solutions",
        "description": "Global banking and payment processing services",
        "services": ["Account opening", "Multi-currency", "Payment gateways", "Banking relationships", "Trade finance"]
      },
      {
        "title": "Legal Compliance",
        "description": "Ongoing legal and regulatory support",
        "services": ["Compliance monitoring", "Contract review", "Legal structure optimization", "IP protection", "Data protection"]
      }
    ]
  }',
  '{
    "title": "Kapsamlı İş Hizmetleri",
    "subtitle": "Uluslararası iş genişleme için uçtan uca çözümler",
    "description": "Şirket kuruluşundan devam eden uyumluluğa kadar, 19+ ülkede uzman danışmanlar tarafından sunulan tam destek sağlıyoruz.",
    "categories": [
      {
        "title": "Şirket Kuruluşu",
        "description": "Komple iş kurulumu ve kuruluş hizmetleri",
        "services": ["Şirket kaydı", "İş lisansları", "Kurumsal yapı kurulumu", "Kayıtlı temsilci", "Sanal ofis"]
      },
      {
        "title": "Vergi Optimizasyonu",
        "description": "Stratejik vergi planlama ve uyumluluk çözümleri",
        "services": ["Uluslararası vergi planlaması", "Çifte vergilendirme anlaşması", "Vergi ikameti planlaması", "Transfer fiyatlandırması", "Yıllık uyumluluk"]
      },
      {
        "title": "Bankacılık Çözümleri",
        "description": "Küresel bankacılık ve ödeme işleme hizmetleri",
        "services": ["Hesap açma", "Çok para birimli", "Ödeme geçitleri", "Bankacılık ilişkileri", "Ticaret finansmanı"]
      },
      {
        "title": "Yasal Uyumluluk",
        "description": "Devam eden yasal ve düzenleyici destek",
        "services": ["Uyumluluk izleme", "Sözleşme incelemesi", "Yasal yapı optimizasyonu", "Fikri mülkiyet korunması", "Veri korunması"]
      }
    ]
  }',
  '{
    "title": "Serviços Empresariais Abrangentes",
    "subtitle": "Soluções completas para expansão internacional de negócios",
    "description": "Da formação de empresa à conformidade contínua, fornecemos suporte completo entregue por consultores especialistas em 19+ países.",
    "categories": [
      {
        "title": "Formação de Empresa",
        "description": "Serviços completos de configuração e incorporação de negócios",
        "services": ["Registro de empresa", "Licenças comerciais", "Configuração de estrutura corporativa", "Agente registrado", "Escritório virtual"]
      },
      {
        "title": "Otimização Fiscal",
        "description": "Planejamento fiscal estratégico e soluções de conformidade",
        "services": ["Planejamento fiscal internacional", "Tratado de dupla tributação", "Planejamento de residência fiscal", "Preços de transferência", "Conformidade anual"]
      },
      {
        "title": "Soluções Bancárias",
        "description": "Serviços globais de bancos e processamento de pagamentos",
        "services": ["Abertura de conta", "Multi-moeda", "Gateways de pagamento", "Relacionamentos bancários", "Financiamento comercial"]
      },
      {
        "title": "Conformidade Legal",
        "description": "Suporte legal e regulatório contínuo",
        "services": ["Monitoramento de conformidade", "Revisão de contratos", "Otimização de estrutura legal", "Proteção de PI", "Proteção de dados"]
      }
    ]
  }',
  'Our Services - Consulting19 International Business Solutions',
  'Comprehensive international business services including company formation, tax optimization, banking solutions, and legal compliance across 19+ countries.',
  'business services, company formation, tax optimization, banking solutions, legal compliance, international business',
  'Hizmetlerimiz - Consulting19 Uluslararası İş Çözümleri',
  '19+ ülkede şirket kuruluşu, vergi optimizasyonu, bankacılık çözümleri ve yasal uyumluluk dahil kapsamlı uluslararası iş hizmetleri.',
  'iş hizmetleri, şirket kuruluşu, vergi optimizasyonu, bankacılık çözümleri, yasal uyumluluk, uluslararası iş',
  'Nossos Serviços - Soluções Empresariais Internacionais Consulting19',
  'Serviços empresariais internacionais abrangentes incluindo formação de empresas, otimização fiscal, soluções bancárias e conformidade legal em 19+ países.',
  'serviços empresariais, formação de empresas, otimização fiscal, soluções bancárias, conformidade legal, negócios internacionais'
) ON CONFLICT (page_key) DO UPDATE SET
  content_en = EXCLUDED.content_en,
  content_tr = EXCLUDED.content_tr,
  content_pt = EXCLUDED.content_pt,
  meta_title_en = EXCLUDED.meta_title_en,
  meta_description_en = EXCLUDED.meta_description_en,
  meta_keywords_en = EXCLUDED.meta_keywords_en,
  meta_title_tr = EXCLUDED.meta_title_tr,
  meta_description_tr = EXCLUDED.meta_description_tr,
  meta_keywords_tr = EXCLUDED.meta_keywords_tr,
  meta_title_pt = EXCLUDED.meta_title_pt,
  meta_description_pt = EXCLUDED.meta_description_pt,
  meta_keywords_pt = EXCLUDED.meta_keywords_pt,
  updated_at = now();

-- Insert contact_page
INSERT INTO marketing_pages (
  page_key,
  content_en,
  content_tr,
  content_pt,
  meta_title_en,
  meta_description_en,
  meta_keywords_en,
  meta_title_tr,
  meta_description_tr,
  meta_keywords_tr,
  meta_title_pt,
  meta_description_pt,
  meta_keywords_pt
) VALUES (
  'contact_page',
  '{
    "page_title": "Contact Us",
    "hero_title": "Get in Touch",
    "hero_description": "Have questions about international business expansion? Our expert team is here to help.",
    "form_title": "Send us a Message",
    "contact_info_title": "Contact Information",
    "address_title": "Our Address",
    "company_name": "Consulting19",
    "address_line1": "5830 E 2nd St, STE 7000",
    "address_line2": "Casper, WY 82609",
    "email": "support@consulting19.com",
    "phone": "+1 (307) 555-0123"
  }',
  '{
    "page_title": "Bize Ulaşın",
    "hero_title": "İletişime Geçin",
    "hero_description": "Uluslararası iş genişleme hakkında sorularınız mı var? Uzman ekibimiz yardım etmek için burada.",
    "form_title": "Bize Mesaj Gönderin",
    "contact_info_title": "İletişim Bilgileri",
    "address_title": "Adresimiz",
    "company_name": "Consulting19",
    "address_line1": "5830 E 2nd St, STE 7000",
    "address_line2": "Casper, WY 82609",
    "email": "support@consulting19.com",
    "phone": "+1 (307) 555-0123"
  }',
  '{
    "page_title": "Entre em Contato",
    "hero_title": "Entre em Contato",
    "hero_description": "Tem perguntas sobre expansão internacional de negócios? Nossa equipe especializada está aqui para ajudar.",
    "form_title": "Envie-nos uma Mensagem",
    "contact_info_title": "Informações de Contato",
    "address_title": "Nosso Endereço",
    "company_name": "Consulting19",
    "address_line1": "5830 E 2nd St, STE 7000",
    "address_line2": "Casper, WY 82609",
    "email": "support@consulting19.com",
    "phone": "+1 (307) 555-0123"
  }',
  'Contact Consulting19 - Get Expert International Business Guidance',
  'Contact our expert team for international business expansion guidance. Get help with company formation, tax optimization, and global business solutions.',
  'contact consulting19, international business help, business expansion contact, expert guidance',
  'Consulting19 ile İletişim - Uzman Uluslararası İş Rehberliği Alın',
  'Uluslararası iş genişleme rehberliği için uzman ekibimizle iletişime geçin. Şirket kuruluşu, vergi optimizasyonu ve küresel iş çözümleri konusunda yardım alın.',
  'consulting19 iletişim, uluslararası iş yardımı, iş genişleme iletişim, uzman rehberlik',
  'Contato Consulting19 - Obtenha Orientação Empresarial Internacional Especializada',
  'Entre em contato com nossa equipe especializada para orientação sobre expansão internacional de negócios. Obtenha ajuda com formação de empresas, otimização fiscal e soluções empresariais globais.',
  'contato consulting19, ajuda negócios internacionais, contato expansão empresarial, orientação especializada'
) ON CONFLICT (page_key) DO NOTHING;

-- Insert faq_page
INSERT INTO marketing_pages (
  page_key,
  content_en,
  content_tr,
  content_pt,
  meta_title_en,
  meta_description_en,
  meta_keywords_en,
  meta_title_tr,
  meta_description_tr,
  meta_keywords_tr,
  meta_title_pt,
  meta_description_pt,
  meta_keywords_pt
) VALUES (
  'faq_page',
  '{
    "page_title": "Frequently Asked Questions",
    "hero_title": "Frequently Asked Questions",
    "hero_description": "Find answers to common questions about our services, processes, and platform.",
    "search_placeholder": "Search questions...",
    "categories": [
      "All Categories",
      "Account & Registration",
      "Services & Pricing",
      "Payments & Billing",
      "Legal & Compliance",
      "Technical Support"
    ],
    "cta_title": "Still Have Questions?",
    "cta_description": "Can't find what you're looking for? Our support team is here to help."
  }',
  '{
    "page_title": "Sık Sorulan Sorular",
    "hero_title": "Sık Sorulan Sorular",
    "hero_description": "Hizmetlerimiz, süreçlerimiz ve platformumuz hakkında yaygın soruların cevaplarını bulun.",
    "search_placeholder": "Soruları arayın...",
    "categories": [
      "Tüm Kategoriler",
      "Hesap ve Kayıt",
      "Hizmetler ve Fiyatlandırma",
      "Ödemeler ve Faturalandırma",
      "Yasal ve Uyumluluk",
      "Teknik Destek"
    ],
    "cta_title": "Hala Sorularınız Var mı?",
    "cta_description": "Aradığınızı bulamıyor musunuz? Destek ekibimiz yardım etmek için burada."
  }',
  '{
    "page_title": "Perguntas Frequentes",
    "hero_title": "Perguntas Frequentes",
    "hero_description": "Encontre respostas para perguntas comuns sobre nossos serviços, processos e plataforma.",
    "search_placeholder": "Pesquisar perguntas...",
    "categories": [
      "Todas as Categorias",
      "Conta e Registro",
      "Serviços e Preços",
      "Pagamentos e Faturamento",
      "Legal e Conformidade",
      "Suporte Técnico"
    ],
    "cta_title": "Ainda Tem Perguntas?",
    "cta_description": "Não consegue encontrar o que procura? Nossa equipe de suporte está aqui para ajudar."
  }',
  'FAQ - Consulting19 International Business Questions',
  'Find answers to frequently asked questions about international business expansion, company formation, tax optimization, and our consulting services.',
  'FAQ, frequently asked questions, international business, company formation, tax optimization, consulting services',
  'SSS - Consulting19 Uluslararası İş Soruları',
  'Uluslararası iş genişleme, şirket kuruluşu, vergi optimizasyonu ve danışmanlık hizmetlerimiz hakkında sık sorulan soruların cevaplarını bulun.',
  'SSS, sık sorulan sorular, uluslararası iş, şirket kuruluşu, vergi optimizasyonu, danışmanlık hizmetleri',
  'FAQ - Perguntas sobre Negócios Internacionais Consulting19',
  'Encontre respostas para perguntas frequentes sobre expansão internacional de negócios, formação de empresas, otimização fiscal e nossos serviços de consultoria.',
  'FAQ, perguntas frequentes, negócios internacionais, formação de empresas, otimização fiscal, serviços de consultoria'
) ON CONFLICT (page_key) DO NOTHING;