import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/': {
        target: 'https://admin-sideclient.vercel.app',  // Proxy all requests to the Vercel app
        changeOrigin: true,  // Ensure proper origin headers
        rewrite: (path) => path,  // Preserve the full path from the client-side
      },
    },
  },
});
