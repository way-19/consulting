import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, Clock, CheckCircle, Users, MessageCircle, Globe, FileText, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useLanguage } from '@consulting19/shared';

interface Service {
  id: string;
  title: string;
  description: string;
  meta_keywords: string[] | null;
  meta_description: string | null;
  title_tr: string | null;
  description_tr: string | null;
  title_pt: string | null;
  description_pt: string | null;
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

interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
}

const ServiceDetailsPage = () => {
  const { serviceId } = useParams();
  const { language } = useLanguage();

  // Localized text helper (single definition)
  const getLocalized = <T extends Record<string, any>>(obj: T | null | undefined, field: string): string => {
    if (!obj) return '';
    const map: Record<string, string> = {
      tr: `${field}_tr`,
      pt: `${field}_pt`,
      en: field, // default
    };
    const key = map[language as keyof typeof map] || field;
    return obj[key] ?? obj[field] ?? '';
  };

  const [service, setService] = useState<Service | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [faqs, setFaqs] = useState<ServiceFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

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
            id, title, title_tr, title_pt,
            description, description_tr, description_pt,
            meta_keywords, meta_description, image_url, is_recurring, billing_period, country_id,
            countries (
              id, name, flag_emoji, code, consultant_id
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

        // Fetch service FAQs
        const { data: faqsData, error: faqsError } = await supabase
          .from('service_faqs')
          .select('id, question, answer, order_index, is_active')
          .eq('service_id', serviceId)
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (faqsError) {
          console.error('Error fetching FAQs:', faqsError);
        } else {
          setFaqs(faqsData || []);
        }

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
    id: 'uae-company-formation',
    title: 'UAE Company Formation',
    title_tr: 'BAE Şirket Kuruluşu',
    title_pt: 'Formação de Empresa nos EAU',
    title_tr: 'BAE Şirket Kuruluşu',
    title_pt: 'Formação de Empresa nos EAU',
    description: 'Complete business setup in Dubai International Financial Centre (DIFC) free zone with full banking support and compliance assistance.',
    description_tr: 'Dubai Uluslararası Finans Merkezi (DIFC) serbest bölgesinde tam bankacılık desteği ve uyumluluk yardımı ile komple iş kurulumu.',
    description_pt: 'Configuração completa de negócios na zona franca do Centro Financeiro Internacional de Dubai (DIFC) com suporte bancário completo e assistência de conformidade.',
    description_tr: 'Dubai Uluslararası Finans Merkezi (DIFC) serbest bölgesinde tam bankacılık desteği ve uyumluluk yardımı ile komple iş kurulumu.',
    description_pt: 'Configuração completa de negócios na zona franca do Centro Financeiro Internacional de Dubai (DIFC) com suporte bancário completo e assistência de conformidade.',
    meta_keywords: ['UAE company formation', 'DIFC setup', 'Dubai business', 'free zone company', 'UAE incorporation'],
    meta_description: 'Complete UAE company formation in DIFC free zone with expert guidance, banking support, and full compliance assistance.',
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

  const fallbackFaqs: ServiceFAQ[] = [
    {
      id: '1',
      question: 'How long does UAE company formation take?',
      answer: 'UAE company formation typically takes 7-14 days depending on the jurisdiction and banking requirements. Free zone companies are generally faster than mainland companies.',
      order_index: 1,
      is_active: true,
    },
    {
      id: '2',
      question: 'What are the costs involved in UAE company setup?',
      answer: 'Total costs include government fees (AED 15,000-25,000), office space rental, visa processing, and our service fees. We provide transparent pricing with no hidden costs.',
      order_index: 2,
      is_active: true,
    },
    {
      id: '3',
      question: 'Can I get 100% ownership of my UAE company?',
      answer: 'Yes, in free zones like DIFC, ADGM, and DMCC, you can have 100% foreign ownership. Mainland companies also allow 100% foreign ownership for most business activities.',
      order_index: 3,
      is_active: true,
    },
    {
      id: '4',
      question: 'What banking options are available in UAE?',
      answer: 'UAE offers excellent banking options including Emirates NBD, ADCB, FAB, HSBC, and other international banks. We assist with corporate account opening and multi-currency solutions.',
      order_index: 4,
      is_active: true,
    },
    {
      id: '5',
      question: 'Do I need to live in UAE to maintain my company?',
      answer: 'No, you don\'t need to live in UAE. However, you need to maintain a registered office address and may need to visit for banking and visa procedures.',
      order_index: 5,
      is_active: true,
    },
  ];

  const displayService = service || fallbackService;
  const displayCountry = country || fallbackCountry;
  const displayConsultant = consultant || fallbackConsultant;
  const displayFaqs = faqs.length > 0 ? faqs : fallbackFaqs;

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

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
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{getLocalized(displayService, 'title')} - {displayCountry.name} | Consulting19</title>
        <meta name="description" content={displayService.meta_description || getLocalized(displayService, 'description')} />
        {displayService.meta_keywords && (
          <meta name="keywords" content={displayService.meta_keywords.join(', ')} />
        )}
      </Helmet>

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
                {getLocalized(displayService, 'title')}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6">
                {getLocalized(displayService, 'description')}
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
                    {getLocalized(displayService, 'description')}
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

            {/* FAQ Section */}
            {displayFaqs.length > 0 && (
              <Card>
                <Card.Header>
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h2>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {displayFaqs.map((faq) => (
                      <div key={faq.id} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          {expandedFaq === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {expandedFaq === faq.id && (
                          <div className="px-4 pb-4 border-t border-gray-200">
                            <p className="text-gray-600 leading-relaxed pt-4">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}
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