import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, TrendingUp, Globe, MessageSquare, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const InvestmentAdvisoryPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Professional portfolio management',
    'Alternative investment opportunities',
    'Real estate investment guidance',
    'ESG investment strategies',
    'Cryptocurrency compliance and strategy',
    'Risk assessment and management',
    'Performance monitoring and reporting',
    'Investment structure optimization',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Investment Profile Assessment',
      description: 'Evaluate your investment goals, risk tolerance, and financial situation',
      duration: '2-3 days',
    },
    {
      step: 2,
      title: 'Strategy Development',
      description: 'Create customized investment strategy aligned with your objectives',
      duration: '3-5 days',
    },
    {
      step: 3,
      title: 'Portfolio Construction',
      description: 'Build diversified portfolio with optimal asset allocation',
      duration: '1 week',
    },
    {
      step: 4,
      title: 'Implementation',
      description: 'Execute investment strategy and establish accounts',
      duration: '1-2 weeks',
    },
    {
      step: 5,
      title: 'Monitoring Setup',
      description: 'Establish performance monitoring and reporting systems',
      duration: '2-3 days',
    },
    {
      step: 6,
      title: 'Ongoing Management',
      description: 'Continuous portfolio management and strategy optimization',
      duration: 'Ongoing',
    },
  ];

  const investmentTypes = [
    {
      title: 'Traditional Investments',
      description: 'Stocks, bonds, and mutual funds',
      icon: BarChart3,
      features: ['Global equity markets', 'Fixed income securities', 'Mutual funds & ETFs', 'Index investing'],
      riskLevel: 'Low to Medium',
    },
    {
      title: 'Alternative Investments',
      description: 'Private equity, hedge funds, commodities',
      icon: TrendingUp,
      features: ['Private equity funds', 'Hedge fund strategies', 'Commodity investments', 'Structured products'],
      riskLevel: 'Medium to High',
    },
    {
      title: 'Real Estate',
      description: 'Direct and indirect real estate investments',
      icon: Shield,
      features: ['Direct property investment', 'REITs', 'Real estate funds', 'Development projects'],
      riskLevel: 'Medium',
    },
    {
      title: 'Digital Assets',
      description: 'Cryptocurrency and blockchain investments',
      icon: Globe,
      features: ['Cryptocurrency portfolios', 'DeFi strategies', 'NFT investments', 'Blockchain projects'],
      riskLevel: 'High',
    },
  ];

  const faqs = [
    {
      question: 'What is the minimum investment amount?',
      answer: 'Minimum investment varies by strategy and jurisdiction, typically starting from $100,000 for comprehensive portfolio management services.',
    },
    {
      question: 'How do you ensure investment compliance across jurisdictions?',
      answer: 'We work with qualified investment advisors in each jurisdiction and ensure all investments comply with local regulations and international standards.',
    },
    {
      question: 'What are your investment management fees?',
      answer: 'Fees are typically 1-2% annually for portfolio management, with performance fees for alternative investments. We provide transparent fee structures for all services.',
    },
    {
      question: 'Can you help with cryptocurrency investments?',
      answer: 'Yes, we provide cryptocurrency investment strategies and compliance guidance, including tax optimization and regulatory compliance across jurisdictions.',
    },
    {
      question: 'How often do you review and rebalance portfolios?',
      answer: 'We conduct quarterly reviews and rebalancing, with more frequent monitoring for volatile markets. Emergency rebalancing is available when market conditions warrant.',
    },
    {
      question: 'Do you provide ESG investment options?',
      answer: 'Yes, we offer comprehensive ESG (Environmental, Social, Governance) investment strategies that align with your values while maintaining strong returns.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Investment Advisory Services - Professional Wealth Management - Consulting19</title>
        <meta name="description" content="Professional investment advisory and wealth management services. Expert guidance for portfolio management, alternative investments, and global strategies." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/services">
              <Button variant="outline" icon={ArrowLeft} iconPosition="left">
                Back to Services
              </Button>
            </Link>
          </div>
          
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Investment Advisory Services
            </h1>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              Professional investment and wealth management services for international clients. 
              Expert guidance for portfolio optimization and alternative investment strategies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Investment Advisor
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Portfolio Review
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Investment Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Investment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {investmentTypes.map((type, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <type.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{type.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{type.description}</p>
                  
                  <div className="space-y-1 mb-4">
                    {type.features.map((feature, i) => (
                      <div key={i} className="text-xs text-gray-700 flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <strong>Risk Level:</strong> {type.riskLevel}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Advisory Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* What's Included */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <Card.Body>
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center group-open:bg-emerald-600 transition-colors">
                        <span className="text-emerald-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
                      </div>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Investments?</h2>
              <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
                Start building wealth with professional investment advisory services and expert portfolio management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Investment Planning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join for Investment Assessment
                </Button>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default InvestmentAdvisoryPage;