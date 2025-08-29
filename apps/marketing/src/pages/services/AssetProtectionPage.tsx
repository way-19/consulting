import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Globe, Briefcase, Users, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';
import { useState } from 'react';

const AssetProtectionPage = () => {
  const { t } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const processSteps = [
    {
      title: 'Asset Assessment',
      description: 'Map your asset portfolio, legal risks, and exposure points across jurisdictions',
      icon: Shield,
    },
    {
      title: 'Protection Strategy',
      description: 'Design trust, foundation, and holding structures tailored to control, access, and succession needs',
      icon: Lock,
    },
    {
      title: 'Structure Implementation',
      description: 'Establish entities, draft deeds and bylaws, implement governance frameworks, and set up banking',
      icon: Eye,
    },
    {
      title: 'Ongoing Management',
      description: 'Handle filings, renewals, monitoring, and maintain audit-ready records for compliance',
      icon: Globe,
    },
  ];

  const services = [
    {
      title: 'Offshore Trusts',
      description: 'Establish sophisticated offshore trust structures in premier jurisdictions for maximum asset protection and privacy. Our trust specialists design compliant frameworks that shield wealth from creditors, litigation risks, and political instability while maintaining beneficial ownership control. These structures provide cross-border estate planning benefits, tax efficiency, and generational wealth transfer capabilities with full regulatory compliance and audit-ready documentation.',
    },
    {
      title: 'Private Foundations',
      description: 'Create private foundation structures for wealth preservation, succession planning, and philanthropic objectives in leading foundation jurisdictions. Our foundation experts establish compliant structures that offer enhanced privacy, asset protection, and flexible governance frameworks. These vehicles provide optimal solutions for family wealth management, charitable giving, and intergenerational wealth transfer with sophisticated control mechanisms and tax optimization benefits.',
    },
    {
      title: 'Holding Companies',
      description: 'Design multi-layered holding company structures for asset isolation, creditor protection, and operational efficiency across multiple jurisdictions. Our holding structure specialists create compliant frameworks that separate business risks, optimize tax efficiency, and provide enhanced privacy protection. These structures enable sophisticated asset compartmentalization while maintaining operational control and facilitating international business expansion with full regulatory compliance.',
    },
    {
      title: 'Family Offices',
      description: 'Establish comprehensive family office structures for ultra-high-net-worth families seeking centralized wealth management and governance solutions. Our family office specialists design bespoke frameworks that coordinate investment management, tax planning, estate planning, and family governance across multiple generations. These structures provide professional wealth administration, enhanced privacy, and sophisticated succession planning with global compliance and reporting capabilities.',
    },
    {
      title: 'Succession Planning',
      description: 'Develop comprehensive succession planning strategies and wealth transfer structures that minimize tax liability while ensuring smooth generational transitions. Our succession specialists create compliant frameworks using trusts, foundations, and holding structures to facilitate efficient wealth transfer. These solutions provide tax-optimized estate planning, family governance structures, and cross-border compliance for sustainable wealth preservation across multiple jurisdictions.',
    },
    {
      title: 'Privacy Solutions',
      description: 'Implement advanced privacy solutions and confidentiality structures for high-profile individuals and sensitive business operations. Our privacy specialists design compliant frameworks that enhance anonymity, protect beneficial ownership information, and shield personal and business activities from public scrutiny. These solutions provide maximum discretion while maintaining full regulatory compliance and audit-ready documentation across all jurisdictions.',
    },
  ];

  const featuredCountries = [
    {
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      tag: 'Free Zones',
      highlight: 'Modern asset protection framework with business-friendly free zone structures',
      slug: 'united-arab-emirates',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      tag: 'e-Residency',
      highlight: 'Digital asset protection solutions with EU compliance and online management',
      slug: 'estonia',
    },
    {
      name: 'Georgia',
      flag: '🇬🇪',
      tag: '1% Small Business Tax',
      highlight: 'Simple asset protection structures with minimal tax burden and low compliance',
      slug: 'georgia',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      tag: 'EU Hub',
      highlight: 'EU-compliant asset protection with blockchain-friendly regulations and privacy',
      slug: 'malta',
    },
    {
      name: 'Panama',
      flag: '🇵🇦',
      tag: 'Territorial',
      highlight: 'Strong privacy laws with territorial taxation and robust banking secrecy',
      slug: 'panama',
    },
    {
      name: 'Portugal',
      flag: '🇵🇹',
      tag: 'EU Access',
      highlight: 'EU asset protection with investment immigration and NHR tax benefits',
      slug: 'portugal',
    },
    {
      name: 'United States',
      flag: '🇺🇸',
      tag: 'Federal System',
      highlight: 'Advanced trust and LLC structures with strong legal framework and privacy',
      slug: 'united-states',
    },
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      tag: 'Premium',
      highlight: 'World-class banking privacy with political stability and wealth management',
      slug: 'switzerland',
    },
    {
      name: 'Montenegro',
      flag: '🇲🇪',
      tag: 'EU Candidate',
      highlight: 'Emerging asset protection jurisdiction with EU alignment and citizenship options',
      slug: 'montenegro',
    },
  ];

  const faqs = [
    {
      id: 'legal-protection',
      question: 'Is offshore asset protection legal?',
      answer: 'Yes—when structured within the law and with proper substance. We follow international compliance standards, beneficial ownership requirements, and reporting obligations to ensure your asset protection structures are compliant, auditable, and defensible. Our approach reduces legal risks while providing legitimate wealth protection through established jurisdictions with strong legal frameworks.',
    },
    {
      id: 'trust-vs-foundation',
      question: 'Should I use a trust or foundation structure?',
      answer: 'The choice depends on your jurisdiction, control preferences, and succession goals. Trusts offer flexibility and common law familiarity, while foundations provide corporate-like governance and civil law advantages. We analyze your specific needs, family structure, and objectives to recommend the optimal vehicle for your asset protection and wealth transfer requirements.',
    },
    {
      id: 'access-control',
      question: 'Will I lose control of my assets?',
      answer: 'No—properly structured asset protection maintains your practical control while providing legal separation. We design frameworks that preserve your decision-making authority through advisory roles, investment committees, and distribution guidelines. The key is balancing protection benefits with control retention through compliant structures that satisfy both legal requirements and your operational needs.',
    },
    {
      id: 'creditor-protection',
      question: 'How effective is creditor protection?',
      answer: 'Effectiveness depends on timing, jurisdiction selection, and structure design. Pre-existing debt or fraudulent transfer risks can limit protection, so early planning is crucial. We evaluate your risk profile, select optimal jurisdictions with strong creditor protection laws, and implement structures that provide maximum legal separation while maintaining compliance with international standards and reporting requirements.',
    },
    {
      id: 'reporting-obligations',
      question: 'What are the reporting requirements?',
      answer: 'Reporting obligations vary by your tax residency and structure jurisdiction. Most countries require disclosure of foreign trusts, foundations, and controlled entities through various forms and deadlines. We ensure full compliance with CRS, FATCA, and local reporting requirements while maintaining maximum privacy within legal boundaries and providing ongoing compliance monitoring.',
    },
    {
      id: 'setup-timeline',
      question: 'How long does asset protection setup take?',
      answer: 'Structure establishment typically takes 4-8 weeks depending on jurisdiction complexity and banking requirements. Simple trust structures can be completed faster, while complex multi-jurisdictional frameworks require additional time for proper documentation and compliance setup. We provide clear timelines and milestone tracking throughout the entire asset protection implementation process.',
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8 overflow-hidden">
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
                {t('assetProtectionHeroTitle') || 'Asset Protection Services'}
              </h1>
              <p className="text-xl text-purple-100 leading-relaxed mb-8">
                {t('assetProtectionHeroDescription') || 'Protect your wealth from legal risks, creditors, and political instability. We design compliant trust, foundation, and holding structures that safeguard assets while maintaining access and control.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/countries?service=asset-protection">
                  <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700">
                    {t('getStarted') || 'Get Started'}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  {t('scheduleConsultation') || 'Schedule Consultation'}
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Asset protection"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Matrix Premium Promo */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700/90 via-purple-600/85 to-fuchsia-600/80" />
            </div>

            {/* Content */}
            <div className="relative p-6 md:p-8 lg:p-10 text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 ring-1 ring-white/25 text-sm font-semibold mb-4">
                <span>🔷 Premium</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                Matrix — Private Wealth Platform
              </h3>
              <p className="mt-3 text-white/90 max-w-3xl">
                A privacy-first platform for ultra-high-net-worth clients. AI-assisted global
                allocation and discreet multi-jurisdiction banking. Minimum investment: <strong>$5M</strong>.
              </p>

              {/* Bullets */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-sm">AI-driven analysis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-white" />
                  <span className="text-sm">Global opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-sm">Strict confidentiality</span>
                </div>
              </div>

              {/* KPI chips */}
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="px-3 py-1 rounded-md bg-white/15 ring-1 ring-white/25 text-sm">
                  $2.5B+ AUM
                </div>
                <div className="px-3 py-1 rounded-md bg-white/15 ring-1 ring-white/25 text-sm">
                  98% success rate
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://wealth.consulting19.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button size="lg" className="bg-amber-400 text-black hover:bg-amber-300">
                    Explore Matrix Wealth
                  </Button>
                </a>
              </div>
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
              {t('sophisticatedAssetProtection') || 'Sophisticated asset protection strategies for high-net-worth individuals and businesses'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Asset Protection Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive approach to protecting your wealth and assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premier Asset Protection Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Countries offering the strongest asset protection laws and privacy frameworks
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
                  <div className="bg-purple-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-bold text-purple-900">{country.tag}</div>
                    <div className="text-xs text-purple-700">{country.highlight}</div>
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
              Common questions about asset protection strategies and offshore structures
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
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Assets?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Design a compliant, efficient structure tailored to your global operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/countries?service=asset-protection">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Protect My Assets
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AssetProtectionPage;