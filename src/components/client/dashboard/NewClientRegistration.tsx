import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  UserPlus, 
  Globe, 
  Mail, 
  User, 
  Building2,
  Send,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface NewClientRegistrationProps {
  onClientCreated?: (client: any) => void;
}

const NewClientRegistration: React.FC<NewClientRegistrationProps> = ({ onClientCreated }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    business_type: '',
    country_id: '',
    language: 'tr',
    service_type: '',
    estimated_budget: '',
    description: ''
  });

  const countries = [
    { id: 1, name: 'Georgia', flag_emoji: '🇬🇪' },
    { id: 2, name: 'USA', flag_emoji: '🇺🇸' },
    { id: 3, name: 'Montenegro', flag_emoji: '🇲🇪' },
    { id: 4, name: 'Estonia', flag_emoji: '🇪🇪' },
    { id: 5, name: 'Portugal', flag_emoji: '🇵🇹' },
    { id: 6, name: 'Malta', flag_emoji: '🇲🇹' },
    { id: 7, name: 'Panama', flag_emoji: '🇵🇦' }
  ];

  const serviceTypes = [
    'company_formation',
    'investment_advisory',
    'legal_consulting',
    'accounting_services',
    'visa_residency',
    'banking_solutions',
    'tax_optimization',
    'compliance_management'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Müşteri oluştur
      const { data: clientData, error: clientError } = await supabase
        .from('users')
        .insert({
          email: formData.email,
          role: 'client',
          first_name: formData.first_name,
          last_name: formData.last_name,
          company_name: formData.company_name,
          business_type: formData.business_type,
          country_id: parseInt(formData.country_id),
          primary_country_id: parseInt(formData.country_id),
          language: formData.language,
          status: true
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // 2. Başvuru oluştur (otomatik danışman ataması trigger ile yapılacak)
      const { data: applicationData, error: applicationError } = await supabase
        .from('applications')
        .insert({
          client_id: clientData.id,
          service_type: formData.service_type,
          service_country_id: parseInt(formData.country_id),
          total_amount: parseFloat(formData.estimated_budget),
          currency: 'USD',
          priority_level: 'normal',
          application_data: {
            description: formData.description,
            submitted_via: 'admin_panel',
            company_name: formData.company_name,
            business_type: formData.business_type
          },
          status: 'pending',
          source_type: 'platform'
        })
        .select()
        .single();

      if (applicationError) throw applicationError;

      setSuccess(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        company_name: '',
        business_type: '',
        country_id: '',
        language: 'tr',
        service_type: '',
        estimated_budget: '',
        description: ''
      });

      if (onClientCreated) {
        onClientCreated(clientData);
      }

      setTimeout(() => setSuccess(false), 5000);

    } catch (error: any) {
      console.error('Error creating client:', error);
      setError(error.message || 'Müşteri oluşturulurken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Müşteri Başarıyla Oluşturuldu!</h3>
          <p className="text-gray-600 mb-4">
            Yeni müşteri kaydedildi ve otomatik olarak uygun danışmana atandı.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Yeni Müşteri Ekle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <UserPlus className="h-6 w-6 mr-3 text-green-600" />
          Yeni Müşteri Kaydı
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ad *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Müşteri adı"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Soyad *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Müşteri soyadı"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-posta Adresi *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="musteri@example.com"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şirket Adı
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Şirket adı (opsiyonel)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İş Türü
            </label>
            <input
              type="text"
              name="business_type"
              value={formData.business_type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Teknoloji, Danışmanlık, E-ticaret vb."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hizmet Ülkesi *
            </label>
            <select
              name="country_id"
              value={formData.country_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              Dil Tercihi
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="en">🇺🇸 English</option>
              <option value="ar">🇸🇦 العربية</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="es">🇪🇸 Español</option>
              <option value="ru">🇷🇺 Русский</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hizmet Türü *
            </label>
            <select
              name="service_type"
              value={formData.service_type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Hizmet seçin</option>
              {serviceTypes.map((service) => (
                <option key={service} value={service}>
                  {service.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tahmini Bütçe (USD)
            </label>
            <input
              type="number"
              name="estimated_budget"
              value={formData.estimated_budget}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hizmet Açıklaması *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Müşterinin hizmet ihtiyaçlarını detaylı açıklayın..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Müşteri Oluşturuluyor...</span>
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              <span>Müşteri Oluştur ve Danışman Ata</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Otomatik Atama Süreci:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Müşteri oluşturulduğunda otomatik hoş geldin bildirimi gönderilir</li>
          <li>• Seçilen ülkeye göre uygun danışman otomatik atanır</li>
          <li>• Danışmana yeni müşteri bildirimi gönderilir</li>
          <li>• Başvuru süreci başlatılır</li>
        </ul>
      </div>
    </div>
  );
};

export default NewClientRegistration;