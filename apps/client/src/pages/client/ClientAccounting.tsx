import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '@consulting19/shared';
import { 
  Upload, 
  FileText, 
  DollarSign, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  Eye,
  Download,
  BarChart3,
  TrendingUp,
  Clock,
  Building
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface AccountingDocument {
  id: string;
  name: string;
  type: string;
  file_url: string;
  file_size: number;
  amount?: number;
  currency?: string;
  transaction_date?: string;
  notes?: string;
  created_at: string;
}

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: File[];
  onUpload: (files: { file: File; type: string; notes: string; amount?: number; currency?: string; transactionDate?: string }[]) => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  files, 
  onUpload 
}) => {
  const { t } = useI18n();
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [fileData, setFileData] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen && files.length > 0) {
      setFileData(files.map(file => ({
        file,
        type: 'other',
        notes: '',
        amount: '',
        currency: 'USD',
        transactionDate: ''
      })));
      setCurrentFileIndex(0);
    }
  }, [isOpen, files]);

  const handleNext = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    } else {
      handleUpload();
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    const processedFiles = fileData.map(data => ({
      file: data.file,
      type: data.type,
      notes: data.notes,
      amount: data.amount ? parseFloat(data.amount) : undefined,
      currency: data.currency,
      transactionDate: data.transactionDate
    }));
    
    await onUpload(processedFiles);
    setUploading(false);
    onClose();
  };

  const updateCurrentFileData = (updates: any) => {
    setFileData(prev => prev.map((data, index) => 
      index === currentFileIndex ? { ...data, ...updates } : data
    ));
  };

  if (!isOpen) return null;

  const currentFile = files[currentFileIndex];
  const currentData = fileData[currentFileIndex];
  const isLastFile = currentFileIndex === files.length - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('accounting.modal.selectDocumentType')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            {t('accounting.modal.fileProgress', { 
              current: currentFileIndex + 1, 
              total: files.length, 
              fileName: currentFile?.name 
            })}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentFileIndex + 1) / files.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('accounting.modal.documentTypeLabel')}
            </label>
            <select
              value={currentData?.type || 'other'}
              onChange={(e) => updateCurrentFileData({ type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bankStatement">{t('accounting.documentTypes.bankStatement')}</option>
              <option value="invoice">{t('accounting.documentTypes.invoice')}</option>
              <option value="receipt">{t('accounting.documentTypes.receipt')}</option>
              <option value="taxDocument">{t('accounting.documentTypes.taxDocument')}</option>
              <option value="other">{t('accounting.documentTypes.other')}</option>
            </select>
          </div>

          {(currentData?.type === 'invoice' || currentData?.type === 'receipt') && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentData?.amount || ''}
                  onChange={(e) => updateCurrentFileData({ amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={currentData?.currency || 'USD'}
                  onChange={(e) => updateCurrentFileData({ currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GEL">GEL</option>
                  <option value="TRY">TRY</option>
                </select>
              </div>
            </div>
          )}

          {(currentData?.type === 'invoice' || currentData?.type === 'receipt' || currentData?.type === 'bankStatement') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Date
              </label>
              <input
                type="date"
                value={currentData?.transactionDate || ''}
                onChange={(e) => updateCurrentFileData({ transactionDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('accounting.modal.notesLabel')}
            </label>
            <textarea
              value={currentData?.notes || ''}
              onChange={(e) => updateCurrentFileData({ notes: e.target.value })}
              placeholder={t('accounting.modal.notesPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                {t('accounting.modal.uploading')}
              </>
            ) : isLastFile ? (
              t('accounting.modal.uploadAndFinish')
            ) : (
              t('accounting.modal.uploadAndContinue')
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ClientAccounting = () => {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const [documents, setDocuments] = useState<AccountingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user && profile) {
      fetchDocuments();
    }
  }, [user, profile]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        console.error('Client fetch error:', clientError);
        return;
      }

      // Fetch financial documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .eq('type', 'financial')
        .order('created_at', { ascending: false });

      if (documentsError) {
        console.error('Error fetching documents:', documentsError);
        return;
      }

      setDocuments(documentsData || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setShowUploadModal(true);
    }
  };

  const handleUpload = async (filesWithData: any[]) => {
    try {
      setUploading(true);
      setError('');

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Process each file
      for (const fileData of filesWithData) {
        // Upload to Supabase Storage
        const fileName = `accounting/${Date.now()}-${fileData.file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, fileData.file);

        if (uploadError) {
          throw new Error(`Upload failed for ${fileData.file.name}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(uploadData.path);

        // Save document to database
        const { error: dbError } = await supabase
          .from('documents')
          .insert({
            client_id: clientData.id,
            consultant_id: clientData.assigned_consultant_id,
            name: fileData.file.name,
            type: 'financial',
            category: fileData.type,
            status: 'uploaded',
            file_url: urlData.publicUrl,
            file_size: fileData.file.size,
            mime_type: fileData.file.type,
            amount: fileData.amount,
            currency: fileData.currency,
            transaction_date: fileData.transactionDate,
            notes: fileData.notes,
            uploaded_at: new Date().toISOString()
          });

        if (dbError) {
          throw new Error(`Database save failed for ${fileData.file.name}: ${dbError.message}`);
        }
      }

      // Notify consultant about new accounting documents
      if (clientData.assigned_consultant_id) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientData.assigned_consultant_id,
            type: 'accounting_document_uploaded',
            payload: {
              client_name: profile?.full_name,
              document_count: filesWithData.length,
              client_id: clientData.id
            },
            email_notification: true,
            create_consultant_alert: true,
            alert_type: 'document_uploaded'
          }
        });
      }

      setSuccessMessage(`Successfully uploaded ${filesWithData.length} document(s)!`);
      fetchDocuments();
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload documents. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'bankStatement': return '🏦';
      case 'invoice': return '📄';
      case 'receipt': return '🧾';
      case 'taxDocument': return '📋';
      default: return '📄';
    }
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
          <div>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </label>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-green-600">
                  {documents.filter(d => {
                    const docDate = new Date(d.created_at);
                    const now = new Date();
                    return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-purple-600">
                  ${documents.filter(d => d.amount).reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg per Month</p>
                <p className="text-3xl font-bold text-orange-600">
                  {Math.round(documents.length / Math.max(1, Math.ceil((Date.now() - new Date(documents[documents.length - 1]?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24 * 30))))}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Uploaded Documents</h2>
            <p className="text-sm text-gray-600">Your monthly financial documents</p>
          </div>
          
          <div className="p-6">
            {documents.length > 0 ? (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getDocumentIcon(doc.type)}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{doc.type}</span>
                            <span>•</span>
                            <span>{doc.file_size ? `${(doc.file_size / 1024).toFixed(0)} KB` : 'Unknown size'}</span>
                            <span>•</span>
                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                            {doc.amount && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-green-600">
                                  ${doc.amount.toLocaleString()} {doc.currency || 'USD'}
                                </span>
                              </>
                            )}
                            {doc.transaction_date && (
                              <>
                                <span>•</span>
                                <span>Transaction: {new Date(doc.transaction_date).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                          {doc.notes && (
                            <p className="text-sm text-blue-600 mt-1">Notes: {doc.notes}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => window.open(doc.file_url, '_blank')}
                          className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          title="View document"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        <button 
                          onClick={() => downloadDocument(doc.file_url, doc.name)}
                          className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          title="Download document"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
                <p className="text-gray-600 mb-6">
                  Upload your monthly financial documents to keep your accounting up to date
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">📊 Monthly Accounting</h4>
                  <p className="text-xs text-blue-800">
                    Upload bank statements, invoices, receipts, and tax documents. 
                    Your consultant will review them for compliance and accounting purposes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Upload Modal */}
        <DocumentUploadModal
          isOpen={showUploadModal}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedFiles([]);
          }}
          files={selectedFiles}
          onUpload={handleUpload}
        />
      </div>
    </>
  );
};

export default ClientAccounting;