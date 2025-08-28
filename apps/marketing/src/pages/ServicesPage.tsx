import React from 'react';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, Globe } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const ServicesPage = () => {
  const { t } = useLanguage();

  const serviceCategories = [
    {
      icon: Building2,
      title: 'companyFormation',
      description: 'companyFormationDesc',
      services: [
        'companyFormationService1',
        'companyFormationService2',
        'companyFormationService3',
        'companyFormationService4',
        'companyFormationService5',
      ],
      color: 'blue',
    },
    {
      icon: Calculator,
      title: 'taxOptimization',
      description: 'taxOptimizationDesc',
      services: [
        'taxOptimizationService1',
        'taxOptimizationService2',
        'taxOptimizationService3',
        'taxOptimizationService4',
        'taxOptimizationService5',
      ],
      color: 'teal',
    },
    {
      icon: CreditCard,
      title: 'bankingSolutions',
      description: 'bankingSolutionsDesc',
      services: [
        'bankingSolutionsService1',
        'bankingSolutionsService2',
        'bankingSolutionsService3',
        'bankingSolutionsService4',
        'bankingSolutionsService5',
      ],
      color: 'orange',
    },
    {
      icon: FileText,
      title: 'legalCompliance',
      description: 'legalComplianceDesc',
      services: [
        'legalComplianceService1',
        'legalComplianceService2',
        'legalComplianceService3',
        'legalComplianceService4',
        'legalComplianceService5',
      ],
      color: 'green',
    },
    {
      icon: Shield,
      title: 'assetProtection',
      description: 'assetProtectionDesc',
      services: [
        'assetProtectionService1',
        'assetProtectionService2',
        'assetProtectionService3',
        'assetProtectionService4',
        'assetProtectionService5',
      ],
      color: 'purple',
    },
    {
      icon: TrendingUp,
      title: 'investmentAdvisory',
      description: 'investmentAdvisoryDesc',
      services: [
        'investmentAdvisoryService1',
        'investmentAdvisoryService2',
        'investmentAdvisoryService3',
        'investmentAdvisoryService4',
        'investmentAdvisoryService5',
      ],
      color: 'red',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    teal: 'from-teal-600 to-teal-700',
    orange: 'from-orange-600 to-orange-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    red: 'from-red-600 to-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('servicesHeroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('servicesHeroDescription')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {serviceCategories.map((category, index) => (
            <Card key={index} hover className="h-full">
              <Card.Body className="h-full">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {t(category.title)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(category.description)}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {category.services.map((service, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {t(service)}
                    </li>
                  ))}
                </ul>
                
                <Button variant="outline" className="w-full">
                  {t('exploreCategory')} {t(category.title)}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t('servicesCtaTitle')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('servicesCtaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" icon={Users} iconPosition="left">
              {t('consultExpertBtn')}
            </Button>
            <Button size="lg" variant="outline" icon={Globe} iconPosition="left">
              {t('exploreCountriesBtn')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;