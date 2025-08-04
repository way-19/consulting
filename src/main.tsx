import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Completely disable service worker in development
if ('serviceWorker' in navigator) {
  // Unregister any existing service workers in development
  if (import.meta.env.DEV || window.location.hostname.includes('credentialless')) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
    });
  } else if (import.meta.env.PROD) {
    // Only register in production
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Ignore service worker registration errors
      });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)