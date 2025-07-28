
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Simplified config to avoid build timeouts
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
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  },
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
    // Optimize for modern browsers and aggressive minification
    target: ['es2020'],
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        unused: true,
        dead_code: true
      },
      mangle: {
        properties: {
          regex: /^_/
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // More aggressive chunk splitting for better caching
        manualChunks: {
          'react-core': ['react', 'react-dom'],
          'routing': ['react-router-dom'],
          'ui-components': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-dropdown-menu'
          ],
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'utils': ['lodash', 'date-fns', 'clsx'],
          'supabase': ['@supabase/supabase-js'],
          'admin': ['papaparse', 'qrcode', 'recharts']
        },
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
  // Optimize dependencies for faster loading
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [
      '@radix-ui/react-icons',
      'papaparse',
      'qrcode',
      'recharts'
    ]
  },
}));
