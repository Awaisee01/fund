// Critical performance optimizations for bundle size reduction
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
    // Enhanced optimization for Lighthouse score
    target: ['es2020'],
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        unused: true,
        dead_code: true,
        // Remove unused imports
        side_effects: false,
        // Optimize loops and conditionals
        loops: true,
        conditionals: true,
        // Remove redundant code
        collapse_vars: true,
        reduce_vars: true
      },
      mangle: {
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Stricter limit for better performance
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Aggressive chunk splitting for optimal caching
        manualChunks: {
          // Core React - always needed
          'react-vendor': ['react', 'react-dom'],
          
          // Router - needed for navigation
          'router': ['react-router-dom'],
          
          // UI framework - lazy loaded
          'ui-framework': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
            '@radix-ui/react-alert-dialog'
          ],
          
          // Forms - lazy loaded
          'forms-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Utilities - lazy loaded
          'utils-vendor': ['lodash', 'date-fns', 'clsx', 'class-variance-authority'],
          
          // Supabase - lazy loaded
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // Admin features - completely separate
          'admin-vendor': ['papaparse', 'qrcode', 'recharts'],
          
          // Icons - lazy loaded
          'icons-vendor': ['lucide-react']
        },
        
        // Optimized asset naming
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[name]-[hash][extname]`;
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/styles/[name]-[hash][extname]`;
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
    include: [
      'react', 
      'react-dom',
      'react-router-dom'
    ],
    exclude: [
      // Exclude heavy dependencies from optimization
      '@radix-ui/react-icons',
      'papaparse',
      'qrcode',
      'recharts',
      'lodash',
      '@supabase/supabase-js'
    ]
  },
  
  // Performance hints
  define: {
    // Enable tree shaking for production
    'process.env.NODE_ENV': JSON.stringify(mode),
    __DEV__: mode === 'development'
  }
}));