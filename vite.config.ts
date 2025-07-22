
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import compression from 'vite-plugin-compression';

// High-performance config optimized for Lighthouse scores
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Brotli compression for better performance
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false
    }),
    // Gzip fallback
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Performance optimized build
    sourcemap: false,
    minify: 'esbuild',
    target: ['es2020'],
    chunkSizeWarningLimit: 1500,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Aggressive code splitting for better caching
        manualChunks: (id) => {
          // React core bundle
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-core';
          }
          // Router bundle
          if (id.includes('react-router')) {
            return 'router';
          }
          // Forms bundle
          if (id.includes('react-hook-form') || id.includes('zod') || id.includes('@hookform')) {
            return 'forms';
          }
          // UI components bundle
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-components';
          }
          // Supabase bundle
          if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
            return 'supabase';
          }
          // Third-party libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Page components
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1]?.split('.')[0];
            return `page-${pageName}`;
          }
        },
        // Optimize asset naming for better caching
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name]-[hash][extname]`;
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  // Fixed dependency optimization to prevent import errors
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-select',
      'lucide-react'
    ],
    exclude: ['@supabase/supabase-js']
  },
  // CSS optimization
  css: {
    devSourcemap: false,
    modules: false
  }
}));
