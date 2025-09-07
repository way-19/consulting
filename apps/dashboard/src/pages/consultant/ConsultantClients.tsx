import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MoreVertical, User, Building, Phone, Mail, Calendar } from 'lucide-react';
import { Card, Button } from '@consulting19/shared';
import { supabase } from '@consulting19/shared';
import { useTranslation } from '../../hooks/useTranslation';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';

interface Client {
  id: string;
  profile_id: string;
  company_name: string;
  status: 'active' | 'inactive' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes: string;
  contact_email: string;
  contact_phone: string;
  country: string;
  industry: string;
  created_at: string;
  updated_at: string;
  profile: {
    full_name: string;
    email: string;
  };
}

const ConsultantClients = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          profile:user_profiles!clients_profile_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
      } else {
        setClients(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || client.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <ConsultantLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </ConsultantLayout>
    );
  }

  return (
    <ConsultantLayout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('clients.title')}</h1>
            <p className="text-gray-600">{t('clients.subtitle')}</p>
          </div>
          <Button icon={Plus}>
            {t('clients.addClient')}
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <Card.Body>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('clients.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">{t('clients.filterAll')}</option>
                  <option value="active">{t('clients.filterActive')}</option>
                  <option value="inactive">{t('clients.filterInactive')}</option>
                  <option value="pending">{t('clients.filterPending')}</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">{t('clients.priority.high')}</option>
                  <option value="medium">{t('clients.priority.medium')}</option>
                  <option value="low">{t('clients.priority.low')}</option>
                </select>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Clients Grid */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card key={client.id} hover>
              <Card.Body>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {client.profile?.full_name || 'Unknown'}
                      </h3>
                      {client.company_name && (
                        <p className="text-sm text-gray-600">{client.company_name}</p>
                      )}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  {client.contact_email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="truncate">{client.contact_email}</span>
                    </div>
                  )}
                  {client.contact_phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{client.contact_phone}</span>
                    </div>
                  )}
                  {client.country && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      <span>{client.country}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                    {t(`clients.status.${client.status}`)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(client.priority)}`}>
                    {t(`clients.priority.${client.priority}`)}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {t('clients.quickActions.viewProfile')}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    {t('clients.quickActions.createTask')}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('clients.emptyState.title')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('clients.emptyState.description')}
            </p>
            <Button icon={Plus}>
              {t('clients.addClient')}
            </Button>
          </Card.Body>
        </Card>
      )}
    </ConsultantLayout>
  );
};

export default ConsultantClients;