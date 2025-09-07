// apps/dashboard/src/components/DashboardRouter.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Eski client sayfalarının importlarını kaldırın
// import ClientLayout from '../components/layouts/ClientLayout';
// import ClientDashboard from '../pages/client/ClientDashboard';
// ... diğer client sayfaları ...

// apps/client uygulamasının ana App bileşenini import edin
import ClientApp from '@consulting19/client/src/App'; // Bu satırı ekleyin

interface DashboardRouterProps {
  requiredRole: 'admin' | 'consultant' | 'client';
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ requiredRole }) => {
  // Client rolü için rotalar
  if (requiredRole === 'client') {
    return (
      // Doğrudan apps/client uygulamasının App bileşenini render edin
      // Bu, apps/client'ın kendi layout ve rotalarını kullanmasını sağlayacak
      <ClientApp /> // Bu satırı değiştirin
    );
  }

  // Diğer roller için (admin, consultant) veya rol eşleşmezse
  // ... (mevcut admin ve consultant rotaları burada kalacak) ...
  return null;
};

export default DashboardRouter;
