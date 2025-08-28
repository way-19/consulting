import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, Globe, CheckCircle, Users, Clock, Shield, Zap, CreditCard, FileText, Target, Bot, TrendingUp, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useState } from 'react';

const CompanyFormationPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const processSteps = [
    {
      title: 'Choose Your Jurisdiction',
      description: 'AI-powered analysis recommends the best country for your business goals',
      icon: Globe,
      step: 1,
    },
    {
      title: 'Free Expert Consultation',
      description: 'Connect with local specialists for personalized guidance and planning',
      icon: Users,
      step: 2,
    },
    {
      title: 'Fast Company Setup',
      description: 'Complete incorporation with all legal documents and registrations',
      icon: Building2,
      step: 3,
    },
    {
      title: 'Banking & Operations',
      description: 'Open business accounts and establish operational infrastructure',
      icon: CreditCard,
      step: 4,
    },
  ];

  const services = [
    {
      title: 'LLC & Corporation Formation',
      description: 'Limited liability companies and corporations with flexible structures',
    },
    {
      title: 'Offshore Company Registration',
      description: 'International business companies in tax-efficient offshore jurisdictions',
    },
    {
      title: 'Jurisdiction Analysis',
      description: 'AI-powered analysis to select optimal jurisdiction for your business',
    },
    {
      title: 'Digital Identity & e-Residency',
      description: 'Estonia e-Residency and digital business identity programs',
    },
    {
      title: 'Banking & Payment Solutions',
      description: 'Corporate banking setup and international payment processing',
    },
    {
      title: 'Holding Company Structures',
      description: 'Multi-tier holding structures for asset protection and tax optimization',
    },
    {
      title: 'Compliance Monitoring',
      description: 'Ongoing compliance tracking and regulatory requirement management',
    },
    {
      title: 'AI-Assistant Integration',
      description: 'Smart document tracking and automated compliance deadline alerts',
    },
  ];

  const featuredCountries = [
    {
      name: 'UAE',
      flag: '🇦🇪',
      taxRate: '0%',
      setupTime: '7-14 days',
      compliance: 'Annual license renewal',
      highlight: 'Free zone companies with 0% corporate tax for 50 years',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      taxRate: '0%*',
      setupTime: '1-2 weeks',
      compliance: 'Annual report filing',
      highlight: '100% online e-Residency program with EU access',
    },
    {
      name: 'Delaware',
      flag: '🇺🇸',
      taxRate: 'No state tax',
      setupTime: '3-5 days',
      compliance: 'Annual franchise tax',
      highlight: 'World\'s leading corporate jurisdiction with strong legal framework',
    },
    {
      name: 'Singapore',
      flag: '🇸🇬',
      taxRate: '17%',
      setupTime: '2-3 weeks',
      compliance: 'Annual filing & AGM',
      highlight: 'Gateway to Asian markets with excellent business infrastructure',
    },
    {
      name: 'Georgia',
      flag: '🇬🇪',
      taxRate: '1%',
      setupTime: '3-5 days',
      compliance: 'Monthly tax filing',
      highlight: 'Small business status with 1% tax on turnover',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      taxRate: '5%',
      setupTime: '2-3 weeks',
      compliance: 'Annual returns',
      highlight: 'EU membership with 5% effective corporate tax rate',
    },
  ];

  const whyChooseUs = [
    {
      icon: Globe,
      title: 'Global + Local Expertise',
      description: 'Local specialists in 19+ countries combined with AI-powered global insights',
    },
    {
      icon: TrendingUp,
      title: '500+ Successful Setups',
      description: '98% success rate with over 500 companies formed across multiple jurisdictions',
    },
    {
      icon: Bot,
      title: 'AI-Powered Automation',
      description: 'Smart document tracking, compliance deadlines, and automated progress updates',
    },
    {
      icon: Target,
      title: 'Transparent & Cost-Effective',
      description: 'Clear pricing with no hidden fees and competitive rates for premium services',
    },
  ];

  const faqs = [
    {
      id: 'offshore-legal',
      question: 'Is offshore company formation legal?',
      answer: 'Yes, offshore company formation is completely legal when done for legitimate business purposes. Many multinational corporations use offshore structures for tax optimization, asset protection, and international expansion. We ensure all formations comply with international regulations and reporting requirements.',
    },
    {
      id: 'annual-reporting',
      question: 'What are the annual reporting requirements?',
      answer: 'Annual reporting varies by jurisdiction. Most countries require annual financial statements, tax returns, and corporate registry updates. Our compliance monitoring service tracks all deadlines and ensures timely submissions to maintain good standing.',
    },
    {
      id: 'banking-options',
      question: 'What banking options are available?',
      answer: 'We provide access to corporate banking in major financial centers including UAE, Singapore, Estonia, and Switzerland. Options include traditional banks, digital banking solutions, and multi-currency accounts. Banking requirements vary by jurisdiction and business activity.',
    },
    {
      id: 'formation-costs',
      question: 'What are the total costs for company formation?',
      answer: 'Costs vary by jurisdiction and services required. Basic formations start from $1,500 (Georgia) to $5,000+ (UAE/Singapore) including government fees, legal documentation, and our service fees. We provide transparent pricing with no hidden costs.',
    },
    {
      id: 'timeline',
      question: 'How long does the entire process take?',
      answer: 'Timeline depends on jurisdiction and complexity. Fast jurisdictions like Estonia (1-2 weeks) and Georgia (3-5 days) are quickest. More complex setups in UAE or Singapore typically take 2-6 weeks including banking. We provide real-time progress tracking.',
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 overflow-hidden">
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
                Seamless Global Company Formation – From Idea to Incorporation
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Establish your business in 19+ countries with local expert guidance and AI-powered process automation. Fast company registration with complete legal compliance and banking solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                  Get Free Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  View Formation Options
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Global company formation services"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Company Formation Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end business setup solutions with AI-powered jurisdiction analysis and local expert support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg group">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-6 h-56 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">
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

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Consulting19 for Company Formation?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining global expertise with local knowledge and AI automation for seamless business setup
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Our Global Company Formation Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 4-step process from jurisdiction selection to operational business setup
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 z-0"></div>
                )}
                
                <Card hover className="text-center h-full relative z-10">
                  <Card.Body>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Countries */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Jurisdictions for Fast Company Registration</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare setup times, tax advantages, and compliance requirements across business-friendly countries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCountries.map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {country.name}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm text-green-700 font-medium">Corporate Tax</div>
                      <div className="text-lg font-bold text-green-900">{country.taxRate}</div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm text-blue-700 font-medium">Setup Time</div>
                      <div className="text-lg font-bold text-blue-900">{country.setupTime}</div>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="text-sm text-orange-700 font-medium">Annual Compliance</div>
                      <div className="text-sm font-bold text-orange-900">{country.compliance}</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-xs text-gray-700">{country.highlight}</p>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Start Formation
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Common questions about offshore incorporation and global business setup
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <Card.Body>
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left flex justify-between items-center"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Ready to Form Your Global Company?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Start your business formation journey with our 3-step simple process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Step 1: Choose Country</h3>
              <p className="text-blue-100">AI analyzes your needs and recommends optimal jurisdiction</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Step 2: Free Consultation</h3>
              <p className="text-blue-100">Connect with local specialists for personalized guidance</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Step 3: 14-Day Setup</h3>
              <p className="text-blue-100">Complete incorporation with banking and compliance setup</p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Company Formation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Schedule Free Consultation
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span>98% Success Rate</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>500+ Companies Formed</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-300 mr-2" />
                <span>14-Day Average Setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyFormationPage;