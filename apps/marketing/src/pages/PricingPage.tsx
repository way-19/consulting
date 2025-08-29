import React from 'react';
import { Check, Star, Zap, Shield, Globe, Users } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

const PricingPage = () => {
  const { t } = useLanguage();

  const plans = [
    {
      name: t('pricingBasicPlan'),
      price: t('pricingBasicPrice'),
      description: t('pricingBasicDesc'),
      features: [
        t('pricingBasicFeature1'),
        t('pricingBasicFeature2'),
        t('pricingBasicFeature3'),
        t('pricingBasicFeature4'),
      ],
      icon: Users,
      color: 'blue',
      popular: false,
    },
    {
      name: t('pricingProfessionalPlan'),
      price: t('pricingProfessionalPrice'),
      description: t('pricingProfessionalDesc'),
      features: [
        t('pricingProfessionalFeature1'),
        t('pricingProfessionalFeature2'),
        t('pricingProfessionalFeature3'),
        t('pricingProfessionalFeature4'),
        t('pricingProfessionalFeature5'),
      ],
      icon: Zap,
      color: 'teal',
      popular: true,
    },
    {
      name: t('pricingEnterprisePlan'),
      price: t('pricingEnterprisePrice'),
      description: t('pricingEnterpriseDesc'),
      features: [
        t('pricingEnterpriseFeature1'),
        t('pricingEnterpriseFeature2'),
        t('pricingEnterpriseFeature3'),
        t('pricingEnterpriseFeature4'),
        t('pricingEnterpriseFeature5'),
      ],
      icon: Shield,
      color: 'purple',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('pricingHeroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('pricingHeroDescription')}
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-teal-500' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {t('pricingPopularBadge')}
                  </span>
                </div>
              )}
              
              <Card.Body className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${
                  plan.color === 'blue' ? 'from-blue-600 to-blue-700' :
                  plan.color === 'teal' ? 'from-teal-600 to-teal-700' :
                  'from-purple-600 to-purple-700'
                } rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-2">{plan.price}</div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-teal-600 hover:bg-teal-700' : ''}`}
                  variant={plan.popular ? 'primary' : 'outline'}
                >
                  {t('pricingGetStarted')}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PricingPage;