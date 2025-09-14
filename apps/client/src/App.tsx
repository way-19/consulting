// apps/client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '@consulting19/shared';
import ClientRoutes from './ClientRoutes'; // ClientRoutes'i içe aktarın

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ClientRoutes /> {/* ClientRoutes'i render edin */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
