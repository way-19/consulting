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
      description: 'Select the country that best fits your goals with expert recommendations and AI-powered jurisdiction analysis',
      icon: Globe,
      step: 1,
    },
    {
      title: 'Free Expert Consultation',
      description: 'Discuss your needs with our advisors for personalized guidance and strategic business planning',
      icon: Users,
      step: 2,
    },
    {
      title: 'Fast Company Setup',
      description: 'Complete incorporation in as little as 14 days with AI-supported compliance and legal documentation',
      icon: Building2,
      step: 3,
    },
    {
      title: 'Banking & Operations',
      description: 'Open bank accounts and enable operations with integrated financial solutions and payment processing',
      icon: CreditCard,
      step: 4,
    },
  ];

  const services = [
    {
      title: 'LLC & Corporation Formation',
      description: 'Professional LLC and corporation formation services across multiple jurisdictions. We handle all legal documentation, regulatory filings, and compliance requirements to establish your business entity with complete liability protection. Our streamlined process ensures fast company registration while maintaining full legal compliance in your chosen jurisdiction.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Offshore Company Registration',
      description: 'Strategic offshore incorporation in business-friendly jurisdictions with favorable tax structures. Our offshore setup services include complete legal documentation, regulatory compliance, and ongoing support. We specialize in tax-efficient offshore jurisdictions that provide asset protection, privacy benefits, and international business advantages for global entrepreneurs.',
      image: 'https://images.pexels.com/photos/1769606/pexels-photo-1769606.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Jurisdiction Analysis',
      description: 'Advanced AI-powered jurisdiction analysis that evaluates tax implications, regulatory requirements, and business advantages across 19+ countries. Our intelligent system considers your business model, target markets, and growth objectives to recommend the optimal jurisdiction for fast company registration and long-term success.',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Digital Identity & e-Residency',
      description: 'Complete digital identity solutions including Estonia e-Residency program for 100% online business management. Access EU markets through digital business identity programs that enable remote company formation, digital banking, and online compliance services. Perfect for digital nomads and international entrepreneurs seeking EU market access.',
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Banking & Payment Solutions',
      description: 'Comprehensive corporate banking solutions including business account opening, multi-currency accounts, and international payment processing setup. We facilitate banking relationships with premier financial institutions worldwide, ensuring your newly formed company has immediate access to essential financial services and global payment capabilities.',
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Holding Company Structures',
      description: 'Sophisticated holding company structures designed for asset protection, tax optimization, and international business expansion. Our compliance services include multi-tier corporate structures that provide enhanced privacy, reduced tax liability, and operational flexibility for complex international business operations and investment activities.',
      image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'Compliance Monitoring',
      description: 'Automated compliance monitoring services that track regulatory deadlines, filing requirements, and ongoing obligations across all jurisdictions. Our AI-powered system ensures your company maintains good standing with timely submissions, regulatory updates, and proactive compliance management to avoid penalties and maintain business continuity.',
      image: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      title: 'AI-Assistant Integration',
      description: 'Intelligent AI assistant integration for automated document management, compliance deadline tracking, and real-time business guidance. Our smart automation handles routine administrative tasks, provides regulatory updates, and offers 24/7 support for ongoing business operations and compliance requirements.',
      image: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const featuredCountries = [
    {
      name: 'UAE',
      flag: '🇦🇪',
      taxRate: '0%',
      setupTime: '7-14 days',
      compliance: 'Annual license renewal',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      taxRate: '0%*',
      setupTime: '1-2 weeks',
      compliance: 'Annual report filing',
    },
    {
      name: 'United States',
      flag: '🇺🇸',
      taxRate: 'No state tax',
      setupTime: '3-5 days',
      compliance: 'Annual franchise tax',
    },
    {
      name: 'Georgia',
      flag: '🇬🇪',
      taxRate: '1%',
      setupTime: '3-5 days',
      compliance: 'Monthly tax filing',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      taxRate: '5%',
      setupTime: '2-3 weeks',
      compliance: 'Annual returns',
    },
    {
      name: 'Panama',
      flag: '🇵🇦',
      taxRate: '25%',
      setupTime: '2-4 weeks',
      compliance: 'Annual returns',
    },
    {
      name: 'Portugal',
      flag: '🇵🇹',
      taxRate: '21%',
      setupTime: '3-6 weeks',
      compliance: 'Annual filing',
    },
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      taxRate: '11-24%',
      setupTime: '2-4 weeks',
      compliance: 'Annual filing',
    },
    {
      name: 'Montenegro',
      flag: '🇲🇪',
      taxRate: '9%',
      setupTime: '2-3 weeks',
      compliance: 'Annual returns',
    },
  ];

  const whyChooseUs = [
    {
      icon: Globe,
      title: 'Global + Local Expertise',
      description: 'Local specialists in 19+ countries combined with AI-powered global insights. Our clients benefit from jurisdiction-specific knowledge and automated workflows that streamline the entire company formation process.',
    },
    {
      icon: TrendingUp,
      title: '500+ Successful Setups',
      description: '98% success rate with over 500 companies formed across multiple jurisdictions. Our proven track record demonstrates consistent delivery of fast company registration with complete legal compliance and banking integration.',
    },
    {
      icon: Bot,
      title: 'AI-Powered Automation',
      description: 'Smart document tracking, compliance deadlines, and automated progress updates. Our clients save time and money with automated document workflows and jurisdiction-specific insights that eliminate manual processes and reduce formation timelines.',
    },
    {
      icon: Target,
      title: 'Transparent & Cost-Effective',
      description: 'Clear pricing with no hidden fees and competitive rates for premium services. Our transparent fee structure and efficient processes deliver exceptional value for global business setup and offshore incorporation services.',
    },
  ];

  const faqs = [
    {
      id: 'offshore-legal',
      question: 'Is offshore company formation legal?',
      answer: 'Yes, offshore incorporation is fully legal when structured within international compliance standards. Consulting19 ensures your setup follows jurisdiction-specific laws while offering global banking access. Many multinational corporations use offshore structures for tax optimization, asset protection, and international expansion through legitimate business purposes and proper regulatory compliance.',
    },
    {
      id: 'annual-reporting',
      question: 'What are the annual reporting requirements?',
      answer: 'Annual reporting requirements vary significantly by jurisdiction and business structure. Most countries require annual financial statements, tax returns, and corporate registry updates to maintain good standing. Our automated compliance monitoring service tracks all regulatory deadlines and ensures timely submissions. We provide ongoing support for all compliance services including filing requirements, regulatory updates, and deadline management.',
    },
    {
      id: 'banking-options',
      question: 'What banking options are available?',
      answer: 'We provide access to corporate banking in major financial centers including UAE, Estonia, Switzerland, and other business-friendly jurisdictions. Banking options include traditional banks, digital banking solutions, and multi-currency accounts with international payment processing. Our banking specialists facilitate account opening procedures and ensure your company formation includes complete financial infrastructure setup.',
    },
    {
      id: 'formation-costs',
      question: 'What are the total costs for company formation?',
      answer: 'Company formation costs vary by jurisdiction and services required for complete business setup. Basic offshore incorporation starts from $1,500 (Georgia) to $5,000+ (UAE/Switzerland) including government fees, legal documentation, and our comprehensive service fees. We provide transparent pricing with no hidden costs, and our AI-powered process automation helps reduce overall formation expenses while maintaining premium service quality.',
    },
    {
      id: 'timeline',
      question: 'How long does the entire process take?',
      answer: 'Fast company registration timelines depend on jurisdiction complexity and documentation completeness. Quick jurisdictions like Estonia (1-2 weeks) and Georgia (3-5 days) offer the fastest incorporation processes. More comprehensive setups in UAE or Switzerland typically take 2-6 weeks including banking and compliance services. Our AI-powered automation and real-time progress tracking ensure efficient processing throughout the entire company formation journey.',
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16 overflow-hidden">
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
              <h1 className="text-3xl md:text-4xl font-bold mb-5">
                Seamless Global Company Formation – From Idea to Incorporation
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed mb-6">
                Establish your business in 19+ countries with expert legal guidance and AI-powered process automation. Fast and compliant incorporation with full banking support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="md" className="bg-blue-600 text-white hover:bg-blue-700">
                  Get Free Consultation
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
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-6 h-64 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed line-clamp-4">
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
              Fast company registration in business-friendly jurisdictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredCountries.map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center p-3">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    {country.name}
                  </h3>
                  
                  <div className="space-y-1 mb-4">
                    <div className="bg-green-50 p-1.5 rounded-lg">
                      <div className="text-xs text-green-700 font-medium">**Tax Advantages**</div>
                      <div className="text-xs font-bold text-green-900">{country.taxRate}</div>
                    </div>
                    
                    <div className="bg-blue-50 p-1.5 rounded-lg">
                      <div className="text-xs text-blue-700 font-medium">**Setup Time**</div>
                      <div className="text-xs font-bold text-blue-900">{country.setupTime}</div>
                    </div>
                    
                    <div className="bg-orange-50 p-1.5 rounded-lg">
                      <div className="text-xs text-orange-700 font-medium">**Annual Compliance**</div>
                      <div className="text-xs font-bold text-orange-900">{country.compliance}</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full text-xs py-1">
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
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8">
                Start Company Formation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-medium">
                Schedule Free Consultation
              </Button>
            </div>
            
            <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100 font-medium">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-2" />
                <span>**98% Success Rate**</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>**500+ Companies Formed**</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-300 mr-2" />
                <span>**14-Day Average Setup**</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyFormationPage;