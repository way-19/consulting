import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Building2, Globe, Users, Shield, CheckCircle, ArrowRight, User, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@consulting19/shared';

const OrderFormPage = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    country: '',
    
    // Company Information
    companyName: '',
    businessType: '',
    industry: '',
    description: '',
    
    // Service Selection
    jurisdiction: '',
    serviceType: '',
    additionalServices: [],
    
    // Requirements
    timeline: '',
    budget: '',
    specialRequirements: '',
  });

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Company Details', icon: Building2 },
    { id: 3, title: 'Service Selection', icon: Globe },
    { id: 4, title: 'Requirements', icon: Shield },
    { id: 5, title: 'Review & Submit', icon: CheckCircle },
  ];

  const jurisdictions = [
    { code: 'georgia', name: 'Georgia', flag: '🇬🇪', taxRate: '1%', setup: '1-2 days' },
    { code: 'estonia', name: 'Estonia', flag: '🇪🇪', taxRate: '20%', setup: '1-3 days' },
    { code: 'uae', name: 'UAE', flag: '🇦🇪', taxRate: '0%', setup: '3-5 days' },
    { code: 'ireland', name: 'Ireland', flag: '🇮🇪', taxRate: '12.5%', setup: '2-3 days' },
  ];

  const serviceTypes = [
    { id: 'llc', name: 'LLC Formation', description: 'Limited Liability Company setup' },
    { id: 'corp', name: 'Corporation', description: 'Corporate entity formation' },
    { id: 'ibc', name: 'International Business Company', description: 'IBC for international operations' },
    { id: 'holding', name: 'Holding Company', description: 'Investment holding structure' },
  ];

  const additionalServices = [
    { id: 'banking', name: 'Banking Setup', description: 'Corporate bank account opening' },
    { id: 'tax', name: 'Tax Planning', description: 'Tax optimization strategy' },
    { id: 'visa', name: 'Visa Services', description: 'Residence permit assistance' },
    { id: 'compliance', name: 'Ongoing Compliance', description: 'Annual reporting and maintenance' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitForm = async () => {
    try {
      // TODO: Implement form submission to Supabase
      console.log('Form submitted:', formData);
      
      // Redirect to success page
      window.location.href = '/success';
    } catch (error) {
      console.error('Error submitting form:', error);
      window.location.href = '/error';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Company Formation Order Form - Consulting19</title>
        <meta name="description" content="Start your international company formation process with our expert consultants. Professional setup in 19+ countries." />
      </Helmet>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C19</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Company Formation</span>
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {steps.find(s => s.id === currentStep)?.title}
            </h2>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h3>
                <p className="text-gray-600">Tell us about yourself to get started</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Country *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                      required
                    >
                      <option value="">Select your country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="TR">Turkey</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Company Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Company Details</h3>
                <p className="text-gray-600">Tell us about your business</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your desired company name"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      value={formData.businessType}
                      onChange={(e) => handleInputChange('businessType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="startup">Startup</option>
                      <option value="sme">Small-Medium Enterprise</option>
                      <option value="freelancer">Freelancer/Consultant</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="saas">SaaS/Tech</option>
                      <option value="trading">Trading Company</option>
                      <option value="holding">Investment Holding</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select industry</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="consulting">Consulting</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="realestate">Real Estate</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="crypto">Crypto/Blockchain</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your business activities and goals"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Service Selection */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Service Selection</h3>
                <p className="text-gray-600">Choose your jurisdiction and services</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select Jurisdiction *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jurisdictions.map((jurisdiction) => (
                    <div
                      key={jurisdiction.code}
                      onClick={() => handleInputChange('jurisdiction', jurisdiction.code)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.jurisdiction === jurisdiction.code
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{jurisdiction.flag}</span>
                        <h4 className="font-semibold text-gray-900">{jurisdiction.name}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Tax Rate:</span>
                          <span className="font-medium text-green-600 ml-1">{jurisdiction.taxRate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Setup:</span>
                          <span className="font-medium text-blue-600 ml-1">{jurisdiction.setup}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Service Type *
                </label>
                <div className="space-y-3">
                  {serviceTypes.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleInputChange('serviceType', service.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.serviceType === service.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Additional Services (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {additionalServices.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleArrayToggle('additionalServices', service.id)}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                        formData.additionalServices.includes(service.id)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          formData.additionalServices.includes(service.id)
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.additionalServices.includes(service.id) && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{service.name}</h4>
                          <p className="text-xs text-gray-600">{service.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Requirements */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Requirements</h3>
                <p className="text-gray-600">Help us understand your timeline and needs</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline *
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1-2weeks">1-2 weeks</option>
                    <option value="1month">1 month</option>
                    <option value="2-3months">2-3 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-2k">Under $2,000</option>
                    <option value="2k-5k">$2,000 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-plus">$10,000+</option>
                    <option value="discuss">Prefer to discuss</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements or Questions
                </label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any specific requirements, questions, or additional information..."
                />
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h3>
                <p className="text-gray-600">Please review your information before submitting</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Personal Information</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span className="font-medium">{formData.country}</span>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900">Company Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company Name:</span>
                      <span className="font-medium">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Type:</span>
                      <span className="font-medium">{formData.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">{formData.industry}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Service Selection</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jurisdiction:</span>
                      <span className="font-medium">
                        {jurisdictions.find(j => j.code === formData.jurisdiction)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Type:</span>
                      <span className="font-medium">
                        {serviceTypes.find(s => s.id === formData.serviceType)?.name}
                      </span>
                    </div>
                    {formData.additionalServices.length > 0 && (
                      <div>
                        <span className="text-gray-600">Additional Services:</span>
                        <div className="mt-1">
                          {formData.additionalServices.map(serviceId => (
                            <span key={serviceId} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                              {additionalServices.find(s => s.id === serviceId)?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <h4 className="font-semibold text-gray-900">Requirements</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeline:</span>
                      <span className="font-medium">{formData.timeline}</span>
                    </div>
                    {formData.budget && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium">{formData.budget}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {formData.specialRequirements && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Special Requirements</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{formData.specialRequirements}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
                <p className="text-blue-800 text-sm">
                  After submitting this form, our expert consultant will review your requirements and contact you 
                  within 24 hours to discuss your project and provide a detailed quote.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submitForm}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2"
              >
                <span>Submit Order</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Secure & Confidential</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">Expert Consultants</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span className="text-sm">19+ Countries</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFormPage;