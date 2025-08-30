import React from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';

const AdminContent = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Content</h1>
      <p className="text-gray-600">Manage marketing content here.</p>
    </AdminLayout>
  );
};

export default AdminContent;