import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

const FAQManagement = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How long does UAE company formation take?',
      answer: 'UAE company formation typically takes 7-14 days depending on the jurisdiction and banking requirements. Free zone companies are generally faster than mainland companies.',
      category: 'Company Formation',
      order: 1,
      is_active: true,
      created_at: '2025-01-15',
    },
    {
      id: '2',
      question: 'What are the banking requirements in UAE?',
      answer: 'UAE banking requirements include trade license, Emirates ID for signatories, salary certificates, and initial deposit. Requirements vary by bank and account type.',
      category: 'Banking',
      order: 2,
      is_active: true,
      created_at: '2025-01-12',
    },
  ]);

  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const categories = [
    'Company Formation',
    'Banking',
    'Tax Planning',
    'Legal Compliance',
    'Immigration',
    'General',
  ];

  const handleDeleteFaq = (faqId: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(prev => prev.filter(f => f.id !== faqId));
    }
  };

  const toggleActive = (faqId: string) => {
    setFaqs(prev => prev.map(f => 
      f.id === faqId ? { ...f, is_active: !f.is_active } : f
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">FAQ Management</h1>
                <p className="text-gray-600">Manage frequently asked questions for your country</p>
              </div>
              <Button 
                icon={Plus} 
                iconPosition="left"
                onClick={() => setShowAddModal(true)}
              >
                Add New FAQ
              </Button>
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id}>
                <Card.Body>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          className="flex items-center space-x-2 text-left"
                        >
                          <h3 className="text-lg font-semibold text-gray-900">
                            {faq.question}
                          </h3>
                          {expandedFaq === faq.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {faq.category}
                        </span>
                        <span>Order: {faq.order}</span>
                        <span>Created: {faq.created_at}</span>
                        <span className={`font-medium ${
                          faq.is_active ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        icon={Edit}
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
                        icon={Trash2}
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                      </Button>
                    </div>
                  </div>
                  
                  {expandedFaq === faq.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Add/Edit FAQ Modal */}
          {(showAddModal || editingFaq) && (
            <FAQModal 
              faq={editingFaq}
              onClose={() => {
                setShowAddModal(false);
                setEditingFaq(null);
              }}
              onSave={(faqData) => {
                if (editingFaq) {
                  setFaqs(prev => prev.map(f => 
                    f.id === editingFaq.id ? { ...faqData, id: editingFaq.id } : f
                  ));
                } else {
                  setFaqs(prev => [...prev, { ...faqData, id: Date.now().toString() }]);
                }
                setShowAddModal(false);
                setEditingFaq(null);
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// FAQ Modal Component
interface FAQModalProps {
  faq?: FAQ;
  onClose: () => void;
  onSave: (faq: Omit<FAQ, 'id'>) => void;
}

const FAQModal: React.FC<FAQModalProps> = ({ faq, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    category: faq?.category || 'Company Formation',
    order: faq?.order || 1,
    is_active: faq?.is_active ?? true,
  });

  const categories = [
    'Company Formation',
    'Banking',
    'Tax Planning',
    'Legal Compliance',
    'Immigration',
    'General',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().split('T')[0];
    onSave({
      ...formData,
      created_at: faq?.created_at || now,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {faq ? 'Edit FAQ' : 'Add New FAQ'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Answer
            </label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
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
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>

          <div>
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

          <div className="flex space-x-4 pt-6">
            <Button type="submit" className="flex-1">
              {faq ? 'Update FAQ' : 'Create FAQ'}
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

export default FAQManagement;