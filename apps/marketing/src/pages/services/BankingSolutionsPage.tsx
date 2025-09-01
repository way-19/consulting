import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, CreditCard, Globe, MessageSquare, Calendar, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const BankingSolutionsPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Corporate bank account opening assistance',
    'Multi-currency account setup',
    'International wire transfer solutions',
    'Payment gateway integration',
    'Banking relationship management',
    'Trade finance facilitation',
    'Online banking platform setup',
    'Ongoing banking support',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Banking Needs Assessment',
      description: 'Analyze your banking requirements and business model',
      duration: '1 day',
    },
    {
      step: 2,
      title: 'Bank Selection & Strategy',
      description: 'Recommend optimal banks based on your needs and jurisdiction',
      duration: '1-2 days',
    },
    {
      step: 3,
      title: 'Documentation Preparation',
      description: 'Prepare all required documents for account opening',
      duration: '2-3 days',
    },
    {
      step: 4,
      title: 'Bank Application Process',
      description: 'Submit applications and coordinate with bank officials',
      duration: '1-2 days',
    },
    {
      step: 5,
      title: 'Account Activation',
      description: 'Complete account opening and activate banking services',
      duration: '3-10 days',
    },
    {
      step: 6,
      title: 'Banking Setup Completion',
      description: 'Configure online banking and payment systems',
      duration: '1-2 days',
    },
  ];

  const bankingOptions = [
    {
      title: 'Traditional Banking',
      description: 'Established banks with full service offerings',
      icon: Building,
      features: ['Physical branches', 'Relationship managers', 'Full service range', 'Regulatory compliance'],
      jurisdictions: ['UAE', 'Singapore', 'Switzerland', 'Malta'],
    },
    {
      title: 'Digital Banking',
      description: 'Modern digital-first banking solutions',
      icon: CreditCard,
      features: ['Online account opening', 'Mobile banking', 'API integration', 'Lower fees'],
      jurisdictions: ['Estonia', 'Lithuania', 'Germany', 'UK'],
    },
    {
      title: 'Private Banking',
      description: 'Premium banking for high-net-worth clients',
      icon: Shield,
      features: ['Dedicated managers', 'Investment services', 'Wealth management', 'Exclusive benefits'],
      jurisdictions: ['Switzerland', 'Monaco', 'Luxembourg', 'Liechtenstein'],
    },
    {
      title: 'Offshore Banking',
      description: 'International banking with privacy benefits',
      icon: Globe,
      features: ['Multi-currency accounts', 'International access', 'Privacy protection', 'Tax efficiency'],
      jurisdictions: ['Cayman Islands', 'BVI', 'Panama', 'Seychelles'],
    },
  ];

  const faqs = [
    {
      question: 'Which countries offer the best banking for international businesses?',
      answer: 'Singapore, UAE, Switzerland, and Estonia are among the top choices for international banking, each offering unique advantages like stability, digital services, or tax benefits.',
    },
    {
      question: 'Can I open a bank account remotely?',
      answer: 'Some banks offer remote account opening, especially digital banks in Estonia and Lithuania. However, many traditional banks still require physical presence or video calls.',
    },
    {
      question: 'What documents are typically required for corporate banking?',
      answer: 'Standard requirements include company registration certificate, articles of incorporation, director passports, proof of address, business plan, and source of funds documentation.',
    },
    {
      question: 'How long does corporate account opening take?',
      answer: 'The process typically takes 1-4 weeks depending on the bank, jurisdiction, and complexity of your business. Digital banks are generally faster than traditional banks.',
    },
    {
      question: 'What are typical banking fees for international accounts?',
      answer: 'Fees vary significantly by bank and jurisdiction. We help you compare options and negotiate favorable terms based on your expected transaction volume and account balance.',
    },
    {
      question: 'Do I need a local address to open a corporate account?',
      answer: 'Most banks require a registered address in their jurisdiction, but this can often be a virtual office or registered agent address rather than a physical office.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Banking Solutions - International Corporate Banking - Consulting19</title>
        <meta name="description" content="Professional banking solutions for international businesses. Corporate account opening, multi-currency accounts, and global banking relationships." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 mt-16">
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
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Banking Solutions
            </h1>
            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
              Global banking access and financial services for international businesses. 
              Expert assistance with account opening and banking relationship management.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Banking Specialist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Banking Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Banking Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Banking Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bankingOptions.map((option, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <option.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{option.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{option.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {option.features.map((feature, i) => (
                      <div key={i} className="text-xs text-gray-700 flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <strong>Available in:</strong> {option.jurisdictions.join(', ')}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Service Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Banking Setup Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
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
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-purple-600" />
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
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center group-open:bg-purple-600 transition-colors">
                        <span className="text-purple-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Open Your International Bank Account?</h2>
              <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
                Get professional assistance with international banking setup and establish strong financial foundations for your global business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Banking Setup
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join for Banking Consultation
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

export default BankingSolutionsPage;