import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';

const FeaturedCountriesSection = () => {
  const countries = [
    {
      id: 'uae',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      highlight: '0% corporate tax for 50 years in free zones',
      advantages: ['No personal income tax', 'Strategic location', 'Modern infrastructure'],
      image: 'https://images.pexels.com/photos/1769606/pexels-photo-1769606.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'estonia',
      name: 'Estonia',
      flag: '🇪🇪',
      highlight: '100% online e-Residency program',
      advantages: ['Digital-first approach', 'EU market access', 'Low bureaucracy'],
      image: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'georgia',
      name: 'Georgia',
      flag: '🇬🇪',
      highlight: 'Small Business Status - 1% tax',
      advantages: ['Simple incorporation', 'Low taxes', 'Strategic location'],
      image: 'https://images.pexels.com/photos/5137987/pexels-photo-5137987.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Business-Friendly Jurisdictions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the world's most attractive destinations for international business expansion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {countries.map((country, index) => (
            <Card key={country.id} hover className="h-full">
              <div className="relative h-48 overflow-hidden rounded-t-xl">
                <img 
                  src={country.image} 
                  alt={country.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-1 shadow-md">
                  <span className="text-2xl">{country.flag}</span>
                </div>
              </div>
              
              <Card.Body className="h-full flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {country.name}
                </h3>
                
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center text-green-800">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{country.highlight}</span>
                  </div>
                </div>
                
                <ul className="space-y-2 flex-1">
                  {country.advantages.map((advantage, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {advantage}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6">
                  <Link to={`/countries/${country.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/countries">
            <Button size="lg" variant="secondary" icon={ArrowRight} iconPosition="right">
              Explore All Countries
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCountriesSection;