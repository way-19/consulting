import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import AdminLayout from '../../components/layouts/AdminLayout';
import TranslateButton from '../../components/TranslateButton';
import { Helmet } from 'react-helmet-async';

interface GlobalService {
  id: string;
  name_i18n: any;
  description_i18n: any;
  icon_name: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AdminGlobalServices = () => {
  const { t, getLocalizedContent } = useI18n();
  const [services, setServices] = useState<GlobalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<GlobalService | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    fetchGlobalServices();
  }, []);

  const fetchGlobalServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('global_services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching global services:', error);
      } else {
        setServices(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('global_services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);

      if (error) {
        console.error('Error updating service status:', error);
      } else {
        fetchGlobalServices();
        
        // Log action
        await supabase.rpc('log_admin_action', {
          action_type: !currentStatus ? 'activate' : 'deactivate',
          resource_type: 'global_service',
          resource_id: serviceId
        });
      }
    } catch (error) {
      console.error('Error toggling service status:', error);
    }
  };

  const updateSortOrder = async (serviceId: string, direction: 'up' | 'down') => {
    try {
      const currentService = services.find(s => s.id === serviceId);
      if (!currentService) return;

      const newSortOrder = direction === 'up' 
        ? currentService.sort_order - 1 
        : currentService.sort_order + 1;

      const { error } = await supabase
        .from('global_services')
        .update({ sort_order: newSortOrder })
        .eq('id', serviceId);

      if (error) {
        console.error('Error updating sort order:', error);
      } else {
        fetchGlobalServices();
      }
    } catch (error) {
      console.error('Error updating sort order:', error);
    }
  };

  const createNewService = () => {
    setEditingService({
      id: '',
      name_i18n: { en: '', tr: '', pt: '' },
      description_i18n: { en: '', tr: '', pt: '' },
      icon_name: 'Building2',
      image_url: '',
      sort_order: services.length + 1,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setShowEditor(true);
  };

  const editService = (service: GlobalService) => {
    setEditingService(service);
    setShowEditor(true);
  };

  const saveService = async (serviceData: GlobalService) => {
    try {
      if (serviceData.id) {
        // Update existing service
        const { error } = await supabase
          .from('global_services')
          .update({
            name_i18n: serviceData.name_i18n,
            description_i18n: serviceData.description_i18n,
            icon_name: serviceData.icon_name,
            image_url: serviceData.image_url,
            sort_order: serviceData.sort_order,
            is_active: serviceData.is_active,
          })
          .eq('id', serviceData.id);

        if (error) throw error;

        await supabase.rpc('log_admin_action', {
          action_type: 'update',
          resource_type: 'global_service',
          resource_id: serviceData.id
        });
      } else {
        // Create new service
        const { error } = await supabase
          .from('global_services')
          .insert({
            name_i18n: serviceData.name_i18n,
            description_i18n: serviceData.description_i18n,
            icon_name: serviceData.icon_name,
            image_url: serviceData.image_url,
            sort_order: serviceData.sort_order,
            is_active: serviceData.is_active,
          });

        if (error) throw error;

        await supabase.rpc('log_admin_action', {
          action_type: 'create',
          resource_type: 'global_service',
          resource_id: 'new'
        });
      }

      fetchGlobalServices();
      setShowEditor(false);
      setEditingService(null);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('Bu hizmet kategorisini silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('global_services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        console.error('Error deleting service:', error);
      } else {
        fetchGlobalServices();
        
        await supabase.rpc('log_admin_action', {
          action_type: 'delete',
          resource_type: 'global_service',
          resource_id: serviceId
        });
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Helmet>
          <title>Global Services - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (showEditor && editingService) {
    return (
      <AdminLayout>
        <Helmet>
          <title>{editingService.id ? 'Edit' : 'Create'} Global Service - Consulting19</title>
        </Helmet>
        <GlobalServiceEditor
          service={editingService}
          onSave={saveService}
          onCancel={() => {
            setShowEditor(false);
            setEditingService(null);
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Global Services Management - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Global Service Categories</h1>
            <p className="text-gray-600">Manage homepage service categories and marketing content</p>
          </div>
          <Button onClick={createNewService} icon={Plus}>
            Add Service Category
          </Button>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id}>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getLocalizedContent(service.name_i18n, 'name', 'Unnamed Service')}
                    </h3>
                    <button
                      onClick={() => toggleServiceStatus(service.id, service.is_active)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        service.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {service.is_active ? (
                        <ToggleRight className="w-3 h-3" />
                      ) : (
                        <ToggleLeft className="w-3 h-3" />
                      )}
                      <span>{service.is_active ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {getLocalizedContent(service.description_i18n, 'description', 'No description')}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Icon: {service.icon_name}</span>
                    <span>Order: {service.sort_order}</span>
                    <span>Updated: {new Date(service.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={ArrowUp}
                      onClick={() => updateSortOrder(service.id, 'up')}
                      disabled={service.sort_order === 1}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      icon={ArrowDown}
                      onClick={() => updateSortOrder(service.id, 'down')}
                      disabled={service.sort_order === services.length}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => window.open('/', '_blank')}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Edit}
                    onClick={() => editService(service)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Trash2}
                    onClick={() => deleteService(service.id)}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}

        {services.length === 0 && (
          <Card>
            <Card.Body className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Service Categories Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first global service category for the homepage
              </p>
              <Button onClick={createNewService} icon={Plus}>
                Add Service Category
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

// Global Service Editor Component
interface GlobalServiceEditorProps {
  service: GlobalService;
  onSave: (service: GlobalService) => void;
  onCancel: () => void;
}

const GlobalServiceEditor: React.FC<GlobalServiceEditorProps> = ({ service, onSave, onCancel }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState(service);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'tr' | 'pt'>('en');

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleI18nChange = (field: string, lang: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field as keyof GlobalService],
        [lang]: value
      }
    }));
  };

  const handleTranslate = (field: string, translatedText: string) => {
    if (activeLanguage === 'en') return;
    handleI18nChange(field, activeLanguage, translatedText);
  };

  const iconOptions = [
    'Building2', 'Calculator', 'CreditCard', 'FileText', 'Shield', 'TrendingUp', 
    'Users', 'Globe', 'Zap', 'Target', 'BarChart3', 'DollarSign'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          {service.id ? 'Edit' : 'Create'} Global Service Category
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            Save
          </Button>
        </div>
      </div>

      <Card>
        <Card.Body>
          {/* Language Tabs */}
          <div className="flex space-x-4 mb-6">
            {[
              { code: 'en', name: 'English', flag: '🇺🇸' },
              { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
              { code: 'pt', name: 'Português', flag: '🇵🇹' },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveLanguage(lang.code as 'en' | 'tr' | 'pt')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeLanguage === lang.code
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {/* Service Name */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Service Name ({activeLanguage.toUpperCase()})
                </label>
                {activeLanguage !== 'en' && (
                  <TranslateButton
                    sourceText={formData.name_i18n?.en || ''}
                    targetLang={activeLanguage}
                    onTranslated={(text) => handleTranslate('name_i18n', text)}
                  />
                )}
              </div>
              <input
                type="text"
                value={formData.name_i18n?.[activeLanguage] || ''}
                onChange={(e) => handleI18nChange('name_i18n', activeLanguage, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Service name in ${activeLanguage.toUpperCase()}`}
              />
            </div>

            {/* Service Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Service Description ({activeLanguage.toUpperCase()})
                </label>
                {activeLanguage !== 'en' && (
                  <TranslateButton
                    sourceText={formData.description_i18n?.en || ''}
                    targetLang={activeLanguage}
                    onTranslated={(text) => handleTranslate('description_i18n', text)}
                  />
                )}
              </div>
              <textarea
                value={formData.description_i18n?.[activeLanguage] || ''}
                onChange={(e) => handleI18nChange('description_i18n', activeLanguage, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Service description in ${activeLanguage.toUpperCase()}`}
              />
            </div>

            {/* Icon and Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  value={formData.icon_name}
                  onChange={(e) => handleChange('icon_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Active Status</div>
                <div className="text-sm text-gray-600">Show this service category on the homepage</div>
              </div>
              <button
                onClick={() => handleChange('is_active', !formData.is_active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.is_active ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.is_active ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminGlobalServices;