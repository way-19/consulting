import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Users, Star, Scale, FileText } from 'lucide-react';

const CommercialLawGeorgia = () => {
  const consultant = {
    name: 'Nino Kvaratskhelia',
    title: 'Senior Business Consultant',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: '4.9',
    clients: '1,247',
    experience: '8+ years'
  };

  const features = [
    'Commercial contract drafting',
    'Business law compliance',
    'Corporate governance advisory',
    'Merger and acquisition support',
    'Intellectual property protection',
    'Commercial dispute resolution',
    'Regulatory compliance guidance',
    'International trade law'
  ];

  const services = [
    {
      title: 'Contract Law Services',
      description: 'Professional commercial contract drafting and review',
      features: ['Sales and purchase agreements', 'Service contracts', 'Distribution agreements', 'Partnership contracts']
    },
    {
      title: 'Corporate Law Advisory',
      description: 'Comprehensive corporate governance and compliance',
      features: ['Corporate structure optimization', 'Board governance', 'Shareholder relations', 'Compliance monitoring']
    },
    {
      title: 'Commercial Litigation',
      description: 'Dispute resolution and commercial litigation support',
      features: ['Contract disputes', 'Business conflicts', 'Arbitration support', 'Court representation']
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Legal Assessment',
      description: 'Comprehensive review of your commercial law needs'
    },
    {
      step: 2,
      title: 'Strategy Development',
      description: 'Create tailored legal strategy for your business'
    },
    {
      step: 3,
      title: 'Document Drafting',
      description: 'Prepare all necessary legal documents and contracts'
    },
    {
      step: 4,
      title: 'Review and Negotiation',
      description: 'Review terms and negotiate on your behalf'
    },
    {
      step: 5,
      title: 'Implementation Support',
      description: 'Ongoing support for contract implementation'
    }
  ];

  const expertise = [
    'Contract Law',
    'Corporate Law',
    'Commercial Litigation',
    'Intellectual Property',
    'International Trade',
    'Regulatory Compliance'
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
                🇬🇪 Commercial Law Consulting In Georgia
              </h1>
              <p className="text-xl text-gray-600">
                Professional commercial law services for businesses
              </p>
            </div>
            
            {/* Consultant Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
              <div className="flex items-center mb-4">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
                  <p className="text-indigo-600">{consultant.title}</p>
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
                  Our commercial law consulting services provide comprehensive legal support for 
                  businesses operating in Georgia. From contract drafting to corporate governance, 
                  we ensure your business operates within the legal framework while protecting 
                  your commercial interests.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  With deep expertise in Georgian commercial law and international business 
                  practices, we provide strategic legal guidance that supports your business 
                  growth and minimizes legal risks in the Georgian market.
                </p>
              </div>

              {/* Service Areas */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Commercial Law Services</h2>
                <div className="space-y-6">
                  {services.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Legal Process</h2>
                <div className="space-y-6">
                  {process.map((item) => (
                    <div key={item.step} className="flex items-start">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Legal Services Included</h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-indigo-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expertise Areas */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Areas of Expertise</h3>
                <div className="space-y-3">
                  {expertise.map((area, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-600">{area}</span>
                      <span className="font-semibold text-green-600">✓ Expert</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Service Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-semibold text-gray-900">24 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Languages</span>
                    <span className="font-semibold text-gray-900">EN, GE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Consultation</span>
                    <span className="font-semibold text-green-600">Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Support</span>
                    <span className="font-semibold text-green-600">Ongoing</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-3">Need Legal Advice?</h3>
                <p className="text-indigo-100 mb-6">
                  Register now and get professional commercial law consulting from Nino
                </p>
                <Link
                  to="/login"
                  className="block w-full bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors mb-3"
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

export default CommercialLawGeorgia;