import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Lock, Globe, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AssetProtectionPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Comprehensive asset protection strategy',
    'Trust and foundation establishment',
    'Offshore structure optimization',
    'Risk mitigation planning',
    'Estate planning coordination',
    'Insurance strategy development',
    'Privacy protection measures',
    'Ongoing asset monitoring',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Asset & Risk Assessment',
      description: 'Comprehensive evaluation of your assets and potential risks',
      duration: '3-5 days',
    },
    {
      step: 2,
      title: 'Protection Strategy Design',
      description: 'Develop customized asset protection strategy',
      duration: '1 week',
    },
    {
      step: 3,
      title: 'Structure Implementation',
      description: 'Establish trusts, foundations, or other protective structures',
      duration: '2-4 weeks',
    },
    {
      step: 4,
      title: 'Asset Transfer Planning',
      description: 'Plan and execute asset transfers to protective structures',
      duration: '1-2 weeks',
    },
    {
      step: 5,
      title: 'Documentation & Compliance',
      description: 'Complete all documentation and establish compliance procedures',
      duration: '1 week',
    },
    {
      step: 6,
      title: 'Ongoing Management',
      description: 'Continuous monitoring and management of protective structures',
      duration: 'Ongoing',
    },
  ];

  const protectionStrategies = [
    {
      title: 'Offshore Trusts',
      description: 'Establish trusts in protective jurisdictions',
      icon: Shield,
      benefits: ['Asset separation', 'Creditor protection', 'Privacy', 'Estate planning'],
      jurisdictions: ['Cook Islands', 'Nevis', 'Belize', 'Cayman Islands'],
    },
    {
      title: 'Private Foundations',
      description: 'Create foundations for wealth preservation',
      icon: Lock,
      benefits: ['Perpetual existence', 'Flexible governance', 'Tax efficiency', 'Succession planning'],
      jurisdictions: ['Panama', 'Liechtenstein', 'Malta', 'Netherlands'],
    },
    {
      title: 'Holding Companies',
      description: 'Structure assets through holding companies',
      icon: TrendingUp,
      benefits: ['Limited liability', 'Tax optimization', 'Operational flexibility', 'Investment protection'],
      jurisdictions: ['Luxembourg', 'Netherlands', 'Malta', 'Cyprus'],
    },
    {
      title: 'Insurance Solutions',
      description: 'Comprehensive insurance and risk coverage',
      icon: Users,
      benefits: ['Risk transfer', 'Liquidity protection', 'Tax advantages', 'Estate benefits'],
      jurisdictions: ['Switzerland', 'Liechtenstein', 'Luxembourg', 'Ireland'],
    },
  ];

  const faqs = [
    {
      question: 'Is asset protection legal?',
      answer: 'Yes, asset protection through proper legal structures is completely legal when done proactively and in compliance with all applicable laws and regulations.',
    },
    {
      question: 'When should I consider asset protection?',
      answer: 'Asset protection should be implemented before you need it. The best time is when your business is successful and growing, before any potential threats arise.',
    },
    {
      question: 'What assets can be protected?',
      answer: 'Most assets can be protected including real estate, business interests, investments, intellectual property, and liquid assets through appropriate structures.',
    },
    {
      question: 'How much does asset protection cost?',
      answer: 'Costs vary based on complexity and jurisdiction, typically ranging from $10,000-50,000 for initial setup, with ongoing maintenance costs of $2,000-10,000 annually.',
    },
    {
      question: 'Will asset protection affect my taxes?',
      answer: 'Asset protection structures can be designed to be tax-neutral or provide tax benefits, depending on your situation and objectives. We ensure tax compliance in all strategies.',
    },
    {
      question: 'How long does asset protection setup take?',
      answer: 'Setup typically takes 4-8 weeks depending on the complexity of structures and jurisdictions involved. Simple trusts can be faster, while complex structures take longer.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Asset Protection Services - Wealth Protection Strategies - Consulting19</title>
        <meta name="description" content="Professional asset protection services and wealth preservation strategies. Expert guidance for trusts, foundations, and offshore structures." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-14 mt-16">
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
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Asset Protection Services
            </h1>
            <p className="text-lg text-indigo-100 mb-6 leading-relaxed">
              Comprehensive wealth protection and asset security strategies. 
              Safeguard your assets with expert guidance and proven protective structures.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Protection Specialist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Asset Review
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Protection Strategies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Protection Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {protectionStrategies.map((strategy, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <strategy.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{strategy.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{strategy.description}</p>
                  
                  <div className="space-y-1 mb-4">
                    {strategy.benefits.map((benefit, i) => (
                      <div key={i} className="text-xs text-gray-700 flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <strong>Available in:</strong> {strategy.jurisdictions.join(', ')}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Protection Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
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
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center group-open:bg-indigo-600 transition-colors">
                        <span className="text-indigo-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Protect Your Assets?</h2>
              <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
                Secure your wealth with professional asset protection strategies and expert guidance from qualified specialists.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Asset Protection
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join for Protection Assessment
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

export default AssetProtectionPage;