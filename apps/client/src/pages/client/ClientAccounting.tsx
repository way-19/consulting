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
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Plus
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface AccountingDocument {
  id: string;
  name: string;
  type: string;
  category: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  amount?: number;
  currency?: string;
  transaction_date?: string;
  notes?: string;
  status: string;
  uploaded_at: string;
  created_at: string;
}

interface DocumentStats {
  totalDocuments: number;
  pendingReview: number;
  approved: number;
  thisMonth: number;
}

const ClientAccounting = () => {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const [documents, setDocuments] = useState<AccountingDocument[]>([]);
  const [documentStats, setDocumentStats] = useState<DocumentStats>({
    totalDocuments: 0,
    pendingReview: 0,
    approved: 0,
    thisMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
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
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (clientError || !clientData) {
        setError('Client data not found');
        return;
      }

      // Fetch accounting documents
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
      totalDocuments: docs.length,
      pendingReview: docs.filter(d => d.status === 'uploaded' || d.status === 'pending').length,
      approved: docs.filter(d => d.status === 'approved').length,
      thisMonth: docs.filter(d => new Date(d.created_at) >= thisMonth).length
    };
    
    setDocumentStats(stats);
  };

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select files to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      
      const fileArray = Array.from(selectedFiles);
      
      // Validate file types and sizes
      for (const file of fileArray) {
        if (!allowedFileTypes.includes(file.type)) {
          setError(t('accounting.fileTypeError'));
          return;
        }
        
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          setError(t('accounting.fileSizeError'));
          return;
        }
      }

      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Upload each file
      for (const file of fileArray) {
        // Upload to Supabase Storage
        const fileName = `accounting-documents/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(uploadData.path);

        // Save to documents table
        const documentData = {
          client_id: clientData.id,
          name: file.name,
          type: 'financial',
          category: uploadFormData.category,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
          amount: uploadFormData.amount ? parseFloat(uploadFormData.amount) : null,
          currency: uploadFormData.currency || 'USD',
          transaction_date: uploadFormData.transaction_date || null,
          notes: uploadFormData.notes || null,
          status: 'uploaded',
          uploaded_at: new Date().toISOString()
        };

        const { error: dbError } = await supabase
          .from('documents')
          .insert(documentData);

        if (dbError) {
          throw new Error(`Database save failed for ${file.name}: ${dbError.message}`);
        }
      }

      setSuccessMessage(t('accounting.uploadSuccess', { count: fileArray.length }));
      setShowUploadModal(false);
      setSelectedFiles(null);
      setUploadFormData({
        category: 'invoice',
        amount: '',
        currency: 'USD',
        transaction_date: '',
        notes: ''
      });
      
      fetchDocuments();
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
      fetchDocuments();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(t('accounting.deleteError'));
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
          <button 
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            {t('accounting.uploadDocument')}
          </button>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Document Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t('accounting.stats.totalDocuments')}</p>
                <p className="text-3xl font-bold text-gray-900">{documentStats.totalDocuments}</p>
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
              <h4 className="font-semibold text-blue-800 mb-2">{t('accounting.guidelines.monthlySubmissionTitle')}</h4>
              <p className="text-sm text-blue-700">{t('accounting.guidelines.monthlySubmissionDesc')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">{t('accounting.guidelines.requiredDocumentsTitle')}</h4>
              <p className="text-sm text-blue-700">{t('accounting.guidelines.requiredDocumentsDesc')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">{t('accounting.guidelines.processingTimeTitle')}</h4>
              <p className="text-sm text-blue-700">{t('accounting.guidelines.processingTimeDesc')}</p>
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
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
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
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {doc.mime_type?.includes('pdf') ? '📄' : 
                           doc.mime_type?.includes('image') ? '🖼️' : 
                           doc.mime_type?.includes('sheet') ? '📊' : '📄'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{categories.find(c => c.value === doc.category)?.label || doc.category}</span>
                            <span>{formatFileSize(doc.file_size)}</span>
                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                            {doc.amount && (
                              <span className="font-medium text-green-600">
                                {doc.amount.toLocaleString()} {doc.currency}
                              </span>
                            )}
                          </div>
                          {doc.notes && (
                            <p className="text-sm text-blue-600 mt-1">{doc.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          doc.status === 'uploaded' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.status}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => window.open(doc.file_url, '_blank')}
                            className="text-blue-600 hover:text-blue-700"
                            title="View document"
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
                            title="Download document"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete document"
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
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('accounting.uploadDocument')}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('accounting.documentCategory')} *
                  </label>
                  <select
                    value={uploadFormData.category}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
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
                      value={uploadFormData.amount}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={uploadFormData.currency}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="TRY">TRY</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('accounting.transactionDate')} ({t('common.optional')})
                  </label>
                  <input
                    type="date"
                    value={uploadFormData.transaction_date}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('accounting.selectFiles')} *
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setSelectedFiles(e.target.files)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t('accounting.allowedFormats')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.notes')} ({t('common.optional')})
                  </label>
                  <textarea
                    value={uploadFormData.notes}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder={t('accounting.notesPlaceholder')}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles(null);
                    setUploadFormData({
                      category: 'invoice',
                      amount: '',
                      currency: 'USD',
                      transaction_date: '',
                      notes: ''
                    });
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
      </div>
    </>
  );
};

export default ClientAccounting;