// apps/marketing/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // StackBlitz ortamına özel mutlak yol denemesi
      // Bu yol, StackBlitz projenizin kök dizinine göre belirlenmiştir.
      '@consulting19/shared': '/home/projects/github-5dhzdupp/packages/shared/src/index.ts',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true,
  },
});
