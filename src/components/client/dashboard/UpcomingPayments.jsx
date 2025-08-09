import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Bell,
  RefreshCw
} from 'lucide-react';

const UpcomingPayments = ({ clientId }) => {
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (clientId) {
      loadUpcomingPayments();
    }
  }, [clientId]);

  const loadUpcomingPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const today = new Date();
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      console.log('Loading payments for client:', clientId);

      const { data, error } = await supabase
        .from('client_payment_schedules')
        .select(`
          *,
          countries(name, flag_emoji),
          consultant:users!client_payment_schedules_consultant_id_fkey(first_name, last_name)
        `)
        .eq('client_id', clientId)
        .neq('status', 'paid')
        .lte('due_date', nextMonth.toISOString().split('T')[0])
        .order('due_date', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Loaded payments:', data);
      setUpcomingPayments(data || []);
    } catch (error) {
      console.error('Error loading upcoming payments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentUrgency = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'urgent';
    if (daysUntilDue <= 7) return 'soon';
    return 'upcoming';
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'soon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'overdue': return AlertTriangle;
      case 'urgent': return Bell;
      case 'soon': return Clock;
      default: Calendar;
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

  const totalAmount = upcomingPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
            Yaklaşan Ödemelerim
          </h2>
        </div>
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

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
            Yaklaşan Ödemelerim
          </h2>
          <button
            onClick={loadUpcomingPayments}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Veri Yüklenirken Hata</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadUpcomingPayments}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <CreditCard className="h-6 w-6 mr-3 text-blue-600" />
          Yaklaşan Ödemelerim
        </h2>
        <div className="flex items-center space-x-3">
          {upcomingPayments.length > 0 && (
            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {upcomingPayments.length} ödeme
            </div>
          )}
          <button
            onClick={loadUpcomingPayments}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Summary Card */}
      {upcomingPayments.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Toplam Yaklaşan Ödemeler</h3>
              <p className="text-3xl font-bold text-blue-900">${totalAmount.toFixed(2)}</p>
              <p className="text-sm text-blue-700 mt-1">Önümüzdeki 30 gün içinde</p>
            </div>
            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* Payment List */}
      <div className="space-y-4">
        {upcomingPayments.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Yaklaşan Ödeme Yok</h3>
            <p className="text-gray-600 mb-4">Önümüzdeki 30 gün içinde ödemeniz gereken bir tutar bulunmuyor.</p>
            <div className="text-sm text-gray-500">
              <p>Client ID: {clientId}</p>
              <p>Bu ID için ödeme kayıtları aranıyor...</p>
            </div>
          </div>
        ) : (
          upcomingPayments.map((payment) => {
            const urgency = getPaymentUrgency(payment.due_date);
            const UrgencyIcon = getUrgencyIcon(urgency);
            const daysUntilDue = Math.ceil((new Date(payment.due_date) - new Date()) / (1000 * 60 * 60 * 24));
            
            return (
              <div
                key={payment.id}
                className={`border rounded-xl p-4 ${getUrgencyColor(urgency)} hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      urgency === 'overdue' ? 'bg-red-200' :
                      urgency === 'urgent' ? 'bg-orange-200' :
                      urgency === 'soon' ? 'bg-yellow-200' :
                      'bg-blue-200'
                    }`}>
                      <UrgencyIcon className={`h-6 w-6 ${
                        urgency === 'overdue' ? 'text-red-600' :
                        urgency === 'urgent' ? 'text-orange-600' :
                        urgency === 'soon' ? 'text-yellow-600' :
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
                        {payment.recurring && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                            Tekrarlanan
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          Vade: {new Date(payment.due_date).toLocaleDateString('tr-TR')}
                        </span>
                        <span className={`text-sm font-medium ${
                          urgency === 'overdue' ? 'text-red-600' :
                          urgency === 'urgent' ? 'text-orange-600' :
                          urgency === 'soon' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`}>
                          {urgency === 'overdue' ? `${Math.abs(daysUntilDue)} gün gecikti` :
                           urgency === 'urgent' ? `${daysUntilDue} gün kaldı` :
                           urgency === 'soon' ? `${daysUntilDue} gün kaldı` :
                           `${daysUntilDue} gün kaldı`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">
                      ${payment.amount} {payment.currency}
                    </div>
                    <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-2">
                      <span>Öde</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions */}
      {upcomingPayments.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium">
              Tüm Ödemeleri Görüntüle
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors font-medium">
              Ödeme Yöntemi Ekle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingPayments;