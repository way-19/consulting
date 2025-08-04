import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  DollarSign, 
  Users, 
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Save,
  X,
  Send,
  MessageSquare,
  UserPlus
} from 'lucide-react';

const CustomServiceManager = ({ consultantId }) => {
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showRecommendModal, setShowRecommendModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    service_name: '',
    service_description: '',
    service_category: '',
    price: '',
    currency: 'USD',
    requires_approval: false,
    recurring_service: false,
    recurring_interval: ''
  });

  const [recommendForm, setRecommendForm] = useState({
    client_id: '',
    recommendation_message: '',
    custom_price: '',
    priority: 'normal'
  });
  const serviceCategories = [
    'Company Formation',
    'Tax Advisory',
    'Legal Consulting',
    'Accounting Services',
    'Banking Solutions',
    'Visa & Immigration',
    'Investment Advisory',
    'Market Research',
    'Compliance Services',
    'Business Consulting',
    'Other'
  ];

  const recurringIntervals = [
    { value: 'monthly', label: 'Aylık' },
    { value: 'quarterly', label: 'Üç Aylık' },
    { value: 'semi_annual', label: 'Altı Aylık' },
    { value: 'annual', label: 'Yıllık' }
  ];

  useEffect(() => {
    loadServices();
    loadClients();
  }, [consultantId]);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('consultant_custom_services')
        .select('*')
        .eq('consultant_id', consultantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      console.log('🔍 Loading clients for custom services, consultant:', consultantId);
      
      const { data: applicationsData, error } = await supabase
        .from('applications')
        .select(`
          client:users!applications_client_id_fkey(
            id, first_name, last_name, email, company_name,
            client_country:countries!users_country_id_fkey(name, flag_emoji)
          )
        `)
        .eq('consultant_id', consultantId)
        .not('client_id', 'is', null);

      if (error) {
        console.error('❌ Error loading clients for custom services:', error);
        setClients([]);
        return;
      }

      console.log('📋 Applications data for custom services:', applicationsData);

      // Get unique clients
      const uniqueClients = applicationsData?.reduce((acc, app) => {
        if (app.client && !acc.find(c => c.id === app.client.id)) {
          acc.push(app.client);
        }
        return acc;
      }, []) || [];

      console.log('👥 Unique clients for custom services:', uniqueClients);
      setClients(uniqueClients);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        consultant_id: consultantId,
        service_name: formData.service_name,
        service_description: formData.service_description,
        service_category: formData.service_category,
        price: parseFloat(formData.price),
        currency: formData.currency,
        requires_approval: formData.requires_approval,
        recurring_service: formData.recurring_service,
        recurring_interval: formData.recurring_service ? formData.recurring_interval : null,
        active: true
      };

      let error;
      if (editingService) {
        ({ error } = await supabase
          .from('consultant_custom_services')
          .update(serviceData)
          .eq('id', editingService.id));
      } else {
        ({ error } = await supabase
          .from('consultant_custom_services')
          .insert(serviceData));
      }

      if (error) throw error;

      // Reset form and reload
      resetForm();
      loadServices();
      alert(editingService ? 'Hizmet güncellendi!' : 'Yeni hizmet eklendi!');
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Hizmet kaydedilirken hata oluştu.');
    }
  };

  const handleRecommendService = async (e) => {
    e.preventDefault();
    
    if (!selectedService || !recommendForm.client_id) return;

    try {
      const finalPrice = recommendForm.custom_price 
        ? parseFloat(recommendForm.custom_price)
        : selectedService.price;

      const { error } = await supabase
        .from('service_payment_requests')
        .insert({
          consultant_id: consultantId,
          client_id: recommendForm.client_id,
          service_id: selectedService.id,
          recommended_service_id: selectedService.id,
          amount: finalPrice,
          currency: selectedService.currency,
          description: `Önerilen Hizmet: ${selectedService.service_name}`,
          recommendation_message: recommendForm.recommendation_message,
          is_recommendation: true,
          recommendation_status: 'pending',
          recommended_at: new Date().toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      // Reset form and close modal
      setRecommendForm({
        client_id: '',
        recommendation_message: '',
        custom_price: '',
        priority: 'normal'
      });
      setShowRecommendModal(false);
      setSelectedService(null);
      
      alert('Hizmet önerisi müşteriye gönderildi!');
    } catch (error) {
      console.error('Error sending recommendation:', error);
      alert('Hizmet önerisi gönderilirken hata oluştu.');
    }
  };
  const resetForm = () => {
    setFormData({
      service_name: '',
      service_description: '',
      service_category: '',
      price: '',
      currency: 'USD',
      requires_approval: false,
      recurring_service: false,
      recurring_interval: ''
    });
    setShowCreateForm(false);
    setEditingService(null);
  };

  const handleEdit = (service) => {
    setFormData({
      service_name: service.service_name,
      service_description: service.service_description,
      service_category: service.service_category,
      price: service.price.toString(),
      currency: service.currency,
      requires_approval: service.requires_approval,
      recurring_service: service.recurring_service,
      recurring_interval: service.recurring_interval || ''
    });
    setEditingService(service);
    setShowCreateForm(true);
  };

  const handleRecommendToClient = (service) => {
    setSelectedService(service);
    setRecommendForm({
      client_id: '',
      recommendation_message: `${service.service_name} hizmetini sizin için özel olarak hazırladım. Bu hizmet ${service.service_description.toLowerCase()}`,
      custom_price: service.price.toString(),
      priority: 'normal'
    });
    setShowRecommendModal(true);
  };
  const handleDelete = async (serviceId) => {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('consultant_custom_services')
        .delete()
        .eq('id', serviceId);

      if (error) throw error;
      
      loadServices();
      alert('Hizmet silindi!');
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Hizmet silinirken hata oluştu.');
    }
  };

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('consultant_custom_services')
        .update({ active: !currentStatus })
        .eq('id', serviceId);

      if (error) throw error;
      loadServices();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  if (loading) {
    return (
      <>
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="h-6 w-6 mr-3 text-purple-600" />
          Özel Hizmetlerim
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Yeni Hizmet</span>
        </button>
      </div>

      {/* Service Creation/Edit Form */}
      {showCreateForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hizmet Adı *
                </label>
                <input
                  type="text"
                  value={formData.service_name}
                  onChange={(e) => setFormData({...formData, service_name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Örn: Vergi Planlaması Danışmanlığı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori *
                </label>
                <select
                  value={formData.service_category}
                  onChange={(e) => setFormData({...formData, service_category: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Kategori seçin</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hizmet Açıklaması *
              </label>
              <textarea
                value={formData.service_description}
                onChange={(e) => setFormData({...formData, service_description: e.target.value})}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Hizmetin detaylı açıklamasını yazın..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para Birimi
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GEL">GEL</option>
                </select>
              </div>

              {formData.recurring_service && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tekrar Aralığı
                  </label>
                  <select
                    value={formData.recurring_interval}
                    onChange={(e) => setFormData({...formData, recurring_interval: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Aralık seçin</option>
                    {recurringIntervals.map((interval) => (
                      <option key={interval.value} value={interval.value}>{interval.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.requires_approval}
                  onChange={(e) => setFormData({...formData, requires_approval: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Admin onayı gerekli</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.recurring_service}
                  onChange={(e) => setFormData({...formData, recurring_service: e.target.checked})}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Tekrarlanan hizmet</span>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{editingService ? 'Güncelle' : 'Kaydet'}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>İptal</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz Özel Hizmet Yok</h3>
            <p className="text-gray-600 mb-4">
              Müşterilerinize özel hizmetler sunmak için yeni hizmet ekleyin.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              İlk Hizmetinizi Ekleyin
            </button>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className={`border rounded-xl p-6 transition-all duration-300 ${
                service.active 
                  ? 'border-gray-200 hover:border-purple-300 bg-white' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className={`text-lg font-semibold ${service.active ? 'text-gray-900' : 'text-gray-500'}`}>
                      {service.service_name}
                    </h3>
                    {service.recurring_service && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        Tekrarlanan
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{service.service_category}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{service.service_description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleServiceStatus(service.id, service.active)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      service.active ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      service.active ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-gray-900">
                      ${service.price} {service.currency}
                    </span>
                    {service.recurring_service && (
                      <span className="text-sm text-gray-500">
                        /{recurringIntervals.find(i => i.value === service.recurring_interval)?.label.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {service.requires_approval && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                      Onay Gerekli
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {service.active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Oluşturulma: {new Date(service.created_at).toLocaleDateString('tr-TR')}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRecommendToClient(service)}
                    className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    title="Müşteriye Öner"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(service)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Service Statistics */}
      {services.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hizmet İstatistikleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-900">{services.length}</div>
              <div className="text-sm text-blue-700">Toplam Hizmet</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-900">
                {services.filter(s => s.active).length}
              </div>
              <div className="text-sm text-green-700">Aktif Hizmet</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-900">
                {services.filter(s => s.recurring_service).length}
              </div>
              <div className="text-sm text-purple-700">Tekrarlanan</div>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-900">
                ${services.reduce((sum, s) => sum + parseFloat(s.price), 0).toFixed(2)}
              </div>
              <div className="text-sm text-orange-700">Toplam Değer</div>
            </div>
          </div>
        </div>
      )}
    </div>
    {/* Recommendation Modal */}
    {showRecommendModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Hizmet Önerisi Gönder</h3>
              <button
                onClick={() => setShowRecommendModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-purple-900 mb-2">{selectedService.service_name}</h4>
              <p className="text-sm text-purple-700">{selectedService.service_description}</p>
              <p className="text-lg font-bold text-purple-900 mt-2">
                ${selectedService.price} {selectedService.currency}
              </p>
            </div>

            <form onSubmit={handleRecommendService} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Müşteri Seçin *
                </label>
                <select
                  value={recommendForm.client_id}
                  onChange={(e) => setRecommendForm({...recommendForm, client_id: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Müşteri seçin</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.client_country?.flag_emoji || '🌍'} {client.first_name} {client.last_name} 
                      {client.company_name && ` (${client.company_name})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özel Fiyat (Opsiyonel)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={recommendForm.custom_price}
                  onChange={(e) => setRecommendForm({...recommendForm, custom_price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Varsayılan: ${selectedService.price}`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Boş bırakırsanız varsayılan fiyat kullanılır
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kişisel Mesaj *
                </label>
                <textarea
                  value={recommendForm.recommendation_message}
                  onChange={(e) => setRecommendForm({...recommendForm, recommendation_message: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Müşteriye bu hizmeti neden önerdiğinizi açıklayın..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  value={recommendForm.priority}
                  onChange={(e) => setRecommendForm({...recommendForm, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="normal">Normal</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Öneriyi Gönder</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRecommendModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
    )}
    </>
  );
};

export default CustomServiceManager;