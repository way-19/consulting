import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const countries = [
    {
      id: 'georgia',
      name: 'Georgia',
      code: 'GE',
      flag: '🇬🇪',
      advantage: 'KEY ADVANTAGE',
      title: '0% Tax on Foreign Income',
      description: 'Easy company formation with significant tax advantages and residency benefits for international entrepreneurs.',
      clients: '1,247',
      timeframe: '2-5 days',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'usa',
      name: 'United States',
      code: 'US',
      flag: '🇺🇸',
      advantage: 'KEY ADVANTAGE',
      title: 'Global Market Access',
      description: 'Delaware LLC formation providing access to the world\'s largest markets and international banking.',
      clients: '892',
      timeframe: '1-2 days',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'montenegro',
      name: 'Montenegro',
      code: 'ME',
      flag: '🇲🇪',
      advantage: 'KEY ADVANTAGE',
      title: 'EU Candidate Benefits',
      description: 'EU candidacy status with investment opportunities and residency programs for international investors.',
      clients: '634',
      timeframe: '3-7 days',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'estonia',
      name: 'Estonia',
      code: 'EE',
      flag: '🇪🇪',
      advantage: 'KEY ADVANTAGE',
      title: 'Digital Nomad Paradise',
      description: 'e-Residency program and digital-first approach for modern businesses. Advanced digital infrastructure.',
      clients: '1,196',
      timeframe: '1 day',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'portugal',
      name: 'Portugal',
      code: 'PT',
      flag: '🇵🇹',
      advantage: 'KEY ADVANTAGE',
      title: 'Golden Visa Gateway',
      description: 'EU membership benefits with Golden Visa program and favorable tax structures for international residents.',
      clients: '760',
      timeframe: '7-10 days',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'malta',
      name: 'Malta',
      code: 'MT',
      flag: '🇲🇹',
      advantage: 'KEY ADVANTAGE',
      title: 'EU Tax Optimization',
      description: 'EU membership with sophisticated tax planning and financial services for international businesses.',
      clients: '367',
      timeframe: '5-7 days',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'panama',
      name: 'Panama',
      code: 'PA',
      flag: '🇵🇦',
      advantage: 'KEY ADVANTAGE',
      title: 'Offshore Finance Hub',
      description: 'Premier offshore jurisdiction with strong banking and privacy laws for international finance.',
      clients: '445',
      timeframe: '3-5 days',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 'uae',
      name: 'UAE',
      code: 'AE',
      flag: '🇦🇪',
      advantage: 'KEY ADVANTAGE',
      title: 'Zero Tax Jurisdiction',
      description: 'World-class business hub with zero corporate tax and strategic location connecting East and West.',
      clients: '1,024',
      timeframe: '2-3 days',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  const services = [
    {
      icon: '📋',
      title: 'Company Formation',
      description: 'Quick entity setup worldwide with AI-powered recommendations.',
      features: ['LLC & Corporation setup', 'Registered agent service', 'EIN & tax ID', 'Compliance support']
    },
    {
      icon: '📈',
      title: 'Investment Advisory', 
      description: 'Strategic market analysis and investment opportunities across global markets.',
      features: ['Market research', 'Risk assessment', 'Portfolio optimization', 'Due diligence']
    },
    {
      icon: '⚖️',
      title: 'Legal Consulting',
      description: 'Regulatory compliance and business law expertise for international operations.',
      features: ['Contract drafting', 'Compliance review', 'Legal structure', 'Dispute resolution']
    },
    {
      icon: '📊',
      title: 'Accounting Services',
      description: 'International tax optimization and comprehensive accounting solutions.',
      features: ['Tax planning', 'Bookkeeping', 'Financial reporting', 'Audit support']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Orijinal gradient */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
              <span className="text-sm font-medium">🌍 World's First AI-Enhanced Territorial Consultancy Platform</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="text-white">AI-Enhanced Global</span>
              <br />
              <span className="text-blue-200">Intelligence Network at Your Service</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-purple-100 mb-8 max-w-4xl mx-auto">
              Expert business consulting across 7 strategic jurisdictions with AI-powered guidance and legal oversight.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">7 Strategic Jurisdictions</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span className="text-sm">AI-Powered Guidance</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="text-sm">Legal Oversight</span>
              </div>
            </div>
            
            <Link 
              to="/contact"
              className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>Get Started</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-6">
              <span className="text-blue-600 text-sm font-medium">🌍 8 Strategic Jurisdictions</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered Country <span className="text-blue-600">Recommendations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect jurisdiction for your business with intelligent guidance from our expert consultants and AI-powered analysis.
            </p>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {countries.map((country) => (
              <Link
                key={country.id}
                to={`/${country.id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className="relative">
                  <img 
                    src={country.image} 
                    alt={country.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-2">
                      <span className="text-2xl">{country.flag}</span>
                      <span className="font-semibold text-gray-900">{country.code}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{country.name}</h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                      {country.advantage}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">⭐</span>
                      <span className="text-sm font-semibold text-gray-700">{country.rating}</span>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-gray-900 mb-2">{country.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{country.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span>👥</span>
                      <span>{country.clients} clients</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>⏱️</span>
                      <span>{country.timeframe}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
                      Explore {country.name} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
              <span className="text-purple-600 text-sm font-medium">🔧 Comprehensive Business Services</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Expert Services for <span className="text-purple-600">Global Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From company formation to ongoing compliance, our AI-enhanced platform connects you with expert consultants for every aspect of international business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="mt-6 w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                  Get Started →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Real-Time Platform <span className="text-blue-400">Analytics</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Live insights from our worldwide network of expert consultants and AI-powered analytics driving successful business formations.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-blue-400 mb-2">1,247+</div>
              <div className="text-gray-300">Active Consultations</div>
              <div className="text-sm text-gray-500 mt-1">Ongoing client engagements worldwide</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-400 mb-2">8</div>
              <div className="text-gray-300">Strategic Jurisdictions</div>
              <div className="text-sm text-gray-500 mt-1">Countries with expert consultants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-gray-300">Success Rate</div>
              <div className="text-sm text-gray-500 mt-1">Successful business formations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-yellow-400 mb-2">47min</div>
              <div className="text-gray-300">Avg Response Time</div>
              <div className="text-sm text-gray-500 mt-1">AI-powered instant support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-red-400 mb-2">🤖</div>
              <div className="text-gray-300">AI-Powered Matching</div>
              <div className="text-sm text-gray-500 mt-1">Intelligent consultant-client pairing based on expertise and requirements</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-indigo-400 mb-2">⚖️</div>
              <div className="text-gray-300">Legal Compliance</div>
              <div className="text-sm text-gray-500 mt-1">All recommendations reviewed by legal experts for full compliance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Join Thousands of Successful Businesses
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Experience the power of AI-enhanced consulting with expert guidance across 8 strategic jurisdictions worldwide.
          </p>
          <Link 
            to="/contact"
            className="inline-flex items-center bg-white text-purple-600 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Your Journey
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;