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
      description: 'Strategic location between Europe and Asia with favorable tax system',
      clients: '1,247',
      setupTime: '3-5 days'
    },
    {
      name: 'USA',
      slug: 'usa',
      flag: '🇺🇸',
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=400&h=300&fit=crop',
      rating: '4.8',
      advantage: 'Global Market Access',
      description: 'Access to the world\'s largest economy and advanced financial systems',
      clients: '892',
      setupTime: '1-2 days'
    },
    {
      name: 'Montenegro',
      slug: 'montenegro',
      flag: '🇲🇪',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      rating: '4.7',
      advantage: 'EU Candidate Benefits',
      description: 'EU candidate country with attractive investment opportunities',
      clients: '634',
      setupTime: '5-7 days'
    },
    {
      name: 'Estonia',
      slug: 'estonia',
      flag: '🇪🇪',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop',
      rating: '4.9',
      advantage: 'Digital Nomad Paradise',
      description: 'Digital-first approach with e-Residency program and EU membership',
      clients: '1,156',
      setupTime: '1 day'
    },
    {
      name: 'Portugal',
      slug: 'portugal',
      flag: '🇵🇹',
      image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=300&fit=crop',
      rating: '4.8',
      advantage: 'Golden Visa Gateway',
      description: 'EU membership with Golden Visa program and excellent quality of life',
      clients: '789',
      setupTime: '7-10 days'
    },
    {
      name: 'Malta',
      slug: 'malta',
      flag: '🇲🇹',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=300&fit=crop',
      rating: '4.7',
      advantage: 'EU Tax Optimization',
      description: 'EU membership with sophisticated tax planning and English-speaking environment',
      clients: '567',
      setupTime: '5-7 days'
    },
    {
      name: 'Panama',
      slug: 'panama',
      flag: '🇵🇦',
      image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=400&h=300&fit=crop',
      rating: '4.6',
      advantage: 'Offshore Finance Hub',
      description: 'Premier offshore jurisdiction with banking privacy and USD currency',
      clients: '445',
      setupTime: '3-5 days'
    },
    {
      name: 'UAE',
      slug: 'uae',
      flag: '🇦🇪',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
      rating: '4.9',
      advantage: 'Tax-Free Business Hub',
      description: 'Strategic Middle East location with 0% corporate tax and world-class infrastructure',
      clients: '923',
      setupTime: '2-3 days'
    },
    {
      name: 'Switzerland',
      slug: 'switzerland',
      flag: '🇨🇭',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      rating: '4.9',
      advantage: 'Premium Banking Hub',
      description: 'World-class financial center with privacy, stability and favorable tax structures',
      clients: '1,034',
      setupTime: '2-3 days'
    },
    {
      name: 'Spain',
      slug: 'spain',
      flag: '🇪🇸',
      image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=300&fit=crop',
      rating: '4.7',
      advantage: 'EU Market Gateway',
      description: 'EU membership with growing startup ecosystem and attractive residency programs',
      clients: '756',
      setupTime: '5-7 days'
    }
  ];

  const services = [
    {
      title: 'Company Formation',
      description: 'Quick entity setup worldwide with expert guidance',
      features: ['LLC & Corporation setup', 'Registered agent service', 'EIN & tax ID', 'Compliance support'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Investment Advisory',
      description: 'Strategic market analysis and investment opportunities',
      features: ['Market research', 'Risk assessment', 'Portfolio optimization', 'Due diligence'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Legal Consulting',
      description: 'Regulatory compliance and business law expertise',
      features: ['Contract drafting', 'Compliance review', 'Legal structure', 'Dispute resolution'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      title: 'Accounting Services',
      description: 'International tax optimization and accounting solutions',
      features: ['Tax planning', 'Bookkeeping', 'Financial reporting', 'Audit support'],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      title: 'Visa & Residency',
      description: 'Global mobility solutions and citizenship programs',
      features: ['Visa applications', 'Residency programs', 'Citizenship planning', 'Immigration law'],
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700'
    },
    {
      title: 'Market Research',
      description: 'Comprehensive market analysis and business intelligence',
      features: ['Industry analysis', 'Competitor research', 'Market entry strategy', 'Consumer insights'],
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700'
    },
    {
      title: 'Banking Solutions',
      description: 'International account opening and banking relationships',
      features: ['Account opening', 'Banking relationships', 'Payment processing', 'Credit facilities'],
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      title: 'Ongoing Compliance',
      description: 'Continuous regulatory monitoring and compliance management',
      features: ['Regulatory updates', 'Filing management', 'Compliance calendar', 'Risk monitoring'],
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  const stats = [
    { number: '1,247+', label: 'Active Consultations', sublabel: 'Across all jurisdictions' },
    { number: '10', label: 'Strategic Jurisdictions', sublabel: 'Optimized locations' },
    { number: '98%', label: 'Success Rate', sublabel: 'Client satisfaction' },
    { number: '47min', label: 'Avg Response Time', sublabel: 'Expert support' }
  ];

  const platformFeatures = [
    {
      title: 'AI-Powered Matching',
      description: 'Intelligent consultant assignment based on expertise and client needs'
    },
    {
      title: 'Legal Compliance',
      description: 'All recommendations reviewed by legal experts for compliance'
    },
    {
      title: 'Success Optimization',
      description: 'Continuous optimization based on successful case patterns'
    }
  ];

  const blogPosts = [
    {
      title: 'New Company Formation Guide 2024',
      excerpt: 'Complete guide to forming companies in strategic jurisdictions with updated regulations.',
      author: 'Sarah Johnson',
      country: 'Estonia',
      flag: '🇪🇪',
      date: 'March 15, 2024',
      category: 'Company Formation'
    },
    {
      title: 'AI Investment Opportunities Guide 2024',
      excerpt: 'Discover emerging markets and investment opportunities with AI-powered analysis.',
      author: 'Michael Chen',
      country: 'USA',
      flag: '🇺🇸',
      date: 'March 12, 2024',
      category: 'Investment'
    },
    {
      title: 'Cyprus Visa Requirements for 2024',
      excerpt: 'Updated visa requirements and application processes for Cyprus residency programs.',
      author: 'Elena Rodriguez',
      country: 'Portugal',
      flag: '🇵🇹',
      date: 'March 10, 2024',
      category: 'Visa & Immigration'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              AI-Enhanced Global{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
                Intelligence Network
              </span>{' '}
              at Your Service
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
              Real-time regulatory updates and cross-border opportunities across 10 strategic jurisdictions
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white/90">
                <Globe className="h-5 w-5 mr-2" />
                <span className="font-medium">10 Strategic Jurisdictions</span>
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
              to="/login"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI-Powered Country Recommendations */}
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
            {countries.slice(0, 8).map((country, index) => (
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
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{country.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{country.clients} clients</span>
                    <span>{country.setupTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Revolutionary AI Oracle Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Revolutionary AI Oracle - Predicts Your Perfect Jurisdiction
            </h3>
            <p className="text-lg text-purple-100 mb-6 max-w-4xl mx-auto">
              Our advanced AI analyzes 847 regulatory factors across 10 strategic jurisdictions, processing real-time market data to deliver personalized recommendations with 98.7% accuracy.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">1,247+</div>
                <div className="text-purple-200">Successful Matches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">98.7%</div>
                <div className="text-purple-200">Success Rate</div>
              </div>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-xl"
            >
              Discover Your Perfect Jurisdiction
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Expert Services for Global Success */}
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
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 group transform hover:-translate-y-2 border border-gray-100"
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
                  Get Started
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-Time Platform Analytics */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/80 font-medium mb-1">{stat.label}</div>
                <div className="text-white/60 text-sm">{stat.sublabel}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Thousands of Successful Businesses */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Thousands of Successful Businesses
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Start your global expansion journey today with AI-enhanced guidance and expert consultants across 10 strategic jurisdictions
            </p>
            <Link
              to="/login"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* Experience the Future of Business Consulting */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Experience the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Business Consulting</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides instant guidance while connecting you with expert human consultants for personalized support.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Intelligent Business Guidance</h3>
                    <p className="text-white/80 text-sm">AI-powered recommendations with human expertise</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-2xl p-4">
                        <p className="text-gray-800">
                          "I want to start a tech company that can operate globally but minimize tax obligations. What's the best jurisdiction?"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <div className="flex-1">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-200">
                        <p className="text-gray-800 mb-3">
                          Based on your requirements, I recommend <strong>Estonia</strong> for your tech company. Here's why:
                        </p>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• e-Residency program for digital operations</li>
                          <li>• 0% tax on retained earnings</li>
                          <li>• EU market access</li>
                          <li>• Advanced digital infrastructure</li>
                        </ul>
                        <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-700 font-medium">
                            💡 <strong>AI Insight:</strong> 94% of similar tech companies chose Estonia and reported 40% faster market entry.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl"
                  >
                    Try AI Assistant Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Insights from Our Global Consultants */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Expert Insights from Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Global Consultants</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest regulatory changes, market opportunities, and expert analysis from our consultants across 10 strategic jurisdictions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {[
              {
                title: 'New Company Formation Opportunities in Estonia 2024',
                excerpt: 'Complete guide to forming companies in Estonia with updated e-Residency regulations and digital-first approach.',
                author: 'Sarah Johnson',
                country: 'Estonia',
                flag: '🇪🇪',
                date: 'January 15, 2024',
                category: 'Company Formation',
                readTime: 8,
                image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
              },
              {
                title: 'AI Investment Opportunities Guide 2024',
                excerpt: 'Discover emerging markets and investment opportunities with AI-powered analysis across strategic jurisdictions.',
                author: 'Michael Chen',
                country: 'USA',
                flag: '🇺🇸',
                date: 'January 12, 2024',
                category: 'Investment',
                readTime: 12,
                image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
              },
              {
                title: 'Malta Golden Visa Program Updates for 2024',
                excerpt: 'Updated visa requirements and application processes for Malta residency programs with new investment thresholds.',
                author: 'Antonio Rucci',
                country: 'Malta',
                flag: '🇲🇹',
                date: 'January 10, 2024',
                category: 'Visa & Immigration',
                readTime: 6,
                image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop'
              }
            ].map((post, index) => (
              <article
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">{post.flag}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.author}</div>
                      <div className="text-xs text-gray-500">Consultant • {post.country}</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{post.date}</span>
                    <span>{post.readTime} min read</span>
                  </div>

                  <Link
                    to="/blog"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Read Article
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl"
            >
              View All Insights
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;