import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Calculator, CreditCard, FileText, Shield, TrendingUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const ServicesOverviewSection = () => {
  const services = [
    {
      icon: Building2,
      title: 'Company Formation',
      description: 'Assistance in company registration and incorporation in business-friendly jurisdictions worldwide.',
      color: 'blue',
    },
    {
      icon: Calculator,
      title: 'Tax Optimization',
      description: 'Strategic tax planning and optimization to minimize your international tax burden legally.',
      color: 'teal',
    },
    {
      icon: CreditCard,
      title: 'Banking Solutions',
      description: 'Help opening international bank accounts and establishing banking relationships globally.',
      color: 'orange',
    },
    {
      icon: FileText,
      title: 'Legal Compliance',
      description: 'Ongoing legal and regulatory compliance support to keep your business compliant.',
      color: 'green',
    },
    {
      icon: Shield,
      title: 'Asset Protection',
      description: 'Strategies to protect your assets and minimize risks in international business operations.',
      color: 'purple',
    },
    {
      icon: TrendingUp,
      title: 'Investment Advisory',
      description: 'Commercial investment consulting and growth strategies for international markets.',
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive International Business Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From company formation to ongoing compliance, we provide end-to-end support for your global business expansion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <Card key={index} hover className="h-full">
              <Card.Body className="h-full flex flex-col">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[service.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-6`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed flex-1">
                  {service.description}
                </p>
                
                <div className="mt-6">
                  <Button variant="ghost" size="sm" className="p-0 text-blue-600 hover:text-blue-700">
                    Learn More →
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services">
            <Button size="lg" variant="primary">
              View All Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverviewSection;