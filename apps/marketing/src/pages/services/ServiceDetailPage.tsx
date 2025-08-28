import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Globe, Users, Star } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const { t } = useLanguage();

  // Complete list of all countries with their details
  const allCountries = [
    { 
      id: 'uae', 
      name: { en: 'UAE', tr: 'BAE', pt: 'EAU' }, 
      flag: '🇦🇪', 
      highlight: { 
        en: '0% tax in free zones', 
        tr: 'Serbest bölgelerde %0 vergi', 
        pt: '0% de imposto em zonas francas' 
      } 
    },
    { 
      id: 'estonia', 
      name: { en: 'Estonia', tr: 'Estonya', pt: 'Estônia' }, 
      flag: '🇪🇪', 
      highlight: { 
        en: 'Digital e-Residency', 
        tr: 'Dijital e-Residency', 
        pt: 'e-Residência Digital' 
      } 
    },
    { 
      id: 'georgia', 
      name: { en: 'Georgia', tr: 'Gürcistan', pt: 'Geórgia' }, 
      flag: '🇬🇪', 
      highlight: { 
        en: '1% small business tax', 
        tr: '%1 küçük işletme vergisi', 
        pt: '1% imposto pequenas empresas' 
      } 
    },
    { 
      id: 'malta', 
      name: { en: 'Malta', tr: 'Malta', pt: 'Malta' }, 
      flag: '🇲🇹', 
      highlight: { 
        en: 'EU access, 5% tax', 
        tr: 'AB erişimi, %5 vergi', 
        pt: 'Acesso UE, 5% imposto' 
      } 
    },
    { 
      id: 'panama', 
      name: { en: 'Panama', tr: 'Panama', pt: 'Panamá' }, 
      flag: '🇵🇦', 
      highlight: { 
        en: 'Territorial taxation', 
        tr: 'Bölgesel vergilendirme', 
        pt: 'Tributação territorial' 
      } 
    },
    { 
      id: 'portugal', 
      name: { en: 'Portugal', tr: 'Portekiz', pt: 'Portugal' }, 
      flag: '🇵🇹', 
      highlight: { 
        en: 'Golden Visa program', 
        tr: 'Altın Vize programı', 
        pt: 'Programa Golden Visa' 
      } 
    },
    { 
      id: 'usa', 
      name: { en: 'United States', tr: 'Amerika Birleşik Devletleri', pt: 'Estados Unidos' }, 
      flag: '🇺🇸', 
      highlight: { 
        en: 'World\'s largest market', 
        tr: 'Dünyanın en büyük pazarı', 
        pt: 'Maior mercado do mundo' 
      } 
    },
    { 
      id: 'switzerland', 
      name: { en: 'Switzerland', tr: 'İsviçre', pt: 'Suíça' }, 
      flag: '🇨🇭', 
      highlight: { 
        en: 'Banking excellence', 
        tr: 'Bankacılık mükemmelliği', 
        pt: 'Excelência bancária' 
      } 
    },
    { 
      id: 'montenegro', 
      name: { en: 'Montenegro', tr: 'Karadağ', pt: 'Montenegro' }, 
      flag: '🇲🇪', 
      highlight: { 
        en: 'EU candidate, citizenship', 
        tr: 'AB adayı, vatandaşlık', 
        pt: 'Candidato UE, cidadania' 
      } 
    },
    { 
      id: 'singapore', 
      name: { en: 'Singapore', tr: 'Singapur', pt: 'Singapura' }, 
      flag: '🇸🇬', 
      highlight: { 
        en: 'Asian gateway', 
        tr: 'Asya kapısı', 
        pt: 'Portal da Ásia' 
      } 
    },
    { 
      id: 'cyprus', 
      name: { en: 'Cyprus', tr: 'Kıbrıs', pt: 'Chipre' }, 
      flag: '🇨🇾', 
      highlight: { 
        en: 'EU member, 12.5% tax', 
        tr: 'AB üyesi, %12.5 vergi', 
        pt: 'Membro UE, 12.5% imposto' 
      } 
    },
    { 
      id: 'ireland', 
      name: { en: 'Ireland', tr: 'İrlanda', pt: 'Irlanda' }, 
      flag: '🇮🇪', 
      highlight: { 
        en: 'EU HQ destination', 
        tr: 'AB merkez destinasyonu', 
        pt: 'Destino sede UE' 
      } 
    },
  ];

  const serviceData: { [key: string]: any } = {
    'company-formation': {
      title: 'Company Formation Services',
      description: 'Complete assistance in company registration and incorporation in business-friendly jurisdictions worldwide.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      benefits: [
        'Expert guidance through complex registration processes',
        'Access to business-friendly jurisdictions worldwide',
        'Streamlined documentation and compliance',
        'Ongoing support for corporate governance',
        'Tax-efficient structure recommendations',
        'Banking and financial services coordination'
      ],
      advantages: [
        {
          title: 'Global Expertise',
          description: 'Our network spans 19+ countries with local experts who understand regional regulations and business practices.'
        },
        {
          title: 'Proven Track Record',
          description: 'Over 500 successful company formations with a 98% success rate and satisfied clients worldwide.'
        },
        {
          title: 'End-to-End Support',
          description: 'From initial consultation to post-incorporation services, we handle every aspect of your business setup.'
        },
        {
          title: 'Cost-Effective Solutions',
          description: 'Competitive pricing with transparent fees and no hidden costs. Save time and money with our efficient processes.'
        }
      ],
    },
    'tax-optimization': {
      title: 'Tax Optimization Services',
      description: 'Strategic tax planning and optimization to minimize your international tax burden legally and efficiently.',
      image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
      benefits: [
        'Legal tax minimization strategies',
        'International tax treaty optimization',
        'Transfer pricing guidance',
        'Tax residence planning',
        'Ongoing compliance support',
        'Regular tax efficiency reviews'
      ],
      advantages: [
        {
          title: 'Expert Tax Advisors',
          description: 'Certified tax professionals with deep knowledge of international tax laws and regulations across multiple jurisdictions.'
        },
        {
          title: 'Significant Savings',
          description: 'Our clients typically save 35-60% on their tax burden through legal optimization strategies and proper structuring.'
        },
        {
          title: 'Compliance Assurance',
          description: 'Stay fully compliant with all tax obligations while maximizing your tax efficiency through legitimate planning.'
        },
        {
          title: 'Ongoing Monitoring',
          description: 'Regular reviews and updates to ensure your tax strategy remains optimal as laws and circumstances change.'
        }
      ],
    },
    'banking-solutions': {
      title: 'International Banking Solutions',
      description: 'Comprehensive banking support for opening international accounts and establishing global financial relationships.',
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      benefits: [
        'International bank account opening assistance',
        'Multi-currency account setup',
        'Payment gateway integration support',
        'Banking relationship management',
        'Trade finance solutions',
        'Digital banking platform access'
      ],
      advantages: [
        {
          title: 'Banking Partnerships',
          description: 'Established relationships with top-tier banks across multiple jurisdictions for faster account opening processes.'
        },
        {
          title: 'Streamlined Process',
          description: 'Simplified documentation and application processes with our expert guidance and bank introductions.'
        },
        {
          title: 'Multi-Currency Support',
          description: 'Access to accounts supporting multiple currencies for seamless international business operations.'
        },
        {
          title: 'Ongoing Support',
          description: 'Continued assistance with banking needs, compliance requirements, and relationship management.'
        }
      ],
    },
    'visa-residency': {
      title: 'Visa & Residency Services',
      description: 'Complete visa and residency solutions for international business owners, investors, and their families.',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
      benefits: [
        'Investment visa and residency programs',
        'Business visa applications and renewals',
        'Family reunification services',
        'Citizenship by investment programs',
        'Permanent residency pathways',
        'Immigration compliance support'
      ],
      advantages: [
        {
          title: 'Immigration Expertise',
          description: 'Specialized immigration lawyers and consultants with extensive experience in multiple jurisdictions and visa categories.'
        },
        {
          title: 'Investment Programs',
          description: 'Access to exclusive investment immigration programs offering fast-track residency and citizenship options.'
        },
        {
          title: 'Family Solutions',
          description: 'Comprehensive support for including family members in your immigration journey with proper documentation.'
        },
        {
          title: 'Success Guarantee',
          description: 'High success rates with thorough preparation, documentation review, and application support throughout the process.'
        }
      ],
    },
    'market-research': {
      title: 'Market Research Services',
      description: 'In-depth market analysis and research for successful international business expansion and strategic decision-making.',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
      benefits: [
        'Comprehensive market analysis and sizing',
        'Competitive landscape assessment',
        'Consumer behavior and preference studies',
        'Regulatory environment analysis',
        'Entry strategy recommendations',
        'Risk assessment and mitigation planning'
      ],
      advantages: [
        {
          title: 'Local Market Intelligence',
          description: 'Access to local market experts and data sources across 19+ countries for accurate and current market insights.'
        },
        {
          title: 'Data-Driven Insights',
          description: 'Advanced analytics and research methodologies providing actionable insights for strategic business decisions.'
        },
        {
          title: 'Industry Expertise',
          description: 'Specialized knowledge across various industries and sectors with tailored research approaches for each market.'
        },
        {
          title: 'Strategic Recommendations',
          description: 'Practical, implementable strategies based on thorough market research and competitive analysis.'
        }
      ],
    }
  };

  const service = serviceData[serviceId || ''] || serviceData['company-formation'];
  const currentLanguage = t('language') === 'Türkçe' ? 'tr' : t('language') === 'Português' ? 'pt' : 'en';

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/services">
            <Button variant="ghost" icon={ArrowLeft} iconPosition="left">
              Back to Services
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-12">
          <div className="absolute inset-0">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
          </div>
          <div className="relative p-12 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl">
              {service.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Benefits */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold text-gray-900">What We Offer</h2>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.benefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Advantages */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold text-gray-900">Why Choose Our Global Network</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  {service.advantages.map((advantage: any, index: number) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
              <Card.Body className="text-center">
                <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6">
                  Connect with our expert advisors and begin your journey today.
                </p>
                <Button variant="secondary" size="lg" className="w-full">
                  Get Free Consultation
                </Button>
              </Card.Body>
            </Card>

            {/* Stats */}
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900">Our Track Record</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-bold text-green-600">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Clients Served</span>
                    <span className="font-bold">500+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Countries</span>
                    <span className="font-bold">19+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg. Processing Time</span>
                    <span className="font-bold">14 days</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Countries Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-6">
              <Globe className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-800 font-medium">{t('availableIn')} {allCountries.length} {t('countries')}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('whichCountryTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('whichCountrySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {allCountries.map((country, index) => (
              <div key={index} className="group">
                <Link to={`/countries/${country.id}`} className="block">
                 <>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100 hover:border-blue-200">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 text-4xl flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors duration-300">
                        {country.flag}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                        {country.name[currentLanguage as keyof typeof country.name]}
                      </h3>
                      <p className="text-xs text-blue-600 font-medium mb-4 leading-tight">
                        {country.highlight[currentLanguage as keyof typeof country.highlight]}
                      </p>
                    </div>
                  <Button variant="primary" size="sm" className="w-full mt-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 border-0">
                    {t('getStartedIn')}
                  </Button>
                 </>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;