// components/DashboardRedirect.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect based on user role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'consultant':
      return <Navigate to="/consultant" replace />;
    case 'client':
      return <Navigate to="/client" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;