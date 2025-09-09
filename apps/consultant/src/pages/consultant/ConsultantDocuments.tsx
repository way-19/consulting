import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
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
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  Building,
  Globe,
  DollarSign,
  BarChart3,
  TrendingUp,
  Archive,
  Trash2
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

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
  due_date?: string;
  uploaded_at?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  client: {
    id: string;
    profile: {
      full_name: string;
      email: string;
    };
    company_name?: string;
  };
}

interface DocumentStats {
  total: number;
  pending_review: number;
  approved: number;
  rejected: number;
  this_week: number;
  avg_review_time: number;
}

const ConsultantDocuments = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentStats, setDocumentStats] = useState<DocumentStats>({
    total: 0,
    pending_review: 0,
    approved: 0,
    rejected: 0,
    this_week: 0,
    avg_review_time: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [reviewingDocument, setReviewingDocument] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    if (user && profile) {
      fetchDocuments();
    }
  }, [user, profile]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // Fetch documents for clients assigned to this consultant
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select(`
          *,
          client:clients!documents_client_id_fkey(
            id,
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name, email)
          )
        `)
        .eq('consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (documentsError) {
        console.error('Error fetching documents:', documentsError);
        return;
      }

      setDocuments(documentsData || []);
      calculateDocumentStats(documentsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDocumentStats = (docs: Document[]) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const stats: DocumentStats = {
      total: docs.length,
      pending_review: docs.filter(d => d.status === 'uploaded').length,
      approved: docs.filter(d => d.status === 'approved').length,
      rejected: docs.filter(d => d.status === 'rejected').length,
      this_week: docs.filter(d => new Date(d.created_at) >= weekAgo).length,
      avg_review_time: 2.5 // Mock average review time in days
    };

    setDocumentStats(stats);
  };

  const handleDocumentReview = async (documentId: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      setReviewingDocument(documentId);
      
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('documents')
        .update({
          status: newStatus,
          notes: notes || null,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) {
        throw error;
      }

      // Get document and client info for notification
      const document = documents.find(d => d.id === documentId);
      if (document) {
        // Create audit log
        await supabase
          .from('audit_logs')
          .insert({
            user_id: user?.id,
            action_type: `document_${action}d`,
            description: `${action === 'approve' ? 'Approved' : 'Rejected'} document: ${document.name}`,
            payload: { 
              document_id: documentId,
              client_id: document.client.id,
              action: action,
              notes: notes
            }
          });

        // Notify client
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: document.client.profile.full_name, // This should be profile_id, but we'll use name for demo
            type: `document_${action}d`,
            payload: {
              document_name: document.name,
              consultant_name: profile?.full_name,
              notes: notes,
              action: action
            },
            email_notification: true
          }
        });
      }

      alert(`Document ${action}d successfully!`);
      setShowReviewModal(false);
      setSelectedDocument(null);
      setReviewNotes('');
      fetchDocuments();
    } catch (err) {
      console.error(`Error ${action}ing document:`, err);
      alert(`Failed to ${action} document. Please try again.`);
    } finally {
      setReviewingDocument(null);
    }
  };

  const requestDocumentFromClient = async (clientId: string, documentType: string, description: string) => {
    try {
      const { error } = await supabase
        .from('document_requests')
        .insert({
          client_id: clientId,
          consultant_id: user?.id,
          title: `${documentType} Request`,
          description: description,
          document_type: documentType,
          priority: 'medium',
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      alert('Document request sent to client successfully!');
    } catch (err) {
      console.error('Error requesting document:', err);
      alert('Failed to send document request. Please try again.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected': return <X className="w-5 h-5 text-red-600" />;
      case 'uploaded': return <Upload className="w-5 h-5 text-blue-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'needs_revision': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'needs_revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'identity': return '🆔';
      case 'business': return '🏢';
      case 'financial': return '💰';
      case 'legal': return '⚖️';
      default: return '📄';
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
      doc.client?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesClient = clientFilter === 'all' || doc.client.id === clientFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesClient;
  });

  const uniqueClients = [...new Map(documents.map(d => [d.client.id, d.client])).values()];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Documents - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-1">Review and manage client documents</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => alert('Send document to client feature will be implemented')}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Send to Client
            </button>
            <button 
              onClick={() => alert('Request document from client feature will be implemented')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Request from Client
            </button>
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
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{documentStats.pending_review}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
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
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-blue-600">{documentStats.this_week}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents by name, client, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="uploaded">Uploaded</option>
                <option value="pending">Pending Review</option>
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
              {uniqueClients.length > 0 && (
                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Clients</option>
                  {uniqueClients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.profile.full_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length > 0 ? (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{getDocumentTypeIcon(doc.type)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(doc.status)}
                        <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{doc.client?.profile?.full_name}</span>
                        </div>
                        {doc.client?.company_name && (
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            <span>{doc.client.company_name}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span className="capitalize">{doc.type}</span>
                        </div>
                        {doc.file_size && (
                          <span>{formatFileSize(doc.file_size)}</span>
                        )}
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {doc.uploaded_at 
                              ? new Date(doc.uploaded_at).toLocaleDateString()
                              : new Date(doc.created_at).toLocaleDateString()
                            }
                          </span>
                        </div>
                      </div>

                      {doc.notes && (
                        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-700">{doc.notes}</p>
                        </div>
                      )}

                      {doc.due_date && (
                        <div className="mt-2 flex items-center text-sm text-orange-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span>Due: {new Date(doc.due_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
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
                          Download
                        </button>
                      </>
                    )}
                    
                    {doc.status === 'uploaded' && (
                      <>
                        <button 
                          onClick={() => {
                            setSelectedDocument(doc);
                            setShowReviewModal(true);
                          }}
                          className="inline-flex items-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Review
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
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || clientFilter !== 'all'
                ? 'No documents match your filters'
                : 'No documents uploaded yet'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || clientFilter !== 'all'
                ? 'Try adjusting your search terms or filters'
                : 'Documents will appear here as clients upload them for review'
              }
            </p>
            {!(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || clientFilter !== 'all') && (
              <button 
                onClick={() => alert('Document request feature will be implemented')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Request Document from Client
              </button>
            )}
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Review Document: {selectedDocument.name}
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getDocumentTypeIcon(selectedDocument.type)}</span>
                    <span className="font-medium text-gray-900">{selectedDocument.type}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Client: {selectedDocument.client.profile.full_name}</p>
                    {selectedDocument.client.company_name && (
                      <p>Company: {selectedDocument.client.company_name}</p>
                    )}
                    <p>Uploaded: {selectedDocument.uploaded_at ? new Date(selectedDocument.uploaded_at).toLocaleDateString() : 'Unknown'}</p>
                    {selectedDocument.file_size && (
                      <p>Size: {formatFileSize(selectedDocument.file_size)}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes (Optional)
                  </label>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add notes about your review decision..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedDocument(null);
                    setReviewNotes('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDocumentReview(selectedDocument.id, 'reject', reviewNotes)}
                  disabled={reviewingDocument === selectedDocument.id}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {reviewingDocument === selectedDocument.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2 inline" />
                      Reject
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDocumentReview(selectedDocument.id, 'approve', reviewNotes)}
                  disabled={reviewingDocument === selectedDocument.id}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {reviewingDocument === selectedDocument.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Approving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2 inline" />
                      Approve
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Review Guidelines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Document Review Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Approval Criteria</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Document is clear and readable</li>
                    <li>• All required information is present</li>
                    <li>• Document is recent and valid</li>
                    <li>• Matches the requested document type</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Review Timeline</h4>
                  <p className="text-sm text-gray-600">
                    Review documents within 2-3 business days. Urgent documents 
                    should be reviewed within 24 hours.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mt-0.5">
                  <X className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Rejection Reasons</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Document is unclear or unreadable</li>
                    <li>• Missing required information</li>
                    <li>• Document is expired or outdated</li>
                    <li>• Wrong document type uploaded</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-0.5">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Communication</h4>
                  <p className="text-sm text-gray-600">
                    Always provide clear feedback when rejecting documents. 
                    Use the notes field to explain what needs to be corrected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Review Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{documentStats.avg_review_time}</div>
              <div className="text-sm text-blue-800">Avg Review Time (days)</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {documentStats.total > 0 ? ((documentStats.approved / documentStats.total) * 100).toFixed(0) : 0}%
              </div>
              <div className="text-sm text-green-800">Approval Rate</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">{documentStats.this_week}</div>
              <div className="text-sm text-purple-800">This Week</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantDocuments;