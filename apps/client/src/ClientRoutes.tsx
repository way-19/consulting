// apps/client/src/ClientRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@consulting19/shared';

const ClientRoutes = () => {
  return (
    <ProtectedClientRoutes />
  );
};

const ProtectedClientRoutes = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">C19</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Sadece basit bir test rotası döndürün
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Routes>
        <Route path="/*" element={<h1 className="text-3xl font-bold text-gray-900">Client Dashboard Test - Success!</h1>} />
      </Routes>
    </div>
  );
};

export default ClientRoutes;
