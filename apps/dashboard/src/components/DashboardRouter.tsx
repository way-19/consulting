// apps/dashboard/src/components/DashboardRouter.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// ... diğer importlar ...

// apps/client uygulamasının rota tanımlarını import edin
// Alias artık doğrudan src dizinine işaret ettiği için 'src/' kısmını kaldırıyoruz
import ClientRoutesComponent from '@consulting19/client/ClientRoutes'; 

interface DashboardRouterProps {
  requiredRole: 'admin' | 'consultant' | 'client';
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ requiredRole }) => {
  if (requiredRole === 'client') {
    return (
      <ClientRoutesComponent />
    );
  }
  // ... diğer roller ...
  return null;
};

export default DashboardRouter;
