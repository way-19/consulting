// Service Worker disabled in development
// This file exists to prevent 404 errors but does nothing

console.log('Service Worker disabled in development environment');

// Immediately unregister self if somehow activated
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    self.registration.unregister().then(() => {
      console.log('Service Worker unregistered');
    })
  );
});