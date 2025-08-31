import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, MessageSquare, CheckCircle, Globe } from 'lucide-react';
import { useLanguage } from '@consulting19/shared/language';
import { Button, Card } from '@consulting19/shared/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ConsultantProfilePage = () => {
  const { consultantId } = useParams<{ consultantId: string }>();
  const { t } = useLanguage();

  // This will be implemented with real data from Supabase
  const mockConsultant = {
    id: consultantId,
    name: 'Giorgi Meskhi',
    company: 'International Business Solutions',
    rating: 4.9,
    reviews: 127,
    verified: true,
    avatar: null,
  };

  const mockServices = [
    {
      id: '1',
      title: 'Georgia LLC Formation',
      description: 'Complete business setup in Georgia with all required documentation and banking support.',
      features: ['Company Registration', 'Tax Number', 'Banking Setup', 'Legal Compliance'],
      category: 'Company Formation',
      featured: true,
    },
    {
      id: '2',
      title: 'Tax Optimization Consulting',
      description: 'Strategic tax planning for international businesses operating in Georgia.',
      features: ['Tax Strategy', 'Compliance Review', 'Optimization Plan', 'Ongoing Support'],
      category: 'Tax Planning',
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Consultant Header */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
              {mockConsultant.avatar ? (
                <img 
                  src={mockConsultant.avatar} 
                  alt={mockConsultant.name}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-white">
                  {mockConsultant.name.charAt(0)}
                </span>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {mockConsultant.name}
              </h1>
              <p className="text-xl text-blue-100 mb-4">
                International Business Consultant
              </p>
              
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-blue-100">
                {mockConsultant.company && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{mockConsultant.company}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 fill-current text-yellow-400" />
                  <span>{mockConsultant.rating} ({mockConsultant.reviews} reviews)</span>
                </div>
                {mockConsultant.verified && (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Verified Expert</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                icon={MessageSquare}
                onClick={() => window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname)}
              >
                Contact Consultant
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                icon={Calendar}
                onClick={() => window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname)}
              >
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Services</h2>
          <p className="text-gray-600">Professional consulting services tailored to your business needs</p>
        </div>

        {mockServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockServices.map((service) => (
              <Card key={service.id} hover className="h-full">
                <Card.Body>
                  {service.featured && (
                    <div className="inline-flex items-center bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full mb-4">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Featured
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Auth Required for Pricing */}
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-blue-800 text-sm font-medium mb-2">
                      Sign in to view pricing and purchase
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname)}
                    >
                      Sign In
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Category: {service.category}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Card.Body className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Services Available
              </h3>
              <p className="text-gray-600">
                This consultant hasn't added any services yet.
              </p>
            </Card.Body>
          </Card>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default ConsultantProfilePage;