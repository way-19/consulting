import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, TrendingDown, Shield, FileText, Globe, DollarSign } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const TaxOptimizationPage = () => {
  const processSteps = [
    {
      title: 'Tax Situation Analysis',
      description: 'Comprehensive review of your current tax obligations and structure',
      icon: Calculator,
    },
    {
      title: 'Strategy Development',
      description: 'Create customized tax optimization strategies for your specific situation',
      icon: TrendingDown,
    },
    {
      title: 'Implementation Planning',
      description: 'Execute tax-efficient structures and ensure full legal compliance',
      icon: Shield,
    },
    {
      title: 'Ongoing Monitoring',
      description: 'Continuous monitoring and adjustments to maintain tax efficiency',
      icon: FileText,
    },
  ];

  const services = [
    {
      title: 'International Tax Planning',
      description: 'Strategic international tax planning that leverages global jurisdictions to minimize corporate and personal tax obligations while maintaining full compliance. Our experts analyze your business structure, revenue streams, and operational requirements to design tax-efficient frameworks across multiple countries. We ensure all strategies comply with OECD guidelines, EU directives, and local tax regulations, providing audit-proof documentation and ongoing compliance support for sustainable tax optimization.',
    },
    {
      title: 'Cross-Border Compliance',
      description: 'Comprehensive cross-border tax compliance services that navigate complex international tax obligations and reporting requirements. Our compliance specialists ensure your business meets all regulatory standards across multiple jurisdictions, including transfer pricing documentation, country-by-country reporting, and beneficial ownership disclosures. We provide automated compliance monitoring and deadline management to prevent penalties while optimizing your global tax position through legitimate structuring strategies.',
    },
    {
      title: 'Transfer Pricing Strategies',
      description: 'Advanced transfer pricing strategies for multinational enterprises operating across multiple jurisdictions with complex intercompany transactions. Our transfer pricing specialists develop compliant pricing policies that optimize tax efficiency while meeting OECD guidelines and local regulations. We provide comprehensive documentation, economic analysis, and ongoing monitoring to ensure your transfer pricing arrangements withstand regulatory scrutiny and maximize global tax efficiency.',
    },
    {
      title: 'Digital Nomad & Remote Business Taxation',
      description: 'Specialized tax optimization for digital nomads, remote workers, and location-independent businesses operating across multiple countries. Our experts help structure your business and personal tax affairs to minimize global tax liability while ensuring compliance with residence-based taxation rules. We provide guidance on tax residency planning, permanent establishment risks, and optimal jurisdiction selection for digital business models and remote work arrangements.',
    },
    {
      title: 'Tax Treaty Optimization',
      description: 'Strategic utilization of double taxation treaties and international tax agreements to minimize withholding taxes and eliminate double taxation across global operations. Our tax treaty specialists analyze your business structure and cash flows to identify optimal treaty networks and structuring opportunities. We ensure proper treaty claim procedures, substance requirements, and documentation to maximize tax efficiency while maintaining full compliance with anti-treaty shopping rules.',
    },
    {
      title: 'Exit Tax Planning',
      description: 'Comprehensive exit tax planning for tax-efficient business and personal relocations across international jurisdictions. Our specialists help minimize exit taxes, capital gains implications, and other departure taxes when relocating businesses or changing tax residency. We provide strategic timing advice, pre-migration planning, and post-relocation compliance support to ensure smooth transitions while optimizing your overall tax position through legitimate planning strategies.',
    },
  ];

  const featuredCountries = [
    {
      name: 'UAE',
      flag: '🇦🇪',
      taxRate: '0%',
      highlight: 'No corporate or personal income tax',
    },
    {
      name: 'Georgia',
      flag: '🇬🇪',
      taxRate: '1%',
      highlight: 'Small business status with 1% tax rate',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      taxRate: '0%',
      highlight: 'Tax only on distributed profits',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      taxRate: '5%',
      highlight: 'Effective 5% corporate tax rate with EU access',
    },
    {
      name: 'Singapore',
      flag: '🇸🇬',
      taxRate: '17%',
      highlight: 'Territorial tax system with exemptions',
    },
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      taxRate: '11-24%',
      highlight: 'Cantonal variations with holding privileges',
    },
    {
      name: 'Panama',
      flag: '🇵🇦',
      taxRate: '25%',
      highlight: 'Territorial taxation on local income only',
    },
    {
      name: 'Portugal',
      flag: '🇵🇹',
      taxRate: '21%',
      highlight: 'NHR program with 0% foreign income tax',
    },
    {
      name: 'Montenegro',
      flag: '🇲🇪',
      taxRate: '9%',
      highlight: 'Low corporate tax with territorial benefits',
    },
    {
      name: 'United States',
      flag: '🇺🇸',
      taxRate: '21%',
      highlight: 'Delaware/Wyoming with no state tax',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 to-green-600 text-white py-8 overflow-hidden">
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
                Tax Optimization Services
              </h1>
              <p className="text-xl text-teal-100 leading-relaxed mb-8">
                Minimize your tax burden legally and efficiently. Our tax experts help you structure your business and personal affairs for maximum tax savings while ensuring full compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-teal-600 text-white hover:bg-teal-700">
                  Get Tax Analysis
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
                  View Tax Strategies
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Tax optimization"
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
              Comprehensive tax optimization strategies for businesses and individuals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Tax Optimization Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to minimizing your tax burden while ensuring compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Best Tax-Efficient Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Countries offering the most attractive tax environments for businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCountries.map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-green-900">{country.taxRate}</div>
                    <div className="text-xs text-green-700">{country.highlight}</div>
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
      <section className="py-20 bg-gradient-to-r from-teal-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Global Tax Strategy?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Start your tax optimization journey with our proven international strategies
          </p>
          
          <div className="mb-8 flex items-center justify-center space-x-8 text-teal-100 font-medium">
            <div className="flex items-center">
              <span>**98% Compliance Success**</span>
            </div>
            <div className="flex items-center">
              <span>**500+ Clients Supported**</span>
            </div>
            <div className="flex items-center">
              <span>**14-Day Average Structuring**</span>
            </div>
          </div>
          
          <div className="text-center">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8">
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaxOptimizationPage;