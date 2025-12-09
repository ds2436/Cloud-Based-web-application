import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // OneDrive can block writes under the project; redirect Vite cache to a temp dir.
  cacheDir: process.env.VITE_CACHE_DIR || 'C:/Temp/vite-cache',
  server: {
    port: 5173,
  },
});

