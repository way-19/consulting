import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Users,
  CheckSquare,
  FileText, 
  MessageSquare, 
  Calendar,
  Clock,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Target,
  BarChart3,
  Bell,
  DollarSign,
  Award,
  CheckCircle,
  AlertTriangle,
  Filter,
  Search,
  RefreshCw,
  Eye,
  X,
  FileX,
  CreditCard,
  Building,
  User,
  Globe,
  Phone,
  Mail,
  Activity,
  Plus,
  Edit3,
  ClockIcon,
  Calendar as CalendarIcon,
  Pause,
  Play,
  AlertOctagon,
  Info
} from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared/lib/supabase';

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  pendingClients: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  totalDocuments: number;
  pendingDocuments: number;
  unreadMessages: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  overduePayments: number;
  urgentAlerts: number;
  highPriorityAlerts: number;
}

interface ConsultantAlert {
  id: string;
  alert_type: string;
  priority: string;
  title: string;
  description: string;
  due_date?: string;
  created_at: string;
  is_read: boolean;
  is_resolved: boolean;
  snooze_until?: string;
  notes?: string;
  client?: {
    profile: {
      full_name: string;
    };
    company_name?: string;
  };
  metadata?: any;
}

interface RecentActivity {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
  client_name?: string;
}

const ConsultantDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    pendingClients: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalDocuments: 0,
    pendingDocuments: 0,
    unreadMessages: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    urgentAlerts: 0,
    highPriorityAlerts: 0
  });
  const [alerts, setAlerts] = useState<ConsultantAlert[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [alertFilter, setAlertFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState<ConsultantAlert | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [snoozeTime, setSnoozeTime] = useState('1');
  const [alertNotes, setAlertNotes] = useState('');
  const [updatingAlert, setUpdatingAlert] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
      fetchConsultantAlerts();
      fetchRecentActivity();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get consultant's clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, status')
        .eq('assigned_consultant_id', user?.id);

      if (clientsError) {
        console.error('Error fetching clients:', clientsError);
        setLoading(false);
        return;
      }

      const clients = clientsData || [];
      const clientIds = clients.map(c => c.id);

      // Calculate client stats
      const totalClients = clients.length;
      const activeClients = clients.filter(c => c.status === 'active').length;
      const pendingClients = clients.filter(c => c.status === 'pending').length;

      // Fetch task stats
      const [
        { count: tasksCount },
        { count: pendingTasksCount },
        { count: completedTasksCount }
      ] = await Promise.all([
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).in('status', ['todo', 'in_progress']),
        supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('consultant_id', user?.id).eq('status', 'completed')
      ]);

      // Fetch document stats
      const { count: documentsCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .in('client_id', clientIds);

      const { count: pendingDocumentsCount } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .in('client_id', clientIds)
        .eq('status', 'pending');

      // Fetch message stats
      const { count: unreadMessagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user?.id)
        .eq('is_read', false);

      // Fetch financial stats
      const { data: ordersData } = await supabase
        .from('service_orders')
        .select('total_amount, status, created_at')
        .eq('consultant_id', user?.id);

      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('amount_due, status, due_date')
        .in('client_id', clientIds);

      // Calculate financial metrics
      const totalRevenue = ordersData?.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total_amount, 0) || 0;
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyRevenue = ordersData?.filter(o => 
        o.status === 'completed' && new Date(o.created_at) >= thisMonth
      ).reduce((sum, o) => sum + o.total_amount, 0) || 0;
      
      const pendingPayments = invoicesData?.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount_due, 0) || 0;
      
      const today = new Date();
      const overduePayments = invoicesData?.filter(inv => 
        inv.status === 'pending' && inv.due_date && new Date(inv.due_date) < today
      ).reduce((sum, inv) => sum + inv.amount_due, 0) || 0;

      setStats({
        totalClients,
        activeClients,
        pendingClients,
        totalTasks: tasksCount || 0,
        pendingTasks: pendingTasksCount || 0,
        completedTasks: completedTasksCount || 0,
        totalDocuments: documentsCount || 0,
        pendingDocuments: pendingDocumentsCount || 0,
        unreadMessages: unreadMessagesCount || 0,
        totalRevenue,
        monthlyRevenue,
        pendingPayments,
        overduePayments,
        urgentAlerts: 0, // Will be calculated from alerts
        highPriorityAlerts: 0 // Will be calculated from alerts
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultantAlerts = async () => {
    try {
      setAlertsLoading(true);
      
      // Get client IDs for this consultant
      const { data: clientsData } = await supabase
        .from('clients')
        .select('id')
        .eq('assigned_consultant_id', user?.id);

      const clientIds = clientsData?.map(c => c.id) || [];

      // Fetch alerts from expected_documents
      const { data: expectedDocsAlerts, error: edError } = await supabase
        .from('expected_documents')
        .select(`
          id,
          document_type,
          due_date,
          is_submitted,
          notes,
          created_at,
          client:clients!expected_documents_client_id_fkey(
            profile:user_profiles!clients_profile_id_fkey(full_name),
            company_name
          )
        `)
        .eq('consultant_id', user?.id)
        .eq('is_submitted', false)
        .order('due_date', { ascending: true });

      if (edError) {
        console.error('Error fetching expected documents alerts:', edError);
        return;
      }

      const today = new Date();
      const edAlerts: ConsultantAlert[] = (expectedDocsAlerts || []).map(doc => {
        const dueDate = new Date(doc.due_date);
        const isOverdue = dueDate < today;
        const isUrgent = isOverdue || (dueDate.getTime() - today.getTime()) < (24 * 60 * 60 * 1000); // Due within 24 hours
        
        return {
          id: `ed-${doc.id}`,
          alert_type: 'document_due',
          priority: isOverdue ? 'urgent' : isUrgent ? 'high' : 'medium',
          title: `Document Due: ${doc.document_type}`,
          description: `${doc.client?.profile?.full_name || 'Client'} needs to submit ${doc.document_type} by ${dueDate.toLocaleDateString()}`,
          due_date: doc.due_date,
          created_at: doc.created_at,
          is_read: false,
          is_resolved: false,
          client: doc.client,
          metadata: { 
            document_type: doc.document_type, 
            notes: doc.notes,
            source_id: doc.id,
            is_overdue: isOverdue
          }
        };
      });

      // Fetch overdue invoice alerts
      const { data: invoiceAlerts, error: invError } = await supabase
        .from('invoices')
        .select(`
          id,
          amount_due,
          currency,
          status,
          due_date,
          created_at,
          client:clients!invoices_client_id_fkey(
            profile:user_profiles!clients_profile_id_fkey(full_name),
            company_name
          )
        `)
        .in('client_id', clientIds)
        .eq('status', 'pending')
        .lt('due_date', today.toISOString())
        .order('due_date', { ascending: true });

      if (invError) {
        console.error('Error fetching invoice alerts:', invError);
        return;
      }

      const invAlerts: ConsultantAlert[] = (invoiceAlerts || []).map(inv => ({
        id: `inv-${inv.id}`,
        alert_type: 'payment_overdue',
        priority: 'urgent',
        title: `Overdue Payment: $${inv.amount_due} ${inv.currency}`,
        description: `${inv.client?.profile?.full_name || 'Client'} has an overdue invoice of $${inv.amount_due} ${inv.currency} due on ${new Date(inv.due_date).toLocaleDateString()}`,
        due_date: inv.due_date,
        created_at: inv.created_at,
        is_read: false,
        is_resolved: false,
        client: inv.client,
        metadata: { 
          amount: inv.amount_due, 
          currency: inv.currency,
          source_id: inv.id,
          invoice_id: inv.id
        }
      }));

      // Check which alerts are already resolved or snoozed
      const allAlertIds = [...edAlerts, ...invAlerts].map(alert => ({
        source_id: alert.metadata.source_id,
        type: alert.alert_type
      }));

      const { data: resolvedAlertsData } = await supabase
        .from('consultant_alerts')
        .select('alert_source_id, alert_type, is_resolved, snooze_until, notes')
        .eq('consultant_id', user?.id)
        .or(
          allAlertIds.map(alert => `and(alert_source_id.eq.${alert.source_id},alert_type.eq.${alert.type})`).join(',')
        );

      const resolvedAlertsMap = new Map(
        resolvedAlertsData?.map(ra => [
          `${ra.alert_source_id}-${ra.alert_type}`, 
          { 
            is_resolved: ra.is_resolved, 
            snooze_until: ra.snooze_until,
            notes: ra.notes
          }
        ])
      );

      const now = new Date();
      const filteredAlerts = [...edAlerts, ...invAlerts]
        .map(alert => {
          const resolvedInfo = resolvedAlertsMap.get(`${alert.metadata.source_id}-${alert.alert_type}`);
          return {
            ...alert,
            is_resolved: resolvedInfo?.is_resolved || false,
            snooze_until: resolvedInfo?.snooze_until,
            notes: resolvedInfo?.notes || ''
          };
        })
        .filter(alert => {
          // Filter out resolved alerts
          if (alert.is_resolved) return false;
          
          // Filter out snoozed alerts (if snooze_until is in the future)
          if (alert.snooze_until && new Date(alert.snooze_until) > now) return false;
          
          return true;
        })
        .sort((a, b) => {
          // Sort by priority: urgent > high > medium > low
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          
          if (priorityA !== priorityB) return priorityB - priorityA;
          
          // Then by creation date (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      
      setAlerts(filteredAlerts);

      // Update stats with alert counts
      setStats(prevStats => ({
        ...prevStats,
        urgentAlerts: filteredAlerts.filter(a => a.priority === 'urgent').length,
        highPriorityAlerts: filteredAlerts.filter(a => a.priority === 'high').length
      }));

    } catch (err) {
      console.error('Error fetching consultant alerts:', err);
    } finally {
      setAlertsLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data: activityData } = await supabase
        .from('audit_logs')
        .select(`
          id,
          action_type,
          description,
          created_at,
          user_id,
          payload
        `)
        .in('action_type', ['task_created', 'document_uploaded', 'service_ordered', 'profile_updated', 'payment_completed'])
        .order('created_at', { ascending: false })
        .limit(8);

      if (activityData) {
        // Get user names for the activities
        const enrichedActivity = await Promise.all(
          activityData.map(async (log) => {
            try {
              const { data: userData } = await supabase
                .from('user_profiles')
                .select('full_name, role')
                .eq('id', log.user_id)
                .single();

              return {
                id: log.id,
                action_type: log.action_type,
                description: log.description,
                created_at: log.created_at,
                client_name: userData?.full_name || 'System'
              };
            } catch (err) {
              return {
                id: log.id,
                action_type: log.action_type,
                description: log.description,
                created_at: log.created_at,
                client_name: 'System'
              };
            }
          })
        );

        setRecentActivity(enrichedActivity);
      }
    } catch (err) {
      console.error('Error fetching recent activity:', err);
    }
  };

  const handleMarkAlertAsResolved = async (alert: ConsultantAlert) => {
    try {
      setUpdatingAlert(true);
      
      await supabase
        .from('consultant_alerts')
        .upsert({ 
          consultant_id: user?.id,
          alert_source_id: alert.metadata.source_id,
          alert_type: alert.alert_type,
          is_resolved: true,
          resolved_at: new Date().toISOString(),
          notes: alertNotes || alert.notes || null
        }, { onConflict: 'consultant_id,alert_source_id,alert_type' });

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'alert_resolved',
          description: `Resolved alert: ${alert.title}`,
          payload: { 
            alert_id: alert.id,
            alert_type: alert.alert_type,
            source_id: alert.metadata.source_id
          }
        });

      // Refresh alerts
      fetchConsultantAlerts();
      setShowAlertModal(false);
      setSelectedAlert(null);
      setAlertNotes('');
      
    } catch (err) {
      console.error('Error marking alert as resolved:', err);
    } finally {
      setUpdatingAlert(false);
    }
  };

  const handleSnoozeAlert = async (alert: ConsultantAlert, days: number) => {
    try {
      const snoozeUntil = new Date();
      snoozeUntil.setDate(snoozeUntil.getDate() + days);

      await supabase
        .from('consultant_alerts')
        .upsert({ 
          consultant_id: user?.id,
          alert_source_id: alert.metadata.source_id,
          alert_type: alert.alert_type,
          is_resolved: false,
          snooze_until: snoozeUntil.toISOString(),
          notes: alertNotes || alert.notes || null
        }, { onConflict: 'consultant_id,alert_source_id,alert_type' });

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'alert_snoozed',
          description: `Snoozed alert for ${days} days: ${alert.title}`,
          payload: { 
            alert_id: alert.id,
            alert_type: alert.alert_type,
            snooze_days: days,
            source_id: alert.metadata.source_id
          }
        });

      // Refresh alerts
      fetchConsultantAlerts();
      setShowAlertModal(false);
      setSelectedAlert(null);
      setAlertNotes('');
      
    } catch (err) {
      console.error('Error snoozing alert:', err);
    }
  };

  const openAlertModal = (alert: ConsultantAlert) => {
    setSelectedAlert(alert);
    setAlertNotes(alert.notes || '');
    setShowAlertModal(true);
  };

  const getAlertIcon = (alertType: string, priority: string) => {
    switch (alertType) {
      case 'document_due':
        return priority === 'urgent' ? 
          <FileX className="w-5 h-5 text-red-600 animate-pulse" /> : 
          <FileText className="w-5 h-5 text-orange-600" />;
      case 'payment_overdue':
        return <CreditCard className="w-5 h-5 text-red-600 animate-bounce" />;
      case 'task_assigned':
        return <CheckSquare className="w-5 h-5 text-blue-600" />;
      case 'client_inactive':
        return <AlertOctagon className="w-5 h-5 text-yellow-600" />;
      case 'document_uploaded':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'service_ordered':
        return <DollarSign className="w-5 h-5 text-blue-600" />;
      case 'message_received':
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertBgColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-red-200 hover:bg-red-100 shadow-red-100';
      case 'high':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100 shadow-orange-100';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
      case 'low':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (alertFilter === 'all') return true;
    if (alertFilter === 'urgent') return alert.priority === 'urgent';
    if (alertFilter === 'high') return alert.priority === 'high';
    if (alertFilter === 'documents') return alert.alert_type === 'document_due';
    if (alertFilter === 'payments') return alert.alert_type === 'payment_overdue';
    if (alertFilter === 'tasks') return alert.alert_type === 'task_assigned';
    if (alertFilter === 'messages') return alert.alert_type === 'message_received';
    return true;
  });

  const displayedAlerts = showAllAlerts ? filteredAlerts : filteredAlerts.slice(0, 5);

  const statCards = [
    {
      title: 'Total Clients',
      value: stats.totalClients.toString(),
      icon: Users,
      color: 'blue',
      href: '/clients',
      change: `${stats.activeClients} active`,
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Tasks',
      value: stats.pendingTasks.toString(),
      icon: CheckSquare,
      color: 'orange',
      href: '/tasks',
      change: `${stats.completedTasks} completed`,
      changeType: 'neutral' as const,
    },
    {
      title: 'Pending Documents',
      value: stats.pendingDocuments.toString(),
      icon: FileText,
      color: 'purple',
      href: '/documents',
      change: `${stats.totalDocuments} total`,
      changeType: 'neutral' as const,
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      href: '/financial',
      change: `$${stats.totalRevenue.toLocaleString()} total`,
      changeType: 'positive' as const,
    },
  ];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Consultant Portal</title>
        </Helmet>
        
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <title>Dashboard - Consultant Portal</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile?.full_name || user?.user_metadata?.full_name || 'Consultant'}!
              </h1>
              <p className="text-gray-600 text-lg">Manage your clients and track your consulting business</p>
            </div>
            <div className="hidden md:block">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-medium text-gray-900">Expert Consultant</div>
                <div className="text-xs text-gray-600">{stats.totalClients} active clients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        {(stats.urgentAlerts > 0 || stats.highPriorityAlerts > 0) && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Action Required</h3>
                  <p className="text-red-800">
                    You have {stats.urgentAlerts} urgent and {stats.highPriorityAlerts} high priority alerts
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAllAlerts(true)}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All Alerts
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.href} className="group">
              <Card hover className="h-full transition-all duration-200 group-hover:shadow-xl">
                <Card.Body>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <div className="flex items-center">
                      <TrendingUp className={`w-4 h-4 mr-1 ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`} />
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consultant Alerts */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-gray-900">🚨 Consultant Alerts</h2>
                    {alerts.length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {alerts.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <select
                      value={alertFilter}
                      onChange={(e) => setAlertFilter(e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="all">All Alerts</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High Priority</option>
                      <option value="documents">Document Alerts</option>
                      <option value="payments">Payment Alerts</option>
                    </select>
                    <button
                      onClick={fetchConsultantAlerts}
                      disabled={alertsLoading}
                      className="p-2 text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${alertsLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                {displayedAlerts.length > 0 ? (
                  <div className="space-y-3">
                    {displayedAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`border-2 rounded-xl p-5 transition-all duration-300 cursor-pointer group ${getAlertBgColor(alert.priority)} hover:shadow-lg hover:scale-[1.02] transform`}
                        onClick={() => openAlertModal(alert)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-lg bg-white/50 group-hover:bg-white/80 transition-colors">
                              {getAlertIcon(alert.alert_type, alert.priority)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">{alert.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                                  {alert.priority.toUpperCase()}
                                </span>
                                {alert.metadata?.is_overdue && (
                                  <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                                    OVERDUE
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700 mb-3 leading-relaxed">{alert.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-600">
                                {alert.client && (
                                  <span className="flex items-center">
                                    <User className="w-3 h-3 mr-1" />
                                    {alert.client.profile?.full_name}
                                  </span>
                                )}
                                {alert.client?.company_name && (
                                  <span className="flex items-center">
                                    <Building className="w-3 h-3 mr-1" />
                                    {alert.client.company_name}
                                  </span>
                                )}
                                {alert.due_date && (
                                  <span className="flex items-center">
                                    <CalendarIcon className="w-3 h-3 mr-1" />
                                    <span className={new Date(alert.due_date) < new Date() ? 'text-red-600 font-semibold' : ''}>
                                      Due: {new Date(alert.due_date).toLocaleDateString()}
                                    </span>
                                  </span>
                                )}
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {new Date(alert.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              
                              {/* Quick Actions */}
                              <div className="flex items-center space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAlertAsResolved(alert);
                                  }}
                                  className="px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors flex items-center space-x-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Resolve</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSnoozeAlert(alert, 1);
                                  }}
                                  className="px-3 py-1 bg-gray-500 text-white rounded-full text-xs hover:bg-gray-600 transition-colors flex items-center space-x-1"
                                >
                                  <Pause className="w-3 h-3" />
                                  <span>1d</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Navigate to relevant section based on alert type
                                    if (alert.alert_type === 'document_due') {
                                      window.location.href = '/documents';
                                    } else if (alert.alert_type === 'payment_overdue') {
                                      window.location.href = '/financial';
                                    } else if (alert.alert_type === 'task_assigned') {
                                      window.location.href = '/tasks';
                                    }
                                  }}
                                  className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition-colors flex items-center space-x-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>View</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {filteredAlerts.length > 5 && !showAllAlerts && (
                      <button
                        onClick={() => setShowAllAlerts(true)}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Show {filteredAlerts.length - 5} more alerts
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="relative">
                      <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4 animate-pulse" />
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-green-100 rounded-full animate-ping opacity-20"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">🎉 All Clear!</h3>
                    <p className="text-gray-600 mb-4">No urgent alerts at the moment. Great work!</p>
                    <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <Star className="w-4 h-4 mr-2" />
                      Your clients are up to date
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </Card.Header>
              <Card.Body>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <Activity className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{activity.client_name}</span>
                            <span>•</span>
                            <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
                    <p className="text-gray-600">Recent client activities will appear here</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <p className="text-gray-600">Common tasks and shortcuts</p>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Add Client', href: '/clients', icon: Users, color: 'blue' },
                { label: 'Create Task', href: '/tasks', icon: CheckSquare, color: 'green' },
                { label: 'Send Message', href: '/messages', icon: MessageSquare, color: 'purple' },
                { label: 'Schedule Meeting', href: '/availability', icon: Calendar, color: 'orange' },
                { label: 'Review Documents', href: '/documents', icon: FileText, color: 'indigo' },
                { label: 'View Earnings', href: '/financial', icon: DollarSign, color: 'emerald' },
              ].map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="group flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{action.label}</span>
                </Link>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Financial Overview */}
        {stats.totalRevenue > 0 && (
          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
              <p className="text-gray-600">Your earnings and commission tracking</p>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">${stats.totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-green-800">Total Revenue</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">${stats.monthlyRevenue.toLocaleString()}</div>
                  <div className="text-sm text-blue-800">This Month</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 mb-1">${stats.pendingPayments.toLocaleString()}</div>
                  <div className="text-sm text-yellow-800">Pending</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-1">${stats.overduePayments.toLocaleString()}</div>
                  <div className="text-sm text-red-800">Overdue</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Alert Details Modal */}
        {showAlertModal && selectedAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getAlertIcon(selectedAlert.alert_type, selectedAlert.priority)}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Alert Details</h2>
                    <p className="text-sm text-gray-600">Manage and resolve this alert</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedAlert.priority)}`}>
                  {selectedAlert.priority.toUpperCase()} PRIORITY
                </span>
                <button
                  onClick={() => {
                    setShowAlertModal(false);
                    setSelectedAlert(null);
                    setAlertNotes('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Alert Information */}
                <div className={`rounded-xl p-6 border-2 ${getAlertBgColor(selectedAlert.priority)}`}>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-600" />
                    Alert Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <div className="mt-1 font-medium text-gray-900 flex items-center">
                        {getAlertIcon(selectedAlert.alert_type, selectedAlert.priority)}
                        <span className="ml-2 capitalize">{selectedAlert.alert_type.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Priority:</span>
                      <div className="mt-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedAlert.priority)}`}>
                          {selectedAlert.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Client:</span>
                      <div className="mt-1 font-medium text-gray-900">
                        {selectedAlert.client?.profile?.full_name || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Company:</span>
                      <div className="mt-1 font-medium text-gray-900">
                        {selectedAlert.client?.company_name || 'N/A'}
                      </div>
                    </div>
                    {selectedAlert.due_date && (
                      <div>
                        <span className="text-gray-600">Due Date:</span>
                        <div className={`mt-1 font-medium ${
                          new Date(selectedAlert.due_date) < new Date() 
                            ? 'text-red-600 font-bold' 
                            : 'text-gray-900'
                        }`}>
                          {new Date(selectedAlert.due_date).toLocaleDateString()}
                          {new Date(selectedAlert.due_date) < new Date() && (
                            <span className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs animate-pulse">
                              OVERDUE
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <div className="mt-1 font-medium text-gray-900">
                        {selectedAlert.priority.toUpperCase()}
                        {new Date(selectedAlert.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert Description */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-purple-600" />
                    Description & Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-800 leading-relaxed">{selectedAlert.description}</p>
                  </div>
                </div>

                {/* Additional Details */}
                {selectedAlert.metadata && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-indigo-600" />
                      Additional Details
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      {selectedAlert.alert_type === 'document_due' && (
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span><strong>Document Type:</strong> {selectedAlert.metadata.document_type}</span>
                          </div>
                          {selectedAlert.metadata.is_overdue && (
                            <div className="flex items-center space-x-2 text-red-600 font-bold bg-red-100 border border-red-200 rounded-lg p-2">
                              <AlertTriangle className="w-4 h-4" />
                              <span>⚠️ This document is overdue and requires immediate attention</span>
                            </div>
                          )}
                          {selectedAlert.metadata.notes && (
                            <div className="flex items-start space-x-2 bg-white rounded-lg p-3 border border-blue-200">
                              <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                              <div>
                                <span className="font-semibold">Notes:</span>
                                <p className="text-gray-700 mt-1">{selectedAlert.metadata.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {selectedAlert.alert_type === 'payment_overdue' && (
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <span><strong>Amount:</strong> 
                              <span className="text-lg font-bold text-red-600 ml-2">
                                ${selectedAlert.metadata.amount} {selectedAlert.metadata.currency}
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CreditCard className="w-4 h-4 text-blue-600" />
                            <span><strong>Invoice ID:</strong> {selectedAlert.metadata.invoice_id}</span>
                          </div>
                          <div className="bg-red-100 border border-red-200 rounded-lg p-3 text-red-800">
                            <div className="flex items-center space-x-2">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="font-semibold">Payment overdue - immediate action required</span>
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedAlert.alert_type === 'task_assigned' && (
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                            <span><strong>Task:</strong> {selectedAlert.metadata.task_title || 'New Task'}</span>
                          </div>
                          {selectedAlert.metadata.priority && (
                            <div className="flex items-center space-x-2">
                              <Target className="w-4 h-4 text-blue-600" />
                              <span><strong>Priority:</strong> {selectedAlert.metadata.priority}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Edit3 className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Notes & Comments</h3>
                  </div>
                  {selectedAlert.notes && (
                    <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="text-sm font-semibold text-yellow-900 mb-1">Existing Notes:</h4>
                      <p className="text-sm text-yellow-800">{selectedAlert.notes}</p>
                    </div>
                  )}
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add New Notes
                  </label>
                  <textarea
                    value={alertNotes}
                    onChange={(e) => setAlertNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Add notes about how you resolved this alert, next steps, or any observations..."
                  />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleMarkAlertAsResolved(selectedAlert)}
                    disabled={updatingAlert}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                  >
                    {updatingAlert ? (
                    <option value="tasks">Task Alerts</option>
                    <option value="messages">Message Alerts</option>
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                        Resolving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 inline" />
                        ✅ Mark as Resolved
                      </>
                    )}
                  </button>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Snooze Duration
                      </label>
                      <select
                        value={snoozeTime}
                        onChange={(e) => setSnoozeTime(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="1">1 day</option>
                        <option value="3">3 days</option>
                        <option value="7">1 week</option>
                        <option value="14">2 weeks</option>
                        <option value="30">1 month</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleSnoozeAlert(selectedAlert, Number(snoozeTime))}
                      className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 shadow-lg font-semibold"
                    >
                      <Pause className="w-4 h-4 mr-2 inline" />
                      ⏰ Snooze for {snoozeTime} {Number(snoozeTime) === 1 ? 'day' : 'days'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ConsultantDashboard;