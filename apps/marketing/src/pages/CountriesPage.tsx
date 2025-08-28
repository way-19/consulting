import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, TrendingUp, Users, Globe } from 'lucide-react';
import { useLanguage } from '@consulting19/shared';
import { Card, Button } from '@consulting19/ui';

const CountriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const countries = [
    {
      id: 'uae',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      region: 'middle-east',
      taxRate: '0%',
      highlight: 'countriesPage.uaeHighlight',
      advantages: ['countriesPage.uaeAdvantage1', 'countriesPage.uaeAdvantage2', 'countriesPage.uaeAdvantage3', 'countriesPage.uaeAdvantage4'],
      image: 'https://images.pexels.com/photos/1769606/pexels-photo-1769606.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: true,
    },
    {
      id: 'estonia',
      name: 'Estonia',
      flag: '🇪🇪',
      region: 'europe',
      taxRate: '20%',
      highlight: 'countriesPage.estoniaHighlight',
      advantages: ['countriesPage.estoniaAdvantage1', 'countriesPage.estoniaAdvantage2', 'countriesPage.estoniaAdvantage3', 'countriesPage.estoniaAdvantage4'],
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: true,
    },
    {
      id: 'georgia',
      name: 'Georgia',
      flag: '🇬🇪',
      region: 'europe',
      taxRate: '1%',
      highlight: 'countriesPage.georgiaHighlight',
      advantages: ['countriesPage.georgiaAdvantage1', 'countriesPage.georgiaAdvantage2', 'countriesPage.georgiaAdvantage3', 'countriesPage.georgiaAdvantage4'],
      image: 'https://images.pexels.com/photos/5137987/pexels-photo-5137987.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: false,
    },
    {
      id: 'malta',
      name: 'Malta',
      flag: '🇲🇹',
      region: 'europe',
      taxRate: '5%',
      highlight: 'countriesPage.maltaHighlight',
      advantages: ['countriesPage.maltaAdvantage1', 'countriesPage.maltaAdvantage2', 'countriesPage.maltaAdvantage3', 'countriesPage.maltaAdvantage4'],
      image: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: false,
    },
    {
      id: 'panama',
      name: 'Panama',
      flag: '🇵🇦',
      region: 'americas',
      taxRate: '25%',
      highlight: 'countriesPage.panamaHighlight',
      advantages: ['countriesPage.panamaAdvantage1', 'countriesPage.panamaAdvantage2', 'countriesPage.panamaAdvantage3', 'countriesPage.panamaAdvantage4'],
      image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: false,
    },
    {
      id: 'portugal',
      name: 'Portugal',
      flag: '🇵🇹',
      region: 'europe',
      taxRate: '21%',
      highlight: 'countriesPage.portugalHighlight',
      advantages: ['countriesPage.portugalAdvantage1', 'countriesPage.portugalAdvantage2', 'countriesPage.portugalAdvantage3', 'countriesPage.portugalAdvantage4'],
      image: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: false,
    },
    {
      id: 'usa',
      name: 'United States',
      flag: '🇺🇸',
      region: 'americas',
      taxRate: '21%',
      highlight: 'countriesPage.usaHighlight',
      advantages: ['countriesPage.usaAdvantage1', 'countriesPage.usaAdvantage2', 'countriesPage.usaAdvantage3', 'countriesPage.usaAdvantage4'],
      image: 'https://images.pexels.com/photos/1975844/pexels-photo-1975844.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: false,
    },
    {
      id: 'montenegro',
      name: 'Montenegro',
      flag: '🇲🇪',
      region: 'europe',
      taxRate: '9%',
      highlight: 'countriesPage.montenegroHighlight',
      advantages: ['countriesPage.montenegroAdvantage1', 'countriesPage.montenegroAdvantage2', 'countriesPage.montenegroAdvantage3', 'countriesPage.montenegroAdvantage4'],
      image: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: false,
    },
    {
      id: 'switzerland',
      name: 'Switzerland',
      flag: '🇨🇭',
      region: 'europe',
      taxRate: '11-24%',
      highlight: 'countriesPage.switzerlandHighlight',
      advantages: ['countriesPage.switzerlandAdvantage1', 'countriesPage.switzerlandAdvantage2', 'countriesPage.switzerlandAdvantage3', 'countriesPage.switzerlandAdvantage4'],
      image: 'https://images.pexels.com/photos/1906658/pexels-photo-1906658.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: false,
    },
  ];

  const regions = [
    { value: 'all', label: 'countriesPage.allRegions' },
    { value: 'europe', label: 'countriesPage.regionEurope' },
    { value: 'asia', label: 'countriesPage.regionAsia' },
    { value: 'middle-east', label: 'countriesPage.regionMiddleEast' },
    { value: 'americas', label: 'countriesPage.regionAmericas' },
  ];

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const featuredCountries = filteredCountries.filter(c => c.featured);
  const otherCountries = filteredCountries.filter(c => !c.featured);

  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('countriesPage.heroTitle')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {t('countriesPage.heroDescription')}
          </p>
        </div>
      </section>


      {/* Search and Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('countriesPage.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}> {/* Use t() for region labels */}
                    {t(region.label)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Countries */}
        {/* All Countries */}
        {filteredCountries.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('countriesPage.availableDestinations')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCountries.map((country) => (
                <CountryCard key={country.id} country={country} />
              ))}
            </div>
          </div>
        )}

        {filteredCountries.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('countriesPage.noCountriesFoundTitle')}</h3>
            <p className="text-gray-600">{t('countriesPage.noCountriesFoundDesc')}</p>
          </div>
        )}
      </section>
    </div>
  );
};

interface CountryCardProps {
  country: any;
  featured?: boolean;
}

const { t } = useLanguage(); // Access t() outside the component for CountryCard

const CountryCard: React.FC<CountryCardProps> = ({ country, featured = false }) => {
  return (
    <Card hover className="h-full">
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img 
          src={country.image} 
          alt={country.name}
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 shadow-md">
          <span className="text-2xl">{country.flag}</span>
        </div>
        {featured && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {t('countriesPage.featuredBadge')}
          </div>
        )}
      </div>
      
      <Card.Body className="h-full flex flex-col">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {country.name}
        </h3>
        
        <div className="bg-green-50 p-3 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-800">{t('countriesPage.corporateTax')}</span>
            <span className="text-lg font-bold text-green-900">{country.taxRate}</span>
          </div>
          <div className="text-xs text-green-700 mt-1">{t(country.highlight)}</div>
        </div>
        
        <ul className="space-y-2 flex-1 mb-6">
          {country.advantages.slice(0, 3).map((advantage: string, i: number) => (
            <li key={i} className="text-sm text-gray-600 flex items-center">
              <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
              {t(advantage)}
            </li>
          ))}
        </ul>
        
        <Link to={`/countries/${country.id}`}>
          <Button variant="primary" size="md" className="w-full">
            {t('countriesPage.learnMoreBtn')}
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CountriesPage;