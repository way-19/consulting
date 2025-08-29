import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Plane, Home, Globe, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const VisaResidencyPage = () => {
  const { t } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const processSteps = [
    {
      title: 'Eligibility Assessment',
      description: 'Assess your profile against program criteria, timelines, and total costs',
      icon: Users,
    },
    {
      title: 'Program Selection',
      description: 'Compare countries and routes; choose the option that fits your goals and risk tolerance',
      icon: Plane,
    },
    {
      title: 'Application Preparation',
      description: 'Gather documents, translations, legalizations, and compliant investment proofs',
      icon: Home,
    },
    {
      title: 'Approval & Settlement',
      description: 'Liaise with authorities, track approvals, and assist with landing, PR, and renewals',
      icon: Globe,
    },
  ];

  const services = [
    {
      title: 'Golden Visa Programs',
      description: 'Investment-based residency programs offering pathways to EU and global mobility through real estate, fund investments, or business creation. Our specialists handle complete due diligence processes, investment structuring, and renewal requirements to ensure compliant golden visa applications. These programs provide family inclusion options and eventual citizenship pathways while maintaining investment flexibility and tax optimization opportunities.',
    },
    {
      title: 'Investor Visas',
      description: 'Entrepreneur and business investor visa routes designed for founders creating jobs and driving innovation in target countries. Our immigration experts navigate job creation criteria, business plan requirements, and compliance frameworks to secure investor visa approvals. These visa services include ongoing support for business development, employment obligations, and pathway progression to permanent residency status.',
    },
    {
      title: 'Citizenship by Investment',
      description: 'Fast-track citizenship programs through approved government investment routes with comprehensive background screening and family inclusion options. Our citizenship specialists manage source-of-funds verification, due diligence processes, and investment structuring to ensure compliant applications. These programs offer immediate passport benefits, visa-free travel, and generational citizenship rights for qualifying families.',
    },
    {
      title: 'Skilled Worker Visas',
      description: 'Employment-based visa programs for professionals seeking international career opportunities through employer sponsorship and skills-based immigration routes. Our specialists handle labor market testing, credential evaluation, and relocation planning to secure skilled worker visa approvals. These visa services include job matching, employer liaison, and comprehensive settlement support for successful international career transitions.',
    },
    {
      title: 'Family Reunification',
      description: 'Comprehensive family visa services for spouses, children, and dependent relatives seeking to join family members in new countries. Our immigration experts navigate income thresholds, relationship documentation, and document legalization requirements for successful family reunification applications. These services ensure complete family immigration with proper legal status and settlement support.',
    },
    {
      title: 'Permanent Residency',
      description: 'Long-term settlement pathways leading to permanent residency status with comprehensive integration and renewal support. Our residency specialists guide clients through language requirements, integration programs, and PR renewal obligations to maintain permanent status. These services provide clear pathways to citizenship while ensuring ongoing compliance with residency obligations and settlement requirements.',
    },
  ];

  const featuredCountries = [
    {
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      tag: 'Free Zones',
      highlight: 'Residence via company formation and investment options',
      slug: 'united-arab-emirates',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      tag: 'Digital First',
      highlight: 'EU access with e-Residency pathways and startup routes',
      slug: 'estonia',
    },
    {
      name: 'Georgia',
      flag: '🇬🇪',
      tag: 'Flexible',
      highlight: 'Efficient setup and favorable residence options',
      slug: 'georgia',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      tag: 'EU Hub',
      highlight: 'Robust residency and long-term settlement programs',
      slug: 'malta',
    },
    {
      name: 'Panama',
      flag: '🇵🇦',
      tag: 'Friendly Nations',
      highlight: 'Territorial system with attractive residency routes',
      slug: 'panama',
    },
    {
      name: 'Portugal',
      flag: '🇵🇹',
      tag: 'EU Access',
      highlight: 'Investor and digital-nomad pathways with EU mobility',
      slug: 'portugal',
    },
    {
      name: 'United States',
      flag: '🇺🇸',
      tag: 'Markets',
      highlight: 'E-2/EB-5, employment-based, and founder routes',
      slug: 'united-states',
    },
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      tag: 'Premium',
      highlight: 'Residence via employment or lump-sum taxation (cantonal approval)',
      slug: 'switzerland',
    },
    {
      name: 'Montenegro',
      flag: '🇲🇪',
      tag: 'Residency',
      highlight: 'Business/residency options with EU-candidate status',
      slug: 'montenegro',
    },
  ];

  const faqs = [
    {
      id: 'best-route',
      question: 'Which residency route is best for me?',
      answer: 'The optimal route depends on your goals (mobility, tax, lifestyle), budget, timing, and risk tolerance. We analyze your specific circumstances and compare available programs to present a shortlist with detailed timelines and total costs. Our assessment considers your business activities, family situation, and long-term objectives to recommend the most suitable visa services and residency programs for your needs.',
    },
    {
      id: 'golden-visa-costs',
      question: 'How much do Golden Visa programs cost?',
      answer: 'Investment thresholds and fees vary significantly by country and investment route (real estate, funds, or business creation). Total costs typically range from €250,000 to €2,000,000 plus government fees, legal costs, and due diligence expenses. We provide transparent cost breakdowns including investment requirements, processing fees, renewal obligations, and ongoing compliance costs for each golden visa program.',
    },
    {
      id: 'family-inclusion',
      question: 'Can I include my family?',
      answer: 'Most residency programs allow inclusion of spouses and dependent children, with some extending to parents and grandparents under specific conditions. Each family member requires separate documentation and may incur additional fees. We confirm eligibility requirements, prepare family documentation, and calculate total costs for all dependents included in your visa services application.',
    },
    {
      id: 'process-timeline',
      question: 'How long does the process take?',
      answer: 'Processing timelines typically range from 2-12 months depending on program complexity, due diligence requirements, document legalization needs, and government processing speeds. Investment-based programs generally take 4-8 months, while employment routes may take 6-18 months. You receive a detailed step-by-step schedule with milestone tracking throughout the entire residency programs application process.',
    },
    {
      id: 'residence-requirements',
      question: 'Do I need to live in the country full-time?',
      answer: 'Physical presence requirements vary significantly by program and residency type. Some golden visa programs require only 7-14 days annually, while others mandate 183+ days for tax residency or citizenship eligibility. We map each program\'s minimum stay rules, renewal obligations, and pathway requirements to help you choose visa services that align with your lifestyle and business needs.',
    },
    {
      id: 'tax-implications',
      question: 'Will this change my taxes?',
      answer: 'Obtaining residency can significantly affect your tax status, including potential worldwide income taxation, domicile changes, and treaty benefits or obligations. We coordinate with our tax optimization specialists to assess implications before you commit to any residency programs. This integrated approach ensures your visa services align with your overall tax strategy and financial planning objectives.',
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 overflow-hidden">
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
                {t('visaResidencyHeroTitle')}
              </h1>
              <p className="text-xl text-indigo-100 leading-relaxed mb-8">
                {t('visaResidencyHeroDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/countries?service=visa-residency">
                  <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700">
                    {t('applyForResidency') || 'Apply for Residency'}
                  </Button>
                </Link>
                <Link to="/countries">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
                    {t('viewVisaOptions') || 'View Visa Options'}
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Visa and residency"
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
              {t('comprehensiveVisaServices') || 'Comprehensive visa and residency services for global mobility'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-6 h-64 flex flex-col justify-end text-white">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Visa & Residency Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Step-by-step guidance through visa applications and residency programs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Residency Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Countries offering attractive visa and residency programs for investors
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
                  <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-bold text-indigo-900">{country.tag}</div>
                    <div className="text-xs text-indigo-700">{country.highlight}</div>
                  </div>
                  <Link to={`/countries/${country.slug}`}>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full"
                      aria-label={`Learn More about ${country.name}`}
                    >
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
              Common questions about visa services and residency programs
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
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Secure Your Residency?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Start your journey to global mobility with expert, end-to-end guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/countries?service=visa-residency">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                Apply for Residency
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VisaResidencyPage;