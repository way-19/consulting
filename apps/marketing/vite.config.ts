import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'react', 'react-dom'],
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
});