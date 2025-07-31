import React from 'react';
import { Link } from 'react-router-dom';

function ServicesPage({ language = 'en' }) {
  const services = [
    {
      icon: '📋',
      title: 'Company Formation',
      description: 'Quick entity setup worldwide with AI-powered recommendations.',
      features: ['LLC & Corporation setup', 'Registered agent service', 'EIN & tax ID', 'Compliance support'],
      buttonColor: 'from-blue-500 to-blue-600',
      link: '/services/company-formation'
    },
    {
      icon: '📈',
      title: 'Investment Advisory', 
      description: 'Strategic market analysis and investment opportunities across global markets.',
      features: ['Market research', 'Risk assessment', 'Portfolio optimization', 'Due diligence'],
      buttonColor: 'from-green-500 to-green-600',
      link: '/services/investment-advisory'
    },
    {
      icon: '⚖️',
      title: 'Legal Consulting',
      description: 'Regulatory compliance and business law expertise for international operations.',
      features: ['Contract drafting', 'Compliance review', 'Legal structure', 'Dispute resolution'],
      buttonColor: 'from-purple-500 to-purple-600',
      link: '/services/legal-consulting'
    },
    {
      icon: '📊',
      title: 'Accounting Services',
      description: 'International tax optimization and comprehensive accounting solutions.',
      features: ['Tax planning', 'Bookkeeping', 'Financial reporting', 'Audit support'],
      buttonColor: 'from-orange-500 to-orange-600',
      link: '/services/accounting'
    },
    {
      icon: '✈️',
      title: 'Visa & Residency',
      description: 'Global mobility solutions including visa applications and citizenship programs.',
      features: ['Visa applications', 'Residency programs', 'Citizenship planning', 'Immigration law'],
      buttonColor: 'from-teal-500 to-teal-600',
      link: '/services/visa-residency'
    },
    {
      icon: '🔍',
      title: 'Market Research',
      description: 'Industry insights and competitive analysis for informed business decisions.',
      features: ['Industry analysis', 'Competitor research', 'Market sizing', 'Trend analysis'],
      buttonColor: 'from-pink-500 to-pink-600',
      link: '/services/market-research'
    },
    {
      icon: '🏦',
      title: 'Banking Solutions',
      description: 'International account opening and banking relationship management.',
      features: ['Account opening', 'Banking relationships', 'Payment processing', 'Credit facilities'],
      buttonColor: 'from-indigo-500 to-indigo-600',
      link: '/services/banking'
    },
    {
      icon: '🛡️',
      title: 'Ongoing Compliance',
      description: 'Continuous regulatory monitoring and compliance management services.',
      features: ['Regulatory updates', 'Filing management', 'Compliance calendar', 'Risk monitoring'],
      buttonColor: 'from-red-500 to-red-600',
      link: '/services/compliance'
    }
  ];

  const stats = [
    { number: '1,247+', label: 'Active Consultations', description: 'Ongoing client engagements worldwide' },
    { number: '8', label: 'Strategic Jurisdictions', description: 'Countries with expert consultants' },
    { number: '98%', label: 'Success Rate', description: 'Successful business formations' },
    { number: '47min', label: 'Avg Response Time', description: 'AI-powered instant support' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <span className="text-sm font-medium">🔧 Comprehensive Business Services</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Expert Services for <span className="text-blue-200">Global Success</span>
          </h1>
          
          <p className="text-xl text-purple-100 mb-8 max-w-4xl mx-auto">
            From company formation to ongoing compliance, our AI-enhanced platform connects you with expert consultants for every aspect of international business.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300 group">
                <div className="text-4xl mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to={service.link}
                  className={`w-full bg-gradient-to-r ${service.buttonColor} text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 text-center inline-block`}
                >
                  Get Started →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Real-Time Platform <span className="text-blue-400">Analytics</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Live insights from our worldwide network of expert consultants and AI-powered analytics driving successful business formations.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-gray-300 font-semibold">{stat.label}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Connect with our expert consultants and experience the power of AI-enhanced business consulting.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center bg-white text-purple-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Contact Us Today
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ServicesPage;