import React from 'react';
import ConsultantLayout from '../../components/layouts/ConsultantLayout';

const ConsultantClients = () => {
  return (
    <ConsultantLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultant Clients</h1>
      <p className="text-gray-600">View your clients here.</p>
    </ConsultantLayout>
  );
};

export default ConsultantClients;