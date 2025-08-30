import React from 'react';
import ClientLayout from '../../components/layouts/ClientLayout';

const ClientMessages = () => {
  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Messages</h1>
      <p className="text-gray-600">View your messages here.</p>
    </ClientLayout>
  );
};

export default ClientMessages;