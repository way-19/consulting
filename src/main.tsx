import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Disable service worker in development and credentialless environments
if ('serviceWorker' in navigator) {
  const isCredentialless = window.location.hostname.includes('credentialless') || 
                           window.location.hostname.includes('webcontainer') ||
                           window.location.hostname.includes('local-credentialless') ||
                           import.meta.env.DEV;
  
  if (isCredentialless) {
    console.log('🔧 [SW] Disabling service worker in development/credentialless environment');
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('🔧 [SW] Unregistering', registrations.length, 'existing service workers');
      registrations.forEach(registration => {
        registration.unregister().then(() => {
          console.log('✅ [SW] Service worker unregistered successfully');
        });
      });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)