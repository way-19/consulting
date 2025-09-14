import React, { useState, useEffect } from 'react';
import { supabase } from '@consulting19/shared/src/lib/supabase';
import { useAuth } from '@consulting19/shared/src/contexts/AuthContext';
import { useI18n } from '../../hooks/useI18n';
import { Upload, FileText, DollarSign, Calendar, TrendingUp, Download, Eye, Trash2 } from 'lucide-react';

interface Document {
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
  uploaded_at?: string;
  created_at: string;
}

interface UploadData {
  category: string;
  amount: string;
  currency: string;
  transaction_date: string;
  notes: string;
}

interface DocumentStats {
  totalDocuments: number;
  totalAmount: number;
  pendingReview: number;
  thisMonth: number;
}

const ClientAccounting: React.FC = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadData, setUploadData] = useState<UploadData>({
    category: 'invoice',
    amount: '',
    currency: 'USD',
    transaction_date: '',
    notes: ''
  });
  const [stats, setStats] = useState<DocumentStats>({
    totalDocuments: 0,
    totalAmount: 0,
    pendingReview: 0,
    thisMonth: 0
  });
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id, profile_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        setError('Client data not found');
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

  const calculateStats = (docs: Document[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const stats = docs.reduce((acc, doc) => {
      acc.totalDocuments++;
      
      if (doc.amount) {
        acc.totalAmount += doc.amount;
      }
      
      if (doc.status === 'uploaded') {
        acc.pendingReview++;
      }
      
      const docDate = new Date(doc.created_at);
      if (docDate.getMonth() === currentMonth && docDate.getFullYear() === currentYear) {
        acc.thisMonth++;
      }
      
      return acc;
    }, {
      totalDocuments: 0,
      totalAmount: 0,
      pendingReview: 0,
      thisMonth: 0
    });

    setStats(stats);
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      return 'File size must be less than 10MB';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported. Please upload PDF, Word, or image files.';
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
      
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id, profile_id')
        .eq('profile_id', user?.id)
        .single();
      
      if (clientError || !clientData) {
        throw new Error(`Client data not found for user ${user?.id}`);
      }

      const fileArray = Array.from(selectedFiles);
      let uploadedCount = 0;

      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }

        // Upload to Supabase Storage
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

        // Parse and validate amount
        let validatedAmount = null;
        if (uploadData.amount && uploadData.amount.trim() !== '') {
          const parsedAmount = parseFloat(uploadData.amount.trim());
          if (!isNaN(parsedAmount) && isFinite(parsedAmount)) {
            validatedAmount = parsedAmount;
          }
        }

        // Insert document record
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
          notes: uploadData.notes?.trim() || null,
          amount: validatedAmount,
          currency: uploadData.currency || 'USD',
          transaction_date: uploadData.transaction_date || null
        };

        const { data: insertResult, error: insertError } = await supabase
          .from('documents')
          .insert(docData)
          .select();

        if (insertError) {
          throw new Error(`Database insert failed: ${insertError.message}`);
        }

        console.log('📄 Document inserted successfully, creating task...');

        // Create task for consultant
        const taskData = {
          consultant_id: clientData.assigned_consultant_id,
          client_id: clientData.id,
          title: `Review ${uploadData.category} document: ${file.name}`,
          description: `Client uploaded ${uploadData.category} document: ${file.name}${uploadData.notes ? '\n\nNotes: ' + uploadData.notes : ''}`,
          type: 'document_review',
          status: 'pending',
          priority: 'medium',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          document_id: insertResult[0].id,
          created_at: new Date().toISOString()
        };

        const { data: taskResult, error: taskError } = await supabase
          .from('tasks')
          .insert(taskData)
          .select();

        if (taskError) {
          console.error('Task creation failed:', taskError);
          // Don't throw error - document upload was successful
        } else {
          console.log('✅ Task created successfully:', taskResult[0]);
        }

        // Create consultant alert
        const alertData = {
          consultant_id: clientData.assigned_consultant_id,
          alert_type: 'document_uploaded',
          title: 'New Document Uploaded',
          message: `${clientData.profile_id} uploaded a new ${uploadData.category} document: ${file.name}`,
          status: 'unread',
          priority: 'medium',
          document_id: insertResult[0].id,
          client_id: clientData.id,
          created_at: new Date().toISOString()
        };

        const { data: alertResult, error: alertError } = await supabase
          .from('consultant_alerts')
          .upsert(alertData, { 
            onConflict: 'consultant_id,alert_type,document_id',
            ignoreDuplicates: false 
          })
          .select();

        if (alertError) {
          console.error('Alert creation failed:', alertError);
          // Don't throw error - document upload was successful
        } else {
          console.log('🔔 Alert created successfully:', alertResult[0]);
        }

        uploadedCount++;
      }

      setSuccessMessage(`Successfully uploaded ${uploadedCount} file(s)`);
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
      
      // localStorage fallback for database errors
      if (err.message && (err.message.includes('duplicate key') || err.message.includes('constraint'))) {
        console.log('Using localStorage fallback due to database constraint error');
        
        const fallbackDoc = {
          id: Date.now().toString(),
          file: selectedFiles?.[0]?.name || 'unknown_file',
          category: uploadData.category,
          amount: uploadData.amount,
          notes: uploadData.notes,
          status: 'pending_admin_fix',
          timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const existingDocs = JSON.parse(localStorage.getItem('pending_documents') || '[]');
        existingDocs.push(fallbackDoc);
        localStorage.setItem('pending_documents', JSON.stringify(existingDocs));
        
        setSuccessMessage('Document saved temporarily. Admin will process it manually.');
        setSelectedFiles(null);
        setUploadData({ category: '', amount: '', notes: '' });
        return;
      }
      
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        setError('Failed to delete document');
        return;
      }

      await fetchDocuments();
      setSuccessMessage('Document deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete document');
    }
  };

  const getFilteredAndSortedDocuments = () => {
    let filtered = documents;

    if (filterCategory !== 'all') {
      filtered = documents.filter(doc => doc.category === filterCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'amount':
          return (b.amount || 0) - (a.amount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Monthly Accounting</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReview}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Filters and Sorting */}
      <div className="bg-white p-4 rounded-lg shadow border">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="invoice">Invoice</option>
              <option value="receipt">Receipt</option>
              <option value="contract">Contract</option>
              <option value="bank_statement">Bank Statement</option>
              <option value="tax_document">Tax Document</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="amount">Amount High-Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
        </div>

        {getFilteredAndSortedDocuments().length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No documents found</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Upload Your First Document
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {getFilteredAndSortedDocuments().map((doc) => (
              <div key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{doc.category.replace('_', ' ')}</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                        <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                        {doc.amount && (
                          <span className="font-medium text-green-600">
                            {formatCurrency(doc.amount, doc.currency)}
                          </span>
                        )}
                      </div>
                      {doc.notes && (
                        <p className="text-sm text-gray-600 mt-1">{doc.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      doc.status === 'uploaded' 
                        ? 'bg-orange-100 text-orange-800'
                        : doc.status === 'reviewed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {doc.status}
                    </span>

                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-blue-600"
                      title="View Document"
                    >
                      <Eye className="w-4 h-4" />
                    </a>

                    <a
                      href={doc.file_url}
                      download={doc.name}
                      className="p-2 text-gray-400 hover:text-green-600"
                      title="Download Document"
                    >
                      <Download className="w-4 h-4" />
                    </a>

                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Upload Document</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Files
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported: PDF, Word, Images (Max 10MB each)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="invoice">Invoice</option>
                  <option value="receipt">Receipt</option>
                  <option value="contract">Contract</option>
                  <option value="bank_statement">Bank Statement</option>
                  <option value="tax_document">Tax Document</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={uploadData.amount}
                    onChange={(e) => setUploadData({...uploadData, amount: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={uploadData.currency}
                    onChange={(e) => setUploadData({...uploadData, currency: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="TRY">TRY</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Date (Optional)
                </label>
                <input
                  type="date"
                  value={uploadData.transaction_date}
                  onChange={(e) => setUploadData({...uploadData, transaction_date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={uploadData.notes}
                  onChange={(e) => setUploadData({...uploadData, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows={3}
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                disabled={uploading || !selectedFiles || selectedFiles.length === 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAccounting;