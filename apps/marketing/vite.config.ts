import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// Monorepo: bu yollar apps/marketing'den ../../packages/*'a gider
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@packages/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@packages/supabase-client': path.resolve(__dirname, '../../packages/supabase-client/src'),
      '@consulting19/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
});