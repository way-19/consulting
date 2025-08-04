import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Users, Star, CreditCard, FileText } from 'lucide-react';

const BankAccountGeorgia = () => {
  const consultant = {
    name: 'Nino Kvaratskhelia',
    title: 'Senior Business Consultant',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: '4.9',
    clients: '1,247',
    experience: '8+ years'
  };

  const features = [
    'Personal and business account opening',
    'Multi-currency account support',
    'Online banking setup',
    'Debit and credit card issuance',
    'International wire transfers',
    'Mobile banking applications',
    'Account maintenance support',
    'Banking relationship management'
  ];

  const bankOptions = [
    {
      name: 'Bank of Georgia',
      description: 'Leading Georgian bank with comprehensive services',
      features: ['Multi-currency accounts', 'International transfers', 'Business banking', 'Investment services']
    },
    {
      name: 'TBC Bank',
      description: 'Modern digital banking with innovative solutions',
      features: ['Digital banking', 'Instant transfers', 'Business loans', 'Corporate cards']
    },
    {
      name: 'Liberty Bank',
      description: 'Reliable banking with personalized service',
      features: ['Personal service', 'SME banking', 'Trade finance', 'Currency exchange']
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Document Preparation',
      description: 'We help you prepare all required documents and forms'
    },
    {
      step: 2,
      title: 'Bank Selection',
      description: 'Choose the best Georgian bank based on your needs'
    },
    {
      step: 3,
      title: 'Application Submission',
      description: 'Submit your application through our verified channels'
    },
    {
      step: 4,
      title: 'Verification Process',
      description: 'Complete video call verification with bank representatives'
    },
    {
      step: 5,
      title: 'Account Activation',
      description: 'Receive your account details and banking cards'
    }
  ];

  const requirements = [
    'Valid passport copy',
    'Proof of address (utility bill)',
    'Bank reference letter',
    'Source of income documentation',
    'Completed application form',
    'Video call verification'
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
                🇬🇪 Bank Account Opening In Georgia
              </h1>
              <p className="text-xl text-gray-600">
                Open Georgian bank accounts for residents and non-residents
              </p>
            </div>
            
            {/* Consultant Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
                  <p className="text-blue-600">{consultant.title}</p>
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
                  Opening a bank account in Georgia is straightforward for both residents and non-residents. 
                  Georgian banks offer competitive services including multi-currency accounts, online banking, 
                  and international transfer capabilities.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our comprehensive service guides you through the entire process, from document preparation 
                  to account activation, ensuring you get the best banking solution for your needs.
                </p>
              </div>

              {/* Bank Options */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Banking Partners</h2>
                <div className="space-y-6">
                  {bankOptions.map((bank, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{bank.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{bank.description}</p>
                      <ul className="space-y-1">
                        {bank.features.map((feature, idx) => (
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
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
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
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Required Documents</h3>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Processing Time</span>
                    <span className="font-semibold text-gray-900">5-10 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Remote Opening</span>
                    <span className="font-semibold text-green-600">Available</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Currencies</span>
                    <span className="font-semibold text-gray-900">GEL, USD, EUR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Min. Balance</span>
                    <span className="font-semibold text-gray-900">No minimum</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-3">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6">
                  Register now and connect with Nino to start your bank account opening process
                </p>
                <Link
                  to="/login"
                  className="block w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors mb-3"
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

export default BankAccountGeorgia;