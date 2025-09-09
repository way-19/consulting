import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  FileText, 
  Plus, 
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  User,
  Building,
  DollarSign,
  Calculator,
  Receipt,
  CreditCard,
  Upload,
  Send,
  Bell,
  RefreshCw,
  Target,
  BarChart3,
  Users,
  Star,
  TrendingUp,
  Calendar,
  ChevronDown
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
  uploaded_at?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
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
  profile_id: string;
  company_name?: string;
  status: string;
  profile: {
    full_name: string;
    email: string;
  };
  document_count?: number;
  last_document_date?: string;
}

interface DocumentRequest {
  id: string;
  title: string;
  description?: string;
  document_type: string;
  priority: string;
  status: string;
  due_date?: string;
  created_at: string;
  client: {
    profile: {
      full_name: string;
    };
    company_name?: string;
  };
}

interface DocumentStats {
  received: number;
  expected: number;
  overdue: number;
  approval_rate: number;
}

const ConsultantDocuments = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [documentStats, setDocumentStats] = useState<DocumentStats>({
    received: 0,
    expected: 0,
    overdue: 0,
    approval_rate: 0
  });
  
  // CRITICAL: New state management for empty page and client selection
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'company' | 'accounting'>('all');
  const [documentTab, setDocumentTab] = useState<'received' | 'expected'>('received');
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showBulkRequest, setShowBulkRequest] = useState(false);
  
  const [newRequest, setNewRequest] = useState({
    client_id: '',
    title: '',
    description: '',
    document_type: 'financial',
    priority: 'medium',
    due_date: ''
  });

  useEffect(() => {
    if (user && profile) {
      fetchClients();
    }
  }, [user, profile]);

  useEffect(() => {
    if (selectedClientId) {
      fetchDocuments();
      fetchDocumentRequests();
      calculateDocumentStats();
    } else {
      // CRITICAL: Clear data when no client is selected
      setDocuments([]);
      setDocumentRequests([]);
      setDocumentStats({ received: 0, expected: 0, overdue: 0, approval_rate: 0 });
    }
  }, [selectedClientId, activeTab]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          id,
          profile_id,
          company_name,
          status,
          profile:user_profiles!clients_profile_id_fkey(full_name, email)
        `)
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      // Enrich with document statistics
      const enrichedClients = await Promise.all(
        (clientsData || []).map(async (client) => {
          try {
            const { count: docCount } = await supabase
              .from('documents')
              .select('*', { count: 'exact', head: true })
              .eq('client_id', client.id);

            const { data: lastDoc } = await supabase
              .from('documents')
              .select('uploaded_at')
              .eq('client_id', client.id)
              .order('uploaded_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            return {
              ...client,
              document_count: docCount || 0,
              last_document_date: lastDoc?.uploaded_at || null
            };
          } catch (err) {
            console.error('Error enriching client data:', err);
            return {
              ...client,
              document_count: 0,
              last_document_date: null
            };
          }
        })
      );

      setClients(enrichedClients);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    if (!selectedClientId) return;

    try {
      let query = supabase
        .from('documents')
        .select(`
          *,
          client:clients!documents_client_id_fkey(
            id,
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          )
        `)
        .eq('client_id', selectedClientId)
        .order('uploaded_at', { ascending: false });

      // Apply document type filtering based on active tab
      if (activeTab === 'company') {
        query = query.in('type', ['business', 'legal', 'identity']);
      } else if (activeTab === 'accounting') {
        query = query.in('type', ['financial']);
      }

      const { data: documentsData, error } = await query;

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments(documentsData || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const fetchDocumentRequests = async () => {
    if (!selectedClientId) return;

    try {
      const { data: requestsData, error } = await supabase
        .from('document_requests')
        .select(`
          *,
          client:clients!document_requests_client_id_fkey(
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          )
        `)
        .eq('client_id', selectedClientId)
        .eq('consultant_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching document requests:', error);
        return;
      }

      setDocumentRequests(requestsData || []);
    } catch (err) {
      console.error('Error fetching document requests:', err);
    }
  };

  const calculateDocumentStats = async () => {
    if (!selectedClientId) return;

    try {
      const [
        { count: receivedCount },
        { count: expectedCount },
        { count: overdueCount }
      ] = await Promise.all([
        supabase.from('documents').select('*', { count: 'exact', head: true }).eq('client_id', selectedClientId),
        supabase.from('document_requests').select('*', { count: 'exact', head: true }).eq('client_id', selectedClientId),
        supabase.from('document_requests').select('*', { count: 'exact', head: true }).eq('client_id', selectedClientId).lt('due_date', new Date().toISOString()).eq('status', 'pending')
      ]);

      const { count: approvedCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', selectedClientId)
        .eq('status', 'approved');

      const approvalRate = receivedCount > 0 ? ((approvedCount || 0) / receivedCount) * 100 : 0;

      setDocumentStats({
        received: receivedCount || 0,
        expected: expectedCount || 0,
        overdue: overdueCount || 0,
        approval_rate: approvalRate
      });
    } catch (err) {
      console.error('Error calculating document stats:', err);
    }
  };

  const handleClientSelection = (clientId: string) => {
    setSelectedClientId(clientId === 'none' ? null : clientId);
  };

  const handleCreateRequest = async () => {
    if (!newRequest.title.trim() || !newRequest.client_id) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('document_requests')
        .insert({
          client_id: newRequest.client_id,
          consultant_id: user?.id,
          title: newRequest.title,
          description: newRequest.description,
          document_type: newRequest.document_type,
          priority: newRequest.priority,
          due_date: newRequest.due_date || null,
          status: 'pending'
        });

      if (error) {
        throw error;
      }

      // Notify client
      await supabase.functions.invoke('notify', {
        body: {
          recipient_id: clients.find(c => c.id === newRequest.client_id)?.profile_id,
          type: 'document_requested',
          payload: {
            document_type: newRequest.document_type,
            title: newRequest.title,
            consultant_name: profile?.full_name,
            due_date: newRequest.due_date
          },
          email_notification: true
        }
      });

      alert('Document request sent successfully!');
      setShowRequestModal(false);
      setNewRequest({
        client_id: '',
        title: '',
        description: '',
        document_type: 'financial',
        priority: 'medium',
        due_date: ''
      });

      if (selectedClientId) {
        fetchDocumentRequests();
        calculateDocumentStats();
      }
    } catch (err) {
      console.error('Error creating document request:', err);
      alert('Failed to create document request');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'rejected': return <X className="w-5 h-5 text-red-600" />;
      case 'needs_revision': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs_revision': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial': return <Calculator className="w-5 h-5 text-green-600" />;
      case 'business': return <Building className="w-5 h-5 text-blue-600" />;
      case 'legal': return <FileText className="w-5 h-5 text-purple-600" />;
      case 'identity': return <User className="w-5 h-5 text-orange-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAccountingTypeIcon = (category: string) => {
    switch (category) {
      case 'invoice': return <Receipt className="w-5 h-5 text-green-600" />;
      case 'receipt': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'bank_statement': return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'tax_document': return <Calculator className="w-5 h-5 text-red-600" />;
      default: return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case 'financial': return 'Financial/Accounting';
      case 'business': return 'Business';
      case 'legal': return 'Legal';
      case 'identity': return 'Identity';
      default: return 'Other';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredRequests = documentRequests.filter(req => {
    const matchesSearch = 
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.document_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const selectedClient = clients.find(c => c.id === selectedClientId);

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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-1">
              {selectedClient 
                ? `Managing documents for ${selectedClient.profile.full_name}${selectedClient.company_name ? ` (${selectedClient.company_name})` : ''}`
                : 'Select a client to manage their documents and requests'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                setNewRequest(prev => ({ ...prev, client_id: selectedClientId || '' }));
                setShowRequestModal(true);
              }}
              disabled={!selectedClientId}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Request Document
            </button>
            <button 
              onClick={() => setShowBulkRequest(true)}
              disabled={!selectedClientId}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              Bulk Request
            </button>
            <button 
              onClick={() => selectedClientId && fetchDocuments()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* CRITICAL: Client Selection - Must select client first */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Select Client</h2>
            <span className="text-sm text-gray-500">
              {clients.length} active clients
            </span>
          </div>
          
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedClientId || 'none'}
              onChange={(e) => handleClientSelection(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="none">🔍 Select a client to view their documents...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.profile.full_name}
                  {client.company_name && ` (${client.company_name})`}
                  {client.document_count !== undefined && ` • ${client.document_count} documents`}
                </option>
              ))}
            </select>
          </div>

          {selectedClient && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">{selectedClient.profile.full_name}</h3>
                  <p className="text-sm text-blue-700">{selectedClient.profile.email}</p>
                  <div className="flex items-center space-x-4 text-sm text-blue-600 mt-1">
                    <span>{selectedClient.company_name || 'No company name'}</span>
                    <span>•</span>
                    <span>{selectedClient.document_count || 0} documents total</span>
                    {selectedClient.last_document_date && (
                      <>
                        <span>•</span>
                        <span>Last upload: {new Date(selectedClient.last_document_date).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CRITICAL: Show content only when client is selected */}
        {selectedClientId ? (
          <>
            {/* Document Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Received Documents</p>
                    <p className="text-3xl font-bold text-blue-600">{documentStats.received}</p>
                    <p className="text-xs text-gray-500">Total uploaded</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Expected Documents</p>
                    <p className="text-3xl font-bold text-yellow-600">{documentStats.expected}</p>
                    <p className="text-xs text-gray-500">Pending requests</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-3xl font-bold text-red-600">{documentStats.overdue}</p>
                    <p className="text-xs text-gray-500">Need follow-up</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                    <p className="text-3xl font-bold text-green-600">{documentStats.approval_rate.toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">Document quality</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* CRITICAL: New Document Type Tabs (Company vs Accounting) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { 
                      id: 'all', 
                      name: 'All Documents', 
                      icon: FileText, 
                      count: documents.length,
                      description: 'All document types'
                    },
                    { 
                      id: 'company', 
                      name: 'Company Documents', 
                      icon: Building, 
                      count: documents.filter(d => ['business', 'legal', 'identity'].includes(d.type)).length,
                      description: 'Business, legal & identity docs'
                    },
                    { 
                      id: 'accounting', 
                      name: 'Accounting Documents', 
                      icon: Calculator, 
                      count: documents.filter(d => d.type === 'financial').length,
                      description: 'Financial & accounting docs'
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors group ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Received vs Expected Documents Tabs */}
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setDocumentTab('received')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      documentTab === 'received'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Received Documents ({documentStats.received})</span>
                  </button>
                  <button
                    onClick={() => setDocumentTab('expected')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      documentTab === 'expected'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Expected Documents ({documentStats.expected})</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              {documentTab === 'received' && (
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
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="needs_revision">Needs Revision</option>
                    </select>
                    {activeTab === 'all' && (
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Types</option>
                        <option value="financial">Financial</option>
                        <option value="business">Business</option>
                        <option value="legal">Legal</option>
                        <option value="identity">Identity</option>
                        <option value="other">Other</option>
                      </select>
                    )}
                  </div>
                </div>
              )}

              {/* Document Content */}
              <div className="p-6">
                {documentTab === 'received' ? (
                  // Received Documents
                  filteredDocuments.length > 0 ? (
                    <div className="space-y-4">
                      {filteredDocuments.map((doc) => (
                        <div key={doc.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              {activeTab === 'accounting' ? getAccountingTypeIcon(doc.category || '') : getTypeIcon(doc.type)}
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                                  <span>Type: {getDocumentTypeLabel(doc.type)}</span>
                                  {doc.category && (
                                    <>
                                      <span>•</span>
                                      <span>Category: {doc.category}</span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span>Uploaded: {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString() : new Date(doc.created_at).toLocaleDateString()}</span>
                                  {doc.file_size && (
                                    <>
                                      <span>•</span>
                                      <span>{(doc.file_size / 1024).toFixed(0)} KB</span>
                                    </>
                                  )}
                                </div>
                                {doc.notes && (
                                  <p className="text-sm text-gray-600 mt-2">{doc.notes}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                                {doc.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 mt-4">
                            {doc.file_url && (
                              <>
                                <button 
                                  onClick={() => window.open(doc.file_url!, '_blank')}
                                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Document
                                </button>
                                <button 
                                  onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = doc.file_url!;
                                    a.download = doc.name;
                                    a.click();
                                  }}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </button>
                              </>
                            )}
                            
                            {doc.status === 'uploaded' && (
                              <>
                                <button 
                                  onClick={() => {
                                    // Mock approval functionality
                                    alert('Document approved successfully!');
                                  }}
                                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </button>
                                <button 
                                  onClick={() => {
                                    // Mock revision request functionality
                                    const notes = prompt('Enter revision notes:');
                                    if (notes) {
                                      alert(`Revision requested: ${notes}`);
                                    }
                                  }}
                                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Request Revision
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      {activeTab === 'accounting' ? (
                        <>
                          <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Accounting Documents</h3>
                          <p className="text-gray-600 mb-6">
                            {selectedClient.profile.full_name} hasn't uploaded any financial/accounting documents yet.
                          </p>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                            <h4 className="text-sm font-semibold text-green-900 mb-2">📊 Accounting Documents Include:</h4>
                            <ul className="text-xs text-green-800 text-left space-y-1">
                              <li>• Invoices (sales receipts)</li>
                              <li>• Expense receipts</li>
                              <li>• Bank statements</li>
                              <li>• Tax documents</li>
                              <li>• Financial reports</li>
                            </ul>
                          </div>
                        </>
                      ) : activeTab === 'company' ? (
                        <>
                          <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Company Documents</h3>
                          <p className="text-gray-600 mb-6">
                            {selectedClient.profile.full_name} hasn't uploaded any company documents yet.
                          </p>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">🏢 Company Documents Include:</h4>
                            <ul className="text-xs text-blue-800 text-left space-y-1">
                              <li>• Business registration certificates</li>
                              <li>• Legal contracts & agreements</li>
                              <li>• Identity documents (passport, ID)</li>
                              <li>• Corporate resolutions</li>
                              <li>• Licensing documents</li>
                            </ul>
                          </div>
                        </>
                      ) : (
                        <>
                          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
                          <p className="text-gray-600 mb-6">
                            {selectedClient.profile.full_name} hasn't uploaded any documents yet.
                          </p>
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-md mx-auto">
                            <h4 className="text-sm font-semibold text-purple-900 mb-2">📋 Next Steps:</h4>
                            <ul className="text-xs text-purple-800 text-left space-y-1">
                              <li>• Request specific documents from client</li>
                              <li>• Set due dates and priorities</li>
                              <li>• Send automatic reminders</li>
                              <li>• Review and approve submissions</li>
                            </ul>
                          </div>
                        </>
                      )}
                      <button 
                        onClick={() => {
                          setNewRequest(prev => ({ ...prev, client_id: selectedClientId || '' }));
                          setShowRequestModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-6"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Request Documents
                      </button>
                    </div>
                  )
                ) : (
                  // Expected Documents
                  filteredRequests.length > 0 ? (
                    <div className="space-y-4">
                      {filteredRequests.map((request) => (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Clock className="w-5 h-5 text-yellow-600 mt-1" />
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                                  <span>Type: {request.document_type}</span>
                                  <span>•</span>
                                  <span>Priority: {request.priority}</span>
                                  <span>•</span>
                                  <span>Requested: {new Date(request.created_at).toLocaleDateString()}</span>
                                  {request.due_date && (
                                    <>
                                      <span>•</span>
                                      <span>Due: {new Date(request.due_date).toLocaleDateString()}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'uploaded' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3 mt-4">
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              <Bell className="w-4 h-4 mr-2" />
                              Send Reminder
                            </button>
                            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              <Calendar className="w-4 h-4 mr-2" />
                              Update Due Date
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Document Requests</h3>
                      <p className="text-gray-600 mb-6">
                        No pending document requests for {selectedClient.profile.full_name}
                      </p>
                      <button 
                        onClick={() => {
                          setNewRequest(prev => ({ ...prev, client_id: selectedClientId || '' }));
                          setShowRequestModal(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Request Documents
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        ) : (
          // CRITICAL: Empty state when no client is selected
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Management Center</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Select a client from the dropdown above to view their documents, manage requests, 
              and track submission progress.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                <Building className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-blue-900 mb-2">Company Documents</h3>
                <p className="text-xs text-blue-800">
                  Business registration, legal contracts, identity documents
                </p>
              </div>
              
              <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                <Calculator className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-900 mb-2">Accounting Documents</h3>
                <p className="text-xs text-green-800">
                  Invoices, receipts, bank statements, tax documents
                </p>
              </div>
              
              <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                <Target className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-purple-900 mb-2">Request Management</h3>
                <p className="text-xs text-purple-800">
                  Send document requests with due dates and reminders
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">💡 Document Management Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>AI-powered document categorization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>Automatic reminder system</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Bulk document requests</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-orange-600" />
                  <span>Document analytics & insights</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Document Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Document</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Bank Statement - January 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    value={newRequest.document_type}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, document_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="financial">Financial/Accounting</option>
                    <option value="business">Business</option>
                    <option value="legal">Legal</option>
                    <option value="identity">Identity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newRequest.due_date}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, due_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRequest.description}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Additional details about the requested document..."
                  />
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
                  onClick={handleCreateRequest}
                  disabled={!newRequest.title.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4 mr-2 inline" />
                  Send Request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Management Guidelines */}
        {selectedClientId && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Document Management Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Document Types</h4>
                    <p className="text-sm text-gray-600">
                      Use specific document types (Identity, Business, Financial, Legal) to help 
                      clients understand exactly what's needed.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Due Date Planning</h4>
                    <p className="text-sm text-gray-600">
                      Set realistic due dates considering client time zones and document 
                      complexity. Allow extra time for international clients.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                    <Bell className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Automatic Reminders</h4>
                    <p className="text-sm text-gray-600">
                      System automatically sends reminders for overdue documents. You can 
                      also send manual reminders when needed.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Quality Review</h4>
                    <p className="text-sm text-gray-600">
                      Review submitted documents promptly. Use approval system to maintain 
                      document quality standards.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mt-0.5">
                    <Users className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Bulk Operations</h4>
                    <p className="text-sm text-gray-600">
                      Use bulk request feature to efficiently request same documents 
                      from multiple clients simultaneously.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mt-0.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Overdue Follow-up</h4>
                    <p className="text-sm text-gray-600">
                      Monitor overdue documents daily. Quick follow-up helps maintain project 
                      timelines and client satisfaction.
                    </p>
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

export default ConsultantDocuments;