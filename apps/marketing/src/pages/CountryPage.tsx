import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Users, Building2, TrendingUp, Star, Calendar, MessageSquare, ArrowRight, CheckCircle, Globe, Shield, DollarSign, Clock } from 'lucide-react';
import { useLanguage } from '../lib/language';
import { Button, Card } from '../lib/ui';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CountryPage = () => {
  const { countryCode } = useParams();
  const { t } = useLanguage();

  // Country data - şimdilik sadece Georgia için
  const countryData = {
    georgia: {
      name: 'Georgia',
      flag: '🇬🇪',
      description: 'Strategic business hub between Europe and Asia with favorable tax policies and streamlined company formation processes.',
      capital: 'Tbilisi',
      language: 'Georgian, English',
      currency: 'Georgian Lari (GEL)',
      timezone: 'GMT+4',
      heroImage: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=1920',
      businessAdvantages: [
        'Small Business Status (1% tax rate)',
        'International Business Company (0% tax on foreign income)',
        'EU Association Agreement benefits',
        'Strategic location between Europe and Asia',
        'Simple online company registration',
        'No currency restrictions',
        'Banking sector with international standards',
        'English-speaking business environment',
      ],
      consultant: {
        id: 'giorgi-meskhi',
        name: 'Giorgi Meskhi',
        title: 'Senior Business Consultant',
        company: 'Meskhi & Associates',
        experience: '8+ years',
        rating: 4.9,
        clients: 150,
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        specializations: ['Company Formation', 'Tax Optimization', 'Banking Solutions', 'Legal Compliance'],
        languages: ['English', 'Georgian', 'Russian'],
      },
      services: [
        {
          title: 'Georgia LLC Formation',
          description: 'Complete LLC setup with Small Business Status registration for optimal tax benefits',
          duration: '2-3 weeks',
          features: ['Company registration', 'Tax registration', 'Bank account opening assistance', 'Legal compliance setup', 'Ongoing support'],
          category: 'Company Formation',
        },
        {
          title: 'International Business Company',
          description: 'IBC setup for international operations with 0% tax on foreign income',
          duration: '3-4 weeks',
          features: ['IBC registration', 'Tax optimization', 'International banking', 'Ongoing compliance', 'Annual reporting'],
          category: 'Tax Optimization',
        },
        {
          title: 'Tax Residency Planning',
          description: 'Strategic tax planning for Georgian tax residency benefits',
          duration: '1-2 weeks',
          features: ['Residency assessment', 'Tax planning', 'Documentation support', 'Ongoing advisory', 'Compliance monitoring'],
          category: 'Tax Planning',
        },
        {
          title: 'Banking Solutions',
          description: 'Corporate banking account opening and financial services setup',
          duration: '1-2 weeks',
          features: ['Bank account opening', 'Multi-currency accounts', 'Payment gateway setup', 'Banking relationships', 'Ongoing support'],
          category: 'Banking',
        },
      ],
      stats: {
        companiesFormed: 1200,
        avgFormationTime: '2.5 weeks',
        successRate: '98%',
        clientSatisfaction: 4.9,
      },
      keyFacts: [
        { label: 'Corporate Tax Rate', value: '20%', icon: DollarSign },
        { label: 'Small Business Tax', value: '1%', icon: TrendingUp },
        { label: 'Formation Time', value: '1-2 days', icon: Building2 },
        { label: 'Minimum Capital', value: 'No minimum', icon: Shield },
      ],
    },
  };

  const country = countryData[countryCode as keyof typeof countryData];

  if (!country) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Country Not Found</h1>
            <p className="text-gray-600 mb-6">The requested country page is not available yet.</p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{country.name} - Business Formation & Consulting - Consulting19</title>
        <meta name="description" content={`Expert business consulting services in ${country.name}. ${country.description}`} />
      </Helmet>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white py-20 mt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src={country.heroImage}
            alt={`${country.name} business landscape`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6 animate-bounce">{country.flag}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Business Formation in {country.name}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              {country.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl"
                icon={MessageSquare}
              >
                Consult with Expert
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                icon={Calendar}
              >
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Key Facts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose {country.name}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {country.keyFacts.map((fact, index) => (
              <Card key={index} hover className="text-center">
                <Card.Body>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <fact.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {fact.label}
                  </h3>
                  <p className="text-2xl font-bold text-emerald-600">
                    {fact.value}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Business Advantages */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Business Advantages
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {country.name} offers exceptional opportunities for international businesses 
                with its strategic location, favorable tax regime, and business-friendly environment.
              </p>
              <div className="space-y-4">
                {country.businessAdvantages.map((advantage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="text-gray-700">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt={`${country.name} business environment`}
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{country.stats.successRate}</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Consultant */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Your Expert Consultant
          </h2>
          <Card className="max-w-4xl mx-auto">
            <Card.Body>
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <img
                    src={country.consultant.avatar}
                    alt={country.consultant.name}
                    className="w-32 h-32 rounded-full object-cover shadow-lg"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {country.consultant.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">
                    {country.consultant.title} • {country.consultant.company}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    {country.consultant.specializations.map((spec, index) => (
                      <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{country.consultant.rating} rating</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{country.consultant.clients}+ clients</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      <span>{country.consultant.experience}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <Button 
                      icon={MessageSquare}
                      onClick={() => window.open(`/consultant/${country.consultant.id}`, '_blank')}
                    >
                      View Full Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      icon={Calendar}
                    >
                      Schedule Consultation
                    </Button>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Services Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Available Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {country.services.map((service, index) => (
              <Card key={index} hover className="h-full">
                <Card.Body>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {service.category}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Duration: {service.duration}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`/consultant/${country.consultant.id}`, '_blank')}
                    >
                      Learn More
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        {/* Country Stats */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-8">Our Track Record in {country.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-3xl font-bold mb-2">{country.stats.companiesFormed}+</div>
                  <div className="text-emerald-100">Companies Formed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{country.stats.avgFormationTime}</div>
                  <div className="text-emerald-100">Avg Formation Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{country.stats.successRate}</div>
                  <div className="text-emerald-100">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">{country.stats.clientSatisfaction}★</div>
                  <div className="text-emerald-100">Client Satisfaction</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>

        {/* Country Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Country Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <Card.Body className="text-center">
                <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Capital</h3>
                <p className="text-gray-600">{country.capital}</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                <p className="text-gray-600">{country.language}</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Currency</h3>
                <p className="text-gray-600">{country.currency}</p>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body className="text-center">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Timezone</h3>
                <p className="text-gray-600">{country.timezone}</p>
              </Card.Body>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <Card.Body className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Business in {country.name}?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Get expert guidance from our local specialist and start your international expansion journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-emerald-600 hover:bg-emerald-700"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => window.open(`/consultant/${country.consultant.id}`, '_blank')}
                >
                  Get Started Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                  icon={MessageSquare}
                >
                  Ask Questions
                </Button>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CountryPage;