
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ultra-aggressive optimization for mobile
    sourcemap: false,
    minify: 'esbuild',
    target: ['es2022'],
    chunkSizeWarningLimit: 200,
    cssCodeSplit: false, // Inline all CSS
    assetsInlineLimit: 2048,
    rollupOptions: {
      treeshake: {
        preset: 'smallest',
        pureExternalModules: true,
        propertyReadSideEffects: false,
        moduleSideEffects: false
      },
      output: {
        // Minimize chunks - only essential splitting
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom']
        },
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
        // Remove unused exports
        exports: 'named',
        compact: true
      },
      external: []
    },
    polyfillModulePreload: false,
    modulePreload: false,
    reportCompressedSize: false
  },
  // Minimal dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@tanstack/react-query', '@supabase/supabase-js']
  },
  esbuild: {
    drop: ['console', 'debugger'],
    treeShaking: true
  },
}));
