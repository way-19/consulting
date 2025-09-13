import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  FileText, 
  Upload, 
  Download, 
  Search,
  Filter,
  Eye,
  Trash2,
  User,
  Building,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { supabase } from '@consulting19/shared/src/lib/supabase';

interface Document {
  id: string;
  name: string;
  type: 'identity' | 'business' | 'financial' | 'legal' | 'other';
  category?: string;
  status: 'uploaded' | 'pending' | 'approved' | 'rejected' | 'needs_revision';
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  notes?: string;
  uploaded_at?: string;
  reviewed_at?: string;
  created_at: string;
  amount?: number;
  currency?: string;
  transaction_date?: string;
  client: {
    id: string;
    profile: {
      full_name: string;
    };
    company_name?: string;
  };
}

interface Client {
  id: string;
  profile: {
    full_name: string;
    email: string;
  };
  company_name?: string;
  status: string;
}

interface DocumentStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  company: number;
  accounting: number;
}

const ConsultantDocuments = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [documentStats, setDocumentStats] = useState<DocumentStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    company: 0,
    accounting: 0
  });
  const [markingAsViewed, setMarkingAsViewed] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchClients();
    }
  }, [user, profile]);

  useEffect(() => {
    if (selectedClient) {
      fetchDocuments();
    }
  }, [selectedClient, activeTab]);

  const fetchClients = async () => {
    try {
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          id,
          status,
          company_name,
          profile:user_profiles!clients_profile_id_fkey(full_name, email)
        `)
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(clientsData || []);
      
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!selectedClient) return;

    try {
      setLoading(true);
      
      const { data: documentsData, error } = await supabase
        .from('documents')
        .select(`
          *,
          client:clients!documents_client_id_fkey(
            id,
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          )
        `)
        .eq('client_id', selectedClient)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments(documentsData || []);
      calculateStats(documentsData || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (docs: Document[]) => {
    const stats = {
      total: docs.length,
      pending: docs.filter(d => d.status === 'pending' || d.status === 'uploaded').length,
      approved: docs.filter(d => d.status === 'approved').length,
      rejected: docs.filter(d => d.status === 'rejected' || d.status === 'needs_revision').length,
      company: docs.filter(d => d.type === 'business' || d.type === 'legal').length,
      accounting: docs.filter(d => d.type === 'financial').length
    };
    setDocumentStats(stats);
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length || !selectedClient) return;

    try {
      setUploading(true);
      
      const fileArray = Array.from(files);
      
      // Validate file types
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      for (const file of fileArray) {
        if (!allowedTypes.includes(file.type)) {
          alert(`File type not allowed: ${file.name}. Only PDF, JPG, PNG, XLSX, DOCX files are permitted.`);
          return;
        }
        
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          alert(`File too large: ${file.name}. Maximum size is 50MB.`);
          return;
        }
      }

      // Process each file
      for (const file of fileArray) {
        // Upload to Supabase Storage
        const fileName = `consultant-documents/${Date.now()}-${file.name}`;
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

        // Determine document type based on activeTab
        let documentType: string;
        if (activeTab === 'company') {
          documentType = 'business'; // This will make it appear in client mailbox
        } else if (activeTab === 'accounting') {
          documentType = 'financial';
        } else {
          documentType = 'other';
        }

        // Save document to database
        const { error: dbError } = await supabase
          .from('documents')
          .insert({
            client_id: selectedClient,
            consultant_id: user?.id,
            name: file.name,
            type: documentType,
            category: activeTab,
            status: 'uploaded',
            file_url: urlData.publicUrl,
            file_size: file.size,
            mime_type: file.type,
            notes: `Uploaded by consultant via ${activeTab} documents`,
            uploaded_at: new Date().toISOString()
          });

        if (dbError) {
          throw new Error(`Database save failed for ${file.name}: ${dbError.message}`);
        }

        // Notify client about new company document
        if (activeTab === 'company') {
          const client = clients.find(c => c.id === selectedClient);
          if (client) {
            await supabase.functions.invoke('notify', {
              body: {
                recipient_id: client.profile.email, // Use client profile_id
                type: 'document_uploaded',
                payload: {
                  consultant_name: profile?.full_name,
                  document_name: file.name,
                  document_type: documentType,
                  client_name: client.profile.full_name
                },
                email_notification: true
              }
            });
          }
        }
      }

      alert(`Successfully uploaded ${fileArray.length} document(s)!`);
      fetchDocuments();
      
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(err.message || 'Failed to upload document(s). Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const markDocumentsAsViewed = async () => {
    if (!selectedClient) return;

    try {
      setMarkingAsViewed(true);
      
      // Resolve client-level document alerts (since consultant has viewed the documents)
      await supabase
        .from('consultant_alerts')
        .update({ 
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('consultant_id', user?.id)
        .eq('alert_source_id', selectedClient)
        .eq('alert_type', 'document_uploaded')
        .eq('is_resolved', false);

      // Also resolve any old document-specific alerts for backward compatibility
      const { data: clientDocuments } = await supabase
        .from('documents')
        .select('id')
        .eq('client_id', selectedClient);

      if (clientDocuments && clientDocuments.length > 0) {
        const documentIds = clientDocuments.map(doc => doc.id);
        await supabase
          .from('consultant_alerts')
          .update({ 
            is_resolved: true,
            resolved_at: new Date().toISOString()
          })
          .eq('consultant_id', user?.id)
          .in('alert_source_id', documentIds)
          .eq('alert_type', 'document_uploaded')
          .eq('is_resolved', false);
      }

      console.log('✅ Documents marked as viewed, alerts resolved');
    } catch (err) {
      console.error('Error marking documents as viewed:', err);
    } finally {
      setMarkingAsViewed(false);
    }
  };

  const updateDocumentStatus = async (documentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) {
        throw error;
      }

      // Resolve related consultant alerts when document is reviewed (any status change)
      // Get client ID from document
      const { data: clientDocData } = await supabase
        .from('documents')
        .select('client_id')
        .eq('id', documentId)
        .single();

      if (clientDocData?.client_id) {
        // Resolve client-level alert (since consultant has checked the documents)
        await supabase
          .from('consultant_alerts')
          .update({ 
            is_resolved: true,
            resolved_at: new Date().toISOString()
          })
          .eq('alert_source_id', clientDocData.client_id)
          .eq('alert_type', 'document_uploaded')
          .eq('is_resolved', false);
      }

      // Also resolve any old document-specific alerts for backward compatibility
      await supabase
        .from('consultant_alerts')
        .update({ 
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('alert_source_id', documentId)
        .eq('alert_type', 'document_uploaded')
        .eq('is_resolved', false);

      fetchDocuments();
    } catch (err) {
      console.error('Error updating document status:', err);
      alert('Failed to update document status');
    }
  };

  const deleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) {
        throw error;
      }

      fetchDocuments();
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Failed to delete document');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': 
      case 'needs_revision': return 'bg-red-100 text-red-800';
      case 'pending':
      case 'uploaded': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'business': return '🏢';
      case 'financial': return '💰';
      case 'legal': return '⚖️';
      case 'identity': return '🆔';
      default: return '📄';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'company' && (doc.type === 'business' || doc.type === 'legal')) ||
      (activeTab === 'accounting' && doc.type === 'financial');
    
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesTab && matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Document Management - Consultant Dashboard</title>
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
        <title>Document Management - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-1">Review and manage client documents</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search clients..."
                value={clientSearchTerm}
                onChange={(e) => setClientSearchTerm(e.target.value)}
                className="w-40 pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Client</option>
              {clients
                .filter(client => 
                  client.profile.full_name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                  (client.company_name || '').toLowerCase().includes(clientSearchTerm.toLowerCase())
                )
                .map((client) => (
                <option key={client.id} value={client.id}>
                  {client.profile.full_name} ({client.company_name || 'Individual'})
                </option>
              ))}
            </select>
            <button 
              onClick={fetchDocuments}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button 
              onClick={markDocumentsAsViewed}
              disabled={markingAsViewed || !selectedClient}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {markingAsViewed ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Marking Viewed...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Viewed
                </>
              )}
            </button>
          </div>
        </div>

        {!selectedClient ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Client</h3>
            <p className="text-gray-600">Choose a client from the dropdown above to manage their documents</p>
          </div>
        ) : (
          <>
            {/* Document Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Documents</p>
                    <p className="text-3xl font-bold text-gray-900">{documentStats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
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
                    <p className="text-sm font-medium text-gray-600">Company Documents</p>
                    <p className="text-3xl font-bold text-blue-600">{documentStats.company}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Accounting Documents</p>
                    <p className="text-3xl font-bold text-green-600">{documentStats.accounting}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Document Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'all', name: 'All Documents', count: documentStats.total },
                    { id: 'company', name: 'Company Documents', count: documentStats.company },
                    { id: 'accounting', name: 'Accounting Documents', count: documentStats.accounting },
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
                      <span>{tab.name}</span>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Upload Area - Only show for company and accounting tabs */}
              {activeTab === 'company' && (
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      multiple
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
                        uploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Upload Company Documents'}
                    </label>
                    <p className="text-sm text-gray-600">
                      Upload official company documents (certificates, legal papers, etc.)
                    </p>
                  </div>
                </div>
              )}

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
                  </select>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="business">Business</option>
                    <option value="financial">Financial</option>
                    <option value="legal">Legal</option>
                    <option value="identity">Identity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Documents List */}
              <div className="p-6">
                {filteredDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-2xl">{getTypeIcon(doc.type)}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 space-y-1">
                                <div>{doc.type} • {doc.file_size ? `${(doc.file_size / 1024).toFixed(0)} KB` : 'Unknown size'} • {new Date(doc.created_at).toLocaleDateString()}</div>
                                {doc.amount && (
                                  <div className="font-medium text-green-600">
                                    ${doc.amount.toLocaleString()} {doc.currency || 'USD'}
                                  </div>
                                )}
                                {doc.transaction_date && (
                                  <div>İşlem Tarihi: {new Date(doc.transaction_date).toLocaleDateString()}</div>
                                )}
                              </div>
                              {doc.notes && (
                                <p className="text-sm text-blue-600 mt-1">Açıklama: {doc.notes}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              {doc.file_url && (
                                <>
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
                                      a.href = doc.file_url!;
                                      a.download = doc.name;
                                      a.click();
                                    }}
                                    className="text-green-600 hover:text-green-700"
                                    title="Download document"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              
                              {doc.status === 'uploaded' && (
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => updateDocumentStatus(doc.id, 'approved')}
                                    className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => updateDocumentStatus(doc.id, 'rejected')}
                                    className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                              
                              <button 
                                onClick={() => deleteDocument(doc.id)}
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {activeTab === 'company' ? 'No Company Documents' :
                       activeTab === 'accounting' ? 'No Accounting Documents' : 'No Documents'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {activeTab === 'company' 
                        ? 'Upload company documents that will be available in client mailbox'
                        : activeTab === 'accounting'
                        ? 'Client accounting documents will appear here when uploaded'
                        : 'Documents will appear here as clients upload them or when you upload company documents'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ConsultantDocuments;