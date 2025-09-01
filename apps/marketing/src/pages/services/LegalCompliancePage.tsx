import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Scale, Globe, MessageSquare, Calendar, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const LegalCompliancePage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Comprehensive compliance monitoring',
    'Contract review and drafting',
    'Legal structure optimization',
    'Intellectual property protection',
    'Data protection compliance (GDPR)',
    'Employment law guidance',
    'Regulatory change monitoring',
    'Legal risk assessment',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Legal Risk Assessment',
      description: 'Comprehensive review of your legal compliance requirements',
      duration: '2-3 days',
    },
    {
      step: 2,
      title: 'Compliance Framework Design',
      description: 'Design customized compliance framework for your business',
      duration: '3-5 days',
    },
    {
      step: 3,
      title: 'Legal Documentation',
      description: 'Prepare and review all necessary legal documentation',
      duration: '1-2 weeks',
    },
    {
      step: 4,
      title: 'Implementation Support',
      description: 'Implement compliance procedures and train your team',
      duration: '1 week',
    },
    {
      step: 5,
      title: 'Monitoring Setup',
      description: 'Establish ongoing monitoring and reporting systems',
      duration: '2-3 days',
    },
    {
      step: 6,
      title: 'Ongoing Support',
      description: 'Continuous legal support and compliance updates',
      duration: 'Ongoing',
    },
  ];

  const complianceAreas = [
    {
      title: 'Corporate Governance',
      description: 'Board resolutions, shareholder agreements, corporate records',
      icon: Users,
      requirements: ['Board meetings', 'Annual filings', 'Corporate records', 'Shareholder rights'],
    },
    {
      title: 'Regulatory Compliance',
      description: 'Industry-specific regulations and licensing requirements',
      icon: Shield,
      requirements: ['License maintenance', 'Regulatory reporting', 'Industry standards', 'Audit compliance'],
    },
    {
      title: 'Data Protection',
      description: 'GDPR, privacy laws, and data security compliance',
      icon: FileText,
      requirements: ['Privacy policies', 'Data processing', 'Security measures', 'Breach procedures'],
    },
    {
      title: 'Employment Law',
      description: 'Employment contracts, labor law, and HR compliance',
      icon: Scale,
      requirements: ['Employment contracts', 'Labor standards', 'Benefits compliance', 'Termination procedures'],
    },
  ];

  const faqs = [
    {
      question: 'What legal compliance requirements apply to international businesses?',
      answer: 'Requirements vary by jurisdiction but typically include corporate governance, tax compliance, employment law, data protection, and industry-specific regulations.',
    },
    {
      question: 'How do you stay updated with changing regulations?',
      answer: 'We maintain relationships with legal experts in each jurisdiction and use automated monitoring systems to track regulatory changes and updates.',
    },
    {
      question: 'What happens if my business falls out of compliance?',
      answer: 'Non-compliance can result in fines, penalties, or business closure. We provide proactive monitoring and immediate remediation support to prevent issues.',
    },
    {
      question: 'Do you provide legal representation in court?',
      answer: 'We work with qualified local attorneys in each jurisdiction who can provide legal representation when needed. We coordinate all legal proceedings on your behalf.',
    },
    {
      question: 'How much does ongoing legal compliance cost?',
      answer: 'Costs depend on business complexity and jurisdiction requirements. We offer flexible packages from basic compliance monitoring to comprehensive legal support.',
    },
    {
      question: 'Can you help with contract negotiations?',
      answer: 'Yes, we provide contract review, drafting, and negotiation support through our network of qualified legal professionals in each jurisdiction.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Legal Compliance Services - International Business Law - Consulting19</title>
        <meta name="description" content="Comprehensive legal compliance services for international businesses. Expert guidance for regulatory compliance, contracts, and legal risk management." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-20 mt-16">
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
                <Scale className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Legal Compliance Services
            </h1>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Comprehensive legal and regulatory compliance for international businesses. 
              Expert guidance to ensure your business operates within all legal requirements.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Legal Specialist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Legal Review
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Compliance Areas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Compliance Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceAreas.map((area, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <area.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{area.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{area.description}</p>
                  
                  <div className="space-y-1">
                    {area.requirements.map((req, i) => (
                      <div key={i} className="text-xs text-gray-700 flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>{req}</span>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Compliance Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
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

        {/* What's Included */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature}</p>
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
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center group-open:bg-red-600 transition-colors">
                        <span className="text-red-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Ensure Legal Compliance?</h2>
              <p className="text-red-100 mb-8 max-w-2xl mx-auto">
                Protect your business with comprehensive legal compliance services and expert guidance from qualified professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Legal Review
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join for Compliance Assessment
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

export default LegalCompliancePage;