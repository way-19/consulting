import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Upload, 
  Download, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Target,
  Zap,
  RefreshCw,
  Building,
  Calculator,
  Receipt,
  CreditCard,
  Percent,
  Plus,
  X,
  Send,
  Users
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface AccountingDocument {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'bank_statement' | 'contract' | 'tax_document' | 'other';
  category: 'income' | 'expense' | 'asset' | 'liability';
  amount: number;
  currency: string;
  transaction_date: string;
  file_url?: string;
  file_size?: number;
  ai_category?: string;
  confidence_score?: number;
  status: 'uploaded' | 'processing' | 'categorized' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

interface AccountingPeriod {
  id: string;
  period_start: string;
  period_end: string;
  period_type: 'monthly' | 'quarterly' | 'yearly';
  status: 'open' | 'closed' | 'submitted' | 'approved';
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  tax_due: number;
  tax_paid: number;
  document_count: number;
  currency: string;
}

interface FinancialSummary {
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  profit_margin: number;
  tax_efficiency: number;
  monthly_growth: number;
  expense_ratio: number;
  revenue_trend: 'up' | 'down' | 'stable';
}

interface Client {
  id: string;
  profile: {
    full_name: string;
  };
}

interface Project {
  id: string;
  title: string;
}

const ConsultantTasks = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<AccountingDocument[]>([]);
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    total_revenue: 0,
    total_expenses: 0,
    net_profit: 0,
    profit_margin: 0,
    tax_efficiency: 0,
    monthly_growth: 0,
    expense_ratio: 0,
    revenue_trend: 'stable'
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [generatingReport, setGeneratingReport] = useState(false);

  // Modal states
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showBulkCreateModal, setShowBulkCreateModal] = useState(false);

  // Create Task Form
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    client_id: '',
    project_id: '',
    priority: 'medium',
    due_date: '',
    estimated_hours: 1,
    billable: true,
    is_client_visible: true
  });

  // Bulk Create Form
  const [bulkTask, setBulkTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    estimated_hours: 1,
    billable: true,
    is_client_visible: true,
    selected_clients: [] as string[]
  });

  const [creatingTask, setCreatingTask] = useState(false);
  const [creatingBulkTasks, setCreatingBulkTasks] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchAccountingData();
      fetchClients();
      fetchProjects();
    }
  }, [user, profile, selectedPeriod]);

  const fetchClients = async () => {
    try {
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          id,
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

  const fetchProjects = async () => {
    try {
      const { data: projectsData, error } = await supabase
        .from('projects')
        .select('id, title')
        .eq('consultant_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(projectsData || []);
    } catch (err) {
      console.error('Unexpected error fetching projects:', err);
    }
  };

  const fetchAccountingData = async () => {
    try {
      setLoading(true);
      
      // Get consultant's clients for accounting data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('assigned_consultant_id', user?.id)
        .limit(1);

      // For demo purposes, we use mock data regardless of client assignment
      // In production, you would process real client accounting data here

      // Fetch payment data including new fee types
      if (clientData && clientData.length > 0) {
        await fetchPaymentData(clientData[0].id);
      }

      // Mock data for demonstration
      const mockDocuments: AccountingDocument[] = [
        {
          id: '1',
          name: 'January Sales Invoice #001',
          type: 'invoice',
          category: 'income',
          amount: 5420.00,
          currency: 'USD',
          transaction_date: '2025-01-15',
          ai_category: 'Professional Services Revenue',
          confidence_score: 95,
          status: 'categorized',
          created_at: '2025-01-15T10:00:00Z',
          updated_at: '2025-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Office Rent Receipt',
          type: 'receipt',
          category: 'expense',
          amount: 1200.00,
          currency: 'USD',
          transaction_date: '2025-01-01',
          ai_category: 'Office & Administrative Expenses',
          confidence_score: 98,
          status: 'approved',
          created_at: '2025-01-01T09:00:00Z',
          updated_at: '2025-01-01T09:00:00Z'
        },
        {
          id: '3',
          name: 'Bank Statement - January',
          type: 'bank_statement',
          category: 'asset',
          amount: 15620.00,
          currency: 'USD',
          transaction_date: '2025-01-31',
          ai_category: 'Cash & Bank Accounts',
          confidence_score: 99,
          status: 'categorized',
          created_at: '2025-01-31T23:59:00Z',
          updated_at: '2025-01-31T23:59:00Z'
        }
      ];

      const mockPeriods: AccountingPeriod[] = [
        {
          id: '1',
          period_start: '2025-01-01',
          period_end: '2025-01-31',
          period_type: 'monthly',
          status: 'open',
          total_revenue: 15420.00,
          total_expenses: 3250.00,
          net_profit: 12170.00,
          tax_due: 487.00,
          tax_paid: 487.00,
          document_count: 8,
          currency: 'USD'
        }
      ];

      const mockSummary: FinancialSummary = {
        total_revenue: 15420.00,
        total_expenses: 3250.00,
        net_profit: 12170.00,
        profit_margin: 78.9,
        tax_efficiency: 96.8,
        monthly_growth: 12.5,
        expense_ratio: 21.1,
        revenue_trend: 'up'
      };

      setDocuments(mockDocuments);
      setPeriods(mockPeriods);
      setFinancialSummary(mockSummary);

    } catch (err) {
      console.error('Error fetching accounting data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim() || !newTask.client_id) {
      alert('Please fill in required fields');
      return;
    }

    try {
      setCreatingTask(true);

      const { error } = await supabase
        .from('tasks')
        .insert({
          consultant_id: user?.id,
          client_id: newTask.client_id,
          project_id: newTask.project_id || null,
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          due_date: newTask.due_date || null,
          estimated_hours: newTask.estimated_hours,
          billable: newTask.billable,
          is_client_visible: newTask.is_client_visible,
          status: 'todo'
        });

      if (error) {
        throw error;
      }

      alert('Task created successfully!');
      setShowCreateTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        client_id: '',
        project_id: '',
        priority: 'medium',
        due_date: '',
        estimated_hours: 1,
        billable: true,
        is_client_visible: true
      });
      
      // Refresh page data if needed
      fetchAccountingData();
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task. Please try again.');
    } finally {
      setCreatingTask(false);
    }
  };

  const handleBulkCreateTasks = async () => {
    if (!bulkTask.title.trim() || bulkTask.selected_clients.length === 0) {
      alert('Please fill in title and select at least one client');
      return;
    }

    try {
      setCreatingBulkTasks(true);

      const tasks = bulkTask.selected_clients.map(clientId => ({
        consultant_id: user?.id,
        client_id: clientId,
        title: bulkTask.title,
        description: bulkTask.description,
        priority: bulkTask.priority,
        due_date: bulkTask.due_date || null,
        estimated_hours: bulkTask.estimated_hours,
        billable: bulkTask.billable,
        is_client_visible: bulkTask.is_client_visible,
        status: 'todo'
      }));

      const { error } = await supabase
        .from('tasks')
        .insert(tasks);

      if (error) {
        throw error;
      }

      alert(`${tasks.length} tasks created successfully!`);
      setShowBulkCreateModal(false);
      setBulkTask({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        estimated_hours: 1,
        billable: true,
        is_client_visible: true,
        selected_clients: []
      });
      
      // Refresh page data if needed
      fetchAccountingData();
    } catch (err) {
      console.error('Error creating bulk tasks:', err);
      alert('Failed to create tasks. Please try again.');
    } finally {
      setCreatingBulkTasks(false);
    }
  };

  const handleClientToggle = (clientId: string) => {
    setBulkTask(prev => ({
      ...prev,
      selected_clients: prev.selected_clients.includes(clientId)
        ? prev.selected_clients.filter(id => id !== clientId)
        : [...prev.selected_clients, clientId]
    }));
  };

  const handleSelectAllClients = () => {
    setBulkTask(prev => ({
      ...prev,
      selected_clients: prev.selected_clients.length === clients.length ? [] : clients.map(c => c.id)
    }));
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    try {
      setUploading(true);
      
      const file = files[0];
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF, JPG, PNG, XLSX, and CSV files are allowed');
        return;
      }

      // Simulate file upload and AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI categorization
      const aiCategory = file.name.toLowerCase().includes('invoice') ? 'Professional Services Revenue' :
                       file.name.toLowerCase().includes('receipt') ? 'Business Expenses' :
                       file.name.toLowerCase().includes('bank') ? 'Cash & Bank Accounts' :
                       'Miscellaneous';

      const newDoc: AccountingDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: file.name.toLowerCase().includes('invoice') ? 'invoice' : 'receipt',
        category: file.name.toLowerCase().includes('invoice') ? 'income' : 'expense',
        amount: Math.random() * 5000 + 100,
        currency: 'USD',
        transaction_date: new Date().toISOString().split('T')[0],
        ai_category: aiCategory,
        confidence_score: Math.floor(Math.random() * 20) + 80,
        status: 'categorized',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setDocuments(prev => [newDoc, ...prev]);
      alert('Document uploaded and automatically categorized by AI!');
      
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const generateFinancialReport = async (reportType: string) => {
    try {
      setGeneratingReport(true);
      
      // Mock report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock download
      const reportContent = `
Financial Report - ${reportType.toUpperCase()}
=====================================

Period: ${periods[0]?.period_start} to ${periods[0]?.period_end}
Generated: ${new Date().toLocaleDateString()}

SUMMARY:
- Total Revenue: $${financialSummary.total_revenue.toLocaleString()}
- Total Expenses: $${financialSummary.total_expenses.toLocaleString()}
- Net Profit: $${financialSummary.net_profit.toLocaleString()}
- Profit Margin: ${financialSummary.profit_margin}%
- Tax Efficiency: ${financialSummary.tax_efficiency}%

Generated by Consulting19 Accounting System
      `;
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('Financial report generated and downloaded!');
    } catch (err) {
      console.error('Report generation error:', err);
      alert('Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice': return <Receipt className="w-5 h-5 text-green-600" />;
      case 'receipt': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'bank_statement': return <CreditCard className="w-5 h-5 text-purple-600" />;
      case 'contract': return <Building className="w-5 h-5 text-orange-600" />;
      case 'tax_document': return <Calculator className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'income': return 'bg-green-100 text-green-800';
      case 'expense': return 'bg-red-100 text-red-800';
      case 'asset': return 'bg-blue-100 text-blue-800';
      case 'liability': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'categorized': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.ai_category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Task Manager - Consultant Dashboard</title>
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
        <title>Task Manager - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <p className="text-gray-600 mt-1">Create and manage tasks for your clients</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchAccountingData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </button>
            
            <button
              onClick={() => setShowBulkCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              Bulk Create
            </button>
          </div>
        </div>

        {/* Financial Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${financialSummary.total_revenue.toLocaleString()}</p>
                <div className="flex items-center space-x-1 text-sm text-green-700">
                  <TrendingUp className="w-3 h-3" />
                  <span>+{financialSummary.monthly_growth.toFixed(1)}% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-blue-600">${financialSummary.net_profit.toLocaleString()}</p>
                <div className="flex items-center space-x-1 text-sm text-blue-700">
                  <Percent className="w-3 h-3" />
                  <span>{financialSummary.profit_margin.toFixed(1)}% margin</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tax Efficiency</p>
                <p className="text-2xl font-bold text-purple-600">{financialSummary.tax_efficiency.toFixed(1)}%</p>
                <div className="flex items-center space-x-1 text-sm text-purple-700">
                  <Zap className="w-3 h-3" />
                  <span>Optimized rate</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-orange-600">{documents.length}</p>
                <div className="flex items-center space-x-1 text-sm text-orange-700">
                  <FileText className="w-3 h-3" />
                  <span>This period</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Document Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Document Management</h2>
            <p className="text-sm text-gray-600">AI-powered document processing and categorization</p>
          </div>
          
          {/* Filters */}
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="invoice">Invoices</option>
                <option value="receipt">Receipts</option>
                <option value="bank_statement">Bank Statements</option>
                <option value="contract">Contracts</option>
                <option value="tax_document">Tax Documents</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
                <option value="asset">Assets</option>
                <option value="liability">Liabilities</option>
              </select>
            </div>
          </div>

          {/* Documents List */}
          <div className="p-6">
            {filteredDocuments.length > 0 ? (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(doc.type)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>${doc.amount.toLocaleString()} {doc.currency}</span>
                            <span>•</span>
                            <span>{new Date(doc.transaction_date).toLocaleDateString()}</span>
                            {doc.ai_category && (
                              <>
                                <span>•</span>
                                <span className="text-blue-600">AI: {doc.ai_category}</span>
                              </>
                            )}
                            {doc.confidence_score && (
                              <>
                                <span>•</span>
                                <span className="text-green-600">{doc.confidence_score}% confidence</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(doc.category)}`}>
                          {doc.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => alert('Document preview functionality')}
                            className="text-blue-600 hover:text-blue-700"
                            title="Preview document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => alert('Delete document functionality')}
                            className="text-red-600 hover:text-red-700"
                            title="Delete document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
                <p className="text-gray-600 mb-6">
                  Upload your financial documents to get started with automated accounting
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">🤖 AI-Powered Processing</h4>
                  <p className="text-xs text-blue-800">
                    Our AI automatically categorizes documents, extracts key data, and suggests 
                    optimizations for your financial management.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Task Modal */}
        {showCreateTaskModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
                <button
                  onClick={() => setShowCreateTaskModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe the task"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client *
                    </label>
                    <select
                      value={newTask.client_id}
                      onChange={(e) => setNewTask(prev => ({ ...prev, client_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.profile.full_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project (Optional)
                    </label>
                    <select
                      value={newTask.project_id}
                      onChange={(e) => setNewTask(prev => ({ ...prev, project_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">No project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
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
                      value={newTask.due_date}
                      onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="gg.aa.yyyy"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Hours
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newTask.estimated_hours}
                      onChange={(e) => setNewTask(prev => ({ ...prev, estimated_hours: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTask.billable}
                      onChange={(e) => setNewTask(prev => ({ ...prev, billable: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Billable task</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTask.is_client_visible}
                      onChange={(e) => setNewTask(prev => ({ ...prev, is_client_visible: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Visible to client</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-8">
                <button
                  onClick={() => setShowCreateTaskModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  disabled={creatingTask || !newTask.title.trim() || !newTask.client_id}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {creatingTask ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Create Modal */}
        {showBulkCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create Tasks for Multiple Clients</h2>
                <button
                  onClick={() => setShowBulkCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={bulkTask.title}
                    onChange={(e) => setBulkTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Submit Monthly Financial Documents"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={bulkTask.description}
                    onChange={(e) => setBulkTask(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Detailed task description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={bulkTask.priority}
                      onChange={(e) => setBulkTask(prev => ({ ...prev, priority: e.target.value }))}
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
                      value={bulkTask.due_date}
                      onChange={(e) => setBulkTask(prev => ({ ...prev, due_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="gg.aa.yyyy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Clients * ({bulkTask.selected_clients.length} selected)
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="mb-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={bulkTask.selected_clients.length === clients.length}
                          onChange={handleSelectAllClients}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900">Select All</span>
                      </label>
                    </div>
                    <div className="space-y-2">
                      {clients.map((client) => (
                        <label key={client.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={bulkTask.selected_clients.includes(client.id)}
                            onChange={() => handleClientToggle(client.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-900">
                            {client.profile.full_name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={bulkTask.billable}
                      onChange={(e) => setBulkTask(prev => ({ ...prev, billable: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Billable tasks</span>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={bulkTask.is_client_visible}
                      onChange={(e) => setBulkTask(prev => ({ ...prev, is_client_visible: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-900">Visible to clients</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-8">
                <button
                  onClick={() => setShowBulkCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkCreateTasks}
                  disabled={creatingBulkTasks || !bulkTask.title.trim() || bulkTask.selected_clients.length === 0}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {creatingBulkTasks ? 'Creating...' : `Create Tasks (${bulkTask.selected_clients.length})`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 AI Financial Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Tax Optimization</h4>
              </div>
              <p className="text-sm text-green-800">
                Your current tax efficiency is excellent at {financialSummary.tax_efficiency.toFixed(1)}%. 
                Continue current strategy for optimal tax savings.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Growth Analysis</h4>
              </div>
              <p className="text-sm text-blue-800">
                Revenue growth of +{financialSummary.monthly_growth.toFixed(1)}% indicates healthy business expansion. 
                Consider scaling operations in Q2.
              </p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-900">Cost Control</h4>
              </div>
              <p className="text-sm text-purple-800">
                Expense ratio at {financialSummary.expense_ratio.toFixed(1)}% is within optimal range. 
                Monitor office costs for further optimization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantTasks;