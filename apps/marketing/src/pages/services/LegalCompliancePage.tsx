import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, Shield, CheckCircle, AlertTriangle, BookOpen } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const LegalCompliancePage = () => {
  const processSteps = [
    {
      title: 'Compliance Assessment',
      description: 'Evaluate current compliance status and identify potential risks',
      icon: FileText,
    },
    {
      title: 'Regulatory Mapping',
      description: 'Map all applicable regulations and compliance requirements',
      icon: Scale,
    },
    {
      title: 'Implementation',
      description: 'Implement compliance procedures and documentation systems',
      icon: Shield,
    },
    {
      title: 'Ongoing Monitoring',
      description: 'Continuous monitoring and updates for regulatory changes',
      icon: CheckCircle,
    },
  ];

  const services = [
    {
      title: 'Corporate Governance',
      description: 'Board resolutions, shareholder agreements, and governance frameworks',
    },
    {
      title: 'Regulatory Compliance',
      description: 'Industry-specific compliance for finance, healthcare, and technology',
    },
    {
      title: 'Data Protection Compliance',
      description: 'GDPR, CCPA, and other data privacy regulation compliance',
    },
    {
      title: 'Anti-Money Laundering',
      description: 'AML/KYC procedures and compliance program implementation',
    },
    {
      title: 'Contract Management',
      description: 'Legal contract drafting, review, and management systems',
    },
    {
      title: 'Intellectual Property',
      description: 'Patent, trademark, and copyright protection strategies',
    },
  ];

  const featuredCountries = [
    {
      name: 'UK',
      flag: '🇬🇧',
      taxRate: 'Common Law',
      highlight: 'Robust legal framework with English common law',
    },
    {
      name: 'Germany',
      flag: '🇩🇪',
      taxRate: 'EU Leader',
      highlight: 'Strong regulatory environment and EU compliance',
    },
    {
      name: 'Singapore',
      flag: '🇸🇬',
      taxRate: 'Efficient',
      highlight: 'Streamlined regulations with business-friendly laws',
    },
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      taxRate: 'Stable',
      highlight: 'Political stability with predictable legal system',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20 overflow-hidden">
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
              <p className="text-xl text-green-100 leading-relaxed mb-8">
                Ensure full legal compliance across all jurisdictions. Our legal experts help you navigate complex regulatory requirements and maintain good standing in all your business locations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 text-white hover:bg-green-700">
                  Get Compliance Review
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  View Legal Services
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
              Comprehensive legal compliance services for international businesses
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
              Systematic approach to ensuring full legal compliance across all jurisdictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
              Countries with the most robust and business-friendly legal frameworks
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Ensure Compliance?</h2>
          <p className="text-xl text-green-100 mb-8">
            Protect your business with comprehensive legal compliance services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Start Compliance Review
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalCompliancePage;