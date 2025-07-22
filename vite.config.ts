
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Simplified config to avoid build timeouts
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
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
    // Simplified build config to prevent timeouts
    sourcemap: false,
    minify: 'esbuild',
    target: ['es2020'],
    chunkSizeWarningLimit: 2000,
    // Basic rollup options without aggressive optimizations
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'supabase': ['@supabase/supabase-js'],
        }
      }
    }
  },
  // Basic dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
