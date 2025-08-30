import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Default port, can be overridden via CLI
    host: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});