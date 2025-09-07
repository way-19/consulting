import React, { useState, useEffect } from 'react';
import { CreditCard, Download, Calendar, DollarSign, Receipt, AlertCircle } from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared';
import { useAuth } from '@consulting19/shared';
import { useI18n } from '../../hooks/useI18n';
import ClientLayout from '../../components/layouts/ClientLayout';
import { Helmet } from 'react-helmet-async';

// Updated InvoiceRecord interface based on database schema
interface InvoiceRecord {
  id: string;
  client_id: string;
  service_order_id: string | null;
  amount_due: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  stripe_invoice_id: string | null;
  stripe_payment_intent: string | null;
  stripe_session_id: string | null;
  memo: string | null;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  system_commission_amount: number | null;
  consultant_commission_amount: number | null;
  // Related data from joins
  service_order: {
    title: string;
    description: string;
  } | null;
  client: { // This client is the one linked by invoices_client_id_fkey
    profile: { // This profile is the one linked by clients_profile_id_fkey
      full_name: string;
    };
  } | null;
  consultant: { // This consultant is linked by service_orders_consultant_id_fkey
    full_name: string;
  } | null;
}

const ClientBilling = () => {
  const { user } = useAuth();
  const { t, formatCurrency, formatDate } = useI18n();
  const [invoiceRecords, setInvoiceRecords] = useState<InvoiceRecord[]>([]); // Renamed from transactions
  // Mock data için kullanılan 'invoices' state'i kaldırıldı, çünkü artık gerçek faturaları çekeceğiz.
  // const [invoices, setInvoices] = useState<Invoice[]>([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('myInvoices'); // Changed default tab to reflect new data
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    if (user) {
      fetchBillingData();
    }
  }, [user, dateRange]);

  const fetchBillingData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (!clientData) {
        setLoading(false);
        return;
      }

      let invoiceQuery = supabase
        .from('invoices') // Changed from 'transactions'
        .select(`
          *,
          service_order:service_orders(title, description),
          client:clients!invoices_client_id_fkey(profile:user_profiles(full_name)),
          consultant:user_profiles!service_orders_consultant_id_fkey(full_name)
        `)
        .eq('client_id', clientData.id)
        .order('created_at', { ascending: false });

      if (dateRange !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch (dateRange) {
          case 'last30Days':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'last90Days':
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            break;
          case 'thisYear':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date(0);
        }
        
        invoiceQuery = invoiceQuery.gte('created_at', startDate.toISOString());
      }

      const { data: fetchedInvoiceRecords, error: invoiceError } = await invoiceQuery;

      if (invoiceError) {
        console.error('Error fetching invoices:', invoiceError);
      } else {
        setInvoiceRecords(fetchedInvoiceRecords || []);
      }

    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Renamed and updated status color function for invoices
  const getInvoiceRecordStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Removed getTransactionStatusColor and getTransactionTypeIcon as they are no longer applicable

  const totalSpent = invoiceRecords
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount_due, 0);

  const pendingAmount = invoiceRecords
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount_due, 0);

  if (loading) {
    return (
      <ClientLayout>
        <Helmet>
          <title>Billing - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Helmet>
        <title>Billing - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Billing & Payments</h1>
            <p className="text-gray-600">Manage your payments and billing history</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="last90Days">Last 90 Days</option>
              <option value="thisYear">This Year</option>
            </select>
            <Button variant="outline" icon={Download}>
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(totalSpent)}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(pendingAmount)}
            </div>
            <div className="text-sm text-gray-600">Pending Payments</div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {invoiceRecords.length}
            </div>
            <div className="text-sm text-gray-600">Total Invoices</div>
          </Card.Body>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'myInvoices', label: 'My Invoices', count: invoiceRecords.length },
              // Mock data olan 'invoices' tabı kaldırıldı.
              // { id: 'mockInvoices', label: 'Mock Invoices', count: invoices.length }, 
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
                <span>{tab.label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* My Invoices Tab (formerly Transactions Tab) */}
      {activeTab === 'myInvoices' && (
        <div>
          {invoiceRecords.length > 0 ? (
            <Card>
              <Card.Body className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Consultant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount Due
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Issued Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoiceRecords.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">🧾</span> {/* Invoice icon */}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {invoice.service_order?.title || 'Service Invoice'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {invoice.service_order?.description || invoice.memo || 'No description'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{invoice.consultant?.full_name || 'N/A'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {formatCurrency(invoice.amount_due)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {invoice.currency}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvoiceRecordStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(invoice.created_at)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {invoice.due_date ? formatDate(invoice.due_date) : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" icon={Download}>
                                Download
                              </Button>
                              {invoice.status === 'pending' && (
                                <Button size="sm" icon={CreditCard}>
                                  Pay Now
                                </Button>
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
            <Card>
              <Card.Body className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Invoices Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Your invoice history will appear here once you start ordering services
                </p>
                <Button icon={CreditCard}>
                  Browse Services
                </Button>
              </Card.Body>
            </Card>
          )}
        </div>
      )}

      {/* Mock Invoices Tab (kept for clarity, can be removed if not needed) */}
      {/* Bu kısım artık gerçek verilerle doldurulduğu için kaldırılabilir veya farklı bir amaçla kullanılabilir. */}
      {/* Eğer mock data'yı göstermeye devam etmek isterseniz, 'invoices' state'ini doldurmaya devam etmelisiniz. */}
      {/* Şu anki haliyle, 'invoices' state'i boş kalacağı için bu sekme her zaman "No Invoices Yet" gösterecektir. */}
      {/* activeTab === 'mockInvoices' && (
        <div>
          {invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <Card key={invoice.id}>
                  <Card.Body>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{invoice.invoice_number}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInvoiceStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{invoice.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Issued: {formatDate(invoice.issued_date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>Due: {formatDate(invoice.due_date)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 mb-2">
                          {formatCurrency(invoice.amount)}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" icon={Download}>
                            Download
                          </Button>
                          {invoice.status === 'pending' && (
                            <Button size="sm" icon={CreditCard}>
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Card.Body className="text-center py-12">
                <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Invoices Yet
                </h3>
                <p className="text-gray-600">
                  Invoices will appear here when services are ordered
                </p>
              </Card.Body>
            </Card>
          )}
        </div>
      )} */}
    </ClientLayout>
  );
};

export default ClientBilling;
