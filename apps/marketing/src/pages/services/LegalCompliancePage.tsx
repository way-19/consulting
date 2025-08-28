import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, Shield, CheckCircle, Users } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const LegalCompliancePage = () => {
  const processSteps = [
    {
      title: 'Compliance Assessment',
      description: 'Evaluate current compliance status and identify requirements',
      icon: FileText,
    },
    {
      title: 'Regulatory Framework',
      description: 'Establish comprehensive compliance framework and policies',
      icon: Scale,
    },
    {
      title: 'Implementation',
      description: 'Deploy compliance procedures and monitoring systems',
      icon: Shield,
    },
    {
      title: 'Ongoing Monitoring',
      description: 'Continuous compliance monitoring and regulatory updates',
      icon: CheckCircle,
    },
  ];

  const services = [
    {
      title: 'Regulatory Compliance',
      description: 'Ensure adherence to local and international regulations',
    },
    {
      title: 'Corporate Governance',
      description: 'Establish proper board governance and decision-making processes',
    },
    {
      title: 'Contract Management',
      description: 'Legal review and management of business contracts and agreements',
    },
    {
      title: 'Intellectual Property',
      description: 'Protect and manage your intellectual property assets globally',
    },
    {
      title: 'Employment Law',
      description: 'Navigate international employment laws and HR compliance',
    },
    {
      title: 'Data Protection',
      description: 'GDPR, CCPA and other data protection compliance solutions',
    },
  ];

  const featuredCountries = [
    {
      name: 'UK',
      flag: '🇬🇧',
      taxRate: 'Strong',
      highlight: 'Robust legal system with common law foundation',
    },
    {
      name: 'Germany',
      flag: '🇩🇪',
      taxRate: 'Comprehensive',
      highlight: 'Detailed regulatory framework with EU compliance',
    },
    {
      name: 'Singapore',
      flag: '🇸🇬',
      taxRate: 'Efficient',
      highlight: 'Streamlined legal processes with English law basis',
    },
    {
      name: 'USA',
      flag: '🇺🇸',
      taxRate: 'Advanced',
      highlight: 'Sophisticated legal system with federal and state laws',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20 overflow-hidden">
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
                Legal Compliance Services
              </h1>
              <p className="text-xl text-purple-100 leading-relaxed mb-8">
                Navigate complex legal requirements with confidence. Our legal experts ensure your business remains compliant across all jurisdictions while minimizing regulatory risks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Get Legal Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  View Compliance Services
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Legal compliance"
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
              Comprehensive legal compliance solutions for international businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Legal Compliance Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to ensuring full legal compliance across all jurisdictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leading Legal Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Establish compliance in countries with strong legal frameworks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCountries.map((country, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className="bg-purple-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-purple-600">{country.taxRate}</div>
                    <div className="text-xs text-purple-700">Legal System</div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {country.highlight}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Ensure Legal Compliance?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Connect with our legal experts and protect your business with comprehensive compliance solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Start Compliance Review
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              Schedule Legal Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalCompliancePage;