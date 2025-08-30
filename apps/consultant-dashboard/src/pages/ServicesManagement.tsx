import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, DollarSign, Clock, Globe } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number | null;
  is_recurring: boolean;
  billing_period: string | null;
  image_url: string | null;
  is_public: boolean;
  is_active: boolean;
  created_at: string;
}

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      title: 'UAE Company Formation',
      description: 'Complete business setup in Dubai International Financial Centre (DIFC) free zone with full banking support.',
      price: 4500,
      is_recurring: false,
      billing_period: null,
      image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400',
      is_public: true,
      is_active: true,
      created_at: '2025-01-15',
    },
    {
      id: '2',
      title: 'UAE Tax Optimization',
      description: 'Strategic UAE tax planning leveraging free zone benefits and double tax treaties.',
      price: 2500,
      is_recurring: false,
      billing_period: null,
      image_url: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=400',
      is_public: true,
      is_active: true,
      created_at: '2025-01-10',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };

  const toggleServiceStatus = (serviceId: string) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId ? { ...s, is_active: !s.is_active } : s
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Services Management</h1>
                <p className="text-gray-600">Manage your country-specific services and offerings</p>
              </div>
              <Button 
                icon={Plus} 
                iconPosition="left"
                onClick={() => setShowAddModal(true)}
              >
                Add New Service
              </Button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} hover>
                <div className="h-48 overflow-hidden rounded-t-xl">
                  <img 
                    src={service.image_url || 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <Card.Body>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {service.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        service.is_active ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className={`text-xs font-medium ${
                        service.is_active ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {service.price && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          ${service.price.toLocaleString()}
                        </div>
                      )}
                      {service.is_recurring && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.billing_period}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        {service.is_public ? 'Public' : 'Private'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Edit}
                      onClick={() => setEditingService(service)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Eye}
                      className="flex-1"
                    >
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      icon={Trash2}
                      onClick={() => handleDeleteService(service.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Add Service Modal */}
          {showAddModal && (
            <ServiceModal 
              onClose={() => setShowAddModal(false)}
              onSave={(newService) => {
                setServices(prev => [...prev, { ...newService, id: Date.now().toString() }]);
                setShowAddModal(false);
              }}
            />
          )}

          {/* Edit Service Modal */}
          {editingService && (
            <ServiceModal 
              service={editingService}
              onClose={() => setEditingService(null)}
              onSave={(updatedService) => {
                setServices(prev => prev.map(s => 
                  s.id === editingService.id ? { ...updatedService, id: editingService.id } : s
                ));
                setEditingService(null);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// Service Modal Component
interface ServiceModalProps {
  service?: Service;
  onClose: () => void;
  onSave: (service: Omit<Service, 'id'>) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: service?.title || '',
    description: service?.description || '',
    price: service?.price || 0,
    is_recurring: service?.is_recurring || false,
    billing_period: service?.billing_period || '',
    image_url: service?.image_url || '',
    is_public: service?.is_public ?? true,
    is_active: service?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      created_at: service?.created_at || new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {service ? 'Edit Service' : 'Add New Service'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              />
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
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_recurring}
                onChange={(e) => setFormData(prev => ({ ...prev, is_recurring: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Recurring Service</span>
            </label>

            {formData.is_recurring && (
              <select
                value={formData.billing_period}
                onChange={(e) => setFormData(prev => ({ ...prev, billing_period: e.target.value }))}
                className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Period</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Public Service</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          <div className="flex space-x-4 pt-6">
            <Button type="submit" className="flex-1">
              {service ? 'Update Service' : 'Create Service'}
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