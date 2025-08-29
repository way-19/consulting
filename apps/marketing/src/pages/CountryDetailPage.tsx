import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  TrendingUp,
  Building2,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';

interface Country {
  id: string;
  name: string;
  code: string;
  flag_emoji: string;
  description: string;
  tax_rate: number | null;
  business_advantages: string[];
  consultant_id: string | null;
  featured: boolean;
  is_active: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  is_recurring: boolean;
  billing_period: string | null;
}

interface Consultant {
  id: string;
  full_name: string;
  bio: string | null;
  profile_image_url: string | null;
  phone: string | null;
  company: string | null;
}

const CountryDetailPage: React.FC = () => {
  const { countryId } = useParams();
  const [country, setCountry] = useState<Country | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      if (!countryId) return;
      
      // If using mock client, skip API calls and use fallback data immediately
      const isMockClient = !import.meta.env?.VITE_SUPABASE_URL;
      if (isMockClient) {
        console.log('🚧 Using mock data for country:', countryId);
        setCountry(fallbackCountry);
        setServices(fallbackServices);
        setConsultant(fallbackConsultant);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);

        // Country
        const { data: countryData, error: countryError } = await supabase
          .from('countries')
          .select('*')
          .eq('code', countryId.toLowerCase())
          .eq('is_active', true)
          .maybeSingle();

        if (countryError) {
          console.error('Error fetching country:', countryError);
          setError('Country not found');
          return;
        }
        if (!countryData) {
          setError('Country not found');
          return;
        }
        setCountry(countryData);

        // Services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, title, description, image_url, is_recurring, billing_period')
          .eq('country_id', countryData.id)
          .eq('is_public', true)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (servicesError) {
          console.error('Error fetching services:', servicesError);
        } else {
          setServices(servicesData || []);
        }

        // Consultant
        if (countryData.consultant_id) {
          const { data: consultantData, error: consultantError } = await supabase
            .from('user_profiles')
            .select('id, full_name, bio, profile_image_url, phone, company')
            .eq('id', countryData.consultant_id)
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

    fetchCountryData();
  }, [countryId]);

  // Fallbacks (dev)
  const fallbackCountry: Country = {
    id: 'uae',
    name: 'United Arab Emirates',
    code: 'uae',
    flag_emoji: '🇦🇪',
    description:
      'The UAE is a premier destination for international business, offering zero corporate tax in many free zones, strategic location, and world-class infrastructure.',
    tax_rate: 0,
    business_advantages: [
      '0% corporate tax for 50 years in free zones',
      '100% foreign ownership allowed',
      'No personal income tax',
      'Strategic location between East and West',
      'World-class infrastructure',
      'Political and economic stability',
    ],
    consultant_id: null,
    featured: true,
    is_active: true,
  };

  const fallbackServices: Service[] = [
    {
      id: 'company-formation',
      title: 'Company Formation',
      description: 'Complete business registration and incorporation services.',
      image_url:
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
    },
    {
      id: 'tax-optimization',
      title: 'Tax Optimization',
      description:
        'Strategic international tax planning to minimize legal tax liability.',
      image_url:
        'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
    },
    {
      id: 'banking-solutions',
      title: 'Banking Solutions',
      description:
        'Global banking support for opening and managing corporate accounts.',
      image_url:
        'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
    },
    {
      id: 'legal-compliance',
      title: 'Legal Compliance',
      description:
        'Ongoing legal and regulatory support to keep your business compliant.',
      image_url:
        'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
    },
    {
      id: 'asset-protection',
      title: 'Asset Protection',
      description:
        'Trusts, foundations, and holding structures to protect assets.',
      image_url:
        'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
    },
    {
      id: 'investment-advisory',
      title: 'Investment Advisory',
      description:
        'Tailored investment strategies across public and private markets.',
      image_url:
        'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
    },
    {
      id: 'visa-residency',
      title: 'Visa & Residency',
      description:
        'End-to-end visa and residency solutions for investors and families.',
      image_url:
        'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
    },
    {
      id: 'market-research',
      title: 'Market Research',
      description:
        'In-depth market analysis for successful international expansion.',
      image_url:
        'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
    },
  ];

  const fallbackConsultant: Consultant = {
    id: '1',
    full_name: 'Ahmed Al-Rashid',
    bio: 'Ahmed has helped over 200 international businesses establish operations in the UAE. He specializes in free zone company formation and banking solutions.',
    profile_image_url:
      'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300',
    phone: '+971 50 123 4567',
    company: 'UAE Business Solutions',
  };

  const displayCountry = country || fallbackCountry;
  const displayServices = services.length > 0 ? services : fallbackServices;
  const displayConsultant = consultant || fallbackConsultant;

  // Güvenli ve okunur şirket etiketi
  const companyLabel =
    (displayConsultant?.company && displayConsultant.company.trim()) ||
    `${displayCountry?.name ?? 'Global'} Business Specialist`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading country information...</p>
        </div>
      </div>
    );
  }

  if (error && !country) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-0 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Country Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/countries">
            <Button>Back to Countries</Button>
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
          <Link to="/countries">
            <Button variant="ghost" icon={ArrowLeft} iconPosition="left">
              Back to Countries
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <Card className="mb-12">
          <div className="md:flex">
            <div className="md:w-2/3 h-64 md:h-80 overflow-hidden rounded-l-xl">
              <img
                src="https://images.pexels.com/photos/1769606/pexels-photo-1769606.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={displayCountry.name}
                className="w-full h-full object-cover"
              />
            </div>
            <Card.Body className="md:w-1/3 flex flex-col justify-center">
              <div className="text-4xl mb-4">{displayCountry.flag_emoji}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {displayCountry.name}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6">
                {displayCountry.description}
              </p>
              <Button size="lg" icon={MessageCircle} iconPosition="left">
                Contact {displayCountry.name} Specialist
              </Button>
            </Card.Body>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Services */}
          <div className="lg:col-span-2 space-y-8">
            {/* Services Grid */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Available Services
              </h2>

              {displayServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayServices.map((service) => (
                    <div
                      key={service.id}
                      className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={
                            service.image_url ||
                            'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
                          }
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="relative h-64 flex flex-col justify-end p-6 text-white">
                        {/* Service Type Badge */}
                        {service.is_recurring && (
                          <div className="absolute top-4 right-4 bg-blue-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-xs font-medium text-white">
                              {service.billing_period === 'monthly'
                                ? 'Monthly'
                                : service.billing_period === 'quarterly'
                                ? 'Quarterly'
                                : service.billing_period === 'yearly'
                                ? 'Yearly'
                                : 'Recurring'}
                            </span>
                          </div>
                        )}

                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors duration-300">
                          {service.title}
                        </h3>

                        <p className="text-gray-200 text-sm leading-relaxed mb-4 opacity-90">
                          {service.description}
                        </p>

                        {/* Button - appears on hover */}
                        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <Link to={'/services/' + service.id}>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                            >
                              Learn More
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Services Available
                  </h3>
                  <p className="text-gray-600">
                    Services for this country are being prepared.
                  </p>
                </div>
              )}
            </div>

            {/* Key Benefits */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Key Business Benefits
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayCountry.business_advantages.map(
                    (benefit: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    )
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Country Specialist */}
            {displayConsultant && (
              <Card>
                <Card.Header>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Your Country Specialist
                  </h2>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-6">
                    <img
                      src={
                        displayConsultant.profile_image_url ||
                        'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300'
                      }
                      alt={displayConsultant.full_name}
                      className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {displayConsultant.full_name}
                    </h3>
                    <p className="text-blue-600 font-medium">{companyLabel}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Experience</span>
                      <span className="font-medium">10+ years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Languages</span>
                      <span className="font-medium">English, Local</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Clients Served</span>
                      <span className="font-medium">200+</span>
                    </div>
                  </div>

                  {displayConsultant.bio && (
                    <p className="text-sm text-gray-600 mb-6">
                      {displayConsultant.bio}
                    </p>
                  )}

                  <Button className="w-full" icon={MessageCircle} iconPosition="left">
                    Contact {displayConsultant.full_name}
                  </Button>
                </Card.Body>
              </Card>
            )}

            {/* Quick Facts */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-900">
                  Quick Facts
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Corporate Tax</span>
                    <span className="font-bold text-green-600">
                      {displayCountry.tax_rate === 0
                        ? '0%*'
                        : `${displayCountry.tax_rate}%`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Setup Time</span>
                    <span className="font-medium">7-14 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min. Capital</span>
                    <span className="font-medium">No minimum</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Banking</span>
                    <span className="font-medium">Excellent</span>
                  </div>
                </div>
                {displayCountry.tax_rate === 0 && (
                  <p className="text-xs text-gray-500 mt-4">
                    *Free zones only. Mainland companies may have different rates.
                  </p>
                )}
              </Card.Body>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
              <Card.Body className="text-center">
                <h3 className="text-lg font-semibold mb-4">
                  Ready to Get Started?
                </h3>
                <p className="text-blue-100 text-sm mb-6">
                  Connect with our {displayCountry.name} specialist and begin your
                  business formation today.
                </p>
                <Button variant="secondary" className="w-full" size="lg">
                  Start Your {displayCountry.name} Company
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetailPage;
