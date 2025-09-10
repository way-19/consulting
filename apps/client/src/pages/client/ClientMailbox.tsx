import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useAuth } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';
import { Mail, FileText, Download, DollarSign, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface QuickAction {
  action: string;
  href?: string;
  icon: any;
  color: string;
  estimatedTime: string;
}

interface ProfileData {
  full_name: string;
  display_name: string;
  phone: string;
  company: string;
  preferred_language: string;
  timezone: string;
}

interface OnboardingProgress {
  completedSteps: string[];
  currentStep: number;
  overallProgress: number;
  lastActivity: string;
  consultant_assigned: boolean;
  profile_complete: boolean;
  first_message_sent: boolean;
  first_document_uploaded: boolean;
  first_meeting_scheduled: boolean;
  welcome_call_completed: boolean;
}

const ClientOnboarding = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [onboardingProgress, setOnboardingProgress] = useState<OnboardingProgress>({
    completedSteps: [],
    currentStep: 0,
    overallProgress: 0,
    lastActivity: '',
    consultant_assigned: false,
    profile_complete: false,
    first_message_sent: false,
    first_document_uploaded: false,
    first_meeting_scheduled: false,
    welcome_call_completed: false
  });
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    display_name: '',
    phone: '',
    company: '',
    preferred_language: 'en',
    timezone: 'UTC'
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [consultant, setConsultant] = useState<any>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const timezones = [
    'UTC', 'America/New_York', 'America/Los_Angeles', 'Europe/London', 
    'Europe/Berlin', 'Europe/Istanbul', 'Asia/Dubai', 'Asia/Singapore',
    'Asia/Tokyo', 'Australia/Sydney'
  ];

  useEffect(() => {
    if (user && profile) {
      initializeOnboarding();
    }
  }, [user, profile]);

  const initializeOnboarding = async () => {
    try {
      setLoading(true);
      
      if (profile) {
        setProfileData({
          full_name: profile.full_name || '',
          display_name: profile.display_name || '',
          phone: profile.phone || '',
          company: profile.company || '',
          preferred_language: profile.preferred_language || 'en',
          timezone: profile.timezone || 'UTC'
        });
      }

      await Promise.all([
        checkOnboardingProgress(),
        fetchConsultantInfo(),
        fetchCountries()
      ]);
      
    } catch (err) {
      console.error('Error initializing onboarding:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const { data } = await supabase
        .from('countries')
        .select('id, name, flag_emoji')
        .eq('is_active', true)
        .order('name');
      setCountries(data || []);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const fetchConsultantInfo = async () => {
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientData?.assigned_consultant_id) {
        const { data: consultantData } = await supabase
          .from('profiles')
          .select('full_name, display_name, avatar_url')
          .eq('id', clientData.assigned_consultant_id)
          .single();

        setConsultant(consultantData);
      }
    } catch (err) {
      console.error('Error fetching consultant info:', err);
    }
  };

  const checkOnboardingProgress = async () => {
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id, status')
        .eq('profile_id', user?.id)
        .maybeSingle();

      const progress = {
        completedSteps: [],
        currentStep: 0,
        overallProgress: 0,
        lastActivity: '',
        consultant_assigned: !!clientData?.assigned_consultant_id,
        profile_complete: !!(profile?.full_name && profile?.phone),
        first_message_sent: false,
        first_document_uploaded: false,
        first_meeting_scheduled: false,
        welcome_call_completed: false
      };

      if (clientData) {
        const { count: messagesCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', user?.id);

        const { count: documentsCount } = await supabase
          .from('documents')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', clientData.id);

        const { count: meetingsCount } = await supabase
          .from('meetings')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', clientData.id);

        progress.first_message_sent = (messagesCount || 0) > 0;
        progress.first_document_uploaded = (documentsCount || 0) > 0;
        progress.first_meeting_scheduled = (meetingsCount || 0) > 0;
      }

      setOnboardingProgress(progress);
    } catch (err) {
      console.error('Error checking onboarding progress:', err);
    }
  };
};

interface MailForwardingRequest {
  id: string;
  forwarding_address: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_amount: number;
  payment_currency: string;
  created_at: string;
  processed_at?: string;
  document_id?: string;
  notes?: string;
}

interface Document {
  id: string;
  name: string;
  file_url: string;
  type: string;
  category?: string;
  created_at: string;
}

const ClientMailbox = () => {
  const { user, profile } = useAuth();
  const [mailRequests, setMailRequests] = useState<MailForwardingRequest[]>([]);
  const [companyDocuments, setCompanyDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequestAddress, setNewRequestAddress] = useState('');
  const [newRequestNotes, setNewRequestNotes] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [error, setError] = useState('');
  const [permissionError, setPermissionError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user && profile) {
      fetchMailboxData();
    }
  }, [user, profile]);

  const fetchMailboxData = async () => {
    try {
      setLoading(true);
      setError('');
      setPermissionError(false);

      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError || !clientData) {
        if (clientError?.code === 'PGRST116' || clientError?.message?.includes('permission')) {
          setPermissionError(true);
          setError('Access denied. Please ensure you have an active client profile and proper permissions.');
        } else {
          setError('Client data not found. Please ensure you have an active client profile.');
        }
        setLoading(false);
        return;
      }

      // Fetch mail forwarding requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('mail_forwarding_requests')
        .select('*')
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Error fetching mail requests:', requestsError);
        if (requestsError.code === 'PGRST116' || requestsError.message?.includes('permission')) {
          setPermissionError(true);
          setError('Permission denied for mail forwarding data. Please contact support.');
        } else {
          setError('Failed to fetch mail forwarding requests.');
        }
      } else {
        setMailRequests(requestsData || []);
      }

      // Fetch company documents (e.g., formation certificates, official letters)
      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .in('type', ['business', 'legal']) // Assuming these types are for company documents
        .order('created_at', { ascending: false });

      if (docsError) {
        console.error('Error fetching company documents:', docsError);
        if (docsError.code === 'PGRST116' || docsError.message?.includes('permission')) {
          setPermissionError(true);
          setError('Permission denied for company documents. Please contact support.');
        } else {
          setError('Failed to fetch company documents.');
        }
      } else {
        setCompanyDocuments(docsData || []);
      }

    } catch (err) {
      console.error('Unexpected error fetching mailbox data:', err);
      if (err?.message?.includes('permission') || err?.code === 'PGRST116') {
        setPermissionError(true);
        setError('Access permissions are insufficient. Please contact support.');
      } else {
        setError('An unexpected error occurred while loading your mailbox data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMailForwarding = async () => {
    if (!newRequestAddress.trim()) {
      setError('Forwarding address cannot be empty.');
      return;
    }

    try {
      setSubmittingRequest(true);
      setError('');
      setSuccessMessage('');

      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found.');
      }

      const requestAmount = 15.00; // Example price
      const requestCurrency = 'USD';

      const { data: requestData, error: requestError } = await supabase
        .from('mail_forwarding_requests')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          forwarding_address: newRequestAddress,
          status: 'pending',
          payment_amount: requestAmount,
          payment_currency: requestCurrency,
          notes: newRequestNotes.trim() || null,
        })
        .select()
        .single();

      if (requestError) {
        throw requestError;
      }

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            mail_forwarding_request_id: requestData.id,
            amount: Math.round(requestAmount * 100), // Convert to cents
            currency: requestCurrency.toLowerCase(),
            title: 'Mail Forwarding Request',
            description: `Forward mail to: ${newRequestAddress}`,
            success_url: `${window.location.origin}/file-manager?mail_request=success&request_id=${requestData.id}`,
            cancel_url: `${window.location.origin}/file-manager?mail_request=cancelled`,
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL received from Stripe.');
      }

      setSuccessMessage('Mail forwarding request submitted! Redirecting to payment...');
      setShowRequestModal(false);
      setNewRequestAddress('');
      setNewRequestNotes('');

    } catch (err: any) {
      console.error('Mail forwarding request error:', err);
      setError(err.message || 'Failed to submit mail forwarding request.');
    } finally {
      setSubmittingRequest(false);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-64 bg-gray-200 rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Mailbox & Company Documents</h1>
            <p className="text-gray-600 mt-1">Manage your physical mail forwarding and access official company documents</p>
          </div>
          <button 
            onClick={() => setShowRequestModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mail className="w-4 h-4 mr-2" />
            Request Mail Forwarding
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => {
                  setError('');
                  setPermissionError(false);
                }}
                className="text-red-700 hover:text-red-900 ml-4"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {permissionError && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded text-sm">
                <p><strong>Permission Issue:</strong> This might be due to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Missing RLS policies for mail forwarding or documents</li>
                  <li>Inactive client status preventing data access</li>
                  <li>Database configuration issues</li>
                </ul>
                <p className="mt-2">Please contact your administrator to resolve this issue.</p>
              </div>
            )}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-700 hover:text-green-900 ml-4"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mail Forwarding Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Mail Forwarding Requests</h2>
          {mailRequests.length > 0 ? (
            <div className="space-y-4">
              {mailRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.forwarding_address}</h3>
                      <p className="text-sm text-gray-600">
                        Requested on {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <span>Amount: ${request.payment_amount.toFixed(2)} {request.payment_currency}</span>
                    {request.processed_at && (
                      <span>Processed: {new Date(request.processed_at).toLocaleDateString()}</span>
                    )}
                  </div>
                  {request.notes && (
                    <p className="text-xs text-gray-500 mt-2">Notes: {request.notes}</p>
                  )}
                  {request.document_id && (
                    <div className="mt-3">
                      <button 
                        onClick={() => alert('View associated document')}
                        className="inline-flex items-center px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Document
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Mail Forwarding Requests</h3>
              <p className="text-gray-600 mb-6">
                Request physical mail forwarding from your registered company address.
              </p>
              <button 
                onClick={() => setShowRequestModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Request Mail Forwarding
              </button>
            </div>
          )}
        </div>

        {/* Company Documents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Official Company Documents</h2>
          {companyDocuments.length > 0 ? (
            <div className="space-y-4">
              {companyDocuments.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                      <p className="text-sm text-gray-600">
                        {doc.type} {doc.category && `(${doc.category})`} • Uploaded on {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button 
                      onClick={() => downloadDocument(doc.file_url, doc.name)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Company Documents Yet</h3>
              <p className="text-gray-600">
                Official documents like company formation certificates and legal papers will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Request Mail Forwarding Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Mail Forwarding</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm mb-4">
                  <AlertTriangle className="w-4 h-4 inline mr-2" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forwarding Address *
                  </label>
                  <input
                    type="text"
                    value={newRequestAddress}
                    onChange={(e) => setNewRequestAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full address including name and postal code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newRequestNotes}
                    onChange={(e) => setNewRequestNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Any specific instructions or details"
                  />
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  <p>
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Cost: $15.00 (one-time fee per request)
                  </p>
                  <p className="mt-1">
                    Your request will be processed after successful payment.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestMailForwarding}
                  disabled={submittingRequest || !newRequestAddress.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {submittingRequest ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2 inline" />
                      Submit Request & Pay
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