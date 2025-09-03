/*
  # Initial Data Setup

  1. Countries
    - Add Georgia as the first supported country
    
  2. Test Users
    - Admin user
    - Consultant user (Giorgi Meskhi)
    - Client user
    
  3. Consultant Assignments
    - Assign Giorgi to Georgia
*/

-- Insert Georgia as the first country
INSERT INTO countries (id, name, code, flag_emoji, description_i18n, business_info, is_active, sort_order)
VALUES (
    uuid_generate_v4(),
    'Georgia',
    'GE',
    '🇬🇪',
    '{
        "en": "Strategic business hub between Europe and Asia with favorable tax policies and streamlined company formation processes.",
        "tr": "Avrupa ve Asya arasında stratejik iş merkezi, uygun vergi politikaları ve basitleştirilmiş şirket kuruluş süreçleri.",
        "pt": "Centro de negócios estratégico entre Europa e Ásia com políticas fiscais favoráveis e processos simplificados de formação de empresas."
    }',
    '{
        "capital": "Tbilisi",
        "language": "Georgian, English",
        "currency": "Georgian Lari (GEL)",
        "timezone": "GMT+4",
        "business_advantages": [
            "Small Business Status (1% tax rate)",
            "International Business Company (0% tax on foreign income)",
            "EU Association Agreement benefits",
            "Strategic location between Europe and Asia",
            "Simple online company registration",
            "No currency restrictions"
        ],
        "key_facts": [
            {"label": "Corporate Tax Rate", "value": "20%"},
            {"label": "Small Business Tax", "value": "1%"},
            {"label": "Formation Time", "value": "1-2 days"},
            {"label": "Minimum Capital", "value": "No minimum"}
        ]
    }',
    true,
    1
) ON CONFLICT (code) DO NOTHING;

-- Note: Test users will be created through the auth system
-- The handle_new_user() trigger will automatically create user_profiles entries

-- Insert sample global services for homepage
INSERT INTO global_services (name_i18n, description_i18n, icon_name, sort_order, is_active)
VALUES 
(
    '{
        "en": "Company Formation",
        "tr": "Şirket Kuruluşu", 
        "pt": "Formação de Empresa"
    }',
    '{
        "en": "Professional business setup and incorporation services worldwide",
        "tr": "Dünya çapında profesyonel iş kurulumu ve şirket kuruluş hizmetleri",
        "pt": "Configuração profissional de negócios e serviços de incorporação em todo o mundo"
    }',
    'Building2',
    1,
    true
),
(
    '{
        "en": "Tax Optimization",
        "tr": "Vergi Optimizasyonu",
        "pt": "Otimização Fiscal"
    }',
    '{
        "en": "Strategic tax planning and international tax optimization",
        "tr": "Stratejik vergi planlaması ve uluslararası vergi optimizasyonu", 
        "pt": "Planejamento tributário estratégico e otimização fiscal internacional"
    }',
    'Calculator',
    2,
    true
),
(
    '{
        "en": "Banking Solutions",
        "tr": "Bankacılık Çözümleri",
        "pt": "Soluções Bancárias"
    }',
    '{
        "en": "Global banking and financial services access",
        "tr": "Küresel bankacılık ve finansal hizmetlere erişim",
        "pt": "Acesso a serviços bancários e financeiros globais"
    }',
    'CreditCard',
    3,
    true
),
(
    '{
        "en": "Legal Compliance",
        "tr": "Yasal Uyumluluk",
        "pt": "Conformidade Legal"
    }',
    '{
        "en": "Comprehensive legal and regulatory compliance",
        "tr": "Kapsamlı yasal ve düzenleyici uyumluluk",
        "pt": "Conformidade legal e regulatória abrangente"
    }',
    'FileText',
    4,
    true
);