
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
    // PERFORMANCE OPTIMIZED BUILD - Maximized for Lighthouse scores
    sourcemap: false, // Remove sourcemaps for faster loading
    minify: 'esbuild', // Fastest minifier
    target: ['es2020'], // Modern browsers for better optimization
    chunkSizeWarningLimit: 1000, // Smaller chunks for better caching
    cssCodeSplit: true, // Split CSS for better loading
    rollupOptions: {
      output: {
        // AGGRESSIVE code splitting for maximum performance
        manualChunks: (id) => {
          // Core React bundle - small and cacheable
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-core';
          }
          // Router bundle - separate for better caching
          if (id.includes('react-router')) {
            return 'router';
          }
          // UI components - split to reduce main bundle
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-libs';
          }
          // Supabase and analytics - defer loading
          if (id.includes('@supabase') || id.includes('@tanstack/react-query')) {
            return 'backend';
          }
          // Forms - separate for pages that need them
          if (id.includes('react-hook-form') || id.includes('zod')) {
            return 'forms';
          }
          // Third-party vendor code
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Page-specific bundles for code splitting
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
  // Remove problematic optimizeDeps to fix Supabase PostgREST import error
  // CSS optimization
  css: {
    devSourcemap: false,
    modules: false
  }
}));
