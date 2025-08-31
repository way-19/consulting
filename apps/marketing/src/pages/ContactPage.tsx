import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Calendar, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useLanguage, Button, Card } from '@consulting19/shared';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    country: '',
    subject: '',
    message: '',
    serviceInterest: '',
  });
  const [sending, setSending] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      company: '',
      country: '',
      subject: '',
      message: '',
      serviceInterest: '',
    });
    setSending(false);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours',
      contact: 'support@consulting19.com',
      action: 'mailto:support@consulting19.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak directly with our team during business hours',
      contact: '+1 (555) 123-4567',
      action: 'tel:+15551234567',
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Get instant answers from our AI assistant',
      contact: 'Available 24/7',
      action: '#',
    },
  ];

  const offices = [
    {
      city: 'New York',
      country: 'United States',
      flag: '🇺🇸',
      address: '5830 E 2nd St, STE 7000, Casper WY 82609',
      phone: '+1 (555) 123-4567',
      email: 'us@consulting19.com',
    },
    {
      city: 'London',
      country: 'United Kingdom',
      flag: '🇬🇧',
      address: '123 Business Street, London EC1A 1BB',
      phone: '+44 20 1234 5678',
      email: 'uk@consulting19.com',
    },
    {
      city: 'Dubai',
      country: 'United Arab Emirates',
      flag: '🇦🇪',
      address: 'DIFC, Gate Village 10, Level 2',
      phone: '+971 4 123 4567',
      email: 'uae@consulting19.com',
    },
  ];

  const serviceOptions = [
    'Company Formation',
    'Tax Optimization',
    'Banking Solutions',
    'Legal Compliance',
    'Asset Protection',
    'Investment Advisory',
    'Visa & Residency',
    'General Inquiry',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Contact Us - Consulting19</title>
        <meta name="description" content="Get in touch with Consulting19's expert advisors. We're here to help with your international business expansion needs." />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Ready to expand your business globally? Our expert advisors are here to guide you every step of the way.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <Card key={index} hover className="text-center">
              <Card.Body>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {method.description}
                </p>
                <p className="font-medium text-blue-600 mb-4">
                  {method.contact}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => method.action !== '#' && window.open(method.action, '_blank')}
                >
                  {method.title === 'Live Chat' ? 'Start Chat' : 'Contact Now'}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <Card.Header>
              <h2 className="text-2xl font-semibold text-gray-900">Send us a Message</h2>
              <p className="text-gray-600">Fill out the form below and we'll get back to you soon.</p>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
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
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your current country"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interest
                  </label>
                  <select
                    name="serviceInterest"
                    value={formData.serviceInterest}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What can we help you with?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about your business expansion goals..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg" 
                  loading={sending}
                  icon={Send}
                  iconPosition="right"
                >
                  {sending ? 'Sending Message...' : 'Send Message'}
                </Button>
              </form>
            </Card.Body>
          </Card>

          {/* Office Locations */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Global Offices</h2>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <Card key={index}>
                    <Card.Body>
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{office.flag}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {office.city}, {office.country}
                          </h3>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{office.address}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{office.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{office.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <Card>
              <Card.Header>
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    icon={Calendar}
                    onClick={() => window.open('http://localhost:5174', '_blank')}
                  >
                    Schedule a Consultation
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    icon={Globe}
                  >
                    Download Country Guide
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    icon={MessageSquare}
                  >
                    Start AI Chat
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* FAQ Quick Links */}
            <Card>
              <Card.Header>
                <h3 className="text-xl font-semibold text-gray-900">Frequently Asked</h3>
              </Card.Header>
              <Card.Body>
                <div className="space-y-3">
                  <div className="text-sm">
                    <h4 className="font-medium text-gray-900 mb-1">How long does company formation take?</h4>
                    <p className="text-gray-600">Typically 2-4 weeks depending on the jurisdiction.</p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium text-gray-900 mb-1">Do you provide ongoing compliance?</h4>
                    <p className="text-gray-600">Yes, we offer comprehensive ongoing compliance services.</p>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium text-gray-900 mb-1">What are your fees?</h4>
                    <p className="text-gray-600">Fees vary by service and jurisdiction. Contact us for a quote.</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <Card.Body className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who have successfully expanded their businesses internationally with our expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => window.open('http://localhost:5174', '_blank')}
              >
                Start Your Expansion
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Download Guide
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;