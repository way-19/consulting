import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Check, X, MessageSquare, Upload } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useTranslation } from '../../hooks/useTranslation';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';

interface Document {
  id: string;
  client_id: string;
  name: string;
  type: string;
  category: string;
  status: 'requested' | 'pending' | 'approved' | 'rejected' | 'needs_revision';
  file_url: string;
  file_size: number;
  is_request: boolean;
  due_date: string;
  notes: string;
  uploaded_at: string;
  reviewed_at: string;
  client: {
    company_name: string;
    profile: {
      full_name: string;
    };
  };
}

const ConsultantDocuments = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          client:clients(
            company_name,
            profile:user_profiles(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
      } else {
        setDocuments(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentStatus = async (documentId: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          status,
          notes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', documentId);

      if (error) {
        console.error('Error updating document:', error);
      } else {
        fetchDocuments(); // Refresh list
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs_revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ConsultantLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ConsultantLayout>
    );
  }

  return (
    <ConsultantLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('documents.title')}</h1>
            <p className="text-gray-600">{t('documents.subtitle')}</p>
          </div>
          <div className="flex space-x-2">
            <Button icon={Plus} variant="outline">
              {t('documents.requestDocument')}
            </Button>
            <Button icon={Upload}>
              {t('documents.uploadDocument')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('documents.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="requested">{t('documents.status.requested')}</option>
                  <option value="pending">{t('documents.status.pending')}</option>
                  <option value="approved">{t('documents.status.approved')}</option>
                  <option value="rejected">{t('documents.status.rejected')}</option>
                  <option value="needs_revision">{t('documents.status.needsRevision')}</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="passport">{t('documents.category.passport')}</option>
                  <option value="bankStatement">{t('documents.category.bankStatement')}</option>
                  <option value="businessPlan">{t('documents.category.businessPlan')}</option>
                  <option value="contract">{t('documents.category.contract')}</option>
                  <option value="other">{t('documents.category.other')}</option>
                </select>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Documents List */}
      {filteredDocuments.length > 0 ? (
        <div className="space-y-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id}>
              <Card.Body>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {t(`documents.status.${doc.status}`)}
                      </span>
                      {doc.is_request && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Request
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>{doc.client?.profile?.full_name || 'Unknown Client'}</span>
                      <span>{t(`documents.category.${doc.category}`)}</span>
                      {doc.file_size && (
                        <span>{(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>
                      )}
                      {doc.uploaded_at && (
                        <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      )}
                    </div>

                    {doc.notes && (
                      <p className="text-gray-600 text-sm">{doc.notes}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {doc.file_url && (
                      <Button variant="outline" size="sm" icon={Download}>
                        {t('documents.actions.download')}
                      </Button>
                    )}
                    {doc.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Check}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => updateDocumentStatus(doc.id, 'approved')}
                        >
                          {t('documents.actions.approve')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          icon={X}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => updateDocumentStatus(doc.id, 'rejected')}
                        >
                          {t('documents.actions.reject')}
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm" icon={MessageSquare}>
                      {t('documents.actions.addComment')}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body className="text-center py-12">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No documents found
            </h3>
            <p className="text-gray-600 mb-6">
              Start by requesting a document or adjust your filters
            </p>
            <Button icon={Plus}>
              {t('documents.requestDocument')}
            </Button>
          </Card.Body>
        </Card>
      )}
    </ConsultantLayout>
  );
};

export default ConsultantDocuments;