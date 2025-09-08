// apps/client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, LoadingSpinner } from '@consulting19/shared';

function App() {
  // Test basic rendering first
  console.log('App component rendering...');
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-xl">C19</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Client Portal Loading...</h1>
        <p className="text-gray-600">Testing basic rendering</p>
      </div>
    </div>
  );
}

export default App;
