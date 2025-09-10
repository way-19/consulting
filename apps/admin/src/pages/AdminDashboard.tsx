                    {stats.pendingOrders + stats.completedOrders > 0 
                      ? Math.round((stats.completedOrders / (stats.pendingOrders + stats.completedOrders)) * 100)
                      : 0}%
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            </Card.Header>
            <Card.Body>
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">No recent activity</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
          </Card.Header>
          <Card.Body>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getHealthIcon(stats.systemHealth.database)}
                  <span className="text-gray-600">Database</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(stats.systemHealth.database)}`}>
                  {stats.systemHealth.database}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getHealthIcon(stats.systemHealth.api)}
                  <span className="text-gray-600">API Response</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(stats.systemHealth.api)}`}>
                  {stats.systemHealth.api}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">Storage</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stats.systemHealth.storage > 80 ? 'bg-red-100 text-red-800' :
                  stats.systemHealth.storage > 60 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {stats.systemHealth.storage}% Used
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
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
        </div>

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
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editingUser.display_name || ''}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, display_name: e.target.value } : null)}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editingUser.phone || ''}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={editingUser.company || ''}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, company: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    <select
                      value={editingUser.preferred_language || 'en'}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, preferred_language: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="tr">Türkçe</option>
                      <option value="pt">Português</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>

                {editingUser.role === 'consultant' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      step="1"
                      value={editingUser.commission_rate || 65}
                      onChange={(e) => setEditingUser(prev => prev ? { ...prev, commission_rate: Number(e.target.value) } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}

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