import React, { useState, useEffect } from 'react';
import { Calendar, Download, TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import { Card, Button } from '@consulting19/ui';
import { supabase } from '@consulting19/supabase';
import { useI18n } from '../../hooks/useI18n';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Helmet } from 'react-helmet-async';

interface FinancialKPIs {
  grossRevenue: number;
  netRevenue: number;
  mrr: number;
  arBalance: number;
  refunds: number;
  avgDealSize: number;
  winRate: number;
}

interface RevenueData {
  period: string;
  gross_revenue: number;
  net_revenue: number;
  platform_fee: number;
  consultant_payout: number;
  transaction_count: number;
}

interface ARAgingData {
  aging_bucket: string;
  invoice_count: number;
  total_amount: number;
}

interface ConsultantPayout {
  consultant_id: string;
  consultant_name: string;
  total_revenue: number;
  consultant_payout: number;
  order_count: number;
  avg_order_value: number;
}

const AdminFinancial = () => {
  const { t, formatCurrency, formatNumber } = useI18n();
  const [dateRange, setDateRange] = useState('last30Days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [kpis, setKpis] = useState<FinancialKPIs>({
    grossRevenue: 0,
    netRevenue: 0,
    mrr: 0,
    arBalance: 0,
    refunds: 0,
    avgDealSize: 0,
    winRate: 0,
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [arAging, setArAging] = useState<ARAgingData[]>([]);
  const [consultantPayouts, setConsultantPayouts] = useState<ConsultantPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchFinancialData();
  }, [dateRange, customStartDate, customEndDate]);

  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateRange) {
      case 'last7Days':
        return {
          start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          end: today
        };
      case 'last30Days':
        return {
          start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          end: today
        };
      case 'last90Days':
        return {
          start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
          end: today
        };
      case 'thisQuarter':
        const quarter = Math.floor(now.getMonth() / 3);
        return {
          start: new Date(now.getFullYear(), quarter * 3, 1),
          end: today
        };
      case 'customRange':
        return {
          start: new Date(customStartDate),
          end: new Date(customEndDate)
        };
      default:
        return {
          start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          end: today
        };
    }
  };

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const { start, end } = getDateRange();

      // Fetch revenue overview
      const { data: revenueOverview } = await supabase.rpc('admin_revenue_overview', {
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
        group_by: 'month'
      });

      if (revenueOverview) {
        setRevenueData(revenueOverview);
        
        // Calculate KPIs from revenue data
        const totals = revenueOverview.reduce((acc, curr) => ({
          grossRevenue: acc.grossRevenue + curr.gross_revenue,
          netRevenue: acc.netRevenue + curr.net_revenue,
          transactionCount: acc.transactionCount + curr.transaction_count,
        }), { grossRevenue: 0, netRevenue: 0, transactionCount: 0 });

        setKpis(prev => ({
          ...prev,
          grossRevenue: totals.grossRevenue,
          netRevenue: totals.netRevenue,
          avgDealSize: totals.transactionCount > 0 ? totals.grossRevenue / totals.transactionCount : 0,
        }));
      }

      // Fetch AR aging
      const { data: agingData } = await supabase.rpc('admin_ar_aging', {
        as_of_date: end.toISOString().split('T')[0]
      });

      if (agingData) {
        setArAging(agingData);
        const totalAR = agingData.reduce((sum, bucket) => sum + bucket.total_amount, 0);
        setKpis(prev => ({ ...prev, arBalance: totalAR }));
      }

      // Fetch consultant payouts
      const { data: payoutData } = await supabase.rpc('admin_payouts_by_consultant', {
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0]
      });

      if (payoutData) {
        setConsultantPayouts(payoutData);
      }

      // Log telemetry event
      await supabase.rpc('log_telemetry_event', {
        event_type: 'financial_report_viewed',
        event_data: { date_range: dateRange }
      });

    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvData = revenueData.map(row => ({
      Period: row.period,
      'Gross Revenue': row.gross_revenue,
      'Net Revenue': row.net_revenue,
      'Platform Fee': row.platform_fee,
      'Consultant Payout': row.consultant_payout,
      'Transaction Count': row.transaction_count,
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    // Log export action
    supabase.rpc('log_admin_action', {
      action_type: 'export',
      resource_type: 'financial_report',
      new_values: { date_range: dateRange, export_type: 'csv' }
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <Helmet>
          <title>{t('financial.title')} - Consulting19</title>
        </Helmet>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>{t('financial.title')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('financial.title')}</h1>
            <p className="text-gray-600">{t('financial.subtitle')}</p>
          </div>
          <Button onClick={exportToCSV} icon={Download}>
            {t('financial.export')}
          </Button>
        </div>

        {/* Date Range Selector */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <label className="text-sm font-medium text-gray-700">
                {t('financial.dateRange')}:
              </label>
              <div className="flex gap-2">
                {[
                  { key: 'last7Days', label: t('financial.last7Days') },
                  { key: 'last30Days', label: t('financial.last30Days') },
                  { key: 'last90Days', label: t('financial.last90Days') },
                  { key: 'thisQuarter', label: t('financial.thisQuarter') },
                  { key: 'customRange', label: t('financial.customRange') },
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => setDateRange(option.key)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      dateRange === option.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              {dateRange === 'customRange' && (
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'consultants', label: t('financial.breakdowns.byConsultant'), icon: Users },
              { id: 'aging', label: t('financial.aging.title'), icon: TrendingUp },
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
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <Card.Body className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(kpis.grossRevenue)}
                </div>
                <div className="text-sm text-gray-600">{t('financial.kpis.grossRevenue')}</div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(kpis.netRevenue)}
                </div>
                <div className="text-sm text-gray-600">{t('financial.kpis.netRevenue')}</div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(kpis.avgDealSize)}
                </div>
                <div className="text-sm text-gray-600">{t('financial.kpis.avgDealSize')}</div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(kpis.arBalance)}
                </div>
                <div className="text-sm text-gray-600">{t('financial.kpis.arBalance')}</div>
              </Card.Body>
            </Card>
          </div>

          {/* P&L Snapshot */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">{t('financial.pnl.title')}</h2>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('financial.pnl.revenue')}</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(kpis.grossRevenue)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('financial.pnl.platformFee')} (35%)</span>
                  <span className="font-semibold text-green-600">{formatCurrency(kpis.netRevenue)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('financial.pnl.consultantPayouts')} (65%)</span>
                  <span className="font-semibold text-blue-600">{formatCurrency(kpis.grossRevenue * 0.65)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('financial.pnl.pspFees')} (~3%)</span>
                  <span className="font-semibold text-red-600">{formatCurrency(kpis.grossRevenue * 0.03)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{t('financial.pnl.translationCosts')}</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(500)}</span>
                </div>
                <div className="flex justify-between items-center py-2 pt-4 border-t-2 border-gray-300">
                  <span className="font-semibold text-gray-900">{t('financial.pnl.netProfit')}</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(kpis.netRevenue - (kpis.grossRevenue * 0.03) - 500)}
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Revenue Chart */}
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
            </Card.Header>
            <Card.Body>
              {revenueData.length > 0 ? (
                <div className="space-y-4">
                  {revenueData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">{data.period}</div>
                        <div className="text-sm text-gray-600">
                          {formatNumber(data.transaction_count)} transactions
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(data.gross_revenue)}
                        </div>
                        <div className="text-sm text-green-600">
                          Net: {formatCurrency(data.net_revenue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{t('emptyStates.noData')}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Consultants Tab */}
      {activeTab === 'consultants' && (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">{t('financial.breakdowns.byConsultant')}</h2>
          </Card.Header>
          <Card.Body>
            {consultantPayouts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Consultant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payout (65%)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg Order
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {consultantPayouts.map((consultant) => (
                      <tr key={consultant.consultant_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {consultant.consultant_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(consultant.total_revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {formatCurrency(consultant.consultant_payout)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(consultant.order_count)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(consultant.avg_order_value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('emptyStates.noData')}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* AR Aging Tab */}
      {activeTab === 'aging' && (
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">{t('financial.aging.title')}</h2>
          </Card.Header>
          <Card.Body>
            {arAging.length > 0 ? (
              <div className="space-y-4">
                {arAging.map((bucket, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900">{bucket.aging_bucket}</div>
                      <div className="text-sm text-gray-600">
                        {formatNumber(bucket.invoice_count)} invoices
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(bucket.total_amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('emptyStates.noData')}</p>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </AdminLayout>
  );
};

export default AdminFinancial;