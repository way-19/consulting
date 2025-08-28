import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Search, Target, TrendingUp, Users, Globe } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const MarketResearchPage = () => {
  const processSteps = [
    {
      title: 'Market Analysis',
      description: 'Comprehensive analysis of target markets and opportunities',
      icon: BarChart3,
    },
    {
      title: 'Competitive Research',
      description: 'In-depth competitor analysis and market positioning strategies',
      icon: Search,
    },
    {
      title: 'Strategy Development',
      description: 'Develop market entry strategies based on research findings',
      icon: Target,
    },
    {
      title: 'Implementation Support',
      description: 'Ongoing support for market entry and expansion activities',
      icon: TrendingUp,
    },
  ];

  const services = [
    {
      title: 'Market Entry Analysis',
      description: 'Comprehensive market entry strategies for new geographical markets',
    },
    {
      title: 'Competitor Intelligence',
      description: 'Detailed competitor analysis and competitive positioning research',
    },
    {
      title: 'Consumer Research',
      description: 'Consumer behavior analysis and market demand assessment',
    },
    {
      title: 'Industry Reports',
      description: 'Custom industry reports and market trend analysis',
    },
    {
      title: 'Regulatory Research',
      description: 'Regulatory landscape analysis for market entry compliance',
    },
    {
      title: 'Partnership Opportunities',
      description: 'Identification of strategic partners and business opportunities',
    },
  ];

  const featuredCountries = [
    {
      name: 'Germany',
      flag: '🇩🇪',
      taxRate: 'EU Leader',
      highlight: 'Largest European economy with detailed market data',
    },
    {
      name: 'Japan',
      flag: '🇯🇵',
      taxRate: 'Advanced',
      highlight: 'Sophisticated market with high consumer spending',
    },
    {
      name: 'Brazil',
      flag: '🇧🇷',
      taxRate: 'Emerging',
      highlight: 'Largest Latin American market with growth potential',
    },
    {
      name: 'India',
      flag: '🇮🇳',
      taxRate: 'Growing',
      highlight: 'Rapidly expanding market with digital transformation',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 to-rose-600 text-white py-20 overflow-hidden">
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
                Market Research Services
              </h1>
              <p className="text-xl text-pink-100 leading-relaxed mb-8">
                Make informed business decisions with comprehensive market intelligence. Our research experts provide deep insights into global markets, competitors, and opportunities for successful expansion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-pink-600 text-white hover:bg-pink-700">
                  Get Market Analysis
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
                  View Research Options
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Market research"
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
              Data-driven market research and business intelligence services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Market Research Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Systematic approach to understanding markets and identifying opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Market Research Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Major markets with comprehensive research capabilities and opportunities
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
                  <div className="bg-pink-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-pink-900">{country.taxRate}</div>
                    <div className="text-xs text-pink-700">{country.highlight}</div>
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
      <section className="py-20 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Research Your Market?</h2>
          <p className="text-xl text-pink-100 mb-8">
            Get comprehensive market intelligence to drive your business decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
              Start Market Research
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketResearchPage;