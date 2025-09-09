import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  FileText, 
  Plus, 
  Search,
  Filter,
  Calendar,
  User,
  Building,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  Edit,
  Trash2,
  Eye,
  Send,
  Bell,
  Download,
  Upload,
  Target,
  BarChart3,
  TrendingUp,
  Award,
  MessageSquare,
  RefreshCw,
  Archive,
  Users
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
  notes?: string;
  uploaded_at: string;
  created_at: string;
  client: {
    id: string;
    profile: {
      full_name: string;
    };
    company_name?: string;
  };
}

interface ExpectedDocument {
  id: string;
  client_id: string;
  consultant_id: string;
  document_type: string;
  due_date: string;
  is_submitted: boolean;
  submitted_at?: string;
  document_id?: string;
  reminder_sent: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  client: {
    profile: {
      full_name: string;
    };
    company_name?: string;
  };
  document?: {
    name: string;
    file_url: string;
  };
}

interface Client {
  id: string;
  profile: {
    full_name: string;
  };
  company_name?: string;
}

const ConsultantDocuments = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [expectedDocuments, setExpectedDocuments] = useState<ExpectedDocument[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [showExpectedDocForm, setShowExpectedDocForm] = useState(false);
  const [editingExpectedDoc, setEditingExpectedDoc] = useState<ExpectedDocument | null>(null);
  const [newExpectedDoc, setNewExpectedDoc] = useState({
    client_id: '',
    document_type: '',
    due_date: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  // Bulk document requests state
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showBulkDocumentRequest, setShowBulkDocumentRequest] = useState(false);
  const [bulkDocumentData, setBulkDocumentData] = useState({
    document_type: '',
    due_date: '',
    notes: '',
    send_reminders: true
  });
  const [creatingBulkRequests, setCreatingBulkRequests] = useState(false);

  const documentTypes = [
    'identity',
    'business', 
    'financial',
    'legal',
    'other'
  ];

  const documentTypeLabels = {
    'identity': '🆔 Identity Documents',
    'business': '🏢 Business Documents', 
    'financial': '💰 Financial Records',
    'legal': '⚖️ Legal Documents',
    'other': '📄 Other Documents'
  };

  useEffect(() => {
    if (user && profile) {
      fetchData();
    }
  }, [user, profile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchDocuments(),
        fetchExpectedDocuments(),
        fetchClients()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const { data: docsData, error } = await supabase
        .from('documents')
        .select(`
          *,
          client:clients!documents_client_id_fkey(
            id,
            company_name,
            profile:user_profiles!clients_profile_id_fkey(full_name)
          )
        `)
        .eq('consultant_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments(docsData || []);
    } catch (err) {
      console.error('Unexpected error fetching documents:', err);
    }
  };

  const fetchExpectedDocuments = async () => {
    try {
      const { data: expectedData, error } = await supabase
        .from('expected_documents')
        .select(`
          *,
          client:clients!expected_documents_client_id_fkey(
            profile:user_profiles!clients_profile_id_fkey(full_name),
            company_name
          ),
          document:documents(name, file_url)
        `)
        .eq('consultant_id', user?.id)
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Error fetching expected documents:', error);
        return;
      }

      setExpectedDocuments(expectedData || []);
    } catch (err) {
      console.error('Unexpected error fetching expected documents:', err);
    }
  };

  const fetchClients = async () => {
    try {
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          id,
          company_name,
          profile:user_profiles!clients_profile_id_fkey(full_name)
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
      console.error('Unexpected error fetching clients:', err);
    }
  };

  const handleCreateExpectedDocument = async () => {
    if (!newExpectedDoc.client_id || !newExpectedDoc.document_type || !newExpectedDoc.due_date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('expected_documents')
        .insert({
          client_id: newExpectedDoc.client_id,
          consultant_id: user?.id,
          document_type: newExpectedDoc.document_type,
          due_date: newExpectedDoc.due_date,
          notes: newExpectedDoc.notes || null,
          is_submitted: false,
          reminder_sent: false
        });

      if (error) {
        throw error;
      }

      // Create notification for client
      const client = clients.find(c => c.id === newExpectedDoc.client_id);
      if (client) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: client.profile.full_name, // Should be profile_id in real implementation
            type: 'document_requested',
            payload: {
              document_type: newExpectedDoc.document_type,
              due_date: newExpectedDoc.due_date,
              consultant_name: profile?.full_name,
              notes: newExpectedDoc.notes
            },
            email_notification: true
          }
        });
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'document_requested',
          description: `Requested ${newExpectedDoc.document_type} document from ${client?.profile?.full_name}`,
          payload: {
            client_id: newExpectedDoc.client_id,
            document_type: newExpectedDoc.document_type,
            due_date: newExpectedDoc.due_date
          }
        });

      alert('Document request created successfully!');
      setShowExpectedDocForm(false);
      setEditingExpectedDoc(null);
      setNewExpectedDoc({
        client_id: '',
        document_type: '',
        due_date: '',
        notes: ''
      });
      fetchExpectedDocuments();
    } catch (err) {
      console.error('Error creating expected document:', err);
      alert('Failed to create document request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateExpectedDocument = async () => {
    if (!editingExpectedDoc) return;

    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('expected_documents')
        .update({
          document_type: newExpectedDoc.document_type,
          due_date: newExpectedDoc.due_date,
          notes: newExpectedDoc.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingExpectedDoc.id);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'expected_document_updated',
          description: `Updated document request: ${newExpectedDoc.document_type}`,
          payload: {
            expected_doc_id: editingExpectedDoc.id,
            document_type: newExpectedDoc.document_type,
            due_date: newExpectedDoc.due_date
          }
        });

      alert('Document request updated successfully!');
      setShowExpectedDocForm(false);
      setEditingExpectedDoc(null);
      setNewExpectedDoc({
        client_id: '',
        document_type: '',
        due_date: '',
        notes: ''
      });
      fetchExpectedDocuments();
    } catch (err) {
      console.error('Error updating expected document:', err);
      alert('Failed to update document request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpectedDocument = async (expectedDocId: string) => {
    if (!confirm('Are you sure you want to delete this document request?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('expected_documents')
        .delete()
        .eq('id', expectedDocId);

      if (error) {
        throw error;
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'expected_document_deleted',
          description: 'Deleted document request',
          payload: { expected_doc_id: expectedDocId }
        });

      alert('Document request deleted successfully!');
      fetchExpectedDocuments();
    } catch (err) {
      console.error('Error deleting expected document:', err);
      alert('Failed to delete document request. Please try again.');
    }
  };

  const handleSendReminder = async (expectedDocId: string) => {
    try {
      setSendingReminder(expectedDocId);

      const expectedDoc = expectedDocuments.find(ed => ed.id === expectedDocId);
      if (!expectedDoc) return;

      // Update reminder_sent flag
      const { error: updateError } = await supabase
        .from('expected_documents')
        .update({
          reminder_sent: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', expectedDocId);

      if (updateError) {
        throw updateError;
      }

      // Send notification to client
      await supabase.functions.invoke('notify', {
        body: {
          recipient_id: expectedDoc.client.profile.full_name, // Should be profile_id
          type: 'document_reminder',
          payload: {
            document_type: expectedDoc.document_type,
            due_date: expectedDoc.due_date,
            consultant_name: profile?.full_name,
            notes: expectedDoc.notes
          },
          email_notification: true
        }
      });

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'document_reminder_sent',
          description: `Sent reminder for ${expectedDoc.document_type} to ${expectedDoc.client.profile.full_name}`,
          payload: {
            expected_doc_id: expectedDocId,
            client_id: expectedDoc.client_id,
            document_type: expectedDoc.document_type
          }
        });

      alert('Reminder sent successfully!');
      fetchExpectedDocuments();
    } catch (err) {
      console.error('Error sending reminder:', err);
      alert('Failed to send reminder. Please try again.');
    } finally {
      setSendingReminder(null);
    }
  };

  const handleBulkDocumentRequest = async () => {
    if (!bulkDocumentData.document_type || !bulkDocumentData.due_date || selectedClients.length === 0) {
      alert('Please fill in all required fields and select at least one client');
      return;
    }

    try {
      setCreatingBulkRequests(true);

      // Create document request for each selected client
      const requestInserts = selectedClients.map(clientId => ({
        client_id: clientId,
        consultant_id: user?.id,
        document_type: bulkDocumentData.document_type,
        due_date: bulkDocumentData.due_date,
        notes: bulkDocumentData.notes || null,
        is_submitted: false,
        reminder_sent: false
      }));

      const { error } = await supabase
        .from('expected_documents')
        .insert(requestInserts);

      if (error) throw error;

      // Send notifications to all clients
      const notificationPromises = selectedClients.map(async (clientId) => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
          await supabase.functions.invoke('notify', {
            body: {
              recipient_id: client.profile.full_name, // Should be profile_id
              type: 'bulk_document_requested',
              payload: {
                document_type: bulkDocumentData.document_type,
                due_date: bulkDocumentData.due_date,
                consultant_name: profile?.full_name,
                notes: bulkDocumentData.notes
              },
              email_notification: bulkDocumentData.send_reminders
            }
          });
        }
      });

      await Promise.all(notificationPromises);

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'bulk_document_request_created',
          description: `Created bulk document request for ${selectedClients.length} clients`,
          payload: {
            document_type: bulkDocumentData.document_type,
            due_date: bulkDocumentData.due_date,
            client_count: selectedClients.length,
            client_ids: selectedClients
          }
        });

      alert(`Document requests sent to ${selectedClients.length} clients successfully!`);
      setShowBulkDocumentRequest(false);
      setSelectedClients([]);
      setBulkDocumentData({
        document_type: '',
        due_date: '',
        notes: '',
        send_reminders: true
      });
      fetchExpectedDocuments();
    } catch (err) {
      console.error('Bulk document request error:', err);
      alert('Failed to create bulk document requests. Please try again.');
    } finally {
      setCreatingBulkRequests(false);
    }
  };

  const handleClientSelection = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const loadExpectedDocForEdit = (expectedDoc: ExpectedDocument) => {
    setEditingExpectedDoc(expectedDoc);
    setNewExpectedDoc({
      client_id: expectedDoc.client_id,
      document_type: expectedDoc.document_type,
      due_date: expectedDoc.due_date,
      notes: expectedDoc.notes || ''
    });
    setShowExpectedDocForm(true);
  };

  const resetForm = () => {
    setNewExpectedDoc({
      client_id: '',
      document_type: '',
      due_date: '',
      notes: ''
    });
    setEditingExpectedDoc(null);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
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

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'identity': return '🆔';
      case 'business': return '🏢';
      case 'financial': return '💰';
      case 'legal': return '⚖️';
      default: return '📄';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesClient = clientFilter === 'all' || doc.client.id === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  });

  const filteredExpectedDocuments = expectedDocuments.filter(expectedDoc => {
    const matchesSearch = 
      expectedDoc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expectedDoc.client?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'submitted' && expectedDoc.is_submitted) ||
      (statusFilter === 'pending' && !expectedDoc.is_submitted);
    
    const matchesClient = clientFilter === 'all' || expectedDoc.client_id === clientFilter;
    
    return matchesSearch && matchesStatus && matchesClient;
  });

  const documentStats = {
    total: documents.length,
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length,
    needsRevision: documents.filter(d => d.status === 'needs_revision').length
  };

  const expectedDocStats = {
    total: expectedDocuments.length,
    submitted: expectedDocuments.filter(ed => ed.is_submitted).length,
    pending: expectedDocuments.filter(ed => !ed.is_submitted).length,
    overdue: expectedDocuments.filter(ed => !ed.is_submitted && isOverdue(ed.due_date)).length
  };

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
        <title>Document Management - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-1">Manage client documents and document requests</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={fetchData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button 
              onClick={() => {
                resetForm();
                setShowExpectedDocForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Request Document
            </button>
            <button 
              onClick={() => setShowBulkDocumentRequest(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              Bulk Request
            </button>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Received Documents</p>
                <p className="text-3xl font-bold text-gray-900">{documentStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{documentStats.approved} approved</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expected Documents</p>
                <p className="text-3xl font-bold text-yellow-600">{expectedDocStats.total}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{expectedDocStats.pending} pending</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{expectedDocStats.overdue}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Need follow-up</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {documentStats.total > 0 ? Math.round((documentStats.approved / documentStats.total) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Document quality</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'received', name: `Received Documents (${documentStats.total})`, icon: FileText },
                { id: 'expected', name: `Expected Documents (${expectedDocStats.total})`, icon: Clock },
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
            {/* Bulk Selection Bar */}
            {selectedClients.length > 0 && (
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-800">
                    {selectedClients.length} clients selected for bulk document request
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowBulkDocumentRequest(true)}
                      className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Create Bulk Request
                    </button>
                    <button
                      onClick={() => setSelectedClients([])}
                      className="px-3 py-1 text-sm text-purple-600 hover:text-purple-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                {activeTab === 'received' ? (
                  <>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="needs_revision">Needs Revision</option>
                  </>
                ) : (
                  <>
                    <option value="pending">Pending</option>
                    <option value="submitted">Submitted</option>
                  </>
                )}
              </select>
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Clients</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.profile.full_name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  const allClientIds = clients.map(c => c.id);
                  setSelectedClients(
                    selectedClients.length === allClientIds.length ? [] : allClientIds
                  );
                }}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {selectedClients.length === clients.length && clients.length > 0 ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Received Documents Tab */}
            {activeTab === 'received' && (
              <div>
                {filteredDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDocuments.map((document) => (
                      <div key={document.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="text-3xl">{getDocumentTypeIcon(document.type)}</div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>From: {document.client?.profile?.full_name}</span>
                                {document.client?.company_name && (
                                  <>
                                    <span>•</span>
                                    <span>{document.client.company_name}</span>
                                  </>
                                )}
                                <span>•</span>
                                <span>Type: {document.type}</span>
                                {document.file_size && (
                                  <>
                                    <span>•</span>
                                    <span>{Math.round(document.file_size / 1024)} KB</span>
                                  </>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
                              </div>
                              {document.notes && (
                                <p className="text-sm text-gray-600 mt-2">{document.notes}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(document.status)}`}>
                              {document.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {document.file_url && (
                            <>
                              <button 
                                onClick={() => window.open(document.file_url!, '_blank')}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Document
                              </button>
                              <button 
                                onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = document.file_url!;
                                  a.download = document.name;
                                  a.click();
                                }}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </button>
                            </>
                          )}
                          <button className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </button>
                          <button className="inline-flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            <Edit className="w-4 h-4 mr-2" />
                            Request Revision
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents</h3>
                    <p className="text-gray-600">
                      {searchTerm || statusFilter !== 'all' || clientFilter !== 'all'
                        ? 'No documents match your filters'
                        : 'No documents have been uploaded by clients yet'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Expected Documents Tab */}
            {activeTab === 'expected' && (
              <div>
                {filteredExpectedDocuments.length > 0 ? (
                  <div className="space-y-4">
                    {filteredExpectedDocuments.map((expectedDoc) => {
                      const overdue = !expectedDoc.is_submitted && isOverdue(expectedDoc.due_date);
                      const daysUntilDue = getDaysUntilDue(expectedDoc.due_date);
                      
                      return (
                        <div key={expectedDoc.id} className={`border rounded-lg p-6 ${
                          overdue ? 'border-red-300 bg-red-50' :
                          expectedDoc.is_submitted ? 'border-green-300 bg-green-50' :
                          daysUntilDue <= 3 ? 'border-orange-300 bg-orange-50' :
                          'border-gray-200 bg-white'
                        }`}>
                          {/* Document Request Selection */}
                          {!expectedDoc.is_submitted && (
                            <div className="flex items-center mb-3">
                              <input
                                type="checkbox"
                                checked={selectedClients.includes(expectedDoc.client_id)}
                                onChange={() => handleClientSelection(expectedDoc.client_id)}
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">Select for bulk actions</span>
                            </div>
                          )}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4">
                              <div className="text-3xl">{getDocumentTypeIcon(expectedDoc.document_type)}</div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {documentTypeLabels[expectedDoc.document_type as keyof typeof documentTypeLabels] || expectedDoc.document_type}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>From: {expectedDoc.client?.profile?.full_name}</span>
                                  {expectedDoc.client?.company_name && (
                                    <>
                                      <span>•</span>
                                      <span>{expectedDoc.client.company_name}</span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span>Due: {new Date(expectedDoc.due_date).toLocaleDateString()}</span>
                                </div>
                                
                                {/* Due Date Warning */}
                                <div className="flex items-center space-x-2 mt-2">
                                  {overdue ? (
                                    <span className="flex items-center text-red-600 text-sm font-medium">
                                      <AlertTriangle className="w-4 h-4 mr-1" />
                                      Overdue by {Math.abs(daysUntilDue)} days
                                    </span>
                                  ) : expectedDoc.is_submitted ? (
                                    <span className="flex items-center text-green-600 text-sm font-medium">
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Submitted on {expectedDoc.submitted_at ? new Date(expectedDoc.submitted_at).toLocaleDateString() : 'Unknown'}
                                    </span>
                                  ) : daysUntilDue <= 3 ? (
                                    <span className="flex items-center text-orange-600 text-sm font-medium">
                                      <Clock className="w-4 h-4 mr-1" />
                                      Due in {daysUntilDue} days
                                    </span>
                                  ) : (
                                    <span className="flex items-center text-gray-600 text-sm">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      {daysUntilDue} days remaining
                                    </span>
                                  )}
                                </div>
                                
                                {expectedDoc.notes && (
                                  <p className="text-sm text-gray-600 mt-2">{expectedDoc.notes}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              {expectedDoc.is_submitted ? (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                  Submitted
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {!expectedDoc.is_submitted && (
                              <>
                                <button 
                                  onClick={() => handleSendReminder(expectedDoc.id)}
                                  disabled={sendingReminder === expectedDoc.id || expectedDoc.reminder_sent}
                                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                  {sendingReminder === expectedDoc.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Sending...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-4 h-4 mr-2" />
                                      {expectedDoc.reminder_sent ? 'Send Another Reminder' : 'Send Reminder'}
                                    </>
                                  )}
                                </button>
                                {expectedDoc.reminder_sent && (
                                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                    ✓ Reminder sent
                                  </span>
                                )}
                              </>
                            )}
                            
                            <button 
                              onClick={() => loadExpectedDocForEdit(expectedDoc)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                            
                            <button 
                              onClick={() => handleDeleteExpectedDocument(expectedDoc.id)}
                              className="inline-flex items-center px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>

                            {expectedDoc.document?.file_url && (
                              <button 
                                onClick={() => window.open(expectedDoc.document.file_url, '_blank')}
                                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Submitted
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Expected Documents</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || statusFilter !== 'all' || clientFilter !== 'all'
                        ? 'No expected documents match your filters'
                        : 'Create document requests for your clients to track required submissions'
                      }
                    </p>
                    {!(searchTerm || statusFilter !== 'all' || clientFilter !== 'all') && (
                      <button 
                        onClick={() => {
                          resetForm();
                          setShowExpectedDocForm(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Document Request
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expected Document Form Modal */}
        {showExpectedDocForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingExpectedDoc ? 'Edit Document Request' : 'Create Document Request'}
                </h2>
                <button
                  onClick={() => {
                    setShowExpectedDocForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client *
                  </label>
                  <select
                    value={newExpectedDoc.client_id}
                    onChange={(e) => setNewExpectedDoc(prev => ({ ...prev, client_id: e.target.value }))}
                    disabled={!!editingExpectedDoc}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">Select client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.profile.full_name} {client.company_name && `(${client.company_name})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    value={newExpectedDoc.document_type}
                    onChange={(e) => setNewExpectedDoc(prev => ({ ...prev, document_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select document type</option>
                    {documentTypes.map(type => (
                      <option key={type} value={type}>
                        {documentTypeLabels[type as keyof typeof documentTypeLabels]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={newExpectedDoc.due_date}
                    onChange={(e) => setNewExpectedDoc(prev => ({ ...prev, due_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions/Notes
                  </label>
                  <textarea
                    value={newExpectedDoc.notes}
                    onChange={(e) => setNewExpectedDoc(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Provide specific instructions for the client about this document..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Document Request Process</h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• Client will receive email notification about the document request</li>
                    <li>• Automatic reminders will be sent if document is not submitted by due date</li>
                    <li>• You'll receive alerts when documents are overdue</li>
                    <li>• Client can upload documents through their dashboard</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowExpectedDocForm(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingExpectedDoc ? handleUpdateExpectedDocument : handleCreateExpectedDocument}
                  disabled={submitting || !newExpectedDoc.client_id || !newExpectedDoc.document_type || !newExpectedDoc.due_date}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      {editingExpectedDoc ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 inline" />
                      {editingExpectedDoc ? 'Update Request' : 'Create Request'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Document Request Modal */}
        {showBulkDocumentRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Request Documents from {selectedClients.length} Clients
                </h2>
                <button
                  onClick={() => setShowBulkDocumentRequest(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type *
                  </label>
                  <select
                    value={bulkDocumentData.document_type}
                    onChange={(e) => setBulkDocumentData(prev => ({ ...prev, document_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select document type</option>
                    {documentTypes.map(type => (
                      <option key={type} value={type}>
                        {documentTypeLabels[type as keyof typeof documentTypeLabels]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={bulkDocumentData.due_date}
                    onChange={(e) => setBulkDocumentData(prev => ({ ...prev, due_date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions/Notes
                  </label>
                  <textarea
                    value={bulkDocumentData.notes}
                    onChange={(e) => setBulkDocumentData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Common instructions for all selected clients..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={bulkDocumentData.send_reminders}
                    onChange={(e) => setBulkDocumentData(prev => ({ ...prev, send_reminders: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">Send email reminders to clients</span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Bulk Request Details</h4>
                  <div className="text-xs text-blue-800 space-y-1">
                    <div>• Document Type: {bulkDocumentData.document_type ? documentTypeLabels[bulkDocumentData.document_type as keyof typeof documentTypeLabels] : 'Not selected'}</div>
                    <div>• Due Date: {bulkDocumentData.due_date || 'Not set'}</div>
                    <div>• Selected Clients: {selectedClients.length}</div>
                    <div>• Email Notifications: {bulkDocumentData.send_reminders ? 'Enabled' : 'Disabled'}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => setShowBulkDocumentRequest(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkDocumentRequest}
                  disabled={creatingBulkRequests || !bulkDocumentData.document_type || !bulkDocumentData.due_date || selectedClients.length === 0}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {creatingBulkRequests ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 inline" />
                      Create for {selectedClients.length} Clients
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Document Management Guidelines */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Document Management Guidelines</h3>
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
                  <Bell className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Automatic Reminders</h4>
                  <p className="text-sm text-gray-600">
                    System automatically sends reminders for overdue documents. 
                    You can also send manual reminders when needed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Clear Instructions</h4>
                  <p className="text-sm text-gray-600">
                    Provide specific instructions in the notes field to help clients 
                    understand format requirements and submission guidelines.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
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
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Overdue Follow-up</h4>
                  <p className="text-sm text-gray-600">
                    Monitor overdue documents daily. Quick follow-up helps maintain 
                    project timelines and client satisfaction.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quality Review</h4>
                  <p className="text-sm text-gray-600">
                    Review submitted documents promptly. Use approval/revision system 
                    to maintain document quality standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantDocuments;