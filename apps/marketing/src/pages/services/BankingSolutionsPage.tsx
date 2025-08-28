import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building, Shield, Globe, Banknote, Users } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const BankingSolutionsPage = () => {
  const processSteps = [
    {
      title: 'Banking Requirements Analysis',
      description: 'Identify your business needs, compliance obligations, and preferred banking jurisdictions',
      icon: CreditCard,
    },
    {
      title: 'Bank Selection',
      description: 'Choose the optimal bank based on jurisdiction, product features, and your operational model',
      icon: Building,
    },
    {
      title: 'Account Opening',
      description: 'Streamline documentation and due diligence processes for smooth onboarding',
      icon: Shield,
    },
    {
      title: 'Banking Setup',
      description: 'Enable online banking, payment systems, and ongoing support for global operations',
      icon: Globe,
    },
  ];

  const services = [
    {
      title: 'Corporate Account Opening',
      description: 'Professional corporate account opening services in premier financial centers worldwide. Our banking specialists facilitate relationships with top-tier banks, ensuring your business gains access to comprehensive corporate banking solutions including business checking, savings, and credit facilities. We handle all documentation requirements, compliance procedures, and due diligence processes to streamline your banking setup across multiple jurisdictions.',
    },
    {
      title: 'Multi-Currency Accounts',
      description: 'Advanced multi-currency banking solutions that enable your business to hold, manage, and transact in multiple currencies with competitive exchange rates. These accounts provide seamless international payment processing, currency hedging options, and real-time foreign exchange capabilities. Perfect for businesses operating across borders, offering significant cost savings on international transactions and currency conversion fees.',
    },
    {
      title: 'Private Banking',
      description: 'Exclusive private banking services tailored for high-net-worth individuals and successful entrepreneurs seeking personalized wealth management solutions. Our private banking partnerships provide access to dedicated relationship managers, bespoke investment products, and sophisticated financial planning services. These premium banking relationships offer enhanced privacy, priority service, and access to exclusive investment opportunities in global financial centers.',
    },
    {
      title: 'Trade Finance',
      description: 'Comprehensive trade finance solutions including letters of credit, bank guarantees, and international trade financing facilities. Our trade finance specialists help businesses secure working capital, manage payment risks, and facilitate smooth international transactions. These services are essential for import/export businesses, providing security and cash flow optimization for global trade operations across emerging and developed markets.',
    },
    {
      title: 'Digital Banking Solutions',
      description: 'Cutting-edge digital banking solutions designed for modern businesses and digital entrepreneurs. Access innovative fintech platforms offering real-time payments, API integrations, automated accounting connections, and mobile-first banking experiences. These digital banking solutions provide enhanced efficiency, lower costs, and seamless integration with business management tools, perfect for tech companies and online businesses.',
    },
    {
      title: 'Investment Banking',
      description: 'Professional investment banking services including capital raising, mergers and acquisitions advisory, and strategic financial consulting. Our investment banking partners provide access to institutional investors, debt financing solutions, and sophisticated financial structuring services. These services support business growth, expansion financing, and strategic transactions for established companies seeking to scale operations or optimize capital structure.',
    },
  ];

  const featuredCountries = [
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      taxRate: 'Premium',
      highlight: 'World-renowned excellence in private banking and confidentiality',
    },
    {
      name: 'UAE',
      flag: '🇦🇪',
      taxRate: 'Modern',
      highlight: 'Fast-growing financial hub with access to Islamic banking solutions',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      taxRate: 'Digital',
      highlight: 'Advanced digital banking solutions with EU market access',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      taxRate: 'EU Hub',
      highlight: 'Strategic EU banking center with blockchain-friendly regulations',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-8 overflow-hidden">
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Global Banking Solutions – Secure, Compliant, and Efficient
              </h1>
              <p className="text-xl text-orange-100 leading-relaxed mb-8">
                Access premium corporate and personal banking worldwide. Consulting19 helps you connect with leading financial centers, ensuring compliance, multi-currency solutions, and advanced digital banking services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-orange-600 text-white hover:bg-orange-700">
                  Schedule Consultation
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Banking solutions"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete banking solutions for international businesses and individuals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Banking Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamlined process to open accounts in the world's leading banks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premier Banking Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access world-class banking services in leading financial centers
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
                  <div className="bg-orange-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-orange-900">{country.taxRate}</div>
                    <div className="text-xs text-orange-700">{country.highlight}</div>
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
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Access Global Banking?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Connect with premier banking solutions through our expert guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              Compare Banks
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BankingSolutionsPage;