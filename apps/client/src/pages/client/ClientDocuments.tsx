import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '@consulting19/shared';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Check,
  MessageSquare,
  Trash2,
  DollarSign,
  BarChart3,
  TrendingUp,
  Calculator,
  Receipt,
  Building,
  CreditCard
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface AccountingDocument {
  id: string;
  name: string;
  type: string;
  category?: string;
  status: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  notes?: string;
  uploaded_at?: string;
  created_at: string;
  consultant?: {
    full_name: string;
  };
}

const ClientDocuments = () => {
  const { user, profile } = useAuth();
  const { t } = useI18n();
  const [documents, setDocuments] = useState<AccountingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [documentTypeFilter, setDocumentTypeFilter] = useState('all');

  useEffect(() => {
    if (user && profile) {
      fetchAccountingDocuments();
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

      if (clientError || !clientData) {
        console.error('Client fetch error:', clientError);
        setLoading(false);
        return;
      }

      // Only fetch financial/accounting documents from last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select(`
          *,
          consultant:user_profiles!documents_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .eq('type', 'financial')
        .gte('created_at', sixMonthsAgo.toISOString())
        .order('created_at', { ascending: false });

      if (documentsError) {
        console.error('Documents fetch error:', documentsError);
        setLoading(false);
        return;
      }

      setDocuments(documentsData || []);
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList, documentType: string) => {
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

      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
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
            status: 'uploaded',
            notes: `Accounting document - ${documentType}`
          });

        if (docError) {
          throw docError;
        }
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'accounting_document_upload',
          resource_type: 'document',
          description: `Uploaded accounting document: ${fileArray[0].name}`,
          payload: { 
            file_count: fileArray.length,
            document_type: documentType,
            total_size: fileArray.reduce((sum, f) => sum + f.size, 0)
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
              document_name: fileArray[0].name,
              document_type: documentType,
              file_count: fileArray.length
            },
            email_notification: true
          }
        });
      }

      alert('Accounting documents uploaded successfully!');
      fetchAccountingDocuments();
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload documents. Please try again.');
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
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        value: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      });
    }
    
    return months;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (monthFilter !== 'all') {
      const docDate = new Date(doc.created_at);
      const docMonth = `${docDate.getFullYear()}-${(docDate.getMonth() + 1).toString().padStart(2, '0')}`;
      if (docMonth !== monthFilter) return false;
    }
    
    if (documentTypeFilter !== 'all' && doc.category !== documentTypeFilter) {
      return false;
    }
    
    return matchesSearch;
  });

  // Calculate monthly statistics
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
      expenses: monthDocs.filter(doc => doc.category === 'expense').length,
      other: monthDocs.filter(doc => !['invoice', 'bank_statement', 'expense'].includes(doc.category || '')).length
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
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
          <h1 className="text-3xl font-bold text-gray-900">Accounting</h1>
          <p className="text-gray-600 mt-1">Submit monthly accounting documents to your consultant</p>
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              📋 <strong>Note:</strong> Documents are automatically deleted after 6 months for security and storage optimization.
            </p>
          </div>
        </div>

        {/* Document Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Accounting Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Invoice Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                id="invoice-upload"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) handleFileUpload(files, 'invoice');
                }}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx"
                multiple
              />
              <label htmlFor="invoice-upload" className="cursor-pointer">
                <Receipt className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Invoices</h3>
                <p className="text-sm text-gray-600">
                  Click to upload invoices, receipts, and expense documents
                </p>
              </label>
            </div>

            {/* Bank Statement Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                id="bank-statement-upload"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) handleFileUpload(files, 'bank_statement');
                }}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx"
                multiple
              />
              <label htmlFor="bank-statement-upload" className="cursor-pointer">
                <Building className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Bank Statements</h3>
                <p className="text-sm text-gray-600">
                  Click to upload bank statements and financial reports
                </p>
              </label>
            </div>

            {/* Expense Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
              <input
                type="file"
                id="expense-upload"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) handleFileUpload(files, 'expense');
                }}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.xlsx,.docx"
                multiple
              />
              <label htmlFor="expense-upload" className="cursor-pointer">
                <CreditCard className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Expenses</h3>
                <p className="text-sm text-gray-600">
                  Click to upload expense receipts and business costs
                </p>
              </label>
            </div>
          </div>
          
          {uploading && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-blue-800 font-medium">Uploading accounting documents...</span>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {monthlyStats.slice(0, 3).map((stats, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{stats.month}</h3>
                  <span className="text-2xl font-bold text-blue-600">{stats.totalDocuments}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoices:</span>
                    <span className="font-medium">{stats.invoices}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Statements:</span>
                    <span className="font-medium">{stats.bankStatements}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expenses:</span>
                    <span className="font-medium">{stats.expenses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Other:</span>
                    <span className="font-medium">{stats.other}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search accounting documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Months</option>
              {getMonthOptions().map((month) => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
            <select
              value={documentTypeFilter}
              onChange={(e) => setDocumentTypeFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="invoice">Invoices</option>
              <option value="bank_statement">Bank Statements</option>
              <option value="expense">Expenses</option>
              <option value="tax_document">Tax Documents</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Documents List */}
        {filteredDocuments.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Accounting Documents</h2>
              <p className="text-sm text-gray-600">
                Documents from the last 6 months (older documents are automatically removed)
              </p>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        {doc.category === 'invoice' && <Receipt className="w-6 h-6 text-blue-600" />}
                        {doc.category === 'bank_statement' && <Building className="w-6 h-6 text-green-600" />}
                        {doc.category === 'expense' && <CreditCard className="w-6 h-6 text-purple-600" />}
                        {!['invoice', 'bank_statement', 'expense'].includes(doc.category || '') && <FileText className="w-6 h-6 text-gray-600" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{doc.category || 'Other'}</span>
                          {doc.file_size && (
                            <>
                              <span>•</span>
                              <span>{formatFileSize(doc.file_size)}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>
                            {doc.uploaded_at 
                              ? new Date(doc.uploaded_at).toLocaleDateString()
                              : new Date(doc.created_at).toLocaleDateString()
                            }
                          </span>
                          {doc.consultant && (
                            <>
                              <span>•</span>
                              <span>Reviewed by {doc.consultant.full_name}</span>
                            </>
                          )}
                        </div>
                        {doc.notes && (
                          <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                            {doc.notes}
                          </p>
                        )}
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
                            Preview
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
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Accounting Documents</h3>
            <p className="text-gray-600 mb-6">
              Start by uploading your monthly accounting documents like invoices, bank statements, and expense receipts.
              These will be securely shared with your consultant for tax planning and financial reporting.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="text-sm font-semibold text-green-900 mb-2">📊 Professional Accounting</h4>
              <p className="text-xs text-green-800">
                Our accounting module helps you maintain organized records and ensures your 
                consultant has all necessary documents for tax filings, financial reporting, and compliance.
              </p>
            </div>
          </div>
        )}

        {/* Accounting Benefits */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💼 Accounting Document Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Calculator className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Tax Preparation</h4>
                  <p className="text-sm text-gray-600">
                    Upload monthly documents to help your consultant prepare accurate tax filings 
                    and ensure compliance with local regulations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Financial Analysis</h4>
                  <p className="text-sm text-gray-600">
                    Your consultant analyzes your financial documents to provide insights 
                    on cash flow, profitability, and business growth opportunities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Compliance Monitoring</h4>
                  <p className="text-sm text-gray-600">
                    Regular document submission helps ensure your business stays compliant 
                    with accounting standards and regulatory requirements.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-0.5">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Cost Optimization</h4>
                  <p className="text-sm text-gray-600">
                    Your consultant reviews expenses and bank statements to identify 
                    cost-saving opportunities and tax deductions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Monthly Reporting</h4>
                  <p className="text-sm text-gray-600">
                    Regular document uploads enable your consultant to provide monthly 
                    financial reports and business performance insights.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Audit Preparation</h4>
                  <p className="text-sm text-gray-600">
                    Well-organized accounting documents help prepare for potential 
                    audits and ensure all financial records are properly maintained.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Document Guidelines */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 Document Upload Guidelines:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• <strong>Monthly Submission:</strong> Upload documents by the 5th of each month</li>
              <li>• <strong>Accepted Formats:</strong> PDF, XLSX, DOCX, JPG, PNG (max 10MB per file)</li>
              <li>• <strong>Required Documents:</strong> Bank statements, invoices, expense receipts</li>
              <li>• <strong>Optional Documents:</strong> Tax forms, financial reports, audit documents</li>
              <li>• <strong>Security:</strong> All documents are encrypted and automatically deleted after 6 months</li>
              <li>• <strong>Processing Time:</strong> Your consultant reviews documents within 2-3 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientDocuments;