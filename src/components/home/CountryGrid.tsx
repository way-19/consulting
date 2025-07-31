import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  TrendingUp, 
  MapPin,
  Users,
  Clock,
  Award,
  Brain,
  Zap,
  Target,
  Sparkles,
  Globe
} from 'lucide-react';

const CountryGrid: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const countries = [
    {
      id: 1,
      name: 'Georgia',
      slug: 'georgia',
      flag: '🇬🇪',
      capital: 'Tbilisi',
      advantage: '0% Tax on Foreign Income',
      description: 'Easy company formation with significant tax advantages and strategic location.',
      image: 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.9,
      clients: 1247,
      timeToSetup: '3-5 days',
      highlights: ['Zero tax on foreign income', 'Strategic EU-Asia location', 'Simple incorporation process', 'Banking friendly environment']
    },
    {
      id: 2,
      name: 'United States',
      slug: 'usa',
      flag: '🇺🇸',
      capital: 'Delaware',
      advantage: 'Global Market Access',
      description: 'Delaware LLC formation providing access to the world\'s largest economy.',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.8,
      clients: 892,
      timeToSetup: '1-2 days',
      highlights: ['World\'s largest market', 'Delaware business laws', 'Global credibility', 'Advanced banking system']
    },
    {
      id: 3,
      name: 'Montenegro',
      slug: 'montenegro',
      flag: '🇲🇪',
      capital: 'Podgorica',
      advantage: 'EU Candidate Benefits',
      description: 'EU candidacy status with investment opportunities and residency programs.',
      image: 'https://images.pexels.com/photos/15031396/pexels-photo-15031396.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.7,
      clients: 634,
      timeToSetup: '5-7 days',
      highlights: ['EU candidate status', 'Residency by investment', 'Low corporate tax', 'Adriatic location']
    },
    {
      id: 4,
      name: 'Estonia',
      slug: 'estonia',
      flag: '🇪🇪',
      capital: 'Tallinn',
      advantage: 'Digital Nomad Paradise',
      description: 'e-Residency program and digital-first approach for modern businesses.',
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.9,
      clients: 1156,
      timeToSetup: '1 day',
      highlights: ['e-Residency program', 'Digital government', 'EU membership', 'Tech-friendly environment']
    },
    {
      id: 5,
      name: 'Portugal',
      slug: 'portugal',
      flag: '🇵🇹',
      capital: 'Lisbon',
      advantage: 'Golden Visa Gateway',
      description: 'EU membership benefits with Golden Visa program and favorable tax regime.',
      image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.8,
      clients: 789,
      timeToSetup: '7-10 days',
      highlights: ['Golden Visa program', 'EU membership', 'NHR tax regime', 'Quality of life']
    },
    {
      id: 6,
      name: 'Malta',
      slug: 'malta',
      flag: '🇲🇹',
      capital: 'Valletta',
      advantage: 'EU Tax Optimization',
      description: 'EU membership with sophisticated tax planning and financial services.',
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.7,
      clients: 567,
      timeToSetup: '5-7 days',
      highlights: ['EU tax optimization', 'Financial services hub', 'English speaking', 'Strategic location']
    },
    {
      id: 7,
      name: 'Panama',
      slug: 'panama',
      flag: '🇵🇦',
      capital: 'Panama City',
      advantage: 'Offshore Finance Hub',
      description: 'Premier offshore jurisdiction with strong banking and privacy laws.',
      image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.6,
      clients: 445,
      timeToSetup: '3-5 days',
      highlights: ['Offshore advantages', 'Banking privacy', 'No foreign tax', 'Strategic Americas location']
    },
    {
      id: 8,
      name: 'UAE',
      slug: 'uae',
      flag: '🇦🇪',
      capital: 'Dubai',
      advantage: 'Zero Tax Jurisdiction',
      description: 'World-class business hub with zero corporate tax and strategic location.',
      image: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      rating: 4.9,
      clients: 1034,
      timeToSetup: '2-3 days',
      highlights: ['Zero corporate tax', 'Global business hub', 'Strategic location', 'World-class infrastructure']
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container">
        <div className="text-center mb-16 fade-in">
          <div className="inline-flex items-center bg-primary-50 border border-primary-200 rounded-full px-4 py-2 mb-6">
            <MapPin className="h-4 w-4 text-primary-600 mr-2" />
            <span className="text-primary-700 text-sm font-medium">8 Strategic Jurisdictions</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Country 
            <span className="text-gradient"> Recommendations</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the perfect jurisdiction for your business with intelligent guidance 
            from our expert consultants and AI-powered analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {countries.map((country, index) => (
            <div
              key={country.id}
              className="group relative card-country scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Link to={`/${country.slug}`}>
                <div className="overflow-hidden h-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 hover-glow">
                  {/* Country Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={country.image}
                      alt={`${country.name} business formation`}
                      className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/50 transition-all duration-300" />
                    
                    {/* Flag and Rating */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <span className="text-3xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{country.flag}</span>
                      <div className="flex items-center glass-effect rounded-full px-2 py-1 hover-lift">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium ml-1">{country.rating}</span>
                      </div>
                    </div>

                    {/* Trending Indicator */}
                    <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2 shadow-lg pulse-glow hover-lift">
                      <TrendingUp className="h-4 w-4" />
                    </div>

                    {/* Country Name Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg text-shadow-glow group-hover:scale-105 transition-transform duration-300">
                        {country.name}
                      </h3>
                      <p className="text-white/90 text-sm drop-shadow text-shadow">
                        {country.capital}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Key Advantage */}
                    <div className="gradient-border rounded-lg mb-4">
                      <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-3 relative z-10">
                        <div className="text-xs font-medium text-primary-600 mb-1">KEY ADVANTAGE</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {country.advantage}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {country.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
                      <div className="flex items-center text-gray-500">
                        <Users className="h-3 w-3 mr-1 group-hover:text-primary-500 transition-colors duration-300" />
                        <span>{country.clients.toLocaleString()} clients</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-3 w-3 mr-1 group-hover:text-primary-500 transition-colors duration-300" />
                        <span>{country.timeToSetup}</span>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className={`overflow-hidden mb-4 transition-all duration-500 ${hoveredCard === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="space-y-1">
                        {country.highlights.slice(0, 3).map((highlight, idx) => (
                          <div key={idx} className="flex items-center text-xs text-gray-600">
                            <Award className="h-3 w-3 text-primary-500 mr-2 flex-shrink-0 scale-in" style={{ animationDelay: `${idx * 0.1}s` }} />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between group-hover:text-primary-600 transition-colors duration-300">
                      <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 transition-colors">
                        Explore {country.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary-600 group-hover:text-primary-700 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* AI Recommendation CTA */}
        <div className="text-center fade-in relative">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl floating"></div>
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-500/10 rounded-full blur-2xl floating" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/5 rounded-full blur-xl floating" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary-400/30 rounded-full floating"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${4 + i}s`
                }}
              />
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 max-w-4xl mx-auto border border-primary-200 relative z-10 pulse-glow">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Brain className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              <span className="text-gradient">Revolutionary AI Oracle</span>
              <br />
              <span className="text-xl">Predicts Your Perfect Jurisdiction</span>
            </h3>
            
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto text-base leading-relaxed">
              Our advanced AI analyzes 847 regulatory factors across 8 strategic jurisdictions, 
              processing real-time market data to deliver personalized recommendations with 98.7% accuracy. 
              Experience the future of international business consulting.
            </p>

            {/* Advanced Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Real-Time Analysis</h4>
                <p className="text-xs text-gray-600">Live regulatory updates</p>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Precision Matching</h4>
                <p className="text-xs text-gray-600">98.7% accuracy rate</p>
              </div>
              <div className="text-center p-3 bg-white/50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Global Intelligence</h4>
                <p className="text-xs text-gray-600">8 strategic jurisdictions</p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex justify-center items-center space-x-6 mb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-primary-500" />
                <span>1,247+ Successful Matches</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1 text-yellow-500" />
                <span>98.7% Success Rate</span>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-primary-600 to-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-lg hover:scale-105 flex items-center mx-auto">
              <Sparkles className="mr-2 h-4 w-4" />
              Discover Your Perfect Jurisdiction
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>

            {/* Floating Text Elements */}
            <div className="absolute -top-2 -left-2 text-xs text-primary-600 font-medium opacity-70 floating">
              AI-Powered
            </div>
            <div className="absolute -bottom-2 -right-2 text-xs text-accent-600 font-medium opacity-70 floating" style={{ animationDelay: '1s' }}>
              98.7% Accurate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountryGrid;