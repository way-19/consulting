export const isCredentialless =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('local-credentialless') ||
   window.location.hostname.includes('webcontainer') ||
   window.location.hostname.includes('credentialless'));

export const isDev = typeof process !== 'undefined' 
  ? process.env.NODE_ENV !== 'production'
  : true; // Default to dev if process is not available

export const disableSWNav = isDev || isCredentialless;