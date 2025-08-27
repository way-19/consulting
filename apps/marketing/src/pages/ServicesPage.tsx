import React from 'react';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp, Users, Globe } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const ServicesPage = () => {
  const serviceCategories = [
    {
      icon: Building2,
      title: 'Company Formation',
      description: 'Complete assistance in company registration and incorporation across business-friendly jurisdictions.',
      services: [
        'Company registration and incorporation',
        'Business license applications',
        'Corporate structure optimization',
        'Registered agent services',
        'Virtual office solutions',
      ],
      color: 'blue',
    },
    {
      icon: Calculator,
      title: 'Tax Optimization',
      description: 'Strategic tax planning and optimization to minimize your international tax burden legally.',
      services: [
        'International tax planning',
        'Double taxation treaty optimization',
        'Tax residence strategies',
        'Transfer pricing guidance',
        'Annual tax compliance',
      ],
      color: 'teal',
    },
    {
      icon: CreditCard,
      title: 'Banking Solutions',
      description: 'Comprehensive banking support for international business operations.',
      services: [
        'International bank account opening',
        'Multi-currency account setup',
        'Payment gateway integration',
        'Banking relationship management',
        'Trade finance solutions',
      ],
      color: 'orange',
    },
    {
      icon: FileText,
      title: 'Legal Compliance',
      description: 'Ongoing legal and regulatory compliance support to keep your business compliant.',
      services: [
        'Regulatory compliance monitoring',
        'Contract reviews and drafting',
        'Legal structure optimization',
        'Intellectual property protection',
        'Data protection compliance',
      ],
      color: 'green',
    },
    {
      icon: Shield,
      title: 'Asset Protection',
      description: 'Advanced strategies to protect your assets and minimize risks in international operations.',
      services: [
        'Asset protection strategies',
        'Trust and foundation setup',
        'Risk assessment and mitigation',
        'Estate planning for international assets',
        'Insurance optimization',
      ],
      color: 'purple',
    },
    {
      icon: TrendingUp,
      title: 'Investment Advisory',
      description: 'Commercial investment consulting and growth strategies for international markets.',
      services: [
        'Market entry strategies',
        'Investment structure optimization',
        'Due diligence support',
        'Exit strategy planning',
        'Cross-border M&A advisory',
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
            Comprehensive International Business Services
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            From company formation to ongoing compliance, we provide end-to-end support 
            delivered by expert consultants in over 19 countries worldwide.
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
                      {category.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {category.services.map((service, i) => (
                    <li key={i} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                      {service}
                    </li>
                  ))}
                </ul>
                
                <Button variant="outline" className="w-full">
                  Explore {category.title}
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
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our expert advisors can create a tailored strategy for your unique business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" icon={Users} iconPosition="left">
              Consult with Expert
            </Button>
            <Button size="lg" variant="outline" icon={Globe} iconPosition="left">
              Explore Countries
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;