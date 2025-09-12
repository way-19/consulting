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
  Star,
  FileText
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-orange-900 mb-2">Document Alerts</h3>
              <p className="text-sm text-orange-700 mb-4">Gelen döküman uyarıları</p>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                View Alerts
              </button>
            </div>

            <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            profile:user_profiles!clients_profile_id_fkey(full_name),