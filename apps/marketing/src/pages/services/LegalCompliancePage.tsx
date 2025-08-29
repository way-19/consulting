import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, Shield, CheckCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const LegalCompliancePage: React.FC = () => {
  const { t } = useLanguage();

  const processSteps = [
    { title: 'Compliance Assessment', description: 'Evaluate your current status, risks, and gaps across jurisdictions with a documented baseline', icon: FileText },
    { title: 'Regulatory Mapping', description: 'Identify all applicable laws and obligations, including sector-specific rules and filing deadlines', icon: Scale },
    { title: 'Implementation', description: 'Deploy policies, procedures, and documentation systems; align teams with clear workflows', icon: Shield },
    { title: 'Ongoing Monitoring', description: 'Track regulatory changes, renewals, and audits with scheduled reviews and automated reminders', icon: CheckCircle },
  ];

  const services = [
    { 
      title: 'Corporate Governance', 
      description: 'Establish robust corporate governance frameworks including board resolutions, shareholder agreements, and compliance policies. Our services ensure your business meets regulatory standards while optimizing decision-making processes and protecting stakeholders across multiple jurisdictions.'
    },
    { 
      title: 'Regulatory Compliance', 
      description: 'Navigate industry-specific regulatory requirements across finance, healthcare, technology, and other sectors. Our experts provide comprehensive audits, policy development, and monitoring services to ensure your business stays current with evolving regulations and maintains proper licensing.'
    },
    { 
      title: 'Data Protection Compliance', 
      description: 'Achieve full GDPR compliance, CCPA adherence, and comprehensive data privacy regulation compliance across global jurisdictions. Our specialists implement privacy policies, conduct audits, and establish secure data handling procedures to protect customer information and avoid regulatory fines.'
    },
    { 
      title: 'Anti-Money Laundering (AML/KYC)', 
      description: 'Implement comprehensive AML KYC procedures and compliance programs that meet international standards. Our specialists design risk-based frameworks, conduct due diligence training, and establish monitoring systems to prevent financial crimes and protect against reputational risks.'
    },
    { 
      title: 'Contract Management', 
      description: 'Professional legal contract drafting, review, and management systems for international business operations. Our services include agreement templates, compliance reviews, and automated lifecycle management to reduce legal risks and ensure contractual compliance across jurisdictions.'
    },
    { 
      title: 'Intellectual Property Protection', 
      description: 'Comprehensive intellectual property protection strategies including patent filing, trademark registration, and copyright protection across global markets. Our IP specialists help secure valuable assets, conduct audits, and develop protection strategies for international expansion.'
    },
  ];

  const featuredCountries = [
    { name: 'United Arab Emirates', flag: '🇦🇪', tag: 'Free Zones', highlight: 'Modern legal framework with business-friendly free zone regulations', slug: 'united-arab-emirates' },
    { name: 'Estonia', flag: '🇪🇪', tag: 'e-Residency', highlight: 'Advanced digital legal infrastructure with comprehensive EU access', slug: 'estonia' },
    { name: 'Georgia', flag: '🇬🇪', tag: '1% Small Business Tax', highlight: 'Streamlined legal system with minimal bureaucracy and low tax compliance', slug: 'georgia' },
    { name: 'Malta', flag: '🇲🇹', tag: 'EU Hub', highlight: 'Strong EU legal framework with progressive blockchain and fintech regulations', slug: 'malta' },
    { name: 'Panama', flag: '🇵🇦', tag: 'Territorial', highlight: 'Strong privacy protection with territorial legal system and banking secrecy', slug: 'panama' },
    { name: 'Portugal', flag: '🇵🇹', tag: 'EU Access', highlight: 'Comprehensive EU legal compliance with attractive investment immigration programs', slug: 'portugal' },
    { name: 'United States', flag: '🇺🇸', tag: 'Federal System', highlight: 'Robust common law legal framework with strong business protections and privacy', slug: 'united-states' },
    { name: 'Switzerland', flag: '🇨🇭', tag: 'Premium', highlight: 'Political stability with predictable legal system and world-class banking laws', slug: 'switzerland' },
    { name: 'Montenegro', flag: '🇲🇪', tag: 'EU Candidate', highlight: 'Developing legal framework with EU alignment and citizenship investment options', slug: 'montenegro' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section — mirror of Banking page sizing */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/70 rounded-full" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-white/70 rounded-lg rotate-45" />
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('legalComplianceHeroTitle')}</h1>
              <p className="text-xl text-green-100 leading-relaxed mb-8">
                {t('legalComplianceHeroDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/countries?service=legal-compliance">
                  <Button size="lg" className="bg-green-600 text-white hover:bg-green-700">{t('chooseCountry')}</Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  {t('viewLegalServices') || 'View Legal Services'}
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Legal compliance"
                className="rounded-xl shadow-2xl w-full h-[260px] md:h-[360px] object-cover"
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
              {t('comprehensiveLegalCompliance') || 'Comprehensive legal compliance services for international businesses'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                <div className="absolute inset-0">
                  <img
                    src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=600"
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
                </div>
                <div className="relative p-6 h-48 flex flex-col justify-end text-white">
                  <h3 className="text-lg font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{service.description}</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Legal Compliance Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Systematic approach to ensuring comprehensive legal compliance across all jurisdictions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leading Legal Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Countries offering the most robust and business-friendly legal frameworks for international business compliance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCountries.map((country, index) => (
              <Card key={index} hover>
                <Card.Body className="text-center">
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{country.name}</h3>
                  <div className="bg-green-50 p-3 rounded-lg mb-4">
                    <div className="text-lg font-bold text-green-900">{country.tag}</div>
                    <div className="text-xs text-green-700">{country.highlight}</div>
                  </div>
                  <Link to={`/countries/${country.slug}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                  {/* Secondary CTA option:
                  <Link to={`/services/legal-compliance?country=${country.slug}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Legal Services
                    </Button>
                  </Link> */}
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Ensure Compliance?</h2>
          <p className="text-xl text-green-100 mb-8">Protect your business with comprehensive legal compliance services</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/countries?service=legal-compliance">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">Choose Country</Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">Schedule Consultation</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalCompliancePage;
