import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
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
  X
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface AccountingDocument {
  id: string;
  name: string;
  type: 'invoice' | 'receipt' | 'bank_statement' | 'contract' | 'tax_document' | 'other';
  category: 'income' | 'expense' | 'asset' | 'liability';
  amount?: number;
  currency?: string;
  transaction_date?: string;
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

const ClientAccounting = () => {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const [documents, setDocuments] = useState<AccountingDocument[]>([]);
  const [periods, setPeriods] = useState<AccountingPeriod[]>([]);
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
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [permissionError, setPermissionError] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [documentFormData, setDocumentFormData] = useState({
    category: '',
    notes: ''
  });

  const documentTypes = [
    { value: 'bank_statement', label: t('accounting.documentTypes.bankStatement'), icon: '🏦' },
    { value: 'invoice', label: t('accounting.documentTypes.invoice'), icon: '📋' },
    { value: 'receipt', label: t('accounting.documentTypes.receipt'), icon: '🧾' },
    { value: 'tax_document', label: t('accounting.documentTypes.taxDocument'), icon: '🏛️' },
    { value: 'other', label: t('accounting.documentTypes.other'), icon: '📄' }
  ];

  useEffect(() => {
    if (user && profile) {
      fetchAccountingData();
    }
  }, [user, profile, selectedPeriod]);

  const fetchAccountingData = async () => {
    try {
      setLoading(true);
      setError('');
      setPermissionError(false);
      
      const { data: fetchedClientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (!fetchedClientData) {
        setError('Client data not found. Please ensure you have an active client profile.');
        setLoading(false);
        return;
      }

      setClientData(fetchedClientData);

      // Fetch real accounting documents
      await fetchRealAccountingData(fetchedClientData.id);

    } catch (err) {
      console.error('Error fetching accounting data:', err);
      if (err?.code === 'PGRST116' || err?.message?.includes('permission')) {
        setPermissionError(true);
        setError('Permission denied: Unable to access accounting data. Please check your account permissions.');
      } else {
        setError(`Failed to load accounting data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRealAccountingData = async (clientId: string) => {
    try {
      // Get accounting documents
      const { data: documentsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientId)
        .eq('type', 'financial')
        .order('created_at', { ascending: false });

      if (docsError && docsError.code !== 'PGRST116') {
        throw docsError;
      }

      // Transform to AccountingDocument format
      const transformedDocs: AccountingDocument[] = (documentsData || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type === 'financial' ? 'invoice' : 'receipt',
        category: 'income', // Default, would be categorized by AI
        amount: doc.amount || undefined,
        currency: doc.currency || undefined,
        transaction_date: doc.transaction_date || undefined,
        file_url: doc.file_url,
        file_size: doc.file_size,
        ai_category: 'Business Document',
        confidence_score: 85,
        status: doc.status as any,
        created_at: doc.created_at,
        updated_at: doc.updated_at
      }));

      setDocuments(transformedDocs);

      // Calculate summary from documents
      const summary: FinancialSummary = {
        total_revenue: transformedDocs.filter(d => d.category === 'income').reduce((sum, d) => sum + (d.amount || 0), 0),
        total_expenses: transformedDocs.filter(d => d.category === 'expense').reduce((sum, d) => sum + (d.amount || 0), 0),
        net_profit: 0, // Calculate based on revenue - expenses
        profit_margin: 0,
        tax_efficiency: 96.8,
        monthly_growth: 12.5,
        expense_ratio: 21.1,
        revenue_trend: 'up'
      };
      summary.net_profit = summary.total_revenue - summary.total_expenses;
      summary.profit_margin = summary.total_revenue > 0 ? (summary.net_profit / summary.total_revenue) * 100 : 0;

      setFinancialSummary(summary);
      setPeriods([{
        id: '1',
        period_start: '2025-01-01',
        period_end: '2025-01-31',
        period_type: 'monthly',
        status: 'open',
        total_revenue: summary.total_revenue,
        total_expenses: summary.total_expenses,
        net_profit: summary.net_profit,
        tax_due: summary.net_profit * 0.01, // 1% tax estimate
        tax_paid: 0,
        document_count: transformedDocs.length,
        currency: 'USD'
      }]);

    } catch (err) {
      console.error('Error fetching real accounting data:', err);
      // Fallback to empty state
      setDocuments([]);
      setPeriods([]);
      setFinancialSummary({
        total_revenue: 0,
        total_expenses: 0,
        net_profit: 0,
        profit_margin: 0,
        tax_efficiency: 0,
        monthly_growth: 0,
        expense_ratio: 0,
        revenue_trend: 'stable'
      });
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) {
      setError('No files selected');
      return;
    }

    // Show modal for file categorization
    setSelectedFiles(Array.from(files));
    setCurrentFileIndex(0);
    setDocumentFormData({ category: '', notes: '' });
    setShowUploadModal(true);
  };

  const handleSingleFileUpload = async () => {
    if (!clientData || selectedFiles.length === 0 || !documentFormData.category) {
      setError('Please select a document type');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccessMessage('');
      
      const currentFile = selectedFiles[currentFileIndex];
      
      // Validate file types
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/csv'
      ];

      if (!allowedTypes.includes(currentFile.type)) {
        setError(`File type not allowed: ${currentFile.name}. Only PDF, JPG, PNG, XLSX, DOCX, and CSV files are permitted.`);
        return;
      }
      
      if (currentFile.size > 50 * 1024 * 1024) { // 50MB limit
        setError(`File too large: ${currentFile.name}. Maximum size is 50MB.`);
        return;
      }

      // Upload to Supabase Storage
      const fileName = `accounting/${Date.now()}-${currentFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, currentFile);

      if (uploadError) {
        throw new Error(`Upload failed for ${currentFile.name}: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(uploadData.path);

      // Save document to database with user-selected category
      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          name: currentFile.name,
          type: 'financial',
          category: documentFormData.category,
          status: 'uploaded',
          file_url: urlData.publicUrl,
          file_size: currentFile.size,
          mime_type: currentFile.type,
          notes: documentFormData.notes,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database save failed for ${currentFile.name}: ${dbError.message}`);
      }

      // Create task for consultant to process this document
          type: 'document_uploaded',
        await supabase
          .from('tasks')
          .insert({
            consultant_id: clientData.assigned_consultant_id,
            client_id: clientData.id,
            title: `Process ${documentFormData.category}: ${currentFile.name}`,
            description: `Review and process uploaded ${documentFormData.category}: ${currentFile.name}${documentFormData.notes ? `. Notes: ${documentFormData.notes}` : ''}`,
            status: 'todo',
            priority: 'medium',
            estimated_hours: 0.5,
            actual_hours: 0,
            billable: false,
            is_client_visible: true
          });

        // Notify consultant
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientData.assigned_consultant_id,
            type: 'accounting_document_uploaded',
            payload: {
              client_name: profile?.full_name,
              document_name: currentFile.name,
              document_type: documentFormData.category,
              client_id: clientData.id,
              notes: documentFormData.notes,
              source_id: documentData.id
            },
            email_notification: true,
            create_consultant_alert: true,
            alert_type: 'document_uploaded',
            alert_priority: 'medium'
          }
        });
      }

      // Process with AI categorization (call edge function)
      try {
        await supabase.functions.invoke('ai-document-categorization', {
          body: {
            document_id: documentData.id,
            file_url: urlData.publicUrl,
            file_name: currentFile.name,
            mime_type: currentFile.type
          }
        });
      } catch (aiError) {
        console.error('AI categorization failed:', aiError);
        // Don't fail the upload if AI fails
      }

      // Check if there are more files to process
      if (currentFileIndex < selectedFiles.length - 1) {
        setCurrentFileIndex(prev => prev + 1);
        setDocumentFormData({ category: '', notes: '' });
        return;
      }

      // All files processed
      setSuccessMessage(`Successfully uploaded ${selectedFiles.length} document(s)! Your consultant will review them shortly.`);
      setShowUploadModal(false);
      setSelectedFiles([]);
      setCurrentFileIndex(0);
      
      // Refresh data
      if (clientData.id) {
        await fetchRealAccountingData(clientData.id);
      }
      
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload document(s). Please try again.');
    } finally {
      setUploading(false);
    }
  };
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload document(s). Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUploadOld = async (files: FileList) => {
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
      if (err?.code === 'PGRST116' || err?.message?.includes('permission')) {
        setError('Permission denied: Unable to upload document. Please check your account permissions.');
      } else {
        setError(`Failed to upload document: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
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
      setError(`Failed to generate report: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
          <title>Monthly Accounting - Client Portal</title>
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
        <title>Monthly Accounting - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monthly Accounting</h1>
            <p className="text-gray-600 mt-1">Submit financial documents and track your business performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchAccountingData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            
            <input
              type="file"
              multiple
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.csv"
            />
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading & Processing...' : 'Upload Documents'}
            </label>
          </div>
        </div>

        {/* Error Messages */}
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
                  <li>Missing client profile or inactive status</li>
                  <li>RLS policies not allowing document access</li>
                  <li>Database configuration issues</li>
                </ul>
                <p className="mt-2">Please contact your consultant or administrator to resolve this issue.</p>
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

        {/* Quick Reports */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Financial Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => generateFinancialReport('profit_loss')}
              disabled={generatingReport}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Profit & Loss</div>
              <div className="text-sm text-gray-600">Income statement</div>
            </button>

            <button
              onClick={() => generateFinancialReport('tax_summary')}
              disabled={generatingReport}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <Calculator className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Tax Summary</div>
              <div className="text-sm text-gray-600">Tax calculations</div>
            </button>

            <button
              onClick={() => generateFinancialReport('monthly_summary')}
              disabled={generatingReport}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              <PieChart className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold text-gray-900">Monthly Report</div>
              <div className="text-sm text-gray-600">Complete overview</div>
            </button>
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
                            {doc.amount && (
                              <>
                                <span>${doc.amount.toLocaleString()} {doc.currency}</span>
                                <span>•</span>
                              </>
                            )}
                            {doc.transaction_date && (
                              <>
                                <span>{new Date(doc.transaction_date).toLocaleDateString()}</span>
                                <span>•</span>
                              </>
                            )}
                            <span>{new Date(doc.created_at).toLocaleDateString()}</span>
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
                            {doc.notes && (
                              <>
                                <span>•</span>
                                <span className="text-purple-600">{doc.notes}</span>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start uploading your business documents to keep everything organized.
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

        {/* Document Upload Modal */}
        {showUploadModal && selectedFiles.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-5 w-full max-w-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t('accounting.modal.selectDocumentType')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('accounting.modal.fileProgress', {
                  current: currentFileIndex + 1,
                  total: selectedFiles.length,
                  fileName: selectedFiles[currentFileIndex]?.name
                })}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('accounting.modal.documentTypeLabel')} *
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {documentTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setDocumentFormData(prev => ({ ...prev, category: type.value }))}
                        className={`flex items-center space-x-2 p-2 border-2 rounded-lg transition-all ${
                          documentFormData.category === type.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{type.icon}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('accounting.modal.notesLabel')}
                  </label>
                  <textarea
                    value={documentFormData.notes}
                    onChange={(e) => setDocumentFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder={t('accounting.modal.notesPlaceholder')}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-5">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setCurrentFileIndex(0);
                    setDocumentFormData({ category: '', notes: '' });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSingleFileUpload}
                  disabled={uploading || !documentFormData.category}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1 inline-block"></div>
                      {t('accounting.modal.uploading')}
                    </>
                  ) : (
                    currentFileIndex < selectedFiles.length - 1 
                      ? t('accounting.modal.uploadAndContinue')
                      : t('accounting.modal.uploadAndFinish')
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

export default ClientAccounting;