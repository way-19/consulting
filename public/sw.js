// Safe Service Worker for credentialless environments
import { disableSWNav } from '/src/lib/envRuntime.js';

const CACHE_NAME = 'consulting19-v2';

// Safe notification click handler
self.addEventListener('notificationclick', function(event) {
  console.log('🔔 [SW] Notification clicked');
  event.notification.close();
  
  // Skip navigation in dev/credentialless environments
  const isCredentialless = self.location.hostname.includes('local-credentialless') ||
                           self.location.hostname.includes('webcontainer') ||
                           self.location.hostname.includes('credentialless');
  
  if (isCredentialless) {
    console.log('🔧 [SW] Navigation skipped in credentialless environment');
    return;
  }
  
  event.waitUntil(
    (async () => {
      try {
        const clientWindows = await self.clients.matchAll({ type: 'window' });
        
        // If a window is already open, focus it
        if (clientWindows.length > 0) {
          console.log('🔧 [SW] Focusing existing window');
          return clientWindows[0].focus();
        }
        
        // Safe navigation fallback
        console.log('🔧 [SW] Opening new window');
        return self.clients.openWindow('/');
      } catch (error) {
        console.log('⚠️ [SW] Navigation error handled safely:', error.message);
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
        '/'
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