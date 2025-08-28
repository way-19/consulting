import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building, Shield, Globe, Banknote, Users } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const BankingSolutionsPage = () => {
  const processSteps = [
    {
      title: 'Banking Requirements Analysis',
      description: 'Assess your business banking needs and compliance requirements',
      icon: CreditCard,
    },
    {
      title: 'Bank Selection',
      description: 'Choose the optimal banks based on your business model and geography',
      icon: Building,
    },
    {
      title: 'Account Opening',
      description: 'Complete documentation and account opening procedures',
      icon: Shield,
    },
    {
      title: 'Banking Setup',
      description: 'Configure online banking, payment systems, and ongoing support',
      icon: Globe,
    },
  ];

  const services = [
    {
      title: 'Corporate Account Opening',
      description: 'Business bank accounts in major financial centers worldwide',
    },
    {
      title: 'Multi-Currency Accounts',
      description: 'Hold and transact in multiple currencies with competitive rates',
    },
    {
      title: 'Private Banking',
      description: 'Exclusive private banking services for high-net-worth individuals',
    },
    {
      title: 'Trade Finance',
      description: 'Letters of credit, guarantees, and international trade financing',
    },
    {
      title: 'Digital Banking Solutions',
      description: 'Modern fintech banking solutions for digital businesses',
    },
    {
      title: 'Investment Banking',
      description: 'Capital raising, M&A advisory, and investment banking services',
    },
  ];

  const featuredCountries = [
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      taxRate: 'Premium',
      highlight: 'World-renowned banking excellence and privacy',
    },
    {
      name: 'Singapore',
      flag: '🇸🇬',
      taxRate: 'Advanced',
      highlight: 'Leading Asian financial hub with digital innovation',
    },
    {
      name: 'UAE',
      flag: '🇦🇪',
      taxRate: 'Modern',
      highlight: 'Rapidly growing financial center with Islamic banking',
    },
    {
      name: 'Luxembourg',
      flag: '🇱🇺',
      taxRate: 'Stable',
      highlight: 'EU banking hub with investment fund expertise',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20 overflow-hidden">
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
                Banking Solutions
              </h1>
              <p className="text-xl text-orange-100 leading-relaxed mb-8">
                Access premium banking services worldwide. We help you open corporate and personal accounts in leading financial centers with competitive rates and advanced features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700">
                  Open Bank Account
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  Compare Banks
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Banking solutions"
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
              Complete banking solutions for international businesses and individuals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Banking Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamlined process to open accounts in the world's leading banks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premier Banking Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access world-class banking services in leading financial centers
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
                  <div className="bg-orange-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-orange-900">{country.taxRate}</div>
                    <div className="text-xs text-orange-700">{country.highlight}</div>
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
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Open Your Bank Account?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Get access to premium banking services with our expert assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Start Banking Application
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BankingSolutionsPage;