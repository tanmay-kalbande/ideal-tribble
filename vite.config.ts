import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'K_', // Short prefix for clean env var names
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
