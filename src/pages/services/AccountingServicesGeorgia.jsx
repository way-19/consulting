import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Users, Star, Calculator, FileText } from 'lucide-react';

const AccountingServicesGeorgia = () => {
  const consultant = {
    name: 'Nino Kvaratskhelia',
    title: 'Senior Business Consultant',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: '4.9',
    clients: '1,247',
    experience: '8+ years'
  };

  const features = [
    'Monthly bookkeeping services',
    'Tax preparation and filing',
    'Financial reporting and analysis',
    'VAT registration and compliance',
    'Payroll processing',
    'Audit support and preparation',
    'Business advisory services',
    'Regulatory compliance monitoring'
  ];

  const services = [
    {
      title: 'Basic Bookkeeping',
      description: 'Essential accounting services for small businesses',
      features: ['Monthly financial statements', 'Transaction recording', 'Bank reconciliation']
    },
    {
      title: 'Full Accounting Package',
      description: 'Comprehensive accounting solution for growing businesses',
      features: ['All basic services', 'Tax planning', 'Financial analysis', 'Advisory services']
    },
    {
      title: 'Corporate Accounting',
      description: 'Advanced accounting for larger corporations',
      features: ['Complex financial reporting', 'Multi-entity consolidation', 'Audit preparation']
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Initial Consultation',
      description: 'Assess your business needs and accounting requirements'
    },
    {
      step: 2,
      title: 'Service Setup',
      description: 'Configure accounting systems and establish procedures'
    },
    {
      step: 3,
      title: 'Monthly Processing',
      description: 'Regular bookkeeping and financial statement preparation'
    },
    {
      step: 4,
      title: 'Tax Compliance',
      description: 'Ensure all tax obligations are met on time'
    },
    {
      step: 5,
      title: 'Ongoing Support',
      description: 'Continuous advisory and compliance monitoring'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/georgia"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Georgia Services
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🇬🇪 Accounting Services In Georgia
              </h1>
              <p className="text-xl text-gray-600">
                Your outsource partner in Georgia for all accounting needs
              </p>
            </div>
            
            {/* Consultant Card */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
                  <p className="text-orange-600">{consultant.title}</p>
                  <p className="text-gray-600 text-sm">{consultant.experience}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{consultant.rating}</div>
                  <div className="text-gray-600 text-sm">Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{consultant.clients}</div>
                  <div className="text-gray-600 text-sm">Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Service Overview */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Overview</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our comprehensive accounting services in Georgia provide businesses with professional 
                  financial management, ensuring compliance with local regulations while optimizing 
                  your financial operations for growth and efficiency.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  From basic bookkeeping to complex financial reporting, we handle all aspects of 
                  your accounting needs, allowing you to focus on growing your business while we 
                  manage your financial compliance and reporting requirements.
                </p>
              </div>

              {/* Service Packages */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Packages</h2>
                <div className="space-y-6">
                  {services.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Process</h2>
                <div className="space-y-6">
                  {process.map((item) => (
                    <div key={item.step} className="flex items-start">
                      <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Features */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">What's Included</h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-orange-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Service Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Service Type</span>
                    <span className="font-semibold text-gray-900">Outsourcing</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Reporting</span>
                    <span className="font-semibold text-gray-900">Monthly</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Support</span>
                    <span className="font-semibold text-green-600">24/7</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Languages</span>
                    <span className="font-semibold text-gray-900">EN, GE</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-3">Ready to Outsource?</h3>
                <p className="text-orange-100 mb-6">
                  Register now and let Nino handle your accounting needs professionally
                </p>
                <Link
                  to="/login"
                  className="block w-full bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors mb-3"
                >
                  Register & Start Process
                </Link>
                <Link
                  to="/contact"
                  className="block w-full border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  Ask Questions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccountingServicesGeorgia;