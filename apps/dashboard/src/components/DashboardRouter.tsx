// apps/dashboard/src/components/DashboardRouter.tsx dosyasında yapılacak değişiklikler

// Mevcut satırı değiştirin:
// import { ClientLayout } from '@consulting19/shared';
// Yeni satır:
import ClientLayout from '../components/layouts/ClientLayout'; // Doğru yolu kullanın

// ... (diğer importlar) ...

const DashboardRouter: React.FC<DashboardRouterProps> = ({ requiredRole }) => {
  // ... (mevcut kod) ...

  // Client Routes
  if (requiredRole === 'client') {
    return (
      <ClientLayout> {/* ClientLayout ile sarmalayın */}
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
      </ClientLayout> {/* ClientLayout sarmalamasını kapatın */}
    );
  }

  // ... (diğer rollerin rotaları) ...
};
