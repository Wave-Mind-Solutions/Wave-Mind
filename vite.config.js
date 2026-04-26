import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'motion': ['framer-motion'],
          'icons': ['lucide-react'],
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
