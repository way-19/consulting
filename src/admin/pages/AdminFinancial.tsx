import React from 'react';
import { DollarSign, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Card } from '../../shared/components/ui';

const AdminFinancial = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-gray-600">Platform revenue analytics and financial insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$0</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$0</div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">0</div>
            <div className="text-sm text-gray-600">Active Orders</div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">$0</div>
            <div className="text-sm text-gray-600">Avg Order Value</div>
          </Card.Body>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <Card.Header>
          <h2 className="text-xl font-semibold text-gray-900">Revenue Overview</h2>
        </Card.Header>
        <Card.Body className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Financial Analytics Coming Soon
          </h3>
          <p className="text-gray-600">
            Comprehensive revenue reports and analytics will be available here
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminFinancial;