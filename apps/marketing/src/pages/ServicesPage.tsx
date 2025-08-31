import React from 'react';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { Card, Button } from '../lib/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ServicesPage = () => {
  const { t } = useLanguage();

  const serviceCategories = [
    {
      icon: Building2,
      title: t('companyFormation') || 'Company Formation',
      summary: 'Professional business setup and incorporation services worldwide',
      services: [
        'Company Registration',
        'Business Licenses',
        'Corporate Structure Setup',
        'Registered Agent Services',
        'Virtual Office Solutions',
      ],
      color: 'blue',
    },
    {
      icon: Calculator,
      title: t('taxOptimization') || 'Tax Optimization',
      summary: 'Strategic tax planning and international tax optimization',
      services: [
        'International Tax Planning',
        'Double Tax Treaty Optimization',
        'Tax Residency Planning',
        'Transfer Pricing',
        'Annual Compliance',
      ],
      color: 'teal',
    },
    {
      icon: CreditCard,
      title: t('bankingSolutions') || 'Banking Solutions',
      summary: 'Global banking and financial services access',
      services: [
        'Corporate Account Opening',
        'Multi-Currency Accounts',
        'Payment Gateway Setup',
        'Banking Relationships',
        'Trade Finance',
      ],
      color: 'orange',
    },
    {
      icon: FileText,
      title: t('legalCompliance') || 'Legal Compliance',
      summary: 'Comprehensive legal and regulatory compliance',
      services: [
        'Compliance Monitoring',
        'Contract Review',
        'Legal Structure Optimization',
        'IP Protection',
        'Data Protection',
      ],
      color: 'green',
    },
    {
      icon: Shield,
      title: t('assetProtection') || 'Asset Protection',
      summary: 'Wealth protection and asset security strategies',
      services: [
        'Protection Strategy',
        'Trust & Foundation Setup',
        'Risk Mitigation',
        'Estate Planning',
        'Insurance Coordination',
      ],
      color: 'purple',
    },
    {
      icon: TrendingUp,
      title: t('investmentAdvisory') || 'Investment Advisory',
      summary: 'Professional investment and wealth management',
      services: [
        'Portfolio Management',
        'Alternative Investments',
        'Real Estate Investment',
        'ESG Investment Strategies',
        'Crypto Compliance',
      ],
      color: 'red',
    },
    {
      icon: Users,
      title: t('visaResidency') || 'Visa & Residency',
      summary: 'Immigration and residency planning services',
      services: [
        'Eligibility Review',
        'Country Comparison',
        'Application Preparation',
        'Document Filing',
        'Status Tracking',
      ],
      color: 'indigo',
    },
    {
      icon: BarChart3,
      title: t('marketResearch') || 'Market Research',
      summary: 'Market intelligence and business research',
      services: [
        'Market Analysis',
        'Competitor Mapping',
        'Pricing Insights',
        'Go-to-Market Testing',
        'Local Regulations',
      ],
      color: 'pink',
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Comprehensive International Business Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            From company formation to ongoing compliance, we provide end-to-end support delivered by expert consultants in 19+ countries.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {serviceCategories.map((category, index) => (
            <Card key={index} hover className="h-full min-h-[320px]">
              <Card.Body className="h-full flex flex-col p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-8 h-8 bg-gradient-to-r ${colorClasses[category.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <category.icon className="w-5 h-5 text-white" />
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
                  <Button 
                    variant="outline" 
                    size="md"
                    className="w-full md:w-auto md:min-w-[180px]"
                  >
                    Explore {category.title}
                  </Button>
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
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our expert advisors can design a tailored strategy for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Consult with Expert
            </Button>
            <Button size="lg" variant="outline">
              Explore Countries
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;