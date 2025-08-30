import React from 'react';
import ClientLayout from '../../components/layouts/ClientLayout';

const ClientBilling = () => {
  return (
    <ClientLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Billing</h1>
      <p className="text-gray-600">View your billing information here.</p>
    </ClientLayout>
  );
};

export default ClientBilling;