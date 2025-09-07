import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientLayout from '../components/layouts/ClientLayout';

// Client sayfalarının importları
import ClientDashboard from '../pages/client/ClientDashboard';
import ClientProjects from '../pages/client/ClientProjects';
import ClientTasks from '../pages/client/ClientTasks';
import ClientDocuments from '../pages/client/ClientDocuments';
import ClientServices from '../pages/client/ClientServices';
import ClientMessages from '../pages/client/ClientMessages';
import ClientBilling from '../pages/client/ClientBilling';
import ClientSettings from '../pages/client/ClientSettings';
import ClientOnboarding from '../pages/client/ClientOnboarding';
import ClientAccounting from '../pages/client/ClientAccounting';
import ClientCalendar from '../pages/client/ClientCalendar';
import ClientFileManager from '../pages/client/ClientFileManager';
import ClientMailbox from '../pages/client/ClientMailbox';
import ClientProgressTracking from '../pages/client/ClientProgressTracking';
import ClientProjectDetails from '../pages/client/ClientProjectDetails';
import ClientSupport from '../pages/client/ClientSupport';

// DashboardRouterProps arayüzü (eğer başka bir dosyada tanımlı değilse burada tanımlanabilir)
interface DashboardRouterProps {
  requiredRole: 'admin' | 'consultant' | 'client';
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ requiredRole }) => {
  // Client rolü için rotalar
  if (requiredRole === 'client') {
    return (
      <ClientLayout>
        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/projects" element={<ClientProjects />} />
          <Route path="/tasks" element={<ClientTasks />} />
          <Route path="/documents" element={<ClientDocuments />} />
          <Route path="/services" element={<ClientServices />} />
          <Route path="/messages" element={<ClientMessages />} />
          <Route path="/billing" element={<ClientBilling />} />
          <Route path="/settings" element={<ClientSettings />} />
          <Route path="/onboarding" element={<ClientOnboarding />} />
          {/* Yeni eklenen rotalar */}
          <Route path="/projects/:projectId" element={<ClientProjectDetails />} />
          <Route path="/accounting" element={<ClientAccounting />} />
          <Route path="/calendar" element={<ClientCalendar />} />
          <Route path="/file-manager" element={<ClientFileManager />} />
          <Route path="/mailbox" element={<ClientMailbox />} />
          <Route path="/progress" element={<ClientProgressTracking />} />
          <Route path="/support" element={<ClientSupport />} />
          <Route path="*" element={<Navigate to="/client" replace />} />
        </Routes>
      </ClientLayout>
    );
  }

  // Diğer roller için (admin, consultant) veya rol eşleşmezse
  // Burada diğer rollerin rotalarını veya varsayılan bir yönlendirme/mesaj döndürebilirsiniz.
  // Şimdilik null döndürüyoruz, bu da App.tsx'teki DefaultRedirect bileşeninin devreye girmesini sağlar.
  return null;
};

export default DashboardRouter;
