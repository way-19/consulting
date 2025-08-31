@@ .. @@
 import React from 'react';
 import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
-import { AuthProvider } from '@consulting19/shared';
-import { LanguageProvider } from '@consulting19/shared';
-import { useAuth } from '@consulting19/shared';
-import LoadingSpinner from '@consulting19/shared/LoadingSpinner';
+import { AuthProvider, LanguageProvider, useAuth } from '@consulting19/shared';
+import LoadingSpinner from '@consulting19/shared/LoadingSpinner';

 // Public Pages
 import HomePage from './pages/HomePage';
-import ServicesPage from './pages/ServicesPage';
 import ConsultantProfilePage from './pages/ConsultantProfilePage';
 import AuthPage from './pages/AuthPage';

 function App() {
   return (
     <AuthProvider>
       <LanguageProvider>
         <Router>
           <Routes>
             {/* Public Routes */}
             <Route path="/" element={<HomePage />} />
-            <Route path="/services" element={<ServicesPage />} />
             <Route path="/consultant/:consultantId" element={<ConsultantProfilePage />} />
             <Route path="/auth" element={<AuthPage />} />
             
             {/* Dashboard redirect */}
             <Route path="/dashboard" element={<DashboardRedirect />} />
           </Routes>
         </Router>
       </LanguageProvider>
     </AuthProvider>
   );
 }

 // Dashboard Redirect Component
 const DashboardRedirect = () => {
   const { user, role, loading } = useAuth();

   if (loading) {
     return <LoadingSpinner />;
   }

   if (!user) {
     return <Navigate to="/auth" replace />;
   }

   // Redirect to dashboard app based on role
   const dashboardUrl = 'http://localhost:5174';
   
   switch (role) {
     case 'admin':
       window.location.href = `${dashboardUrl}/admin`;
       break;
     case 'consultant':
       window.location.href = `${dashboardUrl}/consultant`;
       break;
     case 'client':
       window.location.href = `${dashboardUrl}/client`;
       break;
     default:
       return <Navigate to="/auth" replace />;
   }

   return <LoadingSpinner message="Redirecting to dashboard..." />;
 };

 export default App;