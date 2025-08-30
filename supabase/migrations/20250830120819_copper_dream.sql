/*
  # Add sample marketing content for about page

  1. Sample Data
    - Add sample content for `about_page` in English, Turkish, and Portuguese
    - Include SEO meta data for all languages
    - Set default active status

  2. Safety
    - Use ON CONFLICT DO NOTHING to prevent duplicate entries
    - Only insert if page_key doesn't exist
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
    "page_title": "Consulting19 Hakkında",
    "hero_description": "2016'dan beri, AI destekli zeka ile küresel uzman danışmanlar ağını birleştirerek uluslararası genişlemeyi basitleştiriyoruz. Kurucuların ve yatırımcıların 19+ ülkede başlatma, bankacılık, vergi optimizasyonu ve uyumlu kalmasına yardımcı oluyoruz.",
    "mission_title": "Misyonumuz",
    "mission_description": "Uzman rehberliği erişilebilir, hızlı ve adil fiyatlı hale getirerek uluslararası genişlemeyi demokratikleştirmek. Otomasyon ve yerel uzmanlığın pratik karışımı yoluyla her boyuttaki şirket için kurumsal düzeyde sonuçlar sunuyoruz.",
    "values_description": "Uluslararası iş danışmanlığı yaklaşımımıza rehberlik eden ilkeler",
    "timeline_description": "İnovasyon ve büyüme yolculuğumuz",
    "platforms_description": "Sofistike servet yönetimi ve yatırım fırsatları için özel platformlar",
    "story_description": "Consulting19, 2016'da basit bir gözlemle başladı: sınır ötesi genişleme gerekenden daha zordu. Son teknoloji AI'yi seçilmiş yerel uzmanlar ağıyla eşleştirerek, şirket kuruluşu, bankacılık, vergi optimizasyonu ve uyumluluk konularında kurumsal düzeyde sonuçları geleneksel modellerden daha hızlı ve öngörülebilir şekilde sunuyoruz.",
    "cta_title": "Misyonumuza Katılmaya Hazır mısınız?",
    "cta_description": "İster küresel olarak genişleyin ister müşterilere danışmanlık yapın, işbirliği yapmayı çok isteriz."
  }',
  '{
    "page_title": "Sobre a Consulting19",
    "hero_description": "Desde 2016, temos simplificado a expansão internacional combinando inteligência alimentada por IA com uma rede global de consultores especialistas. Ajudamos fundadores e investidores a lançar, fazer operações bancárias, otimizar impostos e manter conformidade em 19+ países.",
    "mission_title": "Nossa Missão",
    "mission_description": "Democratizar a expansão internacional tornando a orientação especializada acessível, rápida e com preços justos. Entregamos resultados de nível empresarial para empresas de todos os tamanhos através da combinação prática de automação e expertise local.",
    "values_description": "Os princípios que orientam nossa abordagem à consultoria empresarial internacional",
    "timeline_description": "Nossa jornada de inovação e crescimento",
    "platforms_description": "Plataformas especializadas para gestão sofisticada de patrimônio e oportunidades de investimento",
    "story_description": "A Consulting19 começou em 2016 com uma observação simples: a expansão transfronteiriça era mais difícil do que precisava ser. Ao combinar IA de ponta com uma rede curada de especialistas locais, entregamos resultados de nível empresarial—formação de empresas, bancos, otimização fiscal e conformidade—mais rápido e mais previsivelmente que modelos tradicionais.",
    "cta_title": "Pronto para Se Juntar à Nossa Missão?",
    "cta_description": "Seja expandindo globalmente ou aconselhando clientes, adoraríamos colaborar."
  }',
  'About Consulting19 - AI-Powered Global Business Consulting',
  'Expert guidance for international business expansion. Learn about our mission, values, and global network of advisors helping businesses succeed internationally.',
  'international business, global expansion, business consulting, AI-powered, expert advisors',
  'Consulting19 Hakkında - AI Destekli Küresel İş Danışmanlığı',
  'Uluslararası iş genişleme için uzman rehberlik. Misyonumuz, değerlerimiz ve işletmelerin uluslararası başarısına yardımcı olan küresel danışman ağımız hakkında bilgi edinin.',
  'uluslararası iş, küresel genişleme, iş danışmanlığı, AI destekli, uzman danışmanlar',
  'Sobre a Consulting19 - Consultoria Empresarial Global com IA',
  'Orientação especializada para expansão internacional de negócios. Saiba sobre nossa missão, valores e rede global de consultores ajudando empresas a ter sucesso internacionalmente.',
  'negócios internacionais, expansão global, consultoria empresarial, alimentado por IA, consultores especialistas'
) ON CONFLICT (page_key) DO NOTHING;