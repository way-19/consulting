import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCountries from './pages/AdminCountries';
import AdminContent from './pages/AdminContent';
import AdminFinancial from './pages/AdminFinancial';
import AdminSettings from './pages/AdminSettings';

const AdminRouter = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/countries" element={<AdminCountries />} />
        <Route path="/content" element={<AdminContent />} />
        <Route path="/financial" element={<AdminFinancial />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRouter;