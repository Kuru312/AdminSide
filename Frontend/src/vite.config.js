import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/': {
        target: 'https://admin-sideclient.vercel.app',  // Proxy to the Vercel app
        changeOrigin: true,  // Ensure the origin header matches the target
        secure: true,  // If the target server is using HTTPS, ensure SSL is validated
        rewrite: (path) => path,  // Keep the path intact
      },
    },
  },
});
