import React from 'react';
import ClientLayout from '../../components/layouts/ClientLayout';

const ClientDocuments = () => {
  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Documents</h1>
      <p className="text-gray-600">Manage your documents here.</p>
    </ClientLayout>
  );
};

export default ClientDocuments;