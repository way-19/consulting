import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, Users, Globe, TrendingUp, Shield } from 'lucide-react';

const HomePage = () => {
  const countries = [
    {
      name: 'Georgia',
      slug: 'georgia',
      flag: '🇬🇪',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      rating: '4.9',
      advantage: '0% Tax on Foreign Income',
      description: 'Strategic location between Europe and Asia with favorable tax system'
    },
    {
      name: 'USA',
      slug: 'usa',
      flag: '🇺🇸',
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop',
      rating: '4.8',
      advantage: 'Global Market Access',
      description: 'Access to the world\'s largest economy and advanced financial systems'
    },
    {
      name: 'Montenegro',
      slug: 'montenegro',
      flag: '🇲🇪',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      rating: '4.7',
      advantage: 'EU Candidate Benefits',
      description: 'EU candidate country with attractive investment opportunities'
    },
    {
      name: 'Estonia',
      slug: 'estonia',
      flag: '🇪🇪',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop',
      rating: '4.9',
      advantage: 'Digital Nomad Paradise',
      description: 'Digital-first approach with e-Residency program and EU membership'
    },
    {
      name: 'Portugal',
      slug: 'portugal',
      flag: '🇵🇹',
      image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop',
      rating: '4.8',
      advantage: 'Golden Visa Gateway',
      description: 'EU membership with Golden Visa program and excellent quality of life'
    },
    {
      name: 'Malta',
      slug: 'malta',
      flag: '🇲🇹',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop',
      rating: '4.7',
      advantage: 'EU Tax Optimization',
      description: 'EU membership with sophisticated tax planning and English-speaking environment'
    },
    {
      name: 'Panama',
      slug: 'panama',
      flag: '🇵🇦',
      image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop',
      rating: '4.6',
      advantage: 'Offshore Finance Hub',
      description: 'Premier offshore jurisdiction with banking privacy and USD currency'
    },
    {
      name: 'UAE',
      slug: 'uae',
      flag: '🇦🇪',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
      rating: '4.9',
      advantage: 'Tax-Free Business Hub',
      description: 'Strategic Middle East location with 0% corporate tax and world-class infrastructure'
    }
  ];

  const services = [
    {
      title: 'Company Formation',
      description: 'Quick entity setup worldwide with expert guidance',
      features: ['LLC & Corporation setup', 'Registered agent service', 'EIN & tax ID', 'Compliance support'],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Investment Advisory',
      description: 'Strategic market analysis and investment opportunities',
      features: ['Market research', 'Risk assessment', 'Portfolio optimization', 'Due diligence'],
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Legal Consulting',
      description: 'Regulatory compliance and business law expertise',
      features: ['Contract drafting', 'Compliance review', 'Legal structure', 'Dispute resolution'],
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Accounting Services',
      description: 'International tax optimization and accounting solutions',
      features: ['Tax planning', 'Bookkeeping', 'Financial reporting', 'Audit support'],
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Visa & Residency',
      description: 'Global mobility solutions and citizenship programs',
      features: ['Visa applications', 'Residency programs', 'Citizenship planning', 'Immigration law'],
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Market Research',
      description: 'Comprehensive market analysis and business intelligence',
      features: ['Industry analysis', 'Competitor research', 'Market entry strategy', 'Consumer insights'],
      color: 'from-pink-500 to-pink-600'
    },
    {
      title: 'Banking Solutions',
      description: 'International account opening and banking relationships',
      features: ['Account opening', 'Banking relationships', 'Payment processing', 'Credit facilities'],
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Ongoing Compliance',
      description: 'Continuous regulatory monitoring and compliance management',
      features: ['Regulatory updates', 'Filing management', 'Compliance calendar', 'Risk monitoring'],
      color: 'from-red-500 to-red-600'
    }
  ];

  const stats = [
    { number: '1,247+', label: 'Active Consultations', sublabel: 'Across all jurisdictions' },
    { number: '8', label: 'Strategic Jurisdictions', sublabel: 'Optimized locations' },
    { number: '98%', label: 'Success Rate', sublabel: 'Client satisfaction' },
    { number: '47min', label: 'Avg Response Time', sublabel: 'Expert support' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              AI-Enhanced Global Intelligence Network{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                at Your Service
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
              Real-time regulatory updates and cross-border opportunities across 8 strategic jurisdictions
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white/90">
                <Globe className="h-5 w-5 mr-2" />
                <span className="font-medium">8 Strategic Jurisdictions</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white/90">
                <TrendingUp className="h-5 w-5 mr-2" />
                <span className="font-medium">AI-Powered Guidance</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white/90">
                <Shield className="h-5 w-5 mr-2" />
                <span className="font-medium">Legal Oversight</span>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Country <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Recommendations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect jurisdiction for your business with intelligent guidance from our expert consultants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {countries.map((country, index) => (
              <Link
                key={country.slug}
                to={`/${country.slug}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-105"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={country.image}
                    alt={country.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="text-3xl drop-shadow-lg">{country.flag}</span>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{country.name}</h3>
                    <p className="text-white/90 text-sm">{country.advantage}</p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium text-gray-700">{country.rating}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{country.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Expert Services for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Global Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive business solutions powered by AI intelligence and delivered by expert consultants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 group transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-8 h-8 bg-white/20 rounded-lg"></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/services"
                  className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${service.color} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real-Time Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">Analytics</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Live insights from our AI-enhanced global consultancy platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/80 font-medium mb-1">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Thousands of Successful Businesses
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Start your global expansion journey today with AI-enhanced guidance and expert consultants across 8 strategic jurisdictions
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;