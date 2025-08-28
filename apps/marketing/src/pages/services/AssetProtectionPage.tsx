import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Globe, CheckCircle, Users } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const AssetProtectionPage = () => {
  const processSteps = [
    {
      title: 'Asset Assessment',
      description: 'Comprehensive evaluation of your assets and risk exposure',
      icon: Shield,
    },
    {
      title: 'Protection Strategy',
      description: 'Design customized asset protection structures and strategies',
      icon: Lock,
    },
    {
      title: 'Structure Implementation',
      description: 'Establish trusts, foundations, and protective entities',
      icon: Globe,
    },
    {
      title: 'Ongoing Management',
      description: 'Continuous monitoring and optimization of protection structures',
      icon: CheckCircle,
    },
  ];

  const services = [
    {
      title: 'Offshore Trusts',
      description: 'Establish trusts in protective jurisdictions for asset security',
    },
    {
      title: 'Private Foundations',
      description: 'Create foundations for wealth preservation and succession planning',
    },
    {
      title: 'Holding Company Structures',
      description: 'Multi-layered corporate structures for asset protection',
    },
    {
      title: 'Insurance Solutions',
      description: 'Comprehensive insurance strategies for asset protection',
    },
    {
      title: 'Estate Planning',
      description: 'International estate planning and succession strategies',
    },
    {
      title: 'Litigation Protection',
      description: 'Structures designed to protect against legal claims',
    },
  ];

  const featuredCountries = [
    {
      name: 'Cook Islands',
      flag: '🇨🇰',
      taxRate: 'Premier',
      highlight: 'World\'s strongest asset protection trust laws',
    },
    {
      name: 'Nevis',
      flag: '🇰🇳',
      taxRate: 'Excellent',
      highlight: 'Strong LLC protection with creditor barriers',
    },
    {
      name: 'Liechtenstein',
      flag: '🇱🇮',
      taxRate: 'Premium',
      highlight: 'Private foundations with maximum privacy',
    },
    {
      name: 'Cayman Islands',
      flag: '🇰🇾',
      taxRate: 'Robust',
      highlight: 'Sophisticated trust and foundation structures',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-slate-600 to-gray-600 text-white py-20 overflow-hidden">
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
                Asset Protection Services
              </h1>
              <p className="text-xl text-slate-100 leading-relaxed mb-8">
                Safeguard your wealth with sophisticated asset protection strategies. Our specialists design robust structures to protect your assets from potential risks and preserve wealth for future generations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-slate-600 hover:bg-gray-100">
                  Get Protection Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-600">
                  View Protection Strategies
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Asset protection"
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
              Comprehensive asset protection solutions for wealth preservation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Asset Protection Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A strategic approach to safeguarding your wealth and assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-slate-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premier Asset Protection Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Establish protection structures in jurisdictions with strong asset protection laws
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
                  <div className="bg-slate-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-slate-600">{country.taxRate}</div>
                    <div className="text-xs text-slate-700">Protection Level</div>
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
      <section className="py-20 bg-gradient-to-r from-slate-600 to-gray-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Assets?</h2>
          <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto">
            Connect with our asset protection specialists and secure your wealth with proven strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-600 hover:bg-gray-100">
              Start Asset Protection
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssetProtectionPage;