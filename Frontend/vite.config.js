import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Split vendor libraries into a separate chunk
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // This will create a 'vendor' chunk for all node_modules libraries
            return 'vendor';
          }
        },
      },
    },
    // Increase chunk size limit if necessary
    chunkSizeWarningLimit: 1000, // 1MB for example (default is 500KB)
  },
})
