import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Users, Star, Building2, FileText } from 'lucide-react';

const CompanyRegistrationGeorgia = () => {
  const consultant = {
    name: 'Nino Kvaratskhelia',
    title: 'Senior Business Consultant',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: '4.9',
    clients: '1,247',
    experience: '8+ years'
  };

  const features = [
    'LLC registration and setup',
    'Tax number acquisition',
    'Bank account opening assistance',
    'Legal address provision',
    'Corporate seal preparation',
    'Shareholder agreements',
    'Board resolutions',
    'Ongoing compliance support'
  ];

  const companyTypes = [
    {
      title: 'Limited Liability Company (LLC)',
      description: 'Most popular business structure in Georgia',
      features: ['Limited liability protection', 'Flexible management', 'Tax advantages', 'Easy maintenance']
    },
    {
      title: 'Joint Stock Company (JSC)',
      description: 'For larger businesses and public companies',
      features: ['Share capital structure', 'Board of directors', 'Public offering option', 'Corporate governance']
    },
    {
      title: 'Branch Office',
      description: 'Extension of foreign company in Georgia',
      features: ['Foreign company extension', 'Local presence', 'Limited activities', 'Simplified setup']
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Company Structure Planning',
      description: 'Determine optimal company structure for your business needs'
    },
    {
      step: 2,
      title: 'Name Reservation',
      description: 'Reserve your preferred company name with authorities'
    },
    {
      step: 3,
      title: 'Document Preparation',
      description: 'Prepare all incorporation documents and agreements'
    },
    {
      step: 4,
      title: 'Registration Filing',
      description: 'Submit registration to House of Justice'
    },
    {
      step: 5,
      title: 'Post-Registration Setup',
      description: 'Complete tax registration and bank account opening'
    }
  ];

  const requirements = [
    'Company name (3 options)',
    'Business activity description',
    'Shareholder information',
    'Director details',
    'Registered address',
    'Share capital amount'
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
                🇬🇪 Company Registration In Georgia
              </h1>
              <p className="text-xl text-gray-600">
                Open your business fast, easy and reliable
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
                  Company registration in Georgia is streamlined and efficient, making it one of the 
                  most business-friendly jurisdictions globally. Our comprehensive service handles 
                  all aspects of company formation, from initial planning to post-registration setup.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We ensure your company is properly structured for tax efficiency, operational 
                  flexibility, and future growth while maintaining full compliance with Georgian 
                  corporate law and regulations.
                </p>
              </div>

              {/* Company Types */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Types</h2>
                <div className="space-y-6">
                  {companyTypes.map((type, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{type.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                      <ul className="space-y-1">
                        {type.features.map((feature, idx) => (
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Registration Process</h2>
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
              {/* Features */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">What's Included</h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Required Information</h3>
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">Registration Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Processing Time</span>
                    <span className="font-semibold text-gray-900">3-5 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Min. Share Capital</span>
                    <span className="font-semibold text-gray-900">1 GEL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Directors Required</span>
                    <span className="font-semibold text-gray-900">1 minimum</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Shareholders</span>
                    <span className="font-semibold text-gray-900">1 minimum</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-3">Ready to Register?</h3>
                <p className="text-green-100 mb-6">
                  Register now and let Nino handle your company registration
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

export default CompanyRegistrationGeorgia;