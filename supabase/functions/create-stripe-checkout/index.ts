import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Check, 
  X, 
  Upload, 
  Eye, 
  FileText, 
  Calendar, 
  User,
  Send,
  Building,
  Shield,
  CreditCard,
  Truck,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';
import { useAuth } from '@consulting19/shared';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  status: string;
  file_url: string | null;
  file_size: number | null;
  notes: string | null;
  due_date: string | null;
  uploaded_at: string | null;
  client: {
    id: string;
    profile: {
      full_name: string;
    };
    company_name: string;
  };
}

interface Client {
  id: string;
  profile: {
    full_name: string;
  };
  company_name: string;
}

const ConsultantDocuments = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    client_id: '',
    name: '',
    type: 'business',
    category: 'certificate',
    notes: '',
    file: null as File | null
  });

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchClients();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select(`
          *,
          client:clients!documents_client_id_fkey(
            id,
            profile:user_profiles!clients_profile_id_fkey(full_name),
            company_name
          )
        `)
        .eq('consultant_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (docsError) {
        console.error('Error fetching documents:', docsError);
        return;
      }

      setDocuments(docsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select(`
          id,
          company_name,
          profile:user_profiles!clients_profile_id_fkey(full_name)
        `)
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active');

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        return;
      }

      setClients(clientsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadForm.file || !uploadForm.client_id || !uploadForm.name) {
      alert('Please fill in all required fields and select a file');
      return;
    }

    try {
      setUploading(true);
      
      // Upload file to Supabase Storage
      const fileName = `mailbox/${Date.now()}-${uploadForm.file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, uploadForm.file);

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
          client_id: uploadForm.client_id,
          consultant_id: user?.id,
          name: uploadForm.name,
          type: uploadForm.type,
          category: uploadForm.category,
          file_url: urlData.publicUrl,
          file_size: uploadForm.file.size,
          mime_type: uploadForm.file.type,
          notes: uploadForm.notes,
          status: 'uploaded',
          uploaded_at: new Date().toISOString()
        });

      if (docError) {
        throw docError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'document_uploaded',
          resource_type: 'document',
          description: `Uploaded document: ${uploadForm.name} to client mailbox`,
          payload: { 
            document_name: uploadForm.name,
            client_id: uploadForm.client_id,
            file_size: uploadForm.file.size
          }
        });

      // Notify client
      const client = clients.find(c => c.id === uploadForm.client_id);
      if (client) {
        const { data: clientProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', client.profile.id)
          .single();

        if (clientProfile) {
          await supabase.functions.invoke('notify', {
            body: {
              recipient_id: clientProfile.id,
              type: 'mailbox_document_received',
              payload: {
                document_name: uploadForm.name,
                document_type: uploadForm.type,
                consultant_name: user?.user_metadata?.full_name
              },
              email_notification: true
            }
          });
        }
      }

      alert('Document uploaded to client mailbox successfully!');
      setShowUploadModal(false);
      setUploadForm({
        client_id: '',
        name: '',
        type: 'business',
        category: 'certificate',
        notes: '',
        file: null
      });
      fetchDocuments();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDocumentAction = async (documentId: string, action: 'approve' | 'reject') => {
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
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

      // Update local state
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: newStatus }
            : doc
        )
      );

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: `document_${action}d`,
          resource_type: 'document',
          resource_id: documentId,
          description: `${action === 'approve' ? 'Approved' : 'Rejected'} document`,
          payload: { document_id: documentId }
        });

      alert(`Document ${action}d successfully!`);
    } catch (err) {
      console.error(`Error ${action}ing document:`, err);
      alert(`Failed to ${action} document. Please try again.`);
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'legal': return '⚖️';
      case 'business': return '🏢';
      case 'identity': return '🆔';
      case 'certificate': return '🏆';
      case 'permit': return '📜';
      case 'license': return '🎫';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
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
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesClient = selectedClient === '' || doc.client?.id === selectedClient;
    
    return matchesSearch && matchesStatus && matchesClient;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Documents - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
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
        <title>Documents - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Documents</h1>
            <p className="text-gray-600 mt-1">Manage client documents and mailbox uploads</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload to Mailbox
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.profile?.full_name} {client.company_name && `(${client.company_name})`}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="uploaded">Uploaded</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length > 0 ? (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{doc.client?.profile?.full_name}</span>
                        </div>
                        {doc.client?.company_name && (
                          <>
                            <span>•</span>
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-1" />
                              <span>{doc.client.company_name}</span>
                            </div>
                          </>
                        )}
                        <span>•</span>
                        <span className="capitalize">{doc.type} - {doc.category}</span>
                        {doc.file_size && (
                          <>
                            <span>•</span>
                            <span>{formatFileSize(doc.file_size)}</span>
                          </>
                        )}
                        {doc.uploaded_at && (
                          <>
                            <span>•</span>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {doc.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded mb-2">{doc.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button 
                      onClick={() => window.open(doc.file_url!, '_blank')}
                      className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Preview document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {doc.file_url && (
                      <button 
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = doc.file_url!;
                          a.download = doc.name;
                          a.click();
                        }}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Download document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    {doc.status === 'uploaded' && (
                      <>
                        <button 
                          onClick={() => handleDocumentAction(doc.id, 'approve')}
                          className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          title="Approve document"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDocumentAction(doc.id, 'reject')}
                          className="inline-flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          title="Reject document"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Documents Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Upload important documents to your clients' virtual mailboxes
            </p>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload First Document
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload Document to Client Mailbox
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Client *
                  </label>
                  <select
                    value={uploadForm.client_id}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, client_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choose a client...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.profile?.full_name} {client.company_name && `(${client.company_name})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Name *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Company Registration Certificate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Document Type
                    </label>
                    <select
                      value={uploadForm.type}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="business">Business</option>
                      <option value="legal">Legal</option>
                      <option value="identity">Identity</option>
                      <option value="certificate">Certificate</option>
                      <option value="permit">Permit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="certificate">Certificate</option>
                      <option value="license">License</option>
                      <option value="permit">Permit</option>
                      <option value="registration">Registration</option>
                      <option value="agreement">Agreement</option>
                      <option value="statement">Statement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File *
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={uploadForm.notes}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes about this document..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadForm({
                      client_id: '',
                      name: '',
                      type: 'business',
                      category: 'certificate',
                      notes: '',
                      file: null
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={uploading || !uploadForm.file || !uploadForm.client_id || !uploadForm.name}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2 inline" />
                      Upload to Mailbox
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

export default ConsultantDocuments;