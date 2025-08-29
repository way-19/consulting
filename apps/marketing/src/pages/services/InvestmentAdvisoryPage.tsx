import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Target, DollarSign, Globe, Shield, Sparkles, Landmark, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useState } from 'react';

const InvestmentAdvisoryPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const processSteps = [
    {
      title: 'Portfolio Analysis',
      description: 'Assess objectives, constraints, liquidity needs, and current exposures across asset classes and currencies',
      icon: TrendingUp,
    },
    {
      title: 'Strategy Development',
      description: 'Design a policy portfolio with risk budgets, benchmarks, and rebalancing rules tailored to goals',
      icon: BarChart3,
    },
    {
      title: 'Implementation',
      description: 'Execute across vetted managers and platforms; optimize fees, execution, and tax efficiency',
      icon: PieChart,
    },
    {
      title: 'Performance Monitoring',
      description: 'Ongoing reporting, variance analysis, and quarterly reviews to adjust the strategy',
      icon: Target,
    },
  ];

  const services = [
    {
      title: 'Portfolio Management',
      description: 'Professional portfolio management services with disciplined asset allocation and global diversification strategies. Our investment advisory specialists design customized portfolios that balance risk and return objectives while maintaining liquidity requirements. We provide ongoing portfolio monitoring, rebalancing, and performance reporting to ensure your investments remain aligned with your long-term wealth building goals and risk management parameters.',
    },
    {
      title: 'Alternative Investments',
      description: 'Exclusive access to alternative investments including private equity, hedge funds, real estate funds, and other institutional-quality opportunities. Our investment advisory team conducts thorough due diligence on alternative investment managers and structures to provide qualified investors with diversification beyond traditional markets. These alternative investments offer potential for enhanced returns and portfolio diversification through sophisticated risk management strategies.',
    },
    {
      title: 'Real Estate Investment',
      description: 'International real estate investment opportunities across premier global markets with comprehensive property management and optimization services. Our real estate investment specialists identify high-quality commercial and residential properties that provide stable income streams and capital appreciation potential. We handle all aspects of cross-border real estate transactions including due diligence, financing, and ongoing asset management for optimal investment performance.',
    },
    {
      title: 'Cryptocurrency Advisory',
      description: 'Professional cryptocurrency advisory services with comprehensive regulatory compliance and risk management frameworks. Our crypto compliance specialists provide strategic guidance on digital asset allocation, custody solutions, and tax-efficient structures for cryptocurrency investments. We ensure full regulatory compliance across jurisdictions while maximizing the potential of blockchain-based investment opportunities through sophisticated portfolio management and security protocols.',
    },
    {
      title: 'ESG Investing',
      description: 'Environmental, social, and governance focused investment strategies that align financial returns with sustainable impact objectives. Our ESG investing specialists identify opportunities that meet strict sustainability criteria while delivering competitive investment performance. We provide comprehensive ESG analysis, impact measurement, and reporting services to ensure your investment portfolio reflects your values while achieving long-term wealth planning objectives.',
    },
    {
      title: 'Wealth Planning',
      description: 'Comprehensive wealth planning services including estate planning, tax optimization, and intergenerational wealth transfer strategies. Our wealth planning specialists design sophisticated structures that preserve and grow family wealth across generations while minimizing tax liability. We provide holistic financial planning that integrates investment advisory services with estate planning, philanthropy, and family governance for sustainable wealth management and legacy preservation.',
    },
  ];

  const featuredCountries = [
    {
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      tag: 'Free Zones',
      highlight: 'Access ADGM/DIFC ecosystem and global markets',
      slug: 'united-arab-emirates',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      tag: 'Digital First',
      highlight: 'EU access with advanced digital infrastructure',
      slug: 'estonia',
    },
    {
      name: 'Georgia',
      flag: '🇬🇪',
      tag: 'Growth',
      highlight: 'Efficient setup and favorable operating environment',
      slug: 'georgia',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      tag: 'EU Hub',
      highlight: 'EU-compliant structures supporting funds and SPVs',
      slug: 'malta',
    },
    {
      name: 'Panama',
      flag: '🇵🇦',
      tag: 'Territorial',
      highlight: 'Territorial system with international banking links',
      slug: 'panama',
    },
    {
      name: 'Portugal',
      flag: '🇵🇹',
      tag: 'EU Access',
      highlight: 'EU market access and investor residency routes',
      slug: 'portugal',
    },
    {
      name: 'United States',
      flag: '🇺🇸',
      tag: 'Markets',
      highlight: 'Deepest capital markets and manager universe',
      slug: 'united-states',
    },
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      tag: 'Premium',
      highlight: 'Top-tier wealth management and stability',
      slug: 'switzerland',
    },
    {
      name: 'Montenegro',
      flag: '🇲🇪',
      tag: 'Residency',
      highlight: 'Business-friendly policies with residency options',
      slug: 'montenegro',
    },
  ];

  const faqs = [
    {
      id: 'investment-minimums',
      question: 'What are the minimum investment requirements?',
      answer: 'Investment minimums vary by strategy and jurisdiction, typically starting from $100,000 for managed portfolios and $250,000 for alternative investments. Our investment advisory team works with qualified investors to design appropriate allocation strategies. We provide access to institutional-quality opportunities while ensuring proper diversification and risk management across all investment advisory services.',
    },
    {
      id: 'portfolio-diversification',
      question: 'How do you ensure proper portfolio diversification?',
      answer: 'We implement systematic diversification across asset classes, geographies, currencies, and investment styles to optimize risk-adjusted returns. Our portfolio management approach uses modern portfolio theory combined with alternative investments to reduce correlation and enhance long-term performance. Regular rebalancing and risk monitoring ensure your investment portfolio maintains optimal diversification through changing market conditions.',
    },
    {
      id: 'alternative-investments',
      question: 'What alternative investments do you offer access to?',
      answer: 'Our alternative investments platform provides access to private equity, hedge funds, real estate funds, commodities, and other institutional opportunities. We conduct thorough due diligence on all alternative investment managers and structures. These investments offer potential for enhanced returns and portfolio diversification beyond traditional public markets through sophisticated investment advisory strategies.',
    },
    {
      id: 'tax-efficiency',
      question: 'How do you optimize tax efficiency in investment portfolios?',
      answer: 'We integrate tax-efficient investment strategies including asset location optimization, tax-loss harvesting, and jurisdiction-specific structures to minimize tax drag on investment returns. Our wealth planning specialists coordinate with tax advisors to ensure investment advisory services align with overall tax optimization objectives. We utilize tax-advantaged accounts and structures where appropriate to maximize after-tax investment performance.',
    },
    {
      id: 'esg-investing',
      question: 'What ESG investing options are available?',
      answer: 'Our ESG investing platform offers comprehensive sustainable investment strategies that integrate environmental, social, and governance factors with financial analysis. We provide access to ESG-focused funds, impact investments, and sustainable alternative investments that meet strict sustainability criteria. Our investment advisory team ensures ESG investing strategies deliver competitive returns while aligning with your values and impact objectives.',
    },
    {
      id: 'performance-reporting',
      question: 'How do you report investment performance?',
      answer: 'We provide comprehensive performance reporting including portfolio analytics, benchmark comparisons, and risk metrics on a quarterly basis. Our investment advisory platform delivers real-time portfolio monitoring with detailed attribution analysis and variance reporting. Clients receive transparent performance measurement that includes all fees, taxes, and transaction costs for accurate assessment of investment advisory results and wealth planning progress.',
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-pink-600 text-white py-8 overflow-hidden">
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
                Investment Advisory Services
              </h1>
              <p className="text-xl text-red-100 leading-relaxed mb-8">
                Maximize long-term returns with disciplined, globally diversified strategies. Our advisors deliver tailored asset allocation, risk management, and access to qualified opportunities across public and private markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-red-600 text-white hover:bg-red-700">
                  Get Investment Plan
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                  View Investment Options
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Investment advisory"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FidelKey Promo */}
      <section className="py-8" aria-labelledby="fidelkey-title">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src="https://images.pexels.com/photos/8293687/pexels-photo-8293687.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-700/90 via-purple-700/85 to-rose-600/80" />
            </div>

            {/* Content */}
            <div className="relative p-6 md:p-8 lg:p-10 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 ring-1 ring-white/25 text-sm font-semibold mb-4">
                <span>🔷 Premium</span>
              </div>

              <h3 id="fidelkey-title" className="text-2xl md:text-3xl font-bold leading-tight">
                FidelKey — Secured Title Investment System
              </h3>
              <p className="mt-3 text-white/90 max-w-3xl">
                International visa pathways, financial returns, and real-estate ownership
                through a collateralized title model designed for compliant cross-border investing.
              </p>

              {/* Bullets */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-sm">Secured title structure</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-white" />
                  <span className="text-sm">International visa/residency options</span>
                </div>
                <div className="flex items-center gap-3">
                  <Landmark className="w-5 h-5 text-white" />
                  <span className="text-sm">Rental/dividend yield potential</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8">
                <a
                  href="https://fidelkey.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button size="lg" className="bg-amber-400 text-black hover:bg-amber-300">
                    Explore FidelKey
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional investment advisory services for sophisticated investors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=400" 
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Investment Advisory Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Systematic approach to building and managing your investment portfolio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Premier Investment Jurisdictions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading financial centers for investment management and wealth preservation
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
                  <div className="bg-red-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-bold text-red-900">{country.tag}</div>
                    <div className="text-xs text-red-700">{country.highlight}</div>
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
              Common questions about investment advisory services and wealth management strategies
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
      <section className="py-16 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Wealth?</h2>
          <p className="text-xl text-red-100 mb-8">
            Start building a diversified global investment portfolio today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              Start Investing
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestmentAdvisoryPage