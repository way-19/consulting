import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Globe, Briefcase, Users } from 'lucide-react';
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
      description: 'Establish trusts, foundations, and protective legal entities',
      icon: Eye,
    },
    {
      title: 'Ongoing Management',
      description: 'Continuous monitoring and management of protection structures',
      icon: Globe,
    },
  ];

  const services = [
    {
      title: 'Offshore Trusts',
      description: 'International trust structures for asset protection and privacy',
    },
    {
      title: 'Private Foundations',
      description: 'Foundation structures for wealth preservation and succession planning',
    },
    {
      title: 'Holding Companies',
      description: 'Multi-layered holding structures for asset isolation and protection',
    },
    {
      title: 'Family Offices',
      description: 'Comprehensive family office setup for ultra-high-net-worth families',
    },
    {
      title: 'Succession Planning',
      description: 'Wealth transfer strategies and succession planning structures',
    },
    {
      title: 'Privacy Solutions',
      description: 'Enhanced privacy and confidentiality for high-profile individuals',
    },
  ];

  const featuredCountries = [
    {
      name: 'Cayman Islands',
      flag: '🇰🇾',
      taxRate: 'No Tax',
      highlight: 'Premier offshore jurisdiction with strong asset protection',
    },
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      taxRate: 'Private',
      highlight: 'Banking privacy and political stability',
    },
    {
      name: 'Liechtenstein',
      flag: '🇱🇮',
      taxRate: 'Foundation',
      highlight: 'Leading foundation jurisdiction with strong privacy laws',
    },
    {
      name: 'Cook Islands',
      flag: '🇨🇰',
      taxRate: 'Protected',
      highlight: 'Strongest asset protection laws globally',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8 overflow-hidden">
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
                Asset Protection Services
              </h1>
              <p className="text-xl text-purple-100 leading-relaxed mb-8">
                Protect your wealth from legal risks, creditors, and political instability. Our asset protection specialists design sophisticated structures to safeguard your assets while maintaining accessibility.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700">
                  Protect My Assets
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  View Protection Options
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sophisticated asset protection strategies for high-net-worth individuals and businesses
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
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Asset Protection Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive approach to protecting your wealth and assets
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premier Asset Protection Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Countries offering the strongest asset protection laws and privacy
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
                  <div className="bg-purple-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-purple-900">{country.taxRate}</div>
                    <div className="text-xs text-purple-700">{country.highlight}</div>
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
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Assets?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Secure your wealth with proven asset protection strategies
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              Start Asset Protection
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssetProtectionPage;