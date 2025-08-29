import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { TrendingUp, Users, Building2, CreditCard, FileText, ArrowLeft, MessageCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const CountryDetailPage = () => {
  const { countryId } = useParams();

  // Mock country data - in real app this would be fetched from Supabase
  const countryData: { [key: string]: any } = {
    'uae': {
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      description: 'The UAE is a premier destination for international business, offering zero corporate tax in many free zones, strategic location, and world-class infrastructure.',
      image: 'https://images.pexels.com/photos/1769606/pexels-photo-1769606.jpeg?auto=compress&cs=tinysrgb&w=800',
      keyBenefits: [
        '0% corporate tax for 50 years in free zones',
        '100% foreign ownership allowed',
        'No personal income tax',
        'Strategic location between East and West',
        'World-class infrastructure',
        'Political and economic stability',
      ],
      services: [
        {
          title: 'Free Zone Company Formation',
          description: 'Complete setup in DIFC, ADGM, or DMCC free zones',
          price: 'From $3,000',
          duration: '7-14 days',
        },
        {
          title: 'Mainland Company Formation', 
          description: 'UAE mainland business registration with local market access',
          price: 'From $4,500',
          duration: '14-21 days',
        },
        {
          title: 'Corporate Banking',
          description: 'Bank account opening with major UAE banks',
          price: 'From $1,500',
          duration: '14-30 days',
        },
        {
          title: 'Emirates ID & Visa Processing',
          description: 'Residence visa and Emirates ID for business owners',
          price: 'From $2,000',
          duration: '21-45 days',
        },
      ],
      consultant: {
        name: 'Ahmed Al-Rashid',
        role: 'UAE Business Formation Specialist',
        experience: '10+ years',
        languages: 'English, Arabic',
        bio: 'Ahmed has helped over 200 international businesses establish operations in the UAE. He specializes in free zone company formation and banking solutions.',
        image: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=300',
        rating: 4.9,
        clients: 156,
      },
      faqs: [
        {
          question: 'How long does UAE company formation take?',
          answer: 'Free zone company formation typically takes 7-14 days, while mainland companies may take 14-21 days depending on the business activity and documentation completeness.',
        },
        {
          question: 'What is the minimum capital requirement?',
          answer: 'Most free zones have no minimum capital requirement. Mainland companies may require minimum capital depending on the business activity, typically starting from AED 300,000.',
        },
        {
          question: 'Can I open a bank account remotely?',
          answer: 'While initial documentation can be prepared remotely, most banks require the business owner to visit the UAE in person for account opening and Emirates ID processing.',
        },
      ],
    },
  };

  const country = countryData[countryId || ''] || countryData['uae'];

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
                src={country.image} 
                alt={country.name}
                className="w-full h-full object-cover"
              />
            </div>
            <Card.Body className="md:w-1/3 flex flex-col justify-center">
              <div className="text-4xl mb-4">{country.flag}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {country.name}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6">
                {country.description}
              </p>
              <Button size="lg" icon={MessageCircle} iconPosition="left">
                Contact UAE Specialist
              </Button>
            </Card.Body>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Benefits */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold text-gray-900">Key Business Benefits</h2>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {country.keyBenefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Available Services */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold text-gray-900">Available Services</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  {country.services.map((service: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{service.price}</div>
                          <div className="text-sm text-gray-500">{service.duration}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      <Button variant="outline" size="sm">
                        Get Started
                      </Button>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* FAQs */}
            <Card>
              <Card.Header>
                <h2 className="text-2xl font-semibold text-gray-900">Frequently Asked Questions</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-6">
                  {country.faqs.map((faq: any, index: number) => (
                    <div key={index}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                      {index < country.faqs.length - 1 && <hr className="mt-6 border-gray-200" />}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Country Specialist */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-900">Your Country Specialist</h2>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-6">
                  <img 
                    src={country.consultant.image} 
                    alt={country.consultant.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">{country.consultant.name}</h3>
                  <p className="text-blue-600 font-medium">{country.consultant.role}</p>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">{country.consultant.experience}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Languages</span>
                    <span className="font-medium">{country.consultant.languages}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Clients Served</span>
                    <span className="font-medium">{country.consultant.clients}+</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium text-yellow-600">⭐ {country.consultant.rating}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">
                  {country.consultant.bio}
                </p>
                
                <Button className="w-full" icon={MessageCircle} iconPosition="left">
                  Contact {country.consultant.name}
                </Button>
              </Card.Body>
            </Card>

            {/* Quick Stats */}
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-900">Quick Facts</h2>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Corporate Tax</span>
                    <span className="font-bold text-green-600">0%*</span>
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
                <p className="text-xs text-gray-500 mt-4">
                  *Free zones only. Mainland companies may have different rates.
                </p>
              </Card.Body>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
              <Card.Body className="text-center">
                <h3 className="text-lg font-semibold mb-4">Ready to Get Started?</h3>
                <p className="text-blue-100 text-sm mb-6">
                  Connect with our UAE specialist and begin your business formation today.
                </p>
                <Button variant="secondary" className="w-full" size="lg">
                  Start Your UAE Company
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