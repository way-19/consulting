import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, BarChart3, Globe, MessageCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const ServicesPage = () => {
  const serviceCategories = [
    {
      icon: Building2,
      title: 'Company Formation',
      summary: 'End-to-end company registration and incorporation in business-friendly jurisdictions.',
      services: [
        'Company registration',
        'Business licenses',
        'Corporate structure setup',
        'Registered agent',
        'Virtual office',
      ],
      color: 'blue',
      route: '/services/company-formation',
    },
    {
      icon: Calculator,
      title: 'Tax Optimization',
      summary: 'Strategic international tax planning to minimize legal tax liability across jurisdictions.',
      services: [
        'Intl. tax planning',
        'Double tax treaty',
        'Tax residency planning',
        'Transfer pricing',
        'Annual compliance',
      ],
      color: 'teal',
      route: '/services/tax-optimization',
    },
    {
      icon: CreditCard,
      title: 'Banking Solutions',
      summary: 'Global banking support for opening and managing corporate accounts.',
      services: [
        'Account opening',
        'Multi-currency',
        'Payment gateways',
        'Banking relationships',
        'Trade finance',
      ],
      color: 'orange',
      route: '/services/banking-solutions',
    },
    {
      icon: FileText,
      title: 'Legal Compliance',
      summary: 'Ongoing legal and regulatory support to keep your business compliant.',
      services: [
        'Compliance monitoring',
        'Contract review',
        'Legal structure optimization',
        'IP protection',
        'Data protection',
      ],
      color: 'green',
      route: '/services/legal-compliance',
    },
    {
      icon: Shield,
      title: 'Asset Protection',
      summary: 'Trusts, foundations, and holding structures to protect assets and reduce risk.',
      services: [
        'Protection strategy',
        'Trust/foundation setup',
        'Risk mitigation',
        'Estate planning',
        'Insurance coordination',
      ],
      color: 'purple',
      route: '/services/asset-protection',
    },
    {
      icon: TrendingUp,
      title: 'Investment Advisory',
      summary: 'Tailored, globally diversified strategies across public and private markets.',
      services: [
        'Portfolio management',
        'Alternatives',
        'Real estate',
        'ESG mandates',
        'Crypto compliance',
      ],
      color: 'red',
      route: '/services/investment-advisory',
    },
    {
      icon: Users,
      title: 'Visa & Residency',
      summary: 'End-to-end visa and residency solutions for founders, investors, and their families.',
      services: [
        'Eligibility review',
        'Country comparison',
        'Application preparation',
        'Document filing',
        'Status tracking',
      ],
      color: 'indigo',
      route: '/services/visa-residency',
    },
    {
      icon: BarChart3,
      title: 'Market Research',
      summary: 'In-depth market and competitive analysis for successful international expansion.',
      services: [
        'TAM & segmentation',
        'Competitor mapping',
        'Pricing insights',
        'Go-to-market testing',
        'Local regulations',
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
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our expert advisors can design a tailored strategy for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" icon={MessageCircle} iconPosition="left">
                Consult with Expert
              </Button>
            </Link>
            <Link to="/countries">
              <Button size="lg" variant="outline" icon={Globe} iconPosition="left">
                Explore Countries
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;