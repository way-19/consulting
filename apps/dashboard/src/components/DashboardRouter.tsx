// apps/dashboard/src/components/DashboardRouter.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// ... diğer importlar ...

// apps/client uygulamasının rota tanımlarını import edin
import ClientRoutesComponent from '@consulting19/client/src/ClientRoutes'; // Bu satır doğru olmalı

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
