import React from 'react';
import { Handshake, Globe, Award, Users, Building, Star } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

const PartnersPage = () => {
  const { t } = useLanguage();

  const partnerTypes = [
    {
      icon: Building,
      title: t('partnersConsultantTitle'),
      description: t('partnersConsultantDesc'),
      benefits: [
        t('partnersConsultantBenefit1'),
        t('partnersConsultantBenefit2'),
        t('partnersConsultantBenefit3'),
        t('partnersConsultantBenefit4'),
      ],
      color: 'blue',
    },
    {
      icon: Handshake,
      title: t('partnersReferralTitle'),
      description: t('partnersReferralDesc'),
      benefits: [
        t('partnersReferralBenefit1'),
        t('partnersReferralBenefit2'),
        t('partnersReferralBenefit3'),
        t('partnersReferralBenefit4'),
      ],
      color: 'teal',
    },
    {
      icon: Globe,
      title: t('partnersIntegrationTitle'),
      description: t('partnersIntegrationDesc'),
      benefits: [
        t('partnersIntegrationBenefit1'),
        t('partnersIntegrationBenefit2'),
        t('partnersIntegrationBenefit3'),
        t('partnersIntegrationBenefit4'),
      ],
      color: 'purple',
    },
  ];

  const featuredPartners = [
    {
      name: 'Global Law Firm',
      logo: '⚖️',
      description: t('partnersLawFirmDesc'),
      country: 'Multiple Jurisdictions',
    },
    {
      name: 'Banking Solutions Inc',
      logo: '🏦',
      description: t('partnersBankingDesc'),
      country: 'Switzerland, UAE',
    },
    {
      name: 'Tax Advisory Group',
      logo: '📊',
      description: t('partnersTaxDesc'),
      country: 'Estonia, Malta',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('partnersHeroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('partnersHeroDescription')}
          </p>
        </div>
      </section>

      {/* Partner Types */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('partnersTypesTitle')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('partnersTypesDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {partnerTypes.map((type, index) => (
            <Card key={index} hover className="h-full">
              <Card.Body>
                <div className={`w-12 h-12 bg-gradient-to-r ${
                  type.color === 'blue' ? 'from-blue-600 to-blue-700' :
                  type.color === 'teal' ? 'from-teal-600 to-teal-700' :
                  'from-purple-600 to-purple-700'
                } rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <type.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {type.title}
                </h3>
                <p className="text-gray-600 mb-6 text-center">
                  {type.description}
                </p>
                
                <ul className="space-y-3 mb-8">
                  {type.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full">
                  {t('partnersApplyNow')}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Partners */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('partnersFeaturedTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('partnersFeaturedDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPartners.map((partner, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{partner.logo}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{partner.description}</p>
                  <div className="text-sm text-blue-600 font-medium">
                    {partner.country}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">{t('partnersCtaTitle')}</h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('partnersCtaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              {t('partnersJoinNetwork')}
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              {t('partnersLearnMore')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;