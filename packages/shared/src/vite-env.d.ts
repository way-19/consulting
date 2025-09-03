/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Add other VITE_ prefixed environment variables used in your project here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
