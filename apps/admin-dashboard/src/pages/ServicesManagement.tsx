import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Star, Tag, Globe, DollarSign } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/supabase';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  is_marketing_service: boolean;
  is_featured: boolean;
  is_public: boolean;
  is_active: boolean;
  image_url: string | null;
  consultant_id: string | null;
  country_id: string | null;
  created_at: string;
  consultant?: {
    full_name: string;
    email: string;
  };
  country?: {
    name: string;
    flag_emoji: string;
  };
}

const ServicesManagement = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filter, setFilter] = useState<'all' | 'marketing' | 'consultant'>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  // Mock data for admin - only marketing services that appear on homepage
  const mockServices = [
    {
      id: '1',
      title: 'Company Formation',
      description: 'Complete business setup and incorporation services across multiple jurisdictions.',
      category: 'Company Formation',
      price: 2500,
      image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_marketing_service: true,
      is_featured: true,
      is_public: true,
      is_active: true,
      created_at: '2025-01-20',
    },
    {
      id: '2',
      title: 'Tax Optimization',
      description: 'Strategic international tax planning to minimize legal tax liability.',
      category: 'Tax Planning',
      price: 1800,
      image_url: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_marketing_service: true,
      is_featured: true,
      is_public: true,
      is_active: true,
      created_at: '2025-01-18',
    },
    {
      id: '3',
      title: 'Banking Solutions',
      description: 'Global banking support for opening and managing corporate accounts.',
      category: 'Banking',
      price: 1200,
      image_url: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_marketing_service: true,
      is_featured: false,
      is_public: true,
      is_active: true,
      created_at: '2025-01-15',
    },
    {
      id: '4',
      title: 'Legal Compliance',
      description: 'Ongoing legal and regulatory support to keep your business compliant.',
      category: 'Legal',
      price: 800,
      image_url: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=800',
      is_marketing_service: true,
      is_featured: false,
      is_public: true,
      is_active: true,
      created_at: '2025-01-12',
    },
  ];

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Use mock data for now until foreign keys are properly set up
      setTimeout(() => {
        setServices(mockServices);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);

      if (error) {
        console.error('Error deleting service:', error);
        alert('Error deleting service');
      } else {
        setServices(prev => prev.filter(s => s.id !== serviceId));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    }
  };

  const toggleServiceFlag = async (serviceId: string, field: keyof Service, value: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ [field]: value })
        .eq('id', serviceId);

      if (error) {
        console.error('Error updating service:', error);
        alert('Error updating service');
      } else {
        setServices(prev => prev.map(s => 
          s.id === serviceId ? { ...s, [field]: value } : s
        ));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    }
  };

  const filteredServices = services.filter(service => {
    if (filter === 'marketing') return service.is_marketing_service;
    if (filter === 'consultant') return !service.is_marketing_service;
    return true;
  });

  const marketingServices = services.filter(s => s.is_marketing_service);
  const consultantServices = services.filter(s => !s.is_marketing_service);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Services Management</h1>
                <p className="text-gray-600">Manage all platform services - marketing and consultant services</p>
              </div>
              <div className="flex space-x-3">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Services ({services.length})</option>
                  <option value="marketing">Marketing Services ({marketingServices.length})</option>
                  <option value="consultant">Consultant Services ({consultantServices.length})</option>
                </select>
                <Button 
                  icon={Plus} 
                  iconPosition="left"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Marketing Service
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {services.length}
                </div>
                <div className="text-sm text-gray-600">Total Services</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {marketingServices.length}
                </div>
                <div className="text-sm text-gray-600">Marketing Services</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {consultantServices.length}
                </div>
                <div className="text-sm text-gray-600">Consultant Services</div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {services.filter(s => s.is_featured).length}
                </div>
                <div className="text-sm text-gray-600">Featured Services</div>
              </Card.Body>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <Card key={service.id} hover>
                <div className="h-48 overflow-hidden rounded-t-xl relative">
                  <img 
                    src={service.image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={service.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-1">
                    {service.is_marketing_service && (
                      <span className="bg-blue-500/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Marketing
                      </span>
                    )}
                    {service.is_featured && (
                      <span className="bg-yellow-500/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  {/* Price Badge */}
                  {service.price && (
                    <div className="absolute top-3 right-3 bg-green-500/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                      ${service.price.toLocaleString()}
                    </div>
                  )}
                </div>
                
                <Card.Body>
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {service.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">{service.category}</span>
                      {service.country && (
                        <span className="flex items-center">
                          {service.country.flag_emoji} {service.country.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  {service.consultant && (
                    <div className="text-xs text-blue-600 mb-3">
                      By: {service.consultant.full_name}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-1">
                      <span className={`w-2 h-2 rounded-full ${
                        service.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className={`w-2 h-2 rounded-full ${
                        service.is_public ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(service.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Edit}
                      onClick={() => setEditingService(service)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Trash2}
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                  
                  {/* Quick Toggle Buttons */}
                  <div className="mt-3 space-y-1">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => toggleServiceFlag(service.id, 'is_marketing_service', !service.is_marketing_service)}
                        className={`flex-1 text-xs px-2 py-1 rounded transition-colors ${
                          service.is_marketing_service 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {service.is_marketing_service ? '📢 Marketing' : '📢 Make Marketing'}
                      </button>
                      <button
                        onClick={() => toggleServiceFlag(service.id, 'is_featured', !service.is_featured)}
                        className={`flex-1 text-xs px-2 py-1 rounded transition-colors ${
                          service.is_featured 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {service.is_featured ? '⭐ Featured' : '⭐ Feature'}
                      </button>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => toggleServiceFlag(service.id, 'is_active', !service.is_active)}
                        className={`flex-1 text-xs px-2 py-1 rounded transition-colors ${
                          service.is_active 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}
                      >
                        {service.is_active ? '✅ Active' : '❌ Activate'}
                      </button>
                      <button
                        onClick={() => toggleServiceFlag(service.id, 'is_public', !service.is_public)}
                        className={`flex-1 text-xs px-2 py-1 rounded transition-colors ${
                          service.is_public 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {service.is_public ? '🌐 Public' : '🔒 Make Public'}
                      </button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {filter === 'marketing' ? 'No Marketing Services' : 
                 filter === 'consultant' ? 'No Consultant Services' : 'No Services'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {filter === 'marketing' 
                  ? 'Add marketing services that will appear on the homepage and services page.'
                  : filter === 'consultant'
                  ? 'Consultants will add their own country-specific services.'
                  : 'No services have been created yet.'}
              </p>
              {filter !== 'consultant' && (
                <Button 
                  size="lg"
                  icon={Plus} 
                  iconPosition="left"
                  onClick={() => setShowAddModal(true)}
                >
                  Add Marketing Service
                </Button>
              )}
            </div>
          )}

          {/* Add/Edit Service Modal */}
          {(showAddModal || editingService) && (
            <ServiceModal 
              service={editingService}
              onClose={() => {
                setShowAddModal(false);
                setEditingService(null);
              }}
              onSave={() => {
                setShowAddModal(false);
                setEditingService(null);
                fetchServices();
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// Service Modal Component for Admin
interface ServiceModalProps {
  service?: Service;
  onClose: () => void;
  onSave: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    category: service?.category || 'Company Formation',
    price: service?.price || 0,
    image_url: service?.image_url || '',
    is_marketing_service: service?.is_marketing_service ?? true,
    is_featured: service?.is_featured ?? false,
    is_public: service?.is_public ?? true,
    is_active: service?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);

  const categories = [
    'Company Formation',
    'Tax Optimization',
    'Banking Solutions',
    'Legal Compliance',
    'Asset Protection',
    'Investment Advisory',
    'Visa & Residency',
    'Market Research',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price || null,
        image_url: formData.image_url || null,
        is_marketing_service: formData.is_marketing_service,
        is_featured: formData.is_featured,
        is_public: formData.is_public,
        is_active: formData.is_active,
        consultant_id: null, // Admin services don't have consultant
        country_id: null, // Admin services are global
      };

      if (service) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', service.id);

        if (error) {
          console.error('Error updating service:', error);
          alert('Error updating service');
          return;
        }
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert(serviceData);

        if (error) {
          console.error('Error creating service:', error);
          alert('Error creating service');
          return;
        }
      }

      alert(service ? 'Service updated successfully!' : 'Service created successfully!');
      onSave();
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {service ? 'Edit Marketing Service' : 'Add New Marketing Service'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., Company Formation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Detailed description of the service..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://images.pexels.com/..."
            />
          </div>

          {/* Service Flags */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_marketing_service}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_marketing_service: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Marketing Service</span>
              </label>
              <div className="text-xs text-gray-500 ml-6">
                Show on homepage and services page
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Service</span>
              </label>
              <div className="text-xs text-gray-500 ml-6">
                Highlight this service prominently
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Public Service</span>
              </label>
              <div className="text-xs text-gray-500 ml-6">
                Visible to all users
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
              <div className="text-xs text-gray-500 ml-6">
                Service is currently available
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <Button type="submit" className="flex-1" loading={saving}>
              {saving ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesManagement;