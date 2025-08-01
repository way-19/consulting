import React from 'react';
import { ArrowRight, CheckCircle, Star, Users, Clock, Globe } from 'lucide-react';

const CountryPage = ({ country }) => {
  // Country specific data
  const countryData = {
    georgia: {
      name: 'Georgia',
      flag: '🇬🇪',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop',
      description: 'Strategic location between Europe and Asia with favorable tax system',
      advantages: ['0% tax on foreign-sourced income', 'Strategic location', 'Simple company formation', 'Fast setup process'],
      stats: { setupTime: '3-5 days', clients: '1,247', rating: '4.9', satisfaction: '98%' },
      details: 'Georgia offers one of the most business-friendly environments in the world with its unique territorial tax system, allowing businesses to pay 0% tax on foreign-sourced income.'
    },
    usa: {
      name: 'United States',
      flag: '🇺🇸',
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200&h=800&fit=crop',
      description: 'Access to the world\'s largest economy',
      advantages: ['Global market access', 'Delaware business laws', 'Advanced financial systems', 'Strong legal framework'],
      stats: { setupTime: '1-2 days', clients: '892', rating: '4.8', satisfaction: '97%' },
      details: 'The United States provides unparalleled access to global markets, advanced financial systems, and the world\'s most sophisticated business infrastructure.'
    },
    montenegro: {
      name: 'Montenegro',
      flag: '🇲🇪',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      description: 'EU candidate country with investment opportunities',
      advantages: ['EU candidate status', 'Investment programs', 'Adriatic location', 'Growing economy'],
      stats: { setupTime: '5-7 days', clients: '634', rating: '4.7', satisfaction: '96%' },
      details: 'Montenegro offers unique opportunities as an EU candidate country with attractive investment programs and a strategic Adriatic location.'
    },
    estonia: {
      name: 'Estonia',
      flag: '🇪🇪',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&h=800&fit=crop',
      description: 'Digital-first approach with e-Residency program',
      advantages: ['e-Residency program', 'Digital government', 'EU membership', '100% online setup'],
      stats: { setupTime: '1 day', clients: '1,156', rating: '4.9', satisfaction: '99%' },
      details: 'Estonia leads the world in digital governance with its e-Residency program, allowing global entrepreneurs to access EU markets entirely online.'
    },
    portugal: {
      name: 'Portugal',
      flag: '🇵🇹',
      image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&h=800&fit=crop',
      description: 'EU membership with Golden Visa program',
      advantages: ['Golden Visa program', 'EU membership', 'Quality of life', 'Tax incentives'],
      stats: { setupTime: '7-10 days', clients: '789', rating: '4.8', satisfaction: '97%' },
      details: 'Portugal combines EU membership benefits with attractive residency programs and excellent quality of life for international entrepreneurs.'
    },
    malta: {
      name: 'Malta',
      flag: '🇲🇹',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1200&h=800&fit=crop',
      description: 'EU membership with sophisticated tax planning',
      advantages: ['EU tax optimization', 'Financial services hub', 'English-speaking', 'Strategic location'],
      stats: { setupTime: '5-7 days', clients: '567', rating: '4.7', satisfaction: '96%' },
      details: 'Malta serves as a premier EU financial services hub with sophisticated tax planning opportunities and English as an official language.'
    },
    panama: {
      name: 'Panama',
      flag: '🇵🇦',
      image: 'https://images.unsplash.com/photo-1544737151-6e4b9d1b4c3d?w=1200&h=800&fit=crop',
      description: 'Premier offshore jurisdiction with banking privacy',
      advantages: ['Offshore advantages', 'Banking privacy', 'USD currency', 'No foreign tax'],
      stats: { setupTime: '3-5 days', clients: '445', rating: '4.6', satisfaction: '95%' },
      details: 'Panama offers world-class offshore banking and corporate services with strong privacy laws and the stability of USD currency.'
    },
    uae: {
      name: 'UAE',
      flag: '🇦🇪',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop',
      description: 'Tax-free business hub with world-class infrastructure',
      advantages: ['0% corporate tax', 'Strategic location', 'World-class infrastructure', 'Business-friendly'],
      stats: { setupTime: '2-3 days', clients: '923', rating: '4.9', satisfaction: '98%' },
      details: 'The UAE provides a tax-free business environment with world-class infrastructure and strategic access to Middle East, Africa, and Asian markets.'
    }
  };

  const data = countryData[country];

  if (!data) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Country not found</h1>
          <a href="/" className="text-purple-600 hover:text-purple-700">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="flex items-center mb-4">
              <span className="text-6xl mr-4">{data.flag}</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Start Your Business in {data.name}
                </h1>
                <p className="text-xl text-white/90">{data.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Description */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose {data.name}?
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {data.details}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{data.stats.setupTime}</div>
                  <div className="text-sm text-gray-600">Setup Time</div>
                </div>
                <div className="text-center bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{data.stats.clients}</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{data.stats.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Globe className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{data.stats.satisfaction}</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href="/contact"
                className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Start Company Formation
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>

            {/* Advantages List */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Advantages</h3>
              <div className="space-y-4">
                {data.advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start bg-white rounded-xl p-4 shadow-lg">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Contact our {data.name} specialists for personalized guidance and expert support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl"
            >
              Start Company Formation
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-all duration-300"
            >
              Contact Expert
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountryPage;