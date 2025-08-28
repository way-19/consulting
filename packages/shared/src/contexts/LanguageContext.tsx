import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'tr' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.countries': 'Countries',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.login': 'Log In',
    'nav.register': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'hero.title': 'AI-Powered Global Business Consulting',
    'hero.subtitle': 'Expert guidance for international business expansion and growth strategies',
    'hero.cta.primary': 'Get Started Now',
    'hero.cta.secondary': 'Explore Services',
    'footer.copyright': '© 2025 Consulting19. All rights reserved.',
    'footer.powered': 'Powered by AI Oracle',
    'countries.uae': 'United Arab Emirates',
    'countries.estonia': 'Estonia',
    'countries.georgia': 'Georgia',
    'countries.malta': 'Malta',
    'countries.panama': 'Panama',
    'countries.all': 'All Countries',
    'wealth.title': 'Design the Future of Your Wealth',
    'wealth.subtitle': 'Premium wealth management solutions for global entrepreneurs',
    'wealth.feature1': 'AI Advisor',
    'wealth.feature2': 'Global Risk',
    'wealth.feature3': 'Digital Immortality',
    'wealth.stat1': '$2.4B+ assets under management',
    'wealth.stat2': '150+ countries served',
    'wealth.cta': 'Apply Now',
    'company.title': 'Start Your Company Now',
    'company.subtitle': 'Fast and secure online company formation',
    'company.feature1': 'Register in 24 hours',
    'company.feature2': '19+ business-friendly countries',
    'company.feature3': 'Full legal compliance',
    'company.feature4': 'Expert guidance included',
    'company.cta': 'Order Now',
  },
  tr: {
    'nav.home': 'Ana Sayfa',
    'nav.services': 'Hizmetler',
    'nav.countries': 'Ülkeler',
    'nav.about': 'Hakkımızda',
    'nav.contact': 'İletişim',
    'nav.blog': 'Blog',
    'nav.login': 'Giriş',
    'nav.register': 'Kayıt Ol',
    'nav.dashboard': 'Panel',
    'hero.title': 'AI Destekli Küresel İş Danışmanlığı',
    'hero.subtitle': 'Uluslararası iş genişlemesi ve büyüme stratejileri için uzman rehberlik',
    'hero.cta.primary': 'Hemen Başla',
    'hero.cta.secondary': 'Hizmetleri Keşfet',
    'footer.copyright': '© 2025 Consulting19. Tüm hakları saklıdır.',
    'footer.powered': 'AI Oracle tarafından desteklenmektedir',
    'countries.uae': 'Birleşik Arap Emirlikleri',
    'countries.estonia': 'Estonya',
    'countries.georgia': 'Gürcistan',
    'countries.malta': 'Malta',
    'countries.panama': 'Panama',
    'countries.all': 'Tüm Ülkeler',
    'wealth.title': 'Varlığınızın Geleceğini Tasarlayın',
    'wealth.subtitle': 'Küresel girişimciler için premium varlık yönetimi çözümleri',
    'wealth.feature1': 'AI Danışman',
    'wealth.feature2': 'Global Risk',
    'wealth.feature3': 'Dijital Ölümsüzlük',
    'wealth.stat1': '$2.4B+ yönetilen varlık',
    'wealth.stat2': '150+ ülke',
    'wealth.cta': 'Başvuru Yapın',
    'company.title': 'Şirketinizi Hemen Kurun',
    'company.subtitle': 'Hızlı ve güvenli online şirket kurma',
    'company.feature1': '24 saatte tescil',
    'company.feature2': '19+ iş dostu ülke',
    'company.feature3': 'Tam yasal uyumluluk',
    'company.feature4': 'Uzman rehberlik dahil',
    'company.cta': 'Hemen Sipariş Ver',
  },
  pt: {
    'nav.home': 'Início',
    'nav.services': 'Serviços',
    'nav.countries': 'Países',
    'nav.about': 'Sobre',
    'nav.contact': 'Contato',
    'nav.blog': 'Blog',
    'nav.login': 'Entrar',
    'nav.register': 'Cadastrar',
    'nav.dashboard': 'Painel',
    'hero.title': 'Consultoria Global Empresarial com IA',
    'hero.subtitle': 'Orientação especializada para expansão internacional de negócios e estratégias de crescimento',
    'hero.cta.primary': 'Comece Agora',
    'hero.cta.secondary': 'Explorar Serviços',
    'footer.copyright': '© 2025 Consulting19. Todos os direitos reservados.',
    'footer.powered': 'Alimentado por AI Oracle',
    'countries.uae': 'Emirados Árabes Unidos',
    'countries.estonia': 'Estônia',
    'countries.georgia': 'Geórgia',
    'countries.malta': 'Malta',
    'countries.panama': 'Panamá',
    'countries.all': 'Todos os Países',
    'wealth.title': 'Projete o Futuro da Sua Riqueza',
    'wealth.subtitle': 'Soluções premium de gestão de patrimônio para empreendedores globais',
    'wealth.feature1': 'Consultor IA',
    'wealth.feature2': 'Risco Global',
    'wealth.feature3': 'Imortalidade Digital',
    'wealth.stat1': '$2.4B+ patrimônio sob gestão',
    'wealth.stat2': '150+ países atendidos',
    'wealth.cta': 'Candidatar-se',
    'company.title': 'Abra Sua Empresa Agora',
    'company.subtitle': 'Formação de empresa online rápida e segura',
    'company.feature1': 'Registro em 24 horas',
    'company.feature2': '19+ países favoráveis aos negócios',
    'company.feature3': 'Conformidade legal completa',
    'company.feature4': 'Orientação especializada incluída',
    'company.cta': 'Peça Agora',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}