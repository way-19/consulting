import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Users, Star, Calculator, FileText } from 'lucide-react';

const TaxResidencyGeorgia = () => {
  const consultant = {
    name: 'Nino Kvaratskhelia',
    title: 'Senior Business Consultant',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: '4.9',
    clients: '1,247',
    experience: '8+ years'
  };

  const features = [
    'Tax residency application assistance',
    'Status certificate preparation',
    'Tax optimization consultation',
    'Legal compliance guidance',
    'Document preparation and review',
    'Government liaison services',
    'Ongoing tax advisory',
    'International tax planning'
  ];

  const benefits = [
    {
      title: 'Territorial Tax System',
      description: 'Pay tax only on Georgian-sourced income',
      details: ['Foreign income tax-free', 'No worldwide taxation', 'Simple tax structure']
    },
    {
      title: 'Low Tax Rates',
      description: 'One of the lowest tax rates globally',
      details: ['1% tax for small business', '20% corporate tax', 'Profit tax exemptions']
    },
    {
      title: 'Easy Qualification',
      description: 'Simple requirements for tax residency',
      details: ['183+ days presence', 'Property ownership option', 'Business activity option']
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Eligibility Assessment',
      description: 'Evaluate your qualification for Georgian tax residency'
    },
    {
      step: 2,
      title: 'Document Preparation',
      description: 'Gather and prepare all required documentation'
    },
    {
      step: 3,
      title: 'Application Submission',
      description: 'Submit tax residency application to authorities'
    },
    {
      step: 4,
      title: 'Status Verification',
      description: 'Complete verification process and interviews'
    },
    {
      step: 5,
      title: 'Certificate Issuance',
      description: 'Receive official tax residency certificate'
    }
  ];

  const requirements = [
    'Valid passport copy',
    'Proof of Georgian address',
    'Bank statements',
    'Income documentation',
    'Health insurance certificate',
    'Criminal background check'
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
                🇬🇪 Tax Residency In Georgia
              </h1>
              <p className="text-xl text-gray-600">
                One of the lowest tax rates in the world with territorial taxation
              </p>
            </div>
            
            {/* Consultant Card */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
              <div className="flex items-center mb-4">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
                  <p className="text-yellow-600">{consultant.title}</p>
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
                  Georgian tax residency offers one of the most attractive tax systems globally with 
                  territorial taxation principles. This means you only pay tax on income earned within 
                  Georgia, while foreign-sourced income remains tax-free.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our comprehensive service guides you through the entire tax residency application 
                  process, ensuring compliance with all requirements while optimizing your tax 
                  position for maximum benefits under Georgian tax law.
                </p>
              </div>

              {/* Tax Benefits */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tax Benefits</h2>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-yellow-300 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{benefit.description}</p>
                      <ul className="space-y-1">
                        {benefit.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-700">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {detail}
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
                      <div className="w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
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
                      <CheckCircle className="h-4 w-4 text-yellow-500 mr-3 flex-shrink-0" />
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tax Rates</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Small Business</span>
                    <span className="font-semibold text-green-600">1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Corporate Tax</span>
                    <span className="font-semibold text-gray-900">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Foreign Income</span>
                    <span className="font-semibold text-green-600">0%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Processing Time</span>
                    <span className="font-semibold text-gray-900">30-45 days</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-3">Ready for Tax Residency?</h3>
                <p className="text-yellow-100 mb-6">
                  Register now and let Nino guide you through the tax residency process
                </p>
                <Link
                  to="/login"
                  className="block w-full bg-white text-yellow-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors mb-3"
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

export default TaxResidencyGeorgia;