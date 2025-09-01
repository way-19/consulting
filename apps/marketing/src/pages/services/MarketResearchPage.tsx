import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, BarChart3, Globe, MessageSquare, Calendar, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MarketResearchPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Comprehensive market analysis and sizing',
    'Competitive landscape mapping',
    'Consumer behavior and preferences study',
    'Regulatory environment analysis',
    'Market entry strategy development',
    'Pricing strategy and optimization',
    'Distribution channel analysis',
    'Risk assessment and mitigation',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Research Scope Definition',
      description: 'Define research objectives, target markets, and key questions',
      duration: '1-2 days',
    },
    {
      step: 2,
      title: 'Data Collection Strategy',
      description: 'Design comprehensive data collection methodology',
      duration: '2-3 days',
    },
    {
      step: 3,
      title: 'Primary Research',
      description: 'Conduct surveys, interviews, and focus groups',
      duration: '2-4 weeks',
    },
    {
      step: 4,
      title: 'Secondary Research',
      description: 'Analyze industry reports, government data, and market studies',
      duration: '1-2 weeks',
    },
    {
      step: 5,
      title: 'Data Analysis',
      description: 'Process and analyze all collected data and insights',
      duration: '1 week',
    },
    {
      step: 6,
      title: 'Report & Recommendations',
      description: 'Deliver comprehensive report with actionable recommendations',
      duration: '3-5 days',
    },
  ];

  const researchTypes = [
    {
      title: 'Market Entry Research',
      description: 'Comprehensive analysis for new market entry',
      icon: Target,
      features: ['Market size & growth', 'Competitive analysis', 'Entry barriers', 'Success factors'],
      deliverables: ['Market assessment', 'Entry strategy', 'Risk analysis', 'Action plan'],
    },
    {
      title: 'Competitive Intelligence',
      description: 'Deep dive into competitive landscape',
      icon: BarChart3,
      features: ['Competitor profiling', 'SWOT analysis', 'Market positioning', 'Pricing strategies'],
      deliverables: ['Competitor profiles', 'Market map', 'Positioning matrix', 'Strategic recommendations'],
    },
    {
      title: 'Consumer Research',
      description: 'Understanding target customer behavior',
      icon: Users,
      features: ['Customer segmentation', 'Buying behavior', 'Preferences study', 'Journey mapping'],
      deliverables: ['Customer personas', 'Behavior insights', 'Journey maps', 'Targeting strategy'],
    },
    {
      title: 'Regulatory Research',
      description: 'Legal and regulatory environment analysis',
      icon: Shield,
      features: ['Regulatory framework', 'Compliance requirements', 'Policy changes', 'Risk assessment'],
      deliverables: ['Regulatory guide', 'Compliance checklist', 'Risk matrix', 'Monitoring plan'],
    },
  ];

  const faqs = [
    {
      question: 'How long does market research typically take?',
      answer: 'Research duration varies by scope and complexity, typically ranging from 4-12 weeks for comprehensive studies. Simple market assessments can be completed in 2-3 weeks.',
    },
    {
      question: 'What markets do you cover?',
      answer: 'We conduct research in all major global markets, with particular expertise in Europe, Asia-Pacific, Middle East, and North America through our network of local researchers.',
    },
    {
      question: 'Do you provide ongoing market monitoring?',
      answer: 'Yes, we offer ongoing market monitoring services to track changes in competitive landscape, regulatory environment, and market conditions.',
    },
    {
      question: 'What research methodologies do you use?',
      answer: 'We use both quantitative and qualitative methods including surveys, interviews, focus groups, desk research, and data analytics to provide comprehensive insights.',
    },
    {
      question: 'Can you help with market entry strategy?',
      answer: 'Absolutely. Beyond research, we provide strategic recommendations for market entry including go-to-market strategy, partnership opportunities, and implementation planning.',
    },
    {
      question: 'How much does market research cost?',
      answer: 'Costs vary based on research scope, methodology, and market complexity. We provide customized quotes based on your specific research requirements.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Market Research Services - International Market Intelligence - Consulting19</title>
        <meta name="description" content="Professional market research and intelligence services. Expert analysis for market entry, competitive intelligence, and consumer insights." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/services">
              <Button variant="outline" icon={ArrowLeft} iconPosition="left">
                Back to Services
              </Button>
            </Link>
          </div>
          
          <div className="max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Market Research Services
            </h1>
            <p className="text-xl text-pink-100 mb-8 leading-relaxed">
              Professional market intelligence and business research services. 
              Expert analysis to guide your international expansion decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Research Specialist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Research Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Research Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Research Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {researchTypes.map((type, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <type.icon className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{type.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{type.description}</p>
                  
                  <div className="space-y-1 mb-4">
                    <h4 className="text-xs font-medium text-gray-900">Features:</h4>
                    {type.features.map((feature, i) => (
                      <div key={i} className="text-xs text-gray-700 flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-gray-900">Deliverables:</h4>
                    {type.deliverables.map((deliverable, i) => (
                      <div key={i} className="text-xs text-gray-600">
                        • {deliverable}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Research Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <Card.Body>
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center group-open:bg-pink-600 transition-colors">
                        <span className="text-pink-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
                      </div>
                    </summary>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Research Your Target Market?</h2>
              <p className="text-pink-100 mb-8 max-w-2xl mx-auto">
                Get comprehensive market intelligence and strategic insights to guide your international expansion decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Market Research
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join for Research Consultation
                </Button>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default MarketResearchPage;