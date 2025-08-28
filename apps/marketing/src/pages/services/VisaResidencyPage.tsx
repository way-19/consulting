import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Plane, Home, Globe, MapPin, Clock } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const VisaResidencyPage = () => {
  const processSteps = [
    {
      title: 'Eligibility Assessment',
      description: 'Evaluate your eligibility for various visa and residency programs',
      icon: Users,
    },
    {
      title: 'Program Selection',
      description: 'Choose the optimal visa or residency program for your goals',
      icon: Plane,
    },
    {
      title: 'Application Preparation',
      description: 'Prepare and submit all required documentation and applications',
      icon: Home,
    },
    {
      title: 'Approval & Settlement',
      description: 'Support through approval process and settlement assistance',
      icon: Globe,
    },
  ];

  const services = [
    {
      title: 'Golden Visa Programs',
      description: 'Investment-based residency programs in EU and other countries',
    },
    {
      title: 'Investor Visas',
      description: 'Business investor visas for entrepreneurs and business owners',
    },
    {
      title: 'Citizenship by Investment',
      description: 'Fast-track citizenship through approved investment programs',
    },
    {
      title: 'Skilled Worker Visas',
      description: 'Work permits and skilled worker visa applications',
    },
    {
      title: 'Family Reunification',
      description: 'Family visa applications and dependent visa processing',
    },
    {
      title: 'Permanent Residency',
      description: 'Pathways to permanent residency and long-term settlement',
    },
  ];

  const featuredCountries = [
    {
      name: 'Portugal',
      flag: '🇵🇹',
      taxRate: '€280K',
      highlight: 'Golden Visa with EU residency and NHR tax benefits',
    },
    {
      name: 'Spain',
      flag: '🇪🇸',
      taxRate: '€500K',
      highlight: 'Real estate investment visa with EU access',
    },
    {
      name: 'Canada',
      flag: '🇨🇦',
      taxRate: 'Points',
      highlight: 'Express Entry system for skilled workers',
    },
    {
      name: 'Australia',
      flag: '🇦🇺',
      taxRate: 'Business',
      highlight: 'Business innovation and investment visa programs',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 overflow-hidden">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Visa & Residency Services
              </h1>
              <p className="text-xl text-indigo-100 leading-relaxed mb-8">
                Secure residency and citizenship in your preferred countries. Our immigration experts guide you through visa applications, investment programs, and permanent residency pathways.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700">
                  Apply for Residency
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                  View Visa Options
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Visa and residency"
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
              Comprehensive visa and residency services for global mobility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Visa & Residency Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Step-by-step guidance through visa applications and residency programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Residency Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Countries offering attractive visa and residency programs for investors
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
                  <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-indigo-900">{country.taxRate}</div>
                    <div className="text-xs text-indigo-700">{country.highlight}</div>
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
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Residency?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Start your journey to global mobility and new opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
              Apply for Residency
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisaResidencyPage;