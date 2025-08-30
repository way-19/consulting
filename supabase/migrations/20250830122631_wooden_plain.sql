```sql
INSERT INTO public.marketing_pages (page_key, content_en, content_tr, content_pt, meta_title_en, meta_description_en, meta_keywords_en, meta_title_tr, meta_description_tr, meta_keywords_tr, meta_title_pt, meta_description_pt, meta_keywords_pt, image_url, is_active)
VALUES
    ('about_page',
     '{"page_title": "About Consulting19", "hero_description": "Since 2016, we''ve been simplifying international expansion by combining AI-powered intelligence with a global network of expert advisors. We help founders and investors launch, bank, optimize taxes, and stay compliant across 19+ countries.", "mission_title": "Our Mission", "mission_description": "To democratize international expansion by making expert guidance accessible, fast, and fairly priced. We deliver enterprise-grade outcomes for companies of all sizes through the practical blend of automation and local expertise.", "values_description": "The principles that guide our approach to international business consulting", "timeline_description": "Our journey of innovation and growth", "platforms_description": "Specialized platforms for sophisticated wealth management and investment opportunities", "story_description": "Consulting19 began in 2016 with a simple observation: cross-border expansion was harder than it needed to be. By pairing cutting-edge AI with a curated network of local experts, we deliver enterprise-level results—company formation, banking, tax optimization, and compliance—faster and more predictably than traditional models.", "cta_title": "Ready to Join Our Mission?", "cta_description": "Whether you''re expanding globally or advising clients, we''d love to collaborate."}',
     '{"page_title": "Consulting19 Hakkında", "hero_description": "2016''dan beri, yapay zeka destekli zeka ile küresel uzman danışmanlar ağını birleştirerek uluslararası genişlemeyi basitleştiriyoruz. Kurucuların ve yatırımcıların 19+ ülkede başlatma, bankacılık, vergi optimizasyonu ve uyumlu kalmasına yardımcı oluyoruz.", "mission_title": "Misyonumuz", "mission_description": "Uluslararası genişlemeyi, uzman rehberliği erişilebilir, hızlı ve adil fiyatlı hale getirerek demokratikleştirmek. Otomasyon ve yerel uzmanlığın pratik karışımıyla her büyüklükteki şirket için kurumsal düzeyde sonuçlar sunuyoruz.", "values_description": "Uluslararası iş danışmanlığı yaklaşımımızı yönlendiren ilkeler", "timeline_description": "İnovasyon ve büyüme yolculuğumuz", "platforms_description": "Sofistike servet yönetimi ve yatırım fırsatları için özel platformlar", "story_description": "Consulting19, 2016 yılında basit bir gözlemle başladı: Sınır ötesi genişleme, olması gerekenden daha zordu. Son teknoloji yapay zekayı seçkin bir yerel uzman ağıyla birleştirerek, şirket kuruluşu, bankacılık, vergi optimizasyonu ve uyumluluk gibi kurumsal düzeyde sonuçları geleneksel modellere göre daha hızlı ve daha öngörülebilir bir şekilde sunuyoruz.", "cta_title": "Misyonumuza Katılmaya Hazır mısınız?", "cta_description": "İster küresel olarak genişliyor olun, ister müşterilere danışmanlık yapıyor olun, işbirliği yapmaktan memnuniyet duyarız."}',
     '{"page_title": "Sobre a Consulting19", "hero_description": "Desde 2016, simplificamos a expansão internacional combinando inteligência alimentada por IA com uma rede global de consultores especializados. Ajudamos fundadores e investidores a lançar, bancar, otimizar impostos e manter a conformidade em mais de 19 países.", "mission_title": "Nossa Missão", "mission_description": "Democratizar a expansão internacional, tornando a orientação especializada acessível, rápida e com preços justos. Entregamos resultados de nível empresarial para empresas de todos os tamanhos através da combinação prática de automação e expertise local.", "values_description": "Os princípios que guiam nossa abordagem à consultoria de negócios internacionais", "timeline_description": "Nossa jornada de inovação e crescimento", "platforms_description": "Plataformas especializadas para gestão sofisticada de patrimônio e oportunidades de investimento", "story_description": "A Consulting19 começou em 2016 com uma observação simples: a expansão transfronteiriça era mais difícil do que precisava ser. Ao combinar IA de ponta com uma rede selecionada de especialistas locais, entregamos resultados de nível empresarial — formação de empresas, bancos, otimização fiscal e conformidade — de forma mais rápida e previsível do que os modelos tradicionais.", "cta_title": "Pronto para se Juntar à Nossa Missão?", "cta_description": "Seja você expandindo globalmente ou aconselhando clientes, adoraríamos colaborar."}',
     'About Consulting19',
     'Expert guidance for international business expansion. AI-powered platform connecting you with advisors in 19+ countries for tax optimization, company formation, and legal compliance.',
     'consulting19, about us, international business, AI consulting, global expansion',
     'Consulting19 Hakkında',
     'Uluslararası iş genişlemesi için uzman rehberlik. 19+ ülkede vergi optimizasyonu, şirket kuruluşu ve yasal uyumluluk için danışmanlarla sizi buluşturan yapay zeka destekli platform.',
     'consulting19, hakkımızda, uluslararası iş, yapay zeka danışmanlığı, küresel genişleme',
     'Sobre a Consulting19',
     'Orientação especializada para expansão internacional de negócios. Plataforma com IA conectando você com consultores em 19+ países para otimização fiscal, formação de empresas e conformidade legal.',
     'consulting19, sobre nós, negócios internacionais, consultoria de IA, expansão global',
     'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
     TRUE
    )
ON CONFLICT (page_key) DO UPDATE SET
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
```