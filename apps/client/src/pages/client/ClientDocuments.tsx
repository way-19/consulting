import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '@consulting19/shared';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Check,
  MessageSquare,
  Trash2
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Document {
  id: string;
  name: string;
  type: string;
  category?: string;
  status: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  notes?: string;
  due_date?: string;
  uploaded_at?: string;
  reviewed_at?: string;
  created_at: string;
  consultant?: {
    full_name: string;
  };
}

interface DocumentRequest {
  id: string;
  title: string;
  description: string;
  document_type: string;
  priority: string;
  status: string;
  due_date?: string;
  created_at: string;
  consultant: {
    full_name: string;
  };
}

const ClientDocuments = () => {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('documents');

  useEffect(() => {
    if (user && profile) {
      fetchDocuments();
      fetchDocumentRequests();
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
        setLoading(false);
        return;
      }

      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select(`
          *,
          consultant:user_profiles!documents_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (documentsError) {
        console.error('Documents fetch error:', documentsError);
        setLoading(false);
        return;
      }

      setDocuments(documentsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentRequests = async () => {
    try {
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        return;
      }

      // Fetch document requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('document_requests')
        .select(`
          *,
          consultant:user_profiles!document_requests_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Document requests fetch error:', requestsError);
        return;
      }

      setDocumentRequests(requestsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleFileUpload = async (files: FileList, requestId?: string) => {
    try {
      setUploading(true);
      
      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        // Upload file to Supabase Storage
        const fileName = `documents/${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(uploadData.path);

        // Save document metadata
        const { error: docError } = await supabase
          .from('documents')
          .insert({
            client_id: clientData.id,
            consultant_id: clientData.assigned_consultant_id,
            name: file.name,
            type: 'other',
            category: 'uploaded',
            file_url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
            uploaded_at: new Date().toISOString(),
            status: 'uploaded'
          });

        if (docError) {
          throw docError;
        }

        // If this is for a specific request, update the request
        if (requestId) {
          await supabase
            .from('document_requests')
            .update({ status: 'uploaded' })
            .eq('id', requestId);
        }
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'document_upload',
          description: `Uploaded ${fileArray.length} document(s)`,
          payload: { 
            file_count: fileArray.length,
            request_id: requestId 
          }
        });

      // Notify consultant
      if (clientData.assigned_consultant_id) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientData.assigned_consultant_id,
            type: 'document_uploaded',
            payload: {
              client_name: profile?.full_name,
              document_count: fileArray.length
            },
            email_notification: true
          }
        });
      }

      alert('Documents uploaded successfully!');
      fetchDocuments();
      fetchDocumentRequests();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'uploaded': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected': return <X className="w-5 h-5 text-red-600" />;
      case 'needs_revision': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs_revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredRequests = documentRequests.filter(req => {
    const matchesSearch = 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const documentStats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => ['uploaded', 'pending'].includes(d.status)).length,
    requests: documentRequests.filter(r => r.status === 'pending').length
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Documents - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
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
        <title>Documents - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('documents.title')}</h1>
            <p className="text-gray-600 mt-1">{t('documents.subtitle')}</p>
          </div>
          <div>
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="document-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="document-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : t('documents.upload')}
            </label>
          </div>
        </div>

        {/* Document Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900">{documentStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{documentStats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{documentStats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Requests</p>
                <p className="text-3xl font-bold text-blue-600">{documentStats.requests}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'documents', name: `My Documents (${documents.length})`, icon: FileText },
                { id: 'requests', name: `Requests (${documentRequests.length})`, icon: Upload },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="uploaded">Uploaded</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs_revision">Needs Revision</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="identity">Identity</option>
                <option value="business">Business</option>
                <option value="financial">Financial</option>
                <option value="legal">Legal</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div>
                {filteredDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(doc.status)}
                            <div>
                              <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="capitalize">{doc.type}</span>
                                {doc.category && (
                                  <>
                                    <span>•</span>
                                    <span className="capitalize">{doc.category}</span>
                                  </>
                                )}
                                {doc.file_size && (
                                  <>
                                    <span>•</span>
                                    <span>{formatFileSize(doc.file_size)}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>
                                  {doc.uploaded_at 
                                    ? new Date(doc.uploaded_at).toLocaleDateString()
                                    : new Date(doc.created_at).toLocaleDateString()
                                  }
                                </span>
                                {doc.consultant && (
                                  <>
                                    <span>•</span>
                                    <span>by {doc.consultant.full_name}</span>
                                  </>
                                )}
                              </div>
                              {doc.notes && (
                                <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                                  {doc.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                              {doc.status.replace('_', ' ')}
                            </span>
                            {doc.file_url && (
                              <>
                                <button 
                                  onClick={() => window.open(doc.file_url!, '_blank')}
                                  className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Preview
                                </button>
                                <button 
                                  onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = doc.file_url!;
                                    a.download = doc.name;
                                    a.click();
                                  }}
                                  className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  {t('documents.download')}
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('documents.noDocuments')}</h3>
                    <p className="text-gray-600 mb-6">{t('documents.noDocumentsDescription')}</p>
                    <label
                      htmlFor="document-upload"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Your First Document
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                {filteredRequests.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{request.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                                {request.priority}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{request.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                <span>Requested by {request.consultant.full_name}</span>
                              </div>
                              {request.due_date && (
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>Due: {new Date(request.due_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              <span className="capitalize">{request.document_type}</span>
                            </div>
                          </div>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex items-center space-x-3">
                            <label
                              htmlFor={`upload-${request.id}`}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Document
                            </label>
                            <input
                              type="file"
                              id={`upload-${request.id}`}
                              onChange={(e) => e.target.files && handleFileUpload(e.target.files, request.id)}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Ask Question
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Document Requests</h3>
                    <p className="text-gray-600">
                      Your consultant will request documents as needed for your projects
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDocuments;