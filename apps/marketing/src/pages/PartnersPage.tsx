import React from 'react';
import { useState } from 'react';
import { Users, Globe, Zap, Shield, Award, Target, ArrowRight, Building2, TrendingUp, CheckCircle, Mail, Phone } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useLanguage } from '@consulting19/shared';

const PartnersPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    expertise: [] as string[],
    experience: '',
    languages: '',
    qualifications: '',
    motivation: '',
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleExpertiseChange = (area: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(area)
        ? prev.expertise.filter(item => item !== area)
        : [...prev.expertise, area]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate expertise selection
    if (formData.expertise.length < 4) {
      alert('Please select at least 4 expertise areas to proceed with your application.');
      return;
    }
    
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        country: '',
        expertise: [],
        experience: '',
        languages: '',
        qualifications: '',
        motivation: '',
        acceptTerms: false,
      });
    }, 2000);
  };

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

  const countries = [
    'United States', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
    'Canada', 'Australia', 'Singapore', 'UAE', 'Estonia', 'Malta', 'Georgia',
    'Portugal', 'Netherlands', 'Switzerland', 'Panama', 'Montenegro', 'Other'
  ];

  const expertiseAreas = [
    'Company Formation & Corporate Law',
    'Tax Planning & Optimization',
    'Banking & Financial Services',
    'Immigration & Visa Services',
    'Legal Compliance & Regulatory',
    'Asset Protection & Wealth Management',
    'Investment Advisory',
    'Market Research & Business Development',
    'Other'
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-0">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card>
            <Card.Body className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your interest in becoming a partner. Our team will review your application and get back to you within 5-7 business days.
              </p>
              <Button onClick={() => setSuccess(false)} variant="outline">
                Submit Another Application
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-0">
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
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Apply to Join Our Partner Network
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Complete the application form below to join our global network of expert consultants.
          </p>
          
          {/* Important Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-amber-800 mb-1">Important Notice</h3>
                <p className="text-amber-700 text-sm">
                  If we already have an established consultant in your country and expertise area, 
                  your application may not be considered at this time. We maintain exclusive 
                  partnerships to ensure quality service delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-semibold text-gray-900">Partner Application Form</h2>
              <p className="text-gray-600 mt-2">Please provide detailed information about your background and expertise.</p>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country/Jurisdiction *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select your country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Background</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expertise Areas * (Select at least 4)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                        {expertiseAreas.map(area => (
                          <label key={area} className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={formData.expertise.includes(area)}
                              onChange={() => handleExpertiseChange(area)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-700">{area}</span>
                          </label>
                        ))}
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Selected: {formData.expertise.length} / {expertiseAreas.length} 
                        {formData.expertise.length < 4 && (
                          <span className="text-red-600 ml-2">
                            (Minimum 4 required)
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Years of Experience *
                      </label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select experience level</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10-15">10-15 years</option>
                        <option value="15-20">15-20 years</option>
                        <option value="20+">20+ years</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Languages Spoken *
                      </label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., English (Native), Spanish (Fluent), French (Conversational)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Qualifications *
                      </label>
                      <textarea
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="List your relevant degrees, certifications, licenses, and professional memberships..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Why do you want to join Consulting19? *
                      </label>
                      <textarea
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your motivation, goals, and how you can contribute to our network..."
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the Terms of Service and Privacy Policy, and I confirm that all information provided is accurate and complete. *
                    </span>
                  </label>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full" 
                  loading={loading}
                  disabled={loading || !formData.acceptTerms || formData.expertise.length < 4}
                >
                  {loading ? 'Submitting Application...' : 'Submit Partner Application'}
                </Button>
              </form>
            </Card.Body>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;