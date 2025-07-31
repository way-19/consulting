import React from 'react';
import { ArrowRight, CheckCircle, Star, Users, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CountryPageProps {
  country: string;
}

const CountryPage: React.FC<CountryPageProps> = ({ country }) => {
  const { t } = useLanguage();

  // Country specific data
  const countryData: Record<string, any> = {
    georgia: {
      name: 'Georgia',
      flag: '🇬🇪',
      image: 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      description: 'Strategic location between Europe and Asia with favorable tax system',
      advantages: ['0% tax on foreign-sourced income', 'Strategic location', 'Simple company formation'],
      stats: { setupTime: '3-5 days', clients: '1,247', rating: '4.9' }
    },
    usa: {
      name: 'United States',
      flag: '🇺🇸',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      description: 'Access to the world\'s largest economy',
      advantages: ['Global market access', 'Delaware business laws', 'Advanced financial systems'],
      stats: { setupTime: '1-2 days', clients: '892', rating: '4.8' }
    },
    montenegro: {
      name: 'Montenegro',
      flag: '🇲🇪',
      image: 'https://images.pexels.com/photos/15031396/pexels-photo-15031396.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      description: 'EU candidate country with investment opportunities',
      advantages: ['EU candidate status', 'Investment programs', 'Adriatic location'],
      stats: { setupTime: '5-7 days', clients: '634', rating: '4.7' }
    },
    estonia: {
      name: 'Estonia',
      flag: '🇪🇪',
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      description: 'Digital-first approach with e-Residency program',
      advantages: ['e-Residency program', 'Digital government', 'EU membership'],
      stats: { setupTime: '1 day', clients: '1,156', rating: '4.9' }
    },
    portugal: {
      name: 'Portugal',
      flag: '🇵🇹',
      image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      description: 'EU membership with Golden Visa program',
      advantages: ['Golden Visa program', 'EU membership', 'Quality of life'],
      stats: { setupTime: '7-10 days', clients: '789', rating: '4.8' }
    },
    malta: {
      name: 'Malta',
      flag: '🇲🇹',
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      description: 'EU membership with sophisticated tax planning',
      advantages: ['EU tax optimization', 'Financial services hub', 'English-speaking'],
      stats: { setupTime: '5-7 days', clients: '567', rating: '4.7' }
    },
    panama: {
      name: 'Panama',
      flag: '🇵🇦',
      image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      description: 'Premier offshore jurisdiction with banking privacy',
      advantages: ['Offshore advantages', 'Banking privacy', 'USD currency'],
      stats: { setupTime: '3-5 days', clients: '445', rating: '4.6' }
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
                {data.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{data.stats.setupTime}</div>
                  <div className="text-sm text-gray-600">Setup Time</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{data.stats.clients}</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{data.stats.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                {t('service.companyFormation')}
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </button>
            </div>

            {/* Advantages List */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Advantages</h3>
              <div className="space-y-4">
                {data.advantages.map((advantage: string, index: number) => (
                  <div key={index} className="flex items-start">
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
            Contact our {data.name} specialists for personalized guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl">
              {t('service.companyFormation')}
            </button>
            <a
              href="/contact"
              className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-all duration-300"
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