import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Mail, 
  Download, 
  Eye, 
  Search, 
  Filter,
  MapPin,
  Send,
  DollarSign,
  FileText,
  Building,
  CreditCard,
  Truck,
  Calendar,
  Clock
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  notes: string;
}

interface MailForwardingRequest {
  id: string;
  forwarding_address: string;
  status: string;
  payment_amount: number;
  created_at: string;
}

const ClientMailbox = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [mailRequests, setMailRequests] = React.useState<MailForwardingRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForwardModal, setShowForwardModal] = React.useState(false);
  const [forwardAddress, setForwardAddress] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');

  React.useEffect(() => {
    if (user && profile) {
      fetchDocuments();
      fetchMailRequests();
    }
  }, [user, profile]);

  const fetchDocuments = async () => {
    try {
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

      // Fetch permanent documents (not financial type which gets deleted)
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .neq('type', 'financial') // Exclude financial documents that are in Accounting
        .order('uploaded_at', { ascending: false });

      if (docsError) {
        console.error('Error fetching documents:', docsError);
        return;
      }

      setDocuments(docsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const fetchMailRequests = async () => {
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) return;

      const { data: requestsData, error } = await supabase
        .from('mail_forwarding_requests')
        .select('*')
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (!error) {
        setMailRequests(requestsData || []);
      }
    } catch (err) {
      console.error('Error fetching mail requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMailForwarding = async () => {
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

      // For demo purposes, we'll simulate Stripe payment
      // In production, you would integrate with actual Stripe
      const stripeSessionId = `demo_session_${Date.now()}`;
      const stripePaymentIntentId = `demo_pi_${Date.now()}`;

      // Create mail forwarding request
      const { error: requestError } = await supabase
        .from('mail_forwarding_requests')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          forwarding_address: forwardAddress,
          payment_amount: 15.00,
          stripe_session_id: stripeSessionId,
          stripe_payment_intent_id: stripePaymentIntentId,
          status: 'pending'
        });

      if (requestError) {
        throw requestError;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'mail_forwarding_request',
          description: `Requested mail forwarding to: ${forwardAddress}`,
          payload: { address: forwardAddress, amount: 15.00 }
        });

      // Notify consultant
      if (clientData.assigned_consultant_id) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientData.assigned_consultant_id,
            type: 'mail_forwarding_request',
            payload: {
              client_name: profile?.full_name,
              forwarding_address: forwardAddress
            },
            email_notification: true
          }
        });
      }

      alert('Mail forwarding request submitted successfully! $15 payment processed.');
      setShowForwardModal(false);
      setForwardAddress('');
      fetchMailRequests();
    } catch (err) {
      console.error('Mail forwarding error:', err);
      alert('Failed to process mail forwarding request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'legal': return '⚖️';
      case 'business': return '🏢';
      case 'identity': return '🆔';
      default: return '📄';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Virtual Mailbox</h1>
            <p className="text-gray-600 mt-1">Access your company documents and manage mail forwarding</p>
          </div>
          <button 
            onClick={() => setShowForwardModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Truck className="w-4 h-4 mr-2" />
            Forward Mail ($15)
          </button>
        </div>

        {/* Mail Forwarding Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mail Requests</p>
                <p className="text-2xl font-bold text-green-600">{mailRequests.length}</p>
              </div>
              <Truck className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Forwards</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {mailRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
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
              <option value="identity">Identity Documents</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900">Company Documents</h2>
            <p className="text-sm text-gray-600">Permanent documents uploaded by your consultant</p>
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{getDocumentIcon(doc.type)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{doc.type} Document</span>
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        </div>
                        {doc.notes && (
                          <p className="text-xs text-gray-600 mt-1">{doc.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => window.open(doc.file_url, '_blank')}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </button>
                      <button 
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = doc.file_url;
                          a.download = doc.name;
                          a.click();
                        }}
                        className="inline-flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
              <p className="text-gray-600 mb-6">
                Your company formation documents, certificates, and other permanent documents will appear here.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">📬 Virtual Mailbox</h4>
                <p className="text-xs text-blue-800">
                  This is your virtual mailbox for permanent documents. Unlike accounting documents,
                  these documents are stored permanently and can be downloaded anytime.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mail Forwarding Requests */}
        {mailRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Mail Forwarding History</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {mailRequests.map((request) => (
                <div key={request.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">{request.forwarding_address}</p>
                        <p className="text-sm text-gray-600">
                          Requested on {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        ${request.payment_amount}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mail Forwarding Modal */}
        {showForwardModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Forward Physical Mail</h2>
              
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">$15.00 USD</span>
                </div>
                <p className="text-sm text-blue-800">
                  Physical mail forwarding fee includes handling and international shipping.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forwarding Address
                </label>
                <textarea
                  value={forwardAddress}
                  onChange={(e) => setForwardAddress(e.target.value)}
                  placeholder="Enter complete mailing address..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowForwardModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMailForwarding}
                  disabled={processing || !forwardAddress.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {processing ? 'Processing...' : 'Pay & Forward ($15)'}
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