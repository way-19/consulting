import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  TrendingUp,
  Building2,
  ArrowLeft,
  MessageCircle,
  Calendar,
  User,
  BookOpen,
} from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { getBlogPostsByCountry } from '../data/mockBlogPosts';

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
  price: number | null;
}

interface Consultant {
  id: string;
  full_name: string;
  bio: string | null;
  profile_image_url: string | null;
  phone: string | null;
  company: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  countryId: string;
}

const CountryDetailPage: React.FC = () => {
  const { countryId } = useParams();
  const [country, setCountry] = useState<Country | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [consultant, setConsultant] = useState<Consultant | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      if (!countryId) return;

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
          .select('id, title, description, image_url, is_recurring, billing_period, price')
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

        // Get blog posts for this country
        const countryBlogPosts = getBlogPostsByCountry(countryData.code);
        setBlogPosts(countryBlogPosts);

      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [countryId]);

  // Fallback data for development
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
      id: 'uae-company-formation',
      title: 'UAE Company Formation',
      description: 'Complete business setup in Dubai International Financial Centre (DIFC) free zone with full banking support and compliance assistance.',
      image_url:
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
      price: 4500,
    },
    {
      id: 'uae-tax-optimization',
      title: 'UAE Tax Optimization',
      description:
        'Strategic UAE tax planning leveraging free zone benefits and double tax treaties for optimal tax efficiency.',
      image_url:
        'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
      price: 2500,
    },
    {
      id: 'uae-banking-solutions',
      title: 'UAE Banking Solutions',
      description:
        'UAE corporate banking support including Emirates NBD, ADCB, and international banks with multi-currency solutions.',
      image_url:
        'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
      price: 1500,
    },
    {
      id: 'uae-legal-compliance',
      title: 'UAE Legal Compliance',
      description:
        'Ongoing UAE legal support including DIFC regulations, mainland compliance, and annual license renewals.',
      image_url:
        'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
      price: 800,
    },
    {
      id: 'uae-asset-protection',
      title: 'UAE Asset Protection',
      description:
        'UAE asset protection strategies using free zone structures and international holding companies for wealth preservation.',
      image_url:
        'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
      price: 3500,
    },
    {
      id: 'uae-investment-advisory',
      title: 'UAE Investment Advisory',
      description:
        'UAE investment opportunities including real estate, ADGM funds, and regional market access strategies.',
      image_url:
        'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
      price: 2000,
    },
    {
      id: 'uae-visa-residency',
      title: 'UAE Visa & Residency',
      description:
        'UAE Golden Visa, investor visa, and family residency solutions with Emirates ID and long-term residence permits.',
      image_url:
        'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
      price: 5000,
    },
    {
      id: 'uae-market-research',
      title: 'UAE Market Research',
      description:
        'UAE market analysis including GCC expansion opportunities, local partnerships, and regulatory landscape assessment.',
      image_url:
        'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_recurring: false,
      billing_period: null,
      price: 1200,
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

  // Safe company label calculation
  const companyLabel = displayConsultant?.company?.trim() || `${displayCountry.name} Business Specialist`;

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayServices.map((service) => (
                    <div
                      key={service.id}
                      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-102"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <img
                          src={
                            service.image_url ||
                            'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800'
                          }
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="relative h-48 flex flex-col justify-end p-4 text-white">
                        {/* Service Type Badge */}
                        {service.is_recurring && (
                          <div className="absolute top-3 right-3 bg-blue-500/80 backdrop-blur-sm rounded-full px-2 py-1">
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

                        {/* Price Badge */}
                        {service.price && (
                          <div className="absolute top-3 left-3 bg-green-500/80 backdrop-blur-sm rounded-full px-2 py-1">
                            <span className="text-xs font-medium text-white">
                              ${service.price.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <h3 className="text-lg font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">
                          {service.title}
                        </h3>

                        <p className="text-gray-200 text-xs leading-relaxed mb-3 opacity-90 line-clamp-2">
                          {service.description}
                        </p>

                        {/* Button - appears on hover */}
                        <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <Link to={'/services/' + service.id}>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 text-xs"
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
                  <div className="text-center mb-4">
                    <img
                      src={
                        displayConsultant.profile_image_url ||
                        'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300'
                      }
                      alt={displayConsultant.full_name}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-3"
                    />
                    <h3 className="text-base font-semibold text-gray-900">
                      {displayConsultant.full_name}
                    </h3>
                    <p className="text-blue-600 font-medium text-sm">{companyLabel}</p>
                  </div>

                  {displayConsultant.bio && (
                    <p className="text-sm text-gray-600 mb-4">
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

        {/* Blog Posts Section */}
        {blogPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Latest Insights from {displayCountry.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <Card key={post.id} hover className="h-full">
                  <div className="h-48 overflow-hidden rounded-t-xl">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <Card.Body className="h-full flex flex-col">
                    <div className="mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex-1">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <Link to={`/blog/${post.id}`}>
                      <Button variant="outline" size="sm" className="w-full" icon={BookOpen} iconPosition="left">
                        Read Article
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              ))}
            </div>
            
            {/* View All Blog Posts for Country */}
            <div className="text-center mt-8">
              <Link to={`/blog?country=${displayCountry.code}`}>
                <Button variant="outline" icon={BookOpen} iconPosition="right">
                  View All {displayCountry.name} Articles
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountryDetailPage;