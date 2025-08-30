import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, BarChart3, Globe, MessageCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const ServicesPage = () => {
  const { t, language } = useLanguage();

  const content = {
    en: {
      heroTitle: 'Comprehensive International Business Services',
      heroDescription: 'From company formation to ongoing compliance, we provide end-to-end support delivered by expert consultants in 19+ countries.',
      needCustomSolution: 'Need a Custom Solution?',
      needCustomSolutionDesc: 'Our expert advisors can design a tailored strategy for your business needs.',
      consultWithExpert: 'Consult with Expert',
      exploreCountries: 'Explore Countries'
    },
    tr: {
      heroTitle: 'Kapsamlı Uluslararası İş Hizmetleri',
      heroDescription: 'Şirket kuruluşundan devam eden uyumluluğa kadar, 19+ ülkede uzman danışmanlar tarafından sunulan uçtan uca destek sağlıyoruz.',
      needCustomSolution: 'Özel Çözüme İhtiyacınız Var mı?',
      needCustomSolutionDesc: 'Uzman danışmanlarımız iş ihtiyaçlarınız için özel bir strateji tasarlayabilir.',
      consultWithExpert: 'Uzmanla Görüşün',
      exploreCountries: 'Ülkeleri Keşfedin'
    },
    pt: {
      heroTitle: 'Serviços Empresariais Internacionais Abrangentes',
      heroDescription: 'Da formação de empresa à conformidade contínua, fornecemos suporte completo entregue por consultores especialistas em 19+ países.',
      needCustomSolution: 'Precisa de uma Solução Personalizada?',
      needCustomSolutionDesc: 'Nossos consultores especialistas podem projetar uma estratégia personalizada para suas necessidades empresariais.',
      consultWithExpert: 'Consultar com Especialista',
      exploreCountries: 'Explorar Países'
    }
  };

  const currentContent = content[language] || content.en;

  const serviceCategories = [
    {
      icon: Building2,
      title: t('companyFormation'),
      summary: t('companyFormationDesc'),
      services: [
        t('companyRegistration'),
        t('businessLicenses'),
        t('corporateStructureSetup'),
        t('registeredAgent'),
        t('virtualOffice'),
      ],
      color: 'blue',
      route: '/services/company-formation',
    },
    {
      icon: Calculator,
      title: t('taxOptimization'),
      summary: t('taxOptimizationDesc'),
      services: [
        t('intlTaxPlanning'),
        t('doubleTaxTreaty'),
        t('taxResidencyPlanning'),
        t('transferPricing'),
        t('annualCompliance'),
      ],
      color: 'teal',
      route: '/services/tax-optimization',
    },
    {
      icon: CreditCard,
      title: t('bankingSolutions'),
      summary: t('bankingSolutionsDesc'),
      services: [
        t('accountOpening'),
        t('multiCurrency'),
        t('paymentGateways'),
        t('bankingRelationships'),
        t('tradeFinance'),
      ],
      color: 'orange',
      route: '/services/banking-solutions',
    },
    {
      icon: FileText,
      title: t('legalCompliance'),
      summary: t('legalComplianceDesc'),
      services: [
        t('complianceMonitoring'),
        t('contractReview'),
        t('legalStructureOptimization'),
        t('ipProtection'),
        t('dataProtection'),
      ],
      color: 'green',
      route: '/services/legal-compliance',
    },
    {
      icon: Shield,
      title: t('assetProtection'),
      summary: t('assetProtectionDesc'),
      services: [
        t('protectionStrategy'),
        t('trustFoundationSetup'),
        t('riskMitigation'),
        t('estatePlanning'),
        t('insuranceCoordination'),
      ],
      color: 'purple',
      route: '/services/asset-protection',
    },
    {
      icon: TrendingUp,
      title: t('investmentAdvisory'),
      summary: t('investmentAdvisoryDesc'),
      services: [
        t('portfolioManagement'),
        t('alternatives'),
        t('realEstate'),
        t('esgMandates'),
        t('cryptoCompliance'),
      ],
      color: 'red',
      route: '/services/investment-advisory',
    },
    {
      icon: Users,
      title: t('visaResidency'),
      summary: t('visaResidencyDesc'),
      services: [
        t('eligibilityReview'),
        t('countryComparison'),
        t('applicationPreparation'),
        t('documentFiling'),
        t('statusTracking'),
      ],
      color: 'indigo',
      route: '/services/visa-residency',
    },
    {
      icon: BarChart3,
      title: t('marketResearch'),
      summary: t('marketResearchDesc'),
      services: [
        t('tamSegmentation'),
        t('competitorMapping'),
        t('pricingInsights'),
        t('goToMarketTesting'),
        t('localRegulations'),
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {currentContent.heroTitle}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {currentContent.heroDescription}
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
                    >
                      Explore {category.title}
                    </Button>
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
            {currentContent.needCustomSolution}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {currentContent.needCustomSolutionDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" icon={MessageCircle} iconPosition="left">
                {currentContent.consultWithExpert}
              </Button>
            </Link>
            <Link to="/countries">
              <Button size="lg" variant="outline" icon={Globe} iconPosition="left">
                {currentContent.exploreCountries}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;