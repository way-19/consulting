import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Filter, 
  FileText, 
  Calendar, 
  User,
  Building,
  Download,
  Eye,
  Truck,
  DollarSign,
  MapPin,
  CreditCard,
  CheckCircle,
  Clock,
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
  uploaded_at: string | null;
  consultant: {
    full_name: string;
  } | null;
}

interface ForwardingRequest {
  id: string;
  document_id: string;
  forwarding_address: string;
  status: string;
  tracking_number: string | null;
  created_at: string;
  document: {
    name: string;
  };
}

const ClientMailbox = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [forwardingRequests, setForwardingRequests] = useState<ForwardingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [forwardingAddress, setForwardingAddress] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchForwardingRequests();
    }
  }, [user]);

  const fetchDocuments = async () => {
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

      // Fetch documents uploaded by consultant to this client's mailbox
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select(`
          *,
          consultant:user_profiles!documents_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .not('consultant_id', 'is', null) // Only documents uploaded by consultant
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

  const fetchForwardingRequests = async () => {
    try {
      // Get client ID
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) return;

      const { data: requestsData, error: requestsError } = await supabase
        .from('mail_forwarding_requests')
        .select(`
          *,
          document:documents(name)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching forwarding requests:', requestsError);
        return;
      }

      setForwardingRequests(requestsData || []);
    } catch (err) {
      console.error('Error fetching forwarding requests:', err);
    }
  };

  const handleDocumentForwarding = async () => {
    if (!selectedDocument || !forwardingAddress.trim()) {
      alert('Please provide a forwarding address');
      return;
    }

    try {
      setProcessingPayment(true);

      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Create forwarding request
      const { data: forwardingRequest, error: forwardingError } = await supabase
        .from('mail_forwarding_requests')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          document_id: selectedDocument.id,
          forwarding_address: forwardingAddress,
          status: 'pending',
          amount: 15.00,
          currency: 'USD'
        })
        .select()
        .single();

      if (forwardingError) {
        throw forwardingError;
      }

      // Create Stripe checkout session
      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            amount: 1500, // $15 in cents
            currency: 'usd',
            title: 'Mail Forwarding Service',
            description: `Forward document: ${selectedDocument.name}`,
            mail_forwarding_request_id: forwardingRequest.id
          }
        }
      );

      if (sessionError) {
        throw sessionError;
      }

      // Redirect to Stripe Checkout
      if (sessionData?.url) {
        window.location.href = sessionData.url;
      }

    } catch (err) {
      console.error('Forwarding error:', err);
      alert('Failed to initiate forwarding. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);

  const newThisWeek = documents.filter(doc => 
    doc.uploaded_at && new Date(doc.uploaded_at) >= thisWeekStart
  ).length;

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Virtual Mailbox - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
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
        <title>Virtual Mailbox - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Virtual Mailbox</h1>
          <p className="text-gray-600 mt-1">Access your company documents and manage physical mail forwarding</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New This Week</p>
                <p className="text-2xl font-bold text-gray-900">{newThisWeek}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Forward Requests</p>
                <p className="text-2xl font-bold text-gray-900">{forwardingRequests.length}</p>
              </div>
              <Truck className="w-8 h-8 text-orange-600" />
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
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="business">Business</option>
              <option value="legal">Legal</option>
              <option value="financial">Financial</option>
              <option value="identity">Identity</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Company Documents Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Company Documents</h2>
            <p className="text-sm text-gray-600">Important documents uploaded by your consultant</p>
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{doc.type}</span>
                          {doc.file_size && <span>{formatFileSize(doc.file_size)}</span>}
                          {doc.uploaded_at && (
                            <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                          )}
                          {doc.consultant && (
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              <span>by {doc.consultant.full_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => window.open(doc.file_url!, '_blank')}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Preview document"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
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
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          setSelectedDocument(doc);
                          setShowForwardModal(true);
                        }}
                        className="inline-flex items-center px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        title="Forward this document"
                      >
                        <Truck className="w-4 h-4 mr-1" />
                        Forward ($15)
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
              <p className="text-gray-600">
                Documents uploaded by your consultant will appear here
              </p>
            </div>
          )}
        </div>

        {/* Forwarding Requests Section */}
        {forwardingRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Forwarding Requests</h2>
              <p className="text-sm text-gray-600">Track your mail forwarding requests</p>
            </div>
            <div className="divide-y divide-gray-200">
              {forwardingRequests.map((request) => (
                <div key={request.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.document?.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{request.forwarding_address}</span>
                          </div>
                          {request.tracking_number && (
                            <span>Tracking: {request.tracking_number}</span>
                          )}
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                      <span className="text-sm font-medium text-gray-900">$15</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forwarding Modal */}
        {showForwardModal && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Forward Document
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedDocument.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedDocument.file_size && formatFileSize(selectedDocument.file_size)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forwarding Address *
                  </label>
                  <textarea
                    value={forwardingAddress}
                    onChange={(e) => setForwardingAddress(e.target.value)}
                    placeholder="Enter the complete address where you want this document forwarded..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include full name, street address, city, postal code, and country
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">📮 Mail Forwarding Service</h3>
                  <div className="space-y-1 text-xs text-blue-800">
                    <p>• Service Fee: $15 USD</p>
                    <p>• Processing Time: 3-5 business days</p>
                    <p>• Tracking Number: Provided after payment</p>
                    <p>• Delivery Time: Varies by destination</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowForwardModal(false);
                    setSelectedDocument(null);
                    setForwardingAddress('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDocumentForwarding}
                  disabled={processingPayment || !forwardingAddress.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  {processingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2 inline" />
                      Pay & Forward ($15)
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

export default ClientMailbox;