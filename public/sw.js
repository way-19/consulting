// Safe Service Worker for credentialless environments
const CACHE_NAME = 'consulting19-v1';

// Safe navigation helper for credentialless environments
async function safeOpen(path) {
  try {
    const url = new URL(path, self.location.origin).toString();
    return await clients.openWindow(url);
  } catch (_e) {
    // credentialless dev env: ignore navigation errors
    console.log('SW: Navigation blocked in credentialless environment');
  }
}

// Safe notification click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    (async () => {
      try {
        const clients = await self.clients.matchAll({ type: 'window' });
        
        // If a window is already open, focus it
        if (clients.length > 0) {
          return clients[0].focus();
        }
        
        // Otherwise, open a new window safely
        return safeOpen('/georgia/consultant-dashboard/performance');
      } catch (error) {
        console.log('SW: Notification click handled safely');
      }
    })()
  );
});

// Basic caching strategy
self.addEventListener('fetch', function(event) {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// Install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/',
        '/georgia/consultant-dashboard/performance'
      ]).catch(() => {
        // Ignore cache errors in credentialless environments
      });
    })
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});