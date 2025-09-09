import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  FileText, 
  Upload, 
  Download, 
  Calendar, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Eye,
  Trash2,
  Calculator,
  PieChart,
  Receipt,
  Building,
  Percent,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Award
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface AccountingDocument {
  id: string;
  name: string;
  type: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  created_at: string;
  notes: string;
}

interface AccountingPeriod {
  id: string;
  period_start: string;
  period_end: string;
  period_type: string;
  status: string;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  tax_due: number;
  document_count: number;
}

interface FinancialSummary {
  current_month_revenue: number;
  current_month_expenses: number;
  current_month_profit: number;
  quarter_revenue: number;
  quarter_expenses: number;
  year_revenue: number;
  tax_efficiency: number;
  expense_ratio: number;
}
const ClientAccounting = () => {
  const { user, profile } = useAuth();
  const [documents, setDocuments] = useState<AccountingDocument[]>([]);
  const [accountingPeriods, setAccountingPeriods] = useState<AccountingPeriod[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [monthFilter, setMonthFilter] = useState('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('submit');
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchAccountingDocuments();
      fetchAccountingPeriods();
      fetchFinancialSummary();
    }
  }, [user, profile]);

  const fetchAccountingDocuments = async () => {
    try {
      setLoading(true);
      
      // Get client ID
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .maybeSingle();

      if (clientError) {
        console.error('❌ Client fetch error:', clientError);
        return;
      }

      if (!clientData) {
        console.log('❌ No client record found for this user');
        return;
      }

      // Only fetch financial documents from last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      const { data: docsData, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('client_id', clientData.id)
        .eq('type', 'financial')
        .gte('created_at', threeMonthsAgo.toISOString())
        .order('created_at', { ascending: false });

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

  const fetchAccountingPeriods = async () => {
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) return;

      const { data: periodsData, error } = await supabase
        .from('accounting_periods')
        .select('*')
        .eq('client_id', clientData.id)
        .order('period_start', { ascending: false })
        .limit(12);

      if (error) {
        console.error('Error fetching accounting periods:', error);
        return;
      }

      setAccountingPeriods(periodsData || []);
    } catch (err) {
      console.error('Error fetching periods:', err);
    }
  };

  const fetchFinancialSummary = async () => {
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) return;

      // Calculate current period summaries
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      const currentYearStart = new Date(now.getFullYear(), 0, 1);

      const { data: periodsData } = await supabase
        .from('accounting_periods')
        .select('*')
        .eq('client_id', clientData.id)
        .gte('period_start', currentYearStart.toISOString().split('T')[0]);

      if (periodsData && periodsData.length > 0) {
        const currentMonth = periodsData.filter(p => new Date(p.period_start) >= currentMonthStart);
        const currentQuarter = periodsData.filter(p => new Date(p.period_start) >= currentQuarterStart);
        const currentYear = periodsData;

        const monthRevenue = currentMonth.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
        const monthExpenses = currentMonth.reduce((sum, p) => sum + (p.total_expenses || 0), 0);
        const quarterRevenue = currentQuarter.reduce((sum, p) => sum + (p.total_revenue || 0), 0);
        const quarterExpenses = currentQuarter.reduce((sum, p) => sum + (p.total_expenses || 0), 0);
        const yearRevenue = currentYear.reduce((sum, p) => sum + (p.total_revenue || 0), 0);

        setFinancialSummary({
          current_month_revenue: monthRevenue,
          current_month_expenses: monthExpenses,
          current_month_profit: monthRevenue - monthExpenses,
          quarter_revenue: quarterRevenue,
          quarter_expenses: quarterExpenses,
          year_revenue: yearRevenue,
          tax_efficiency: yearRevenue > 0 ? ((yearRevenue - quarterExpenses) / yearRevenue) * 100 : 0,
          expense_ratio: quarterRevenue > 0 ? (quarterExpenses / quarterRevenue) * 100 : 0
        });
      }
    } catch (err) {
      console.error('Error fetching financial summary:', err);
    }
  };

  const generateFinancialReport = async (reportType: string, period: AccountingPeriod) => {
    try {
      setGeneratingReport(true);

      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) throw new Error('Client data not found');

      // Generate financial report via edge function
      const { data: reportData, error: reportError } = await supabase.functions.invoke(
        'generate-financial-report',
        {
          body: {
            client_id: clientData.id,
            consultant_id: clientData.assigned_consultant_id,
            report_type: reportType,
            period_id: period.id,
            period_start: period.period_start,
            period_end: period.period_end
          }
        }
      );

      if (reportError) {
        throw reportError;
      }

      // Download the generated report
      if (reportData?.download_url) {
        const a = document.createElement('a');
        a.href = reportData.download_url;
        a.download = `${reportType}_${period.period_start}_${period.period_end}.pdf`;
        a.click();
      }

      alert('Financial report generated and downloaded successfully!');
    } catch (err) {
      console.error('Report generation error:', err);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };
  const handleFileUpload = async (file: File, documentType: string) => {
    try {
      setUploading(true);
      
      // Get client data
      const { data: clientData } = await supabase
        .from('clients')
        .select('id, assigned_consultant_id')
        .eq('profile_id', user?.id)
        .single();

      if (!clientData) {
        throw new Error('Client data not found');
      }

      // Upload file to Supabase Storage
      const fileName = `accounting/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(uploadData.path);

      // Save document metadata
      const { error: docError } = await supabase
        .from('documents')
        .insert({
          client_id: clientData.id,
          consultant_id: clientData.assigned_consultant_id,
          name: file.name,
          type: 'financial',
          category: documentType,
          file_url: urlData.publicUrl,
          file_size: file.size,
          mime_type: file.type,
          uploaded_at: new Date().toISOString(),
          notes: `Accounting document - ${documentType}`
        });

      if (docError) {
        throw docError;
      }

      // Trigger AI document analysis
      await supabase.functions.invoke('ai-document-categorization', {
        body: {
          document_id: docData?.id,
          file_url: urlData.publicUrl,
          file_name: file.name,
          mime_type: file.type,
          analysis_type: 'accounting'
        }
      });
      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'accounting_document_upload',
          resource_type: 'document',
          description: `Uploaded accounting document: ${file.name}`,
          payload: { 
            file_name: file.name, 
            document_type: documentType,
            file_size: file.size 
          }
        });

      // Notify consultant
      if (clientData.assigned_consultant_id) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: clientData.assigned_consultant_id,
            type: 'accounting_document_uploaded',
            payload: {
              client_name: profile?.full_name,
              document_name: file.name,
              document_type: documentType
            },
            email_notification: true
          }
        });
      }

      alert('Accounting document uploaded successfully!');
      fetchAccountingDocuments();
      fetchAccountingPeriods();
      fetchFinancialSummary();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        value: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      });
    }
    
    return months;
  };

  const filteredDocuments = documents.filter(doc => {
    if (monthFilter !== 'all') {
      const docDate = new Date(doc.created_at);
      const docMonth = `${docDate.getFullYear()}-${(docDate.getMonth() + 1).toString().padStart(2, '0')}`;
      if (docMonth !== monthFilter) return false;
    }
    
    if (documentTypeFilter !== 'all' && doc.category !== documentTypeFilter) {
      return false;
    }
    
    return true;
  });

  // Calculate basic statistics
  const monthlyStats = getMonthOptions().map(month => {
    const monthDocs = documents.filter(doc => {
      const docDate = new Date(doc.created_at);
      const docMonth = `${docDate.getFullYear()}-${(docDate.getMonth() + 1).toString().padStart(2, '0')}`;
      return docMonth === month.value;
    });
    
    return {
      month: month.label,
      totalDocuments: monthDocs.length,
      invoices: monthDocs.filter(doc => doc.category === 'invoice').length,
      bankStatements: monthDocs.filter(doc => doc.category === 'bank_statement').length,
      other: monthDocs.filter(doc => !['invoice', 'bank_statement'].includes(doc.category || '')).length
    };
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Accounting - Client Portal</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
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
        <title>Accounting - Client Portal</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monthly Accounting</h1>
          <p className="text-gray-600 mt-1">Submit monthly accounting documents to your consultant</p>
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              📋 <strong>Monthly Submission:</strong> Upload invoices, bank statements, and receipts. Documents are auto-deleted after 6 months for security.
            </p>
          </div>
        </div>

        {/* Financial Dashboard */}
        {financialSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${financialSummary.current_month_revenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month Profit</p>
                  <p className={`text-2xl font-bold ${
                    financialSummary.current_month_profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${Math.abs(financialSummary.current_month_profit).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tax Efficiency</p>
                  <p className="text-2xl font-bold text-purple-600">{financialSummary.tax_efficiency.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Percent className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expense Ratio</p>
                  <p className="text-2xl font-bold text-orange-600">{financialSummary.expense_ratio.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'submit', name: 'Submit Documents', icon: Upload },
                { id: 'periods', name: 'Accounting Periods', icon: Calendar },
                { id: 'reports', name: 'Financial Reports', icon: BarChart3 },
                { id: 'analytics', name: 'Analytics', icon: Calculator }
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

          <div className="p-6">
            {/* Submit Documents Tab */}
            {activeTab === 'submit' && (
              <div>
        {/* Document Upload Section */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Monthly Accounting Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="invoice-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'invoice');
                }}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label htmlFor="invoice-upload" className="cursor-pointer">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📄 Invoices & Receipts</h3>
                <p className="text-sm text-gray-600">
                  Monthly invoices, receipts, and expense documents
                </p>
              </label>
            </div>

            {/* Bank Statement Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                id="bank-statement-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, 'bank_statement');
                }}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <label htmlFor="bank-statement-upload" className="cursor-pointer">
                <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🏦 Bank Statements</h3>
                <p className="text-sm text-gray-600">
                  Monthly bank statements and transaction reports
                </p>
              </label>
            </div>
          </div>
          
          {uploading && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-800 font-medium">Uploading document...</span>
              </div>
            </div>
          )}
              </div>
            )}

            {/* Accounting Periods Tab */}
            {activeTab === 'periods' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Accounting Periods</h2>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    <Calendar className="w-4 h-4 mr-2 inline" />
                    Close Current Period
                  </button>
                </div>

                {accountingPeriods.length > 0 ? (
                  <div className="space-y-4">
                    {accountingPeriods.map((period) => (
                      <div key={period.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {new Date(period.period_start).toLocaleDateString()} - {new Date(period.period_end).toLocaleDateString()}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="capitalize">{period.period_type}</span>
                              <span>•</span>
                              <span>{period.document_count} documents</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            period.status === 'closed' ? 'bg-green-100 text-green-800' :
                            period.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {period.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">${period.total_revenue.toLocaleString()}</div>
                            <div className="text-xs text-green-800">Revenue</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-lg font-bold text-red-600">${period.total_expenses.toLocaleString()}</div>
                            <div className="text-xs text-red-800">Expenses</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className={`text-lg font-bold ${
                              period.net_profit >= 0 ? 'text-blue-600' : 'text-red-600'
                            }`}>
                              ${Math.abs(period.net_profit).toLocaleString()}
                            </div>
                            <div className="text-xs text-blue-800">Net Profit</div>
                          </div>
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">${period.tax_due.toLocaleString()}</div>
                            <div className="text-xs text-purple-800">Tax Due</div>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button 
                            onClick={() => generateFinancialReport('profit_loss', period)}
                            disabled={generatingReport}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            <Receipt className="w-4 h-4 mr-2 inline" />
                            P&L Report
                          </button>
                          <button 
                            onClick={() => generateFinancialReport('tax_summary', period)}
                            disabled={generatingReport}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          >
                            <Calculator className="w-4 h-4 mr-2 inline" />
                            Tax Summary
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Accounting Periods</h3>
                    <p className="text-gray-600">Accounting periods will be created automatically as you submit documents</p>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { type: 'profit_loss', name: 'Profit & Loss Statement', icon: TrendingUp, color: 'green' },
                    { type: 'balance_sheet', name: 'Balance Sheet', icon: Building, color: 'blue' },
                    { type: 'cash_flow', name: 'Cash Flow Statement', icon: DollarSign, color: 'purple' },
                    { type: 'tax_summary', name: 'Tax Summary Report', icon: Calculator, color: 'orange' }
                  ].map((report) => (
                    <div key={report.type} className={`bg-${report.color}-50 border border-${report.color}-200 rounded-lg p-6`}>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 bg-${report.color}-500 rounded-lg flex items-center justify-center`}>
                          <report.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {report.type === 'profit_loss' && 'Revenue, expenses, and profitability analysis'}
                        {report.type === 'balance_sheet' && 'Assets, liabilities, and equity overview'}
                        {report.type === 'cash_flow' && 'Cash inflows and outflows tracking'}
                        {report.type === 'tax_summary' && 'Tax obligations and optimization insights'}
                      </p>
                      
                      <div className="space-y-2">
                        {['Monthly', 'Quarterly', 'Yearly'].map((periodType) => (
                          <button 
                            key={periodType}
                            className={`w-full px-4 py-2 bg-white border border-${report.color}-300 text-${report.color}-700 rounded-lg hover:bg-${report.color}-50 transition-colors text-sm`}
                          >
                            Generate {periodType} {report.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Analytics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Revenue Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">This Quarter:</span>
                        <span className="font-bold text-blue-900">
                          ${financialSummary?.quarter_revenue.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">This Year:</span>
                        <span className="font-bold text-blue-900">
                          ${financialSummary?.year_revenue.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: '70%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">Profit Trends</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">This Month:</span>
                        <span className={`font-bold ${
                          (financialSummary?.current_month_profit || 0) >= 0 ? 'text-green-900' : 'text-red-600'
                        }`}>
                          ${Math.abs(financialSummary?.current_month_profit || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Profit Margin:</span>
                        <span className="font-bold text-green-900">
                          {financialSummary?.current_month_revenue 
                            ? (((financialSummary.current_month_profit) / financialSummary.current_month_revenue) * 100).toFixed(1)
                            : '0'
                          }%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">Tax Optimization</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-purple-700">Tax Efficiency:</span>
                        <span className="font-bold text-purple-900">
                          {financialSummary?.tax_efficiency.toFixed(1) || '0'}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Optimization Score:</span>
                        <span className="font-bold text-purple-900">Good</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Months</option>
              {getMonthOptions().map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              value={documentTypeFilter}
              onChange={(e) => setDocumentTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="invoice">Invoices</option>
              <option value="bank_statement">Bank Statements</option>
              <option value="expense">Expenses</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Documents List */}
        {/* AI Accounting Insights */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">🤖 AI Accounting Assistant</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-indigo-900 mb-2">Smart Document Processing</h4>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Automatic categorization & OCR
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Duplicate detection & validation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Expense/revenue classification
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-indigo-900 mb-2">Automated Insights</h4>
              <ul className="space-y-2 text-sm text-indigo-800">
                <li className="flex items-center">
                  <Award className="w-4 h-4 text-yellow-500 mr-2" />
                  Tax optimization suggestions
                </li>
                <li className="flex items-center">
                  <Target className="w-4 h-4 text-blue-500 mr-2" />
                  Cash flow predictions
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
                  Compliance alerts & reminders
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default ClientAccounting;