import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      title: 'Company Formation',
      description: 'Quick entity setup worldwide with expert guidance and AI-powered recommendations.',
      features: ['LLC & Corporation setup', 'Registered agent service', 'EIN & tax ID', 'Compliance support'],
      color: 'from-blue-500 to-blue-600',
      price: 'From $299'
    },
    {
      title: 'Investment Advisory',
      description: 'Strategic market analysis and investment opportunities across global markets.',
      features: ['Market research', 'Risk assessment', 'Portfolio optimization', 'Due diligence'],
      color: 'from-green-500 to-green-600',
      price: 'From $499'
    },
    {
      title: 'Legal Consulting',
      description: 'Regulatory compliance and business law expertise for international operations.',
      features: ['Contract drafting', 'Compliance review', 'Legal structure', 'Dispute resolution'],
      color: 'from-purple-500 to-purple-600',
      price: 'From $399'
    },
    {
      title: 'Accounting Services',
      description: 'International tax optimization and comprehensive accounting solutions.',
      features: ['Tax planning', 'Bookkeeping', 'Financial reporting', 'Audit support'],
      color: 'from-orange-500 to-orange-600',
      price: 'From $199'
    },
    {
      title: 'Visa & Residency',
      description: 'Global mobility solutions including residency and citizenship programs.',
      features: ['Visa applications', 'Residency programs', 'Citizenship planning', 'Immigration law'],
      color: 'from-teal-500 to-teal-600',
      price: 'From $799'
    },
    {
      title: 'Market Research',
      description: 'Comprehensive market analysis and business intelligence services.',
      features: ['Industry analysis', 'Competitor research', 'Market entry strategy', 'Consumer insights'],
      color: 'from-pink-500 to-pink-600',
      price: 'From $299'
    },
    {
      title: 'Banking Solutions',
      description: 'International account opening and banking relationship management.',
      features: ['Account opening', 'Banking relationships', 'Payment processing', 'Credit facilities'],
      color: 'from-indigo-500 to-indigo-600',
      price: 'From $399'
    },
    {
      title: 'Ongoing Compliance',
      description: 'Continuous regulatory monitoring and compliance management services.',
      features: ['Regulatory updates', 'Filing management', 'Compliance calendar', 'Risk monitoring'],
      color: 'from-red-500 to-red-600',
      price: 'From $99/month'
    }
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive business solutions for international expansion and growth
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                </div>
                
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 bg-gradient-to-r ${service.color} text-white text-sm font-medium rounded-full`}>
                    {service.price}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full bg-gradient-to-r ${service.color} text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center`}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need a Custom Solution?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Our experts can create tailored solutions for your specific business needs
          </p>
          <a
            href="/contact"
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            Contact Our Experts
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;