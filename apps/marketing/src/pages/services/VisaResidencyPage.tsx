import React from 'react';
import { ArrowLeft, CheckCircle, Clock, DollarSign, FileText, Users, Shield, Plane, Globe, MessageSquare, Calendar, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../lib/language';
import { Button, Card } from '../../lib/ui';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const VisaResidencyPage = () => {
  const { t } = useLanguage();

  const serviceFeatures = [
    'Visa eligibility assessment and planning',
    'Residence permit application assistance',
    'Golden visa and investment programs',
    'Citizenship by investment guidance',
    'Document preparation and review',
    'Application submission and tracking',
    'Interview preparation and support',
    'Renewal and maintenance services',
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Eligibility Assessment',
      description: 'Evaluate your eligibility for various visa and residency programs',
      duration: '1-2 days',
    },
    {
      step: 2,
      title: 'Program Selection',
      description: 'Recommend optimal visa/residency program based on your goals',
      duration: '1-2 days',
    },
    {
      step: 3,
      title: 'Document Collection',
      description: 'Gather and prepare all required documentation',
      duration: '1-2 weeks',
    },
    {
      step: 4,
      title: 'Application Preparation',
      description: 'Complete application forms and supporting materials',
      duration: '3-5 days',
    },
    {
      step: 5,
      title: 'Submission & Processing',
      description: 'Submit application and monitor processing status',
      duration: '2-12 weeks',
    },
    {
      step: 6,
      title: 'Approval & Follow-up',
      description: 'Receive approval and complete final requirements',
      duration: '1-2 weeks',
    },
  ];

  const visaPrograms = [
    {
      title: 'Golden Visa Programs',
      description: 'Investment-based residency programs',
      icon: DollarSign,
      features: ['Real estate investment', 'Business investment', 'Government bonds', 'Job creation'],
      countries: ['Portugal', 'Spain', 'Greece', 'Malta'],
      investment: '$280K - $500K',
    },
    {
      title: 'Entrepreneur Visas',
      description: 'Business and startup visa programs',
      icon: Users,
      features: ['Business plan required', 'Job creation goals', 'Innovation focus', 'Mentorship programs'],
      countries: ['Canada', 'Australia', 'UK', 'Netherlands'],
      investment: '$50K - $200K',
    },
    {
      title: 'Digital Nomad Visas',
      description: 'Remote work and digital nomad programs',
      icon: Globe,
      features: ['Remote work allowed', 'Tax benefits', 'Flexible requirements', 'Fast processing'],
      countries: ['Estonia', 'Portugal', 'Barbados', 'Dubai'],
      investment: 'Income requirement',
    },
    {
      title: 'Citizenship Programs',
      description: 'Citizenship by investment programs',
      icon: Home,
      features: ['Full citizenship', 'Passport benefits', 'Family inclusion', 'No residency requirement'],
      countries: ['Malta', 'Cyprus', 'Caribbean', 'Vanuatu'],
      investment: '$150K - $1M+',
    },
  ];

  const faqs = [
    {
      question: 'What is the difference between a visa and residence permit?',
      answer: 'A visa allows temporary entry to a country, while a residence permit allows you to live there for extended periods. Residence permits often lead to permanent residency or citizenship.',
    },
    {
      question: 'How long do visa applications typically take?',
      answer: 'Processing times vary significantly by country and visa type, ranging from 2 weeks for tourist visas to 6-12 months for investment-based residency programs.',
    },
    {
      question: 'Can my family be included in my visa application?',
      answer: 'Most residency and investment programs allow inclusion of spouse and dependent children. Some programs also include parents or other family members.',
    },
    {
      question: 'What are the tax implications of obtaining residency?',
      answer: 'Tax implications vary by country and your specific situation. We provide comprehensive tax planning to optimize your global tax position with new residency.',
    },
    {
      question: 'Do I need to live in the country to maintain my residency?',
      answer: 'Requirements vary by program. Some require minimal physical presence (7-14 days annually), while others have no residency requirements for investment-based programs.',
    },
    {
      question: 'Can residency lead to citizenship?',
      answer: 'Many residency programs provide a pathway to citizenship after 3-10 years, depending on the country and program requirements.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Visa & Residency Services - Immigration and Citizenship Programs - Consulting19</title>
        <meta name="description" content="Professional visa and residency services. Expert guidance for golden visas, entrepreneur programs, and citizenship by investment." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-14 mt-16">
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
                <Plane className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Visa & Residency Services
            </h1>
            <p className="text-lg text-orange-100 mb-6 leading-relaxed">
              Professional immigration and residency planning services. Expert guidance for 
              golden visas, entrepreneur programs, and citizenship by investment opportunities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                icon={MessageSquare}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Contact Immigration Specialist
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                icon={Calendar}
                onClick={() => window.open('/auth?mode=register', '_blank')}
              >
                Join to Schedule Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Visa Programs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Visa & Residency Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaPrograms.map((program, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <program.icon className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{program.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{program.description}</p>
                  
                  <div className="space-y-1 mb-4">
                    {program.features.map((feature, i) => (
                      <div key={i} className="text-xs text-gray-700 flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    <strong>Investment:</strong> {program.investment}
                  </div>
                  <div className="text-xs text-gray-500">
                    <strong>Available in:</strong> {program.countries.join(', ')}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Process Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Application Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <Card key={index}>
                <Card.Body>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
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
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-orange-600" />
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
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center group-open:bg-orange-600 transition-colors">
                        <span className="text-orange-600 group-open:text-white text-lg font-bold group-open:rotate-45 transition-all">+</span>
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
          <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Immigration Journey?</h2>
              <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
                Get expert guidance for visa applications, residency programs, and citizenship opportunities worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join to Start Visa Application
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => window.open('/auth?mode=register', '_blank')}
                >
                  Join for Immigration Assessment
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

export default VisaResidencyPage;