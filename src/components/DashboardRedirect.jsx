import React from 'react';
import { Navigate } from 'react-router-dom';

const DashboardRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user.id) {
    return <Navigate to="/login" replace />;
  }
  
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'consultant':
      return <Navigate to="/consultant-dashboard" replace />;
    case 'client':
      return <Navigate to="/client" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRedirect;