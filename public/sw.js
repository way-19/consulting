// Safe Service Worker for credentialless environments
const CACHE_NAME = 'consulting19-v1';

// Safe navigation function for credentialless environments
async function safeOpen(path) {
  try {
    // Use relative URLs to avoid credentialless issues
    const url = new URL(path, self.location.origin).toString();
    
    // Check if we're in a credentialless environment
    if (self.location.hostname.includes('credentialless')) {
      console.log('Credentialless environment detected, skipping navigation');
      return null;
    }
    
    return await clients.openWindow(url);
  } catch (error) {
    console.log('Service Worker navigation blocked (credentialless):', error.message);
    return null;
  }
}

// Handle navigation requests safely
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'NAVIGATE') {
    event.waitUntil(safeOpen(event.data.path));
  }
});

// Basic caching strategy
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip credentialless URLs
  if (event.request.url.includes('credentialless')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});