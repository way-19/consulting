import React from 'react';
import { Building2, Calculator, CreditCard, FileText } from 'lucide-react';
import { useLanguage, Button, Card } from '@consulting19/shared';

const ServicesSection = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Building2,
      title: t('companyFormation'),
      description: 'Professional business setup and incorporation services worldwide',
      color: 'blue',
    },
    {
      icon: Calculator,
      title: t('taxOptimization'),
      description: 'Strategic tax planning and international tax optimization',
      color: 'teal',
    },
    {
      icon: CreditCard,
      title: t('bankingSolutions'),
      description: 'Global banking and financial services access',
      color: 'orange',
    },
    {
      icon: FileText,
      title: t('legalCompliance'),
      description: 'Comprehensive legal and regulatory compliance',
      color: 'green',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    teal: 'from-teal-600 to-teal-700',
    orange: 'from-orange-600 to-orange-700',
    green: 'from-green-600 to-green-700',
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive business services for international expansion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={index} hover className="h-full">
              <Card.Body>
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-4`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  {t('learnMore')}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;