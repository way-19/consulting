import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Users, Globe, Clock, Star } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();

  const serviceData: { [key: string]: any } = {
    'company-formation': {
      badge: 'Global Business Setup',
      title: 'Seamless Global Company Formation',
      subtitle: 'From Idea to Incorporation',
      description: 'Fast, reliable, and cost-effective company formation services with local experts in 19+ countries and AI-powered process automation.',
      heroImage: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200',
      whatWeOffer: {
        title: 'Complete Company Formation Services',
        subtitle: 'Everything you need to establish your business globally',
        services: [
          {
            title: 'AI-Powered Jurisdiction Analysis',
            description: 'Our AI Oracle analyzes your business needs to recommend the most suitable country and tax structure.'
          },
          {
            title: 'Legal Document Preparation',
            description: 'Our experts handle all legal documents, government applications, and compliance requirements.'
          },
          {
            title: 'Digital Identity & e-Residency',
            description: 'We manage your digital identity and e-residency applications in Estonia and other countries.'
          },
          {
            title: 'Corporate Bank Account Opening',
            description: 'Corporate bank account opening, payment systems, and financial infrastructure setup.'
          },
          {
            title: 'Corporate Structure Design',
            description: 'Corporate structure design to maximize legal tax benefits.'
          },
          {
            title: 'AI-Powered Compliance Monitoring',
            description: 'AI-powered system monitors your legal obligations and compliance requirements.'
          }
        ]
      },
      process: {
        title: 'Our Proven Process',
        steps: [
          {
            title: 'Business Analysis',
            description: 'AI Oracle analyzes your business model and recommends optimal jurisdictions'
          },
          {
            title: 'Expert Matching',
            description: 'Connect with local experts in your chosen jurisdiction'
          },
          {
            title: 'Document Preparation',
            description: 'Complete all legal documentation and government filings'
          },
          {
            title: 'Company Registration',
            description: 'Official company registration and certificate issuance'
          },
          {
            title: 'Banking Setup',
            description: 'Corporate bank account opening and financial setup'
          },
          {
            title: 'Ongoing Support',
            description: 'Continuous compliance monitoring and business support'
          }
        ]
      },
      countries: [
        { name: 'UAE', flag: '🇦🇪', taxRate: '0%', setupTime: '7-14 days' },
        { name: 'Estonia', flag: '🇪🇪', taxRate: '20%', setupTime: '1-2 weeks' },
        { name: 'Georgia', flag: '🇬🇪', taxRate: '1%', setupTime: '3-5 days' },
        { name: 'Malta', flag: '🇲🇹', taxRate: '5%', setupTime: '2-3 weeks' }
      ]
    },
    'tax-optimization': {
      badge: 'Tax Strategy',
      title: 'Advanced Tax Optimization',
      subtitle: 'Minimize Your Global Tax Burden',
      description: 'Strategic tax planning and optimization services to legally minimize your tax obligations while maintaining full compliance.',
      heroImage: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=1200',
      whatWeOffer: {
        title: 'Comprehensive Tax Optimization Services',
        subtitle: 'Maximize your profits through strategic tax planning',
        services: [
          {
            title: 'International Tax Planning',
            description: 'Strategic planning to optimize your global tax structure across multiple jurisdictions.'
          },
          {
            title: 'Double Taxation Treaty Analysis',
            description: 'Leverage international tax treaties to minimize withholding taxes and avoid double taxation.'
          },
          {
            title: 'Transfer Pricing Strategies',
            description: 'Optimize inter-company transactions and intellectual property licensing for tax efficiency.'
          },
          {
            title: 'Holding Company Structures',
            description: 'Design optimal holding company structures for investment and operational efficiency.'
          },
          {
            title: 'Tax Residency Planning',
            description: 'Strategic personal and corporate tax residency planning for optimal tax outcomes.'
          },
          {
            title: 'Compliance Monitoring',
            description: 'Ongoing monitoring to ensure continued compliance with changing tax regulations.'
          }
        ]
      },
      process: {
        title: 'Tax Optimization Process',
        steps: [
          {
            title: 'Tax Assessment',
            description: 'Comprehensive analysis of your current tax situation and obligations'
          },
          {
            title: 'Strategy Development',
            description: 'Create customized tax optimization strategy based on your business'
          },
          {
            title: 'Structure Implementation',
            description: 'Implement recommended tax structures and entity formations'
          },
          {
            title: 'Documentation',
            description: 'Prepare all necessary legal and tax documentation'
          },
          {
            title: 'Compliance Setup',
            description: 'Establish ongoing compliance procedures and reporting'
          },
          {
            title: 'Monitoring',
            description: 'Continuous monitoring and optimization of tax strategies'
          }
        ]
      },
      countries: [
        { name: 'Malta', flag: '🇲🇹', taxRate: '5%', setupTime: '2-3 weeks' },
        { name: 'Estonia', flag: '🇪🇪', taxRate: '0%*', setupTime: '1-2 weeks' },
        { name: 'Georgia', flag: '🇬🇪', taxRate: '1%', setupTime: '3-5 days' },
        { name: 'UAE', flag: '🇦🇪', taxRate: '0%', setupTime: '7-14 days' }
      ]
    },
    'banking-solutions': {
      badge: 'Financial Services',
      title: 'Global Banking Solutions',
      subtitle: 'Secure International Banking',
      description: 'Comprehensive banking solutions including corporate account opening, payment systems, and financial infrastructure for global businesses.',
      heroImage: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=1200',
      whatWeOffer: {
        title: 'Complete Banking & Financial Services',
        subtitle: 'Everything you need for international financial operations',
        services: [
          {
            title: 'Corporate Bank Account Opening',
            description: 'Assistance with opening corporate bank accounts in major international banking centers.'
          },
          {
            title: 'Multi-Currency Accounts',
            description: 'Setup multi-currency accounts to handle international transactions efficiently.'
          },
          {
            title: 'Payment Gateway Integration',
            description: 'Integration of payment gateways and merchant services for online businesses.'
          },
          {
            title: 'Trade Finance Solutions',
            description: 'Letters of credit, trade financing, and international payment solutions.'
          },
          {
            title: 'Digital Banking Setup',
            description: 'Modern digital banking solutions and fintech integrations for seamless operations.'
          },
          {
            title: 'Compliance & Reporting',
            description: 'Banking compliance, AML procedures, and regulatory reporting assistance.'
          }
        ]
      },
      process: {
        title: 'Banking Setup Process',
        steps: [
          {
            title: 'Banking Assessment',
            description: 'Analyze your banking needs and recommend suitable institutions'
          },
          {
            title: 'Bank Selection',
            description: 'Choose the best banks based on your business requirements'
          },
          {
            title: 'Documentation',
            description: 'Prepare all required documents for account opening'
          },
          {
            title: 'Application Submission',
            description: 'Submit applications and coordinate with banking institutions'
          },
          {
            title: 'Account Activation',
            description: 'Complete account setup and initial deposit procedures'
          },
          {
            title: 'Integration',
            description: 'Integrate banking services with your business operations'
          }
        ]
      },
      countries: [
        { name: 'Switzerland', flag: '🇨🇭', taxRate: '11-24%', setupTime: '2-4 weeks' },
        { name: 'Singapore', flag: '🇸🇬', taxRate: '17%', setupTime: '2-3 weeks' },
        { name: 'UAE', flag: '🇦🇪', taxRate: '0%', setupTime: '2-4 weeks' },
        { name: 'Malta', flag: '🇲🇹', taxRate: '5%', setupTime: '3-4 weeks' }
      ]
    },
    'legal-compliance': {
      badge: 'Legal Services',
      title: 'Legal Compliance & Documentation',
      subtitle: 'Stay Compliant Globally',
      description: 'Comprehensive legal compliance services ensuring your business meets all regulatory requirements across international jurisdictions.',
      heroImage: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1200',
      whatWeOffer: {
        title: 'Complete Legal Compliance Services',
        subtitle: 'Ensure full regulatory compliance across all jurisdictions',
        services: [
          {
            title: 'Regulatory Compliance Assessment',
            description: 'Comprehensive review of all applicable regulations and compliance requirements.'
          },
          {
            title: 'Legal Documentation',
            description: 'Preparation of all legal documents, contracts, and regulatory filings.'
          },
          {
            title: 'Licensing & Permits',
            description: 'Obtain all necessary business licenses and permits for your operations.'
          },
          {
            title: 'Data Protection Compliance',
            description: 'GDPR, CCPA, and other data protection regulation compliance services.'
          },
          {
            title: 'Employment Law Compliance',
            description: 'Navigate international employment laws and worker protection regulations.'
          },
          {
            title: 'Ongoing Legal Monitoring',
            description: 'Continuous monitoring of regulatory changes and compliance updates.'
          }
        ]
      },
      process: {
        title: 'Legal Compliance Process',
        steps: [
          {
            title: 'Legal Assessment',
            description: 'Comprehensive review of your business and applicable regulations'
          },
          {
            title: 'Compliance Strategy',
            description: 'Develop comprehensive compliance strategy and procedures'
          },
          {
            title: 'Documentation',
            description: 'Prepare all required legal documents and filings'
          },
          {
            title: 'Implementation',
            description: 'Implement compliance procedures and obtain necessary permits'
          },
          {
            title: 'Training',
            description: 'Train your team on compliance requirements and procedures'
          },
          {
            title: 'Monitoring',
            description: 'Ongoing compliance monitoring and regulatory updates'
          }
        ]
      },
      countries: [
        { name: 'Germany', flag: '🇩🇪', taxRate: '30%', setupTime: '4-6 weeks' },
        { name: 'Netherlands', flag: '🇳🇱', taxRate: '25%', setupTime: '3-4 weeks' },
        { name: 'UK', flag: '🇬🇧', taxRate: '25%', setupTime: '2-3 weeks' },
        { name: 'France', flag: '🇫🇷', taxRate: '25%', setupTime: '4-5 weeks' }
      ]
    },
    'asset-protection': {
      badge: 'Wealth Protection',
      title: 'Asset Protection Strategies',
      subtitle: 'Secure Your Wealth',
      description: 'Advanced asset protection strategies to safeguard your wealth from legal risks, creditors, and economic uncertainties.',
      heroImage: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200',
      whatWeOffer: {
        title: 'Comprehensive Asset Protection Services',
        subtitle: 'Protect your wealth with proven strategies',
        services: [
          {
            title: 'Offshore Trust Structures',
            description: 'Establish offshore trusts for maximum asset protection and privacy.'
          },
          {
            title: 'International LLC Formation',
            description: 'Create protective LLC structures in asset-friendly jurisdictions.'
          },
          {
            title: 'Private Foundation Setup',
            description: 'Establish private foundations for long-term wealth preservation.'
          },
          {
            title: 'Captive Insurance Companies',
            description: 'Setup captive insurance companies for risk management and tax benefits.'
          },
          {
            title: 'International Investment Accounts',
            description: 'Diversify assets across multiple jurisdictions and investment vehicles.'
          },
          {
            title: 'Estate Planning',
            description: 'Comprehensive estate planning to protect wealth for future generations.'
          }
        ]
      },
      process: {
        title: 'Asset Protection Process',
        steps: [
          {
            title: 'Risk Assessment',
            description: 'Evaluate potential risks and vulnerabilities to your assets'
          },
          {
            title: 'Strategy Design',
            description: 'Design customized asset protection strategy for your situation'
          },
          {
            title: 'Structure Implementation',
            description: 'Implement protective structures and legal entities'
          },
          {
            title: 'Asset Transfer',
            description: 'Safely transfer assets to protective structures'
          },
          {
            title: 'Documentation',
            description: 'Complete all legal documentation and compliance requirements'
          },
          {
            title: 'Ongoing Management',
            description: 'Continuous management and optimization of protection strategies'
          }
        ]
      },
      countries: [
        { name: 'Cook Islands', flag: '🇨🇰', taxRate: '0%', setupTime: '3-4 weeks' },
        { name: 'Nevis', flag: '🇰🇳', taxRate: '0%', setupTime: '2-3 weeks' },
        { name: 'Panama', flag: '🇵🇦', taxRate: '0%*', setupTime: '2-4 weeks' },
        { name: 'Belize', flag: '🇧🇿', taxRate: '0%', setupTime: '1-2 weeks' }
      ]
    },
    'investment-advisory': {
      badge: 'Investment Strategy',
      title: 'Investment Advisory Services',
      subtitle: 'Maximize Your Returns',
      description: 'Professional investment advisory services to help you make informed decisions and maximize returns across global markets.',
      heroImage: 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1200',
      whatWeOffer: {
        title: 'Professional Investment Advisory',
        subtitle: 'Expert guidance for optimal investment decisions',
        services: [
          {
            title: 'Portfolio Analysis & Optimization',
            description: 'Comprehensive analysis and optimization of your investment portfolio.'
          },
          {
            title: 'International Market Research',
            description: 'In-depth research on global investment opportunities and market trends.'
          },
          {
            title: 'Alternative Investment Strategies',
            description: 'Access to alternative investments including real estate, private equity, and commodities.'
          },
          {
            title: 'Risk Management',
            description: 'Advanced risk assessment and management strategies for your investments.'
          },
          {
            title: 'Tax-Efficient Investing',
            description: 'Investment strategies optimized for tax efficiency across jurisdictions.'
          },
          {
            title: 'Wealth Preservation',
            description: 'Long-term wealth preservation strategies and succession planning.'
          }
        ]
      },
      process: {
        title: 'Investment Advisory Process',
        steps: [
          {
            title: 'Financial Assessment',
            description: 'Comprehensive assessment of your financial situation and goals'
          },
          {
            title: 'Risk Profiling',
            description: 'Determine your risk tolerance and investment preferences'
          },
          {
            title: 'Strategy Development',
            description: 'Create customized investment strategy aligned with your goals'
          },
          {
            title: 'Implementation',
            description: 'Execute investment strategy and establish necessary accounts'
          },
          {
            title: 'Monitoring',
            description: 'Continuous monitoring and performance tracking'
          },
          {
            title: 'Optimization',
            description: 'Regular strategy reviews and optimization based on performance'
          }
        ]
      },
      countries: [
        { name: 'Switzerland', flag: '🇨🇭', taxRate: '11-24%', setupTime: '2-4 weeks' },
        { name: 'Luxembourg', flag: '🇱🇺', taxRate: '24%', setupTime: '3-4 weeks' },
        { name: 'Singapore', flag: '🇸🇬', taxRate: '17%', setupTime: '2-3 weeks' },
        { name: 'UAE', flag: '🇦🇪', taxRate: '0%', setupTime: '2-3 weeks' }
      ]
    }
  };

  // Default to company-formation if service not found
  const service = serviceData[serviceId || 'company-formation'] || serviceData['company-formation'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <img
          src={service.heroImage}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-black/60"></div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-4xl">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-lg">
                <span className="text-white font-medium">{service.badge}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {service.title}
                <br />
                <span className="text-yellow-400">
                  {service.subtitle}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-10 max-w-3xl">
                {service.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 text-white hover:bg-blue-700 font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Free Consultation
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm font-semibold px-8 py-4 text-lg transition-all duration-300"
                >
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <Link to="/services">
            <Button variant="ghost" icon={ArrowLeft} iconPosition="left" className="text-white hover:bg-white/20">
              Back to Services
            </Button>
          </Link>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {service.whatWeOffer.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {service.whatWeOffer.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.whatWeOffer.services.map((item: any, index: number) => (
              <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {service.process.title}
            </h2>
            <p className="text-xl text-gray-600">
              Our streamlined approach ensures efficient and successful outcomes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.process.steps.map((step: any, index: number) => (
              <Card key={index} hover className="relative">
                <Card.Body>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 pr-12">
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Jurisdictions
            </h2>
            <p className="text-xl text-gray-600">
              Top destinations for this service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.countries.map((country: any, index: number) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="text-4xl mb-4">{country.flag}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {country.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax Rate:</span>
                      <span className="font-semibold text-green-600">{country.taxRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Setup Time:</span>
                      <span className="font-semibold">{country.setupTime}</span>
                    </div>
                  </div>
                  <Link to={`/countries/${country.name.toLowerCase()}`}>
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Learn More
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Connect with our experts and begin your {service.title.toLowerCase()} journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-4"
            >
              Start Free Consultation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4"
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;