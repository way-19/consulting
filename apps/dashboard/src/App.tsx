// apps/dashboard/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@consulting19/shared';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
// import DashboardRouter from './components/DashboardRouter'; // Bu satırı yorum satırı yapın veya silin
import ClientRoutesComponent from '@consulting19/client/ClientRoutes'; // ClientRoutesComponent'i import edin

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Dashboard Routes - Role-based routing (Geçici olarak ClientRoutesComponent ile değiştirildi) */}
            {/* <Route path="/admin/*" element={<DashboardRouter requiredRole="admin" />} /> */}
            {/* <Route path="/consultant/*" element={<DashboardRouter requiredRole="consultant" />} /> */}
            {/* <Route path="/client/*" element={<DashboardRouter requiredRole="client" />} /> */}
            
            {/* Doğrudan ClientRoutesComponent'i render edin */}
            <Route path="/*" element={<ProtectedClientRoutesTest />} /> {/* Yeni bir korumalı rota bileşeni kullanın */}
            
            {/* Default redirect based on user role or to login */}
            {/* <Route path="/" element={<DefaultRedirect />} /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

// Yeni bir korumalı rota bileşeni oluşturun
const ProtectedClientRoutesTest = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading client routes...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // ClientRoutesComponent'i doğrudan render edin
  return <ClientRoutesComponent />;
};

// DefaultRedirect bileşenini yorum satırı yapın veya silin
// const DefaultRedirect = () => {
//   const { user, role, loading } = useAuth();
  
//   if (loading) {
//     return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//         <p className="text-gray-600">Loading dashboard...</p>
//       </div>
//     </div>;
//   }
  
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
  
//   console.log('🔍 User role detected:', role);
  
//   // Redirect to appropriate dashboard based on role
//   if (role === 'admin') return <Navigate to="/admin" replace />;
//   if (role === 'consultant') return <Navigate to="/consultant" replace />;
//   if (role === 'client') return <Navigate to="/client" replace />;
  
//   // If role is still loading, show loading state
//   if (role === null) {
//     return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//         <p className="text-gray-600">Determining user role...</p>
//       </div>
//     </div>;
//   }
  
//   return <Navigate to="/login" replace />;
// };

export default App;
