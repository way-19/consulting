import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, DollarSign, Clock, Globe, HelpCircle, Tag, Languages, Loader } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { deepLTranslator } from '@consulting19/shared';
import { supabase } from '@consulting19/supabase';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface Service {
  id: string;
  title: string;
  description: string;
  meta_keywords: string[] | null;
  meta_description: string | null;
  title_tr: string | null;
  description_tr: string | null;
  meta_keywords_tr: string[] | null;
  meta_description_tr: string | null;
  title_pt: string | null;
  description_pt: string | null;
  meta_keywords_pt: string[] | null;
  meta_description_pt: string | null;
  price: number | null;
  is_recurring: boolean;
  billing_period: string | null;
  image_url: string | null;
  is_public: boolean;
  is_active: boolean;
  created_at: string;
}

interface ServiceFAQ {
  id: string;
  question: string;
  answer: string;
  question_tr: string | null;
  answer_tr: string | null;
  question_pt: string | null;
  answer_pt: string | null;
  order_index: number;
  is_active: boolean;
}

const ServicesManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [managingFaqs, setManagingFaqs] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('consultant_id', 'current-consultant-id') // Bu gerçek consultant ID olacak
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : (
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
                      icon={HelpCircle}
                      onClick={() => setManagingFaqs(service)}
                      className="flex-1"
                    >
                      FAQ
                    </Button>
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
          )}

          {!loading && services.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Yet</h3>
              <p className="text-gray-600 mb-4">Create your first service to start offering consulting services.</p>
              <Button onClick={() => setShowAddModal(true)}>
                Create First Service
              </Button>
            </div>
          )}

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

          {/* FAQ Management Modal */}
          {managingFaqs && (
            <FAQManagementModal 
              service={managingFaqs}
              onClose={() => setManagingFaqs(null)}
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
    meta_keywords: service?.meta_keywords?.join(', ') || '',
    meta_description: service?.meta_description || '',
    price: service?.price || 0,
    is_recurring: service?.is_recurring || false,
    billing_period: service?.billing_period || '',
    image_url: service?.image_url || '',
    is_public: service?.is_public ?? true,
    is_active: service?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keywordsArray = formData.meta_keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
      
    onSave({
      ...formData,
      meta_keywords: keywordsArray.length > 0 ? keywordsArray : null,
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description (SEO)
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description for search engines (150-160 characters)"
              maxLength={160}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.meta_description.length}/160 characters
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords (SEO)
            </label>
            <input
              type="text"
              value={formData.meta_keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_keywords: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="keyword1, keyword2, keyword3"
            />
            <div className="text-xs text-gray-500 mt-1">
              Separate keywords with commas (5-10 keywords recommended)
            </div>
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

// FAQ Management Modal Component
interface FAQManagementModalProps {
  service: Service;
  onClose: () => void;
}

const FAQManagementModal: React.FC<FAQManagementModalProps> = ({ service, onClose }) => {
  const [faqs, setFaqs] = useState<ServiceFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [editingFaq, setEditingFaq] = useState<ServiceFAQ | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, [service.id]);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase
        .from('service_faqs')
        .select('*')
        .eq('service_id', service.id)
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
      } else {
        setFaqs(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    const { error } = await supabase
      .from('service_faqs')
      .delete()
      .eq('id', faqId);

    if (error) {
      console.error('Error deleting FAQ:', error);
      alert('Error deleting FAQ');
    } else {
      setFaqs(prev => prev.filter(f => f.id !== faqId));
    }
  };

  const toggleActive = async (faqId: string) => {
    const faq = faqs.find(f => f.id === faqId);
    if (!faq) return;

    const { error } = await supabase
      .from('service_faqs')
      .update({ is_active: !faq.is_active })
      .eq('id', faqId);

    if (error) {
      console.error('Error updating FAQ:', error);
      alert('Error updating FAQ');
    } else {
      setFaqs(prev => prev.map(f => 
        f.id === faqId ? { ...f, is_active: !f.is_active } : f
      ));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            FAQ Management - {service.title}
          </h2>
          <div className="flex space-x-3">
            <Button 
              icon={Plus} 
              iconPosition="left"
              onClick={() => setShowAddFaq(true)}
            >
              Add FAQ
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <Card.Body>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {faq.answer}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Order: {faq.order_index}</span>
                        <span className={`font-medium ${
                          faq.is_active ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setEditingFaq(faq)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleActive(faq.id)}
                        className={faq.is_active ? 'text-orange-600' : 'text-green-600'}
                      >
                        {faq.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
            
            {faqs.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Yet</h3>
                <p className="text-gray-600 mb-4">Add frequently asked questions to help your clients.</p>
                <Button onClick={() => setShowAddFaq(true)}>
                  Add First FAQ
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit FAQ Modal */}
        {(showAddFaq || editingFaq) && (
          <FAQModal 
            serviceId={service.id}
            faq={editingFaq}
            onClose={() => {
              setShowAddFaq(false);
              setEditingFaq(null);
            }}
            onSave={() => {
              fetchFaqs();
              setShowAddFaq(false);
              setEditingFaq(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

// FAQ Modal Component
interface FAQModalProps {
  serviceId: string;
  faq?: ServiceFAQ;
  onClose: () => void;
  onSave: () => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ serviceId, faq, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    question_tr: faq?.question_tr || '',
    answer_tr: faq?.answer_tr || '',
    question_pt: faq?.question_pt || '',
    answer_pt: faq?.answer_pt || '',
    order_index: faq?.order_index || 1,
    is_active: faq?.is_active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);

  const handleTranslate = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert('Please fill in the English question and answer first');
      return;
    }

    setIsTranslating(true);
    try {
      // Translate to Turkish
      const questionTr = await deepLTranslator.translate(formData.question, 'EN', 'TR');
      const answerTr = await deepLTranslator.translate(formData.answer, 'EN', 'TR');
      
      // Translate to Portuguese
      const questionPt = await deepLTranslator.translate(formData.question, 'EN', 'PT');
      const answerPt = await deepLTranslator.translate(formData.answer, 'EN', 'PT');

      setFormData(prev => ({
        ...prev,
        question_tr: questionTr,
        answer_tr: answerTr,
        question_pt: questionPt,
        answer_pt: answerPt,
      }));

      setShowTranslations(true);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (faq) {
        // Update existing FAQ
        const { error } = await supabase
          .from('service_faqs')
          .update(formData)
          .eq('id', faq.id);

        if (error) {
          console.error('Error updating FAQ:', error);
          alert('Error updating FAQ');
          return;
        }
      } else {
        // Create new FAQ
        const { error } = await supabase
          .from('service_faqs')
          .insert({
            ...formData,
            service_id: serviceId,
          });

        if (error) {
          console.error('Error creating FAQ:', error);
          alert('Error creating FAQ');
          return;
        }
      }

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
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          {faq ? 'Edit FAQ' : 'Add New FAQ'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* English Content */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🇺🇸</span>
              English Content (Primary)
            </h3>
            
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question
            </label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              placeholder="What is the most common question about this service?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Provide a detailed answer that helps clients understand this service..."
            />
          </div>
          </div>

          {/* Translation Section */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Multi-Language Content</h3>
              <Button 
                type="button"
                onClick={handleTranslate}
                disabled={isTranslating || !formData.question.trim() || !formData.answer.trim()}
                loading={isTranslating}
                icon={Languages}
                iconPosition="left"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isTranslating ? 'Translating...' : 'Translate to Other Languages'}
              </Button>
            </div>
            
            {isTranslating && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin mr-3" />
                  <span className="text-blue-800">Translating FAQ using DeepL AI...</span>
                </div>
              </div>
            )}

            {showTranslations && (
              <div className="space-y-6">
                {/* Turkish Content */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">🇹🇷</span>
                    Turkish Content
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Turkish Question
                      </label>
                      <input
                        type="text"
                        value={formData.question_tr}
                        onChange={(e) => setFormData(prev => ({ ...prev, question_tr: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Turkish Answer
                      </label>
                      <textarea
                        value={formData.answer_tr}
                        onChange={(e) => setFormData(prev => ({ ...prev, answer_tr: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Portuguese Content */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">🇵🇹</span>
                    Portuguese Content
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portuguese Question
                      </label>
                      <input
                        type="text"
                        value={formData.question_pt}
                        onChange={(e) => setFormData(prev => ({ ...prev, question_pt: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portuguese Answer
                      </label>
                      <textarea
                        value={formData.answer_pt}
                        onChange={(e) => setFormData(prev => ({ ...prev, answer_pt: e.target.value }))}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FAQ Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">FAQ Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData(prev => ({ ...prev, order_index: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Active FAQ</span>
              </label>
            </div>
          </div>
          </div>

          <div className="flex space-x-4 pt-6">
            <Button type="submit" className="flex-1" loading={saving}>
              {saving ? 'Saving...' : (faq ? 'Update FAQ' : 'Create FAQ')}
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