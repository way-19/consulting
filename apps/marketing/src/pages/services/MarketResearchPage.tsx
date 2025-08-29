import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Search, Target, TrendingUp, Users, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const MarketResearchPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const processSteps = [
    {
      title: 'Market Analysis',
      description: 'Define objectives and scope; collect primary/secondary data to quantify demand and dynamics',
      icon: BarChart3,
    },
    {
      title: 'Competitive Research',
      description: 'Map players, offerings, pricing, and positioning to reveal white-space and threats',
      icon: Search,
    },
    {
      title: 'Strategy Development',
      description: 'Translate findings into entry strategy, messaging, and commercial model with KPIs',
      icon: Target,
    },
    {
      title: 'Implementation Support',
      description: 'Assist with partner outreach, pilots, and first-90-days tracking to validate results',
      icon: TrendingUp,
    },
  ];

  const services = [
    {
      title: 'Market Entry Analysis',
      description: 'Comprehensive market entry strategies that include demand sizing, route-to-market evaluation, pricing corridors analysis, and partner model assessment. Our market research specialists conduct thorough regulatory barrier analysis and competitive landscape mapping to deliver clear entry recommendations. These market entry services provide actionable insights for successful international expansion with detailed go-to-market strategies and risk mitigation plans.',
    },
    {
      title: 'Competitor Intelligence',
      description: 'Strategic competitor analysis covering competitive strategy and positioning, share-of-voice and share-of-shelf metrics, pricing and promotional strategies, and comprehensive strengths and risks assessment. Our competitive intelligence services produce tactical response plans with actionable market insights. These competitor analysis services help businesses understand market dynamics and develop effective competitive positioning strategies for sustainable market advantage.',
    },
    {
      title: 'Consumer Research',
      description: 'Advanced consumer insights using quantitative and qualitative research methods including surveys, interviews, and consumer panels for comprehensive market understanding. Our consumer research specialists develop detailed segmentation analysis, customer personas, and purchase drivers and barriers assessment. These consumer insights services translate research findings into actionable messaging strategies and user experience optimization recommendations for enhanced market penetration.',
    },
    {
      title: 'Industry Reports',
      description: 'Comprehensive industry analysis including Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM) calculations with detailed trend mapping and value chain analysis. Our industry report services provide technology roadmaps, scenario analysis, and board-ready strategic recommendations. These market intelligence reports deliver executive-level insights for informed business decision-making and strategic planning initiatives.',
    },
    {
      title: 'Regulatory Research',
      description: 'Detailed regulatory landscape analysis covering compliance requirements, licensing and permit procedures, implementation timelines and associated costs, and comprehensive monitoring of upcoming regulatory changes. Our regulatory analysis services help businesses de-risk international expansion through thorough compliance planning. These regulatory research services ensure smooth market entry while maintaining full legal compliance across target jurisdictions.',
    },
    {
      title: 'Partnership Opportunities',
      description: 'Strategic partnership identification services including comprehensive long-list and short-list development of potential distributors and integrators with detailed scoring matrices and evaluation criteria. Our partnership research includes customized outreach scripts and structured meeting pipeline development. These opportunity assessment services accelerate market entry through strategic alliances and reduce time-to-market for international business expansion initiatives.',
    },
  ];

  const featuredCountries = [
    {
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      tag: 'GCC Hub',
      highlight: 'Gateway to Gulf demand with strong B2B and fintech ecosystems',
      slug: 'united-arab-emirates',
    },
    {
      name: 'Estonia',
      flag: '🇪🇪',
      tag: 'Digital First',
      highlight: 'EU market with advanced digital infrastructure and e-services data',
      slug: 'estonia',
    },
    {
      name: 'Georgia',
      flag: '🇬🇪',
      tag: 'Growth',
      highlight: 'Fast-moving market for testing pricing and channel strategies',
      slug: 'georgia',
    },
    {
      name: 'Malta',
      flag: '🇲🇹',
      tag: 'EU Hub',
      highlight: 'EU access point for regulated sectors and maritime/aviation niches',
      slug: 'malta',
    },
    {
      name: 'Panama',
      flag: '🇵🇦',
      tag: 'Logistics',
      highlight: 'Canal-driven logistics cluster and LATAM gateway signals',
      slug: 'panama',
    },
    {
      name: 'Portugal',
      flag: '🇵🇹',
      tag: 'EU Access',
      highlight: 'Rising tech/nearshore hub with consumer and SME datasets',
      slug: 'portugal',
    },
    {
      name: 'United States',
      flag: '🇺🇸',
      tag: 'Markets',
      highlight: 'Deepest datasets and competitive benchmarks across categories',
      slug: 'united-states',
    },
    {
      name: 'Switzerland',
      flag: '🇨🇭',
      tag: 'Premium',
      highlight: 'High-value niches (medtech, finance) with rigorous regulatory data',
      slug: 'switzerland',
    },
    {
      name: 'Montenegro',
      flag: '🇲🇪',
      tag: 'Emerging',
      highlight: 'Cost-efficient testing ground with expanding EU-candidate alignment',
      slug: 'montenegro',
    },
  ];

  const faqs = [
    {
      id: 'best-route',
      question: 'Which market research approach is best for my business?',
      answer: 'The optimal research approach depends on your expansion goals, target markets, budget, and timeline requirements. We analyze your specific business model and objectives to recommend the most effective research methodology. Our assessment considers your industry dynamics, competitive landscape, and market maturity to design comprehensive market research that delivers actionable insights for successful international expansion.',
    },
    {
      id: 'research-costs',
      question: 'How much does comprehensive market research cost?',
      answer: 'Market research costs vary significantly based on scope, methodology, and geographic coverage requirements. Basic market entry analysis typically starts from $5,000, while comprehensive multi-market studies can range from $15,000 to $50,000+ depending on research depth and primary data collection needs. We provide transparent pricing with detailed scope definitions and deliverable specifications for all market research services.',
    },
    {
      id: 'research-timeline',
      question: 'How long does market research take to complete?',
      answer: 'Research timelines typically range from 4-12 weeks depending on study complexity, primary data collection requirements, and geographic scope. Desk research and competitive analysis can be completed in 4-6 weeks, while comprehensive consumer research with primary data collection may require 8-12 weeks. We provide detailed project timelines with milestone tracking throughout the entire market research process.',
    },
    {
      id: 'data-sources',
      question: 'What data sources do you use for market research?',
      answer: 'We utilize a comprehensive mix of primary and secondary data sources including industry databases, government statistics, trade associations, consumer surveys, expert interviews, and proprietary research partnerships. Our market research methodology combines quantitative analysis with qualitative insights to provide complete market intelligence. We ensure all data sources are credible, current, and relevant to your specific market research objectives.',
    },
    {
      id: 'actionable-insights',
      question: 'How do you ensure research insights are actionable?',
      answer: 'Our market research deliverables focus on strategic recommendations rather than raw data presentation. We translate research findings into specific go-to-market strategies, pricing recommendations, partnership opportunities, and risk mitigation plans. Each market research report includes executive summaries, implementation roadmaps, and success metrics to ensure insights drive concrete business decisions and measurable outcomes.',
    },
    {
      id: 'ongoing-support',
      question: 'Do you provide ongoing market monitoring after initial research?',
      answer: 'Yes, we offer ongoing market monitoring services to track competitive changes, regulatory updates, and market evolution after your initial market research project. Our continuous monitoring includes quarterly market updates, competitive intelligence alerts, and annual strategy reviews. This ongoing support ensures your market research investment continues delivering value as markets evolve and your business expands internationally.',
    },
  ];

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-pink-600 to-rose-600 text-white py-8 overflow-hidden">
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
                Market Research Services
              </h1>
              <p className="text-xl text-pink-100 leading-relaxed mb-8">
                Make informed decisions with data-driven market intelligence. Our researchers deliver deep insights on customers, competitors, regulations, and go-to-market opportunities across global markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact?topic=market-research">
                  <Button size="lg" className="bg-pink-600 text-white hover:bg-pink-700">
                    Get Market Analysis
                  </Button>
                </Link>
                <a href="#what-we-offer">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
                    View Research Options
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Market research analysis"
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section id="what-we-offer" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Data-driven market research and business intelligence services for informed expansion decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src="https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=400" 
                    alt=""
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Market Research Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Systematic approach to understanding markets and identifying opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <Card key={index} hover className="text-center h-full">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Market Research Destinations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading markets with comprehensive research capabilities and business opportunities
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
                  <div className="bg-pink-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-bold text-pink-900">{country.tag}</div>
                    <div className="text-xs text-pink-700">{country.highlight}</div>
                  </div>
                  <Link to={`/countries/${country.slug}`}>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="w-full"
                      aria-label={`Learn more about ${country.name} market research`}
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
              Common questions about market research services and business intelligence solutions
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
      <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Research Your Market?</h2>
          <p className="text-xl text-pink-100 mb-8">
            Get comprehensive market intelligence to drive confident expansion decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact?topic=market-research">
              <Button size="lg" className="bg-white text-pink-600 hover:bg-gray-100">
                Get Market Analysis
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
              Schedule Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MarketResearchPage;
