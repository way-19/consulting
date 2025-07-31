import React from 'react';
import { Building2, TrendingUp, Scale, Calculator, Plane, CreditCard, Shield, FileText } from 'lucide-react';

interface ServicesPageProps {
  language: 'en' | 'tr';
}

const ServicesPage: React.FC<ServicesPageProps> = ({ language }) => {
  const content = {
    en: {
      title: 'Our Services',
      subtitle: 'Comprehensive business solutions for international expansion',
      services: [
        {
          icon: Building2,
          title: 'Company Formation',
          description: 'Quick entity setup worldwide with expert guidance and AI-powered recommendations.',
          features: ['LLC & Corporation setup', 'Registered agent service', 'EIN & tax ID', 'Compliance support']
        },
        {
          icon: TrendingUp,
          title: 'Investment Advisory',
          description: 'Strategic market analysis and investment opportunities across global markets.',
          features: ['Market research', 'Risk assessment', 'Portfolio optimization', 'Due diligence']
        },
        {
          icon: Scale,
          title: 'Legal Consulting',
          description: 'Regulatory compliance and business law expertise for international operations.',
          features: ['Contract drafting', 'Compliance review', 'Legal structure', 'Dispute resolution']
        },
        {
          icon: Calculator,
          title: 'Accounting Services',
          description: 'International tax optimization and comprehensive accounting solutions.',
          features: ['Tax planning', 'Bookkeeping', 'Financial reporting', 'Audit support']
        },
        {
          icon: Plane,
          title: 'Visa & Residency',
          description: 'Global mobility solutions including residency and citizenship programs.',
          features: ['Visa applications', 'Residency programs', 'Citizenship planning', 'Immigration law']
        },
        {
          icon: CreditCard,
          title: 'Banking Solutions',
          description: 'International account opening and banking relationship management.',
          features: ['Account opening', 'Banking relationships', 'Payment processing', 'Credit facilities']
        },
        {
          icon: Shield,
          title: 'Compliance Management',
          description: 'Ongoing regulatory monitoring and compliance management services.',
          features: ['Regulatory updates', 'Filing management', 'Compliance calendar', 'Risk monitoring']
        },
        {
          icon: FileText,
          title: 'Documentation',
          description: 'Professional document preparation and apostille services.',
          features: ['Document preparation', 'Apostille services', 'Translation', 'Notarization']
        }
      ]
    },
    tr: {
      title: 'Hizmetlerimiz',
      subtitle: 'Uluslararası genişleme için kapsamlı iş çözümleri',
      services: [
        {
          icon: Building2,
          title: 'Şirket Kuruluşu',
          description: 'Uzman rehberliği ve AI destekli önerilerle dünya çapında hızlı kuruluş.',
          features: ['LLC ve Şirket kuruluşu', 'Kayıtlı temsilci hizmeti', 'EIN ve vergi kimliği', 'Uyumluluk desteği']
        },
        {
          icon: TrendingUp,
          title: 'Yatırım Danışmanlığı',
          description: 'Küresel pazarlarda stratejik pazar analizi ve yatırım fırsatları.',
          features: ['Pazar araştırması', 'Risk değerlendirmesi', 'Portföy optimizasyonu', 'Durum tespiti']
        },
        {
          icon: Scale,
          title: 'Hukuki Danışmanlık',
          description: 'Uluslararası operasyonlar için mevzuat uyumluluğu ve iş hukuku uzmanlığı.',
          features: ['Sözleşme hazırlama', 'Uyumluluk incelemesi', 'Hukuki yapı', 'Uyuşmazlık çözümü']
        },
        {
          icon: Calculator,
          title: 'Muhasebe Hizmetleri',
          description: 'Uluslararası vergi optimizasyonu ve kapsamlı muhasebe çözümleri.',
          features: ['Vergi planlaması', 'Defter tutma', 'Mali raporlama', 'Denetim desteği']
        },
        {
          icon: Plane,
          title: 'Vize ve İkamet',
          description: 'İkamet ve vatandaşlık programları dahil küresel mobilite çözümleri.',
          features: ['Vize başvuruları', 'İkamet programları', 'Vatandaşlık planlaması', 'Göçmenlik hukuku']
        },
        {
          icon: CreditCard,
          title: 'Bankacılık Çözümleri',
          description: 'Uluslararası hesap açma ve bankacılık ilişkileri yönetimi.',
          features: ['Hesap açma', 'Bankacılık ilişkileri', 'Ödeme işleme', 'Kredi imkanları']
        },
        {
          icon: Shield,
          title: 'Uyumluluk Yönetimi',
          description: 'Sürekli mevzuat takibi ve uyumluluk yönetimi hizmetleri.',
          features: ['Mevzuat güncellemeleri', 'Dosyalama yönetimi', 'Uyumluluk takvimi', 'Risk takibi']
        },
        {
          icon: FileText,
          title: 'Dokümantasyon',
          description: 'Profesyonel belge hazırlama ve apostil hizmetleri.',
          features: ['Belge hazırlama', 'Apostil hizmetleri', 'Çeviri', 'Noterlik']
        }
      ]
    }
  };

  const t = content[language];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;