import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react({
      // Use SWC fast-refresh (already default in @vitejs/plugin-react ≥4)
      babel: {
        plugins: [
          // Remove PropTypes in production (saves ~5KB)
          ...(process.env.NODE_ENV === 'production'
            ? [['babel-plugin-transform-react-remove-prop-types', { removeImport: true }]]
            : []),
        ],
      },
    }),

    // Gzip — served by Hostinger/Nginx automatically
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // only compress files > 1KB
      deleteOriginFile: false,
    }),

    // Brotli — smaller than gzip, supported by all modern browsers
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],

  build: {
    // Terser minification (tree-shakes dead code + strips logs)
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        passes: 2,           // second pass finds more to compress
        unsafe_arrows: true, // safe for modern browsers
        unsafe_methods: true,
      },
      mangle: { safari10: true },
      format: { comments: false }, // strip all comments from output
    },

    rollupOptions: {
      output: {
        // Granular vendor splitting for long-lived cache hits
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // React core — changes least often, cache forever
          if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react';

          // Router — small, stable
          if (id.includes('react-router')) return 'vendor-router';

          // Framer Motion — large (~140KB), only loaded on public pages
          if (id.includes('framer-motion')) return 'vendor-motion';

          // Lucide icons — medium (~50KB), separate chunk
          if (id.includes('lucide-react')) return 'vendor-icons';

          // Network libs — loaded on dashboard only
          if (id.includes('socket.io-client') || id.includes('axios')) return 'vendor-network';

          // Form libs
          if (id.includes('@formspree') || id.includes('react-hot-toast')) return 'vendor-forms';

          // Helmet
          if (id.includes('react-helmet')) return 'vendor-seo';

          // Everything else
          return 'vendor-misc';
        },

        // Predictable, cache-friendly filenames
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(name ?? ''))
            return 'assets/img/[name]-[hash][extname]';
          if (/\.(woff2?|eot|ttf|otf)$/i.test(name ?? ''))
            return 'assets/fonts/[name]-[hash][extname]';
          if (/\.css$/i.test(name ?? ''))
            return 'assets/css/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },

    // Inline assets < 4KB as base64 (saves HTTP requests for small icons)
    assetsInlineLimit: 4096,

    // Split CSS per chunk (dashboard CSS not loaded on public pages)
    cssCodeSplit: true,

    // No sourcemaps in prod (reduces bundle by ~30%)
    sourcemap: false,

    // Raise warning threshold — we're splitting intentionally
    chunkSizeWarningLimit: 600,

    // Target modern browsers — avoids legacy polyfill bloat
    target: ['es2020', 'chrome90', 'firefox88', 'safari14'],
  },

  // Dev server
  server: {
    open: false, // don't auto-open (saves startup time)
    hmr: { overlay: true },
  },

  // Optimize pre-bundled dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'axios',
      'socket.io-client', // Must be pre-bundled: depends on CJS 'debug' pkg which needs ESM conversion
    ],
  },
})
