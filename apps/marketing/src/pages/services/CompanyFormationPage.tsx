import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Building2, Globe, MessageSquare, Calendar, Target, Zap, Bot, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CompanyFormationPage = () => {
  const { t } = useLanguage();

  const serviceHighlights = [
    {
      icon: Globe,
      title: '19+ Countries with Local Partners',
      description: 'Licensed experts in every jurisdiction we serve',
    },
    {
      icon: Bot,
      title: 'AI Assistant & Multilingual Messaging',
      description: 'Real-time translation and 24/7 AI support',
    },
    {
      icon: Zap,
      title: 'Fastest Incorporation Process',
      description: 'Average setup completed in 1-3 days',
    },
    {
      icon: Shield,
      title: 'Compliance & Ongoing Support',
      description: 'Always up-to-date legal frameworks',
    },
  ];

  const whyConsulting19 = [
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'We collaborate directly with licensed providers in every jurisdiction.',
    },
    {
      icon: Bot,
      title: 'AI Advantage',
      description: 'Communicate in any language – our AI assistant translates in real time.',
    },
    {
      icon: Zap,
      title: 'Faster Results',
      description: 'Average setup completed in 1–3 days in most countries.',
    },
    {
      icon: CheckCircle,
      title: 'Verified Accuracy',
      description: 'Always up-to-date compliance and legal frameworks. No outdated guides or guesswork.',
    },
  ];

  const popularJurisdictions = [
    {
      country: 'Georgia',
      flag: '🇬🇪',
      type: 'LLC',
      taxRate: '1%',
      timeframe: '1-2 days',
      minCapital: 'No minimum',
      link: '/countries/georgia',
    },
    {
      country: 'Estonia',
      flag: '🇪🇪',
      type: 'OÜ',
      taxRate: '20%',
      timeframe: '1-3 days',
      minCapital: '€2,500',
      link: '#',
    },
    {
      country: 'UAE',
      flag: '🇦🇪',
      type: 'LLC',
      taxRate: '0%',
      timeframe: '3-5 days',
      minCapital: 'Varies',
      link: '#',
    },
    {
      country: 'Malta',
      flag: '🇲🇹',
      type: 'Ltd',
      taxRate: '5%',
      timeframe: '2-4 days',
      minCapital: '€1,164',
      link: '#',
    },
  ];

  const servicePackage = [
    { icon: Building2, title: 'Incorporation & Registration' },
    { icon: FileText, title: 'Government Filing' },
    { icon: Target, title: 'Corporate Structure Optimization' },
    { icon: Users, title: 'Registered Agent Services' },
    { icon: Shield, title: 'Business License Guidance' },
    { icon: Clock, title: 'Annual Reporting Assistance' },
    { icon: CheckCircle, title: 'Ongoing Compliance Support' },
    { icon: Globe, title: 'Legal Entity Maintenance' },
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Business Structure Consultation',
      description: 'Analyze goals, recommend entity type',
      duration: '1-2 days',
    },
    {
      step: 2,
      title: 'Jurisdiction Selection',
      description: 'Choose best jurisdiction',
      duration: '1 day',
    },
    {
      step: 3,
      title: 'Document Preparation',
      description: 'Draft & review documents',
      duration: '2-3 days',
    },
    {
      step: 4,
      title: 'Government Filing',
      description: 'Submit applications',
      duration: '1-5 days',
    },
    {
      step: 5,
      title: 'Corporate Setup',
      description: 'Complete bylaws, resolutions, bank setup',
      duration: '1-2 days',
    },
    {
      step: 6,
      title: 'Final Documentation',
      description: 'Deliver certificates & official docs',
      duration: '1 day',
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
        <title>Incorporate Your Company with AI-Powered Precision - Consulting19</title>
        <meta name="description" content="The only global consulting platform combining licensed local partners in 19+ countries with AI-powered multilingual communication and instant support." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white py-24 mt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-teal-400/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/services">
              <Button variant="outline" icon={ArrowLeft} iconPosition="left" className="border-white/80 text-white hover:bg-white/20 hover:border-white">
                Back to Services
              </Button>
            </Link>
          </div>
          
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Incorporate Your Company with
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                AI-Powered Precision
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-4xl mx-auto">
              The only global consulting platform combining licensed local partners in 19+ countries 
              with AI-powered multilingual communication and instant support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-5 text-lg shadow-2xl border-0"
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Start Formation Now
              </Button>
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-5 text-lg"
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Free Consultation with AI Assistant
              </Button>
            </div>

            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 shadow-lg border border-white/30">
              <CheckCircle className="w-5 h-5 text-green-300 mr-2" />
              <span className="text-white font-medium">98% Success Rate</span>
              <span className="mx-3 text-white/60">•</span>
              <Users className="w-5 h-5 text-blue-300 mr-2" />
              <span className="text-white font-medium">Local Experts</span>
              <span className="mx-3 text-white/60">•</span>
              <Bot className="w-5 h-5 text-purple-300 mr-2" />
              <span className="text-white font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Highlights */}
        <section className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((highlight, index) => (
              <Card key={index} hover className="text-center border-2 border-gray-100 hover:border-blue-200 transition-all duration-300">
                <Card.Body className="py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <highlight.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{highlight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Consulting19? */}
        <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl mb-16">
          <div className="max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose <span className="text-blue-600">Consulting19</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The future of international business consulting is here
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {whyConsulting19.map((reason, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <reason.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{reason.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Communication Visual */}
            <div className="mt-12 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI-Powered Multilingual Communication</h3>
                <p className="text-gray-600">Break language barriers with real-time AI translation</p>
              </div>
              
              <div className="flex items-center justify-center space-x-8">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="text-sm text-blue-800 mb-2">🇺🇸 Client (English)</div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm">"I need help with company formation"</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2 animate-pulse">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-gray-500">AI Translation</span>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="text-sm text-green-800 mb-2">🇹🇷 Expert (Turkish)</div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-sm">"Şirket kuruluşunda yardım edebilirim"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Jurisdictions */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Jurisdictions</h2>
            <p className="text-lg text-gray-600">Choose from our most requested business-friendly locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {popularJurisdictions.map((jurisdiction, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="text-4xl mb-4">{jurisdiction.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{jurisdiction.country}</h3>
                  <p className="text-sm text-gray-600 mb-4">{jurisdiction.type}</p>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (jurisdiction.link !== '#') {
                        window.location.href = jurisdiction.link;
                      }
                    }}
                  >
                    {jurisdiction.link !== '#' ? 'Learn More' : 'Coming Soon'}
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => window.open('/countries', '_blank')}
            >
              +15 More Countries → Explore All Jurisdictions
            </Button>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Included</h2>
            <p className="text-lg text-gray-600">Complete service package for hassle-free incorporation</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {servicePackage.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <Card.Body className="py-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed">{service.title}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Formation Process */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Formation Process</h2>
            <p className="text-lg text-gray-600">Step-by-step timeline for your company formation</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full hidden lg:block"></div>
            
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:space-x-8`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} text-center lg:mb-0 mb-4`}>
                    <Card className="inline-block">
                      <Card.Body className="py-6 px-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 mb-3">{step.description}</p>
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{step.duration}</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className="relative z-10 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.step}
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Get answers to common questions about company formation</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <Card.Body>
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none py-2">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-open:bg-blue-600 transition-all duration-300">
                        <span className="text-blue-600 group-open:text-white text-xl font-bold group-open:rotate-45 transition-all duration-300">+</span>
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

        {/* Final CTA */}
        <section className="py-16">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl text-white p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-4 right-4 w-40 h-40 bg-yellow-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
            </div>
            
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to Form Your Company?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                Get expert guidance and establish your business with optimal structure and compliance – 
                powered by AI and local expertise.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-10 py-4 text-lg shadow-xl border-0"
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Formation
                </Button>
                <Button 
                  size="lg" 
                  className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30 font-semibold px-10 py-4 text-lg"
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join for Free Consultation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CompanyFormationPage;
