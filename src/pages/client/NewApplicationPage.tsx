import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  Building2, 
  Globe, 
  DollarSign, 
  FileText,
  Send,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Brain,
  Users,
  Clock,
  Star,
  Zap
} from 'lucide-react';

// UUID validation function
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const NewApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState<any>(null);
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [showAiRecommendation, setShowAiRecommendation] = useState(false);

  const [formData, setFormData] = useState({
    service_type: '',
    service_country_id: '',
    total_amount: '',
    currency: 'USD',
    description: '',
    priority_level: 'normal'
  });

  const serviceTypes = [
    { value: 'company_formation', label: '🏢 Şirket Kurulumu', description: 'LLC, Corporation ve diğer şirket türleri' },
    { value: 'investment_advisory', label: '📈 Yatırım Danışmanlığı', description: 'Pazar analizi ve yatırım fırsatları' },
    { value: 'legal_consulting', label: '⚖️ Hukuki Danışmanlık', description: 'Sözleşmeler ve yasal uyumluluk' },
    { value: 'accounting_services', label: '🧮 Muhasebe Hizmetleri', description: 'Vergi planlaması ve mali raporlama' },
    { value: 'visa_residency', label: '✈️ Vize & İkamet', description: 'Vize başvuruları ve ikamet programları' },
    { value: 'banking_solutions', label: '🏦 Bankacılık Çözümleri', description: 'Hesap açma ve bankacılık ilişkileri' },
    { value: 'tax_optimization', label: '💰 Vergi Optimizasyonu', description: 'Uluslararası vergi planlaması' },
    { value: 'compliance_management', label: '📋 Uyumluluk Yönetimi', description: 'Sürekli mevzuat takibi' }
  ];

  const priorityLevels = [
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'Yüksek', color: 'text-orange-600' },
    { value: 'urgent', label: 'Acil', color: 'text-red-600' }
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userData);
        if (user.role !== 'client') {
          navigate('/unauthorized');
          return;
        }

        // Validate UUID format
        if (!user.id || !isValidUUID(user.id)) {
          console.error('Invalid client ID format, redirecting to login');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        setClient(user);
        await loadCountries();
      } catch (error) {
        console.error('Error checking auth:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const loadCountries = async () => {
    try {
      const { data: countriesData } = await supabase
        .from('countries')
        .select('*')
        .eq('status', true)
        .order('name');

      setCountries(countriesData || []);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const getAiRecommendation = async () => {
    if (!formData.service_type || !formData.service_country_id) {
      return;
    }

    setShowAiRecommendation(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedService = serviceTypes.find(s => s.value === formData.service_type);
    const selectedCountry = countries.find(c => c.id === parseInt(formData.service_country_id));

    const recommendations = {
      'company_formation': {
        'georgia': 'Gürcistan LLC kurulumu mükemmel bir seçim! 0% yabancı gelir vergisi ve 3-5 gün kurulum süresi ile hızlı başlangıç yapabilirsiniz.',
        'estonia': 'Estonya e-Residency programı ile dijital şirket kurmak harika bir fırsat! AB pazarına erişim ve gelişmiş dijital altyapı avantajları.',
        'usa': 'ABD Delaware LLC kurulumu küresel pazara erişim için ideal. Gelişmiş finansal sistemler ve güçlü hukuki koruma.',
        'default': `${selectedCountry?.name} için ${selectedService?.label} hizmeti stratejik bir seçim. Danışmanımız size en uygun yapıyı önerecek.`
      },
      'investment_advisory': {
        'default': `${selectedCountry?.name} yatırım fırsatları konusunda uzman danışmanımız size pazar analizi ve risk değerlendirmesi sağlayacak.`
      },
      'default': `${selectedService?.label} için ${selectedCountry?.name} mükemmel bir seçim. Uzman danışmanımız size özel çözümler sunacak.`
    };

    const serviceRecs = recommendations[formData.service_type as keyof typeof recommendations] || recommendations.default;
    const countrySlug = selectedCountry?.slug || 'default';
    
    let recommendation;
    if (typeof serviceRecs === 'object') {
      recommendation = serviceRecs[countrySlug as keyof typeof serviceRecs] || serviceRecs.default;
    } else {
      recommendation = serviceRecs;
    }

    setAiRecommendation(recommendation);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          client_id: client.id,
          service_type: formData.service_type,
          service_country_id: parseInt(formData.service_country_id),
          total_amount: parseFloat(formData.total_amount),
          currency: formData.currency,
          priority_level: formData.priority_level,
          application_data: {
            description: formData.description,
            submitted_via: 'client_portal',
            ai_recommendation_shown: showAiRecommendation
          },
          status: 'pending',
          source_type: 'platform'
        });

      if (error) throw error;

      alert('🎉 Başvurunuz başarıyla gönderildi! Danışmanımız en kısa sürede sizinle iletişime geçecek.');
      navigate('/client');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('❌ Başvuru gönderilirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-trigger AI recommendation when service and country are selected
  useEffect(() => {
    if (formData.service_type && formData.service_country_id && !showAiRecommendation) {
      getAiRecommendation();
    }
  }, [formData.service_type, formData.service_country_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Sayfa yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  const selectedService = serviceTypes.find(s => s.value === formData.service_type);
  const selectedCountry = countries.find(c => c.id === parseInt(formData.service_country_id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/client"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Panele Dön
              </Link>
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center mr-3">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Yeni Hizmet Başvurusu</h1>
            </div>
            <div className="text-sm text-gray-600">
              Hoş Geldiniz, {client.name}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Yeni Hizmet Başvurusu Oluşturun
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI destekli platformumuz size en uygun danışmanı atayacak ve sürecinizi optimize edecek
          </p>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Type Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Building2 className="h-5 w-5 inline mr-2" />
                Hangi hizmete ihtiyacınız var? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceTypes.map((service) => (
                  <label
                    key={service.value}
                    className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-lg ${
                      formData.service_type === service.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="service_type"
                      value={service.value}
                      checked={formData.service_type === service.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.service_type === service.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.service_type === service.value && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{service.label}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Globe className="h-5 w-5 inline mr-2" />
                Hangi ülkede hizmet almak istiyorsunuz? *
              </label>
              <select
                name="service_country_id"
                value={formData.service_country_id}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              >
                <option value="">Ülke seçin</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.flag_emoji} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Recommendation */}
            {showAiRecommendation && aiRecommendation && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                      AI Önerisi
                      <Sparkles className="h-4 w-4 ml-2 text-purple-500" />
                    </h3>
                    <p className="text-gray-800 leading-relaxed mb-3">{aiRecommendation}</p>
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <p className="text-sm text-purple-700">
                        💡 <strong>AI Analizi:</strong> Bu seçiminiz için başarı oranı %94 ve ortalama tamamlanma süresi 7-14 gün.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Budget and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  <DollarSign className="h-5 w-5 inline mr-2" />
                  Tahmini Bütçeniz *
                </label>
                <input
                  type="number"
                  name="total_amount"
                  value={formData.total_amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-2">
                  Para Birimi
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                >
                  <option value="USD">🇺🇸 USD</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="GEL">🇬🇪 GEL</option>
                  <option value="GBP">🇬🇧 GBP</option>
                </select>
              </div>
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-4">
                <Clock className="h-5 w-5 inline mr-2" />
                Öncelik Seviyesi
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {priorityLevels.map((priority) => (
                  <label
                    key={priority.value}
                    className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all duration-300 ${
                      formData.priority_level === priority.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority_level"
                      value={priority.value}
                      checked={formData.priority_level === priority.value}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`text-lg font-bold ${priority.color} mb-1`}>
                        {priority.label}
                      </div>
                      <div className="text-sm text-gray-600">
                        {priority.value === 'normal' && 'Standart işlem süresi'}
                        {priority.value === 'high' && 'Hızlandırılmış işlem'}
                        {priority.value === 'urgent' && 'En hızlı işlem'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-2">
                <FileText className="h-5 w-5 inline mr-2" />
                Hizmet Detayları ve Özel İstekleriniz *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg resize-none"
                placeholder="Hizmet ihtiyaçlarınızı detaylı olarak açıklayın. Özel gereksinimleriniz, zaman çizelgeniz ve beklentilerinizi belirtin..."
              />
              <p className="text-sm text-gray-500 mt-2">
                💡 Ne kadar detaylı bilgi verirseniz, danışmanımız size o kadar uygun çözüm sunabilir.
              </p>
            </div>

            {/* Summary Card */}
            {formData.service_type && formData.service_country_id && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Başvuru Özeti
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Hizmet Türü:</p>
                    <p className="font-semibold text-gray-900">{selectedService?.label}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ülke:</p>
                    <p className="font-semibold text-gray-900">
                      {selectedCountry?.flag_emoji} {selectedCountry?.name}
                    </p>
                  </div>
                  {formData.total_amount && (
                    <div>
                      <p className="text-sm text-gray-600">Bütçe:</p>
                      <p className="font-semibold text-gray-900">
                        ${parseFloat(formData.total_amount).toLocaleString()} {formData.currency}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Öncelik:</p>
                    <p className="font-semibold text-gray-900">
                      {priorityLevels.find(p => p.value === formData.priority_level)?.label}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4">
              <Link
                to="/client"
                className="flex-1 bg-gray-300 text-gray-700 py-4 px-6 rounded-xl text-lg font-semibold hover:bg-gray-400 transition-colors text-center"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={submitting || !formData.service_type || !formData.service_country_id || !formData.total_amount || !formData.description}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Başvuruyu Gönder</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Neden CONSULTING19 Platformunu Seçmelisiniz?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">AI Destekli Eşleştirme</h4>
              <p className="text-gray-600">
                Yapay zeka teknolojimiz size en uygun uzman danışmanı otomatik olarak atar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Uzman Danışmanlar</h4>
              <p className="text-gray-600">
                7 stratejik ülkede yerel uzmanlarımızla doğrudan çalışın
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Hızlı Süreç</h4>
              <p className="text-gray-600">
                Dijital-öncelikli yaklaşımımızla süreçlerinizi hızlandırıyoruz
              </p>
            </div>
          </div>
        </div>

        {/* Success Stats */}
        <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">Platform İstatistikleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">1,247+</div>
              <div className="text-gray-300">Başarılı Başvuru</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">7</div>
              <div className="text-gray-300">Stratejik Ülke</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-300">Başarı Oranı</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-300">AI Destek</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewApplicationPage;