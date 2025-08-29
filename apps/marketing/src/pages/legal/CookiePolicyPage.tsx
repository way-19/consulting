import React from 'react';
import { Cookie, Settings, Eye, Shield } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

const CookiePolicyPage = () => {
  const { t } = useLanguage();

  const cookieTypes = [
    {
      icon: Settings,
      title: t('cookiesEssentialTitle'),
      description: t('cookiesEssentialDesc'),
      examples: t('cookiesEssentialExamples'),
    },
    {
      icon: Eye,
      title: t('cookiesAnalyticsTitle'),
      description: t('cookiesAnalyticsDesc'),
      examples: t('cookiesAnalyticsExamples'),
    },
    {
      icon: Shield,
      title: t('cookiesSecurityTitle'),
      description: t('cookiesSecurityDesc'),
      examples: t('cookiesSecurityExamples'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('cookiesHeroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('cookiesHeroDescription')}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cookie Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cookieTypes.map((type, index) => (
            <Card key={index} className="text-center">
              <Card.Body>
                <type.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                <p className="text-gray-500 text-xs">{type.examples}</p>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Cookie Policy Content */}
        <Card>
          <Card.Body>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>{t('cookiesLastUpdated')}:</strong> {t('cookiesUpdateDate')}
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cookiesWhatAreTitle')}</h2>
              <p className="text-gray-600 mb-6">
                {t('cookiesWhatAreDesc')}
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cookiesHowWeUseTitle')}</h2>
              <p className="text-gray-600 mb-4">{t('cookiesHowWeUseDesc')}</p>
              <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                <li>{t('cookiesUse1')}</li>
                <li>{t('cookiesUse2')}</li>
                <li>{t('cookiesUse3')}</li>
                <li>{t('cookiesUse4')}</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cookiesTypesTitle')}</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('cookiesEssentialTitle')}</h3>
              <p className="text-gray-600 mb-4">{t('cookiesEssentialFullDesc')}</p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('cookiesAnalyticsTitle')}</h3>
              <p className="text-gray-600 mb-4">{t('cookiesAnalyticsFullDesc')}</p>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('cookiesMarketingTitle')}</h3>
              <p className="text-gray-600 mb-6">{t('cookiesMarketingFullDesc')}</p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cookiesControlTitle')}</h2>
              <p className="text-gray-600 mb-6">{t('cookiesControlDesc')}</p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cookiesContactTitle')}</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700">
                  {t('cookiesContactDesc')}<br />
                  <strong>{t('cookiesContactEmail')}:</strong> privacy@consulting19.com
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default CookiePolicyPage;