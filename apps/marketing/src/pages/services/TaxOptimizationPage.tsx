import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, TrendingUp, Shield, Globe, CheckCircle, Users } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const TaxOptimizationPage = () => {
  const processSteps = [
    {
      title: 'Tax Assessment',
      description: 'Comprehensive analysis of your current tax situation and obligations',
      icon: Calculator,
    },
    {
      title: 'Strategy Development',
      description: 'Custom tax optimization strategy based on your business structure',
      icon: TrendingUp,
    },
    {
      title: 'Implementation',
      description: 'Execute the tax strategy with proper legal structures and documentation',
      icon: Shield,
    },
    {
      title: 'Ongoing Monitoring',
      description: 'Continuous monitoring and adjustments to maintain tax efficiency',
      icon: Globe,
    },
  ];

  const services = [
    {
      title: 'International Tax Planning',
      description: 'Strategic planning to minimize global tax burden while maintaining compliance',
    },
    {
      title: 'Transfer Pricing Solutions',
      description: 'Optimize inter-company transactions and transfer pricing policies',
    },
    {
      title: 'Tax Treaty Optimization',
      description: 'Leverage double taxation treaties for maximum tax efficiency',
    },
    {
      title: 'Substance Requirements',
      description: 'Ensure economic substance compliance in low-tax jurisdictions',
    },
    {
      title: 'CRS & FATCA Compliance',
      description: 'Navigate Common Reporting Standard and FATCA requirements',
    },
    {
      title: 'Tax Residency Planning',
      description: 'Optimize personal and corporate tax residency for better rates',
    },
  ];

  const featuredCountries = [
    {
      name: 'UAE',
      flag: '🇦🇪',
      taxRate: '0%',
      highlight: 'Free zone companies enjoy 0% corporate tax',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      taxRate: '0%',
      highlight: 'No tax on retained earnings, 20% on distributions',
    },
    {
      name: 'Georgia',
      flag: '🇬🇪',
      taxRate: '1%',
      highlight: 'Small business status with 1% turnover tax',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      taxRate: '5%',
      highlight: 'Effective 5% tax rate with EU access',
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
                Tax Optimization Services
              </h1>
              <p className="text-xl text-green-100 leading-relaxed mb-8">
                Minimize your global tax burden with expert strategies and compliant structures. Our tax specialists help you navigate international tax laws while maximizing your savings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  Get Free Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  View Tax Strategies
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Tax optimization"
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
              Comprehensive tax optimization services designed to reduce your global tax burden
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Tax Optimization Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to reducing your tax burden while ensuring full compliance
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tax-Efficient Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore countries with favorable tax structures for your business
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
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <div className="text-2xl font-bold text-green-600">{country.taxRate}</div>
                    <div className="text-xs text-green-700">Corporate Tax</div>
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Taxes?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Connect with our tax specialists and start saving on your global tax obligations today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
              Start Tax Optimization
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

export default TaxOptimizationPage;