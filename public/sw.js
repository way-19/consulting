// Safe Service Worker for credentialless environments
const CACHE_NAME = 'consulting19-v1';

// Safe notification click handler
self.addEventListener('notificationclick', function(event) {
  console.log('🔔 [SW] Notification clicked');
  event.notification.close();
  
  event.waitUntil(
    (async () => {
      try {
        const clientWindows = await self.clients.matchAll({ type: 'window' });
        
        // If a window is already open, focus it
        if (clientWindows.length > 0) {
          console.log('🔧 [SW] Focusing existing window');
          return clientWindows[0].focus();
        }
        
        // Skip navigation in credentialless environments
        console.log('⚠️ [SW] Navigation skipped in credentialless environment');
        return Promise.resolve();
      } catch (error) {
        console.log('⚠️ [SW] Notification click handled safely:', error.message);
        return Promise.resolve();
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
  
  // Skip API routes from caching
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    }).catch(function(error) {
      console.log('⚠️ [SW] Fetch error handled:', error.message);
      return fetch(event.request);
    })
  );
});

// Install event
self.addEventListener('install', function(event) {
  console.log('🔧 [SW] Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/',
        '/georgia/consultant-dashboard/performance'
      ]).catch(function(error) {
        console.log('⚠️ [SW] Cache population failed (ignored):', error.message);
      });
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', function(event) {
  console.log('🔧 [SW] Activating service worker');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🔧 [SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});