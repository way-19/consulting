import React from 'react';
import { Handshake, Users, Globe, TrendingUp } from 'lucide-react';

interface PartnershipPageProps {
  language: 'en' | 'tr';
}

const PartnershipPage: React.FC<PartnershipPageProps> = ({ language }) => {
  const content = {
    en: {
      title: 'Partnership Opportunities',
      subtitle: 'Join our global network of business consultants',
      description: 'Become part of the CONSULTING19 network and expand your consulting business across 7 strategic jurisdictions.',
      benefits: [
        'Access to global client network',
        'AI-powered business tools',
        'Comprehensive training program',
        'Revenue sharing opportunities'
      ]
    },
    tr: {
      title: 'Ortaklık Fırsatları',
      subtitle: 'Küresel iş danışmanları ağımıza katılın',
      description: 'CONSULTING19 ağının bir parçası olun ve danışmanlık işinizi 7 stratejik yargı alanında genişletin.',
      benefits: [
        'Küresel müşteri ağına erişim',
        'AI destekli iş araçları',
        'Kapsamlı eğitim programı',
        'Gelir paylaşımı fırsatları'
      ]
    }
  };

  const t = content[language];

  return (
    <div className="pt-16 min-h-screen">
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t.subtitle}
          </p>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            {t.description}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Handshake className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnershipPage;