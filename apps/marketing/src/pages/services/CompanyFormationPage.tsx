import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Building2, Globe, MessageSquare, Calendar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CompanyFormationPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Complete business registration and incorporation',
    'Government filing and documentation',
    'Corporate structure optimization',
    'Registered agent services',
    'Business license guidance',
    'Ongoing compliance support',
    'Annual reporting assistance',
    'Legal entity maintenance',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Business Structure Consultation',
      description: 'Analyze your business needs and recommend optimal corporate structure',
      duration: '1-2 days',
    },
    {
      step: 2,
      title: 'Jurisdiction Selection',
      description: 'Choose the best jurisdiction based on your business goals',
      duration: '1 day',
    },
    {
      step: 3,
      title: 'Document Preparation',
      description: 'Prepare all necessary incorporation documents and applications',
      duration: '2-3 days',
    },
    {
      step: 4,
      title: 'Government Filing',
      description: 'Submit applications to relevant government authorities',
      duration: '1-5 days',
    },
    {
      step: 5,
      title: 'Corporate Setup',
      description: 'Complete corporate setup including bylaws and resolutions',
      duration: '1-2 days',
    },
    {
      step: 6,
      title: 'Final Documentation',
      description: 'Deliver all certificates and corporate documentation',
      duration: '1 day',
    },
  ];

  const jurisdictionOptions = [
    {
      country: 'Georgia',
      flag: '🇬🇪',
      type: 'LLC',
      taxRate: '1%',
      timeframe: '1-2 days',
      minCapital: 'No minimum',
      features: ['Small Business Status', 'EU Association', 'Fast Setup'],
    },
    {
      country: 'Estonia',
      flag: '🇪🇪',
      type: 'OÜ',
      taxRate: '20%',
      timeframe: '1-3 days',
      minCapital: '€2,500',
      features: ['EU Member', 'e-Residency', 'Digital First'],
    },
    {
      country: 'UAE',
      flag: '🇦🇪',
      type: 'LLC',
      taxRate: '0%',
      timeframe: '3-5 days',
      minCapital: 'Varies',
      features: ['Free Zones', 'No Corporate Tax', 'Strategic Location'],
    },
    {
      country: 'Malta',
      flag: '🇲🇹',
      type: 'Ltd',
      taxRate: '5%',
      timeframe: '2-4 days',
      minCapital: '€1,164',
      features: ['EU Member', 'Gaming Hub', 'Crypto Friendly'],
    },
  ];

  const faqs = [
    {
      question: 'What type of business entity should I choose?',
      answer: 'The choice depends on your business goals, tax objectives, and operational needs. LLCs offer flexibility and tax benefits, while corporations provide structure for growth and investment.',
    },
    {
      question: 'How long does company formation take?',
      answer: 'Formation time varies by jurisdiction, typically ranging from 1 day (Georgia) to 2-3 weeks (complex structures). We provide accurate timelines for each jurisdiction.',
    },
    {
      question: 'What documents do I need to provide?',
      answer: 'Generally, you need passport copies, proof of address, business plan, and proposed company details. Specific requirements vary by jurisdiction.',
    },
    {
      question: 'Can I form a company without visiting the country?',
      answer: 'Yes, most jurisdictions allow remote company formation. We handle the entire process remotely with proper documentation and legal representation.',
    },
    {
      question: 'What ongoing obligations will my company have?',
      answer: 'Obligations include annual filings, tax returns, maintaining registered address, and compliance with local regulations. We provide ongoing support for all requirements.',
    },
    {
      question: 'How much does company formation cost?',
      answer: 'Costs vary by jurisdiction and entity type, typically ranging from $500-5000. This includes government fees, legal fees, and our professional services.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Company Formation Services - Professional Business Setup Worldwide - Consulting19</title>
        <meta name="description" content="Professional company formation services in 19+ countries. Expert guidance for LLC, corporation, and international business entity setup." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
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
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Company Formation Services
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Professional business setup and incorporation services worldwide. Expert guidance 
              for optimal corporate structure and jurisdiction selection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Specialist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Service Overview */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Overview</h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="mb-4">
                  Our company formation services provide comprehensive business setup solutions across multiple 
                  jurisdictions, ensuring your business is properly established with optimal structure and compliance.
                </p>
                <p className="mb-4">
                  We work with you to understand your business goals, analyze jurisdictional benefits, and 
                  recommend the most suitable corporate structure for your specific needs and objectives.
                </p>
                <p>
                  From initial consultation to final documentation, our expert team handles every aspect 
                  of the formation process with professional guidance and ongoing support.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <Card.Body>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Benefits</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expert Guidance:</span>
                      <span className="font-medium text-gray-900">Included</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Jurisdictions:</span>
                      <span className="font-medium text-gray-900">19+ Countries</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-medium text-green-600">98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Ongoing Support:</span>
                      <span className="font-medium text-gray-900">6 months</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </section>

        {/* Jurisdiction Options */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Jurisdictions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jurisdictionOptions.map((jurisdiction, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="text-4xl mb-4">{jurisdiction.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{jurisdiction.country}</h3>
                  <p className="text-sm text-gray-600 mb-4">{jurisdiction.type}</p>
                  
                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex justify-between">
                      <span>Tax Rate:</span>
                      <span className="font-medium text-green-600">{jurisdiction.taxRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeframe:</span>
                      <span className="font-medium">{jurisdiction.timeframe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Capital:</span>
                      <span className="font-medium">{jurisdiction.minCapital}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    {jurisdiction.features.map((feature, i) => (
                      <div key={i} className="text-xs text-gray-700 flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
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
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Formation Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Formation Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
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
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center group-open:bg-blue-600 transition-colors">
                        <span className="text-blue-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Form Your Company?</h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Get expert guidance from our specialists and establish your business with optimal structure and compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Formation
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join for Free Consultation
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

export default CompanyFormationPage;