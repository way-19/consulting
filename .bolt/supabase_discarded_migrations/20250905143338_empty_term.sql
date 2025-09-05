/*
  # Insert Sample Data for Testing

  1. Sample Data
    - Test users with different roles
    - Sample consultant and client assignments
    - Demo services and packages
    - Test projects and tasks

  2. Real-world Examples
    - Giorgi Meskhi (Georgia specialist)
    - Sample client data
    - Realistic service offerings
    - Complete business workflows

  3. Testing Data
    - Covers all major use cases
    - Demonstrates platform capabilities
    - Ready for immediate testing
*/

-- Insert sample consultant user (Giorgi Meskhi)
DO $$
BEGIN
  -- Check if the user already exists
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE email = 'giorgi.meskhi@consulting19.com') THEN
    INSERT INTO user_profiles (
      id,
      email,
      full_name,
      role,
      country_id,
      preferred_language,
      timezone,
      is_active,
      metadata
    ) VALUES (
      '11111111-1111-1111-1111-111111111111',
      'giorgi.meskhi@consulting19.com',
      'Giorgi Meskhi',
      'consultant',
      (SELECT id FROM countries WHERE code = 'GE'),
      'en',
      'Asia/Tbilisi',
      true,
      '{"specializations": ["Company Formation", "Tax Planning", "Banking"], "languages": ["en", "ka", "ru"], "experience_years": 8}'
    );
  END IF;
END $$;

-- Insert sample admin user
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE email = 'admin@consulting19.com') THEN
    INSERT INTO user_profiles (
      id,
      email,
      full_name,
      role,
      preferred_language,
      is_active
    ) VALUES (
      '22222222-2222-2222-2222-222222222222',
      'admin@consulting19.com',
      'System Administrator',
      'admin',
      'en',
      true
    );
  END IF;
END $$;

-- Insert sample client user
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE email = 'client@consulting19.com') THEN
    INSERT INTO user_profiles (
      id,
      email,
      full_name,
      role,
      company,
      preferred_language,
      is_active
    ) VALUES (
      '33333333-3333-3333-3333-333333333333',
      'client@consulting19.com',
      'Sarah Johnson',
      'client',
      'TechStart Inc.',
      'en',
      true
    );
    
    -- Create client record with consultant assignment
    INSERT INTO clients (
      id,
      profile_id,
      assigned_consultant_id,
      company_name,
      status,
      priority,
      notes
    ) VALUES (
      '44444444-4444-4444-4444-444444444444',
      '33333333-3333-3333-3333-333333333333',
      '11111111-1111-1111-1111-111111111111', -- Assigned to Giorgi
      'TechStart Inc.',
      'active',
      'high',
      'Tech startup looking to expand to Georgia and EU markets'
    );
  END IF;
END $$;

