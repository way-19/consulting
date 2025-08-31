import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Globe } from 'lucide-react';
import { useLanguage } from '../../lib/language';
import { Card, Button } from '../../lib/ui';

const FeaturedCountriesSection = () => {
  const { t } = useLanguage();

  const featuredCountries = [
    {
      id: 'uae',
      name: t('unitedArabEmirates'),
      flag: '🇦🇪',
      highlight: t('uaeHighlight'),
      advantages: [t('noPersonalIncomeTax'), t('strategicLocation'), t('modernInfrastructure'), t('businessFriendlyRegulations')],
      image: 'https://images.pexels.com/photos/1769606/pexels-photo-1769606.jpeg?auto=compress&cs=tinysrgb&w=800',
      taxRate: '0%',
      setupTime: '7-14 days',
    },
    {
      id: 'estonia',
      name: t('estonia'),
      flag: '🇪🇪',
      highlight: t('estoniaHighlight'),
      advantages: [t('digitalFirstApproach'), t('euMarketAccess'), t('lowBureaucracy'), t('innovationFriendly')],
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
      taxRate: '20%',
      setupTime: '1-2 weeks',
    },
    {
      id: 'georgia',
      name: t('georgia'),
      flag: '🇬🇪',
      highlight: t('georgiaHighlight'),
      advantages: [t('simpleIncorporation'), t('veryLowTaxes'), t('strategicLocation'), t('fastSetup')],
      image: 'https://images.pexels.com/photos/5137987/pexels-photo-5137987.jpeg?auto=compress&cs=tinysrgb&w=800',
      taxRate: '1%',
      setupTime: '3-5 days',
    },
    {
      id: 'malta',
      name: t('malta'),
      flag: '🇲🇹',
      highlight: t('maltaHighlight'),
      advantages: [t('euMarketAccess'), t('blockchainFriendly'), t('englishSpeaking'), t('strategicMediterraneanLocation')],
      image: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=800',
      taxRate: '5%',
      setupTime: '2-3 weeks',
    },
    {
      id: 'panama',
      name: t('panama'),
      flag: '🇵🇦',
      highlight: t('panamaHighlight'),
      advantages: [t('territorialTaxation'), t('strongBankingPrivacy'), t('usDollarEconomy'), t('internationalBusinessHub')],
      image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800',
      taxRate: '25%',
      setupTime: '2-4 weeks',
    },
    {
      id: 'portugal',
      name: t('portugal'),
      flag: '🇵🇹',
      highlight: t('portugalHighlight'),
      advantages: [t('euMarketAccess'), t('nhrTaxProgram'), t('investmentImmigration'), t('strategicAtlanticLocation')],
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=800',
      taxRate: '21%',
      setupTime: '3-6 weeks',
    },
    {
      id: 'usa',
      name: t('unitedStates'),
      flag: '🇺🇸',
      highlight: t('usaHighlight'),
      advantages: [t('largestConsumerMarket'), t('advancedInfrastructure'), t('innovationHub'), t('strongLegalSystem')],
      image: 'https://images.pexels.com/photos/1975844/pexels-photo-1975844.jpeg?auto=compress&cs=tinysrgb&w=800',
      taxRate: '21%',
      setupTime: '1-2 weeks',
    },
    {
      id: 'switzerland',
      name: t('switzerland'),
      flag: '🇨🇭',
      highlight: t('switzerlandHighlight'),
      advantages: [t('politicalStability'), t('worldClassBanking'), t('innovationHub'), t('strategicEuLocation')],
      image: 'https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=800',
      taxRate: '11-24%',
      setupTime: '2-4 weeks',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          {/* Modern Header Background */}
          <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-2xl p-12 mb-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-8 w-16 h-16 border border-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-8 w-12 h-12 border border-teal-400 rounded-lg rotate-45 animate-bounce"></div>
              <div className="absolute top-1/2 left-1/4 w-8 h-8 border border-purple-400 rounded-full animate-ping"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center bg-blue-500/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
                <Globe className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-blue-300 font-medium">{t('businessFriendlyJurisdictions')}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('featuredCountriesTitle')}
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                {t('featuredCountriesDescription')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredCountries.map((country, index) => (
            <div key={country.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={country.image} 
                  alt={country.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="relative h-80 flex flex-col justify-between p-6 text-white">
                {/* Top Section */}
                <div className="flex justify-between items-start">
                  <div className="text-4xl">{country.flag}</div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                    <span className="text-sm font-bold text-white">{country.taxRate}</span>
                  </div>
                </div>
                
                {/* Bottom Section */}
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {country.name}
                  </h3>
                  
                  <div className="bg-green-500/20 backdrop-blur-sm p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-green-200">
                      {country.highlight}
                    </p>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {country.advantages.slice(0, 2).map((advantage, i) => (
                      <div key={i} className="flex items-center text-sm text-gray-200">
                        <TrendingUp className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                        <span>{advantage}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-300 mb-4">
                    <span>Setup: {country.setupTime}</span>
                    <span>Tax: {country.taxRate}</span>
                  </div>
                  
                  {/* Button - appears on hover */}
                  <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <Link to={`/countries/${country.id}`}>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                      >
                        {t('learnMore')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/countries">
            <Button size="lg" variant="secondary" icon={ArrowRight} iconPosition="right" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0">
              {t('exploreAllCountriesBtn') || 'Explore All Countries'}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCountriesSection;