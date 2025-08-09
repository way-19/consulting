import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { 
  Globe, 
  Plus, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User,
  FileText,
  ArrowRight
} from 'lucide-react';

const CountryServiceRequest = ({ clientId, clientCountryId }) => {
  const [countries, setCountries] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    target_country_id: '',
    service_type: '',
    service_description: '',
    estimated_amount: '',
    priority: 'normal'
  });

  const serviceTypes = [
    'Company Formation',
    'Bank Account Opening',
    'Tax Residency',
    'Visa & Residence',
    'Accounting Services',
    'Legal Consulting',
    'Investment Advisory',
    'Market Research'
  ];

  useEffect(() => {
    loadData();
  }, [clientId]);

  const loadData = async () => {
    try {
      // Load countries (excluding client's primary country)
      const { data: countriesData } = await supabase
        .from('countries')
        .select('*')
        .neq('id', clientCountryId)
        .eq('status', true)
        .order('name');

      // Load existing requests
      const { data: requestsData } = await supabase
        .from('cross_country_service_requests')
        .select(`
          *,
          target_country:countries!cross_country_service_requests_target_country_id_fkey(name, flag_emoji),
          assigned_consultant:users!cross_country_service_requests_assigned_consultant_id_fkey(first_name, last_name)
        `)
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      setCountries(countriesData || []);
      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('cross_country_service_requests')
        .insert({
          client_id: clientId,
          target_country_id: parseInt(formData.target_country_id),
          service_type: formData.service_type,
          service_description: formData.service_description,
          estimated_amount: formData.estimated_amount ? parseFloat(formData.estimated_amount) : null,
          priority: formData.priority,
          status: 'pending'
        });

      if (error) throw error;

      // Reset form and reload data
      setFormData({
        target_country_id: '',
        service_type: '',
        service_description: '',
        estimated_amount: '',
        priority: 'normal'
      });
      setShowRequestForm(false);
      loadData();

      alert('Hizmet talebi başarıyla gönderildi!');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Hizmet talebi gönderilirken hata oluştu.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-purple-100 text-purple-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in_progress': return 'Devam Ediyor';
      case 'assigned': return 'Atandı';
      default: return 'Bekliyor';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Globe className="h-6 w-6 mr-3 text-purple-600" />
          Diğer Ülke Hizmetleri
        </h2>
        <button
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Talep</span>
        </button>
      </div>

      {/* Request Form */}
      {showRequestForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Hizmet Talebi</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hedef Ülke
                </label>
                <select
                  value={formData.target_country_id}
                  onChange={(e) => setFormData({...formData, target_country_id: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Ülke seçin</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.flag_emoji} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hizmet Türü
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Hizmet seçin</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hizmet Açıklaması
              </label>
              <textarea
                value={formData.service_description}
                onChange={(e) => setFormData({...formData, service_description: e.target.value})}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Hizmet detaylarını açıklayın..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahmini Bütçe (USD)
                </label>
                <input
                  type="number"
                  value={formData.estimated_amount}
                  onChange={(e) => setFormData({...formData, estimated_amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Talep Gönder</span>
              </button>
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Requests */}
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Henüz diğer ülke hizmet talebi bulunmuyor.</p>
            <p className="text-sm text-gray-500 mt-2">
              Başka ülkelerden hizmet almak için yukarıdaki butonu kullanın.
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{request.target_country?.flag_emoji}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{request.service_type}</h3>
                      <span className="text-sm text-gray-500">
                        • {request.target_country?.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{request.service_description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(request.created_at).toLocaleDateString('tr-TR')}
                      </span>
                      {request.assigned_consultant && (
                        <span className="text-xs text-gray-500">
                          Danışman: {request.assigned_consultant.first_name} {request.assigned_consultant.last_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {request.estimated_amount && (
                    <div className="text-lg font-semibold text-gray-900 mb-1">
                      ${request.estimated_amount}
                    </div>
                  )}
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {getStatusLabel(request.status)}
                  </span>
                </div>
              </div>

              {request.consultant_notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Danışman Notu:</strong> {request.consultant_notes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CountryServiceRequest;