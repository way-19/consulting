import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Target,
  RefreshCw,
  Building,
  CreditCard,
  Percent,
  Bell,
  ExternalLink,
  Download,
  Users,
  Award,
  Star
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface FinancialStats {
  total_revenue: number;
  monthly_revenue: number;
  commission_earned: number;
  pending_commission: number;
  avg_order_value: number;
  total_orders: number;
  completed_orders: number;
  conversion_rate: number;
  client_count: number;
  active_clients: number;
}

interface ServiceOrder {
  id: string;
  title: string;
  description?: string;
  total_amount: number;
  currency: string;
  status: string;
  consultant_commission_amount: number;
  system_commission_amount: number;
  created_at: string;
  client: {
    profile: {
      full_name: string;
    };
    company_name?: string;
  };
}

interface CommissionBreakdown {
  total_earned: number;
  this_month: number;
  last_month: number;
  pending: number;
  rate: number;
  currency: string;
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

const ConsultantFinancialDashboard = () => {
  const { user, profile } = useAuth();
  const [financialStats, setFinancialStats] = useState<FinancialStats>({
    total_revenue: 0,
    monthly_revenue: 0,
    commission_earned: 0,
    pending_commission: 0,
    avg_order_value: 0,
    total_orders: 0,
    completed_orders: 0,
    conversion_rate: 0,
    client_count: 0,
    active_clients: 0
  });
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [commissionBreakdown, setCommissionBreakdown] = useState<CommissionBreakdown>({
    total_earned: 0,
    this_month: 0,
    last_month: 0,
    pending: 0,
    rate: 65,
    currency: 'USD'
  });
  const [accountingFees, setAccountingFees] = useState<AccountingFee[]>([]);
  const [virtualOfficeFees, setVirtualOfficeFees] = useState<VirtualOfficeFee[]>([]);
  const [taxNotifications, setTaxNotifications] = useState<TaxNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('this_month');
  const [payingFee, setPayingFee] = useState<string | null>(null);

  // Auto-resolve payment alerts when viewing financial dashboard
  const resolvePaymentAlerts = async () => {
    if (!user?.id) return;
    try {
      // Resolve payment_overdue alerts when consultant views financial dashboard
      await supabase
        .from('consultant_alerts')
        .update({ 
          is_resolved: true,
          resolved_at: new Date().toISOString()
        })
        .eq('consultant_id', user.id)
        .eq('alert_type', 'payment_overdue')
        .eq('is_resolved', false);

      console.log('✅ Payment alerts resolved');
    } catch (err) {
      console.error('Error resolving payment alerts:', err);
    }
  };

  useEffect(() => {
    if (user && profile) {
      fetchFinancialData();
      resolvePaymentAlerts();
    }
  }, [user, profile, dateRange]);

  const fetchFinancialData = async () => {
    // Implementation will be added later
    setLoading(false);
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Financial Dashboard - Consultant</title>
      </Helmet>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
        <p className="text-gray-600">Track your earnings, commissions, and financial performance</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${financialStats.total_revenue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Commission Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${financialStats.commission_earned.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {financialStats.active_clients}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {financialStats.completed_orders}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantFinancialDashboard;