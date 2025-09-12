import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  X,
  Save
} from 'lucide-react';
import { Card } from '../components/ui/Card';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  display_name: string | null;
  role: 'admin' | 'consultant' | 'client';
  company: string | null;
  phone: string | null;
  preferred_language: string | null;
  timezone: string | null;
  is_active: boolean;
  mfa_enabled: boolean;
  created_at: string;
  updated_at: string;
  client_count?: number;
  total_revenue?: number;
  commission_rate?: number;
}

const AdminUsers: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'consultant' | 'client'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Mock data for demo
      setTimeout(() => {
        setUsers([
          {
            id: '1',
            email: 'admin@consulting19.com',
            full_name: 'System Administrator',
            display_name: 'Admin',
            role: 'admin',
            company: 'Consulting19',
            phone: '+1-555-0100',
            preferred_language: 'en',
            timezone: 'UTC',
            is_active: true,
            mfa_enabled: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          },
          {
            id: '2',
            email: 'giorgi.meskhi@consulting19.com',
            full_name: 'Giorgi Meskhi',
            display_name: 'Giorgi',
            role: 'consultant',
            company: 'International Business Solutions',
            phone: '+995-555-0123',
            preferred_language: 'en',
            timezone: 'Asia/Tbilisi',
            is_active: true,
            mfa_enabled: false,
            created_at: '2024-01-15T00:00:00Z',
            updated_at: '2024-02-01T00:00:00Z',
            client_count: 15,
            total_revenue: 45000,
            commission_rate: 65
          },
          {
            id: '3',
            email: 'client@consulting19.com',
            full_name: 'María González',
            display_name: 'María',
            role: 'client',
            company: 'Tech Startup Inc.',
            phone: '+34-555-0456',
            preferred_language: 'es',
            timezone: 'Europe/Madrid',
            is_active: true,
            mfa_enabled: false,
            created_at: '2024-02-01T00:00:00Z',
            updated_at: '2024-02-15T00:00:00Z'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Mock API call
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_active: !currentStatus }
          : user
      ));
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      setSaving(true);
      // Mock API call
      setTimeout(() => {
        setUsers(users.map(user => 
          user.id === editingUser.id ? editingUser : user
        ));
        setShowEditModal(false);
        setEditingUser(null);
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating user:', error);
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setDeleting(userId);
      // Mock API call
      setTimeout(() => {
        setUsers(users.filter(user => user.id !== userId));
        setDeleting(null);
      }, 1000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setDeleting(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'consultant':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>User Management - Admin Panel</title>
        </Helmet>
        
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Management - Admin Panel</title>
      </Helmet>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600">Manage platform users, roles, and permissions</p>
        </div>

        {/* Filters */}
        <Card>
          <Card.Body>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="consultant">Consultant</option>
                  <option value="client">Client</option>
                </select>
              </div>

              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {filteredUsers.length} of {users.length} users
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Users Table */}
        <Card>
          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role & Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((userProfile) => (
                    <tr key={userProfile.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {userProfile.full_name || userProfile.display_name || 'No name'}
                          </div>
                          <div className="text-sm text-gray-500">{userProfile.email}</div>
                          {userProfile.company && (
                            <div className="text-xs text-gray-400">{userProfile.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(userProfile.role)}`}>
                          {userProfile.role}
                        </span>
                        {userProfile.mfa_enabled && (
                          <div className="mt-1">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              2FA
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleUserStatus(userProfile.id, userProfile.is_active)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                              userProfile.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            } transition-colors`}
                          >
                            {userProfile.is_active ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                            <span>{userProfile.is_active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userProfile.role === 'consultant' && (
                          <div>
                            <div>{userProfile.client_count || 0} clients</div>
                            <div className="text-xs text-green-600">
                              ${(userProfile.total_revenue || 0).toLocaleString()} revenue
                            </div>
                            {userProfile.commission_rate && (
                              <div className="text-xs text-blue-600">
                                {userProfile.commission_rate}% commission
                              </div>
                            )}
                          </div>
                        )}
                        {userProfile.role === 'client' && (
                          <div className="text-xs text-gray-500">
                            Member since {new Date(userProfile.created_at).toLocaleDateString()}
                          </div>
                        )}
                        {userProfile.role === 'admin' && (
                          <div className="text-xs text-red-600 font-medium">
                            System Administrator
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(userProfile.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2 justify-end">
                          <button
                            onClick={() => {
                              setEditingUser(userProfile);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Edit user"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              alert(`User Details:\n\nName: ${userProfile.full_name}\nEmail: ${userProfile.email}\nRole: ${userProfile.role}\nCompany: ${userProfile.company || 'N/A'}\nPhone: ${userProfile.phone || 'N/A'}\nLanguage: ${userProfile.preferred_language || 'en'}\nTimezone: ${userProfile.timezone || 'UTC'}\nStatus: ${userProfile.is_active ? 'Active' : 'Inactive'}\nCreated: ${new Date(userProfile.created_at).toLocaleDateString()}\nLast Updated: ${new Date(userProfile.updated_at).toLocaleDateString()}`);
                            }}
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {userProfile.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(userProfile.id, userProfile.full_name || userProfile.email)}
                              disabled={deleting === userProfile.id}
                              className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                              title="Delete user"
                            >
                              {deleting === userProfile.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-600">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search terms or filters'
                  : 'No users have been created yet'
                }
              </p>
            </div>
          )}
        </Card>

        {/* Edit User Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit User: {editingUser.full_name || editingUser.email}
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editingUser.full_name || ''}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, role: e.target.value as any } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="client">Client</option>
                      <option value="consultant">Consultant</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingUser.is_active}
                    onChange={(e) => setEditingUser(prev => prev ? { ...prev, is_active: e.target.checked } : null)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-900">Active User</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2 inline" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;