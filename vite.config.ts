
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Simplified config to avoid build timeouts
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Fix MIME type for TypeScript/JSX files
    middlewareMode: false,
    fs: {
      strict: false
    }
  },
  // Add explicit MIME type configuration
  assetsInclude: ['**/*.tsx', '**/*.ts'],
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimized build config for performance
    sourcemap: false,
    minify: 'esbuild',
    target: ['es2020'],
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ui-components': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'routing': ['react-router-dom'],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod']
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
  // Basic dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
