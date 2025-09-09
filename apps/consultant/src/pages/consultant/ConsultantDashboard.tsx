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
  Mail
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
      // Fetch alerts from expected_documents and invoices
      const { data: expectedDocsAlerts, error: edError } = await supabase
        .from('expected_documents')
        .select(`
          id,
          document_type,
          due_date,
          is_submitted,
          notes,
          client:clients!expected_documents_client_id_fkey(
            profile:user_profiles(full_name),
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
      const edAlerts: ConsultantAlert[] = (expectedDocsAlerts || []).map(doc => ({
        id: doc.id,
        alert_type: 'document_due',
        priority: new Date(doc.due_date) < today ? 'urgent' : 'high',
        title: `Document Due: ${doc.document_type}`,
        description: `Client ${doc.client?.profile?.full_name || ''} (${doc.client?.company_name || ''}) needs to submit ${doc.document_type} by ${new Date(doc.due_date).toLocaleDateString()}`,
        due_date: doc.due_date,
        created_at: doc.created_at,
        is_read: false, // Assuming new alerts are unread
        is_resolved: false,
        client: doc.client,
        metadata: { document_type: doc.document_type, notes: doc.notes }
      }));

      // Fetch overdue invoice alerts
      const { data: invoiceAlerts, error: invError } = await supabase
        .from('invoices')
        .select(`
          id,
          amount_due,
          currency,
          status,
          due_date,
          client:clients!invoices_client_id_fkey(
            profile:user_profiles(full_name),
            company_name
          )
        `)
        .in('client_id', (await supabase.from('clients').select('id').eq('assigned_consultant_id', user?.id)).data?.map(c => c.id) || [])
        .eq('status', 'pending')
        .lt('due_date', today.toISOString())
        .order('due_date', { ascending: true });

      if (invError) {
        console.error('Error fetching invoice alerts:', invError);
        return;
      }

      const invAlerts: ConsultantAlert[] = (invoiceAlerts || []).map(inv => ({
        id: inv.id,
        alert_type: 'payment_overdue',
        priority: 'urgent',
        title: `Overdue Payment: $${inv.amount_due} ${inv.currency}`,
        description: `Client ${inv.client?.profile?.full_name || ''} (${inv.client?.company_name || ''}) has an overdue invoice due on ${new Date(inv.due_date).toLocaleDateString()}`,
        due_date: inv.due_date,
        created_at: inv.created_at,
        is_read: false,
        is_resolved: false,
        client: inv.client,
        metadata: { amount: inv.amount_due, currency: inv.currency }
      }));

      const allAlerts = [...edAlerts, ...invAlerts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setAlerts(allAlerts);

      // Update stats with alert counts
      setStats(prevStats => ({
        ...prevStats,
        urgentAlerts: allAlerts.filter(a => a.priority === 'urgent' && !a.is_resolved).length,
        highPriorityAlerts: allAlerts.filter(a => a.priority === 'high' && !a.is_resolved).length
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
          user_profiles!audit_logs_user_id_fkey(full_name)
        `)
        .in('action_type', ['client_profile_updated', 'task_created', 'document_uploaded', 'service_ordered', 'mail_forwarding_request_created'])
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityData) {
        setRecentActivity(activityData.map(log => ({
          id: log.id,
          action_type: log.action_type,
          description: log.description,
          created_at: log.created_at,
          client_name: log.user_profiles?.full_name || 'System'
        })));
      }
    } catch (err) {
      console.error('Error fetching recent activity:', err);
    }
  };

  const handleMarkAlertAsResolved = async (alertId: string) => {
    try {
      await supabase
        .from('consultant_alerts') // Assuming a new table for managing alerts state
        .upsert({ id: alertId, is_resolved: true }, { onConflict: 'id' });
      
      fetchConsultantAlerts(); // Refresh alerts
    } catch (err) {
      console.error('Error marking alert as resolved:', err);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'document_due': return <FileX className="w-5 h-5 text-orange-600" />;
      case 'payment_overdue': return <CreditCard className="w-5 h-5 text-red-600" />;
      case 'new_message': return <MessageSquare className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = alertFilter === 'all' || alert.priority === alertFilter;
    return matchesFilter && !alert.is_resolved;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Consultant Panel</title>
        </Helmet>
        
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
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
        <title>Dashboard - Consultant Panel</title>
      </Helmet>
      
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {profile?.full_name || user?.user_metadata?.full_name || 'Consultant'}!
              </h1>
              <p className="text-gray-600 text-lg">Your personalized consultant dashboard</p>
            </div>
            <div className="hidden md:block">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-2">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Consultant
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Link to="/clients" className="group">
            <Card hover className="h-full transition-all duration-200 group-hover:shadow-xl">
              <Card.Body>
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Clients</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{stats.totalClients}</p>
                  <div className="flex items-center">
                    <span className="text-xs md:text-sm font-medium text-green-600">
                      {stats.activeClients} Active, {stats.pendingClients} Pending
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Link>

          <Link to="/tasks" className="group">
            <Card hover className="h-full transition-all duration-200 group-hover:shadow-xl">
              <Card.Body>
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <CheckSquare className="w-6 h-6 text-orange-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Tasks</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{stats.totalTasks}</p>
                  <div className="flex items-center">
                    <span className="text-xs md:text-sm font-medium text-orange-600">
                      {stats.pendingTasks} Pending, {stats.completedTasks} Completed
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Link>

          <Link to="/documents" className="group">
            <Card hover className="h-full transition-all duration-200 group-hover:shadow-xl">
              <Card.Body>
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Documents</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{stats.totalDocuments}</p>
                  <div className="flex items-center">
                    <span className="text-xs md:text-sm font-medium text-green-600">
                      {stats.pendingDocuments} Pending Review
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Link>

          <Link to="/messages" className="group">
            <Card hover className="h-full transition-all duration-200 group-hover:shadow-xl">
              <Card.Body>
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Unread Messages</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{stats.unreadMessages}</p>
                  <div className="flex items-center">
                    <span className="text-xs md:text-sm font-medium text-purple-600">
                      Respond to clients
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </div>

        {/* Financial Overview */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
            <p className="text-gray-600">Your earnings and client payments</p>
          </Card.Header>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">${stats.totalRevenue.toLocaleString()}</div>
                <div className="text-sm text-green-800">Total Revenue</div>
                <div className="text-xs text-green-600 mt-1">(${stats.monthlyRevenue.toLocaleString()} this month)</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">${stats.pendingPayments.toLocaleString()}</div>
                <div className="text-sm text-yellow-800">Pending Payments</div>
                <div className="text-xs text-yellow-600 mt-1">(${stats.overduePayments.toLocaleString()} Overdue)</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{profile?.commission_rate || 0}%</div>
                <div className="text-sm text-blue-800">Your Commission Rate</div>
                <div className="text-xs text-blue-600 mt-1">View details in Financial tab</div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/financial">
                <Button variant="outline" icon={BarChart3}>
                  View Full Financial Report
                </Button>
              </Link>
            </div>
          </Card.Body>
        </Card>

        {/* Early Warning System / Alerts */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                Early Warning System ({stats.urgentAlerts + stats.highPriorityAlerts} Active)
              </h2>
              <div className="flex items-center space-x-2">
                <select
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <Button variant="ghost" size="sm" onClick={fetchConsultantAlerts} disabled={alertsLoading}>
                  <RefreshCw className={`w-4 h-4 ${alertsLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            <p className="text-gray-600">Critical client updates and pending actions</p>
          </Card.Header>
          <Card.Body>
            {alertsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading alerts...</p>
              </div>
            ) : filteredAlerts.length > 0 ? (
              <div className="space-y-4">
                {filteredAlerts.slice(0, showAllAlerts ? filteredAlerts.length : 3).map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.priority)}`}>
                    <div className="flex items-start space-x-3">
                      {getAlertIcon(alert.alert_type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-700">{alert.description}</p>
                        {alert.client && (
                          <p className="text-xs text-gray-600 mt-1">
                            Client: {alert.client.profile.full_name} ({alert.client.company_name})
                          </p>
                        )}
                        {alert.due_date && (
                          <p className="text-xs text-gray-600 mt-1">
                            Due: {new Date(alert.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlertColor(alert.priority)}`}>
                          {alert.priority}
                        </span>
                        <Button variant="ghost" size="sm" onClick={() => handleMarkAlertAsResolved(alert.id)}>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredAlerts.length > 3 && !showAllAlerts && (
                  <div className="text-center mt-4">
                    <Button variant="outline" size="sm" onClick={() => setShowAllAlerts(true)}>
                      Show All ({filteredAlerts.length})
                    </Button>
                  </div>
                )}
                {showAllAlerts && filteredAlerts.length > 3 && (
                  <div className="text-center mt-4">
                    <Button variant="outline" size="sm" onClick={() => setShowAllAlerts(false)}>
                      Show Less
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Alerts</h3>
                <p className="text-gray-600">All clear! You'll be notified here for urgent client actions.</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Recent Activity */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Recent Client Activity</h2>
            <p className="text-gray-600">Latest actions from your assigned clients</p>
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
                      <p className="text-sm font-medium text-gray-900">
                        <span className="font-bold">{activity.client_name}</span> {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.created_at).toLocaleDateString()} • {new Date(activity.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
                <p className="text-gray-600">Client activities will appear here</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default ConsultantDashboard;
