import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import { 
  Upload, 
  FileText, 
  Download, 
  Search,
  Eye,
  Trash2,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import { supabase } from '@consulting19/shared/src/lib/supabase';

interface AccountingDocument {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  notes?: string;
  amount?: number;
  currency?: string;
  transaction_date?: string;
  uploaded_at: string;
  created_at: string;
}

interface DocumentStats {
  total: number;
  thisMonth: number;
  pendingReview: number;
  approved: number;
}

const ClientAccounting = () => {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const [documents, setDocuments] = useState<AccountingDocument[]>([]);
  const [documentStats, setDocumentStats] = useState<DocumentStats>({
    total: 0,
    thisMonth: 0,
    pendingReview: 0,
    approved: 0
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    category: 'invoice',
    amount: '',
    currency: 'USD',
    transaction_date: '',
    notes: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    { value: 'invoice', label: t('accounting.category.invoice') },
    { value: 'receipt', label: t('accounting.category.receipt') },
    { value: 'bankStatement', label: t('accounting.category.bankStatement') },
    { value: 'taxDocument', label: t('accounting.category.taxDocument') },
    { value: 'expenseReport', label: t('accounting.category.expenseReport') },
    { value: 'contract', label: t('accounting.category.contract') },
    { value: 'other', label: t('accounting.category.other') }
  ];

  const allowedFileTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  useEffect(() => {
    if (user && profile) {
      fetchDocuments();
    }
  }, [user, profile]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 DEBUG: Fetching documents for user ID:', user?.id);
      
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id, profile_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      console.log('🔍 DEBUG: Client data for documents:', { clientData, clientError });

      if (clientError || !clientData) {
        console.error('❌ Client data not found for documents:', { user_id: user?.id, error: clientError });
        setError(`Client data not found for user ${user?.id}. Error: ${clientError?.message || 'Unknown'}`);
        return;
      }

      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .eq('type', 'financial')
        .order('created_at', { ascending: false });

      if (documentsError) {
        setError('Failed to fetch documents');
        return;
      }

      setDocuments(documentsData || []);
      calculateStats(documentsData || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (docs: AccountingDocument[]) => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const stats = {
      total: docs.length,
      thisMonth: docs.filter(d => new Date(d.created_at) >= thisMonth).length,
      pendingReview: docs.filter(d => d.status === 'uploaded' || d.status === 'pending').length,
      approved: docs.filter(d => d.status === 'approved').length
    };
    
    setDocumentStats(stats);
  };

  const validateFile = (file: File): string | null => {
    if (!allowedFileTypes.includes(file.type)) {
      return t('accounting.fileTypeError');
    }
    
    if (file.size > 50 * 1024 * 1024) {
      return t('accounting.fileSizeError');
    }
    
    return null;
  };

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      console.log('🔍 DEBUG: Fetching client data for user ID:', user?.id);
      
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id, profile_id')
        .eq('profile_id', user?.id)
        .single();

      console.log('🔍 DEBUG: Client query result:', { clientData, clientError });
      
      if (clientError || !clientData) {
        console.error('❌ Client data not found:', { user_id: user?.id, error: clientError });
        throw new Error(`Client data not found for user ${user?.id}. Error: ${clientError?.message || 'Unknown'}`);
      }

      console.log('✅ DEBUG: Using consultant_id:', clientData.assigned_consultant_id);

      const fileArray = Array.from(selectedFiles);
      let uploadedCount = 0;

      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        const fileName = `accounting/${Date.now()}-${file.name}`;
        const { data: storageResult, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(storageResult.path);

        console.log('📄 DEBUG: Inserting document with data:', {
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          file_name: file.name,
          user_id: user?.id
        });

        // DIRECT DATABASE INSERT: Simple approach without complex RPC calls
        let documentInserted = false;
        
        try {
          // Method 1: Try minimal direct insert to documents table
          const docData = {
            client_id: clientData.id,
            consultant_id: clientData.assigned_consultant_id,
            name: file.name,
            type: 'financial',
            status: 'uploaded',
            file_url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type || 'application/pdf',
            category: uploadData.category || 'other',
            notes: uploadData.notes || null,
            amount: uploadData.amount ? parseFloat(uploadData.amount) : null,
            currency: uploadData.currency || 'USD',
            transaction_date: uploadData.transaction_date || null
          };

          console.log('📄 DEBUG: Attempting direct insert with data:', docData);

          const { data: insertResult, error: insertError } = await supabase
            .from('documents')
            .insert(docData)
            .select();

          if (!insertError && insertResult) {
            console.log('✅ Document inserted successfully:', insertResult);
            documentInserted = true;
          } else {
            console.log('⚠️ Direct insert failed:', insertError?.message);
            
            // Method 2: Try with string conversion for problematic fields
            const stringDocData = {
              ...docData,
              client_id: String(docData.client_id),
              consultant_id: String(docData.consultant_id),
              file_size: Number(docData.file_size),
              amount: docData.amount ? Number(docData.amount) : null
            };

            console.log('📄 DEBUG: Retrying with type conversion:', stringDocData);

            const { data: retryResult, error: retryError } = await supabase
              .from('documents')
              .insert(stringDocData)
              .select();

            if (!retryError && retryResult) {
              console.log('✅ Document inserted with type conversion:', retryResult);
              documentInserted = true;
            } else {
              console.log('⚠️ Type conversion insert failed:', retryError?.message);
            }
          }
        } catch (err) {
          console.log('❌ Database insert error:', err);
        }

        // 🎯 TASK OLUŞTURMA: Sadece document başarıyla kaydedildiyse
        if (documentInserted && clientData.assigned_consultant_id) {
          console.log('📋 DEBUG: Creating task for document upload');
          
          const { error: taskError } = await supabase
            .from('tasks')
            .insert({
              client_id: clientData.id,
              consultant_id: clientData.assigned_consultant_id,
              title: `Review uploaded document: ${file.name}`,
              description: `Client has uploaded a new ${uploadData.category || 'financial'} document that requires review.`,
              type: 'document_review',
              status: 'todo',
              priority: 'medium',
              due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              estimated_hours: 0.5,
              billable: false,
              is_client_visible: false
            });

          if (taskError) {
            console.error('⚠️ Task creation failed:', taskError);
          } else {
            console.log('✅ Task created successfully');
          }
        }

        // 🔔 ALERT OLUŞTURMA: Sadece document başarıyla kaydedildiyse
        if (documentInserted && clientData.assigned_consultant_id) {
          console.log('🔔 DEBUG: Creating consultant alert');
          
          const { error: alertError } = await supabase
            .from('consultant_alerts')
            .insert({
              consultant_id: clientData.assigned_consultant_id,
              client_id: clientData.id,
              alert_type: 'document_uploaded',
              alert_source_id: clientData.id,
              message: `${file.name} uploaded by client`,
              is_resolved: false
            });

          if (alertError) {
            console.error('⚠️ Alert creation failed:', alertError);
          } else {
            console.log('✅ Consultant alert created successfully');
          }
        }



        uploadedCount++;
      }

      setSuccessMessage(t('accounting.uploadSuccess', { count: uploadedCount }));
      setShowUploadModal(false);
      setSelectedFiles(null);
      setUploadData({
        category: 'invoice',
        amount: '',
        currency: 'USD',
        transaction_date: '',
        notes: ''
      });
      
      await fetchDocuments();
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || t('accounting.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm(t('accounting.deleteConfirm'))) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        throw error;
      }

      setSuccessMessage(t('accounting.deleteSuccess'));
      await fetchDocuments();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(err.message || t('accounting.deleteError'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'uploaded': 
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': 
      case 'needs_revision': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'uploaded':
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'rejected':
      case 'needs_revision': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{t('accounting.title')} - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('accounting.title')} - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('accounting.title')}</h1>
            <p className="text-gray-600 mt-1">{t('accounting.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchDocuments}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('common.refresh')}
            </button>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              {t('accounting.uploadDocument')}
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-auto text-red-700 hover:text-red-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className="ml-auto text-green-700 hover:text-green-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Document Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('accounting.stats.totalDocuments')}</p>
                <p className="text-3xl font-bold text-gray-900">{documentStats.total}</p>
                <p className="text-xs text-gray-500">{documentStats.thisMonth} {t('accounting.thisMonth')}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('accounting.stats.pendingReview')}</p>
                <p className="text-3xl font-bold text-yellow-600">{documentStats.pendingReview}</p>
                <p className="text-xs text-gray-500">{t('accounting.awaitingReview')}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('accounting.stats.approved')}</p>
                <p className="text-3xl font-bold text-green-600">{documentStats.approved}</p>
                <p className="text-xs text-gray-500">{t('accounting.processed')}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">{t('accounting.guidelines.title')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">{t('accounting.guidelines.monthlySubmissionTitle')}</h4>
              <p className="text-sm text-blue-800">{t('accounting.guidelines.monthlySubmissionDesc')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">{t('accounting.guidelines.requiredDocumentsTitle')}</h4>
              <p className="text-sm text-blue-800">{t('accounting.guidelines.requiredDocumentsDesc')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">{t('accounting.guidelines.processingTimeTitle')}</h4>
              <p className="text-sm text-blue-800">{t('accounting.guidelines.processingTimeDesc')}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('accounting.searchDocuments')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('common.allStatus')}</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('common.allStatus')}</option>
              <option value="uploaded">{t('status.uploaded')}</option>
              <option value="pending">{t('status.pending')}</option>
              <option value="approved">{t('status.approved')}</option>
              <option value="rejected">{t('status.rejected')}</option>
            </select>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{t('accounting.documentsTitle')}</h2>
            <p className="text-sm text-gray-600">{t('accounting.documentsSubtitle')}</p>
          </div>
          
          <div className="p-6">
            {filteredDocuments.length > 0 ? (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(doc.status)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{categories.find(c => c.value === doc.category)?.label || doc.category}</span>
                            <span>•</span>
                            <span>{doc.file_size ? `${(doc.file_size / 1024).toFixed(0)} KB` : t('common.unknownSize')}</span>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                          </div>
                          {doc.amount && (
                            <div className="text-sm font-medium text-green-600 mt-1">
                              ${doc.amount.toLocaleString()} {doc.currency}
                              {doc.transaction_date && (
                                <span className="text-gray-500 ml-2">
                                  • {new Date(doc.transaction_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}
                          {doc.notes && (
                            <p className="text-sm text-blue-600 mt-1">{doc.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                          {t(`status.${doc.status}`) || doc.status}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => window.open(doc.file_url, '_blank')}
                            className="text-blue-600 hover:text-blue-700"
                            title={t('common.view')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              const a = document.createElement('a');
                              a.href = doc.file_url;
                              a.download = doc.name;
                              a.click();
                            }}
                            className="text-green-600 hover:text-green-700"
                            title={t('common.download')}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-700"
                            title={t('common.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('accounting.noDocuments')}</h3>
                <p className="text-gray-600 mb-6">{t('accounting.noDocumentsDescription')}</p>
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {t('accounting.uploadFirstDocument')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{t('accounting.uploadDocument')}</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles(null);
                    setError('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('accounting.documentCategory')} *
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount ({t('common.optional')})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={uploadData.amount}
                      onChange={(e) => setUploadData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('accounting.transactionDate')} ({t('common.optional')})
                    </label>
                    <input
                      type="date"
                      value={uploadData.transaction_date}
                      onChange={(e) => setUploadData(prev => ({ ...prev, transaction_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('accounting.selectFiles')} *
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('accounting.allowedFormats')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.notes')} ({t('common.optional')})
                  </label>
                  <textarea
                    value={uploadData.notes}
                    onChange={(e) => setUploadData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder={t('accounting.notesPlaceholder')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles(null);
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={uploading || !selectedFiles || selectedFiles.length === 0}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      {t('accounting.uploading')}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2 inline" />
                      {t('accounting.uploadDocument')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Monthly Accounting Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('accounting.monthlyAccounting')}</h3>
          <p className="text-gray-600">{t('accounting.monthlyAccountingDescription')}</p>
        </div>
      </div>
    </>
  );
};

export default ClientAccounting;