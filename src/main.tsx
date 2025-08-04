import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { disableSWNav } from './lib/envRuntime'

// Safe Service Worker management
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  if (disableSWNav) {
    console.info('🔧 SW navigation disabled (dev/credentialless). Using router/location only.');
    
    // Unregister existing service workers in dev/credentialless
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('🔧 [SW] Unregistering', registrations.length, 'existing service workers');
      registrations.forEach(registration => {
        registration.unregister().then(() => {
          console.log('✅ [SW] Service worker unregistered successfully');
        });
      });
    });
  } else {
    // Production-only SW registration
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.log('⚠️ [SW] Registration failed:', error);
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)