import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter,
  Plus, 
  Download, 
  Check, 
  X, 
  MessageSquare, 
  Upload,
  Eye,
  MoreVertical,
  Calendar,
  User,
  FileText,
  AlertCircle,
  Clock,
  Archive,
  RefreshCw
} from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';
import { Helmet } from 'react-helmet-async';

interface Document {
  id: string;
  name: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  status: string;
  tags: string[];
  uploaded_by: string;
  reviewed_at: string | null;
  review_notes: string | null;
  version: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  client: {
    id: string;
    company_name: string;
    profile: {
      full_name: string;
    };
  };
  category: {
    name: string;
    color: string;
  } | null;
  request: {
    title: string;
    due_date: string;
    priority: string;
  } | null;
}

interface DocumentRequest {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
  status: string;
  client: {
    company_name: string;
    profile: {
      full_name: string;
    };
  };
}

interface BulkAction {
  type: 'approve' | 'reject' | 'archive' | 'delete';
  reason?: string;
}

const ConsultantDocuments = () => {
  const { user } = useAuth();
  const { t, formatDate, formatRelativeTime } = useI18n();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchDocumentRequests();
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          client:clients(
            id,
            company_name,
            profile:user_profiles(full_name)
          ),
          category:document_categories(name, color),
          request:document_requests(title, due_date, priority)
        `)
        .eq('consultant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
      } else {
        setDocuments(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('document_requests')
        .select(`
          *,
          client:clients(
            company_name,
            profile:user_profiles(full_name)
          )
        `)
        .eq('consultant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching document requests:', error);
      } else {
        setDocumentRequests(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const updateDocumentStatus = async (documentId: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({
          status,
          review_notes: notes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq('id', documentId);

      if (error) {
        console.error('Error updating document:', error);
      } else {
        fetchDocuments();
        
        // Log audit action
        await supabase.rpc('log_audit_action', {
          action_type: `document_${status}`,
          resource_type: 'document',
          resource_id: documentId,
          new_values: { status, notes }
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleBulkAction = async (action: BulkAction) => {
    if (selectedDocuments.length === 0) return;

    try {
      const updates = {
        status: action.type === 'approve' ? 'approved' : action.type === 'reject' ? 'rejected' : action.type,
        review_notes: action.reason,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id,
      };

      const { error } = await supabase
        .from('documents')
        .update(updates)
        .in('id', selectedDocuments);

      if (error) {
        console.error('Error performing bulk action:', error);
      } else {
        fetchDocuments();
        setSelectedDocuments([]);
        setShowBulkActions(false);
        
        // Log bulk action
        await supabase.rpc('log_audit_action', {
          action_type: `bulk_${action.type}`,
          resource_type: 'documents',
          new_values: { document_ids: selectedDocuments, action: action.type, reason: action.reason }
        });
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const toggleDocumentSelection = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const selectAllDocuments = () => {
    setSelectedDocuments(filteredDocuments.map(doc => doc.id));
  };

  const clearSelection = () => {
    setSelectedDocuments([]);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || doc.category?.name === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || doc.request?.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded': return 'bg-blue-100 text-blue-800';
      case 'in_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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

  if (loading) {
    return (
      <ConsultantLayout>
        <Helmet>
          <title>{t('documents.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ConsultantLayout>
    );
  }

  return (
    <ConsultantLayout>
      <Helmet>
        <title>{t('documents.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('documents.title')}</h1>
            <p className="text-gray-600">Enterprise document management for your clients</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" icon={RefreshCw} onClick={() => { fetchDocuments(); fetchDocumentRequests(); }}>
              Refresh
            </Button>
            <Button icon={Plus}>
              Request Document
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'documents', label: 'Documents', icon: FileText, count: documents.length },
              { id: 'requests', label: 'Requests', icon: Clock, count: documentRequests.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Advanced Filters */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search documents, clients, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="uploaded">Uploaded</option>
                  <option value="in_review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="Identity Documents">Identity</option>
                  <option value="Financial Documents">Financial</option>
                  <option value="Business Documents">Business</option>
                  <option value="Legal Documents">Legal</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2 ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  >
                    Table
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  >
                    Grid
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedDocuments.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedDocuments.length} documents selected
                  </span>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Check}
                      onClick={() => handleBulkAction({ type: 'approve' })}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      Approve All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={X}
                      onClick={() => handleBulkAction({ type: 'reject', reason: 'Bulk rejection' })}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      Reject All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Archive}
                      onClick={() => handleBulkAction({ type: 'archive' })}
                    >
                      Archive
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div>
          {filteredDocuments.length > 0 ? (
            viewMode === 'table' ? (
              <Card>
                <Card.Body className="p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={selectedDocuments.length === filteredDocuments.length}
                              onChange={(e) => e.target.checked ? selectAllDocuments() : clearSelection()}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Document
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Uploaded
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDocuments.map((doc) => (
                          <tr key={doc.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedDocuments.includes(doc.id)}
                                onChange={() => toggleDocumentSelection(doc.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{doc.name}</p>
                                  <p className="text-sm text-gray-500">v{doc.version}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">{doc.client?.profile?.full_name}</p>
                                <p className="text-sm text-gray-500">{doc.client?.company_name}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {doc.category && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${doc.category.color}-100 text-${doc.category.color}-800`}>
                                  {doc.category.name}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                                {doc.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {formatFileSize(doc.file_size)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {formatRelativeTime(doc.created_at)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" icon={Eye}>
                                  Preview
                                </Button>
                                <Button variant="outline" size="sm" icon={Download}>
                                  Download
                                </Button>
                                {doc.status === 'uploaded' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      icon={Check}
                                      onClick={() => updateDocumentStatus(doc.id, 'approved')}
                                      className="text-green-600 border-green-600 hover:bg-green-50"
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      icon={X}
                                      onClick={() => updateDocumentStatus(doc.id, 'rejected', 'Requires revision')}
                                      className="text-red-600 border-red-600 hover:bg-red-50"
                                    >
                                      Reject
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} hover className="relative">
                    <Card.Body>
                      <div className="absolute top-4 right-4">
                        <input
                          type="checkbox"
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={() => toggleDocumentSelection(doc.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 text-center mb-2 truncate">
                        {doc.name}
                      </h3>
                      
                      <div className="text-center mb-4">
                        <p className="text-sm text-gray-600">{doc.client?.profile?.full_name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(doc.file_size)}</p>
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" icon={Eye} className="flex-1">
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" icon={Download} className="flex-1">
                          Download
                        </Button>
                      </div>
                      
                      {doc.status === 'uploaded' && (
                        <div className="flex space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Check}
                            onClick={() => updateDocumentStatus(doc.id, 'approved')}
                            className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={X}
                            onClick={() => updateDocumentStatus(doc.id, 'rejected', 'Requires revision')}
                            className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Documents Found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Documents will appear here as clients upload them'
                  }
                </p>
                <Button icon={Plus}>
                  Request Document
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div>
          {documentRequests.length > 0 ? (
            <div className="space-y-4">
              {documentRequests.map((request) => (
                <Card key={request.id}>
                  <Card.Body>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{request.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>{request.client?.profile?.full_name}</span>
                          </div>
                          {request.due_date && (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>Due: {formatDate(request.due_date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" icon={MessageSquare}>
                          Send Reminder
                        </Button>
                        <Button variant="outline" size="sm" icon={MoreVertical}>
                          More
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Document Requests
                </h3>
                <p className="text-gray-600 mb-6">
                  Create document requests to collect required files from your clients
                </p>
                <Button icon={Plus}>
                  Create Request
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </ConsultantLayout>
  );
};

export default ConsultantDocuments;