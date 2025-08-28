import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Globe, CheckCircle, Users, Clock, Shield } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const CompanyFormationPage = () => {
  const processSteps = [
    {
      title: 'Business Structure Analysis',
      description: 'Analyze your business needs and recommend the optimal corporate structure',
      icon: Building2,
    },
    {
      title: 'Jurisdiction Selection',
      description: 'Choose the best country and legal framework for your business goals',
      icon: Globe,
    },
    {
      title: 'Documentation & Filing',
      description: 'Prepare and submit all required legal documents and registrations',
      icon: Shield,
    },
    {
      title: 'Compliance Setup',
      description: 'Establish ongoing compliance procedures and reporting requirements',
      icon: CheckCircle,
    },
  ];

  const services = [
    {
      title: 'LLC Formation',
      description: 'Limited liability company setup with flexible management structure',
    },
    {
      title: 'Corporation Setup',
      description: 'Full corporate structure with board governance and share capital',
    },
    {
      title: 'Offshore Company Formation',
      description: 'International business companies in tax-efficient jurisdictions',
    },
    {
      title: 'Holding Company Structure',
      description: 'Multi-tier corporate structures for asset protection and tax optimization',
    },
    {
      title: 'Branch Office Registration',
      description: 'Establish local presence through branch office registration',
    },
    {
      title: 'Representative Office Setup',
      description: 'Non-trading representative offices for market research and liaison',
    },
  ];

  const featuredCountries = [
    {
      name: 'UAE',
      flag: '🇦🇪',
      taxRate: '0%',
      highlight: 'Free zone companies with 0% corporate tax',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      taxRate: '0%',
      highlight: '100% online e-Residency program',
    },
    {
      name: 'Delaware',
      flag: '🇺🇸',
      taxRate: 'No state tax',
      highlight: 'World\'s leading corporate jurisdiction',
    },
    {
      name: 'Singapore',
      flag: '🇸🇬',
      taxRate: '17%',
      highlight: 'Gateway to Asian markets with excellent infrastructure',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-white rounded-lg rotate-45"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/services">
              <Button variant="ghost" className="text-white hover:bg-white/20" icon={ArrowLeft} iconPosition="left">
                Back to Services
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Company Formation Services
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Establish your business in the world's most business-friendly jurisdictions. Our experts guide you through every step of company formation, from structure selection to final registration.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                  Get Free Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View Formation Options
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Company formation"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive company formation services tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-6 h-48 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Company Formation Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to establishing your business in the optimal jurisdiction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Countries */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Jurisdictions for Company Formation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore countries with the most favorable business formation environments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCountries.map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-green-900">{country.taxRate}</div>
                    <div className="text-xs text-green-700">{country.highlight}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Form Your Company?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get expert guidance and establish your business in the optimal jurisdiction
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Company Formation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyFormationPage;