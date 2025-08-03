import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Users, Star, UserCheck, Briefcase } from 'lucide-react';

const HROutsourcingGeorgia = () => {
  const consultant = {
    name: 'Nino Kvaratskhelia',
    title: 'Senior Business Consultant',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    rating: '4.9',
    clients: '1,247',
    experience: '8+ years'
  };

  const features = [
    'Employee recruitment and hiring',
    'Payroll processing and management',
    'Employment contract preparation',
    'Work permit applications',
    'HR policy development',
    'Performance management systems',
    'Training and development programs',
    'Legal compliance monitoring'
  ];

  const services = [
    {
      title: 'Recruitment Services',
      description: 'Find and hire the best talent for your Georgian operations',
      features: ['Job posting and advertising', 'Candidate screening', 'Interview coordination', 'Background checks']
    },
    {
      title: 'Payroll Management',
      description: 'Complete payroll processing for residents and non-residents',
      features: ['Monthly salary processing', 'Tax calculations', 'Social security contributions', 'Reporting']
    },
    {
      title: 'Legal Compliance',
      description: 'Ensure full compliance with Georgian employment laws',
      features: ['Employment law updates', 'Contract compliance', 'Work permit processing', 'Legal documentation']
    }
  ];

  const process = [
    {
      step: 1,
      title: 'HR Assessment',
      description: 'Evaluate your current HR needs and requirements'
    },
    {
      step: 2,
      title: 'Service Setup',
      description: 'Establish HR systems and processes for your business'
    },
    {
      step: 3,
      title: 'Recruitment Process',
      description: 'Source and hire qualified candidates for your team'
    },
    {
      step: 4,
      title: 'Onboarding',
      description: 'Complete employee onboarding and documentation'
    },
    {
      step: 5,
      title: 'Ongoing Management',
      description: 'Continuous HR support and compliance monitoring'
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
                🇬🇪 HR Outsourcing In Georgia
              </h1>
              <p className="text-xl text-gray-600">
                Complete HR solutions for employing residents and non-residents
              </p>
            </div>
            
            {/* Consultant Card */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{consultant.name}</h3>
                  <p className="text-purple-600">{consultant.title}</p>
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
                  Every successful business relies on a team of competent individuals. In Georgia, 
                  legalizing business operations necessitates employing both residents and non-residents. 
                  Our HR outsourcing services handle all aspects of human resource management.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  From recruitment and hiring to payroll processing and legal compliance, we provide 
                  comprehensive HR solutions that allow you to focus on your core business while we 
                  manage your human resources efficiently and in full compliance with Georgian law.
                </p>
              </div>

              {/* Service Areas */}
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">HR Service Areas</h2>
                <div className="space-y-6">
                  {services.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our HR Process</h2>
                <div className="space-y-6">
                  {process.map((item) => (
                    <div key={item.step} className="flex items-start">
                      <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
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
                <h3 className="text-lg font-bold text-gray-900 mb-4">HR Services Included</h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-purple-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employment Types */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Employment Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Georgian Residents</span>
                    <span className="font-semibold text-green-600">✓ Supported</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Non-Residents</span>
                    <span className="font-semibold text-green-600">✓ Supported</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Work Permits</span>
                    <span className="font-semibold text-green-600">✓ Handled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Compliance</span>
                    <span className="font-semibold text-green-600">✓ Guaranteed</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-3">Need HR Support?</h3>
                <p className="text-purple-100 mb-6">
                  Register now and let Nino handle your HR needs in Georgia
                </p>
                <Link
                  to="/login"
                  className="block w-full bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors mb-3"
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

export default HROutsourcingGeorgia;