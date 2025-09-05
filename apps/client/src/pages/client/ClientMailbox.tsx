import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Eye, 
  FileText, 
  Calendar, 
  User,
  Building,
  Shield,
  CreditCard,
  Truck,
  AlertTriangle,
  Mail,
  Package,
  Clock,
  CheckCircle,
  DollarSign
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
  created_at: string;
}

interface MailForwardingRequest {
  id: string;
  forwarding_address: string;
  status: string;
  payment_amount: number;
  payment_currency: string;
  stripe_session_id: string | null;
  notes: string | null;
  processed_at: string | null;
  created_at: string;
  document: {
    name: string;
  } | null;
}

const ClientMailbox = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [forwardingRequests, setForwardingRequests] = useState<MailForwardingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardingForm, setForwardingForm] = useState({
    forwarding_address: '',
    notes: ''
  });
  const [submittingForward, setSubmittingForward] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchMailboxData();
    }
  }, [user, profile]);

  const fetchMailboxData = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (clientError || !clientData) {
        console.error('Error fetching client data:', clientError);
        return;
      }

      // Fetch documents from consultant (mailbox documents)
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .neq('type', 'financial') // Exclude accounting docs
        .order('created_at', { ascending: false });

      if (docsError) {
        console.error('Error fetching documents:', docsError);
      } else {
        setDocuments(docsData || []);
      }

      // Fetch mail forwarding requests with specific foreign key
      const { data: forwardData, error: forwardError } = await supabase
        .from('mail_forwarding_requests')
        .select(`
          *,
          document:documents!fk_mail_forwarding_requests_document(name)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (forwardError) {
        console.error('Error fetching forwarding requests:', forwardError);
        
        // Fallback without document relation if foreign key fails
        const { data: forwardDataFallback, error: fallbackError } = await supabase
          .from('mail_forwarding_requests')
          .select('*')
          .eq('client_id', clientData.id)
          .order('created_at', { ascending: false });

        if (!fallbackError) {
          const requestsWithoutDoc = forwardDataFallback?.map(req => ({
            ...req,
            document: null
          })) || [];
          setForwardingRequests(requestsWithoutDoc);
        }
      } else {
        setForwardingRequests(forwardData || []);
      }

    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMailForwarding = async () => {
    if (!forwardingForm.forwarding_address.trim()) {
      alert('Please enter a forwarding address');
      return;
    }

    try {
      setSubmittingForward(true);
      
      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Create mail forwarding request
      const { data: mfrData, error: mfrError } = await supabase
        .from('mail_forwarding_requests')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          forwarding_address: forwardingForm.forwarding_address,
          notes: forwardingForm.notes,
          status: 'pending',
          payment_amount: 15.00,
          payment_currency: 'USD'
        })
        .select()
        .single();

      if (mfrError) {
        throw mfrError;
      }

      // Create Stripe Checkout Session
      const checkoutData = {
        amount: 1500, // $15.00 in cents
        currency: 'usd',
        title: 'Mail Forwarding Service',
        description: `Forward mail to: ${forwardingForm.forwarding_address}`,
        mail_forwarding_request_id: mfrData.id,
        success_url: `${window.location.origin}/mailbox?forward=success`,
        cancel_url: `${window.location.origin}/mailbox?forward=cancel`
      };

      const { data: sessionData, error: sessionError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        { body: checkoutData }
      );

      if (sessionError) {
        throw sessionError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'mail_forwarding_request',
          description: `Requested mail forwarding to: ${forwardingForm.forwarding_address}`,
          payload: forwardingForm
        });

      // Redirect to Stripe Checkout
      if (sessionData?.url) {
        window.location.href = sessionData.url;
      } else {
        alert('Payment session created successfully');
        setShowForwardModal(false);
        setForwardingForm({ forwarding_address: '', notes: '' });
        fetchMailboxData();
      }

    } catch (err) {
      console.error('Mail forwarding error:', err);
      alert('Failed to create forwarding request. Please try again.');
    } finally {
      setSubmittingForward(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
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

  // Calculate stats
  const stats = {
    totalDocuments: documents.length,
    newThisWeek: documents.filter(doc => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(doc.created_at) > weekAgo;
    }).length,
    forwardRequests: forwardingRequests.length
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Virtual Mailbox - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
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
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Virtual Mailbox</h1>
            <p className="text-gray-600 mt-1">Access your company documents and manage physical mail forwarding</p>
          </div>
          <button 
            onClick={() => setShowForwardModal(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Truck className="w-4 h-4 mr-2" />
            Request Mail Forwarding ($15)
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalDocuments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New This Week</p>
                <p className="text-3xl font-bold text-green-600">{stats.newThisWeek}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Forward Requests</p>
                <p className="text-3xl font-bold text-orange-600">{stats.forwardRequests}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-orange-600" />
              </div>
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
          
          <div className="p-6">
            {filteredDocuments.length > 0 ? (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="capitalize">{doc.type}</span>
                          {doc.file_size && (
                            <>
                              <span>•</span>
                              <span>{formatFileSize(doc.file_size)}</span>
                            </>
                          )}
                          {doc.uploaded_at && (
                            <>
                              <span>•</span>
                              <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
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
                            View
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
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
                <p className="text-gray-600">
                  Your consultant will upload important documents to your virtual mailbox
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mail Forwarding Requests */}
        {forwardingRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Mail Forwarding Requests</h2>
              <p className="text-sm text-gray-600">Physical mail forwarding service requests</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {forwardingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Forward to: {request.forwarding_address}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>${request.payment_amount} {request.payment_currency}</span>
                          <span>•</span>
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                          {request.document && (
                            <>
                              <span>•</span>
                              <span>Document: {request.document.name}</span>
                            </>
                          )}
                        </div>
                        {request.notes && (
                          <p className="text-sm text-gray-600 mt-1">{request.notes}</p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mail Forwarding Modal */}
        {showForwardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Request Mail Forwarding
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                We'll forward your physical mail to any address worldwide for $15 USD per request.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forwarding Address *
                  </label>
                  <textarea
                    value={forwardingForm.forwarding_address}
                    onChange={(e) => setForwardingForm(prev => ({ ...prev, forwarding_address: e.target.value }))}
                    placeholder="Enter complete address including postal code..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={forwardingForm.notes}
                    onChange={(e) => setForwardingForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any special handling instructions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <DollarSign className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-orange-900">Service Fee: $15 USD</h4>
                      <p className="text-xs text-orange-800">
                        One-time fee per forwarding request. Payment processed securely through Stripe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowForwardModal(false);
                    setForwardingForm({ forwarding_address: '', notes: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMailForwarding}
                  disabled={submittingForward || !forwardingForm.forwarding_address.trim()}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  {submittingForward ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2 inline" />
                      Pay & Request Forwarding
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        {documents.length === 0 && forwardingRequests.length === 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Welcome to Your Virtual Mailbox! 📬
                </h3>
                <p className="text-blue-800 mb-4">
                  Your virtual mailbox provides secure access to important business documents and mail forwarding services.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <span className="text-blue-800">Receive important documents from your consultant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <span className="text-blue-800">Request physical mail forwarding to any address</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <span className="text-blue-800">Download and manage all your business documents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <span className="text-blue-800">Track forwarding requests and delivery status</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientMailbox;

export default ClientMailbox