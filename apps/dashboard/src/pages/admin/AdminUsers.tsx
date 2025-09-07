import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useI18n } from '../../hooks/useI18n';
import { Card } from '@consulting19/shared';
import { Users } from 'lucide-react';

const AdminUsers = () => {
  const { t } = useI18n();

  return (
    <AdminLayout>
      <Helmet>
        <title>{t('navigation.users')} - Consulting19</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('navigation.users')}</h1>
        <p className="text-gray-600">Manage all users (clients, consultants, admins)</p>
      </div>

      <Card>
        <Card.Body className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            User Management
          </h3>
          <p className="text-gray-600">
            This section is under development. User management features will be available soon.
          </p>
        </Card.Body>
      </Card>
    </AdminLayout>
  );
};

export default AdminUsers;