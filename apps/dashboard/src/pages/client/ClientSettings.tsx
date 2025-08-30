import React from 'react';
import ClientLayout from '../../components/layouts/ClientLayout';

const ClientSettings = () => {
  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Settings</h1>
      <p className="text-gray-600">Manage your account settings here.</p>
    </ClientLayout>
  );
};

export default ClientSettings;