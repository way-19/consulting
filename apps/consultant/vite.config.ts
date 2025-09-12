import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@consulting19/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  optimizeDeps: { exclude: ['lucide-react'] },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: process.env.HOST || '0.0.0.0',
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'd1215cd3-9403-432a-9c3f-3dce0d82082f.preview.emergentagent.com',
      '.emergentagent.com'
    ]
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: process.env.HOST || '0.0.0.0',
    strictPort: false,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'd1215cd3-9403-432a-9c3f-3dce0d82082f.preview.emergentagent.com',
      '.emergentagent.com'
    ]
  },
});