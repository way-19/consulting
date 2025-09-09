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
  Bell,
  ExternalLink
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

interface AccountingFee {
  id: string;
  amount_due: number;
  currency: string;
  status: string;
  memo: string;
  due_date: string;
  created_at: string;
  paid_at?: string;
}

interface VirtualOfficeFee {
  id: string;
  amount_due: number;
  currency: string;
  status: string;
  memo: string;
  due_date: string;
  created_at: string;
  paid_at?: string;
}

interface TaxNotification {
  id: string;
  type: string;
  payload: {
    tax_type?: string;
    amount?: number;
    currency?: string;
    due_date?: string;
    description?: string;
  };
  read_at: string | null;
  created_at: string;
}

const ClientAccounting = () => {
  const { user, profile } = useAuth();
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
  const [accountingFees, setAccountingFees] = useState<AccountingFee[]>([]);
  const [virtualOfficeFees, setVirtualOfficeFees] = useState<VirtualOfficeFee[]>([]);
  const [taxNotifications, setTaxNotifications] = useState<TaxNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [payingFee, setPayingFee] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      fetchAccountingData();
    }
  }, [user, profile, selectedPeriod]);

  const fetchAccountingData = async () => {
    try {
      setLoading(true);
      
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (!clientData) {
        console.error('Client data not found');
        setLoading(false);
        return;
      }

      // Fetch payment data including new fee types
      await fetchPaymentData(clientData.id);

      // Mock data for demonstration (existing logic preserved)
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

  const fetchPaymentData = async (clientId: string) => {
    try {
      // Muhasebe ücretleri
      const { data: accountingData } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', clientId)
        .eq('payment_type', 'accounting_fee')
        .order('created_at', { ascending: false });

      // Sanal ofis ücretleri
      const { data: virtualOfficeData } = await supabase
        .from('invoices')
        .select('*')
        .eq('client_id', clientId)
        .eq('payment_type', 'virtual_office_fee')
        .order('created_at', { ascending: false });

      // Vergi bildirimleri
      const { data: taxNotificationData } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_profile_id', user?.id)
        .eq('type', 'tax_payment_due')
        .order('created_at', { ascending: false });

      setAccountingFees(accountingData || []);
      setVirtualOfficeFees(virtualOfficeData || []);
      setTaxNotifications(taxNotificationData || []);
    } catch (err) {
      console.error('Error fetching payment data:', err);
    }
  };

  const handlePayFee = async (feeId: string, feeType: 'accounting' | 'virtual_office') => {
    const fee = feeType === 'accounting' 
      ? accountingFees.find(f => f.id === feeId)
      : virtualOfficeFees.find(f => f.id === feeId);
    
    if (!fee) return;

    try {
      setPayingFee(feeId);

      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Create Stripe checkout session
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            amount: Math.round(fee.amount_due * 100),
            currency: fee.currency.toLowerCase(),
            title: feeType === 'accounting' ? 'Muhasebe Ücreti' : 'Sanal Ofis Ücreti',
            description: fee.memo,
            success_url: `${window.location.origin}/accounting?payment=success&fee_id=${fee.id}`,
            cancel_url: `${window.location.origin}/accounting?payment=cancelled`,
            metadata: {
              payment_type: feeType === 'accounting' ? 'accounting_fee' : 'virtual_office_fee',
              related_entity_id: clientData.id,
              invoice_id: fee.id
            }
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }

    } catch (err) {
      console.error('Payment initiation error:', err);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setPayingFee(null);
    }
  };

  const handlePayTax = async (notification: TaxNotification) => {
    if (!notification.payload.amount || !notification.payload.currency) {
      alert('Tax payment amount not specified in notification');
      return;
    }

    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Create Stripe checkout session for tax payment
      const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke(
        'create-stripe-checkout',
        {
          body: {
            amount: Math.round(notification.payload.amount * 100),
            currency: notification.payload.currency.toLowerCase(),
            title: 'Vergi Ödemesi',
            description: notification.payload.description || `${notification.payload.tax_type} vergi ödemesi`,
            success_url: `${window.location.origin}/accounting?payment=success&tax_id=${notification.id}`,
            cancel_url: `${window.location.origin}/accounting?payment=cancelled`,
            metadata: {
              payment_type: 'tax_payment',
              related_entity_id: clientData.id,
              notification_id: notification.id,
              tax_type: notification.payload.tax_type
            }
          }
        }
      );

      if (checkoutError) {
        throw checkoutError;
      }

      if (checkoutData?.url) {
        window.location.href = checkoutData.url;
      }

    } catch (err) {
      console.error('Tax payment error:', err);
      alert('Failed to initiate tax payment. Please try again.');
    }
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
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Processing...' : 'Upload Documents'}
            </label>
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

        {/* Payment Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Accounting Fees */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">💼 Muhasebe Ücretleri</h3>
              <p className="text-sm text-gray-600">Aylık muhasebe hizmet ücretleriniz</p>
            </div>
            
            <div className="p-6">
              {accountingFees.length > 0 ? (
                <div className="space-y-3">
                  {accountingFees.slice(0, 3).map((fee) => (
                    <div key={fee.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-blue-900">{fee.memo}</h4>
                        <p className="text-sm text-blue-700">
                          {fee.due_date ? `Vadesi: ${new Date(fee.due_date).toLocaleDateString()}` : 'Vade belirsiz'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-900">${fee.amount_due}</div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}>
                            {fee.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                          </span>
                          {fee.status === 'pending' && (
                            <button
                              onClick={() => handlePayFee(fee.id, 'accounting')}
                              disabled={payingFee === fee.id}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-xs"
                            >
                              {payingFee === fee.id ? 'İşleniyor...' : 'Öde'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Henüz muhasebe ücreti yok</p>
                  <p className="text-sm text-gray-500">Danışmanınız gerektiğinde muhasebe ücretleri oluşturacak</p>
                </div>
              )}
            </div>
          </div>

          {/* Virtual Office Fees */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">🏢 Sanal Ofis Ücretleri</h3>
              <p className="text-sm text-gray-600">Sanal ofis hizmet ücretleriniz</p>
            </div>
            
            <div className="p-6">
              {virtualOfficeFees.length > 0 ? (
                <div className="space-y-3">
                  {virtualOfficeFees.slice(0, 3).map((fee) => (
                    <div key={fee.id} className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-purple-900">{fee.memo}</h4>
                        <p className="text-sm text-purple-700">
                          {fee.due_date ? `Vadesi: ${new Date(fee.due_date).toLocaleDateString()}` : 'Vade belirsiz'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-900">${fee.amount_due}</div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(fee.status)}`}>
                            {fee.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
                          </span>
                          {fee.status === 'pending' && (
                            <button
                              onClick={() => handlePayFee(fee.id, 'virtual_office')}
                              disabled={payingFee === fee.id}
                              className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-xs"
                            >
                              {payingFee === fee.id ? 'İşleniyor...' : 'Öde'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Henüz sanal ofis ücreti yok</p>
                  <p className="text-sm text-gray-500">Danışmanınız gerektiğinde sanal ofis ücretleri oluşturacak</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tax Notifications */}
        {taxNotifications.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">🔔 Vergi Ödeme Bildirimleri</h3>
              <p className="text-sm text-gray-600">Danışmanınızdan gelen vergi ödeme bildirimleri</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {taxNotifications.map((notification) => (
                  <div key={notification.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Bell className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-red-900">
                            {notification.payload.tax_type || 'Vergi Ödemesi'} Bildirimi
                          </h4>
                          <p className="text-sm text-red-800 mt-1">
                            {notification.payload.description || 'Vergi ödemeniz bulunmaktadır'}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-red-700 mt-2">
                            {notification.payload.amount && (
                              <span>💰 ${notification.payload.amount} {notification.payload.currency}</span>
                            )}
                            {notification.payload.due_date && (
                              <span>📅 Vade: {new Date(notification.payload.due_date).toLocaleDateString()}</span>
                            )}
                            <span>📆 {new Date(notification.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!notification.read_at && (
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                        {notification.payload.amount && notification.payload.amount > 0 && (
                          <button
                            onClick={() => handlePayTax(notification)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Vergi Öde
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payment Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">💰 Yaklaşan Ödemeler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.upcomingPayments || 0}</div>
              <div className="text-sm text-green-800">Bekleyen Fatura</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">${(stats.upcomingPaymentAmount || 0).toLocaleString()}</div>
              <div className="text-sm text-blue-800">Toplam Tutar</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">Bu Hafta</div>
              <div className="text-sm text-purple-800">Vade Durumu</div>
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

export default ClientAccounting;