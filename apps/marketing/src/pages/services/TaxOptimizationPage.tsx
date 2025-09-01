import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Calculator, Globe, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const TaxOptimizationPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'International tax planning and strategy',
    'Double tax treaty optimization',
    'Tax residency planning and setup',
    'Transfer pricing compliance',
    'Annual tax compliance management',
    'Tax-efficient structure design',
    'Cross-border transaction planning',
    'Ongoing tax advisory services',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Tax Situation Analysis',
      description: 'Comprehensive review of your current tax situation and obligations',
      duration: '2-3 days',
    },
    {
      step: 2,
      title: 'Strategy Development',
      description: 'Develop customized tax optimization strategy based on your goals',
      duration: '3-5 days',
    },
    {
      step: 3,
      title: 'Structure Implementation',
      description: 'Implement recommended tax-efficient structures and entities',
      duration: '1-2 weeks',
    },
    {
      step: 4,
      title: 'Compliance Setup',
      description: 'Establish ongoing compliance procedures and reporting systems',
      duration: '1 week',
    },
    {
      step: 5,
      title: 'Documentation & Training',
      description: 'Provide documentation and train your team on new procedures',
      duration: '2-3 days',
    },
    {
      step: 6,
      title: 'Ongoing Monitoring',
      description: 'Continuous monitoring and optimization of tax strategies',
      duration: 'Ongoing',
    },
  ];

  const taxStrategies = [
    {
      title: 'Territorial Tax Systems',
      description: 'Benefit from countries that only tax local income',
      icon: Globe,
      examples: ['Georgia', 'Malaysia', 'Singapore'],
    },
    {
      title: 'Double Tax Treaties',
      description: 'Optimize using extensive treaty networks',
      icon: Shield,
      examples: ['Netherlands', 'Malta', 'Cyprus'],
    },
    {
      title: 'Low Tax Jurisdictions',
      description: 'Establish presence in low-tax environments',
      icon: DollarSign,
      examples: ['UAE', 'Estonia', 'Ireland'],
    },
    {
      title: 'Holding Structures',
      description: 'Create tax-efficient holding company structures',
      icon: TrendingUp,
      examples: ['Luxembourg', 'Netherlands', 'Malta'],
    },
  ];

  const faqs = [
    {
      question: 'Is tax optimization legal?',
      answer: 'Yes, tax optimization through proper planning and legal structures is completely legal. We ensure all strategies comply with international tax laws and regulations.',
    },
    {
      question: 'How much can I save with tax optimization?',
      answer: 'Savings vary based on your situation, but clients typically save 20-60% on their global tax burden through proper planning and structure optimization.',
    },
    {
      question: 'What is the difference between tax avoidance and tax evasion?',
      answer: 'Tax avoidance is legal planning to minimize taxes, while tax evasion is illegal. We only provide legal tax optimization strategies that comply with all regulations.',
    },
    {
      question: 'Do I need to change my business location for tax benefits?',
      answer: 'Not necessarily. Many tax benefits can be achieved through proper structuring without relocating your operations, depending on your business model.',
    },
    {
      question: 'How do double tax treaties work?',
      answer: 'Double tax treaties prevent the same income from being taxed in multiple countries. We help you leverage these treaties to minimize your overall tax burden.',
    },
    {
      question: 'What ongoing obligations come with tax optimization?',
      answer: 'Ongoing obligations include proper documentation, compliance reporting, and maintaining substance requirements. We provide full support for all obligations.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Tax Optimization Services - International Tax Planning - Consulting19</title>
        <meta name="description" content="Professional tax optimization and international tax planning services. Legal strategies to minimize global tax burden with expert guidance." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-14 mt-16">
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
                <Calculator className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Tax Optimization Services
            </h1>
            <p className="text-lg text-green-100 mb-6 leading-relaxed">
              Strategic international tax planning to legally minimize your global tax burden. 
              Expert guidance for optimal tax-efficient structures and compliance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Tax Specialist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Tax Review
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tax Strategies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Tax Optimization Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {taxStrategies.map((strategy, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <strategy.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{strategy.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{strategy.description}</p>
                  <div className="text-xs text-gray-500">
                    <strong>Examples:</strong> {strategy.examples.join(', ')}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Optimization Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
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
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center group-open:bg-green-600 transition-colors">
                        <span className="text-green-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Taxes?</h2>
              <p className="text-green-100 mb-8 max-w-2xl mx-auto">
                Start saving on your global tax burden with our expert tax optimization strategies and professional guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Tax Planning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join for Free Tax Assessment
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

export default TaxOptimizationPage;