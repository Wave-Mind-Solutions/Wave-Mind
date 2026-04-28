import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  build: {
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // Remove console.log in production
        drop_debugger: true,   // Remove debugger statements
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('axios') || id.includes('socket.io-client')) return 'vendor-network';
            return 'vendor-others';
          }
        },
      },
    },
    // Asset optimization
    assetsInlineLimit: 4096,   // Inline small assets (<4KB) as base64
    cssCodeSplit: true,         // CSS code splitting per chunk
    sourcemap: false,           // No sourcemaps in production
    chunkSizeWarningLimit: 1000,
  },
  // Dev server performance
  server: {
    open: true,
  },
})
