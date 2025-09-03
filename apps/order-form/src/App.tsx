import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@consulting19/shared';
import OrderFormPage from './pages/OrderFormPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<OrderFormPage />} />
            <Route path="/order" element={<OrderFormPage />} />
            <Route path="*" element={<OrderFormPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;