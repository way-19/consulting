import React from 'react';
import { Users, Globe, Zap, Shield, Award, Target, ArrowRight, Building2, TrendingUp, CheckCircle, Mail, Phone } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const PartnersPage = () => {
  const { t } = useLanguage();

  const partnerBenefits = [
    {
      icon: Globe,
      title: 'Global Network Access',
      description: 'Join our network of expert consultants across 19+ countries.',
    },
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Get matched with qualified clients through our AI Oracle system.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Enterprise-grade security for all client interactions and documents.',
    },
    {
      icon: Award,
      title: 'Competitive Earnings',
      description: 'Earn 65% of project fees with transparent payment processing.',
    },
  ];

  const requirements = [
    'Professional qualifications in your field',
    'Minimum 5 years of relevant experience',
    'Local expertise in target jurisdiction',
    'Fluency in English and local language',
    'Professional liability insurance',
    'Clean background check',
  ];

  const partnerTypes = [
    {
      title: 'Business Formation Specialists',
      description: 'Help clients establish companies and navigate local regulations.',
      expertise: ['Company registration', 'Legal compliance', 'Local licensing'],
    },
    {
      title: 'Tax Advisors',
      description: 'Provide tax optimization and international tax planning services.',
      expertise: ['Tax planning', 'Transfer pricing', 'Treaty optimization'],
    },
    {
      title: 'Banking Specialists',
      description: 'Assist with corporate banking and account opening services.',
      expertise: ['Account opening', 'Banking relationships', 'Payment solutions'],
    },
    {
      title: 'Immigration Lawyers',
      description: 'Guide clients through visa and residency applications.',
      expertise: ['Visa applications', 'Residency programs', 'Citizenship services'],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Become a Partner
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join our global network of expert consultants and help entrepreneurs expand their businesses internationally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Apply to Join
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner with Us?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join a platform that values expertise and provides the tools you need to succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {partnerBenefits.map((benefit, index) => (
            <Card key={index} hover className="text-center h-full">
              <Card.Body>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </Card.Body>
            </Card>
          ))}
        </div>
      </section>

      {/* Partner Types */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partner Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're looking for qualified professionals in various specialties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnerTypes.map((type, index) => (
              <Card key={index} hover>
                <Card.Body>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {type.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Key Expertise:</h4>
                    <ul className="space-y-1">
                      {type.expertise.map((skill, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partner Requirements</h2>
            <p className="text-xl text-gray-600">
              We maintain high standards to ensure quality service for our clients.
            </p>
          </div>

          <Card>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Process</h2>
            <p className="text-xl text-gray-600">
              Simple steps to join our partner network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Submit Application', description: 'Complete our partner application form with your credentials.' },
              { step: 2, title: 'Review Process', description: 'Our team reviews your qualifications and experience.' },
              { step: 3, title: 'Interview', description: 'Video interview to discuss your expertise and goals.' },
              { step: 4, title: 'Onboarding', description: 'Complete onboarding and start receiving client matches.' },
            ].map((step, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Join Our Network?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start earning by helping entrepreneurs achieve their global expansion goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" icon={ArrowRight} iconPosition="right">
              Apply Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" icon={Mail} iconPosition="left">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;