/*
  # Add sample marketing content

  1. Sample Data
    - Add sample content for `about_page` in English, Turkish, and Portuguese
    - Include SEO meta data
    - Use safe INSERT with ON CONFLICT DO NOTHING

  2. Safety
    - Uses ON CONFLICT DO NOTHING to prevent duplicate entries
    - Safe to run multiple times
*/

-- Insert sample marketing content for about page
INSERT INTO marketing_pages (
  page_key,
  content_en,
  content_tr,
  content_pt,
  meta_title_en,
  meta_description_en,
  meta_title_tr,
  meta_description_tr,
  meta_title_pt,
  meta_description_pt,
  is_active
) VALUES (
  'about_page',
  '{
    "page_title": "About Consulting19",
    "hero_description": "Since 2016, we have been simplifying international expansion by combining AI-powered intelligence with a global network of expert advisors.",
    "mission_title": "Our Mission",
    "mission_description": "To democratize international expansion by making expert guidance accessible, fast, and fairly priced. We deliver enterprise-grade outcomes for companies of all sizes through the practical blend of automation and local expertise.",
    "values_description": "The principles that guide our approach to international business consulting",
    "timeline_description": "Our journey of innovation and growth",
    "platforms_description": "Specialized platforms for sophisticated wealth management and investment opportunities",
    "story_description": "Consulting19 began in 2016 with a simple observation: cross-border expansion was harder than it needed to be.",
    "cta_title": "Ready to Join Our Mission?",
    "cta_description": "Whether you are expanding globally or advising clients, we would love to collaborate."
  }',
  '{
    "page_title": "Consulting19 Hakkında",
    "hero_description": "2016''dan beri, AI destekli zeka ile küresel uzman danışman ağımızı birleştirerek uluslararası genişlemeyi basitleştiriyoruz.",
    "mission_title": "Misyonumuz",
    "mission_description": "Uzman rehberliğini erişilebilir, hızlı ve adil fiyatlı hale getirerek uluslararası genişlemeyi demokratikleştirmek. Otomasyon ve yerel uzmanlığın pratik karışımı ile her büyüklükteki şirket için kurumsal düzeyde sonuçlar sunuyoruz.",
    "values_description": "Uluslararası iş danışmanlığı yaklaşımımıza rehberlik eden ilkeler",
    "timeline_description": "İnovasyon ve büyüme yolculuğumuz",
    "platforms_description": "Sofistike varlık yönetimi ve yatırım fırsatları için özel platformlar",
    "story_description": "Consulting19, 2016''da basit bir gözlemle başladı: sınır ötesi genişleme gerekenden daha zordu.",
    "cta_title": "Misyonumuza Katılmaya Hazır mısınız?",
    "cta_description": "İster küresel olarak genişleyin ister müşterilere danışmanlık yapın, işbirliği yapmayı çok isteriz."
  }',
  '{
    "page_title": "Sobre a Consulting19",
    "hero_description": "Desde 2016, temos simplificado a expansão internacional combinando inteligência alimentada por IA com uma rede global de consultores especialistas.",
    "mission_title": "Nossa Missão",
    "mission_description": "Democratizar a expansão internacional tornando a orientação especializada acessível, rápida e com preços justos. Entregamos resultados de nível empresarial para empresas de todos os tamanhos através da combinação prática de automação e expertise local.",
    "values_description": "Os princípios que orientam nossa abordagem à consultoria empresarial internacional",
    "timeline_description": "Nossa jornada de inovação e crescimento",
    "platforms_description": "Plataformas especializadas para gestão sofisticada de patrimônio e oportunidades de investimento",
    "story_description": "A Consulting19 começou em 2016 com uma observação simples: a expansão transfronteiriça era mais difícil do que precisava ser.",
    "cta_title": "Pronto para se Juntar à Nossa Missão?",
    "cta_description": "Seja expandindo globalmente ou aconselhando clientes, adoraríamos colaborar."
  }',
  'About Consulting19 - International Business Expansion',
  'Learn about Consulting19''s mission to democratize international expansion through AI-powered intelligence and expert guidance since 2016.',
  'Consulting19 Hakkında - Uluslararası İş Genişlemesi',
  '2016''dan beri AI destekli zeka ve uzman rehberliği ile uluslararası genişlemeyi demokratikleştiren Consulting19''un misyonu hakkında bilgi edinin.',
  'Sobre a Consulting19 - Expansão Internacional de Negócios',
  'Saiba mais sobre a missão da Consulting19 de democratizar a expansão internacional através de inteligência alimentada por IA e orientação especializada desde 2016.',
  true
) ON CONFLICT (page_key) DO NOTHING;