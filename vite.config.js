import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),

    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress' })
  ],

  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },

    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split heavy eager deps into a vendor chunk; lazy-only deps (axios, socket.io,
          // stripe) stay with the lazy pages that import them instead of loading up front.
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion'
            if (id.includes('react-dom') || id.includes('react-router') || id.includes('@remix-run') || id.includes('/react/') || id.includes('scheduler')) return 'vendor'
          }
        }
      }
    }
  }
})