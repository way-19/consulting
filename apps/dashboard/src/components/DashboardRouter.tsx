// apps/dashboard/src/components/DashboardRouter.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// ... diğer importlar ...

// apps/client uygulamasının rota tanımlarını import edin
// DİKKAT: apps/client/src/App.tsx'i DEĞİL, apps/client/src/ClientRoutes.tsx'i import ediyoruz.
import ClientRoutesComponent from '@consulting19/client/src/ClientRoutes'; // Bu satırı düzeltin

interface DashboardRouterProps {
  requiredRole: 'admin' | 'consultant' | 'client';
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ requiredRole }) => {
  // Client rolü için rotalar
  if (requiredRole === 'client') {
    return (
      // Doğrudan ClientRoutesComponent bileşenini render edin
      // AuthProvider ve Router zaten üst App.tsx'te (apps/dashboard/src/App.tsx) tanımlı
      <ClientRoutesComponent /> // Bu satırı düzeltin
    );
  }

  // Diğer roller için (admin, consultant) veya rol eşleşmezse
  // ... (mevcut admin ve consultant rotaları burada kalacak) ...
  return null;
};

export default DashboardRouter;
