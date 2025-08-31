/*
  # Insert initial data

  1. Test Users
    - Admin user
    - Consultant user (Giorgi Meskhi)
    - Client user

  2. Initial Data
    - Global services
    - Consultant country assignment
    - Sample custom services

  Note: This assumes auth.users already has the test accounts
*/

-- Insert global services (Admin managed homepage categories)
INSERT INTO global_services (name_i18n, description_i18n, icon_name, sort_order) VALUES
(
  '{"en": "Company Formation", "tr": "Şirket Kuruluşu", "pt": "Formação de Empresa"}',
  '{"en": "Professional business setup and incorporation services worldwide", "tr": "Dünya çapında profesyonel iş kurulumu ve kuruluş hizmetleri", "pt": "Serviços profissionais de configuração e incorporação de negócios em todo o mundo"}',
  'Building2',
  1
),
(
  '{"en": "Tax Optimization", "tr": "Vergi Optimizasyonu", "pt": "Otimização Fiscal"}',
  '{"en": "Strategic tax planning and international tax optimization", "tr": "Stratejik vergi planlaması ve uluslararası vergi optimizasyonu", "pt": "Planejamento tributário estratégico e otimização tributária internacional"}',
  'Calculator',
  2
),
(
  '{"en": "Banking Solutions", "tr": "Bankacılık Çözümleri", "pt": "Soluções Bancárias"}',
  '{"en": "Global banking and financial services access", "tr": "Küresel bankacılık ve finansal hizmetlere erişim", "pt": "Acesso a serviços bancários e financeiros globais"}',
  'CreditCard',
  3
),
(
  '{"en": "Legal Compliance", "tr": "Yasal Uyumluluk", "pt": "Conformidade Legal"}',
  '{"en": "Comprehensive legal and regulatory compliance", "tr": "Kapsamlı yasal ve düzenleyici uyumluluk", "pt": "Conformidade legal e regulatória abrangente"}',
  'FileText',
  4
)
ON CONFLICT DO NOTHING;

-- Note: User profiles will be created automatically via trigger when users sign up
-- The following would be created when actual users register:

-- Sample consultant country assignment (will be created when consultant exists)
-- INSERT INTO consultant_country_assignments (consultant_id, country_id) 
-- SELECT up.id, c.id 
-- FROM user_profiles up, countries c 
-- WHERE up.email = 'giorgi.meskhi@consulting19.com' AND c.code = 'georgia'
-- ON CONFLICT DO NOTHING;

-- Sample custom services (will be created by consultant)
-- These will be created through the consultant dashboard interface