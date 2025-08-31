import React from 'react';
import { Zap, Users, Shield, Globe } from 'lucide-react';
import { useLanguage, Card } from '@consulting19/shared';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: t('aiPoweredIntelligence'),
      description: 'Smart jurisdiction recommendations based on your business needs',
    },
    {
      icon: Users,
      title: t('expertNetwork'),
      description: 'Local specialists in 19+ countries with proven track records',
    },
    {
      icon: Shield,
      title: 'Comprehensive Services',
      description: 'End-to-end support from formation to ongoing compliance',
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Platform available in English, Turkish, and Portuguese',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Consulting19?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced technology meets expert knowledge for seamless global expansion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center h-full">
              <Card.Body>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;