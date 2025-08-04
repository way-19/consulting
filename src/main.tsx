import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Completely disable service worker in development
if ('serviceWorker' in navigator) {
  // Always unregister existing service workers in development/credentialless environments
  const isCredentialless = window.location.hostname.includes('credentialless') || 
                           window.location.hostname.includes('webcontainer') ||
                           window.location.hostname.includes('local-credentialless');
  
  if (import.meta.env.DEV || isCredentialless) {
    console.log('🔧 [SW] Disabling service worker in development/credentialless environment');
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('🔧 [SW] Unregistering', registrations.length, 'existing service workers');
      registrations.forEach(registration => {
        registration.unregister().then(() => {
          console.log('✅ [SW] Service worker unregistered successfully');
        });
      });
    });
  } else if (import.meta.env.PROD && !isCredentialless) {
    // Only register in production
    console.log('🔧 [SW] Registering service worker in production');
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('⚠️ [SW] Service worker registration failed (ignored)');
      });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)