-- Insert sample services from Giorgi
INSERT INTO custom_services (
  id,
  consultant_id,
  country_id,
  title_i18n,
  description_i18n,
  features_i18n,
  category,
  price,
  currency,
  billing_type,
  is_active,
  is_featured
) VALUES 
  (
    '55555555-5555-5555-5555-555555555555',
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM countries WHERE code = 'GE'),
    '{"en": "Georgia LLC Formation", "tr": "Gürcistan LLC Kuruluşu"}',
    '{"en": "Complete LLC setup with banking and tax registration in Georgia", "tr": "Gürcistan''da bankacılık ve vergi kaydı ile komple LLC kurulumu"}',
    '{"en": ["LLC registration", "Tax ID registration", "Banking assistance", "Legal compliance"], "tr": ["LLC kaydı", "Vergi ID kaydı", "Bankacılık yardımı", "Yasal uyumluluk"]}',
    'Company Formation',
    2500.00,
    'USD',
    'one_time',
    true,
    true
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM countries WHERE code = 'GE'),
    '{"en": "Tax Residency Planning", "tr": "Vergi Mukimiyeti Planlaması"}',
    '{"en": "Strategic tax planning for Georgian tax residency benefits", "tr": "Gürcistan vergi mukimiyeti avantajları için stratejik vergi planlaması"}',
    '{"en": ["Residency assessment", "Tax optimization", "Compliance guidance", "Annual reporting"], "tr": ["Mukimiyet değerlendirmesi", "Vergi optimizasyonu", "Uyumluluk rehberliği", "Yıllık raporlama"]}',
    'Tax Planning',
    1500.00,
    'USD',
    'one_time',
    true,
    false
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    '11111111-1111-1111-1111-111111111111',
    (SELECT id FROM countries WHERE code = 'GE'),
    '{"en": "Banking Setup Assistance", "tr": "Bankacılık Kurulum Yardımı"}',
    '{"en": "Corporate banking account opening assistance in Georgian banks", "tr": "Gürcistan bankalarında kurumsal banka hesabı açma yardımı"}',
    '{"en": ["Account opening", "Documentation prep", "Bank meetings", "Initial deposits"], "tr": ["Hesap açma", "Dokümantasyon hazırlığı", "Banka görüşmeleri", "İlk depozitolar"]}',
    'Banking',
    800.00,
    'USD',
    'one_time',
    true,
    false
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample project
INSERT INTO projects (
  id,
  client_id,
  consultant_id,
  title,
  description_i18n,
  status,
  priority,
  progress,
  budget,
  start_date,
  end_date
) VALUES (
  '88888888-8888-8888-8888-888888888888',
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  'TechStart Inc. Georgia Expansion',
  '{"en": "Complete business setup in Georgia including LLC formation, tax residency, and banking", "tr": "LLC kuruluşu, vergi mukimiyeti ve bankacılık dahil Gürcistan''da komple iş kurulumu"}',
  'active',
  'high',
  35,
  4800.00,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '8 weeks'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (
  client_id,
  consultant_id,
  project_id,
  title,
  description,
  status,
  priority,
  due_date,
  estimated_hours,
  actual_hours,
  billable,
  is_client_visible
) VALUES 
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '88888888-8888-8888-8888-888888888888',
    'Submit Company Documents',
    'Please upload your company incorporation documents and founder identification',
    'in_progress',
    'high',
    CURRENT_DATE + INTERVAL '3 days',
    2.0,
    0.5,
    false,
    true
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '88888888-8888-8888-8888-888888888888',
    'Review LLC Documentation',
    'Consultant to review submitted documents and prepare Georgia LLC application',
    'todo',
    'medium',
    CURRENT_DATE + INTERVAL '1 week',
    4.0,
    0.0,
    true,
    false
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    '88888888-8888-8888-8888-888888888888',
    'Banking Account Setup',
    'Coordinate with Georgian bank for corporate account opening',
    'todo',
    'medium',
    CURRENT_DATE + INTERVAL '2 weeks',
    6.0,
    0.0,
    true,
    true
  )
ON CONFLICT DO NOTHING;

-- Insert sample service order
INSERT INTO service_orders (
  id,
  client_id,
  consultant_id,
  custom_service_id,
  title,
  description,
  total_amount,
  currency,
  status
) VALUES (
  '99999999-9999-9999-9999-999999999999',
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111',
  '55555555-5555-5555-5555-555555555555',
  'Georgia LLC Formation Package',
  'Complete LLC formation with tax registration and banking assistance',
  2500.00,
  'USD',
  'in_progress'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample documents
INSERT INTO documents (
  client_id,
  consultant_id,
  name,
  type,
  category,
  status,
  notes,
  uploaded_at
) VALUES 
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Company Registration Certificate',
    'business',
    'certificate',
    'uploaded',
    'Official registration certificate from Georgian authorities',
    now() - INTERVAL '2 days'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Tax Registration Document',
    'business',
    'tax_document',
    'approved',
    'Tax ID registration completed successfully',
    now() - INTERVAL '1 day'
  )
