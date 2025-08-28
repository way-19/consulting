import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, BarChart3, Target, CheckCircle, Users } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const InvestmentAdvisoryPage = () => {
  const processSteps = [
    {
      title: 'Investment Analysis',
      description: 'Comprehensive analysis of investment opportunities and risk assessment',
      icon: TrendingUp,
    },
    {
      title: 'Portfolio Strategy',
      description: 'Develop customized investment strategies aligned with your goals',
      icon: BarChart3,
    },
    {
      title: 'Implementation',
      description: 'Execute investment strategies with optimal timing and allocation',
      icon: Target,
    },
    {
      title: 'Performance Monitoring',
      description: 'Continuous monitoring and optimization of investment performance',
      icon: CheckCircle,
    },
  ];

  const services = [
    {
      title: 'Portfolio Management',
      description: 'Professional management of diversified investment portfolios',
    },
    {
      title: 'Real Estate Investment',
      description: 'International real estate opportunities and investment strategies',
    },
    {
      title: 'Alternative Investments',
      description: 'Access to private equity, hedge funds, and alternative assets',
    },
    {
      title: 'Cryptocurrency Advisory',
      description: 'Digital asset investment strategies and regulatory compliance',
    },
    {
      title: 'ESG Investing',
      description: 'Sustainable and responsible investment opportunities',
    },
    {
      title: 'Wealth Structuring',
      description: 'Optimize wealth structures for tax efficiency and growth',
    },
  ];

  const featuredCountries = [
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      taxRate: 'Premium',
      highlight: 'World-renowned wealth management and private banking',
    },
    {
      name: 'Luxembourg',
      flag: '🇱🇺',
      taxRate: 'Advanced',
      highlight: 'Leading fund domicile with sophisticated structures',
    },
    {
      name: 'Singapore',
      flag: '🇸🇬',
      taxRate: 'Excellent',
      highlight: 'Asian wealth hub with family office incentives',
    },
    {
      name: 'Monaco',
      flag: '🇲🇨',
      taxRate: 'Elite',
      highlight: 'No personal income tax with luxury lifestyle',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20 overflow-hidden">
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
                Investment Advisory Services
              </h1>
              <p className="text-xl text-emerald-100 leading-relaxed mb-8">
                Maximize your wealth with expert investment strategies and global opportunities. Our investment advisors provide personalized guidance to help you achieve your financial goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Get Investment Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                  View Investment Options
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Investment advisory"
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
              Comprehensive investment advisory services for wealth growth and preservation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Investment Advisory Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to building and managing your investment portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premier Investment Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access investment opportunities in world-class financial centers
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
                  <div className="bg-emerald-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-emerald-600">{country.taxRate}</div>
                    <div className="text-xs text-emerald-700">Investment Hub</div>
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
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Wealth?</h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Connect with our investment advisors and start building your global investment portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
              Start Investment Planning
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
              Schedule Advisory Meeting
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestmentAdvisoryPage;