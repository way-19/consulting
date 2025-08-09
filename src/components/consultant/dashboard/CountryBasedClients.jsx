import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import ClientDataManager from '../../../lib/clientDataManager';
import {
  Users,
  Globe,
  Filter,
  Search,
  Eye,
  MessageSquare,
  Calendar,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// Export fetchClients for legacy usage
export async function fetchClients({ consultantId, countryId, search = '', limit = 50, offset = 0 }) {
  return ClientDataManager.fetchConsultantClients({
    consultantId,
    countryId,
    search,
    limit,
    offset
  });
}

const CountryBasedClients = ({ consultantId }) => {
  const [clients, setClients] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCountries();
  }, [consultantId]);

  useEffect(() => {
    loadClients();
  }, [consultantId, selectedCountry]);

  const loadCountries = async () => {
    try {
      const { data: assignedCountries } = await supabase
        .from('consultant_country_assignments')
        .select(`countries(id, name, flag_emoji)`)
        .eq('consultant_id', consultantId)
        .eq('status', true);

      const countryList = assignedCountries?.map(ac => ac.countries) || [];
      setCountries(countryList);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadClients = async () => {
    try {
      setLoading(true);
      const countryId = selectedCountry === 'all' ? 0 : parseInt(selectedCountry);
      const clientsData = await ClientDataManager.fetchConsultantClients({
        consultantId,
        countryId,
        search: '',
        limit: 50,
        offset: 0
      });

      const transformed = (clientsData || []).map((c) => ({
        id: c.client_id,
        first_name: c.full_name.split(' ')[0] || '',
        last_name: c.full_name.split(' ').slice(1).join(' ') || '',
        email: c.email,
        countries: { name: c.country_name, flag_emoji: '' },
        applications_count: c.applications_count,
        total_revenue: c.total_revenue,
      }));
      setClients(transformed);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    return (
      searchTerm === '' ||
      `${client.full_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getClientStats = (client) => {
    return {
      total: client.applications_count || 0,
      active: client.applications_count || 0,
      completed: 0,
      revenue: client.total_revenue || 0,
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-3 text-blue-600" />
          Ülke Bazlı Müşterilerim
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadClients}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-500">
            {filteredClients.length} müşteri
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Müşteri ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">Tüm Ülkeler</option>
            {countries.map(country => (
              <option key={country.id} value={country.id}>
                {country.flag_emoji} {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Country Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {countries.map(country => {
          const countryClients = clients.filter(c => c.country_id === country.id);
          const totalRevenue = countryClients.reduce((sum, client) => {
            return sum + getClientStats(client).revenue;
          }, 0);

          return (
            <div key={country.id} className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl">{country.flag_emoji}</span>
                    <span className="font-semibold text-blue-900">{country.name}</span>
                  </div>
                  <p className="text-sm text-blue-700">{countryClients.length} müşteri</p>
                  <p className="text-lg font-bold text-blue-900">${totalRevenue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Client List */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Bu kriterlere uygun müşteri bulunamadı.</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const stats = getClientStats(client);
            
            return (
              <div
                key={client.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">{client.countries?.flag_emoji}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {client.first_name} {client.last_name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          • {client.countries?.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{client.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {stats.total} toplam başvuru
                        </span>
                        <span className="text-xs text-gray-500">
                          {stats.active} aktif
                        </span>
                        <span className="text-xs text-green-600 font-medium">
                          ${stats.revenue.toFixed(2)} gelir
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                      <Calendar className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                  Toplam Başvuru: {stats.total} • Toplam Gelir: ${stats.revenue}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CountryBasedClients;