ON CONFLICT DO NOTHING;

-- Insert sample messages
INSERT INTO messages (
  sender_id,
  receiver_id,
  content,
  is_read,
  created_at
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111', -- Giorgi (consultant)
    '33333333-3333-3333-3333-333333333333', -- Sarah (client)
    'Welcome to Consulting19! I''m Giorgi, your assigned consultant for Georgia expansion. I''ve reviewed your requirements and prepared a customized LLC formation package. Let me know when you''d like to schedule our first consultation call.',
    false,
    now() - INTERVAL '1 hour'
  ),
  (
    '33333333-3333-3333-3333-333333333333', -- Sarah (client)
    '11111111-1111-1111-1111-111111111111', -- Giorgi (consultant)
    'Hi Giorgi! Thank you for the warm welcome. I''m excited to start this expansion project. I''m available for a call tomorrow afternoon if that works for you. Also, I have some questions about the banking requirements.',
    true,
    now() - INTERVAL '30 minutes'
  )
ON CONFLICT DO NOTHING;

-- Insert sample packages
INSERT INTO packages (
  name,
  price,
  description,
  is_active
) VALUES 
  ('Starter Package', 999.00, 'Basic company formation with essential services', true),
  ('Professional Package', 2499.00, 'Complete business setup with banking and tax optimization', true),
  ('Enterprise Package', 4999.00, 'Premium service with ongoing support and consultation', true)
ON CONFLICT DO NOTHING;

-- Insert sample global services
INSERT INTO global_services (
  name_i18n,
  description_i18n,
  icon_name,
  is_active,
  sort_order
) VALUES 
  (
    '{"en": "Company Formation", "tr": "Şirket Kuruluşu"}',
    '{"en": "Complete business registration in your chosen jurisdiction", "tr": "Seçtiğiniz yargı alanında komple iş kaydı"}',
    'Building2',
    true,
    1
  ),
  (
    '{"en": "Tax Optimization", "tr": "Vergi Optimizasyonu"}',
    '{"en": "Strategic tax planning and residency optimization", "tr": "Stratejik vergi planlaması ve mukimiyet optimizasyonu"}',
    'Calculator',
    true,
    2
  ),
  (
    '{"en": "Banking Solutions", "tr": "Bankacılık Çözümleri"}',
    '{"en": "Corporate banking and financial account setup", "tr": "Kurumsal bankacılık ve finansal hesap kurulumu"}',
    'CreditCard',
    true,
    3
  ),
  (
    '{"en": "Legal Compliance", "tr": "Yasal Uyumluluk"}',
    '{"en": "Ongoing legal compliance and regulatory support", "tr": "Sürekli yasal uyumluluk ve düzenleyici destek"}',
    'Shield',
    true,
    4
  )
ON CONFLICT DO NOTHING;

-- Insert sample additional services
INSERT INTO additional_services (
  name,
  description,
  base_price,
  is_active
) VALUES 
  ('Registered Office Address', 'Official business address service', 150.00, true),
  ('Virtual Office Package', 'Mail forwarding and phone answering', 300.00, true),
  ('Legal Representative Service', 'Local legal representative appointment', 500.00, true),
  ('Accounting Setup', 'Initial bookkeeping and accounting setup', 800.00, true),
  ('Annual Compliance Package', 'Yearly compliance and filing services', 1200.00, true)
ON CONFLICT DO NOTHING;

-- Insert country-specific pricing for additional services
INSERT INTO country_additional_services (
  country_id,
  additional_service_id,
  price,
  is_active
) 
SELECT 
  c.id,
  a.id,
  CASE 
    WHEN c.code = 'GE' THEN a.base_price * 0.8  -- 20% discount for Georgia
    WHEN c.code = 'EE' THEN a.base_price * 1.1  -- 10% premium for Estonia  
    WHEN c.code = 'SG' THEN a.base_price * 1.3  -- 30% premium for Singapore
    ELSE a.base_price
  END,
  true
FROM countries c
CROSS JOIN additional_services a
WHERE c.is_active = true AND a.is_active = true
ON CONFLICT DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (
  author_id,
  country_code,
  title_i18n,
  excerpt_i18n,
  content_i18n,
  slug,
  category,
  tags,
  is_published,
  is_featured,
  published_at
) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    'GE',
    '{"en": "Why Georgia is the Perfect Jurisdiction for Tech Startups", "tr": "Gürcistan Neden Teknoloji Girişimleri İçin Mükemmel Yargı Alanıdır"}',
    '{"en": "Discover why Georgia has become the go-to destination for international tech companies", "tr": "Gürcistan''ın neden uluslararası teknoloji şirketleri için tercih edilen destinasyon haline geldiğini keşfedin"}',
    '{"en": "Georgia offers a unique combination of low taxes, simplified regulations, and strategic location between Europe and Asia. With the International IT Company status, tech companies can enjoy 0% corporate tax on international revenues...", "tr": "Gürcistan, düşük vergiler, basitleştirilmiş düzenlemeler ve Avrupa ile Asya arasındaki stratejik konumun benzersiz bir kombinasyonunu sunar..."}',
    'georgia-perfect-jurisdiction-tech-startups',
    'Company Formation',
    ARRAY['georgia', 'tech', 'startup', 'tax optimization'],
    true,
    true,
    now() - INTERVAL '2 days'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'GE',
    '{"en": "Step-by-Step Guide to Georgian Banking for Foreign Companies", "tr": "Yabancı Şirketler İçin Gürcistan Bankacılığı Adım Adım Rehberi"}',
    '{"en": "Complete guide to opening corporate bank accounts in Georgian financial institutions", "tr": "Gürcistan finansal kurumlarında kurumsal banka hesapları açma konusunda komple rehber"}',
    '{"en": "Opening a corporate bank account in Georgia requires careful preparation and documentation. Here''s our comprehensive guide to the process...", "tr": "Gürcistan''da kurumsal banka hesabı açmak dikkatli hazırlık ve dokümantasyon gerektirir..."}',
    'georgian-banking-guide-foreign-companies',
    'Banking',
    ARRAY['georgia', 'banking', 'corporate'],
    true,
    false,
    now() - INTERVAL '5 days'
  )
ON CONFLICT (slug) DO NOTHING;

-- Insert consultant country assignment
INSERT INTO consultant_country_assignments (
  consultant_id,
  country_id,
  is_active
) 
SELECT 
  '11111111-1111-1111-1111-111111111111',
  id,
  true
FROM countries 
WHERE code IN ('GE', 'EE', 'TR', 'CY')
ON CONFLICT (consultant_id, country_id) DO NOTHING;

-- Insert sample audit logs
INSERT INTO audit_logs (
  user_id,
  action_type,
  resource_type,
  resource_id,
  description,
  payload
) VALUES 
  (
    '33333333-3333-3333-3333-333333333333',
    'service_purchase',
    'service_order',
    '99999999-9999-9999-9999-999999999999',
    'Purchased Georgia LLC Formation service',
    '{"service_title": "Georgia LLC Formation", "amount": 2500, "currency": "USD"}'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'message_sent',
    'message',
    null,
    'Sent message to consultant',
    '{"consultant_id": "11111111-1111-1111-1111-111111111111", "message_length": 147}'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'document_uploaded',
    'document',
    null,
    'Uploaded company registration certificate to client mailbox',
    '{"client_id": "44444444-4444-4444-4444-444444444444", "document_type": "business"}'
  )
ON CONFLICT DO NOTHING;

-- Insert sample notification
INSERT INTO notifications (
  actor_profile_id,
  recipient_profile_id,
  type,
  payload
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'mailbox_document_received',
  '{"document_name": "Company Registration Certificate", "document_type": "business", "consultant_name": "Giorgi Meskhi"}'
)
ON CONFLICT DO NOTHING;