import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
      navigate('/login');
      return;
    }

    // Redirect based on user role
    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'consultant':
        navigate('/consultant');
        break;
      case 'client':
        navigate('/client');
        break;
      default:
        navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
    </div>
  );
};

export default DashboardRedirect;