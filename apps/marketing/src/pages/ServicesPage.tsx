import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, BarChart3, Globe, MessageCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const ServicesPage = () => {
  const { t } = useLanguage();

  const serviceCategories = [
    {
      icon: Building2,
      title: t('companyFormationTitle'),
      summary: t('companyFormationSummary'),
      services: [
        t('companyRegistration') || 'Company registration',
        t('businessLicenses') || 'Business licenses',
        t('corporateStructureSetup') || 'Corporate structure setup',
        t('registeredAgent') || 'Registered agent',
        t('virtualOffice') || 'Virtual office',
      ],
      color: 'blue',
      route: '/services/company-formation',
    },
    {
      icon: Calculator,
      title: t('taxOptimizationTitle'),
      summary: t('taxOptimizationSummary'),
      services: [
        t('intlTaxPlanning') || 'Intl. tax planning',
        t('doubleTaxTreaty') || 'Double tax treaty',
        t('taxResidencyPlanning') || 'Tax residency planning',
        t('transferPricing') || 'Transfer pricing',
        t('annualCompliance') || 'Annual compliance',
      ],
      color: 'teal',
      route: '/services/tax-optimization',
    },
    {
      icon: CreditCard,
      title: t('bankingSolutionsTitle'),
      summary: t('bankingSolutionsSummary'),
      services: [
        t('accountOpening') || 'Account opening',
        t('multiCurrency') || 'Multi-currency',
        t('paymentGateways') || 'Payment gateways',
        t('bankingRelationships') || 'Banking relationships',
        t('tradeFinance') || 'Trade finance',
      ],
      color: 'orange',
      route: '/services/banking-solutions',
    },
    {
      icon: FileText,
      title: t('legalComplianceTitle'),
      summary: t('legalComplianceSummary'),
      services: [
        t('complianceMonitoring') || 'Compliance monitoring',
        t('contractReview') || 'Contract review',
        t('legalStructureOptimization') || 'Legal structure optimization',
        t('ipProtection') || 'IP protection',
        t('dataProtection') || 'Data protection',
      ],
      color: 'green',
      route: '/services/legal-compliance',
    },
    {
      icon: Shield,
      title: t('assetProtectionTitle'),
      summary: t('assetProtectionSummary'),
      services: [
        t('protectionStrategy') || 'Protection strategy',
        t('trustFoundationSetup') || 'Trust/foundation setup',
        t('riskMitigation') || 'Risk mitigation',
        t('estatePlanning') || 'Estate planning',
        t('insuranceCoordination') || 'Insurance coordination',
      ],
      color: 'purple',
      route: '/services/asset-protection',
    },
    {
      icon: TrendingUp,
      title: t('investmentAdvisoryTitle'),
      summary: t('investmentAdvisorySummary'),
      services: [
        t('portfolioManagement') || 'Portfolio management',
        t('alternatives') || 'Alternatives',
        t('realEstate') || 'Real estate',
        t('esgMandates') || 'ESG mandates',
        t('cryptoCompliance') || 'Crypto compliance',
      ],
      color: 'red',
      route: '/services/investment-advisory',
    },
    {
      icon: Users,
      title: t('visaResidencyTitle'),
      summary: t('visaResidencySummary'),
      services: [
        t('eligibilityReview') || 'Eligibility review',
        t('countryComparison') || 'Country comparison',
        t('applicationPreparation') || 'Application preparation',
        t('documentFiling') || 'Document filing',
        t('statusTracking') || 'Status tracking',
      ],
      color: 'indigo',
      route: '/services/visa-residency',
    },
    {
      icon: BarChart3,
      title: t('marketResearchTitle'),
      summary: t('marketResearchSummary'),
      services: [
        t('tamSegmentation') || 'TAM & segmentation',
        t('competitorMapping') || 'Competitor mapping',
        t('pricingInsights') || 'Pricing insights',
        t('goToMarketTesting') || 'Go-to-market testing',
        t('localRegulations') || 'Local regulations',
      ],
      color: 'pink',
      route: '/services/market-research',
    },
  ];

  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    teal: 'from-teal-600 to-teal-700',
    orange: 'from-orange-600 to-orange-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    red: 'from-red-600 to-red-700',
    indigo: 'from-indigo-600 to-indigo-700',
    pink: 'from-pink-600 to-pink-700',
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {serviceCategories.map((category, index) => (
            <Card key={index} hover className="h-full min-h-[320px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
              <Card.Body className="h-full flex flex-col p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-8 h-8 bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <category.icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-2">
                      {category.summary}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6 flex-1">
                  {category.services.map((service, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{service}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <Link to={category.route}>
                    <Button 
                      variant="outline" 
                      size="md"
                      className="w-full md:w-auto md:min-w-[180px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`Explore ${category.title}`}
                    aria-label={`${t('explore') || 'Explore'} ${category.title}`}
                      Explore {category.title}
                    {t('explore') || 'Explore'} {category.title}
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {t('needCustomSolution')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('customSolutionDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" icon={MessageCircle} iconPosition="left">
                {t('consultWithExpert')}
              </Button>
            </Link>
            <Link to="/countries">
              <Button size="lg" variant="outline" icon={Globe} iconPosition="left">
                {t('exploreCountries')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;