import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '@consulting19/shared';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Calendar,
  Target,
  Award,
  Star,
  ArrowRight,
  RefreshCw,
  FileText,
  Plus
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  monthlyRevenue: number;
  tasksCompleted: number;
  pendingTasks: number;
  documentsReviewed: number;
  pendingDocuments: number;
  meetingsHeld: number;
  upcomingMeetings: number;
}

interface Alert {
  alert_source_id: string;
  alert_type: string;
  is_resolved: boolean;
  notes?: string;
}

const ConsultantDashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    tasksCompleted: 0,
    pendingTasks: 0,
    documentsReviewed: 0,
    pendingDocuments: 0,
    meetingsHeld: 0,
    upcomingMeetings: 0
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchDashboardData();
    }
  }, [user, profile]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchClientStats(),
        fetchConsultantAlerts()
      ]);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientStats = async () => {
    try {
      // Get client statistics
      const { data: clients } = await supabase
        .from('clients')
        .select('id, status')
        .eq('assigned_consultant_id', user?.id);

      const totalClients = clients?.length || 0;
      const activeClients = clients?.filter(c => c.status === 'active').length || 0;

      // Get task statistics
      const { count: completedTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .eq('status', 'completed');

      const { count: pendingTasks } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .in('status', ['todo', 'in_progress']);

      // Get document statistics
      const { count: documentsReviewed } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .in('status', ['approved', 'rejected']);

      const { count: pendingDocuments } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .eq('status', 'uploaded');

      // Get meeting statistics
      const now = new Date().toISOString();
      const { count: meetingsHeld } = await supabase
        .from('meetings')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .eq('status', 'completed');

      const { count: upcomingMeetings } = await supabase
        .from('meetings')
        .select('*', { count: 'exact', head: true })
        .eq('consultant_id', user?.id)
        .gte('start_time', now);

      setStats({
        totalClients,
        activeClients,
        totalRevenue: 0, // Mock for now
        monthlyRevenue: 0, // Mock for now
        tasksCompleted: completedTasks || 0,
        pendingTasks: pendingTasks || 0,
        documentsReviewed: documentsReviewed || 0,
        pendingDocuments: pendingDocuments || 0,
        meetingsHeld: meetingsHeld || 0,
        upcomingMeetings: upcomingMeetings || 0
      });

    } catch (err) {
      console.error('Error fetching client stats:', err);
    }
  };

  const fetchConsultantAlerts = async () => {
    try {
      const { data: alertsData, error } = await supabase
        .from('consultant_alerts')
        .select('alert_source_id, alert_type, is_resolved')
        .eq('consultant_id', user?.id)
        .eq('is_resolved', false);

      if (error) {
        console.error('Error fetching consultant alerts:', error);
        return;
      }

      setAlerts(alertsData || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Consultant Panel</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
        <title>Dashboard - Consultant Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name || 'Consultant'}!</h1>
            <p className="text-gray-600 mt-1">Manage your clients and track your consulting business</p>
          </div>
          <div className="text-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-sm font-medium text-gray-900">Expert Consultant</div>
            <div className="text-xs text-gray-600">{stats.activeClients} active clients</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalClients}</p>
                <p className="text-xs text-gray-500">{stats.activeClients} active</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingTasks}</p>
                <p className="text-xs text-gray-500">{stats.tasksCompleted} completed</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Documents</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingDocuments}</p>
                <p className="text-xs text-gray-500">{stats.documentsReviewed + stats.pendingDocuments} total</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-3xl font-bold text-green-600">${stats.monthlyRevenue}</p>
                <p className="text-xs text-gray-500">${stats.totalRevenue} total</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Consultant Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                Consultant Alerts
              </h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500">
                <option>All Alerts</option>
                <option>Urgent</option>
                <option>Document Related</option>
                <option>Payment Related</option>
              </select>
            </div>
            
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-900">
                        {alert.alert_type.replace('_', ' ')} Alert
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎉 All Clear!</h3>
                <p className="text-gray-600 mb-4">No urgent alerts at the moment. Great work!</p>
                <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-1" />
                  Your clients are up to date
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <button 
                onClick={fetchDashboardData}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recent Activity</h3>
              <p className="text-gray-600">Recent client activities will appear here</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <p className="text-gray-600 mb-6">Common tasks and shortcuts</p>
          
          {/* Test Overdue Alerts Button */}
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="text-sm font-semibold text-orange-900 mb-2">🧪 Test Overdue Alert System</h3>
            <p className="text-xs text-orange-800 mb-3">
              Create test overdue data and trigger alert system to verify functionality
            </p>
            <div className="flex space-x-2">
              <button
                onClick={async () => {
                  try {
                    // Create test overdue data
                    const { data: testData, error: testDataError } = await supabase.rpc('create_test_overdue_data');
                    if (testDataError) throw testDataError;
                    
                    // Trigger overdue check
                    const { data, error } = await supabase.rpc('trigger_overdue_alerts_now');
                    if (error) throw error;
                    
                    alert(`Test completed!\nTest data: ${testData?.test_invoices_created || 0} invoices, ${testData?.test_documents_created || 0} documents\nAlerts created: ${data?.total_alerts_created || 0}\nCheck the alerts section above.`);
                    fetchDashboardData();
                  } catch (err) {
                    console.error('Test error:', err);
                    alert('Test failed: ' + (err?.message || 'Unknown error'));
                  }
                }}
                className="text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 transition-colors"
              >
                Create Test Data & Run Check
              </button>
              <button
                onClick={async () => {
                  try {
                    const { data, error } = await supabase.rpc('trigger_overdue_alerts_now');
                    if (error) throw error;
                    alert(`Overdue check completed:\n- Payment alerts: ${data?.payment_alerts || 0}\n- Document alerts: ${data?.document_alerts || 0}\n- Total new alerts: ${data?.total_alerts_created || 0}`);
                    fetchDashboardData();
                  } catch (err) {
                    console.error('Manual check error:', err);
                    alert('Check failed: ' + (err?.message || 'Unknown error'));
                  }
                }}
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Run Overdue Check Only
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              to="/clients"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Add Client</span>
              <span className="text-xs text-gray-500 text-center">Manage clients</span>
            </Link>
            
            <Link
              to="/tasks"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Create Task</span>
              <span className="text-xs text-gray-500 text-center">Add new task</span>
            </Link>
            
            <Link
              to="/messages"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Send Message</span>
              <span className="text-xs text-gray-500 text-center">Chat with clients</span>
            </Link>
            
            <Link
              to="/availability"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">Manage Schedule</span>
              <span className="text-xs text-gray-500 text-center">Set availability</span>
            </Link>
            
            <Link
              to="/documents"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Review Documents</span>
              <span className="text-xs text-gray-500 text-center">Process uploads</span>
            </Link>
            
            <Link
              to="/financial"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">View Earnings</span>
              <span className="text-xs text-gray-500 text-center">Track revenue</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantDashboard;