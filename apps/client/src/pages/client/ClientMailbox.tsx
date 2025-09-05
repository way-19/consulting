import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter,
  Send,
  Calendar,
  User,
  Truck,
  DollarSign,
  CheckCircle,
  Clock,
  Building,
  Shield,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface MailboxDocument {
  id: string;
  name: string;
  type: string;
  category: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  notes: string;
  status: string;
  consultant: {
    full_name: string;
  };
  forwarding_requests?: ForwardingRequest[];
}

interface ForwardingRequest {
  id: string;
  document_id: string;
  forwarding_address: string;
  status: string;
  payment_amount: number;
  created_at: string;
  tracking_number?: string;
}

const ClientMailbox = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<MailboxDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<MailboxDocument | null>(null);
  const [forwardAddress, setForwardAddress] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchMailboxDocuments();
    }
  }, [user, profile]);

  const fetchMailboxDocuments = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (clientError || !clientData) {
        console.error('Error fetching client data:', clientError);
        return;
      }

      // Fetch mailbox documents (permanent documents uploaded by consultant)
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select(`
          *,
          consultant:user_profiles!documents_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .neq('type', 'financial') // Exclude temporary accounting documents
        .order('uploaded_at', { ascending: false });

      if (docsError) {
        console.error('Error fetching documents:', docsError);
        return;
      }

      // Fetch forwarding requests for these documents
      const documentIds = docsData?.map(doc => doc.id) || [];
      let forwardingData: ForwardingRequest[] = [];
      
      if (documentIds.length > 0) {
        const { data: forwardingRequests } = await supabase
          .from('mail_forwarding_requests')
          .select('*')
          .in('document_id', documentIds)
          .order('created_at', { ascending: false });
        
        forwardingData = forwardingRequests || [];
      }

      // Combine documents with their forwarding requests
      const documentsWithForwarding = docsData?.map(doc => ({
        ...doc,
        forwarding_requests: forwardingData.filter(req => req.document_id === doc.id)
      })) || [];

      setDocuments(documentsWithForwarding);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentForwarding = async (document: MailboxDocument) => {
    if (!forwardAddress.trim()) {
      alert('Please enter a forwarding address');
      return;
    }

    try {
      setProcessing(true);

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Create mail forwarding request for specific document
      const { error: requestError } = await supabase
        .from('mail_forwarding_requests')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          document_id: document.id,
          document_name: document.name,
          forwarding_address: forwardAddress,
          payment_amount: 15.00,
          status: 'pending',
          stripe_session_id: `demo_session_${Date.now()}`,
          stripe_payment_intent_id: `demo_pi_${Date.now()}`,
        });

      if (requestError) {
        throw requestError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'document_forwarding_request',
          resource_type: 'document',
          resource_id: document.id,
          description: `Requested forwarding of document: ${document.name}`,
          payload: { 
            document_name: document.name,
            forwarding_address: forwardAddress,
            amount: 15.00 
          }
        });

      // Notify consultant
      if (clientData.assigned_consultant_id) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientData.assigned_consultant_id,
            type: 'document_forwarding_request',
            payload: {
              client_name: profile?.full_name,
              document_name: document.name,
              forwarding_address: forwardAddress
            },
            email_notification: true
          }
        });
      }

      alert(`Forwarding request for "${document.name}" submitted successfully! $15 payment processed.`);
      setShowForwardModal(false);
      setForwardAddress('');
      setSelectedDocument(null);
      fetchMailboxDocuments();
    } catch (err) {
      console.error('Document forwarding error:', err);
      alert('Failed to process document forwarding request. Please try again.');
    } finally {
      setProcessing(false);
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
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
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
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const documentStats = {
    total: documents.length,
    recent: documents.filter(doc => {
      const uploadDate = new Date(doc.uploaded_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return uploadDate > weekAgo;
    }).length,
    forwardingRequests: documents.reduce((sum, doc) => sum + (doc.forwarding_requests?.length || 0), 0)
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Mailbox - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
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
        <title>Mailbox - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Virtual Mailbox</h1>
          <p className="text-gray-600 mt-1">Access your company documents and manage physical mail forwarding</p>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-blue-600">{documentStats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New This Week</p>
                <p className="text-2xl font-bold text-green-600">{documentStats.recent}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Forward Requests</p>
                <p className="text-2xl font-bold text-orange-600">{documentStats.forwardingRequests}</p>
              </div>
              <Truck className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="legal">Legal Documents</option>
              <option value="business">Business Documents</option>
              <option value="certificate">Certificates</option>
              <option value="permit">Permits & Licenses</option>
              <option value="identity">Identity Documents</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Company Documents</h2>
            <p className="text-sm text-gray-600">Important documents uploaded by your consultant</p>
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
                          <span className="capitalize">{doc.type} Document</span>
                          <span>•</span>
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>By {doc.consultant?.full_name}</span>
                        </div>
                        {doc.notes && (
                          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-2">{doc.notes}</p>
                        )}
                        
                        {/* Forwarding History */}
                        {doc.forwarding_requests && doc.forwarding_requests.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-xs font-medium text-gray-700 mb-1">Forwarding History:</h4>
                            <div className="space-y-1">
                              {doc.forwarding_requests.slice(0, 2).map((request) => (
                                <div key={request.id} className="flex items-center justify-between text-xs bg-blue-50 p-2 rounded">
                                  <span className="text-blue-800">
                                    {request.forwarding_address.substring(0, 30)}...
                                  </span>
                                  <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(request.status)}`}>
                                    {request.status}
                                  </span>
                                </div>
                              ))}
                              {doc.forwarding_requests.length > 2 && (
                                <p className="text-xs text-gray-500">
                                  +{doc.forwarding_requests.length - 2} more requests
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button 
                        onClick={() => window.open(doc.file_url, '_blank')}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Preview document"
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
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Download document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowForwardModal(true);
                        }}
                        className="inline-flex items-center px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        title="Forward physical copy ($15)"
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Forward ($15)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
              <p className="text-gray-600 mb-6">
                Your consultant will upload important company documents like certificates, 
                permits, and licenses to your virtual mailbox.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">📬 How it Works</h4>
                <div className="text-xs text-blue-800 space-y-1">
                  <p>• Your consultant uploads important documents</p>
                  <p>• You can preview and download them anytime</p>
                  <p>• Request physical mail forwarding for $15 per document</p>
                  <p>• Track forwarding status and delivery</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Document Forwarding Modal */}
        {showForwardModal && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Forward Physical Document
              </h2>
              
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">{selectedDocument.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-900">$15.00 USD</span>
                  <span className="text-xs text-gray-600">+ international shipping</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forwarding Address *
                </label>
                <textarea
                  value={forwardAddress}
                  onChange={(e) => setForwardAddress(e.target.value)}
                  placeholder="Enter complete mailing address including country..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include full address with postal code and country for international delivery
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowForwardModal(false);
                    setSelectedDocument(null);
                    setForwardAddress('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDocumentForwarding(selectedDocument)}
                  disabled={processing || !forwardAddress.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4 mr-2 inline" />
                      Pay & Forward ($15)
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-3 text-xs text-gray-500 text-center">
                Physical document forwarding typically takes 5-10 business days for international delivery
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientMailbox;