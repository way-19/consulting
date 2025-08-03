import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Users, Star, Plane, FileText } from 'lucide-react';

const VisaResidenceGeorgia = () => {
  const consultant = {
    name: 'Nino Kvaratskhelia',
    title: 'Senior Business Consultant',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: '4.9',
    clients: '1,247',
    experience: '8+ years'
  };

  const visaTypes = [
    {
      title: 'Tourist Visa',
      description: 'Short-term visa for tourism and business visits',
      duration: 'Up to 90 days',
      features: ['Single/Multiple entry', 'Business meetings allowed', 'Tourism activities']
    },
    {
      title: 'Work Visa',
      description: 'For employment and business activities in Georgia',
      duration: '1 year renewable',
      features: ['Work authorization', 'Renewable annually', 'Path to residency']
    },
    {
      title: 'Investment Visa',
      description: 'For investors and entrepreneurs',
      duration: '1 year renewable',
      features: ['Investment requirement', 'Business establishment', 'Fast processing']
    },
    {
      title: 'Student Visa',
      description: 'For educational purposes in Georgian institutions',
      duration: 'Study period',
      features: ['University enrollment', 'Part-time work allowed', 'Extension possible']
    }
  ];

  const residenceTypes = [
    {
      title: 'Temporary Residence',
      description: 'For stays longer than 1 year',
      duration: '1-5 years',
      features: ['Work authorization', 'Healthcare access', 'Banking services']
    },
    {
      title: 'Permanent Residence',
      description: 'Long-term residence status',
      duration: 'Indefinite',
      features: ['No renewal required', 'Full rights', 'Path to citizenship']
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Consultation & Assessment',
      description: 'Determine the best visa/residence option for your situation'
    },
    {
      step: 2,
      title: 'Document Preparation',
      description: 'Gather and prepare all required documents and translations'
    },
    {
      step: 3,
      title: 'Application Submission',
      description: 'Submit application to Georgian authorities'
    },
    {
      step: 4,
      title: 'Processing & Follow-up',
      description: 'Monitor application status and handle any additional requirements'
    },
    {
      step: 5,
      title: 'Approval & Collection',
      description: 'Receive your visa/residence permit and guidance on next steps'
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
                🇬🇪 Visa And Residence Permit In Georgia
              </h1>
              <p className="text-xl text-gray-600">
                Get Your Georgian Visa or Residence Permit with expert legal guidance
              </p>
            </div>
            
            {/* Consultant Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
                  <p className="text-green-600">{consultant.title}</p>
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
                  Georgia offers various visa and residence permit options for international visitors, workers, 
                  investors, and students. Our comprehensive service covers all types of Georgian visas and 
                  residence permits with expert legal guidance throughout the process.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Whether you're planning a short visit, looking to work in Georgia, or seeking long-term 
                  residence, we provide personalized solutions to meet your specific needs and circumstances.
                </p>
              </div>

              {/* Visa Types */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Visa Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visaTypes.map((visa, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{visa.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{visa.description}</p>
                      <div className="text-green-600 font-medium text-sm mb-3">Duration: {visa.duration}</div>
                      <ul className="space-y-1">
                        {visa.features.map((feature, idx) => (
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

              {/* Residence Types */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Residence Permits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {residenceTypes.map((residence, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{residence.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{residence.description}</p>
                      <div className="text-green-600 font-medium text-sm mb-3">Duration: {residence.duration}</div>
                      <ul className="space-y-1">
                        {residence.features.map((feature, idx) => (
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
                      <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
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
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Processing Times</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tourist Visa</span>
                    <span className="font-semibold text-gray-900">5-10 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Work Visa</span>
                    <span className="font-semibold text-gray-900">15-30 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Investment Visa</span>
                    <span className="font-semibold text-gray-900">10-20 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Residence Permit</span>
                    <span className="font-semibold text-gray-900">30-60 days</span>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Why Choose Georgia?</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Visa-free for 95+ countries</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Low cost of living</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Territorial tax system</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">English widely spoken</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">Strategic location</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-3">Ready to Move to Georgia?</h3>
                <p className="text-green-100 mb-6">
                  Register now and let Nino guide you through the visa/residence process
                </p>
                <Link
                  to="/login"
                  className="block w-full bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors mb-3"
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

export default VisaResidenceGeorgia;