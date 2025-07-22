import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize asset handling for better caching and mobile performance
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Generate content-based hashes for cache busting
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
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
        entryFileNames: 'assets/js/[name]-[hash].js',
        // Aggressive code splitting for mobile optimization
        manualChunks: {
          // React core
          'react-core': ['react', 'react-dom'],
          // Router
          'router': ['react-router-dom'],
          // UI components (split by usage)
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'ui-form': ['@radix-ui/react-checkbox', '@radix-ui/react-radio-group', '@radix-ui/react-select'],
          // Icons
          'icons': ['lucide-react'],
          // Utilities
          'utils': ['clsx', 'class-variance-authority', 'tailwind-merge'],
          // Forms
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          // Supabase
          'supabase': ['@supabase/supabase-js'],
          // Analytics
          'analytics': ['@tanstack/react-query']
        }
      },
      // Aggressive tree-shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
      // External dependencies for CDN loading
      external: (id) => {
        // Externalize large libraries that can be loaded from CDN
        return false; // Keep all for now, but can externalize later
      }
    },
    // Enable asset inlining for small files (mobile optimization)
    assetsInlineLimit: 2048, // Reduced from 4096 for mobile
    // Optimize chunk splitting for better caching and mobile loading
    cssCodeSplit: true,
    sourcemap: false, // Disable in production for smaller bundles
    // Aggressive minification
    minify: 'esbuild',
    target: ['es2020'],
    // Additional optimizations
    reportCompressedSize: false, // Faster builds
    chunkSizeWarningLimit: 1000, // Warn for chunks over 1MB
  },
  // Optimize dependencies for better caching and tree-shaking
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Force optimized dependencies
    force: true,
    // Include commonly used dependencies for faster dev builds
    entries: ['./src/main.tsx'],
  },
  // Enable tree-shaking for better bundle size
  define: {
    // Remove console.log in production (only in production mode)
    ...(mode === 'production' ? {
      'console.log': '(() => {})',
      'console.warn': '(() => {})',
    } : {}),
  },
}));