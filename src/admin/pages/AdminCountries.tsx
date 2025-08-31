import React, { useState, useEffect } from 'react';
import { Plus, Edit, Globe, Users, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, Button } from '../../shared/components/ui';
import { supabase, Country } from '../../shared/lib/supabase';
import { useLanguage } from '../../shared/contexts/LanguageContext';

const AdminCountries = () => {
  const { t } = useLanguage();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching countries:', error);
      } else {
        setCountries(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCountryStatus = async (countryId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('countries')
        .update({ is_active: !currentStatus })
        .eq('id', countryId);

      if (error) {
        console.error('Error updating country status:', error);
      } else {
        fetchCountries();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Country Management</h1>
          <p className="text-gray-600">Manage supported countries and consultant assignments</p>
        </div>
        <Button icon={Plus}>
          Add Country
        </Button>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <Card key={country.id} hover>
            <Card.Body>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{country.flag_emoji}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{country.name}</h3>
                    <p className="text-sm text-gray-500">{country.code}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleCountryStatus(country.id, country.is_active)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    country.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {country.is_active ? (
                    <ToggleRight className="w-3 h-3" />
                  ) : (
                    <ToggleLeft className="w-3 h-3" />
                  )}
                  <span>{country.is_active ? t('active') : t('inactive')}</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {country.description_i18n?.en || 'No description available'}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>0 consultants</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  <span>0 services</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" icon={Edit} className="flex-1">
                  {t('edit')}
                </Button>
                <Button variant="outline" size="sm" icon={Users} className="flex-1">
                  Assign Consultants
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {countries.length === 0 && (
        <Card>
          <Card.Body className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Countries Added
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first country to start building the consultant network
            </p>
            <Button icon={Plus}>
              Add First Country
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AdminCountries;