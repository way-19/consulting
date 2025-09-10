import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@consulting19/shared';
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  User,
  Building,
  Globe,
  Star,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Target,
  TrendingUp,
  DollarSign,
  ArrowRight,
  X,
  Send,
  Eye,
  Calendar
} from 'lucide-react';
import { supabase } from '@consulting19/shared/lib/supabase';

interface Client {
  id: string;
  profile_id: string;
  company_name: string;
  status: string;
  priority: string;
  profile: {
    full_name: string;
    email: string;
    preferred_language: string;
    country_id?: string;
  };
  country?: {
    name: string;
    flag_emoji: string;
  };
}

interface Consultant {
  id: string;
  full_name: string;
  email: string;
  preferred_language: string;
  timezone: string;
  commission_rate: number;
  country_assignments?: any[];
  specializations: string[];
  is_online: boolean;
  client_count: number;
  avg_rating: number;
}

interface Assignment {
  id: string;
  client_id: string;
  consultant_id: string;
  assignment_type: string;
  specialization: string;
  is_active: boolean;
  assigned_at?: string;
  client: {
    profile: {
      full_name: string;
    };
    company_name: string;
  };
  consultant: {
    full_name: string;
  };
}

const ConsultantCrossAssignments = () => {
  const { user, profile } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedConsultant, setSelectedConsultant] = useState<string>('');
  const [assignmentType, setAssignmentType] = useState('specialist');
  const [specialization, setSpecialization] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');
  const [assigning, setAssigning] = useState(false);

  const specializations = [
    'company_formation',
    'tax_planning', 
    'banking',
    'legal',
    'visa',
    'accounting',
    'general'
  ];

  const assignmentTypes = [
    { value: 'primary', label: 'Primary Consultant' },
    { value: 'secondary', label: 'Secondary Consultant' },
    { value: 'specialist', label: 'Specialist Consultant' },
    { value: 'referral', label: 'Referral' }
  ];

  useEffect(() => {
    if (user && profile) {
      fetchData();
    }
  }, [user, profile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchMyClients(),
        fetchAvailableConsultants(),
        fetchMyAssignments()
      ]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyClients = async () => {
    try {
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          *,
          profile:user_profiles!clients_profile_id_fkey(
            full_name, email, preferred_language, country_id
          ),
          country:countries(name, flag_emoji)
        `)
        .eq('assigned_consultant_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        return;
      }

      setClients(clientsData || []);
    } catch (err) {
      console.error('Unexpected error fetching clients:', err);
    }
  };

  const fetchAvailableConsultants = async () => {
    try {
      const { data: consultantsData, error } = await supabase
        .from('user_profiles')
        .select(`
          id, full_name, email, preferred_language, timezone, commission_rate
        `)
        .eq('role', 'consultant')
        .eq('is_active', true)
        .neq('id', user?.id); // Exclude current consultant

      if (error) {
        console.error('Error fetching consultants:', error);
        return;
      }

      // Enrich consultant data with mock statistics
      const enrichedConsultants = (consultantsData || []).map(consultant => ({
        ...consultant,
        country_assignments: [], // Mock data for now
        specializations: ['company_formation', 'tax_planning'], // Mock data
        is_online: Math.random() > 0.5, // Mock online status
        client_count: Math.floor(Math.random() * 20) + 5, // Mock client count
        avg_rating: 4.2 + Math.random() * 0.7 // Mock rating
      }));

      setConsultants(enrichedConsultants);
    } catch (err) {
      console.error('Unexpected error fetching consultants:', err);
    }
  };

  const fetchMyAssignments = async () => {
    try {
      const { data: assignmentsData, error } = await supabase
        .from('consultant_assignments')
        .select(`
          *,
          client:clients!consultant_assignments_client_id_fkey(
            profile:user_profiles(full_name),
            company_name
          ),
          consultant:user_profiles!consultant_assignments_consultant_id_fkey(full_name)
        `)
        .or(`assigned_by.eq.${user?.id},consultant_id.eq.${user?.id}`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assignments:', error);
        return;
      }

      setAssignments(assignmentsData || []);
    } catch (err) {
      console.error('Unexpected error fetching assignments:', err);
    }
  };

  const handleAssignConsultant = async () => {
    if (!selectedClient || !selectedConsultant || !specialization) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setAssigning(true);

      // Create assignment record
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('consultant_assignments')
        .insert({
          client_id: selectedClient.id,
          consultant_id: selectedConsultant,
          assignment_type: assignmentType,
          country_id: selectedClient.profile.country_id,
          specialization: specialization,
          assigned_by: user?.id,
          is_active: true
        })
        .select()
        .single();

      if (assignmentError) {
        throw assignmentError;
      }

      // Create referral commission record if applicable
      if (assignmentType === 'secondary' || assignmentType === 'specialist') {
        const { error: commissionError } = await supabase
          .from('referral_commissions')
          .insert({
            referring_consultant_id: user?.id,
            referred_client_id: selectedClient.id,
            receiving_consultant_id: selectedConsultant,
            referral_type: assignmentType === 'specialist' ? 'specialization' : 'cross_country',
            commission_rate: 5.00, // 5% referral bonus
            is_active: true
          });

        if (commissionError) {
          console.error('Commission record error:', commissionError);
          // Don't fail the assignment if commission fails
        }
      }

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action_type: 'cross_consultant_assignment',
          description: `Assigned ${selectedClient.profile.full_name} to specialist consultant`,
          payload: {
            client_id: selectedClient.id,
            consultant_id: selectedConsultant,
            assignment_type: assignmentType,
            specialization: specialization
          }
        });

      // Notify the assigned consultant
      const assignedConsultant = consultants.find(c => c.id === selectedConsultant);
      if (assignedConsultant) {
        await supabase.functions.invoke('notify', {
          body: {
            recipient_id: selectedConsultant,
            type: 'cross_consultant_assignment',
            payload: {
              client_name: selectedClient.profile.full_name,
              company_name: selectedClient.company_name,
              assignment_type: assignmentType,
              specialization: specialization,
              assigning_consultant: profile?.full_name,
              notes: assignmentNotes
            },
            email_notification: true
          }
        });
      }
      alert('Cross-assignment completed successfully!');
      setShowAssignmentModal(false);
      setSelectedClient(null);
      setSelectedConsultant('');
      setAssignmentType('specialist');
      setSpecialization('');
      setAssignmentNotes('');
      
      // Refresh data
      fetchMyAssignments();
    } catch (err) {
      console.error('Assignment error:', err);
      alert('Failed to create assignment. Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const getSpecializationIcon = (spec: string) => {
    switch (spec) {
      case 'company_formation': return '🏢';
      case 'tax_planning': return '💰';
      case 'banking': return '🏦';
      case 'legal': return '⚖️';
      case 'visa': return '🛂';
      case 'accounting': return '📊';
      default: return '💼';
    }
  };

  const getSpecializationLabel = (spec: string) => {
    switch (spec) {
      case 'company_formation': return 'Company Formation';
      case 'tax_planning': return 'Tax Planning';
      case 'banking': return 'Banking';
      case 'legal': return 'Legal';
      case 'visa': return 'Visa Services';
      case 'accounting': return 'Accounting';
      default: return 'General';
    }
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-800';
      case 'secondary': return 'bg-green-100 text-green-800';
      case 'specialist': return 'bg-purple-100 text-purple-800';
      case 'referral': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredConsultants = consultants.filter(consultant => {
    const matchesSearch = 
      consultant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = specializationFilter === 'all' || 
      consultant.specializations.includes(specializationFilter);
    
    const matchesCountry = countryFilter === 'all'; // Simplified for now
    
    return matchesSearch && matchesSpecialization && matchesCountry;
  });

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Cross-Consultant Assignments - Consultant Dashboard</title>
        </Helmet>
        
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
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
        <title>Cross-Consultant Assignments - Consultant Dashboard</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cross-Consultant Assignments</h1>
            <p className="text-gray-600 mt-1">Collaborate with specialists and manage client assignments</p>
          </div>
          <button 
            onClick={() => setShowAssignmentModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Assignment
          </button>
        </div>

        {/* Assignment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Clients</p>
                <p className="text-3xl font-bold text-blue-600">{clients.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                <p className="text-3xl font-bold text-green-600">{assignments.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Specialists</p>
                <p className="text-3xl font-bold text-purple-600">{consultants.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collaboration Rate</p>
                <p className="text-3xl font-bold text-orange-600">
                  {clients.length > 0 ? Math.round((assignments.length / clients.length) * 100) : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* My Clients for Assignment */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Clients Available for Assignment</h2>
            <p className="text-sm text-gray-600">Select clients to assign to specialist consultants</p>
          </div>
          
          <div className="p-6">
            {clients.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{client.profile.full_name}</h3>
                          {client.company_name && (
                            <p className="text-sm text-gray-600">{client.company_name}</p>
                          )}
                        </div>
                      </div>
                      {client.country && (
                        <div className="flex items-center space-x-1">
                          <span className="text-lg">{client.country.flag_emoji}</span>
                          <span className="text-xs text-gray-500">{client.country.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <span>Language: {client.profile.preferred_language || 'en'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Status: {client.status}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowAssignmentModal(true);
                        }}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        <Target className="w-4 h-4 mr-1 inline" />
                        Assign Specialist
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Clients Available</h3>
                <p className="text-gray-600">You don't have any active clients to assign to specialists</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Assignments */}
        {assignments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Current Assignments</h2>
              <p className="text-sm text-gray-600">Track your cross-consultant assignments</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {assignment.client.profile.full_name}
                          {assignment.client.company_name && ` (${assignment.client.company_name})`}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Assigned to: {assignment.consultant.full_name}</span>
                          <span>•</span>
                          <span>Specialization: {getSpecializationLabel(assignment.specialization)}</span>
                          <span>•</span>
                          <span>{assignment.assigned_at ? new Date(assignment.assigned_at).toLocaleDateString() : new Date(assignment.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAssignmentTypeColor(assignment.assignment_type)}`}>
                        {assignment.assignment_type}
                      </span>
                      {assignment.is_active && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignment Modal */}
        {showAssignmentModal && selectedClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Assign Specialist for {selectedClient.profile.full_name}
                </h2>
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Client Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Client Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium ml-2">{selectedClient.profile.full_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium ml-2">{selectedClient.company_name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium ml-2">{selectedClient.profile.preferred_language || 'en'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium ml-2">
                      {selectedClient.country ? `${selectedClient.country.flag_emoji} ${selectedClient.country.name}` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Type
                  </label>
                  <select
                    value={assignmentType}
                    onChange={(e) => setAssignmentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {assignmentTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization Required
                  </label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select specialization</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {getSpecializationIcon(spec)} {getSpecializationLabel(spec)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Consultant Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Available Specialists</h3>
                  <div className="flex space-x-2">
                    <select
                      value={specializationFilter}
                      onChange={(e) => setSpecializationFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All Specializations</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>{getSpecializationLabel(spec)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {filteredConsultants.map((consultant) => (
                    <div
                      key={consultant.id}
                      onClick={() => setSelectedConsultant(consultant.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedConsultant === consultant.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-purple-600" />
                            </div>
                            {consultant.is_online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{consultant.full_name}</h4>
                            <p className="text-xs text-gray-600">{consultant.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-medium">{consultant.avg_rating.toFixed(1)}</span>
                          </div>
                          <p className="text-xs text-gray-500">{consultant.client_count} clients</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">Commission: {consultant.commission_rate}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">Timezone: {consultant.timezone}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {consultant.specializations.map((spec, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {getSpecializationIcon(spec)} {getSpecializationLabel(spec)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assignment Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Notes (Optional)
                </label>
                <textarea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="Provide context about why this assignment is needed..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAssignmentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignConsultant}
                  disabled={assigning || !selectedConsultant || !specialization}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {assigning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 inline" />
                      Create Assignment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🤝 How Cross-Consultant Assignments Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">1. Service Request</h4>
                  <p className="text-sm text-gray-600">
                    Client creates a "Service Request" ticket for services outside your expertise or country.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">2. Manual Assignment</h4>
                  <p className="text-sm text-gray-600">
                    You review the request and manually assign the client to a specialist consultant.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">3. Automatic Processing</h4>
                  <p className="text-sm text-gray-600">
                    System automatically handles notifications, commission splits, and audit logging.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-0.5">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Commission Structure</h4>
                  <p className="text-sm text-gray-600">
                    Primary: 45% • Secondary: 20% • System: 35% • Referral Bonus: 5%
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Globe className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Global Expertise</h4>
                  <p className="text-sm text-gray-600">
                    Access specialists from different countries and expertise areas for comprehensive service.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mt-0.5">
                  <Calendar className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Timeline</h4>
                  <p className="text-sm text-gray-600">
                    Assignments are processed immediately with automatic notifications to all parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultantCrossAssignments;