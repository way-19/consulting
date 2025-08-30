/*
  # Add sample marketing content for about page

  1. Sample Data
    - Add sample content for about_page in English, Turkish, and Portuguese
    - Include SEO meta data for all languages
    - Use proper JSON escaping for special characters

  2. Safety
    - Use ON CONFLICT DO NOTHING to prevent duplicate entries
    - Safe for multiple runs
*/

-- Add sample marketing content for about page
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
    "hero_description": "2016 yilindan beri, AI destekli zeka ile kuresel uzman danismanlar agini birlestirerek uluslararasi genislemeyi basitlestiriyoruz. Kurucularin ve yatirimcilarin 19+ ulkede baslatma, bankacilik, vergi optimizasyonu ve uyumlu kalmasina yardimci oluyoruz.",
    "mission_title": "Misyonumuz",
    "mission_description": "Uzman rehberligini erisebilir, hizli ve adil fiyatli hale getirerek uluslararasi genislemeyi demokratiklestirmek. Otomasyon ve yerel uzmanligin pratik karisimi yoluyla her boyuttaki sirketler icin kurumsal duzeyde sonuclar sunuyoruz.",
    "values_description": "Uluslararasi is danismanligi yaklasimimizi yonlendiren ilkeler",
    "timeline_description": "Inovasyon ve buyume yolculugumuz",
    "platforms_description": "Sofistike servet yonetimi ve yatirim firsatlari icin ozel platformlar",
    "story_description": "Consulting19, 2016 yilinda basit bir gozlemle basladi: sinir otesi genisleme gerekenden daha zordu. Son teknoloji AI ile secilmis yerel uzmanlar agini eslestirerek, sirket kurulusu, bankacilik, vergi optimizasyonu ve uyumluluk gibi kurumsal duzeyde sonuclari geleneksel modellerden daha hizli ve ongurulebilit sekilde sunuyoruz.",
    "cta_title": "Misyonumuza Katilmaya Hazir misiniz?",
    "cta_description": "Kuresel olarak genisliyor veya musteri danismanligi yapiyor olun, isbirligi yapmak isteriz."
  }',
  '{
    "page_title": "Sobre a Consulting19",
    "hero_description": "Desde 2016, temos simplificado a expansao internacional combinando inteligencia alimentada por IA com uma rede global de consultores especialistas. Ajudamos fundadores e investidores a lancar, fazer operacoes bancarias, otimizar impostos e manter conformidade em 19+ paises.",
    "mission_title": "Nossa Missao",
    "mission_description": "Democratizar a expansao internacional tornando orientacao especializada acessivel, rapida e com preco justo. Entregamos resultados de nivel empresarial para empresas de todos os tamanhos atraves da combinacao pratica de automacao e expertise local.",
    "values_description": "Os principios que guiam nossa abordagem para consultoria empresarial internacional",
    "timeline_description": "Nossa jornada de inovacao e crescimento",
    "platforms_description": "Plataformas especializadas para gestao sofisticada de patrimonio e oportunidades de investimento",
    "story_description": "A Consulting19 comecou em 2016 com uma observacao simples: expansao transfronteirica era mais dificil do que precisava ser. Ao combinar IA de ponta com uma rede curada de especialistas locais, entregamos resultados de nivel empresarial—formacao de empresa, bancos, otimizacao fiscal e conformidade—mais rapido e mais previsivelmente que modelos tradicionais.",
    "cta_title": "Pronto para se Juntar a Nossa Missao?",
    "cta_description": "Seja expandindo globalmente ou aconselhando clientes, adorariamos colaborar."
  }',
  'About Consulting19 - AI-Powered Global Business Consulting',
  'Learn about Consulting19, the AI-powered platform connecting entrepreneurs with expert advisors in 19+ countries for international business expansion.',
  'consulting19, about, international business, AI consulting, global expansion, business advisors',
  'Consulting19 Hakkinda - AI Destekli Kuresel Is Danismanligi',
  'Girisimcileri uluslararasi is genislemesi icin 19+ ulkede uzman danismanlarla bulusturan AI destekli platform Consulting19 hakkinda bilgi edinin.',
  'consulting19, hakkinda, uluslararasi is, AI danismanligi, kuresel genisleme, is danismanlari',
  'Sobre a Consulting19 - Consultoria Empresarial Global com IA',
  'Saiba sobre a Consulting19, a plataforma alimentada por IA que conecta empreendedores com consultores especialistas em 19+ paises para expansao empresarial internacional.',
  'consulting19, sobre, negocios internacionais, consultoria IA, expansao global, consultores empresariais'
) ON CONFLICT (page_key) DO NOTHING;