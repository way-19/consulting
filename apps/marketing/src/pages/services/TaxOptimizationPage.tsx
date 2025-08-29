import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, TrendingDown, Shield, FileText, Globe, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';
import { useState } from 'react';

const TaxOptimizationPage = () => {
  const { t } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const processSteps = [
    {
      title: 'Discovery & Risk Assessment',
      description: 'Map your business model, revenue flows, and exposure points across jurisdictions',
      icon: Calculator,
    },
    {
      title: 'Jurisdiction & Treaty Analysis',
      description: 'Evaluate double tax treaties, withholding taxes, and substance requirements to select optimal routes',
      icon: TrendingDown,
    },
    {
      title: 'Implementation & Documentation',
      description: 'Set up compliant structures, transfer pricing policies, and statutory documentation',
      icon: Shield,
    },
    {
      title: 'Monitoring & Reporting',
      description: 'Track rule changes, perform annual reviews, and prepare audit-ready reports',
      icon: FileText,
    },
  ];

  const services = [
    {
      title: 'International Tax Planning',
      description: 'Strategic international tax planning that leverages global jurisdictions to minimize corporate and personal tax obligations while maintaining full compliance. Our experts analyze your business structure, revenue streams, and operational requirements to design tax-efficient frameworks across multiple countries. We ensure all strategies comply with OECD BEPS guidelines, EU directives, and local tax regulations, providing audit-proof documentation and ongoing compliance support for sustainable tax optimization.',
    },
    {
      title: 'Transfer Pricing Strategies',
      description: 'Advanced transfer pricing strategies for multinational enterprises operating across multiple jurisdictions with complex intercompany transactions. Our transfer pricing specialists develop compliant pricing policies that optimize tax efficiency while meeting OECD guidelines and local regulations. We provide comprehensive documentation, economic analysis, and ongoing monitoring to ensure your transfer pricing arrangements withstand regulatory scrutiny and maximize global tax efficiency.',
    },
    {
      title: 'Cross-Border Compliance',
      description: 'Comprehensive cross-border taxation compliance services that navigate complex international tax obligations and reporting requirements. Our compliance specialists ensure your business meets all regulatory standards across multiple jurisdictions, including transfer pricing documentation, country-by-country reporting, and beneficial ownership disclosures. We provide automated compliance monitoring and deadline management to prevent penalties while optimizing your global tax position through legitimate structuring strategies.',
    },
    {
      title: 'Holding & Group Structuring',
      description: 'Sophisticated holding company structures designed for tax optimization, asset protection, and international business expansion. Our structuring specialists create multi-tier corporate frameworks that provide enhanced privacy, reduced tax liability, and operational flexibility for complex international business operations. We ensure all structures meet substance requirements, economic reality tests, and OECD BEPS compliance standards for sustainable tax efficiency.',
    },
    {
      title: 'IP & Royalty Planning',
      description: 'Intellectual property and royalty planning strategies that align value creation with tax outcomes while ensuring OECD BEPS compliance. Our IP specialists evaluate IP location, DEMPE functions, and royalty rates to optimize tax efficiency through legitimate business structuring. We provide comprehensive transfer pricing documentation, substance planning, and double tax treaty access to maximize IP-related tax benefits across global operations.',
    },
    {
      title: 'VAT/GST & Indirect Tax',
      description: 'Comprehensive VAT/GST and indirect tax compliance services for businesses operating across multiple jurisdictions with complex supply chains. Our indirect tax specialists ensure proper registration, filing, and compliance with local VAT/GST requirements while optimizing input tax recovery and minimizing compliance costs. We provide automated monitoring of threshold changes, rate updates, and cross-border transaction rules for seamless international operations.',
    },
    {
      title: 'Permanent Establishment (PE) Review',
      description: 'Professional permanent establishment risk assessment and mitigation strategies for businesses operating across international borders. Our PE specialists review business functions, personnel activities, and contractual arrangements to identify and mitigate PE exposure risks. We provide comprehensive analysis of local PE interpretations, treaty protections, and substance requirements to ensure your international operations remain tax-efficient while avoiding unintended PE creation.',
    },
    {
      title: 'Residency & Treaty Benefits',
      description: 'Strategic tax residency planning and double tax treaty optimization to maximize international tax efficiency and minimize withholding taxes. Our residency specialists analyze your personal and business circumstances to identify optimal tax residency jurisdictions and treaty networks. We ensure proper substance requirements, beneficial ownership tests, and documentation procedures to secure treaty benefits while maintaining full compliance with anti-treaty shopping rules.',
    },
  ];

  const featuredCountries = [
    {
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      tag: 'Free Zones',
      highlight: 'Zero corporate and personal income tax in business-friendly free zones',
      slug: 'united-arab-emirates',
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
      tag: 'e-Residency',
      highlight: 'Ultra-low 1% tax rate for qualifying small business operations',
      slug: 'georgia',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      tag: 'EU Hub',
      highlight: 'Effective 5% corporate tax rate with full European Union market access',
      slug: 'malta',
    },
    {
      name: 'Panama',
      flag: '🇵🇦',
      tag: 'Territorial',
      highlight: 'Territorial tax system with no tax on foreign-sourced income',
      slug: 'panama',
    },
    {
      name: 'Portugal',
      flag: '🇵🇹',
      tag: 'EU Access',
      highlight: 'NHR program with zero tax on foreign income for new residents',
      slug: 'portugal',
    },
    {
      name: 'United States',
      flag: '🇺🇸',
      tag: 'Federal System',
      highlight: 'State-level tax optimization with Delaware and Wyoming advantages',
      slug: 'united-states',
    },
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      tag: 'Premium',
      highlight: 'Cantonal tax variations with holding company privileges and treaty access',
      slug: 'switzerland',
    },
    {
      name: 'Montenegro',
      flag: '🇲🇪',
      tag: 'EU Candidate',
      highlight: 'Low 9% corporate tax with territorial benefits and EU alignment',
      slug: 'montenegro',
    },
  ];

  const faqs = [
    {
      id: 'legal-optimization',
      question: 'Is international tax optimization legal?',
      answer: 'Yes—when structured within the law. We follow OECD BEPS guidance, EU directives, and local rules to ensure your structure is compliant, auditable, and defensible. Our approach reduces risk while targeting sustainable efficiency through legitimate international tax planning strategies.',
    },
    {
      id: 'transfer-pricing',
      question: 'Do I need transfer pricing documentation?',
      answer: 'If you have related-party transactions across borders, yes. We prepare master/local files, benchmarking studies, and intercompany agreements aligned with your jurisdictional thresholds and deadlines. Our transfer pricing documentation ensures OECD compliance and withstands regulatory scrutiny.',
    },
    {
      id: 'tax-treaties',
      question: 'How do double tax treaties affect my plan?',
      answer: 'Treaties can reduce withholding taxes and prevent double taxation, but benefits require substance, residency, and beneficial ownership tests. We assess eligibility and implement documentation to secure treaty relief while ensuring compliance with anti-treaty shopping rules.',
    },
    {
      id: 'permanent-establishment',
      question: 'What is Permanent Establishment (PE) risk?',
      answer: 'PE arises when your activities in a country constitute a taxable presence. We review functions, personnel, and contracts to mitigate PE exposure and align with local interpretations. Our PE risk assessment ensures your international operations remain tax-efficient.',
    },
    {
      id: 'ip-royalties',
      question: 'How are IP and royalties optimized?',
      answer: 'We evaluate IP location, DEMPE functions, and royalty rates to align value creation with tax outcomes. Structures prioritize substance, transfer pricing compliance, and treaty access while ensuring OECD BEPS compliance for sustainable IP tax optimization.',
    },
    {
      id: 'timeline',
      question: 'What is the typical timeline?',
      answer: 'Discovery and analysis can be completed in 1–2 weeks, with implementation depending on jurisdictional filings and banking steps. We provide a clear timeline and checklist before execution, ensuring transparent project management throughout the tax optimization process.',
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

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
                {t('backToServices')}
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('taxOptimizationHeroTitle') || 'Tax Optimization Services – Maximize Efficiency, Minimize Liability'}
              </h1>
              <p className="text-xl text-teal-100 leading-relaxed mb-8">
                {t('taxOptimizationHeroDescription') || 'Leverage 19+ jurisdictions and AI-powered analysis to reduce tax burdens legally and transparently. We design compliant, audit-ready structures tailored to your operations.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/countries?service=tax-optimization">
                  <Button size="lg" className="bg-teal-600 text-white hover:bg-teal-700">
                    {t('chooseCountry') || 'Choose Country'}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
                  {t('scheduleConsultation') || 'Schedule Consultation'}
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('whatWeOffer')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('comprehensiveTaxOptimization') || 'Comprehensive tax optimization strategies for international businesses and individuals'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="relative p-4 h-48 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-200 text-xs leading-relaxed line-clamp-4 overflow-hidden">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Systematic approach to international tax planning and cross-border compliance
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
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premier Tax-Efficient Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading jurisdictions offering the most attractive tax optimization opportunities
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
                  <div className="bg-teal-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-bold text-teal-900">{country.tag}</div>
                    <div className="text-xs text-teal-700">{country.highlight}</div>
                  </div>
                  <Link to={`/countries/${country.slug}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Common questions about international tax planning and optimization strategies
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

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-teal-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Taxes?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Design a compliant, efficient structure tailored to your global operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/countries?service=tax-optimization">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                Choose Country
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaxOptimizationPage;