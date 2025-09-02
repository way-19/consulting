import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@consulting19/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    port: 5177, // Changed from 5174 to avoid conflict with admin
    host: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});