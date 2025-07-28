
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import viteCompression from 'vite-plugin-compression';

// Ultra-optimized config for 100% Lighthouse score
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
    headers: {
      'Cache-Control': 'no-store'
    }
  },
  preview: {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Encoding': 'gzip'
    }
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Only use compression in production to avoid preview issues
    mode === 'production' && viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ultra-optimized build for 100% Lighthouse score
    sourcemap: false,
    minify: 'esbuild',
    target: ['es2022', 'edge88', 'firefox88', 'chrome88', 'safari14'],
    chunkSizeWarningLimit: 300, // Ultra-small chunks for maximum performance
    cssCodeSplit: true,
    assetsInlineLimit: 512, // Tiny inline limit to reduce bundle size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Ultra-aggressive chunk splitting for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            if (id.includes('@radix-ui')) {
              return 'ui';
            }
            if (id.includes('supabase')) {
              return 'supabase';
            }
            return 'vendor';
          }
          if (id.includes('src/components')) {
            return 'components';
          }
          if (id.includes('src/pages')) {
            return 'pages';
          }
        },
        // Ultra-optimized for caching and performance
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name].[hash][extname]`;
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `img/[name].[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name].[hash][extname]`;
          }
          return `assets/[name].[hash][extname]`;
        },
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js'
      }
    },
    // Maximum optimization for modern browsers
    polyfillModulePreload: false,
    modulePreload: {
      polyfill: false
    },
    reportCompressedSize: false
  },
  // Enhanced dependency optimization for 100% score
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js'],
    // Removed exclusion that was causing module errors
  },
}));
