
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from "vite-plugin-compression";
import { VitePWA } from "vite-plugin-pwa";

// Simplified config to avoid build timeouts
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Fix MIME type issues for TypeScript modules
    middlewareMode: false,
    headers: {
      'Cache-Control': 'no-store'
    }
  },
  preview: {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },
  // Ensure proper MIME types for TypeScript/JSX files
  assetsInclude: [],
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Enable Brotli and GZIP compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
    }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
    // PWA for better caching
    VitePWA({
      registerType: 'prompt',
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        globIgnores: [
          '**/lovable-uploads/**/*.{png,jpg,jpeg}', // Exclude large images
          '**/node_modules/**/*'
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /\/lovable-uploads\/.*\.(webp|png|jpg|jpeg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enhanced build config for optimal performance
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1500,
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline small assets
    // Enable tree-shaking
    rollupOptions: {
      treeshake: {
        moduleSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      output: {
        manualChunks: (id) => {
          // Dynamic chunking based on file patterns
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-core';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-components';
            }
            if (id.includes('react-router')) {
              return 'routing';
            }
            if (id.includes('react-hook-form') || id.includes('zod')) {
              return 'forms';
            }
            if (id.includes('clsx') || id.includes('tailwind')) {
              return 'utils';
            }
            return 'vendor';
          }
          
          // Split by page components
          if (id.includes('/pages/')) {
            return 'pages';
          }
          if (id.includes('/components/admin/')) {
            return 'admin';
          }
        },
        // Optimize asset naming for better caching
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name]-[hash][extname]`;
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  // Enhanced dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', '@radix-ui/react-dialog'],
  },
}));
