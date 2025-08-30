/*
  # Modernize Marketing CMS Structure

  1. Data Improvements
    - Fix existing marketing_pages data with proper JSON structure
    - Add missing pages with clean, modular content
    - Standardize all JSON content fields

  2. Content Structure
    - Use consistent JSON format across all pages
    - Add proper SEO meta data for all languages
    - Create modular content blocks

  3. Safety
    - Use proper JSON escaping
    - UPSERT pattern to avoid conflicts
    - Maintain existing data where possible
*/

-- Fix about_page with clean JSON structure
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
    "story_title": "Our Story",
    "story_description": "Consulting19 began in 2016 with a simple observation: cross-border expansion was harder than it needed to be. By pairing cutting-edge AI with a curated network of local experts, we deliver enterprise-level results faster and more predictably than traditional models.",
    "cta_title": "Ready to Join Our Mission?",
    "cta_description": "Whether you are expanding globally or advising clients, we would love to collaborate."
  }'::jsonb,
  content_tr = '{
    "page_title": "Consulting19 Hakkında",
    "hero_title": "Consulting19 Hakkında",
    "hero_description": "2016 yılından beri, AI destekli zeka ile küresel uzman danışmanlar ağını birleştirerek uluslararası genişlemeyi basitleştiriyoruz.",
    "mission_title": "Misyonumuz",
    "mission_description": "Uzman rehberliği erişilebilir, hızlı ve adil fiyatlı hale getirerek uluslararası genişlemeyi demokratikleştirmek.",
    "values_title": "Değerlerimiz",
    "values_description": "Uluslararası iş danışmanlığı yaklaşımımıza rehberlik eden ilkeler",
    "story_title": "Hikayemiz",
    "story_description": "Consulting19, 2016 yılında basit bir gözlemle başladı: sınır ötesi genişleme gerekenden daha zordu.",
    "cta_title": "Misyonumuza Katılmaya Hazır mısınız?",
    "cta_description": "İster küresel olarak genişleyin ister müşterilere danışmanlık yapın, işbirliği yapmayı çok isteriz."
  }'::jsonb,
  content_pt = '{
    "page_title": "Sobre a Consulting19",
    "hero_title": "Sobre a Consulting19",
    "hero_description": "Desde 2016, temos simplificado a expansão internacional combinando inteligência alimentada por IA com uma rede global de consultores especialistas.",
    "mission_title": "Nossa Missão",
    "mission_description": "Democratizar a expansão internacional tornando a orientação especializada acessível, rápida e com preços justos.",
    "values_title": "Nossos Valores",
    "values_description": "Os princípios que orientam nossa abordagem à consultoria empresarial internacional",
    "story_title": "Nossa História",
    "story_description": "A Consulting19 começou em 2016 com uma observação simples: a expansão transfronteiriça era mais difícil do que precisava ser.",
    "cta_title": "Pronto para Se Juntar à Nossa Missão?",
    "cta_description": "Seja expandindo globalmente ou aconselhando clientes, adoraríamos colaborar."
  }'::jsonb
WHERE page_key = 'about_page';

-- Insert homepage_hero with clean structure
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
    "page_title": "Homepage Hero",
    "hero_title": "AI-Powered Global Business Consulting",
    "hero_subtitle": "Expand Internationally with Expert Guidance",
    "hero_description": "Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance.",
    "primary_cta": "Start Your Expansion",
    "secondary_cta": "Explore Services",
    "features": [
      "AI-powered jurisdiction analysis",
      "Expert advisors in 19+ countries",
      "End-to-end business solutions",
      "Transparent pricing with no hidden fees"
    ]
  }'::jsonb,
  '{
    "page_title": "Ana Sayfa Hero",
    "hero_title": "AI Destekli Küresel İş Danışmanlığı",
    "hero_subtitle": "Uzman Rehberlikle Uluslararası Genişleyin",
    "hero_description": "Uluslararası iş genişleme için uzman rehberlik. 19+ ülkede vergi optimizasyonu, şirket kuruluşu ve yasal uyumluluk için danışmanlarla sizi buluşturan AI destekli platform.",
    "primary_cta": "Genişlemenizi Başlatın",
    "secondary_cta": "Hizmetleri Keşfedin",
    "features": [
      "AI destekli yargı alanı analizi",
      "19+ ülkede uzman danışmanlar",
      "Uçtan uca iş çözümleri",
      "Gizli ücret olmayan şeffaf fiyatlandırma"
    ]
  }'::jsonb,
  '{
    "page_title": "Hero da Página Inicial",
    "hero_title": "Consultoria Empresarial Global com IA",
    "hero_subtitle": "Expanda Internacionalmente com Orientação Especializada",
    "hero_description": "Orientação especializada para expansão internacional de negócios. Plataforma com IA conectando você com consultores em 19+ países para otimização fiscal, formação de empresas e conformidade legal.",
    "primary_cta": "Inicie Sua Expansão",
    "secondary_cta": "Explorar Serviços",
    "features": [
      "Análise de jurisdição com IA",
      "Consultores especialistas em 19+ países",
      "Soluções empresariais completas",
      "Preços transparentes sem taxas ocultas"
    ]
  }'::jsonb,
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

-- Insert services_overview with simplified structure (no individual services)
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
    "page_title": "Our Services",
    "hero_title": "Comprehensive International Business Services",
    "hero_description": "From company formation to ongoing compliance, we provide end-to-end support delivered by expert consultants in 19+ countries.",
    "section_title": "What We Offer",
    "section_description": "Complete business solutions for international expansion",
    "cta_title": "Need a Custom Solution?",
    "cta_description": "Our expert advisors can design a tailored strategy for your business needs.",
    "cta_primary": "Consult with Expert",
    "cta_secondary": "Explore Countries"
  }'::jsonb,
  '{
    "page_title": "Hizmetlerimiz",
    "hero_title": "Kapsamlı Uluslararası İş Hizmetleri",
    "hero_description": "Şirket kuruluşundan devam eden uyumluluğa kadar, 19+ ülkede uzman danışmanlar tarafından sunulan uçtan uca destek sağlıyoruz.",
    "section_title": "Neler Sunuyoruz",
    "section_description": "Uluslararası genişleme için komple iş çözümleri",
    "cta_title": "Özel Çözüme İhtiyacınız Var mı?",
    "cta_description": "Uzman danışmanlarımız iş ihtiyaçlarınız için özel bir strateji tasarlayabilir.",
    "cta_primary": "Uzmanla Görüşün",
    "cta_secondary": "Ülkeleri Keşfedin"
  }'::jsonb,
  '{
    "page_title": "Nossos Serviços",
    "hero_title": "Serviços Empresariais Internacionais Abrangentes",
    "hero_description": "Da formação de empresa à conformidade contínua, fornecemos suporte completo entregue por consultores especialistas em 19+ países.",
    "section_title": "O Que Oferecemos",
    "section_description": "Soluções empresariais completas para expansão internacional",
    "cta_title": "Precisa de uma Solução Personalizada?",
    "cta_description": "Nossos consultores especialistas podem projetar uma estratégia personalizada para suas necessidades empresariais.",
    "cta_primary": "Consultar com Especialista",
    "cta_secondary": "Explorar Países"
  }'::jsonb,
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

-- Insert contact_page with proper structure
INSERT INTO marketing_pages (
  page_key,
  content_en,
  content_tr,
  content_pt,
  meta_title_en,
  meta_description_en,
  meta_keywords_en
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
    "email": "support@consulting19.com"
  }'::jsonb,
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
    "email": "support@consulting19.com"
  }'::jsonb,
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
    "email": "support@consulting19.com"
  }'::jsonb,
  'Contact Consulting19 - Get Expert International Business Guidance',
  'Contact our expert team for international business expansion guidance. Get help with company formation, tax optimization, and global business solutions.',
  'contact consulting19, international business help, business expansion contact, expert guidance'
) ON CONFLICT (page_key) DO NOTHING;

-- Insert faq_page with proper structure
INSERT INTO marketing_pages (
  page_key,
  content_en,
  content_tr,
  content_pt,
  meta_title_en,
  meta_description_en,
  meta_keywords_en
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
    "cta_description": "Our support team is here to help you find the answers you need."
  }'::jsonb,
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
    "cta_description": "Destek ekibimiz ihtiyacınız olan cevapları bulmanıza yardımcı olmak için burada."
  }'::jsonb,
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
    "cta_description": "Nossa equipe de suporte está aqui para ajudá-lo a encontrar as respostas que precisa."
  }'::jsonb,
  'FAQ - Consulting19 International Business Questions',
  'Find answers to frequently asked questions about international business expansion, company formation, tax optimization, and our consulting services.',
  'FAQ, frequently asked questions, international business, company formation, tax optimization, consulting services'
) ON CONFLICT (page_key) DO NOTHING;