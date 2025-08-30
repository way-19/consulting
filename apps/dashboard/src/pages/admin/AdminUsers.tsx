import React from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';

const AdminUsers = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Users</h1>
      <p className="text-gray-600">Manage users here.</p>
    </AdminLayout>
  );
};

export default AdminUsers;