import { disableSWNav } from './envRuntime';

export function safeNavigate(path: string) {
  // Always prefer client router; fallback to location if not available
  try {
    // Next.js App Router
    const n: any = (window as any).__NEXT_ROUTER__ || null;
    if (n?.push) return n.push(path);
  } catch {}
  
  // React Router (optional)
  try {
    const rr: any = (window as any).__REACT_ROUTER__ || null;
    if (rr?.navigate) return rr.navigate(path);
  } catch {}
  
  // Fallback to window.location
  window.location.assign(path);
}

// No-op wrappers to neutralize SW-only calls in dev/credentialless
export async function safeOpenWindow(path: string) {
  if (disableSWNav) {
    console.log('🔧 [SAFE_NAV] SW navigation disabled, using router:', path);
    return safeNavigate(path);
  }
  
  // Production-only (if you truly need it later)
  return safeNavigate(path);
}

// Safe notification wrapper
export function safeShowNotification(title: string, options?: NotificationOptions) {
  if (disableSWNav) {
    console.log('🔧 [SAFE_NAV] SW notifications disabled in dev/credentialless');
    return Promise.resolve();
  }
  
  // Production-only notifications
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, options);
  }
  
  return Promise.resolve();
}

// Safe SW message posting
export function safeSWMessage(message: any) {
  if (disableSWNav) {
    console.log('🔧 [SAFE_NAV] SW messaging disabled in dev/credentialless');
    return;
  }
  
  // Production-only SW messaging
  if (navigator.serviceWorker?.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
}