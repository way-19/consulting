import React, { useState, useEffect } from 'react';
import { FolderOpen, Target, MessageSquare, FileText, Calendar, TrendingUp } from 'lucide-react';
import { Card, Button } from '../../shared/components/ui';
import { supabase } from '../../shared/lib/supabase';
import { useAuth } from '../../shared/hooks/useAuth';
import { useLanguage } from '../../shared/contexts/LanguageContext';

interface ClientStats {
  activeProjects: number;
  availableServices: number;
  totalMessages: number;
  completedTasks: number;
}

const ClientDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState<ClientStats>({
    activeProjects: 0,
    availableServices: 0,
    totalMessages: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [consultant, setConsultant] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get client record and assigned consultant
      const { data: clientData } = await supabase
        .from('clients')
        .select(`
          *,
          consultant:user_profiles!clients_assigned_consultant_id_fkey(full_name, email, company)
        `)
        .eq('profile_id', user.id)
        .single();

      if (clientData) {
        setConsultant(clientData.consultant);

        // Fetch client stats
        const [
          projectsResult,
          servicesResult
        ] = await Promise.all([
          supabase
            .from('projects')
            .select('id', { count: 'exact', head: true })
            .eq('client_id', clientData.id)
            .eq('status', 'active'),
          supabase
            .from('custom_services')
            .select('id', { count: 'exact', head: true })
            .eq('consultant_id', clientData.assigned_consultant_id)
            .eq('is_active', true)
        ]);

        setStats({
          activeProjects: projectsResult.count || 0,
          availableServices: servicesResult.count || 0,
          totalMessages: 0,
          completedTasks: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Active Projects',
      value: stats.activeProjects.toString(),
      icon: FolderOpen,
      color: 'blue',
      description: 'Currently in progress',
    },
    {
      title: 'Available Services',
      value: stats.availableServices.toString(),
      icon: Target,
      color: 'purple',
      description: 'From your consultant',
    },
    {
      title: 'Messages',
      value: stats.totalMessages.toString(),
      icon: MessageSquare,
      color: 'green',
      description: 'Unread conversations',
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks.toString(),
      icon: TrendingUp,
      color: 'orange',
      description: 'This month',
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('welcome')}, {user?.user_metadata?.full_name || 'Client'}!
        </h1>
        <p className="text-gray-600">Track your international business expansion progress</p>
      </div>

      {/* Consultant Info */}
      {consultant && (
        <Card className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">Your Consultant</h2>
                <p className="text-blue-100 mb-1">{consultant.full_name}</p>
                {consultant.company && (
                  <p className="text-blue-200 text-sm">{consultant.company}</p>
                )}
              </div>
              <div className="flex space-x-3">
                <Button 
                  variant="secondary" 
                  icon={MessageSquare}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  Message
                </Button>
                <Button 
                  variant="secondary"
                  icon={Calendar}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  Schedule
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" icon={Target}>
                Browse Services
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={FolderOpen}>
                View Projects
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={MessageSquare}>
                Contact Consultant
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={FileText}>
                Upload Documents
              </Button>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">Getting Started</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-gray-600">Account created</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-gray-600">Consultant assigned</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold">3</span>
                </div>
                <span className="text-sm text-gray-600">Browse available services</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs font-bold">4</span>
                </div>
                <span className="text-sm text-gray-600">Start your first project</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;