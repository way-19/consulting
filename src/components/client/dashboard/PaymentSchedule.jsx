import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  DollarSign,
  RefreshCw,
  Eye,
  ExternalLink
} from 'lucide-react';

const PaymentSchedule = ({ clientId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, overdue, paid

  useEffect(() => {
    loadPayments();
  }, [clientId]);

  const loadPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('client_payment_schedules')
        .select(`
          *,
          countries(name, flag_emoji),
          consultant:users!client_payment_schedules_consultant_id_fkey(first_name, last_name)
        `)
        .eq('client_id', clientId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = (payment) => {
    const today = new Date();
    const dueDate = new Date(payment.due_date);
    
    if (payment.status === 'paid') return 'paid';
    if (dueDate < today) return 'overdue';
    if (dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) return 'due_soon';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'due_soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'overdue': return AlertCircle;
      case 'due_soon': return Clock;
      default: return Calendar;
    }
  };

  const getPaymentTypeLabel = (type) => {
    const labels = {
      'accounting_fee': 'Muhasebe Ücreti',
      'tax_payment': 'Vergi Ödemesi',
      'virtual_address': 'Sanal Adres',
      'legal_fee': 'Hukuki Danışmanlık',
      'company_maintenance': 'Şirket Bakım',
      'compliance_fee': 'Uyumluluk Ücreti'
    };
    return labels[type] || type;
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    const status = getPaymentStatus(payment);
    return filter === status;
  });

  const upcomingTotal = payments
    .filter(p => getPaymentStatus(p) === 'pending' || getPaymentStatus(p) === 'due_soon')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const overdueTotal = payments
    .filter(p => getPaymentStatus(p) === 'overdue')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
          Ödeme Takibi
        </h2>
        <button
          onClick={loadPayments}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Yaklaşan Ödemeler</p>
              <p className="text-2xl font-bold text-blue-900">${upcomingTotal.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-700">Geciken Ödemeler</p>
              <p className="text-2xl font-bold text-red-900">${overdueTotal.toFixed(2)}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Bu Ay Ödenen</p>
              <p className="text-2xl font-bold text-green-900">
                ${payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.amount), 0).toFixed(2)}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'all', label: 'Tümü' },
          { key: 'pending', label: 'Bekleyen' },
          { key: 'due_soon', label: 'Yaklaşan' },
          { key: 'overdue', label: 'Geciken' },
          { key: 'paid', label: 'Ödenen' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payment List */}
      <div className="space-y-4">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Bu kategoride ödeme bulunmuyor.</p>
          </div>
        ) : (
          filteredPayments.map((payment) => {
            const status = getPaymentStatus(payment);
            const StatusIcon = getStatusIcon(status);
            
            return (
              <div
                key={payment.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      status === 'paid' ? 'bg-green-100' :
                      status === 'overdue' ? 'bg-red-100' :
                      status === 'due_soon' ? 'bg-yellow-100' :
                      'bg-blue-100'
                    }`}>
                      <StatusIcon className={`h-6 w-6 ${
                        status === 'paid' ? 'text-green-600' :
                        status === 'overdue' ? 'text-red-600' :
                        status === 'due_soon' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {getPaymentTypeLabel(payment.payment_type)}
                        </h3>
                        {payment.countries && (
                          <span className="text-lg">{payment.countries.flag_emoji}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          Vade: {new Date(payment.due_date).toLocaleDateString('tr-TR')}
                        </span>
                        {payment.consultant && (
                          <span className="text-sm text-gray-500">
                            Danışman: {payment.consultant.first_name} {payment.consultant.last_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${payment.amount} {payment.currency}
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {status === 'paid' ? 'Ödendi' :
                       status === 'overdue' ? 'Gecikti' :
                       status === 'due_soon' ? 'Yaklaşan' :
                       'Bekliyor'}
                    </span>
                    {payment.recurring && (
                      <div className="text-xs text-gray-500 mt-1">
                        <RefreshCw className="h-3 w-3 inline mr-1" />
                        Tekrarlanan
                      </div>
                    )}
                  </div>
                </div>

                {status !== 'paid' && (
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Öde
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 py-3 px-4 rounded-xl hover:bg-blue-100 transition-colors">
            <CreditCard className="h-5 w-5" />
            <span>Ödeme Yöntemi Ekle</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-gray-50 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors">
            <ExternalLink className="h-5 w-5" />
            <span>Ödeme Geçmişi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;