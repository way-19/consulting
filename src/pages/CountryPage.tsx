import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSupabase } from '../contexts/SupabaseContext';

interface CountryPageProps {
  country: string;
}

const CountryPage: React.FC<CountryPageProps> = ({ country }) => {
  const { t } = useLanguage();
  const { getCountryBySlug } = useSupabase();
  const [countryData, setCountryData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadCountryData = async () => {
      try {
        const data = await getCountryBySlug(country);
        setCountryData(data);
      } catch (error) {
        console.error('Error loading country:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCountryData();
  }, [country, getCountryBySlug]);

  // Country specific data
  const countryDetails = {
    georgia: {
      image: 'https://images.pexels.com/photos/12461213/pexels-photo-12461213.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      stats: { setupTime: '3-5 days', clients: '1,247', rating: '4.9' }
    },
    usa: {
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      stats: { setupTime: '1-2 days', clients: '892', rating: '4.8' }
    },
    montenegro: {
      image: 'https://images.pexels.com/photos/15031396/pexels-photo-15031396.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      stats: { setupTime: '5-7 days', clients: '634', rating: '4.7' }
    },
    estonia: {
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      stats: { setupTime: '1 day', clients: '1,156', rating: '4.9' }
    },
    portugal: {
      image: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      stats: { setupTime: '7-10 days', clients: '789', rating: '4.8' }
    },
    malta: {
      image: 'https://images.pexels.com/photos/9816335/pexels-photo-9816335.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      stats: { setupTime: '5-7 days', clients: '567', rating: '4.7' }
    },
    panama: {
      image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop',
      stats: { setupTime: '3-5 days', clients: '445', rating: '4.6' }
    }
  };

  const details = countryDetails[country as keyof typeof countryDetails];

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (!countryData || !details) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Country not found</h1>
          <Link to="/" className="text-purple-600 hover:text-purple-700">
            {t('common.backHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={details.image}
          alt={countryData.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="flex items-center mb-4">
              <span className="text-6xl mr-4">{countryData.flag_emoji}</span>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Start Your Business in {countryData.name}
                </h1>
                <p className="text-xl text-white/90">{countryData.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Advantage Banner */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {t(`country.${country}.advantage`)}
          </h2>
          <p className="text-white/90">
            Key advantage of doing business in {countryData.name}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Description */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose {countryData.name}?
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {countryData.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{details.stats.setupTime}</div>
                  <div className="text-sm text-gray-600">Setup Time</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{details.stats.clients}</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="h-5 w-5 text-purple-600 mr-1" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{details.stats.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
                {t('button.companyFormation')}
                <ArrowRight className="ml-2 h-5 w-5 inline" />
              </button>
            </div>

            {/* Advantages List */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Advantages</h3>
              <div className="space-y-4">
                {countryData.advantages.map((advantage: string, index: number) => (
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
            Contact our {countryData.name} specialists for personalized guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl">
              {t('button.companyFormation')}
            </button>
            <Link
              to="/contact"
              className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-50 transition-all duration-300"
            >
              {t('button.contactExpert')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CountryPage;