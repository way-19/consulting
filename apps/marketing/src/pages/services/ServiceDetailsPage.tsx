import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Clock, CheckCircle, Users, MessageCircle, Globe, FileText } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';

interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  is_recurring: boolean;
  billing_period: string | null;
  country_id: string;
}

interface Country {
  id: string;
  name: string;
  flag_emoji: string;
  code: string;
}

interface Consultant {
  id: string;
  full_name: string;
  bio: string | null;
  profile_image_url: string | null;
  phone: string | null;
  company: string | null;
}

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!serviceId) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch service data
        const { data: serviceData, error: serviceError } = await supabase
          .from('services')
          .select(`
            id,
            title,
            description,
            image_url,
            is_recurring,
            billing_period,
            country_id,
            countries (
              id,
              name,
              flag_emoji,
              code,
              consultant_id
            )
          `)
          .eq('id', serviceId)
          .eq('is_public', true)
          .eq('is_active', true)
          .maybeSingle();

        if (serviceError) {
          console.error('Error fetching service:', serviceError);
          setError('Service not found');
          return;
        }

        if (!serviceData) {
          setError('Service not found');
          return;
        }

        setService(serviceData);
        setCountry(serviceData.countries);

        // Fetch consultant data if available
        if (serviceData.countries?.consultant_id) {
          const { data: consultantData, error: consultantError } = await supabase
            .from('user_profiles')
            .select('id, full_name, bio, profile_image_url, phone, company')
            .eq('id', serviceData.countries.consultant_id)
            .eq('role', 'consultant')
            .eq('is_active', true)
            .maybeSingle();

          if (consultantError) {
            console.error('Error fetching consultant:', consultantError);
          } else {
            setConsultant(consultantData);
          }
        }

      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId]);

  // Fallback data for development
  const fallbackService = {
    id: '1',
    title: 'UAE Company Formation',
    description: 'Complete business setup in Dubai International Financial Centre (DIFC) free zone with full banking support and compliance assistance.',
    image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    is_recurring: false,
    billing_period: null,
    country_id: 'uae',
  };

  const fallbackCountry = {
    id: 'uae',
    name: 'United Arab Emirates',
    flag_emoji: '🇦🇪',
    code: 'uae',
  };

  const fallbackConsultant = {
    id: '1',
    full_name: 'Ahmed Al-Rashid',
    bio: 'Ahmed has helped over 200 international businesses establish operations in the UAE. He specializes in free zone company formation and banking solutions.',
    profile_image_url: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+971 50 123 4567',
    company: 'UAE Business Solutions',
  };

  const displayService = service || fallbackService;
  const displayCountry = country || fallbackCountry;
  const displayConsultant = consultant || fallbackConsultant;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service information...</p>
        </div>
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/services">
            <Button>Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to={`/countries/${displayCountry.code}`}>
            <Button variant="ghost" icon={ArrowLeft} iconPosition="left">
              Back to {displayCountry.name}
            </Button>
          </Link>
        </div>

        {/* Service Hero */}
        <Card className="mb-12">
          <div className="md:flex">
            <div className="md:w-2/3 h-64 md:h-80 overflow-hidden rounded-l-xl">
              <img 
                src={displayService.image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={displayService.title}
                className="w-full h-full object-cover"
              />
            </div>
            <Card.Body className="md:w-1/3 flex flex-col justify-center">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-2xl">{displayCountry.flag_emoji}</span>
                <span className="text-sm text-gray-600">{displayCountry.name}</span>
              </div>
              
              {displayService.is_recurring && (
                <div className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-4 w-fit">
                  {displayService.billing_period === 'monthly' ? 'Monthly Service' : 
                   displayService.billing_period === 'quarterly' ? 'Quarterly Service' : 
                   displayService.billing_period === 'yearly' ? 'Yearly Service' : 'Recurring Service'}
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {displayService.title}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6">
                {displayService.description}
              </p>
              <Button size="lg" icon={MessageCircle} iconPosition="left">
                Get Started
              </Button>
            </Card.Body>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Details */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold text-gray-900">Service Overview</h2>
              </Card.Header>
              <Card.Body>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {displayService.description}
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      Expert consultation and guidance
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      Complete documentation preparation
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      Government filing and registration
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      Ongoing support and compliance
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Process Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Initial Consultation</h4>
                        <p className="text-sm text-gray-600">Discuss your requirements and objectives</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Documentation</h4>
                        <p className="text-sm text-gray-600">Prepare and review all required documents</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Processing</h4>
                        <p className="text-sm text-gray-600">Submit applications and handle government procedures</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Completion</h4>
                        <p className="text-sm text-gray-600">Receive final documentation and ongoing support</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Requirements */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold text-gray-900">Requirements</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Identity Documents</h4>
                      <p className="text-sm text-gray-600">Valid passport and proof of address</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Business Information</h4>
                      <p className="text-sm text-gray-600">Business plan and activity description</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Shareholder Details</h4>
                      <p className="text-sm text-gray-600">Information about all shareholders and directors</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Service Info */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-900">Service Information</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Country</span>
                    <div className="flex items-center space-x-2">
                      <span>{displayCountry.flag_emoji}</span>
                      <span className="font-medium">{displayCountry.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Type</span>
                    <span className="font-medium">
                      {displayService.is_recurring ? 'Recurring' : 'One-time'}
                    </span>
                  </div>
                  
                  {displayService.is_recurring && displayService.billing_period && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing</span>
                      <span className="font-medium capitalize">{displayService.billing_period}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timeline</span>
                    <span className="font-medium">2-4 weeks</span>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Country Specialist */}
            {displayConsultant && (
              <Card>
                <Card.Header>
                  <h2 className="text-lg font-semibold text-gray-900">Your Specialist</h2>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-6">
                    <img 
                      src={displayConsultant.profile_image_url || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300'}
                      alt={displayConsultant.full_name}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                    />
                    <h3 className="text-lg font-semibold text-gray-900">{displayConsultant.full_name}</h3>
                    <p className="text-blue-600 font-medium text-sm">{displayConsultant.company || `${displayCountry.name} Specialist`}</p>
                  </div>
                  
                  {displayConsultant.bio && (
                    <p className="text-sm text-gray-600 mb-6">
                      {displayConsultant.bio}
                    </p>
                  )}
                  
                  <Button className="w-full" icon={MessageCircle} iconPosition="left">
                    Contact Specialist
                  </Button>
                </Card.Body>
              </Card>
            )}

            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
              <Card.Body className="text-center">
                <h3 className="text-lg font-semibold mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 text-sm mb-6">
                  Connect with our specialist to begin this service.
                </p>
                <Button variant="secondary" className="w-full" size="lg">
                  Start This Service
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;