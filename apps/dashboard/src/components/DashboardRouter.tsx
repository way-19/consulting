// apps/dashboard/src/components/DashboardRouter.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Eski client sayfalarının importlarını kaldırın (eğer varsa)
// import ClientLayout from '../components/layouts/ClientLayout';
// import ClientDashboard from '../pages/client/ClientDashboard';
// ... diğer client sayfaları ...

// apps/client uygulamasının rota tanımlarını import edin
import ClientRoutes from '@consulting19/client/src/ClientRoutes'; // Bu satırı değiştirin

interface DashboardRouterProps {
  requiredRole: 'admin' | 'consultant' | 'client';
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ requiredRole }) => {
  // Client rolü için rotalar
  if (requiredRole === 'client') {
    return (
      // Doğrudan ClientRoutes bileşenini render edin
      // AuthProvider ve Router zaten üst App.tsx'te tanımlı
      <ClientRoutes /> // Bu satırı değiştirin
    );
  }

  // Diğer roller için (admin, consultant) veya rol eşleşmezse
  // ... (mevcut admin ve consultant rotaları burada kalacak) ...
  return null;
};

export default DashboardRouter;
