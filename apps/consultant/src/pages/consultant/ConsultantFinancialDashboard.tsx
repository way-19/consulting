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
}