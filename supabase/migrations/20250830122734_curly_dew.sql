/*
  # Add sample marketing content

  1. Sample Data
    - Add about_page content in English, Turkish, and Portuguese
    - Include meta tags for SEO
    - Set as active page

  2. Content Structure
    - Structured JSON content for easy management
    - Multi-language support
    - SEO optimization
*/

-- Insert sample marketing content for about page
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
  meta_keywords_pt,
  image_url,
  is_active
) VALUES (
  'about_page',
  '{
    "page_title": "About Consulting19",
    "hero_description": "Since 2016, we have been simplifying international expansion by combining AI-powered intelligence with a global network of expert advisors. We help founders and investors launch, bank, optimize taxes, and stay compliant across 19+ countries.",
    "mission_title": "Our Mission",
    "mission_description": "To democratize international expansion by making expert guidance accessible, fast, and fairly priced. We deliver enterprise-grade outcomes for companies of all sizes through the practical blend of automation and local expertise.",
    "values_description": "The principles that guide our approach to international business consulting",
    "timeline_description": "Our journey of innovation and growth",
    "platforms_description": "Specialized platforms for sophisticated wealth management and investment opportunities",
    "story_description": "Consulting19 began in 2016 with a simple observation: cross-border expansion was harder than it needed to be. By pairing cutting-edge AI with a curated network of local experts, we deliver enterprise-level results—company formation, banking, tax optimization, and compliance—faster and more predictably than traditional models.",
    "cta_title": "Ready to Join Our Mission?",
    "cta_description": "Whether you are expanding globally or advising clients, we would love to collaborate."
  }',
  '{
    "page_title": "Consulting19 Hakkinda",
    "hero_description": "2016 yilindan beri, AI destekli zeka ile kuresel uzman danismanlar agini birlestirerek uluslararasi genislemeyi basitlestiriyoruz. Kurucuların ve yatirimcilarin 19+ ulkede baslatma, bankacilik, vergi optimizasyonu ve uyumlu kalmasina yardimci oluyoruz.",
    "mission_title": "Misyonumuz",
    "mission_description": "Uzman rehberligini erisebilir, hizli ve adil fiyatli hale getirerek uluslararasi genislemeyi demokratiklestirmek. Otomasyon ve yerel uzmanligin pratik karisimi araciligiyla her boyuttaki sirket icin kurumsal duzeyde sonuclar sunuyoruz.",
    "values_description": "Uluslararasi is danismanligi yaklasimimizi yonlendiren ilkeler",
    "timeline_description": "Inovasyon ve buyume yolculugumuz",
    "platforms_description": "Sofistike servet yonetimi ve yatirim firsatlari icin ozel platformlar",
    "story_description": "Consulting19, 2016 yilinda basit bir gozlemle basladi: sinir otesi genisleme gerekenden daha zordu. Son teknoloji AI ile seckin yerel uzmanlar agini eslestirerek, geleneksel modellerden daha hizli ve ongurulur sekilde kurumsal duzeyde sonuclar sunuyoruz.",
    "cta_title": "Misyonumuza Katilmaya Hazir misiniz?",
    "cta_description": "Kuresel olarak genisliyor veya musterilere danismanlik veriyor olun, isbirligi yapmak isteriz."
  }',
  '{
    "page_title": "Sobre Consulting19",
    "hero_description": "Desde 2016, temos simplificado a expansao internacional combinando inteligencia alimentada por IA com uma rede global de consultores especialistas. Ajudamos fundadores e investidores a lancar, fazer operacoes bancarias, otimizar impostos e manter conformidade em 19+ paises.",
    "mission_title": "Nossa Missao",
    "mission_description": "Democratizar a expansao internacional tornando a orientacao especializada acessivel, rapida e com preco justo. Entregamos resultados de nivel empresarial para empresas de todos os tamanhos atraves da combinacao pratica de automacao e expertise local.",
    "values_description": "Os principios que guiam nossa abordagem para consultoria empresarial internacional",
    "timeline_description": "Nossa jornada de inovacao e crescimento",
    "platforms_description": "Plataformas especializadas para gestao sofisticada de patrimonio e oportunidades de investimento",
    "story_description": "Consulting19 comecou em 2016 com uma observacao simples: expansao transfronteirica era mais dificil do que precisava ser. Ao combinar IA de ponta com uma rede curada de especialistas locais, entregamos resultados de nivel empresarial mais rapido e mais previsivelmente que modelos tradicionais.",
    "cta_title": "Pronto para se Juntar a Nossa Missao?",
    "cta_description": "Seja expandindo globalmente ou aconselhando clientes, adorariamos colaborar."
  }',
  'About Consulting19 - AI-Powered Global Business Consulting',
  'Learn about Consulting19, the AI-powered platform connecting entrepreneurs with expert advisors in 19+ countries for international business expansion.',
  'consulting19, about, international business, AI consulting, global expansion, business advisors',
  'Consulting19 Hakkinda - AI Destekli Kuresel Is Danismanligi',
  'Consulting19 hakkinda bilgi edinin, girisimcileri uluslararasi is genislemesi icin 19+ ulkede uzman danismanlarla bulusturan AI destekli platform.',
  'consulting19, hakkinda, uluslararasi is, AI danismanlik, kuresel genisleme, is danismanlari',
  'Sobre Consulting19 - Consultoria Empresarial Global Alimentada por IA',
  'Saiba sobre Consulting19, a plataforma alimentada por IA conectando empreendedores com consultores especialistas em 19+ paises para expansao empresarial internacional.',
  'consulting19, sobre, negocios internacionais, consultoria IA, expansao global, consultores empresariais',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  true
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
  image_url = EXCLUDED.image_url,
  is_active = EXCLUDED.is_active,
  updated_at = now();